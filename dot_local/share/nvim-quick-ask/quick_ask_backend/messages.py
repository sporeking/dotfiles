"""Project native messages to the small public protocol; never expose thinking."""

from .pi import public_error

PREVIEW_LIMIT = 12000


def text_content(content):
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    return "".join(part["text"] for part in content
                   if isinstance(part, dict) and part.get("type") == "text"
                   and isinstance(part.get("text"), str))


def visible_text(message):
    if message.get("role") == "assistant" and message.get("stopReason") == "error":
        return public_error(message)
    return text_content(message.get("content"))


def public_messages(messages):
    """Keep native order, with one tool row per call, updated by its result."""
    result, calls = [], {}
    for message in messages:
        if not isinstance(message, dict):
            continue
        role = message.get("role")
        if role in ("user", "assistant"):
            text = visible_text(message)
            if text:
                result.append({"role": role, "text": text})
            content = message.get("content")
            if role == "assistant" and isinstance(content, list):
                for part in content:
                    if not isinstance(part, dict) or part.get("type") != "toolCall":
                        continue
                    row = {"role": "tool", "tool_call_id": str(part.get("id", "")),
                           "name": str(part.get("name", "tool")), "text": ""}
                    if isinstance(part.get("arguments"), dict):
                        row["args"] = part["arguments"]
                    calls[row["tool_call_id"]] = row
                    result.append(row)
        elif role == "toolResult":
            call_id = str(message.get("toolCallId", ""))
            row = calls.get(call_id)
            if row is None:
                row = {"role": "tool", "tool_call_id": call_id,
                       "name": str(message.get("toolName", "tool"))}
                result.append(row)
                calls[call_id] = row
            row.update(text=text_content(message.get("content"))[:PREVIEW_LIMIT],
                       is_error=bool(message.get("isError")))
    return result
