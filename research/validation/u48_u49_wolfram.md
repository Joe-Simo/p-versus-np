# U48-U49 independent Wolfram evidence

Date: 2026-09-15. Tool: WolframLanguageEvaluator, timeConstraint 40. One successful evaluator call; no evaluator failure in this run. Returned version: **15.0.1 for Linux x86 (64-bit) (July 2, 2026)**. Executed cell is preserved in `code/u48_u49_independent.wl` (excluding its added explanatory header).

The adaptive-policy experiment enumerates support sets directly and compares exact histogram counts with binomial coefficients. Parameter values and majority bounds use exact integer/rational arithmetic. It does not construct a huge sparse circuit-hard table, check the TypeScript gate DAG, or provide expert/formal theorem verification.

Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"HypergeometricChecks" -> 106,
"HypergeometricPass" -> True,
"ParameterColumns" -> "n,b,h,countingGap,expectedHits,unconditionedMarkov,simplifiedMarkov",
"Parameters" -> {
{128, 8, 1, 25079, 1/1099511627776, 1/1099511627776, 5/8589934592},
{256, 16, 1, 13238255, 1/1208925819614629174706176, 1/1208925819614629174706176, 5/604462909807314587353088},
{512, 32, 1639, 1760936591327, 1/1461501637330902918203684832716283019655932542976, 1/2395401183585349882935839440821987869216073437937664, 5/11972621413014756705924586149611790497021399392059392},
{512, 48, 107374183, 101893941569257423, 65536, 65536/107374183, 5/8192},
{1024, 96, 7555786372591432341914, 57836558635412966443287083745183, 4294967296, 2147483648/3777893186295716170957, 5/8796093022208},
{2048, 192, 149657767662684458824057326870147381212767492400743, 9202231144076873999783267294422438966006053081584274595905343, 18446744073709551616, 18446744073709551616/149657767662684458824057326870147381212767492400743, 5/40564819207303340847894502572032}
},
"MajorityChecks" -> 125,
"MajorityPass" -> True,
"RobustSelectionBound" -> True|>
```

The majority tests here extend through n=128 and check the analytic binomial-tail/size inequalities. The TypeScript audit separately checks every assignment to the actual majority circuits of odd input count at most 19. They are different finite evidence, not two executions of identical code.
