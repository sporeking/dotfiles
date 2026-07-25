import tempfile
import unittest
from pathlib import Path

from launcher_core import (
    AppRecord,
    LauncherStateError,
    favorite_records,
    load_favorites,
    save_favorites,
    search_records,
    validate_favorites,
)


class FavoritesTest(unittest.TestCase):
    def test_missing_state_is_an_empty_favorites_list(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "favorites.json"
            self.assertEqual(load_favorites(path, {"code.desktop"}), [])

    def test_state_round_trip_preserves_order(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "favorites.json"
            save_favorites(
                path,
                ["code.desktop", "firefox.desktop"],
                {"code.desktop", "firefox.desktop"},
            )
            self.assertEqual(
                load_favorites(
                    path,
                    {"code.desktop", "firefox.desktop"},
                ),
                ["code.desktop", "firefox.desktop"],
            )

    def test_duplicate_ids_are_rejected(self):
        with self.assertRaises(LauncherStateError):
            validate_favorites(
                {"version": 1, "favorites": ["code.desktop", "code.desktop"]},
                {"code.desktop"},
            )

    def test_unknown_ids_are_rejected(self):
        with self.assertRaises(LauncherStateError):
            validate_favorites(
                {"version": 1, "favorites": ["missing.desktop"]},
                {"code.desktop"},
            )

    def test_invalid_json_is_rejected_without_repair(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "favorites.json"
            path.write_text("{not-json", encoding="utf-8")
            with self.assertRaises(LauncherStateError):
                load_favorites(path, {"code.desktop"})
            self.assertEqual(path.read_text(encoding="utf-8"), "{not-json")

    def test_invalid_payload_shape_is_rejected(self):
        with self.assertRaises(LauncherStateError):
            validate_favorites({"version": 2, "favorites": []}, set())
        with self.assertRaises(LauncherStateError):
            validate_favorites({"version": 1, "favorites": "code.desktop"}, set())


class SearchTest(unittest.TestCase):
    def setUp(self):
        self.records = [
            AppRecord("code.desktop", "Visual Studio Code", "Code editor"),
            AppRecord("com.qq.weixin.desktop", "微信", "即时通讯"),
            AppRecord("firefox.desktop", "Firefox", "Web Browser"),
        ]

    def test_search_matches_name_generic_name_and_id(self):
        self.assertEqual(
            [record.desktop_id for record in search_records(self.records, "studio")],
            ["code.desktop"],
        )
        self.assertEqual(
            [record.desktop_id for record in search_records(self.records, "即时")],
            ["com.qq.weixin.desktop"],
        )
        self.assertEqual(
            [record.desktop_id for record in search_records(self.records, "FIREFOX")],
            ["firefox.desktop"],
        )

    def test_empty_search_returns_the_original_order(self):
        self.assertEqual(search_records(self.records, "  "), self.records)

    def test_favorite_records_preserve_persisted_order(self):
        self.assertEqual(
            [record.desktop_id for record in favorite_records(
                self.records,
                ["firefox.desktop", "code.desktop"],
            )],
            ["firefox.desktop", "code.desktop"],
        )

    def test_favorite_records_reject_unknown_id(self):
        with self.assertRaises(LauncherStateError):
            favorite_records(self.records, ["missing.desktop"])


if __name__ == "__main__":
    unittest.main()
