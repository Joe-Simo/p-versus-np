# U35 — Direct P != NP magnification target from the authenticated source: parameterized Vertex Cover time-space lower bound

Date: 2026-09-14
Status: source-derived target extraction and feasibility audit; no P versus NP resolution.

## 1. Why pivot

U34 corrected the Gap-MCSP target: its displayed formula magnification theorem gives NP formula lower bounds, not P != NP directly. The same authenticated FOCS 2018 source contains a theorem whose conclusion is exactly P != NP.

## 2. Source theorem

Theorem 8 of Oliveira–Santhanam (FOCS 2018) states:

Let k(n)=n^{o(1)}. If there exists epsilon>0 such that k-Vertex-Cover is not in

    DTISP[m^{1+epsilon}, m^{o(1)}],

where the input is an n-vertex graph represented by an adjacency matrix of bit length m=Theta(n^2), then

    P != NP.

This is a direct magnification route to the project objective.

## 3. Exact target contract

We would need an unconditional lower bound against random-access algorithms that simultaneously use:

- time O(m^{1+epsilon}) for some fixed epsilon>0;
- space m^{o(1)};
- on adjacency-matrix encoded n-vertex graphs;
- for a fixed parameter function k(n)=n^{o(1)} in the theorem’s intended regime.

The encoding and parameter regime are load-bearing. Existing time-space lower bounds for ordinary Vertex Cover mentioned by the source use a different edge-list encoding and k much closer to n, so they cannot simply be substituted.

## 4. Why this target may be more actionable

Unlike unrestricted general-circuit lower bounds, time-space tradeoffs are an area with unconditional techniques. The source explicitly notes an unconditional Vertex Cover lower bound around DTISP[m^{1.8},m^{o(1)}] in another encoding/regime. Thus the gap is not 'invent the first time-space lower bound'; it is transfer/derive one in the precise adjacency-matrix and small-k regime.

## 5. First obstruction: input-reading arguments are too weak

An adjacency matrix has m=Theta(n^2) bits. Any deterministic algorithm may not need to read all m bits on every input, and a trivial information argument can give at most Omega(m) query/time lower bounds. The magnification premise needs m^{1+epsilon}, genuinely superlinear time under subpolynomial space. Therefore a simple adversary saying 'every edge bit matters' is insufficient.

A useful proof must exploit repeated access/memory bottlenecks, not merely input sensitivity.

## 6. Candidate proof mechanisms

Potential time-space techniques include branching-program lower bounds, communication across computation cuts, and reductions from problems with known time-space tradeoffs. But any reduction must preserve:

1. adjacency-matrix representation;
2. k=n^{o(1)};
3. near-linear input blowup tightly enough that a source lower bound transfers to m^{1+epsilon};
4. random-access model assumptions.

A polynomial blowup can destroy the exponent needed for magnification.

## 7. Next bounded research task

Search primary literature for the exact Vertex Cover time-space lower bound cited by Oliveira–Santhanam (their refs. Fortnow–Lipton–van Melkebeek–Viglas 2005 and Williams 2007), extract the hard source problem, encoding, exponents, and reduction. Then determine whether an adjacency-matrix/small-k padding or kernelization-compatible reduction can preserve a superlinear exponent.

This is currently the most direct authenticated magnification route in the project whose stated conclusion is P != NP.

No statement here resolves P versus NP.