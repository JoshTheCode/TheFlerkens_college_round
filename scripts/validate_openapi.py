"""Dependency-free structural validation for the committed OpenAPI contract."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SPEC_PATH = ROOT / "api" / "openapi.json"


def resolve_pointer(document: dict[str, Any], pointer: str) -> Any:
    if not pointer.startswith("#/"):
        raise ValueError(f"Only local references are allowed: {pointer}")
    value: Any = document
    for token in pointer[2:].split("/"):
        value = value[token.replace("~1", "/").replace("~0", "~")]
    return value


def walk(value: Any):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def main() -> None:
    document = json.loads(SPEC_PATH.read_text(encoding="utf-8"))
    assert document["openapi"].startswith("3.1.")
    assert document["info"]["version"] == "1.1.0"

    expected = {
        "getHealth",
        "getDefaultTarget",
        "listTargets",
        "getTarget",
        "startAttackRun",
        "getAttackRun",
        "getAttackTrace",
        "validateDefense",
        "getAttackLogs",
    }
    actual = {
        operation["operationId"]
        for path_item in document["paths"].values()
        for method, operation in path_item.items()
        if method in {"get", "post", "put", "patch", "delete"}
    }
    assert actual == expected

    for node in walk(document):
        if "$ref" in node:
            resolve_pointer(document, node["$ref"])

    print(
        f"Validated {SPEC_PATH.relative_to(ROOT)}: "
        f"{len(document['paths'])} paths, {len(actual)} operations, "
        f"{len(document['components']['schemas'])} schemas"
    )


if __name__ == "__main__":
    main()
