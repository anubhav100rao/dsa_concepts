export const dynamicProgramming = {
  '1. 1D Linear DP': {
    crux: 'dp[i] depends on a constant number of prior states — usually dp[i-1], dp[i-2], or a small window.',
    signals: [
      '"How many distinct ways can you climb to the top?" or "the maximum amount you can rob": one number, and each position only cares about the last few.',
      '"You cannot rob two adjacent houses" or "solving question i makes you skip the next brainpower[i]": choosing i locks out a stretch of positions.',
      '"Can s be segmented into dictionary words?" or "the fewest perfect squares that sum to n": dp over the prefix length, trying each possible last piece.',
      'The input is one array, one string or one integer n, usually up to about 10^5.',
    ],
    notThis: [
      'The adjacency rule lives on a tree, as in House Robber III (LC 337): use Tree DP in section 6, because a node has two children rather than one neighbor.',
      'Only reachability matters, as in Jump Game (LC 55): tracking the farthest index is O(n) with no table, while dp[i] is slower for the same answer.',
      'Items can be picked in any order against a budget ("a subset that sums to..."): use Knapsack in section 4.',
    ],
    concepts: [
      'Identify the state (what does dp[i] mean?) and the transition (how does it combine earlier states?).',
      'Most 1D problems compress to O(1) space using two rolling variables (Fibonacci-style).',
      'Reframe the problem as "at index i, what is the best/count/feasibility considering items 0..i".',
    ],
    example: {
      problem: 'House Robber with nums = [2,7,9,3,1]',
      lc: 198,
      walkthrough: [
        'Start with prev2 = 0 and prev1 = 0. prev1 is the best so far, and prev2 is the best up to the house before that.',
        'x = 2: prev1 becomes max(0, 0 + 2) = 2 and prev2 becomes 0.',
        'x = 7: prev1 becomes max(2, 0 + 7) = 7 and prev2 becomes 2.',
        'x = 9: prev1 becomes max(7, 2 + 9) = 11 and prev2 becomes 7.',
        'x = 3: prev1 stays max(11, 7 + 3) = 11 and prev2 becomes 11.',
        'x = 1: prev1 becomes max(11, 11 + 1) = 12 and prev2 becomes 11.',
        'The answer is 12, from robbing the houses worth 2, 9 and 1.',
      ],
    },
    complexity: 'O(n) time and O(1) space for rolling recurrences like House Robber. O(n * choices) time and O(n) space when dp[i] tries many earlier positions, as in Word Break or Perfect Squares.',
    pitfalls: [
      'Assigning prev1 first without a tuple swap: prev2 then copies the new value, so you add x to the wrong state.',
      'Greedily taking every other house: [2,1,1,2] gives 3 with either alternating pick, but the answer is 4 from the two ends.',
      'House Robber II (LC 213): the first and last houses touch, so run twice, on nums[1:] and nums[:-1], and handle one house separately.',
      'Decode Ways (LC 91): "0" can\'t stand alone and "06" isn\'t a valid pair, so a string like "0" must return 0.',
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
    practice: [70, 198, 213, 91, 139],
    snippet: '2-1d-dp-house-robber',
  },

  '2. 2D Grid / Matrix DP': {
    crux: 'dp[i][j] = best/count for cell (i,j), built from neighbors (top, left, diagonals).',
    signals: [
      '"A robot can only move either down or right" followed by "how many unique paths" or "minimum path sum".',
      '"A falling path starts at any element in the first row and picks one in the next row": the moves between rows are restricted.',
      '"Find the largest square containing only 1\'s": a cell\'s value is built from its top, left and top-left neighbors.',
      '"Return the knight\'s minimum initial health so that he can rescue the princess": what you need now depends on what comes later, so fill from the bottom-right.',
    ],
    notThis: [
      'Moves go in all four directions with weights: cycles leave no valid fill order, so use Dijkstra or BFS.',
      'Moves go to any strictly larger neighbor, as in LC 329: there is no fixed row order, so use memoized DFS from section 15.',
      'The answer is about a contiguous rectangle with no path at all: try a per-row histogram first, as in Maximal Rectangle (LC 85, section 11).',
    ],
    concepts: [
      'Standard transition: dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
      'Direction of fill matters: top-left to bottom-right for path-sum problems; reversed for Dungeon Game (which needs future-cost knowledge).',
      'Often compresses to a single row (O(cols) space) since only the previous row is needed.',
    ],
    example: {
      problem: 'Minimum Path Sum with grid = [[1,3,1],[1,5,1],[4,2,1]]',
      lc: 64,
      walkthrough: [
        'Copy the first row, then take prefix sums because it can only be reached from the left: dp = [1,4,5].',
        'Row [1,5,1]: dp[0] = 1 + 1 = 2. dp[1] = 5 + min(4, 2) = 7. dp[2] = 1 + min(5, 7) = 6. Now dp = [2,7,6].',
        'Row [4,2,1]: dp[0] = 2 + 4 = 6. dp[1] = 2 + min(7, 6) = 8. dp[2] = 1 + min(6, 8) = 7. Now dp = [6,8,7].',
        'The answer is dp[-1] = 7, along the path 1, 3, 1, 1, 1.',
      ],
    },
    complexity: 'O(m * n) time. O(n) space with one row, or O(m * n) if you keep the table to rebuild the path. A second walker, as in Cherry Pickup II, adds a dimension: O(m * n^2) states.',
    pitfalls: [
      'Skipping the first row and column setup: those cells have only one predecessor, so a shared min() reads a value that doesn\'t exist.',
      'In one-row form, dp[j] is the cell above and dp[j-1] is the cell to the left. A diagonal read, as in Maximal Square, needs a saved variable.',
      'Unique Paths II (LC 63): an obstacle in the first row blocks every cell to its right, not just its own.',
      'Dungeon Game (LC 174): filling from the top-left tracks the best sum, but health must stay at least 1 at every step, so fill backwards.',
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
    practice: [62, 64, 120, 221, 174],
    snippet: '3-grid-dp-minimum-path-sum',
  },

  '3. Subsequence DP': {
    crux: 'dp[i][j] over positions of one or two sequences; transition compares characters/elements and either matches or skips.',
    signals: [
      '"Return the length of their longest common subsequence", "minimum deletions to make the two strings the same" or "the shortest string that has both as subsequences": two sequences, so compare their last characters.',
      '"Minimum number of operations (insert, delete, replace) to convert word1 to word2."',
      '"Longest strictly increasing subsequence", "longest string chain" or "arithmetic with a given difference": one sequence, with dp[i] = best ending at i.',
      '"Formed by deleting some characters without changing the order of the remaining": that sentence defines a subsequence, even when the word isn\'t used.',
    ],
    notThis: [
      'The problem says "subarray" or "substring", which must be contiguous: use a sliding window, or reset to 0 on a mismatch as in LC 718.',
      'One Is Subsequence check (LC 392): two pointers solve it in O(n) with no table.',
      'Order doesn\'t matter ("subset"): use Knapsack in section 4.',
    ],
    concepts: [
      'LCS template: if s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1] + 1; else: max(dp[i-1][j], dp[i][j-1]).',
      'Edit Distance: insert/delete/replace map directly to dp[i][j-1], dp[i-1][j], dp[i-1][j-1] + 1.',
      'For palindromic problems, run LCS between s and reverse(s), or use interval DP dp[i][j] over [i..j].',
    ],
    example: {
      problem: 'Longest Common Subsequence with s1 = "abcde" and s2 = "ace"',
      lc: 1143,
      walkthrough: [
        'Row 0 and column 0 are 0, because an empty prefix has nothing in common. The columns below are j = 0 to 3 for "", a, c, e.',
        'i = 1 (a): a matches a, so dp[1][1] = 0 + 1 = 1, and the ones to its right carry it over. Row = [0,1,1,1].',
        'i = 2 (b): nothing matches, so each cell takes max(top, left). Row = [0,1,1,1].',
        'i = 3 (c): c matches at j = 2, so dp[3][2] = dp[2][1] + 1 = 2. Row = [0,1,2,2].',
        'i = 4 (d): nothing matches. Row = [0,1,2,2].',
        'i = 5 (e): e matches at j = 3, so dp[5][3] = dp[4][2] + 1 = 3. Row = [0,1,2,3].',
        'The answer is dp[5][3] = 3, which is "ace".',
      ],
    },
    complexity: 'O(m * n) time and space for two sequences, or O(min(m, n)) space with two rows if you only need the length. One-sequence LIS is O(n^2), or O(n log n) with a tails array.',
    pitfalls: [
      'Mixing up dp and string indices: dp[i][j] covers the first i and j characters, so compare s1[i-1] with s2[j-1].',
      'Rolling the table down to two rows and then trying to rebuild the subsequence: walking back needs the full table.',
      'Distinct Subsequences (LC 115): intermediate counts can overflow a C++ int even when the final answer fits.',
      'LIS with "strictly" vs "non-decreasing": this changes `<` to `<=` in the O(n^2) form, and lower_bound to upper_bound in the tails form.',
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
    practice: [392, 300, 1143, 72, 115],
    snippet: '10-lcs-longest-common-subsequence',
  },

  '4. Knapsack Variants': {
    crux: 'dp[capacity] (or dp[i][capacity]) = best value achievable with that budget; iterate items, then capacities.',
    signals: [
      '"Partition the array into two subsets with equal sum" or "add + or - before each integer to reach target": each item is used once, so this is 0/1.',
      '"The fewest coins needed to make up that amount" with "an infinite number of each kind": this is unbounded.',
      '"At most m 0\'s and n 1\'s in the subset" (LC 474): two budgets give two capacity dimensions.',
      '"There are count[i] questions of type i" (LC 2585): each item has a limited number of copies, so this is bounded.',
    ],
    notThis: [
      'Weights reach 10^9 with few items: a capacity table can\'t fit, so try dp on value or meet in the middle.',
      'You may take a fraction of an item: sort by value per unit of weight and be greedy.',
      'Different orderings count as different answers, as in Combination Sum IV (LC 377): put the capacity loop on the outside and see section 13.',
    ],
    concepts: [
      '0/1 knapsack: iterate capacities IN REVERSE so each item is used at most once.',
      'Unbounded knapsack (Coin Change): iterate capacities FORWARD so the same item can be reused.',
      'Coin Change II (count combos) vs Combination Sum IV (count permutations): the loop ORDER (item-outer vs capacity-outer) flips the answer.',
    ],
    example: {
      problem: '0/1 knapsack with items (weight, value) = (1,15), (3,20), (4,30) and W = 4',
      walkthrough: [
        'Start with dp = [0,0,0,0,0], where dp[c] is the best value with capacity c.',
        'Item (1,15), c from 4 down to 1: every capacity can hold it. Now dp = [0,15,15,15,15].',
        'Item (3,20): c = 4 gives max(15, dp[1] + 20) = 35. c = 3 gives max(15, dp[0] + 20) = 20. Now dp = [0,15,15,20,35].',
        'Item (4,30): c = 4 gives max(35, dp[0] + 30) = 35, so nothing changes.',
        'The answer is dp[4] = 35, from the items of weight 1 and 3.',
      ],
    },
    complexity: 'O(n * W) time. O(W) space with one array, or O(n * W) if you keep the table to list the chosen items. This is pseudo-polynomial: the cost grows with the numeric value of W.',
    pitfalls: [
      'Looping capacity forward in 0/1: with the first item above, dp[4] would become 60 because that one item gets used four times.',
      'Starting a minimum version at 0: Coin Change needs dp[0] = 0 and INF everywhere else, or impossible amounts look free.',
      'Counting versions need dp[0] = 1, since there is one way to choose nothing. Starting from 0 leaves every count at 0.',
      'Target Sum (LC 494): check that |target| <= total and that total + target is even before you compute the subset size.',
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
    practice: [416, 322, 518, 494, 879],
    snippet: '4-0-1-knapsack',
  },

  '5. Interval DP': {
    crux: 'dp[i][j] = best for the interval [i..j]; transition splits at some k and combines dp[i][k] with dp[k+1][j] (or k+1..j-1).',
    signals: [
      '"Burst all the balloons", "merge consecutive piles" or "cut the stick": doing something inside a range changes what its neighbors see.',
      '"Triangulate the polygon" or "the minimum number of multiplications": the whole answer splits into a left part and a right part at some k.',
      '"Remove boxes" or "the printer can print a sequence of the same character": the remaining pieces close up and can combine later.',
      'n is only 100 to 500, which is the budget for an O(n^3) table.',
    ],
    notThis: [
      'Every split only cuts a prefix off, as in Palindrome Partitioning II (LC 132): dp[i] over prefixes is simpler than dp[i][j] with a split k.',
      'You may merge any two piles, not just adjacent ones: a heap with greedy merges wins.',
      'Stones are only taken from the front, as in Stone Game III (LC 1406): there\'s no real interval, so a suffix dp over one index is enough.',
    ],
    concepts: [
      'Burst Balloons: think LAST balloon burst in [i..j], not first — that decouples the subproblems.',
      'Always iterate by INCREASING interval length (i.e., len from 2 to n, then i from 0 to n-len).',
      'O(n³) is the typical complexity (n² states × n splits); Knuth optimization can reduce to O(n²) for monotone problems.',
    ],
    example: {
      problem: 'Burst Balloons with nums = [3,1,5]',
      lc: 312,
      walkthrough: [
        'Pad with sentinels: a = [1,3,1,5,1]. dp[i][j] is the best coins from bursting everything strictly between i and j, and k is the last one burst.',
        'Length 2: dp[0][2] = 1*3*1 = 3. dp[1][3] = 3*1*5 = 15. dp[2][4] = 1*5*1 = 5.',
        'Length 3, dp[0][3]: k = 1 gives 1*3*5 + 0 + 15 = 30, and k = 2 gives 1*1*5 + 3 + 0 = 8. The best is 30.',
        'Length 3, dp[1][4]: k = 2 gives 3*1*1 + 0 + 5 = 8, and k = 3 gives 3*5*1 + 15 + 0 = 30. The best is 30.',
        'Length 4, dp[0][4]: k = 1 gives 1*3*1 + 0 + 30 = 33. k = 2 gives 1*1*1 + 3 + 5 = 9. k = 3 gives 1*5*1 + 30 + 0 = 35.',
        'The answer is dp[0][4] = 35: burst the 1 first (15), then the 3 (15), then the 5 (5).',
      ],
    },
    complexity: 'O(n^3) time from n^2 intervals with up to n splits each, and O(n^2) space.',
    pitfalls: [
      'Filling by i and j directly: dp[i][k] may not be computed yet, so loop by increasing length.',
      'Choosing the first balloon burst: its neighbors change afterwards and the two sides stop being independent. The last one burst has fixed neighbors a[i] and a[j].',
      'Forgetting that the table indexes the padded array, so the answer is dp[0][n-1] where n = len(a), not len(nums).',
      'Minimum versions must start each dp[i][j] at infinity. Merge Stones (LC 1000) also needs an early exit, since it\'s impossible unless (n - 1) % (k - 1) == 0.',
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
    practice: [516, 486, 1039, 312, 1000],
    snippet: '16-burst-balloons',
  },

  '6. Tree DP': {
    crux: 'Post-order traversal: compute children answers first, then combine at the parent.',
    signals: [
      '"The thief can\'t rob two directly-linked houses" and the houses form a binary tree: a choice at a node limits its children.',
      '"A path can start and end at any node and doesn\'t need to pass through the root": the best path peaks at some node, so check every one.',
      '"Minimum number of cameras needed to monitor all nodes": each node has a small set of states (covered, has camera, needs cover).',
      '"Move coins so that every node has exactly one": what passes over an edge is decided by the subtree below it.',
    ],
    notThis: [
      'You need an answer for every node as the root: use rerooting in section 19, since a post-order for each root costs O(n^2).',
      'No tree is given, as in Unique Binary Search Trees (LC 96): that\'s counting by size, so see section 13.',
      'Information only flows down, such as root-to-leaf sums: a plain DFS with a parameter is enough and nothing needs returning.',
    ],
    concepts: [
      'Return MULTIPLE values per node (often two: best including this node, best excluding it).',
      'House Robber III, Binary Tree Cameras, Max Path Sum — all use the pair-return pattern.',
      'A subtree answer is "self-contained" — you do not need to know the rest of the tree (until rerooting, see DP on Trees Advanced).',
    ],
    example: {
      problem: 'House Robber III with root = [3,2,3,null,3,null,1]',
      lc: 337,
      walkthrough: [
        'Each call returns (rob, skip). A missing child returns (0, 0).',
        'Leaf 3 (under the 2) returns (3, 0). Leaf 1 (under the right 3) returns (1, 0).',
        'Node 2 has only that right child. rob = 2 + 0 + 0 = 2. skip = 0 + max(3, 0) = 3. It returns (2, 3).',
        'Right node 3 has only child 1. rob = 3 + 0 + 0 = 3. skip = 0 + max(1, 0) = 1. It returns (3, 1).',
        'Root 3: rob = 3 + 3 + 1 = 7. skip = max(2, 3) + max(3, 1) = 6. It returns (7, 6).',
        'The answer is max(7, 6) = 7, from robbing the root and the two leaves 3 and 1.',
      ],
    },
    complexity: 'O(n) time, since each node is visited once with O(1) work. O(h) recursion stack, which is O(log n) when balanced and O(n) on a chain.',
    pitfalls: [
      'Recursing to grandchildren with no memo: rob(node) = max(val + grandchildren, children) goes exponential. The pair return keeps it O(n).',
      'Mixing up what you return with what you record: in LC 124 a node returns one downward arm, but the global best uses both arms.',
      'LC 124 with all negative values: clamp each child\'s gain at 0, and start the global best at -inf rather than 0.',
      'Skipping the child\'s own best: skip must use max(l_rob, l_skip), not just l_rob.',
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
    practice: [543, 337, 1372, 124, 968],
    snippet: '18-tree-dp-house-robber-iii',
  },

  '7. State Machine / Stock Problems': {
    crux: 'dp[i][state] = best at day i in that state (holding, not holding, cooldown, k transactions left).',
    signals: [
      '"You may complete at most k transactions", "you must sell before you buy again", "a cooldown of one day" or "a transaction fee".',
      '"No two adjacent houses have the same color" with "the minimum cost to paint all houses": the last choice is the state.',
      'Each day or item you\'re in one of a few modes, and the rules say which mode can follow which.',
    ],
    notThis: [
      'One buy and one sell (LC 121): tracking the lowest price so far is enough. Unlimited trades with no cost (LC 122): sum the positive differences.',
      'The state has to remember exactly which items were used, not just the last mode: use Bitmask DP in section 8.',
      'Profits come from choosing non-overlapping jobs, as in LC 1235: sort by time and use dp with binary search.',
    ],
    concepts: [
      'Stock I/II/III/IV/cooldown/fee — all the SAME state machine with different transitions.',
      'Paint House / Paint Fence: dp[i][color] = min cost at house i ending with that color.',
      'State machine = explicit graph between states; transitions = directed edges with cost.',
    ],
    example: {
      problem: 'Best Time to Buy and Sell Stock with Cooldown with prices = [1,2,3,0,2]',
      lc: 309,
      walkthrough: [
        'Start with hold = -inf, sold = 0 and rest = 0.',
        'p = 1: sold = -inf + 1 = -inf. hold = max(-inf, 0 - 1) = -1. rest = max(0, 0) = 0.',
        'p = 2: sold = -1 + 2 = 1. hold = max(-1, 0 - 2) = -1. rest = max(0, -inf) = 0.',
        'p = 3: sold = -1 + 3 = 2. hold = max(-1, 0 - 3) = -1. rest = max(0, 1) = 1.',
        'p = 0: sold = -1 + 0 = -1. hold = max(-1, 1 - 0) = 1. rest = max(1, 2) = 2.',
        'p = 2: sold = 1 + 2 = 3. hold = max(1, 2 - 2) = 1. rest = max(2, -1) = 2.',
        'The answer is max(3, 2) = 3: buy at 1, sell at 2, cool down, buy at 0, sell at 2.',
      ],
    },
    complexity: 'O(n * states) time and O(states) space. Stock III needs four variables. Stock IV is O(n * k) time and O(k) space. Paint House II is O(n * k) by tracking the two smallest costs from the previous house.',
    pitfalls: [
      'Updating a state before another state has read it: the code saves prev_sold because rest needs yesterday\'s value.',
      'Starting hold at 0: that means you already own a stock for free. It must start at -inf.',
      'Charging the fee (LC 714) on both the buy and the sell: charge it once per transaction.',
      'Stock IV (LC 188) with huge k: once k >= n / 2 it\'s the same as unlimited trades, so switch instead of allocating a big table.',
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
    practice: [121, 122, 309, 714, 123],
    snippet: '28-stock-dp-state-machine',
  },

  '8. Bitmask DP': {
    crux: 'dp[mask] (or dp[mask][i]) where mask is a subset of items already used/visited.',
    signals: [
      '"n <= 20" or "n <= 16" on a problem that would otherwise cost n!: that small limit is the biggest clue.',
      '"Visit every node" or "contains each string as a substring": the order matters, and you only need to remember which were used and the last one.',
      '"Assign each task to exactly one worker" or "divide into k subsets with equal sum".',
      '"The smallest team that covers all required skills": the mask tracks what\'s covered rather than who\'s chosen, with at most 16 skills.',
    ],
    notThis: [
      'n is in the hundreds and only the total matters, not which items were used: use Knapsack in section 4.',
      'For every mask you need an aggregate over all its submasks: use SOS DP in section 21, since it\'s O(n * 2^n) instead of O(3^n).',
      'Every move costs the same, as in LC 847: BFS over (mask, node) finds the shortest walk and allows revisiting nodes, which plain mask-order DP doesn\'t handle.',
    ],
    concepts: [
      'Only works when item count ≤ ~20 (2^20 ≈ 1M states feasible).',
      'TSP: dp[mask][i] = min cost to visit exactly nodes in mask, ending at i.',
      'Iterate submasks of a mask with: `sub = mask; while sub: ...; sub = (sub - 1) & mask` — O(3^n) total.',
    ],
    example: {
      problem: 'Shortest path that visits all 3 nodes with dist = [[0,1,4],[1,0,2],[4,2,0]]',
      walkthrough: [
        'Seed each single node at cost 0: dp[001][0], dp[010][1] and dp[100][2] are all 0.',
        'mask 001 (at node 0): dp[011][1] = 1 and dp[101][2] = 4.',
        'mask 010 (at node 1): dp[011][0] = 1 and dp[110][2] = 2.',
        'mask 011: from node 0, dp[111][2] = 1 + 4 = 5. From node 1, dp[111][2] = min(5, 1 + 2) = 3.',
        'mask 100 (at node 2): dp[101][0] = 4 and dp[110][1] = 2.',
        'mask 101: from node 0, dp[111][1] = 4 + 1 = 5. From node 2, 4 + 2 = 6 doesn\'t improve it.',
        'mask 110: from node 1, dp[111][0] = 2 + 1 = 3. From node 2, 2 + 4 = 6 doesn\'t improve it.',
        'dp[111] = [3,5,3]. The code stops after the table, so read the answer as min(dp[111]) = 3, for the path 0, 1, 2.',
      ],
    },
    complexity: 'O(2^n * n^2) time and O(2^n * n) space when you also track the last node. O(2^n * n) time with dp[mask] alone, and O(3^n) when you enumerate submasks.',
    pitfalls: [
      'C++ precedence: `mask & (1 << i) == 0` parses as mask & ((1 << i) == 0). Parenthesize the whole `&` expression.',
      'Path vs cycle: this code seeds every node and finds an open path. A TSP cycle seeds only the start and adds the cost back to it at the end.',
      'Memory: dp[2^20][20] of 4-byte ints is about 84 MB, so check the limit before adding the second index.',
      'Increasing mask order works only because adding a bit always gives a larger number, so every predecessor is finished before it\'s read.',
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
    practice: [473, 698, 1986, 847, 943],
    snippet: '22-bitmask-dp-tsp-style',
  },

  '9. Digit DP': {
    crux: 'Iterate over digit positions; state = (pos, tight, leading_zero, problem-specific summary).',
    signals: [
      '"Count the integers in the range [1, n]" or "between low and high", with n up to 10^9 or 10^18.',
      '"Have at least one repeated digit", "all of its digits are distinct" or "digit_sum(x) is between min_sum and max_sum".',
      '"Count the total number of digit 1 appearing in all integers less than or equal to n."',
      '"Whose binary representations do not contain consecutive ones": the same idea in base 2.',
    ],
    notThis: [
      'n is around 10^6: a loop that checks each number\'s digits passes and is far easier to get right.',
      'The property depends on the whole value, such as being prime: a small prefix summary can\'t capture it. Divisibility by a small m still works, by carrying the remainder.',
      'A direct count exists, as in Count Numbers with Unique Digits (LC 357): 9 * 9 * 8 * ... needs no memo.',
    ],
    concepts: [
      'tight = True means the current prefix equals the bound\'s prefix, restricting future digits to ≤ bound[pos].',
      'leading_zero handles "the number has not started yet" — needed when problem cares about digit count or repeats.',
      'Memoize ONLY when not tight (different tight states have different reachable futures).',
    ],
    example: {
      problem: 'Count integers from 1 to 12 with no two equal adjacent digits, with N = 12',
      walkthrough: [
        'digits = [1,2]. At pos 0 tight is True, so limit = 1 and d can be 0 or 1.',
        'd = 0 calls dp(1, 0, False, False). The number hasn\'t started, so limit = 9 and any digit is allowed.',
        'Inside it, d = 0 reaches the end with started = False and returns 0. d = 1 to 9 each return 1, so this branch gives 9 (the numbers 1 to 9).',
        'd = 1 calls dp(1, 1, True, True). Now limit = 2. d = 0 gives 10 and returns 1. d = 1 is skipped because it equals last. d = 2 gives 12 and returns 1. This branch gives 2.',
        'The answer is 9 + 2 = 11, which is every number from 1 to 12 except 11.',
      ],
    },
    complexity: 'O(digits * states * 10) time and O(digits * states) space. Here states covers last (11 values), tight and started. A 10-digit seen mask raises states to about 2 * 2 * 1024.',
    pitfalls: [
      'Treating leading zeros as real digits: 007 hasn\'t repeated a 0. That\'s what the started flag is for.',
      'Reusing a cache across bounds: when you compute f(R) - f(L-1), states with tight = True depend on the digits, so clear the cache between calls.',
      'Counting 0 by accident: int(started) excludes it here, but check whether your problem\'s range includes 0.',
      'Very long bounds given as strings, as in LC 2719: L - 1 needs string subtraction, or count f(R) - f(L) and check L by itself.',
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
    practice: [357, 788, 902, 2376, 1012],
    snippet: '24-digit-dp-template',
  },

  '10. DP on Strings (Pattern Matching / Parsing)': {
    crux: 'dp[i][j] = does s[..i] match p[..j] (or some property over two strings at indices i, j)?',
    signals: [
      '"Implement matching with support for \'.\' and \'*\'" or "\'?\' and \'*\'", followed by "the matching should cover the entire input string".',
      '"Count the number of distinct subsequences of s which equal t."',
      '"A string is scrambled by splitting it at any point" or "composed of at least two shorter words": try every split point.',
      '"The length of the longest valid parentheses substring": dp[i] = longest valid run ending at i.',
    ],
    notThis: [
      'A fixed pattern with no wildcards: use KMP or Z for O(n + m) with no table.',
      '"The minimum window that contains all the characters" (LC 76): counts in any order, so use a sliding window. LC 727 needs them in order, which is why it uses DP.',
      'Longest Happy String (LC 1405) is listed here but solved greedily with a heap.',
    ],
    concepts: [
      'Regex/Wildcard: special chars (`*`, `?`) introduce branching — `*` can mean "match zero" (dp[i][j-2]) or "match one more" (dp[i-1][j]).',
      'Distinct Subsequences: dp[i][j] = ways for s[..i] to form t[..j]; if s[i]==t[j] add dp[i-1][j-1].',
      'Scramble String / Concatenated Words: think about all possible split points and recurse.',
    ],
    example: {
      problem: 'Regular Expression Matching with s = "aa" and p = "a*"',
      lc: 10,
      walkthrough: [
        'm = 2 and n = 2. dp[0][0] = True. For j = 2, p[1] is \'*\', so dp[0][2] = dp[0][0] = True, because a* can match nothing.',
        'i = 1, j = 1: \'a\' matches \'a\', so dp[1][1] = dp[0][0] = True.',
        'i = 1, j = 2: \'*\' has two options. Zero copies gives dp[1][0] = False. One more copy gives dp[0][2] = True and p[0] matches s[0]. So dp[1][2] = True.',
        'i = 2, j = 1: dp[1][0] = False, so dp[2][1] = False.',
        'i = 2, j = 2: zero copies gives dp[2][0] = False. One more copy gives dp[1][2] = True and p[0] matches s[1]. So dp[2][2] = True.',
        'The answer is dp[2][2] = True.',
      ],
    },
    complexity: 'O(m * n) time and space for matching, or O(n) space with two rows. Scramble String is O(n^4), from n^3 memoized states with up to n splits each.',
    pitfalls: [
      'Mixing up the two `*` rules. In regex it repeats the previous character, so zero copies is dp[i][j-2]. In wildcard it stands alone, so zero characters is dp[i][j-1].',
      'Skipping the empty-string row: "a*b*" matches "", so dp[0][j] has to be seeded before the main loops.',
      'Taking dp[i-1][j] for regex `*` without first checking that p[j-2] matches s[i-1] or is \'.\'.',
      'Distinct Subsequences (LC 115): intermediate counts can overflow a C++ int, so use a wider type.',
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
    practice: [115, 32, 44, 10, 87],
    snippet: '29-regex-matching-dp',
  },

  '11. DP with Data Structures (Monotonic Stack/Queue, Segment Tree, BIT)': {
    crux: 'When the DP transition needs max/min over a range, swap an O(n) inner loop for an O(log n) (segment tree/BIT) or O(1) amortized (monotonic deque) lookup.',
    signals: [
      '"For every two consecutive integers in the subsequence, j - i <= k" or "you can jump at most k steps": dp[i] = nums[i] + the best of the last k values.',
      '"Maximize yi + yj + |xi - xj| where |xi - xj| <= k": rewrite it so one term depends only on j, then keep a window over those values.',
      '"The sum of min(b) over every subarray" or "the largest rectangle": each element needs its nearest smaller neighbor, which points to a monotonic stack.',
      'n is up to 10^5 and your first recurrence has an O(k) or O(n) inner loop.',
    ],
    notThis: [
      'k or n is small enough that the plain O(n * k) loop passes: don\'t add a structure you don\'t need.',
      'The range is over values rather than a sliding index window, as in LIS by value: use a BIT or segment tree, because a deque can\'t answer it.',
      'The recurrence only reads a fixed few neighbors: it\'s plain 1D DP from section 1.',
    ],
    concepts: [
      'Constrained Subsequence Sum / Jump Game VI: dp[i] = nums[i] + max(dp[i-k..i-1]) → monotonic deque on dp values.',
      'LIS via BIT/segment tree: dp[v] = 1 + max(dp[u] for u < v); range-max query keyed on value.',
      'Histogram-based DP (Maximal Rectangle): per-row histogram + monotonic stack for rectangle-in-histogram.',
    ],
    example: {
      problem: 'Constrained Subsequence Sum with nums = [10,2,-10,5,20] and k = 2',
      lc: 1425,
      walkthrough: [
        'i = 0, x = 10: the deque is empty, so dp[0] = 10. dq = [0] and ans = 10.',
        'i = 1, x = 2: dp[1] = 2 + 10 = 12. Index 0 is popped because 10 <= 12. dq = [1] and ans = 12.',
        'i = 2, x = -10: dp[2] = -10 + 12 = 2. Index 2 stays behind index 1 because 12 > 2. dq = [1,2] and ans = 12.',
        'i = 3, x = 5: index 1 is still in the window (1 >= 3 - 2). dp[3] = 5 + 12 = 17. Both indices are popped. dq = [3] and ans = 17.',
        'i = 4, x = 20: dp[4] = 20 + 17 = 37. dq = [4] and ans = 37.',
        'The answer is 37, from choosing 10, 2, 5 and 20.',
      ],
    },
    complexity: 'O(n) time and O(n) space with a monotonic deque, since each index enters and leaves once. O(n log n) time with a BIT or segment tree.',
    pitfalls: [
      'Reading the front before removing expired indices: the window is i - k to i - 1, so drop the front while dq[0] < i - k.',
      'Storing values rather than indices in the deque: you need the index to know when an entry has expired.',
      'Starting ans at 0 when all values are negative: the subsequence must be non-empty, so start at -inf.',
      'Using the wrong monotonic order: a window maximum needs decreasing values and a window minimum needs increasing ones.',
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
    practice: [1696, 907, 1425, 84, 85],
    snippet: '26-dp-with-monotonic-deque',
  },

  '12. Game Theory DP (Minimax)': {
    crux: 'dp[state] = (current player score - opponent score) assuming both play optimally; transition is max of "this move" minus the recursive call.',
    signals: [
      '"Both players play optimally" and "Alice and Bob take turns": this wording almost always means minimax.',
      '"Return true if the first player can guarantee a win" or "can force a win".',
      '"Take a pile from either end of the row" or "take 1, 2 or 3 stones from the front".',
      'The state describes only what\'s left, because the player whose turn it is can be worked out from it or doesn\'t matter.',
    ],
    notThis: [
      'A known winning pattern exists, as in Nim Game (LC 292): the answer is n % 4 != 0, with no table.',
      'Moves can return to an earlier state, as in Cat and Mouse (LC 913): memoized recursion may never finish, so work backwards from known outcomes with BFS.',
      'Optimal Account Balancing (LC 465) is listed here but has no opponent: it\'s bitmask or backtracking.',
    ],
    concepts: [
      'Symmetry trick: since both players play optimally, dp[state] from the current player\'s view = best move minus opponent\'s dp[next_state].',
      'Stone Game variants typically have dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]).',
      'For "can current player win?" boolean problems, dp[state] = exists move s.t. NOT dp[next_state].',
    ],
    example: {
      problem: 'Predict the Winner with nums = [1,5,2]',
      lc: 486,
      walkthrough: [
        'dp(i, j) is the best score lead for whoever moves next on nums[i..j].',
        'dp(1, 2) = max(5 - dp(2, 2), 2 - dp(1, 1)) = max(5 - 2, 2 - 5) = 3.',
        'dp(0, 1) = max(1 - dp(1, 1), 5 - dp(0, 0)) = max(1 - 5, 5 - 1) = 4.',
        'dp(0, 2) = max(1 - dp(1, 2), 2 - dp(0, 1)) = max(1 - 3, 2 - 4) = -2.',
        '-2 >= 0 is False, so player 1 can\'t win. Whichever end they take, the opponent gets the 5.',
      ],
    },
    complexity: 'O(n^2) time and space for dp(i, j) with two moves per state. In general it\'s states times moves per state, so Can I Win (LC 464) is O(2^n * n).',
    pitfalls: [
      'Adding the recursive call instead of subtracting: dp is the next player\'s lead, so it counts against you.',
      'Getting ties wrong: LC 486 treats a tie as a win (>= 0), while Stone Game III (LC 1406) reports "Tie" separately. Read the statement.',
      'Boolean games: you win if ANY move leaves the opponent in a losing state, not if all of them do.',
      'Tracking both players\' scores in the state: the score difference is enough, and it removes a dimension.',
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
    practice: [292, 877, 486, 1140, 1406],
  },

  '13. Counting DP / Combinatorics': {
    crux: 'dp[state] = NUMBER of ways to reach state; transitions ADD contributions from predecessors.',
    signals: [
      '"Return the number of ways" and "since the answer may be too large, return it modulo 10^9 + 7".',
      '"How many distinct phone numbers of length n can you dial" or "how many tilings of a 2 x n board".',
      '"Each vowel \'a\' may only be followed by an \'e\'": fixed transitions between a few states, repeated n times.',
      '"Sequences of different order are counted as different combinations" (LC 377): the wording tells you which loop goes outside.',
    ],
    notThis: [
      '"Return all possible paths": a count can\'t list them, so use backtracking, as in LC 797.',
      'A direct formula fits: Unique Paths is C(m+n-2, m-1), and Pickup and Delivery (LC 1359) is a running product.',
      'You want the best way rather than how many: that\'s optimization, with max or min in place of the sum.',
    ],
    concepts: [
      'Sum (not max/min) over all valid predecessors — every path is counted, not optimized.',
      'Almost always taken modulo 10^9 + 7; add the modulus after every addition.',
      'Combination Sum IV vs Coin Change II: the loop nesting order distinguishes permutations from combinations.',
    ],
    example: {
      problem: 'Number of Dice Rolls With Target Sum with n = 2, k = 3 and target = 4',
      lc: 1155,
      walkthrough: [
        'Start with dp = [1,0,0,0,0], because there\'s one way to reach sum 0 using no dice.',
        'Die 1: new[1], new[2] and new[3] each add dp[0] = 1, and new[4] stays 0. Now dp = [0,1,1,1,0].',
        'Die 2, s = 1: f = 1 reads dp[0] = 0, so new[1] = 0.',
        'Die 2, s = 2: dp[1] + dp[0] = 1 + 0 = 1.',
        'Die 2, s = 3: dp[2] + dp[1] + dp[0] = 1 + 1 + 0 = 2.',
        'Die 2, s = 4: dp[3] + dp[2] + dp[1] = 1 + 1 + 1 = 3.',
        'The answer is dp[4] = 3, from (1,3), (2,2) and (3,1).',
      ],
    },
    complexity: 'O(states * choices). The dice code is O(n * target * k) time and O(target) space, and a running prefix sum removes the k factor.',
    pitfalls: [
      'Taking the modulus only at the end: the values overflow long before then, and a product of two residues needs a 64-bit type in C++.',
      'Starting with dp[0] = 0: every count then stays 0, because the empty choice is what seeds the sum.',
      'Updating one array in place when each round must use exactly one die: that lets a die count twice, so this code builds `new` each round.',
      'Wrong loop order: item outside counts combinations (LC 518), and target outside counts orderings (LC 377).',
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
    practice: [62, 1155, 377, 935, 552],
    snippet: '7-coin-change-ii-number-of-combinations',
  },

  '14. Probability / Expected Value DP': {
    crux: 'dp[state] = probability/expected value at state; transitions are weighted SUMS (probability × next dp).',
    signals: [
      '"Return the probability that..." with "answers within 10^-5 of the actual answer will be accepted": the answer is a float.',
      '"After making exactly k moves, the knight remains on the board."',
      '"Alice draws numbers at random from [1, maxPts] until she has k or more points."',
      '"Flip each coin with probability prob[i]; the probability that exactly target coins face heads."',
    ],
    notThis: [
      'The problem asks "how many ways" with a modulo: use Counting DP in section 13.',
      'Airplane Seat Assignment (LC 1227) has a closed form: 1.0 for n = 1, otherwise 0.5.',
      'Transitions form cycles, such as expected steps on a board with loops: dp has no fill order, so set up a linear system.',
    ],
    concepts: [
      'Probability DP: dp[final_state] = sum over predecessors of dp[pred] * P(pred → final).',
      'Expected value DP: E[state] = sum over transitions of P(transition) * (cost + E[next]).',
      'When transitions form cycles (escape problems), set up a linear system instead of pure DP.',
    ],
    example: {
      problem: 'Knight Probability in Chessboard with N = 3, K = 2 and the knight at (0,0)',
      lc: 688,
      walkthrough: [
        'Start with dp[0][0] = 1.0.',
        'Move 1: from (0,0) only (2,1) and (1,2) stay on the board, and each gets 1/8. The other six moves lose their share.',
        'Move 2 from (2,1): only (0,0) and (0,2) stay on the board, and each gets 1/8 of 1/8 = 1/64.',
        'Move 2 from (1,2): only (2,0) and (0,0) stay on the board, and each gets 1/64.',
        'Now dp[0][0] = 2/64, dp[0][2] = 1/64 and dp[2][0] = 1/64.',
        'The answer is the sum of all cells: 4/64 = 0.0625.',
      ],
    },
    complexity: 'O(steps * states * moves). Knight Probability is O(K * N^2 * 8) time and O(N^2) space. New 21 Game (LC 837) gets to O(k + maxPts) with a running window sum.',
    pitfalls: [
      'Dividing by the number of valid moves: every move has probability 1/8, and moves off the board simply lose that mass.',
      'Writing into the same array during a step: a value would move twice in one round, so build `new` each step.',
      'Comparing floats with ==: compare within a tolerance, or use the accepted error from the statement.',
      'Soup Servings (LC 808): n can be 10^9, so cap it, because the answer is essentially 1 above about 5000.',
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
    practice: [688, 1230, 837, 808],
  },

  '15. DP on DAGs / Graph DP': {
    crux: 'Topological order + linear DP: dp[v] depends only on dp[predecessors of v].',
    signals: [
      '"Longest increasing path": moves must strictly increase, so the graph can\'t contain a cycle.',
      '"The number of ways you can arrive at your destination in the shortest amount of time": shortest paths form a DAG, and you count along it.',
      '"Each course takes time[i] months and has prerequisites": dependencies given as a DAG.',
      '"At most k stops" or "within maxTime": adding the budget as a dimension makes the state graph acyclic.',
    ],
    notThis: [
      'Cycles with non-negative weights and no hop limit: use Dijkstra, since no topological order exists.',
      'Course Schedule III (LC 630) is listed here but has no dependency graph: sort by deadline and use a regret heap.',
      'All edges cost the same and you want the shortest route: BFS is simpler.',
    ],
    concepts: [
      'Memoized DFS = automatic topological order (assuming the graph is acyclic).',
      'Longest path in a DAG (e.g., LIP in Matrix) = DP, NOT BFS — BFS gives shortest, not longest.',
      'Number of paths in a DAG: dp[v] = sum of dp[u] for u → v; start dp[source] = 1.',
    ],
    example: {
      problem: 'Longest Increasing Path in a Matrix with grid = [[1,2],[4,3]]',
      lc: 329,
      walkthrough: [
        'dfs(0,0) on value 1 has two larger neighbors: (1,0) with value 4, and (0,1) with value 2.',
        'dfs(1,0) on value 4 has no larger neighbor, so it returns 1. This makes best = 1 + 1 = 2 at (0,0).',
        'dfs(0,1) on value 2 has one larger neighbor, (1,1) with value 3.',
        'dfs(1,1) on value 3 moves to (1,0), which is cached as 1, so it returns 2. Then dfs(0,1) returns 1 + 2 = 3.',
        'Back at (0,0): best = max(2, 1 + 3) = 4.',
        'The other starting cells read cached values and give 3, 2 and 1. The answer is 4, along 1, 2, 3, 4.',
      ],
    },
    complexity: 'O(V + E) time and O(V) space, by memoized DFS or topological order. On a matrix that\'s O(m * n), since each cell has at most 4 edges. A budget dimension T multiplies it: O((V + E) * T).',
    pitfalls: [
      'Memoized DFS on a graph with a cycle never finishes. LC 329 is safe only because the move is strictly increasing: with >=, two equal neighbors would loop.',
      'Starting only from (0,0): the longest path can begin anywhere, so take the max over every cell.',
      'Deep recursion: a long snake-shaped path can exceed Python\'s limit, so raise it or use topological order.',
      'Counting paths in LC 1976: reset the count when you find a strictly shorter distance, and add to it only on a tie.',
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
    practice: [797, 1976, 787, 329, 2050],
    snippet: '21-longest-increasing-path-in-matrix',
  },

  '16. Partition / Subset DP': {
    crux: 'dp[i][k] = best/feasibility splitting the first i elements into k parts (or into subsets with a property).',
    signals: [
      '"Partition the array into two subsets such that the sums are equal": this is subset sum with target total / 2.',
      '"Split nums into k non-empty subarrays to minimize the largest sum": contiguous parts.',
      '"Schedule jobs in d days, where a day\'s difficulty is its hardest job": dp[i][k] tries every last part.',
      '"Distribute all cookies to k children and minimize the unfairness", with n <= 8: arbitrary subsets, so use a mask or backtracking.',
    ],
    notThis: [
      'Minimize the maximum with non-negative numbers (LC 410): binary search with a greedy check beats the O(n^2 * k) table.',
      'There\'s no limit on the number of parts, as in Word Break (LC 139): dp over prefixes in section 1 is enough.',
      'Merging neighbors has a cost that depends on the merged range: that\'s Interval DP in section 5.',
    ],
    concepts: [
      'Two flavors: (a) split a sequence into K contiguous parts; (b) partition into K subsets (often needs bitmask).',
      'For "minimize the max sum across K splits", binary-search the answer and greedily check feasibility.',
      'Subset-sum partition uses dp[c] = "can we form sum c" with 0/1 knapsack on capacities.',
    ],
    example: {
      problem: 'Partition Equal Subset Sum with nums = [1,5,11,5]',
      lc: 416,
      walkthrough: [
        'total = 22, which is even, so target = 11. Start with dp = {0}.',
        'x = 1: add 1. dp = {0,1}.',
        'x = 5: add 5 and 6. dp = {0,1,5,6}.',
        'x = 11: add 11. The sums 12, 16 and 17 are over target, so they\'re dropped. dp = {0,1,5,6,11}.',
        'x = 5: add 10. The new 5, 6 and 11 are already there, and 16 is over target. dp = {0,1,5,6,10,11}.',
        '11 is in dp, so the answer is True: {11} and {1,5,5}.',
      ],
    },
    complexity: 'Subset sum is O(n * target) time and O(target) space. A k-part contiguous split is O(n^2 * k) time and O(n * k) space. Partitioning into k arbitrary subsets with a mask is O(2^n * n).',
    pitfalls: [
      'Running the DP on an odd total: return False right away.',
      'Using a forward boolean array for 0/1 subset sum: it reuses the same item. Loop capacity downwards, or build the new sums first as this set comprehension does.',
      'Allowing empty parts when they must be non-empty: dp[i][k] is only valid for i >= k.',
      'LC 410 binary search: lo must start at max(nums), because no part can be smaller than its largest element.',
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
    practice: [416, 698, 813, 410, 1335],
    snippet: '8-subset-sum',
  },

  '17. DP with Greedy / Binary Search Optimization': {
    crux: 'Replace an O(n) inner DP loop with binary search OR collapse a DP recurrence into a monotone "can-we-achieve(x)" check.',
    signals: [
      '"Minimize the largest sum" or "the minimum eating speed to finish within h hours": a yes/no check on the answer that flips only once.',
      '"One envelope fits into another only if both its width and height are greater": sort by one dimension, then run LIS on the other.',
      '"Longest increasing subsequence" with n up to 10^5: O(n^2) is too slow, so use tails.',
      '"With k eggs, find the minimum number of moves to determine f with certainty": the direct table is too slow, so optimize the transition or flip the state.',
    ],
    notThis: [
      'The check isn\'t monotone: if success at x doesn\'t imply success at x + 1, binary search on the answer gives wrong results.',
      'Koko (LC 875) and Nth Magical Number (LC 878) are listed here but need no table: they\'re binary search with a formula or a greedy check.',
      'You need the actual subsequence: tails alone can\'t give it, so keep parent pointers.',
    ],
    concepts: [
      'LIS in O(n log n): maintain tails[]; bisect_left on each x to find its pile.',
      'Split Array Largest Sum: binary search the max-group-sum; greedy check feasibility.',
      'Super Egg Drop: the standard O(kn²) DP collapses to O(kn log n) via binary search on the DP transition.',
    ],
    example: {
      problem: 'Russian Doll Envelopes with envelopes = [[5,4],[6,4],[6,7],[2,3]]',
      lc: 354,
      walkthrough: [
        'Sort by width ascending, then height descending on ties: [2,3], [5,4], [6,7], [6,4].',
        'h = 3: tails is empty, so append it. tails = [3].',
        'h = 4: i = 1 is past the end, so append it. tails = [3,4].',
        'h = 7: i = 2 is past the end, so append it. tails = [3,4,7].',
        'h = 4: bisect_left finds i = 1, so tails[1] = 4 and nothing changes. tails = [3,4,7].',
        'The answer is len(tails) = 3, from [2,3], [5,4], [6,7].',
      ],
    },
    complexity: 'O(n log n) time and O(n) space for tails. Binary search on the answer is O(check * log(range)), where a greedy check is usually O(n). Super Egg Drop is O(k * n log n) with binary search on the transition.',
    pitfalls: [
      'Sorting ties by ascending height: [6,4] and [6,7] would then chain together even though their widths are equal.',
      'bisect_left vs bisect_right: left gives strictly increasing and right gives non-decreasing.',
      'Reading tails as a real subsequence: only its length is meaningful. For example, [2,3,1] ends as tails = [1,3], but the 1 comes after the 3 in the input.',
      'Binary search bounds: lo must be the smallest possibly valid value, and mid must round the right way to avoid an endless loop.',
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
    practice: [875, 300, 354, 410, 887],
    snippet: '14-lis-o-n-log-n',
  },

  '18. Multi-dimensional / Complex State DP': {
    crux: 'When 1D/2D state is insufficient, add dimensions (count, position, mask, last-choice) — but verify the state space stays tractable.',
    signals: [
      '"The minimum number of steps to spell all the characters in the keyword": position in the key plus position on the ring.',
      '"At most n members and at least minProfit": two budgets, with one of them capped at its floor.',
      '"Absent fewer than 2 days total and never late 3 or more consecutive days": a few small counters beside the position.',
      '"If the frog\'s last jump was k units": the next move depends on how you arrived, not only where you are.',
    ],
    notThis: [
      'One dimension follows from the others: drop it. In LC 1269, the position can\'t go past steps / 2, which also caps the table.',
      'A sort makes the state unnecessary, as in Reducing Dishes (LC 1402): try sorting first, and only then add dimensions.',
      'Maximum Profit in Job Scheduling (LC 1235): sorting by time gives a 1D dp with binary search.',
    ],
    concepts: [
      'Freedom Trail: dp[i][j] = min steps to spell key[..i] with ring rotated so j is at 12 o\'clock.',
      'Profitable Schemes: dp[i][members][profit] — 3D over items × resource × profit floor.',
      'Always sanity-check: states × transition cost ≤ ~10^8 for typical TL.',
    ],
    example: {
      problem: 'Freedom Trail with ring = "godding" and key = "gd"',
      lc: 514,
      walkthrough: [
        'dp(i, j) is the fewest steps to spell key[i..] with the pointer at ring index j. \'g\' is at 0 and 6, and \'d\' is at 2 and 3.',
        'dp(1, 0), spelling \'d\' from index 0: k = 2 costs 2 + 1 = 3, and k = 3 costs 3 + 1 = 4. The best is 3.',
        'dp(1, 6), spelling \'d\' from index 6: k = 2 has distance min(4, 3) = 3, so it costs 4. k = 3 has distance min(3, 4) = 3, so it costs 4. The best is 4.',
        'dp(0, 0), spelling \'g\': k = 0 costs 0 + 1 + dp(1, 0) = 4. k = 6 has distance min(6, 1) = 1, so it costs 1 + 1 + dp(1, 6) = 6.',
        'The answer is 4: press g, rotate two to d, press d.',
      ],
    },
    complexity: 'O(product of dimension sizes * transitions per state). Freedom Trail is O(K * R^2) time and O(K * R) space. Keep the total under about 10^8 operations.',
    pitfalls: [
      'Storing exact profit in Profitable Schemes: cap it at minProfit, or the table grows for no benefit.',
      'Taking the plain distance on a ring: the shorter way round is min(d, R - d).',
      'Leaving out the press: each character costs one extra step on top of the rotation.',
      'Allocating the full 3D table when only the previous layer is read: roll the first dimension to save memory.',
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
    practice: [2327, 1269, 403, 514, 879],
  },

  '19. DP on Trees (Rerooting / Advanced)': {
    crux: 'Two passes over the tree: first computes subtree answers; second "rerooting" pass propagates parent-side info to every node in O(n) total.',
    signals: [
      '"Return an array where answer[i] is the sum of the distances between node i and all other nodes": an answer for every root.',
      '"Find all the roots that give minimum height trees" (LC 310): again, every root is a candidate.',
      'An undirected tree given as an edge list, with n up to about 10^4 to 10^5: a DFS from each node would cost O(n^2).',
      '"The longest path where every node has the same value" or "the largest BST subtree": one post-order pass that returns several values per node.',
    ],
    notThis: [
      'Only one answer for a fixed root: a single post-order from section 6 is enough.',
      'Queries about paths between pairs of nodes, as in LC 2846: use LCA or binary lifting instead of rerooting.',
      'The input isn\'t a tree: moving the root no longer changes just one edge, so this delta doesn\'t hold.',
    ],
    concepts: [
      'Rerooting transforms a single-root tree DP into "answer for every possible root".',
      'Key invariant: when you move the root from u to neighbor v, only the edges incident to u and v change in contribution.',
      'Pattern: dfs1 fills down[u]; dfs2 fills up[u] using up[parent] + (sum of siblings\' down values).',
    ],
    example: {
      problem: 'Sum of Distances in Tree on the path 0 - 1 - 2, so n = 3',
      lc: 834,
      walkthrough: [
        'dfs1 runs post-order from node 0. Node 2 is a leaf: count[2] = 1 and ans[2] = 0.',
        'Node 1: count[1] = 2 and ans[1] = 0 + 1 = 1. Here ans[u] means the distance sum within u\'s subtree.',
        'Node 0: count[0] = 3 and ans[0] = 1 + 2 = 3. Only the root\'s value is the full answer so far.',
        'dfs2 runs pre-order. Moving the root to 1: ans[1] = 3 - 2 + (3 - 2) = 2, because 2 nodes get closer and 1 gets farther.',
        'Moving the root to 2: ans[2] = 2 - 1 + (3 - 1) = 3.',
        'The answer is [3,2,3]. As a check, node 1 is one step from each of the other two, which gives 2.',
      ],
    },
    complexity: 'O(n) time for the two passes. O(n) space for the adjacency list and for recursion, which reaches depth n on a chain.',
    pitfalls: [
      'Swapping the pass order: dfs1 updates after the recursive call, while dfs2 must set ans[v] before it recurses into v.',
      'Forgetting the parent check on an undirected tree: the DFS walks straight back and never ends.',
      'Rerooting with max, which can\'t be subtracted out: keep the top two child values, or use prefix and suffix arrays.',
      'Recursion depth on a chain: LC 834 allows n = 3 * 10^4, which is past Python\'s default limit.',
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
    practice: [1110, 687, 310, 124, 834],
    snippet: '19-tree-dp-diameter-style',
  },

  '20. Profile / Broken Profile DP': {
    crux: 'dp[row][profile_mask] = ways to fill rows 0..row such that the boundary "profile" with the next row is profile_mask.',
    signals: [
      '"The number of ways to tile an m x n board" with one side small.',
      '"Paint a grid of size n x 3 so that no two adjacent cells share a color": the next row only cares about the row before it.',
      '"Seat students so that none can copy from a neighbor" with at most 8 columns: each row\'s seating is a mask, checked against the previous row.',
      'One dimension is about 12 or less, while the other may be much larger.',
    ],
    notThis: [
      'Neither dimension is under about 20: a profile mask won\'t fit in memory.',
      'Items have no grid layout: plain Bitmask DP from section 8 applies. Connecting Two Groups (LC 1595) is listed here but works as dp over a mask of one group.',
      'Rows don\'t affect each other: solve each row separately and combine.',
    ],
    concepts: [
      'Profile encodes which cells of the next row are already covered by a tile placed in this row.',
      'Tile placements in row i ⟹ a partial fill mask that defines the START state for row i+1.',
      'For "broken profile" (single-cell granularity), state = (row, col, mask of last #cols cells).',
    ],
    example: {
      problem: 'Tile a 2 x N board with dominoes, with N = 4',
      walkthrough: [
        'Start with dp[0] = 1 (the empty board) and dp[1] = 1 (one vertical domino).',
        'dp[2] = dp[1] + dp[0] = 2: two vertical, or two horizontal.',
        'dp[3] = dp[2] + dp[1] = 3.',
        'dp[4] = dp[3] + dp[2] = 5.',
        'The answer is 5. The last column is either one vertical domino, leaving dp[i-1], or two stacked horizontal ones, leaving dp[i-2].',
      ],
    },
    complexity: 'Row by row, O(rows * 4^cols) time at worst from checking pairs of masks. Broken profile is O(rows * cols * 2^cols). Space is O(2^cols) with rolling rows. This 2 x N warm-up is O(N) time and space.',
    pitfalls: [
      'Putting the mask on the long side: swap the dimensions so the mask covers the smaller one.',
      'Vague bit meaning: decide whether a set bit means "already filled by the row above" or "free", and keep it consistent across transitions.',
      'Using this recurrence on LC 790: trominoes add partial states, and the tiling count becomes dp[i] = 2 * dp[i-1] + dp[i-3].',
      'N = 0 in this code: dp has size 1, so writing dp[1] fails. Check the constraints or guard it.',
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
    practice: [790, 1411, 1349, 1595],
  },

  '21. SOS (Sum over Subsets) DP': {
    crux: 'Compute, for every mask, the sum/aggregate of f(submask) over ALL submasks — in O(n · 2^n) instead of O(3^n).',
    signals: [
      '"For each array element x, find any y in the array with x & y == 0": this needs a query over all submasks of ~x.',
      '"For every mask, the sum or count over all of its subsets (or supersets)".',
      'Values fit in about 20 bits and queries are around 10^6: looping over submasks per query costs O(3^n) in total.',
      'Inclusion-exclusion over subsets, such as "how many pairs share no set bit".',
    ],
    notThis: [
      'One or a few queries: a direct loop over the array is simpler.',
      'Most problems here are a different mask pattern. Smallest Sufficient Team (LC 1125) and Maximize Score (LC 1799) are Bitmask DP from section 8, and Count Maximum OR Subsets (LC 2044) can be brute-forced with n <= 16.',
      'Closest Subsequence Sum (LC 1755) is listed here but is meet in the middle: it asks about sums rather than submasks.',
    ],
    concepts: [
      'SOS / Zeta transform: for each bit b, for each mask with bit b set, dp[mask] += dp[mask ^ (1<<b)].',
      'After the transform, dp[mask] aggregates f over all subsets of mask.',
      'Inverse (Möbius transform) recovers f from the SOS array — useful for inclusion-exclusion.',
    ],
    example: {
      problem: 'Sum over subsets with n = 2 and f = [1,2,3,4]',
      walkthrough: [
        'f[mask] starts as the value stored at exactly that mask.',
        'b = 0, masks with bit 0 set: f[1] += f[0], giving 3. f[3] += f[2], giving 7. Now f = [1,3,3,7].',
        'b = 1, masks with bit 1 set: f[2] += f[0], giving 4. f[3] += f[1], giving 10. Now f = [1,3,4,10].',
        'Check: f[3] = 1 + 2 + 3 + 4 = 10, the sum over all four submasks of 11, and f[2] = 1 + 3 = 4 over submasks 00 and 10.',
      ],
    },
    complexity: 'O(n * 2^n) time and O(2^n) space, in place, where n is the number of bits.',
    pitfalls: [
      'Putting the mask loop outside the bit loop: some submasks then get added more than once. The bit loop must be the outer one.',
      'Supersets need the opposite test: if bit b is NOT set, f[mask] += f[mask | (1 << b)].',
      'Sizing by array length: n here is the bit width of the values, so values up to 10^6 need n = 20.',
      'Inverting the transform with += : the Möbius inverse uses the same loops with -=.',
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
    practice: [2044, 1799, 1125, 2172, 1755],
  },

  "22. Classic Must-Know Problems (Misc)": {
    crux: 'Compact DP recurrences with O(1) or O(log n) per element — pattern recognition saves you from reinventing.',
    signals: [
      '"Find the subarray with the largest sum" or "largest product": a contiguous run where you either extend or start fresh at each element.',
      '"For every i in the range [0, n], return the number of 1\'s in the binary representation": each answer builds on a smaller number.',
      '"Differences between successive numbers strictly alternate": wiggle and turbulent problems keep two states, up and down.',
      '"Largest subset where every pair is divisible" or "longest pair chain": sort first, then LIS shape.',
    ],
    notThis: [
      'Several problems here aren\'t DP. Trapping Rain Water (LC 42) is two pointers, Minimum Window Substring (LC 76) is a sliding window, and Longest Consecutive Sequence (LC 128) is a hash set.',
      'Maximal Network Rank (LC 1615) is degree counting on a graph, and Count Primes (LC 204) is a sieve.',
      'A subarray with an exact target sum: use prefix sums and a hash map, because Kadane only finds the maximum.',
    ],
    concepts: [
      "Kadane's: cur = max(x, cur + x); track global max.",
      'Maximum Product Subarray: track BOTH cur_max AND cur_min (negatives flip them).',
      'Counting Bits: dp[i] = dp[i >> 1] + (i & 1) — elegant recurrence using the LSB.',
    ],
    example: {
      problem: 'Maximum Product Subarray with nums = [-2,3,-4]',
      lc: 152,
      walkthrough: [
        'Start with cur_max = cur_min = ans = -2.',
        'x = 3: cur_max = max(3, -6) = 3. cur_min = min(3, -6) = -6. ans = 3.',
        'x = -4: it\'s negative, so swap first, making cur_max = -6 and cur_min = 3.',
        'Then cur_max = max(-4, -6 * -4) = 24 and cur_min = min(-4, 3 * -4) = -12. ans = 24.',
        'The answer is 24, from the whole array. The running minimum of -6 became the new maximum once it met another negative.',
      ],
    },
    complexity: 'O(n) time and O(1) space for Kadane and Maximum Product. O(n) time and space for Counting Bits. O(n^2) time for Largest Divisible Subset.',
    pitfalls: [
      'Starting Kadane at 0: an all-negative array then returns 0, but the subarray must be non-empty. Start from nums[0].',
      'Computing cur_min with the cur_max you just changed: swap first, or save the old value.',
      'Dropping the `max(x, ...)` option: that\'s what lets a run restart after a zero.',
      'Product overflow in C++: intermediate products can exceed int, so use a wider type.',
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
    practice: [338, 53, 152, 646, 376],
  },
}
