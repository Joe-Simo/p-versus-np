# U65 — Five rows are enough for topology to create a genuine feasibility obstruction

Date: 2026-09-16. Status: explicit sharp counterexample to U64 beyond four rows, with an analytic proof and complete enumeration of the 256 gate-type pairs. No NP-hardness, counting hardness, P-versus-NP resolution, or novelty claim.

## 1. Five fixed sample rows

Use three fixed leaf columns

    P  = (0,0,0,1,1)
    Q1 = (0,0,1,0,0)
    Q2 = (0,1,0,0,1)

and target

    T  = (0,0,1,0,1).

The five row triples `(P,Q1,Q2)` are

    000, 001, 010, 100, 101,

so all five sample rows are distinguished by the reachable fixed leaves. A naive extension of U64's reachable-information criterion would therefore predict every binary target to be feasible.

## 2. A two-gate topology where T is impossible

Take

    h = f(Q1,Q2)
    o = g(P,h),

with both `f` and `g` allowed to be arbitrary B2 tables.

The observed `(Q1,Q2)` pairs on the five rows are

    00, 01, 10, 00, 01.

Therefore every possible `h` has the form

    (a,b,c,a,b)

for bits `a,b,c`.

For the output to equal `T`, the rows impose

    g(0,a)=0,   g(0,b)=0,   g(0,c)=1,
    g(1,a)=0,   g(1,b)=1.

If `a=b`, the last two constraints conflict. Hence `a!=b`, so `{a,b}={0,1}`. But then `g(0,a)=g(0,b)=0` fixes both `g(0,0)` and `g(0,1)` to zero, contradicting `g(0,c)=1` for either possible `c`.

Thus no gate assignment realizes `T`.

Complete literal enumeration confirms **0 of 256** ordered type pairs fit.

## 3. The obstruction is the grouping, not insufficient leaf information

Regroup the same three leaves as

    h' = NAND(P,Q2)
    o' = (NOT h') OR Q1.

On the five rows,

    h' = (1,1,1,1,0)

and the output is exactly

    o' = (0,0,1,0,1) = T.

The executable enumeration finds four ordered B2 type pairs for this alternate topology. One explicit table encoding is `(7,11)` under the project's low-bit order `00,01,10,11`.

Therefore the same fully distinguishing fixed leaves and the same two-gate budget can be feasible or infeasible solely because of how the information is bottlenecked by the topology.

## 4. Why the four-row proof stops exactly here

The failed five-row instance corresponds to two information partitions

    P-partition = (0,0,0,1,1)
    Q-partition = (0,1,2,0,1)

whose common refinement is discrete, together with target partition

    T-partition = (0,0,1,0,1).

There is no one-bit summary of the P-partition and one-bit summary of the Q-partition whose pair determines T. The right subtree can expose only one such binary summary to the root, which is precisely the bottleneck above.

For at most four sample rows, U64's four-edge graph lemma proves such summaries always exist. At five rows this explicit pattern is the first obstruction required for sharpness.

## 5. The reachable partition does not determine counts even on four rows

The U64 criterion is deliberately only about feasibility. A bounded exact example shows that no exact-count analogue follows from the same summary.

On four rows take two fixed leaves

    A = (0,0,1,1),   B = (0,1,0,1)

and target

    Y = (0,1,1,0).

The pair `(A,B)` distinguishes all four rows. Compare two two-gate topologies with the same reachable fixed leaves and the same gate budget:

    Topology A: h=f(A,B),   o=g(h,h)
    Topology B: h=f(A,B),   o=g(A,h).

Literal enumeration of all 256 ordered `(f,g)` pairs gives respectively **8** and **4** compatible descriptions. Both are feasible, both expose the same full four-row leaf information, and both use two gates, yet their completion counts differ.

So the U64 partition criterion is sufficient for exact zero detection but is not a sufficient statistic for counting. Any four-row FPRAS still has to account for topology-dependent multiplicities and correlations.

## 6. Consequence for the current route

Four-row whole-gate-prefix zero detection is genuinely special. A growing-example anti-checker cannot rely on the same topology-oblivious criterion once five or more labeled rows are present.

The example proves only a feasibility threshold for this method. It does not establish that five-row consistency is NP-hard, that approximate counting is hard, or that a four-row FPRAS exists.
