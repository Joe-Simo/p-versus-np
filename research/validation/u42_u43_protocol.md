# U42-U43 finite computation contract

These tests check constructive components, not P versus NP or arbitrary circuit lower bounds.

U42 constructs a fan-in-two Boolean DAG (AND, OR, XOR; NOT is XOR with 1), using two bitonic sorting networks and a carry propagation. It tests every truth table and every address tuple for the listed small (n,t) cases, including no requests, duplicate addresses, constant tables, n=0, and t>N. Packed bigint truth tables cover all inputs, not a random subset. A direct array-address oracle produces expected outputs independently of sorting. Comparator counts are checked against the exact two-network formula P*h*(h+1)/2.

U43 constructs a Boolean DAG that outputs a violating coordinate face for degree-at-most-d functions over GF(2). It tests every Boolean function on 1-4 variables for every 0<=d<n. An independent Mobius-transform oracle determines degree. Every returned certificate is checked for distinct points, odd input parity, and zero parity for each allowed monomial. Every nonzero support of a dual relation is enumerated to confirm minimum certificate size 2^(d+1). AND_n is deliberately checked as an easy general circuit rejected by the restricted-class criterion.

All universes are explicit. The test harness uses Number only for bounded indices/bit masks (at most 18 primary input bits, at most 16 locations for U43); large truth-table vectors use bigint. No floating-point comparison establishes a mathematical bound. No external solver, heuristic pruning, oracle gates, random sampling, or fabricated result data is used. Proofs in U42-U43 supply asymptotic conclusions separately.

Commands and actual output must be saved after execution. The existing U40-U41 files are not overwritten.

Follow-up before the second run: add an O(n*2^n+n^2)-gate constructor independent of d, using a Boolean Mobius transform, selection of d+1 variables in a nonzero high-degree coefficient, conditional differences along those variables, and a nonzero derivative location. Both circuit implementations are evaluated exhaustively on the same bounded universes; they may output different witnesses. The fast circuit's coefficient and derivative nonzeroness bits must agree. Additional n=6,8,10,12 builds only audit topology and gate counts, not all functions at those sizes.

Final targeted audit: enumerate every nonzero GF(2) linear functional on truth tables for n=1..4 and check that some squarefree monomial has odd pairing with it. Every such monomial is computed with at most n-1 AND gates (constants/input wires allowed). This tests the precisely scoped obstruction to universal linear identities for general small circuits, not a general circuit lower bound.
