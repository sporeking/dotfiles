"""Youdao jsonapi lexical lookup, with exact headword verification.

No word-count heuristic: long idioms/proverbs remain dictionary candidates. The
service's machine-translation, web snippets and spelling suggestions are never
accepted as lexical definitions for a different input.
"""

import html
import json
import re
import unicodedata
from urllib.parse import urlencode

from .errors import BackendError
from .http import request_json

DICTIONARY_URL = "https://dict.youdao.com/jsonapi"
_POS = re.compile(r"^((?:(?:n|v|vt|vi|adj|adv|prep|pron|conj|interj|int|num|art|aux|det|abbr)\.(?:\s*[/&]\s*)?)+)\s*", re.I)
_MARKUP = re.compile(r"</?(?:b|i|em|strong|span)(?:\s[^>]*)?>|<br\s*/?>", re.I)


def normalize_text(text):
    return " ".join(text.split())


def _headword(text):
    text = unicodedata.normalize("NFKC", text).casefold().replace("’", "'")
    return normalize_text(text).strip(" .,!?:;\"'“”‘’。！？；：")


def _clean(text):
    # Do not strip dictionary qualifiers such as <非正式> or <英，旧>.
    return html.unescape(_MARKUP.sub("", text)).strip()


def _strings(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [item for item in value if isinstance(item, str)]
    return []


def _list(value):
    return value if isinstance(value, list) else []


def _example(en, zh):
    if isinstance(en, str) and isinstance(zh, str) and en.strip() and zh.strip():
        return {"en": _clean(en), "zh": _clean(zh), "source": "dictionary"}
    return None


def parse_dictionary(data, text, *, examples=True):
    """Return a complete result or None for a genuine miss; raise on bad data."""
    if not isinstance(data, dict):
        raise BackendError("有道词典返回了异常数据结构，请稍后重试。")
    ec = data.get("ec")
    if ec is None:
        if not any(key in data for key in ("input", "meta", "lang", "le")):
            raise BackendError("有道词典返回了异常数据，无法判断是否命中，请稍后重试。")
        return None
    if not isinstance(ec, dict) or not isinstance(ec.get("word"), list):
        raise BackendError("有道词典词条格式异常，请稍后重试。")
    meanings = []
    example_rows = []
    phonetics = {"us": "", "uk": ""}
    for word in ec["word"]:
        if not isinstance(word, dict):
            raise BackendError("有道词典词条格式异常，请稍后重试。")
        phrase = word.get("return-phrase", {})
        phrase = phrase.get("l", {}).get("i", "") if isinstance(phrase, dict) else ""
        if not any(_headword(candidate) == _headword(text) for candidate in _strings(phrase)):
            continue
        for accent, field in (("us", "usphone"), ("uk", "ukphone")):
            if isinstance(word.get(field), str) and not phonetics[accent]:
                phonetics[accent] = word[field]
        if not isinstance(word.get("trs"), list):
            raise BackendError("有道词典释义格式异常，请稍后重试。")
        for group in word["trs"]:
            if not isinstance(group, dict):
                continue
            for tr in _list(group.get("tr")):
                if not isinstance(tr, dict) or not isinstance(tr.get("l"), dict):
                    continue
                lexical = tr["l"]
                for definition in _strings(lexical.get("i")):
                    definition = _clean(definition)
                    if not definition:
                        continue
                    match = _POS.match(definition)
                    pos = match.group(1).strip() if match else ""
                    definition = definition[match.end():] if match else definition
                    if definition:
                        if meanings and meanings[-1]["pos"] == pos:
                            meanings[-1]["definitions"].append(definition)
                        else:
                            meanings.append({"pos": pos, "definitions": [definition]})
                if examples:
                    for pair in _list(lexical.get("sentence")):
                        if isinstance(pair, dict):
                            row = _example(pair.get("en") or pair.get("enShow"), pair.get("zh"))
                            if row and row not in example_rows:
                                example_rows.append(row)
    if not meanings:
        return None
    if examples:
        bilingual = data.get("blng_sents_part", {})
        if isinstance(bilingual, dict):
            for pair in _list(bilingual.get("sentence-pair")):
                if isinstance(pair, dict):
                    row = _example(pair.get("sentence") or pair.get("sentence-eng"), pair.get("sentence-translation"))
                    if row and row not in example_rows:
                        example_rows.append(row)
    return {
        "kind": "dictionary", "source": "Youdao", "translation": "",
        "phonetics": phonetics, "meanings": meanings, "examples": example_rows,
        "audio": {
            accent: "https://dict.youdao.com/dictvoice?" + urlencode({"audio": text, "type": number})
            for accent, number in (("us", 2), ("uk", 1))
        },
    }


def lookup_dictionary(text, *, timeout=8, examples=True):
    dictionaries = [["ec"]]
    if examples:
        dictionaries.append(["blng_sents_part"])
    url = DICTIONARY_URL + "?" + urlencode({
        "q": text, "dicts": json.dumps({"count": 20, "dicts": dictionaries}),
    })
    data = request_json(url, timeout=timeout, service="有道词典")
    return parse_dictionary(data, text, examples=examples)


def clearly_sentence(text):
    """Only obvious terminal punctuation bypasses lookup, never phrase length.

    A lone word/abbreviation is still a dictionary candidate. A complete sentence
    without punctuation falls through lexical lookup and then to the LLM on miss.
    """
    text = text.rstrip('"\'”’)]}')
    return bool(re.search(r"\s", text) and re.search(r"[.!?。！？]$", text))
