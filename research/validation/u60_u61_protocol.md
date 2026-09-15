# U60-U61 execution contract

Question: replace separate pair estimates by a positive, shared-ancestry joint-label process; test whether three example rows admit an exact affine-gate replacement without making a claim for more rows.

Model: fixed acyclic topology; each gate has two ordered earlier predecessors (repetition allowed), one of all sixteen equally weighted binary Boolean functions; fixed output signal; q fixed example columns. Types of dead gates are still counted. A count is of type assignments, not distinct Boolean functions or all topologies.

Assertions: invertible four-bit local encoding into output orientation and three shape-control bits; exact frontier count and raw-type rank/unrank; equality of full and affine distributions for q<=3 and a constructive prefix-feasibility criterion; an explicit q=4 failure. All arithmetic for counts/ranks is bigint. Literal truth-table masks are used only for q<=8 in tests. Arbitrary-arity proofs use bit strings and charge bit operations.

Reference: literal gate-table enumeration on selected/all explicitly specified small topology families, plus an independent Python per-row evaluator and Gaussian elimination. Wolfram will be used for focused independent checks, not assumed available until discovery. Sample counts and frontier state counts are exact, never timing extrapolation or an unrestricted lower bound. The full reliability FPRAS is not implemented or used as an oracle.

A width-growing construction is only a bound on this explicit frontier representation. q<=3 distributional equality and feasibility do not imply polynomial exact counting, relative approximation, or general circuit synthesis at growing q. Tests cannot establish P versus NP.

Executed follow-up: a shared colored-site identity makes each nonconstant three-row target a nonnegative weight in {0,1,2}. Its support is the union of one path event and a two-path conjunction. Construct a layered NFA with shared input bits, explicit O(s(k+s)^2) size, and compare accepted words (not path counts) to every mask in declared small families. Published #NFA approximation is a theoretical dependency, not an implemented routine; controlled prefix perturbations only check the error-reduction interface.
