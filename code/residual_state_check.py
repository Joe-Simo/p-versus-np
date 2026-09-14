#!/usr/bin/env python3
"""Exact finite check for the residual-state lemma used in route A.

F_m = AND_i (x_i OR y_i). After assigning all x_i, canonical residuals
are conjunctions of exactly those y_i for which x_i=0.
The mathematical proof is direct; this script only checks bounded cases.
"""

from __future__ import annotations


def residual(mask: int, m: int) -> tuple[int, ...]:
    # bit i = 1 means x_i=True, so clause (x_i OR y_i) is satisfied.
    # bit i = 0 leaves unit clause y_i.
    return tuple(i for i in range(m) if ((mask >> i) & 1) == 0)


def check(m: int) -> tuple[int, int]:
    residuals = {residual(mask, m) for mask in range(1 << m)}
    return len(residuals), 1 << m


if __name__ == "__main__":
    for m in range(1, 19):
        observed, expected = check(m)
        assert observed == expected, (m, observed, expected)
        print(f"m={m:2d} residuals={observed:7d} expected={expected:7d} OK")
