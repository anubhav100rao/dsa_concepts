export const dynamicProgramming = {
  '1. 1D Linear DP': {
    crux: 'dp[i] depends on a constant number of prior states — usually dp[i-1], dp[i-2], or a small window.',
    concepts: [
      'Identify the state (what does dp[i] mean?) and the transition (how does it combine earlier states?).',
      'Most 1D problems compress to O(1) space using two rolling variables (Fibonacci-style).',
      'Reframe the problem as "at index i, what is the best/count/feasibility considering items 0..i".',
    ],
    pointsToPonder: [
      'Is the state INDEX-based (dp[i] = best ending at/considering up to i) or VALUE-based (dp[v] = ways to make sum v)?',
      'Why does the transition only look back a finite distance — what makes it "linear"?',
      'Can dp[i] be reduced to O(1) space, or does the transition reach back too far?',
    ],
    code: `# House Robber
prev2 = prev1 = 0
for x in nums:
    prev2, prev1 = prev1, max(prev1, prev2 + x)
return prev1`,
  },

  '2. 2D Grid / Matrix DP': {
    crux: 'dp[i][j] = best/count for cell (i,j), built from neighbors (top, left, diagonals).',
    concepts: [
      'Standard transition: dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
      'Direction of fill matters: top-left to bottom-right for path-sum problems; reversed for Dungeon Game (which needs future-cost knowledge).',
      'Often compresses to a single row (O(cols) space) since only the previous row is needed.',
    ],
    pointsToPonder: [
      'Does the answer require knowing the FUTURE (e.g., Dungeon Game) — if so, fill backwards.',
      'Which neighbors actually contribute — is it 3 (top/left/diag), 2, or 4 (with diagonals)?',
      'Do boundary cells need padding (sentinel row/col) to avoid index-juggling?',
    ],
    code: `# Minimum Path Sum
m, n = len(grid), len(grid[0])
dp = grid[0][:]
for j in range(1, n): dp[j] += dp[j-1]
for i in range(1, m):
    dp[0] += grid[i][0]
    for j in range(1, n):
        dp[j] = grid[i][j] + min(dp[j], dp[j-1])
return dp[-1]`,
  },

  '3. Subsequence DP': {
    crux: 'dp[i][j] over positions of one or two sequences; transition compares characters/elements and either matches or skips.',
    concepts: [
      'LCS template: if s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1] + 1; else: max(dp[i-1][j], dp[i][j-1]).',
      'Edit Distance: insert/delete/replace map directly to dp[i][j-1], dp[i-1][j], dp[i-1][j-1] + 1.',
      'For palindromic problems, run LCS between s and reverse(s), or use interval DP dp[i][j] over [i..j].',
    ],
    pointsToPonder: [
      'When is the state 1D (dp[i] = LIS ending at i) vs 2D (dp[i][j] over two strings)?',
      'For LIS, why does the O(n log n) "patience" variant give the right length even though tails is not a real LIS?',
      'How do you reconstruct the actual subsequence (not just length) from the DP table?',
    ],
    code: `# Longest Common Subsequence
m, n = len(s1), len(s2)
dp = [[0]*(n+1) for _ in range(m+1)]
for i in range(1, m+1):
    for j in range(1, n+1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
return dp[m][n]`,
  },

  '4. Knapsack Variants': {
    crux: 'dp[capacity] (or dp[i][capacity]) = best value achievable with that budget; iterate items, then capacities.',
    concepts: [
      '0/1 knapsack: iterate capacities IN REVERSE so each item is used at most once.',
      'Unbounded knapsack (Coin Change): iterate capacities FORWARD so the same item can be reused.',
      'Coin Change II (count combos) vs Combination Sum IV (count permutations): the loop ORDER (item-outer vs capacity-outer) flips the answer.',
    ],
    pointsToPonder: [
      'Why does the loop direction (forward/reverse on capacity) toggle between "reuse" and "use once"?',
      'For "count" problems, why does outer-loop order determine combinations vs permutations?',
      'Can you compress dp[i][c] to dp[c] safely — what does that require about the transition?',
    ],
    code: `# 0/1 Knapsack — max value
dp = [0] * (W + 1)
for wt, val in items:
    for c in range(W, wt - 1, -1):       # reverse for 0/1
        dp[c] = max(dp[c], dp[c - wt] + val)
return dp[W]`,
  },

  '5. Interval DP': {
    crux: 'dp[i][j] = best for the interval [i..j]; transition splits at some k and combines dp[i][k] with dp[k+1][j] (or k+1..j-1).',
    concepts: [
      'Burst Balloons: think LAST balloon burst in [i..j], not first — that decouples the subproblems.',
      'Always iterate by INCREASING interval length (i.e., len from 2 to n, then i from 0 to n-len).',
      'O(n³) is the typical complexity (n² states × n splits); Knuth optimization can reduce to O(n²) for monotone problems.',
    ],
    pointsToPonder: [
      'What does "last operation in [i..j]" look like — and why is it usually the right framing?',
      'Why is length-first iteration order critical for the DP to be filled in valid order?',
      'When does the problem admit Knuth/quadrangle optimization (monotone optimal split)?',
    ],
    code: `# Burst Balloons (LC 312)
a = [1] + nums + [1]
n = len(a)
dp = [[0]*n for _ in range(n)]
for length in range(2, n):
    for i in range(n - length):
        j = i + length
        for k in range(i+1, j):
            dp[i][j] = max(dp[i][j], a[i]*a[k]*a[j] + dp[i][k] + dp[k][j])
return dp[0][n-1]`,
  },

  '6. Tree DP': {
    crux: 'Post-order traversal: compute children answers first, then combine at the parent.',
    concepts: [
      'Return MULTIPLE values per node (often two: best including this node, best excluding it).',
      'House Robber III, Binary Tree Cameras, Max Path Sum — all use the pair-return pattern.',
      'A subtree answer is "self-contained" — you do not need to know the rest of the tree (until rerooting, see DP on Trees Advanced).',
    ],
    pointsToPonder: [
      'What pair of values (or tuple) does each node need to return for the parent to decide?',
      'Is the global answer just dfs(root) — or do you track it as a side effect during recursion (max path sum)?',
      'When does the problem need PARENT info (rerooting) vs just child aggregation?',
    ],
    code: `# House Robber III
def dfs(node):
    if not node: return (0, 0)  # (rob, skip)
    l_rob, l_skip = dfs(node.left)
    r_rob, r_skip = dfs(node.right)
    rob  = node.val + l_skip + r_skip
    skip = max(l_rob, l_skip) + max(r_rob, r_skip)
    return (rob, skip)
return max(dfs(root))`,
  },

  '7. State Machine / Stock Problems': {
    crux: 'dp[i][state] = best at day i in that state (holding, not holding, cooldown, k transactions left).',
    concepts: [
      'Stock I/II/III/IV/cooldown/fee — all the SAME state machine with different transitions.',
      'Paint House / Paint Fence: dp[i][color] = min cost at house i ending with that color.',
      'State machine = explicit graph between states; transitions = directed edges with cost.',
    ],
    pointsToPonder: [
      'What is the minimum set of states needed to capture the decision (do you really need to track "have I just sold"?)',
      'For Stock IV with at most k transactions, when does k ≥ n/2 reduce to Stock II (unlimited)?',
      'How does the cooldown state add exactly ONE more state — and why no more?',
    ],
    code: `# Best Time to Buy and Sell with Cooldown
hold = -float('inf'); sold = 0; rest = 0
for p in prices:
    prev_sold = sold
    sold = hold + p
    hold = max(hold, rest - p)
    rest = max(rest, prev_sold)
return max(sold, rest)`,
  },

  '8. Bitmask DP': {
    crux: 'dp[mask] (or dp[mask][i]) where mask is a subset of items already used/visited.',
    concepts: [
      'Only works when item count ≤ ~20 (2^20 ≈ 1M states feasible).',
      'TSP: dp[mask][i] = min cost to visit exactly nodes in mask, ending at i.',
      'Iterate submasks of a mask with: `sub = mask; while sub: ...; sub = (sub - 1) & mask` — O(3^n) total.',
    ],
    pointsToPonder: [
      'Is n ≤ 20? If not, bitmask DP is infeasible.',
      'Does the mask need a SECOND index (e.g., current position) or is the mask self-sufficient?',
      'For "partition into k groups", which mask formulation (assign-item-to-group vs current-group-state) is cleaner?',
    ],
    code: `# Shortest Hamiltonian Path (TSP skeleton)
n = len(dist)
INF = float('inf')
dp = [[INF]*n for _ in range(1 << n)]
for i in range(n): dp[1 << i][i] = 0
for mask in range(1 << n):
    for i in range(n):
        if not (mask >> i) & 1: continue
        for j in range(n):
            if (mask >> j) & 1: continue
            dp[mask | 1<<j][j] = min(dp[mask | 1<<j][j], dp[mask][i] + dist[i][j])`,
  },

  '9. Digit DP': {
    crux: 'Iterate over digit positions; state = (pos, tight, leading_zero, problem-specific summary).',
    concepts: [
      'tight = True means the current prefix equals the bound\'s prefix, restricting future digits to ≤ bound[pos].',
      'leading_zero handles "the number has not started yet" — needed when problem cares about digit count or repeats.',
      'Memoize ONLY when not tight (different tight states have different reachable futures).',
    ],
    pointsToPonder: [
      'What summary of the prefix do you carry — digit sum, mask of seen digits, last digit?',
      'Why does memoization on tight=True states usually NOT help (different bounds yield different counts)?',
      'For "count in [L, R]", compute f(R) - f(L-1) — separate the two-bound problem into two one-bound problems.',
    ],
    code: `# Count integers ≤ N with no consecutive equal digits (template)
from functools import lru_cache
digits = list(map(int, str(N)))
@lru_cache(None)
def dp(pos, last, tight, started):
    if pos == len(digits): return int(started)
    limit = digits[pos] if tight else 9
    total = 0
    for d in range(0, limit + 1):
        if started and d == last: continue
        total += dp(pos+1, d, tight and d == limit, started or d > 0)
    return total
return dp(0, -1, True, False)`,
  },

  '10. DP on Strings (Pattern Matching / Parsing)': {
    crux: 'dp[i][j] = does s[..i] match p[..j] (or some property over two strings at indices i, j)?',
    concepts: [
      'Regex/Wildcard: special chars (`*`, `?`) introduce branching — `*` can mean "match zero" (dp[i][j-2]) or "match one more" (dp[i-1][j]).',
      'Distinct Subsequences: dp[i][j] = ways for s[..i] to form t[..j]; if s[i]==t[j] add dp[i-1][j-1].',
      'Scramble String / Concatenated Words: think about all possible split points and recurse.',
    ],
    pointsToPonder: [
      'For Regex, what does `*` actually mean in the DP transition — and why are TWO branches needed?',
      'When does memoization on (i, j) pairs suffice vs need an extra "mode" dimension?',
      'Why is using 1-indexed dp (with dp[0][*] padding) often cleaner for empty-prefix handling?',
    ],
    code: `# Regular Expression Matching (LC 10)
m, n = len(s), len(p)
dp = [[False]*(n+1) for _ in range(m+1)]
dp[0][0] = True
for j in range(2, n+1):
    if p[j-1] == '*': dp[0][j] = dp[0][j-2]
for i in range(1, m+1):
    for j in range(1, n+1):
        if p[j-1] == '*':
            dp[i][j] = dp[i][j-2] or (dp[i-1][j] and p[j-2] in (s[i-1], '.'))
        else:
            dp[i][j] = dp[i-1][j-1] and p[j-1] in (s[i-1], '.')
return dp[m][n]`,
  },

  '11. DP with Data Structures (Monotonic Stack/Queue, Segment Tree, BIT)': {
    crux: 'When the DP transition needs max/min over a range, swap an O(n) inner loop for an O(log n) (segment tree/BIT) or O(1) amortized (monotonic deque) lookup.',
    concepts: [
      'Constrained Subsequence Sum / Jump Game VI: dp[i] = nums[i] + max(dp[i-k..i-1]) → monotonic deque on dp values.',
      'LIS via BIT/segment tree: dp[v] = 1 + max(dp[u] for u < v); range-max query keyed on value.',
      'Histogram-based DP (Maximal Rectangle): per-row histogram + monotonic stack for rectangle-in-histogram.',
    ],
    pointsToPonder: [
      'Is the transition a RANGE MAX/MIN/SUM over a window of past dp values? If yes, a DS speeds it up.',
      'Why does the monotonic deque give amortized O(1) per element (each element pushed/popped once)?',
      'When would you need segment tree (arbitrary range, no monotonicity) vs deque (sliding window only)?',
    ],
    code: `# Constrained Subsequence Sum (LC 1425) — monotonic deque
from collections import deque
dq = deque()  # stores indices, dp values decreasing
ans = -float('inf')
dp = [0] * len(nums)
for i, x in enumerate(nums):
    while dq and dq[0] < i - k: dq.popleft()
    dp[i] = x + max(0, dp[dq[0]] if dq else 0)
    while dq and dp[dq[-1]] <= dp[i]: dq.pop()
    dq.append(i)
    ans = max(ans, dp[i])
return ans`,
  },

  '12. Game Theory DP (Minimax)': {
    crux: 'dp[state] = (current player score - opponent score) assuming both play optimally; transition is max of "this move" minus the recursive call.',
    concepts: [
      'Symmetry trick: since both players play optimally, dp[state] from the current player\'s view = best move minus opponent\'s dp[next_state].',
      'Stone Game variants typically have dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]).',
      'For "can current player win?" boolean problems, dp[state] = exists move s.t. NOT dp[next_state].',
    ],
    pointsToPonder: [
      'Are you maximizing your own score (score-difference DP) or "can I force a win" (boolean DP)?',
      'Why does the recursion naturally encode "opponent plays optimally" via the negation/min?',
      'For Stone Game I (LC 877), can you skip the DP entirely with a parity argument?',
    ],
    code: `# Predict the Winner (LC 486)
@lru_cache(None)
def dp(i, j):
    if i == j: return nums[i]
    return max(nums[i] - dp(i+1, j), nums[j] - dp(i, j-1))
return dp(0, len(nums)-1) >= 0`,
  },

  '13. Counting DP / Combinatorics': {
    crux: 'dp[state] = NUMBER of ways to reach state; transitions ADD contributions from predecessors.',
    concepts: [
      'Sum (not max/min) over all valid predecessors — every path is counted, not optimized.',
      'Almost always taken modulo 10^9 + 7; add the modulus after every addition.',
      'Combination Sum IV vs Coin Change II: the loop nesting order distinguishes permutations from combinations.',
    ],
    pointsToPonder: [
      'Is order significant (permutations) or not (combinations) — and does your loop order match?',
      'Where exactly should you `% MOD` — after each addition, or only at the end (overflow risk)?',
      'Does the problem have a closed-form (Catalan, Stirling, binomial) that bypasses DP entirely?',
    ],
    code: `# Number of Dice Rolls With Target Sum (LC 1155)
MOD = 10**9 + 7
dp = [0] * (target + 1)
dp[0] = 1
for _ in range(n):
    new = [0] * (target + 1)
    for s in range(1, target + 1):
        for f in range(1, k + 1):
            if f <= s: new[s] = (new[s] + dp[s - f]) % MOD
    dp = new
return dp[target]`,
  },

  '14. Probability / Expected Value DP': {
    crux: 'dp[state] = probability/expected value at state; transitions are weighted SUMS (probability × next dp).',
    concepts: [
      'Probability DP: dp[final_state] = sum over predecessors of dp[pred] * P(pred → final).',
      'Expected value DP: E[state] = sum over transitions of P(transition) * (cost + E[next]).',
      'When transitions form cycles (escape problems), set up a linear system instead of pure DP.',
    ],
    pointsToPonder: [
      'Does each transition probability sum to 1 from a given state? If not, you may need to normalize.',
      'Is the state space FINITE — or do you need to truncate (Soup Servings: large servings → P=1)?',
      'Is there a cyclic dependency that DP can\'t resolve without a linear-algebra step?',
    ],
    code: `# Knight Probability in Chessboard (LC 688)
moves = [(2,1),(2,-1),(-2,1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2)]
dp = [[0]*N for _ in range(N)]
dp[r][c] = 1.0
for _ in range(K):
    new = [[0]*N for _ in range(N)]
    for i in range(N):
        for j in range(N):
            if dp[i][j]:
                for di, dj in moves:
                    ni, nj = i+di, j+dj
                    if 0 <= ni < N and 0 <= nj < N:
                        new[ni][nj] += dp[i][j] / 8
    dp = new
return sum(sum(row) for row in dp)`,
  },

  '15. DP on DAGs / Graph DP': {
    crux: 'Topological order + linear DP: dp[v] depends only on dp[predecessors of v].',
    concepts: [
      'Memoized DFS = automatic topological order (assuming the graph is acyclic).',
      'Longest path in a DAG (e.g., LIP in Matrix) = DP, NOT BFS — BFS gives shortest, not longest.',
      'Number of paths in a DAG: dp[v] = sum of dp[u] for u → v; start dp[source] = 1.',
    ],
    pointsToPonder: [
      'Is the graph actually a DAG? If cycles exist (with non-negative weights), you need Dijkstra/Bellman-Ford instead.',
      'Memoized recursion vs explicit toposort + iteration — which fits the problem better?',
      'Does the DP carry extra dimensions (cost, time, stops) that blow up the state space?',
    ],
    code: `# Longest Increasing Path in a Matrix (LC 329)
@lru_cache(None)
def dfs(i, j):
    best = 1
    for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
        ni, nj = i+di, j+dj
        if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] > grid[i][j]:
            best = max(best, 1 + dfs(ni, nj))
    return best
return max(dfs(i, j) for i in range(m) for j in range(n))`,
  },

  '16. Partition / Subset DP': {
    crux: 'dp[i][k] = best/feasibility splitting the first i elements into k parts (or into subsets with a property).',
    concepts: [
      'Two flavors: (a) split a sequence into K contiguous parts; (b) partition into K subsets (often needs bitmask).',
      'For "minimize the max sum across K splits", binary-search the answer and greedily check feasibility.',
      'Subset-sum partition uses dp[c] = "can we form sum c" with 0/1 knapsack on capacities.',
    ],
    pointsToPonder: [
      'Are the parts CONTIGUOUS (sequence split, O(n²k) DP) or ARBITRARY (subset partition, often bitmask)?',
      'Why does target_sum being odd or > total/2 immediately rule out equal partition?',
      'When does binary-search-the-answer beat direct DP (continuous answer, monotone feasibility)?',
    ],
    code: `# Partition Equal Subset Sum (LC 416)
total = sum(nums)
if total % 2: return False
target = total // 2
dp = {0}
for x in nums:
    dp |= {v + x for v in dp if v + x <= target}
return target in dp`,
  },

  '17. DP with Greedy / Binary Search Optimization': {
    crux: 'Replace an O(n) inner DP loop with binary search OR collapse a DP recurrence into a monotone "can-we-achieve(x)" check.',
    concepts: [
      'LIS in O(n log n): maintain tails[]; bisect_left on each x to find its pile.',
      'Split Array Largest Sum: binary search the max-group-sum; greedy check feasibility.',
      'Super Egg Drop: the standard O(kn²) DP collapses to O(kn log n) via binary search on the DP transition.',
    ],
    pointsToPonder: [
      'What is the search variable — an index, a value, or the answer itself?',
      'Is the predicate "can we achieve X?" PROVABLY monotone in X?',
      'When does the optimized version still need an inner DP (vs being pure greedy)?',
    ],
    code: `# Russian Doll Envelopes (LC 354)
envelopes.sort(key=lambda e: (e[0], -e[1]))
tails = []
for _, h in envelopes:
    i = bisect_left(tails, h)
    if i == len(tails): tails.append(h)
    else: tails[i] = h
return len(tails)`,
  },

  '18. Multi-dimensional / Complex State DP': {
    crux: 'When 1D/2D state is insufficient, add dimensions (count, position, mask, last-choice) — but verify the state space stays tractable.',
    concepts: [
      'Freedom Trail: dp[i][j] = min steps to spell key[..i] with ring rotated so j is at 12 o\'clock.',
      'Profitable Schemes: dp[i][members][profit] — 3D over items × resource × profit floor.',
      'Always sanity-check: states × transition cost ≤ ~10^8 for typical TL.',
    ],
    pointsToPonder: [
      'Is each added dimension TRULY needed, or can it be implied / collapsed?',
      'Are there redundant states (symmetries) that can be collapsed (e.g., last-character classes)?',
      'When the state blows up, can you swap dp[state] for an iterative-deepening / BFS-pruned variant?',
    ],
    code: `# Freedom Trail (LC 514)
@lru_cache(None)
def dp(i, j):  # spelling key[i..], ring pointer at j
    if i == len(key): return 0
    best = float('inf')
    for k, c in enumerate(ring):
        if c == key[i]:
            dist = abs(j - k); dist = min(dist, len(ring) - dist)
            best = min(best, dist + 1 + dp(i + 1, k))
    return best
return dp(0, 0)`,
  },

  '19. DP on Trees (Rerooting / Advanced)': {
    crux: 'Two passes over the tree: first computes subtree answers; second "rerooting" pass propagates parent-side info to every node in O(n) total.',
    concepts: [
      'Rerooting transforms a single-root tree DP into "answer for every possible root".',
      'Key invariant: when you move the root from u to neighbor v, only the edges incident to u and v change in contribution.',
      'Pattern: dfs1 fills down[u]; dfs2 fills up[u] using up[parent] + (sum of siblings\' down values).',
    ],
    pointsToPonder: [
      'Can you express the answer at v in terms of the answer at u (its parent) with a small delta?',
      'Does your aggregation operation (sum, max, min) admit an inverse — or do you need prefix/suffix tricks?',
      'When does rerooting fail (non-invertible aggregation) and force you back to O(n²)?',
    ],
    code: `# Sum of Distances in Tree (LC 834) — rerooting skeleton
count = [1] * n        # subtree size
ans = [0] * n
def dfs1(u, p):
    for v in g[u]:
        if v == p: continue
        dfs1(v, u)
        count[u] += count[v]
        ans[u] += ans[v] + count[v]
def dfs2(u, p):
    for v in g[u]:
        if v == p: continue
        ans[v] = ans[u] - count[v] + (n - count[v])
        dfs2(v, u)
dfs1(0, -1); dfs2(0, -1)`,
  },

  '20. Profile / Broken Profile DP': {
    crux: 'dp[row][profile_mask] = ways to fill rows 0..row such that the boundary "profile" with the next row is profile_mask.',
    concepts: [
      'Profile encodes which cells of the next row are already covered by a tile placed in this row.',
      'Tile placements in row i ⟹ a partial fill mask that defines the START state for row i+1.',
      'For "broken profile" (single-cell granularity), state = (row, col, mask of last #cols cells).',
    ],
    pointsToPonder: [
      'Is the grid narrow enough (#cols ≤ ~12) for 2^cols to fit?',
      'Does the problem have ROW symmetry, allowing you to reuse the same transition table across rows?',
      'Can you enumerate "compatible (prev_mask, next_mask)" pairs once and then run a fast matrix exponentiation if rows is huge?',
    ],
    code: `# Domino tiling on 2xN (warm-up — equivalent profile DP)
dp = [0]*(N+1); dp[0] = dp[1] = 1
for i in range(2, N+1):
    dp[i] = dp[i-1] + dp[i-2]
return dp[N]`,
  },

  '21. SOS (Sum over Subsets) DP': {
    crux: 'Compute, for every mask, the sum/aggregate of f(submask) over ALL submasks — in O(n · 2^n) instead of O(3^n).',
    concepts: [
      'SOS / Zeta transform: for each bit b, for each mask with bit b set, dp[mask] += dp[mask ^ (1<<b)].',
      'After the transform, dp[mask] aggregates f over all subsets of mask.',
      'Inverse (Möbius transform) recovers f from the SOS array — useful for inclusion-exclusion.',
    ],
    pointsToPonder: [
      'Does the problem ask "for each mask, an aggregate over its submasks" — that is the SOS signature.',
      'Why is O(n · 2^n) better than O(3^n) for n around 16-22?',
      'Can the aggregate be inverted (Möbius) — do you need both directions?',
    ],
    code: `# Sum over subsets (Zeta transform)
for b in range(n):
    for mask in range(1 << n):
        if mask & (1 << b):
            f[mask] += f[mask ^ (1 << b)]
# Now f[mask] = sum of original f over all submasks of mask`,
  },

  "22. Classic Must-Know Problems (Misc)": {
    crux: 'Compact DP recurrences with O(1) or O(log n) per element — pattern recognition saves you from reinventing.',
    concepts: [
      "Kadane's: cur = max(x, cur + x); track global max.",
      'Maximum Product Subarray: track BOTH cur_max AND cur_min (negatives flip them).',
      'Counting Bits: dp[i] = dp[i >> 1] + (i & 1) — elegant recurrence using the LSB.',
    ],
    pointsToPonder: [
      'Which classic does THIS problem map to (Kadane variant? LIS variant? prefix-sum DP?)',
      'For product subarray, why must you track the running MIN alongside the MAX?',
      'For Counting Bits, why does the half-index recurrence avoid the naive O(n log n)?',
    ],
    code: `# Maximum Product Subarray (LC 152)
cur_max = cur_min = ans = nums[0]
for x in nums[1:]:
    if x < 0: cur_max, cur_min = cur_min, cur_max
    cur_max = max(x, cur_max * x)
    cur_min = min(x, cur_min * x)
    ans = max(ans, cur_max)
return ans`,
  },
}
