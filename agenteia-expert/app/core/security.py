from __future__ import annotations

import hmac


def secrets_match(candidate: str, expected: str) -> bool:
    if not candidate or not expected:
        return False
    return hmac.compare_digest(candidate.encode(), expected.encode())
