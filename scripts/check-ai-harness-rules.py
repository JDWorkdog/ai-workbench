#!/usr/bin/env python3
"""Check durable AI harness prose for mechanical workspace rules."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Iterable, List


TEXT_SUFFIXES = {".json", ".md", ".toml", ".txt", ".yaml", ".yml"}
FORBIDDEN_CHARACTERS = {"\u2013": "en dash", "\u2014": "em dash"}


def iter_files(path: Path) -> Iterable[Path]:
    if path.is_file():
        yield path
        return

    if path.is_dir():
        for candidate in sorted(path.rglob("*")):
            if candidate.is_file() and candidate.suffix.lower() in TEXT_SUFFIXES:
                yield candidate


def display_path(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def check_file(path: Path, root: Path) -> List[str]:
    problems: List[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        return [f"{display_path(path, root)}: could not read text: {exc}"]

    for line_number, line in enumerate(text.splitlines(), start=1):
        for character, label in FORBIDDEN_CHARACTERS.items():
            if character in line:
                problems.append(
                    f"{display_path(path, root)}:{line_number}: prohibited {label}"
                )

    return problems


def main(argv: List[str]) -> int:
    root = Path(__file__).resolve().parent.parent
    requested = argv[1:] or ["AGENTS.md", "CLAUDE.md"]
    paths = [Path(item) if Path(item).is_absolute() else root / item for item in requested]

    files: List[Path] = []
    problems: List[str] = []
    for path in paths:
        if not path.exists():
            problems.append(f"{display_path(path, root)}: path does not exist")
            continue
        files.extend(iter_files(path))

    for path in sorted(set(files)):
        problems.extend(check_file(path, root))

    claude_path = root / "CLAUDE.md"
    if claude_path in files:
        claude_text = claude_path.read_text(encoding="utf-8")
        if "@AGENTS.md" not in {line.strip() for line in claude_text.splitlines()}:
            problems.append("CLAUDE.md: missing canonical @AGENTS.md import")

    if problems:
        for problem in problems:
            print(problem, file=sys.stderr)
        return 1

    print(f"AI harness rules passed for {len(set(files))} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
