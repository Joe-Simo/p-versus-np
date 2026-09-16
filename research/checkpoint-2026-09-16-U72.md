# P versus NP — checkpoint after U72

Date: 2026-09-16. **We have not solved P versus NP yet.**

Continued from confirmed U71 head `d46ec2a5c5741e29451873d5b1bafd59e359a348`. Existing work was preserved.

U72 tests U71's topological sequential-conditioning proposal. In the minimal multiplicative recurrence where each independent layer produces a local importance multiplier 2 or 1/2 with equal probability, depth m has `W_m=2^(2K-m)`, `K~Binomial(m,1/2)`, and exact relative variance

`CV^2(W_m)=(34/25)^m-1`.

Therefore bounded local rank ratios alone cannot guarantee polynomial-sample importance correction: product weights can have exponential relative variance. Wolfram 15.0.1 independently evaluated m=1..12 and symbolically returned the same closed form.

This is deliberately method-specific. The current note has **not yet embedded this recurrence into an actual four-row B2 fixed-certificate topology**. It does not establish approximation hardness, a general circuit lower bound, or P != NP.

Next executable step: build or rule out the B2 recursive realization, enumerate bounded depths exactly, and if the variance phenomenon survives, test whether carrying the full 4-row side-column state repairs it or merely moves the cost into a growing live frontier.