# U31 — Gap-MCSP communication route: exact quantifier and lifting gap

Date: 2026-09-14
Status: structural reduction audit; no P versus NP resolution.

## 1. Target

U29 identified a hardness-magnification target: a slightly superlinear lower bound for an appropriate Gap-MCSP variant would imply major general circuit lower bounds. U30 showed that purely local techniques face the locality barrier. We now test whether communication complexity can capture the required global consistency.

## 2. Natural communication formulation

Let x in {0,1}^N be the truth table input to Gap-MCSP. Partition its N coordinates into Alice's set A and Bob's set B. Define the induced two-party communication problem

    G_A,B(x_A,x_B) = GapMCSP(x).

A deterministic communication protocol partitions the input matrix into monochromatic rectangles. Proving large communication complexity for G_A,B is therefore a genuine global-consistency statement across the partition.

## 3. Lemma U31.1 — a circuit gives a communication protocol only with potentially linear-in-size cost

Let C be a fan-in-2 Boolean circuit of size s computing a function f(x_A,x_B). There is a deterministic protocol of cost at most O(s): evaluate the circuit gate-by-gate in a fixed topological order, with the party that can determine an input bit providing it when needed and communicating gate values as necessary.

Thus a communication lower bound R implies at best a circuit lower bound s=Omega(R) by this generic simulation.

Since deterministic communication complexity of any Boolean function on an N-bit input partition is at most N (one party can send all of its at-most-N bits), this generic route cannot prove a circuit lower bound larger than Omega(N).

In particular it cannot directly reach the N^{1+epsilon} lower bound required by the magnification theorem.

## 4. Quantitative barrier

For every partition A,B,

    D^cc(G_A,B) <= min(|A|,|B|)+1 <= N/2+1

if the smaller side sends its entire input and the other side computes the function.

Therefore even the maximum possible deterministic communication lower bound is O(N). A desired N^{1+epsilon} circuit lower bound is superlinear in N.

Consequently, a plain reduction

    high communication complexity => high circuit size

with only constant-factor loss cannot reach the magnification threshold: the source measure itself is capped at O(N).

## 5. What lifting theorems can and cannot do automatically

Query-to-communication lifting theorems typically start from a hard query/search problem and compose it with a gadget to obtain a communication problem whose complexity reflects query complexity. This is powerful for formula, branching-program, proof-complexity, and related lower bounds.

But the hardness-magnification target is a lower bound for general Boolean circuits on the original Gap-MCSP input. A lifting theorem for a composed/gadgetized communication problem does not automatically give a superlinear lower bound for unrestricted circuits computing the original function.

To be useful here we would need an additional theorem translating the lifted communication lower bound into the exact general-circuit model with sufficiently favorable parameters. That bridge is the missing step, not something supplied by communication hardness alone.

## 6. Rectangle/fooling-set methods are therefore insufficient by themselves

Even a perfect fooling set yielding D^cc=Theta(N) would imply only a linear circuit lower bound under the generic simulation. Since U29 needs N^{1+epsilon}, improving the communication argument all the way to its information-theoretic maximum still misses the target asymptotically.

This rejects the naive communication route before spending effort constructing a sophisticated Gap-MCSP fooling set.

## 7. Important limitation

This does not show communication complexity is irrelevant to hardness magnification. More elaborate frameworks—multiparty communication, communication with special gadgets, monotone/Karchmer-Wigderson correspondences, proof complexity, or lifting into restricted circuit classes—can yield strong consequences. The result only says ordinary two-party communication complexity of the original N-bit Gap-MCSP function cannot, through the generic circuit-to-protocol simulation, establish a superlinear general-circuit lower bound.

## 8. Next route

Investigate Karchmer-Wigderson/search formulations, where communication depth corresponds to formula depth/size rather than arbitrary circuit size. Then explicitly test whether any known hardness-magnification theorem accepts a formula lower bound or whether this again stops at a restricted model. If it stops, return to meta-complexity properties that target general circuits more directly (natural proofs/useful properties, witness circuits, or constructive separations).

No statement here resolves P versus NP.