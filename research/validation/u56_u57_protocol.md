# U56-U57 execution contract

The question is whether summing syntactically unused slots can exactly replace raw circuit-description enumeration, and whether small unconditional ancestry justifies truncating the conditional count near anti-checker termination.

All sixteen binary Boolean gates, ordered predecessor indices (repetition allowed), constants 0/1, uncomplemented inputs, and a separate output index are counted. A syntactic ancestor follows BOTH predecessor pointers even for a constant/projection gate. Sharing is preserved; semantic simplification is not used in the weight proof.

Primary checker: enumerate connected predecessor topologies and all gate-type assignments through three live gates for n=1,2,3. Derive raw distributions by an integer elementary-symmetric transform. Compare separate literal raw enumeration through two gates, then an independent Python forward distribution through three. Exhaustively unrank declared small parity fibers, replay each physical circuit with per-input Boolean evaluation, and count distinct descriptions.

Follow-up: enumerate all consistent partial tables on n<=3 at budgets <=3; inspect every single-example positive-to-empty boundary. Find the smallest coordinate subset separating the new point from earlier points, check the predicted live-size cutoff, and build/replay an explicit correction circuit. Empty and contradictory label cases are not identified; contradictory repeated labels are outside this boundary theorem.

An independent scalar recurrence counts unconditional connected topologies and live-size distributions through 128 slots. This weighted arithmetic is NOT explicit enumeration of these descriptions. Check the exact unfolded-tree expectation and its upper-bound relation to distinct live gates. The no-label size transform and conditional terminal cutoff are not general-circuit lower bounds.

Counts and coefficients are exact bigint/rational values. Number arithmetic is confined to bounded explicitly counted universes below 2^53. No external counting oracle, sampling-frequency test, inferred random hard table, or asymptotic extrapolation is permitted. Preserve actual commands, failures, result hashes, and independent evidence.

Follow-up after the first successful run: prove an n-gate one-point correction bound and refine it to the smallest separating coordinate set; then add signed-alias normalization for the six non-two-input-essential B2 types. This yields a stronger near-terminal rarity bound from a binomial gate-type count. The final TypeScript run replays normalization on every raw output-tagged description through two gates; exact type tails and two positive integer MGF inequalities are checked separately. The final proofs distinguish this stronger type bound from the earlier topology-only bound.
