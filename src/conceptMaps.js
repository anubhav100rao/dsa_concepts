// Concept maps for each sub-section, keyed by topicId then by section heading
// (without the leading "## "). Each entry can have: crux, concepts[],
// pointsToPonder[], code (string, language defaults to Python-ish pseudocode).

const greedy = {
  '1. Sorting + Greedy (Sort-Then-Decide)': {
    crux: 'Pick the right sort order, then sweep once making irrevocable local decisions.',
    concepts: [
      'The sort criterion IS the algorithm — end-time, deadline, ratio, or a custom a+b vs b+a comparator each define a different problem.',
      'After sorting, a single linear pass with a small running state (last end, total, count) is usually enough.',
      'Two-pointer pairing (greedy match smallest-with-largest or smallest-with-smallest) is a frequent sub-pattern.',
    ],
    pointsToPonder: [
      'Why does this particular sort order yield a globally optimal answer and not just a locally good one?',
      'Is your comparator transitive? A non-transitive one (a<b, b<c, but a>c) silently breaks sort.',
      'What invariant does the running state preserve after each accepted element?',
    ],
    code: `# Sort-then-decide skeleton
items.sort(key=chosen_key)
state = init
for x in items:
    if good(x, state):
        take(x)
        state = update(state, x)`,
  },

  '2. Interval Scheduling / Merging': {
    crux: 'Sort by END time to pack the most non-overlapping intervals; sort by START to merge.',
    concepts: [
      'Activity selection: sort by end time, greedily take the interval whose start ≥ last chosen end.',
      'Merge intervals: sort by start; if next.start ≤ cur.end, extend cur.end = max(cur.end, next.end).',
      'Min meeting rooms = max overlap = sweep-line with a +1/-1 timeline, or a min-heap of end times.',
    ],
    pointsToPonder: [
      'Why does sorting by end time (not start, not length) maximize the count of non-overlapping intervals?',
      'How do open vs closed endpoints change the answer (touching-at-a-point: overlap or not)?',
      'When do you need a heap (rooms, regret) vs a single pointer (count, merge)?',
    ],
    code: `# Max non-overlapping intervals
intervals.sort(key=lambda x: x[1])
end, count = -inf, 0
for s, e in intervals:
    if s >= end:
        count += 1
        end = e`,
  },

  '3. Jump Game Family (Greedy Range Extension)': {
    crux: 'Track the farthest index reachable so far; extend the "current frontier" lazily.',
    concepts: [
      'Reachability (Jump Game I): walk left-to-right, if i > farthest you are stuck; else farthest = max(farthest, i + nums[i]).',
      'Min jumps (Jump Game II): BFS-like — `end` marks the boundary of the current jump level; when i == end, you must spend a jump and advance end to farthest.',
      'Refueling / taps / video stitching: treat reachable range as the state and pick the option that extends it the most.',
    ],
    pointsToPonder: [
      'Why is updating farthest at every i (not just at the boundary) the correct invariant?',
      'How does this differ from BFS on an explicit graph — and why is it strictly faster?',
      'When does this generalize to a heap-based "best future option" (refueling)?',
    ],
    code: `# Jump Game II — min jumps
farthest = end = jumps = 0
for i in range(len(nums) - 1):
    farthest = max(farthest, i + nums[i])
    if i == end:
        jumps += 1
        end = farthest`,
  },

  '4. Activity Selection / Scheduling': {
    crux: 'Order tasks by a deadline/priority, then either greedily accept or swap out a worse past pick.',
    concepts: [
      'Earliest-deadline-first ordering is the default for deadline-bounded scheduling.',
      'A max-heap of accepted tasks enables "regret": if a new task does not fit, evict the worst already accepted if it is worse than the new one.',
      'Task Scheduler with cooldown is a counting problem, not a sort problem: layout governed by the most frequent task.',
    ],
    pointsToPonder: [
      'When is pure greedy (no swap) optimal vs when do you NEED a regret heap?',
      'Why does the (max_freq - 1) * (k + 1) + tied_count formula work for Task Scheduler?',
      'Does adding a "profit" dimension force you out of pure greedy into DP?',
    ],
    code: `# Course Schedule III — regret heap
courses.sort(key=lambda c: c[1])  # by deadline
heap, time = [], 0
for dur, ddl in courses:
    heapq.heappush(heap, -dur)
    time += dur
    if time > ddl:
        time += heapq.heappop(heap)  # drop longest`,
  },

  "5. Greedy + Heap (Regret-Based / Exchange Argument)": {
    crux: 'Commit greedily as you go, but keep a heap of past decisions so you can "undo" the worst one when a better option appears.',
    concepts: [
      'Pattern: scan in some order → push current into heap → if constraint violated, pop the worst.',
      'Course Schedule III, IPO, Minimum Refueling Stops, Furthest Building are all this exact pattern with different "worst" definitions.',
      'The heap is not a priority queue of FUTURE options — it is a priority queue of PAST commitments you may want to revoke.',
    ],
    pointsToPonder: [
      'What is the regret quantity for this problem (longest duration? smallest fuel? shortest ladder use?)?',
      'Why does evicting the worst past commitment preserve optimality (the exchange step)?',
      'How does the scan order interact with the heap — would reversing the order still work?',
    ],
    code: `# Minimum Refueling Stops
heap, stops, fuel = [], 0, startFuel
i = 0
while fuel < target:
    while i < len(stations) and stations[i][0] <= fuel:
        heapq.heappush(heap, -stations[i][1]); i += 1
    if not heap: return -1
    fuel += -heapq.heappop(heap); stops += 1
return stops`,
  },

  '6. Two Pointer Greedy': {
    crux: 'Two pointers from opposite ends; on each step, move the one whose move cannot improve the answer.',
    concepts: [
      'Container With Most Water: area is bounded by the shorter wall, so move the shorter pointer — the taller one cannot improve area while paired with anything shorter.',
      'Boats / Assign Cookies: pair smallest-with-largest (or smallest-with-smallest) to satisfy a capacity constraint.',
      '3Sum / 3Sum Closest: fix one, then two-pointer the rest of a sorted array.',
    ],
    pointsToPonder: [
      'Why is moving the smaller-side pointer always safe (no better partner exists on its side)?',
      'What loop invariant guarantees you do not miss the optimal pair?',
      'When does this technique require a sorted array vs work on any sequence?',
    ],
    code: `# Container With Most Water
l, r, best = 0, len(h) - 1, 0
while l < r:
    best = max(best, min(h[l], h[r]) * (r - l))
    if h[l] < h[r]: l += 1
    else: r -= 1`,
  },

  '7. Greedy String Construction / Manipulation': {
    crux: 'Build the answer char by char; use a stack to retract earlier choices that turned out worse.',
    concepts: [
      'Lexicographic-smallest result + budget of K removals → monotonic increasing stack; pop while top > current and budget remains.',
      'Remove Duplicate Letters: same stack pattern, but also enforce "do not pop the last occurrence".',
      'For "largest" or "reorganize" variants, use a max-heap of (count, char) to always emit the most-available legal char.',
    ],
    pointsToPonder: [
      'When is it safe to pop a character you already placed (will it appear again later)?',
      'For Reorganize String, why must max-freq ≤ (n+1)/2 hold for a solution to exist?',
      'How does "must keep at least one of each" change the monotonic-stack rule?',
    ],
    code: `# Remove K Digits — smallest number after K removals
stack = []
for c in num:
    while stack and stack[-1] > c and k > 0:
        stack.pop(); k -= 1
    stack.append(c)
result = ''.join(stack[:len(stack)-k]).lstrip('0')
return result or '0'`,
  },

  '8. Greedy Array Manipulation / Transformation': {
    crux: 'Maintain a small running quantity (current sum, min seen, deficit) and make local decisions against it.',
    concepts: [
      "Kadane: cur = max(x, cur + x) — restart when prefix becomes a liability.",
      'Best Time to Buy/Sell I: track running min, take max(profit, price - min).',
      'Gas Station: total≥0 ⇒ a solution exists; the unique start is the index right after the last "tank goes negative".',
    ],
    pointsToPonder: [
      'Why does Kadane\'s reset rule never miss the global maximum subarray?',
      'In Gas Station, why is the reset point provably the (unique) valid start when total ≥ 0?',
      'How does median (not mean) minimize sum of absolute deviations (Min Moves II)?',
    ],
    code: `# Kadane's algorithm
cur = best = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)`,
  },

  '9. Greedy Graph / Tree': {
    crux: 'For graphs: sort edges + union-find (Kruskal) or grow a tree (Prim). For trees: post-order, decide at each node from its children.',
    concepts: [
      'MST cut property: the lightest edge crossing any cut is in some MST — justifies Kruskal/Prim greedy.',
      'Tree DP-greedy: at a node, aggregate child answers and make a local decision (Binary Tree Cameras, Distribute Coins).',
      'Rerooting: compute answer for one root, then transition to neighbors in O(1) — turns O(n²) into O(n).',
    ],
    pointsToPonder: [
      'Why does picking the locally-cheapest edge (Kruskal) never trap you globally?',
      'For Binary Tree Cameras, why is post-order (children decide first) the right traversal direction?',
      'When does a tree problem decompose cleanly into "greedy at each node" vs need full DP?',
    ],
    code: `# Kruskal's MST
edges.sort(key=lambda e: e[2])
parent = list(range(n))
total = 0
for u, v, w in edges:
    if find(u) != find(v):
        union(u, v); total += w`,
  },

  '10. Greedy + Binary Search': {
    crux: 'Binary search the answer; verify feasibility with a greedy O(n) check.',
    concepts: [
      'Predicate must be MONOTONIC in the search variable (if X works, X+1 also works — or vice versa).',
      'The crux is the feasibility function: usually a one-pass greedy simulation.',
      'Split-Array-Largest-Sum / Ship-Packages: search the max-group-sum; greedy packs left-to-right.',
    ],
    pointsToPonder: [
      'How do you prove monotonicity? (often "more budget ⇒ more capability")',
      'Are you searching on an integer answer, a float, or an index? Halt condition changes.',
      'Is the greedy check provably optimal for a fixed answer, or only a sufficient bound?',
    ],
    code: `# Capacity to Ship Packages — search answer + greedy check
def canShip(cap):
    days, load = 1, 0
    for w in weights:
        if load + w > cap: days += 1; load = 0
        load += w
    return days <= D

lo, hi = max(weights), sum(weights)
while lo < hi:
    mid = (lo + hi) // 2
    if canShip(mid): hi = mid
    else: lo = mid + 1`,
  },

  '11. Greedy Counting / Frequency': {
    crux: 'Counter + a rule keyed on max frequency (or "last seen index" for partitioning).',
    concepts: [
      'Partition Labels: precompute last[c]; extend partition end = max(end, last[c]) until i == end.',
      'Task Scheduler with cooldown k: answer = max(n, (max_freq - 1) * (k + 1) + count_of_max).',
      'Min Deletions for Unique Frequencies: decrement collisions; greedy walks frequencies downward.',
    ],
    pointsToPonder: [
      'Why does the "extend to max last-seen" rule always produce the maximum number of partitions?',
      'In Task Scheduler, why does the most-frequent task dominate the lower bound?',
      'For frequency-uniqueness problems, why is "always reduce the duplicate to the next free slot" optimal?',
    ],
    code: `# Partition Labels
last = {c: i for i, c in enumerate(s)}
parts, start, end = [], 0, 0
for i, c in enumerate(s):
    end = max(end, last[c])
    if i == end:
        parts.append(i - start + 1); start = i + 1`,
  },

  '12. Greedy Digit / Number Construction': {
    crux: 'Walk digits left-to-right (for max) or right-to-left (for monotone fix-up) and patch the first violation with 9s.',
    concepts: [
      'Monotone Increasing Digits: scan right-to-left, on a drop decrement the left digit and 9-pad to the right.',
      'Maximum Swap: for each digit, swap with the LATEST occurrence of the largest digit to its right.',
      'Next Permutation: find first decreasing pair from the right, swap with the smallest-larger suffix digit, reverse the suffix.',
    ],
    pointsToPonder: [
      'For Max Swap, why is "swap with the LAST occurrence of the max" required and not just any occurrence?',
      'Why does decrementing once + 9-padding always produce the largest valid monotone result?',
      'How do leading zeros / negative numbers change the greedy rule?',
    ],
    code: `# Monotone Increasing Digits
d = list(str(n))
marker = len(d)
for i in range(len(d) - 1, 0, -1):
    if d[i - 1] > d[i]:
        d[i - 1] = str(int(d[i - 1]) - 1)
        marker = i
for i in range(marker, len(d)):
    d[i] = '9'`,
  },

  '13. Greedy Partitioning / Splitting': {
    crux: 'Extend the current partition until a closing condition is forced; then start a new one.',
    concepts: [
      'Partition Labels: close when i reaches max last-seen.',
      'Optimal Partition of String: close when adding the next char would introduce a duplicate.',
      'Split Array Largest Sum: when paired with binary search, the greedy "extend until > cap, then close" packs optimally.',
    ],
    pointsToPonder: [
      'Why is "close at the earliest legal moment" always optimal for these problems?',
      'When do you need DP because greedy partitioning can be tricked by future cost?',
      'How does the closing rule encode the problem\'s constraint exactly?',
    ],
    code: `# Optimal Partition of String — fewest substrings of unique chars
seen, count = set(), 1
for c in s:
    if c in seen:
        count += 1; seen = {c}
    else:
        seen.add(c)`,
  },

  '14. Greedy with Math / Geometry': {
    crux: 'Find an invariant — parity, median, GCD, perfect-square count — and let it drive the choice.',
    concepts: [
      'Median minimizes Σ|x - m| (the L1 optimal point).',
      'Bulb Switcher: a bulb ends ON iff it has an odd number of divisors iff it is a perfect square.',
      'Broken Calculator: work BACKWARD from target — halving when even is strictly better than doubling many times.',
    ],
    pointsToPonder: [
      'Why is the median (not the mean) the L1 optimum?',
      'For Broken Calculator, why is the reverse direction more tractable than the forward direction?',
      'When is "work backwards from the goal" the unlocking move?',
    ],
    code: `# Broken Calculator (backward greedy)
ops = 0
while target > start:
    if target % 2: target += 1
    else: target //= 2
    ops += 1
return ops + (start - target)`,
  },

  '15. Greedy + Stack (Monotonic Stack Greedy)': {
    crux: 'Maintain a monotonic stack; pop when the top is worse than the incoming element under the chosen ordering.',
    concepts: [
      'Decreasing stack ⇒ each pop computes a "next greater" answer; increasing stack ⇒ "next smaller".',
      'Remove K Digits and Most Competitive Subsequence: same monotonic-stack template, just different budget logic.',
      'Asteroid Collision / Car Fleet: the stack tracks survivors after pairwise greedy resolution.',
    ],
    pointsToPonder: [
      'Increasing vs decreasing stack — which direction does THIS problem need?',
      'When you pop, are you finalizing an answer (next-greater) or discarding a bad past choice (Remove K Digits)?',
      'What is the amortized complexity argument — why O(n) and not O(n²)?',
    ],
    code: `# Monotonic stack template (next greater element)
stack, ans = [], [-1] * len(nums)
for i, x in enumerate(nums):
    while stack and nums[stack[-1]] < x:
        ans[stack.pop()] = x
    stack.append(i)`,
  },

  '16. Greedy Bit Manipulation': {
    crux: 'Process bits from the MOST significant; greedily set the current bit if a valid completion still exists.',
    concepts: [
      'Maximum XOR: for each bit from MSB, try to set it; check if some pair achieves it (often via a trie).',
      'Score After Flipping Matrix: leftmost column must all be 1 (flip rows to ensure); for each later column, flip to majority-1.',
      'MSB-first greedy works because one MSB is worth more than all lower bits combined.',
    ],
    pointsToPonder: [
      'Why is greedy bit-setting MSB-first provably optimal?',
      'When do you need a trie of bits vs can you do it with sets / maps?',
      'How does parity / XOR identity shape the greedy step in flip problems?',
    ],
    code: `# Maximum XOR of two numbers (greedy with prefix set)
ans, mask = 0, 0
for bit in range(31, -1, -1):
    mask |= 1 << bit
    prefixes = {x & mask for x in nums}
    candidate = ans | (1 << bit)
    if any(candidate ^ p in prefixes for p in prefixes):
        ans = candidate`,
  },

  '17. Gas Station / Circular Greedy': {
    crux: 'Reset the start index whenever the running tank goes negative; total≥0 ⇒ that reset point is the unique answer.',
    concepts: [
      'Gas Station: one pass; track tank and total; if tank dips below 0, reset start = i+1, tank = 0.',
      'Candy: two passes (left-then-right) and take max — a constant-time-per-element greedy.',
      'Circular subarrays: max circular sum = max(linear Kadane, total - min subarray) with an all-negative edge case.',
    ],
    pointsToPonder: [
      'Why does the FIRST station after a negative tank dip always work when total ≥ 0?',
      'For circular arrays, why does the "total - min" trick work, and what edge case does it miss?',
      'When does symmetry of the array let you use one pass instead of two?',
    ],
    code: `# Gas Station
total = tank = start = 0
for i, (g, c) in enumerate(zip(gas, cost)):
    total += g - c; tank += g - c
    if tank < 0:
        start = i + 1; tank = 0
return start if total >= 0 else -1`,
  },

  '18. Greedy Matrix / Grid': {
    crux: 'Fix the highest-value row/column first, then sweep remaining rows/columns greedily.',
    concepts: [
      'Score After Flipping Matrix: ensure column 0 is all 1s (flip rows as needed); then for each later column, flip if it has more 0s than 1s.',
      'Each column contributes 2^(cols - col - 1) — leftmost columns dominate, so prioritize them.',
      'Many grid greedy problems are "set the most valuable bit/cell first" in disguise.',
    ],
    pointsToPonder: [
      'Why does fixing the leftmost column first never preclude optimal choices for later columns?',
      'When is row-flip independent of column-flip — and when does the order matter?',
      'How does the geometric decay of column value (powers of 2) justify the greedy priority?',
    ],
    code: `# Score After Flipping Matrix
for r in range(R):
    if grid[r][0] == 0:
        for c in range(C): grid[r][c] ^= 1
score = 0
for c in range(C):
    ones = sum(grid[r][c] for r in range(R))
    score += max(ones, R - ones) * (1 << (C - c - 1))`,
  },

  '19. Greedy Two-Pass / Multi-Pass': {
    crux: 'Enforce one constraint left-to-right, the other right-to-left, then combine (max/min/sum).',
    concepts: [
      'Candy: left pass enforces "if r[i] > r[i-1] then c[i] > c[i-1]"; right pass enforces the mirror; answer = sum(max(L,R)).',
      'Trapping Rain Water: left-max[i] and right-max[i]; water at i = min(L,R) - h[i].',
      'Product Except Self: prefix product and suffix product, multiplied at each index.',
    ],
    pointsToPonder: [
      'Why do two passes suffice — when would you need three or more?',
      'Can you compress two arrays into O(1) extra space via clever pointer-walking?',
      'What invariant does each pass independently guarantee?',
    ],
    code: `# Candy
n = len(ratings)
L = [1] * n; R = [1] * n
for i in range(1, n):
    if ratings[i] > ratings[i - 1]: L[i] = L[i - 1] + 1
for i in range(n - 2, -1, -1):
    if ratings[i] > ratings[i + 1]: R[i] = R[i + 1] + 1
return sum(max(L[i], R[i]) for i in range(n))`,
  },

  '20. Huffman / Optimal Encoding Greedy': {
    crux: 'Repeatedly combine the two cheapest items via a min-heap; cost accumulates on each merge.',
    concepts: [
      'Min-cost to connect sticks is textbook Huffman: pop two smallest, push their sum, add to cost.',
      'Total Huffman cost = sum of all INTERNAL node weights of the merge tree.',
      'Generalizes to k-way merges via padding with zero-weight elements until size ≡ 1 (mod k-1).',
    ],
    pointsToPonder: [
      'Why does combining the two smallest first minimize total cost (exchange argument)?',
      'When does the problem deviate from pure Huffman (Min Cost to Merge Stones — needs DP, not pure greedy)?',
      'How does the heap order interact with ties — does it ever matter for total cost?',
    ],
    code: `# Min Cost to Connect Sticks
import heapq
heapq.heapify(sticks)
cost = 0
while len(sticks) > 1:
    a = heapq.heappop(sticks); b = heapq.heappop(sticks)
    cost += a + b
    heapq.heappush(sticks, a + b)`,
  },

  '21. Exchange Argument Greedy (Proof Pattern)': {
    crux: 'Prove correctness by showing any "out-of-order" adjacent pair in an optimal solution can be swapped to match greedy without worsening the result.',
    concepts: [
      'Largest Number: sort by comparator (a+b > b+a) — the swap argument shows local order ⇒ global order.',
      'Hire K Workers: sort by wage/quality ratio — fixing the ratio fixes the "captain" and the rest is a heap.',
      'The proof is the design: if you can prove an exchange does not worsen the optimum, the greedy is correct.',
    ],
    pointsToPonder: [
      'Is your comparator TRANSITIVE? (a+b > b+a, b+c > c+b ⇒ a+c > c+a — usually yes, but verify.)',
      'Does the exchange argument also require the comparator to be antisymmetric?',
      'For "ratio" sorts (efficiency, profit/time), why does fixing the lowest-ratio member as the bottleneck work?',
    ],
    code: `# Largest Number — custom comparator
from functools import cmp_to_key
nums = [str(x) for x in nums]
nums.sort(key=cmp_to_key(lambda a, b: -1 if a + b > b + a else 1))
return ''.join(nums).lstrip('0') or '0'`,
  },

  '22. Greedy + Union-Find': {
    crux: 'Sort edges or operations by cost/time, then process in order while a DSU tracks connectivity.',
    concepts: [
      'Kruskal\'s MST: sort edges, union non-cyclic ones — exactly n-1 unions occur.',
      'Edge-length-limited path queries: sort queries AND edges by limit; process queries in order, adding edges as the limit grows (offline trick).',
      'Swim in Rising Water / Path in Threshold Grid: sort cells by value; union neighbors as cells "appear".',
    ],
    pointsToPonder: [
      'Why does Kruskal\'s never need to undo a union (the cycle property)?',
      'When does sorting QUERIES (not just edges) unlock a one-pass algorithm?',
      'How does path-compression + union-by-rank interact with the greedy ordering?',
    ],
    code: `# Min Cost to Connect All Points (Kruskal)
edges = sorted((manhattan(i, j), i, j) for i in range(n) for j in range(i + 1, n))
parent = list(range(n)); cost = picked = 0
for w, u, v in edges:
    if union(u, v):
        cost += w; picked += 1
        if picked == n - 1: break`,
  },

  '23. Greedy Subsequence Selection': {
    crux: 'Build "best so far" piles via patience sorting; bisect to place each element.',
    concepts: [
      'LIS in O(n log n): keep `tails`; for each x, replace the first tails[i] ≥ x (or append).',
      'tails is NOT the actual LIS — but its LENGTH equals the LIS length.',
      'Russian Doll Envelopes: sort by width asc, height DESC (to prevent same-width chaining), then LIS on heights.',
    ],
    pointsToPonder: [
      'Why does replacing the smallest tail ≥ x preserve LIS length?',
      'For Russian Doll, why is the secondary "height descending" tiebreak essential?',
      'How does this generalize to longest non-decreasing (bisect_right) vs strictly increasing (bisect_left)?',
    ],
    code: `# LIS O(n log n) — patience sorting
from bisect import bisect_left
tails = []
for x in nums:
    i = bisect_left(tails, x)
    if i == len(tails): tails.append(x)
    else: tails[i] = x
return len(tails)`,
  },

  '24. Greedy Water / Resource Distribution': {
    crux: 'Two pointers from outside in; the weaker boundary moves because it cannot improve while paired with anything.',
    concepts: [
      'Container With Most Water: shorter wall caps area, so move it.',
      'Trapping Rain Water: at each step, the side with the smaller max can finalize its water (water = its_max - h).',
      'Trapping Rain Water II (3D): min-heap of boundary cells — always pop the shortest wall (the limiting factor).',
    ],
    pointsToPonder: [
      'Why is moving the shorter side guaranteed not to skip a better answer?',
      'In the 3D version, why does the BOUNDARY heap need to track the running max along the inward sweep?',
      'When does a water/resource problem reduce to a flow problem and stop being greedy?',
    ],
    code: `# Trapping Rain Water (two pointer)
l, r = 0, len(h) - 1
lmax = rmax = water = 0
while l < r:
    if h[l] < h[r]:
        lmax = max(lmax, h[l])
        water += lmax - h[l]; l += 1
    else:
        rmax = max(rmax, h[r])
        water += rmax - h[r]; r -= 1`,
  },

  '25. Advanced / Contest-Level Greedy': {
    crux: 'Identify which canonical lens applies: regret heap, exchange argument, binary-search-the-answer, or two-pass.',
    concepts: [
      'Most "advanced" greedy problems are a composition: e.g., binary search the answer + greedy feasibility + heap for the inner check.',
      'Patching Array: maintain reachable [1, miss); if next num > miss, patch with miss itself.',
      'When greedy seems to fail, check: is the comparator non-transitive? does a "future cost" make a local choice non-optimal? if yes, DP.',
    ],
    pointsToPonder: [
      'Which greedy lens does THIS problem fit — and is there a known LeetCode analog?',
      'If a greedy seems wrong, can you construct a 4-element counterexample? (Often the smallest break case.)',
      'When do you switch from "design a greedy" to "design a DP" — what is the precise signal?',
    ],
    code: `# Patching Array — maintain reachable range
miss, i, patches = 1, 0, 0
while miss <= n:
    if i < len(nums) and nums[i] <= miss:
        miss += nums[i]; i += 1
    else:
        miss += miss; patches += 1
return patches`,
  },
}

const dynamicProgramming = {
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

const stackQueue = {
  '1. Basic Stack Operations / Simulation': {
    crux: 'Use a stack as a LIFO scratch pad: push on event, pop to undo / pair / commit.',
    concepts: [
      'A stack is the right tool whenever the most recent unmatched thing is the one that matters next (matching, undo, last-seen).',
      'Many "string cleanup" problems become trivial when you treat the output as a stack you append to and occasionally pop from.',
      'Two stacks can simulate a queue (and vice versa) — useful design template (LC 225, 232).',
    ],
    pointsToPonder: [
      'Could you replace the explicit stack with the call stack (recursion) — and would that hurt clarity / blow the stack frame limit?',
      'When the input is small and reversible (e.g., Baseball Game), is a list/array used as a stack clearer than a deque?',
      'Why is amortized O(1) per element the right complexity bound even when individual ops do work proportional to the stack size?',
    ],
    code: `# Backspace String Compare (LC 844)
def build(s):
    out = []
    for c in s:
        if c == '#':
            if out: out.pop()
        else:
            out.append(c)
    return out
return build(s) == build(t)`,
  },

  '2. Parentheses / Bracket Matching': {
    crux: 'Push openers; on a closer, the top of the stack MUST be the matching opener — else invalid.',
    concepts: [
      'Map closers → openers once; the loop becomes a single push/pop dance.',
      'For "longest valid" / "min add to make valid", track indices on the stack (not characters) so you can compute lengths or counts.',
      'Wildcard variants (LC 678) use either two stacks (one for `(`, one for `*`) or a low/high counter range.',
    ],
    pointsToPonder: [
      'When does counting (open - close) suffice and when do you NEED a stack (multiple bracket types)?',
      'For Longest Valid Parentheses, why is the sentinel -1 at the bottom of the stack the cleanest formulation?',
      'For the wildcard `*`, why does the low/high range approach work — what invariant does it preserve?',
    ],
    code: `# Valid Parentheses (LC 20)
pair = {')': '(', ']': '[', '}': '{'}
stk = []
for c in s:
    if c in pair:
        if not stk or stk.pop() != pair[c]: return False
    else:
        stk.append(c)
return not stk`,
  },

  '3. Monotonic Stack — Next Greater / Smaller Element': {
    crux: 'Maintain a stack of INDICES with monotone values; pop while incoming violates the order — each popped index gets its answer.',
    concepts: [
      'Decreasing stack ⇒ next greater element (on pop, the incoming is the NGE).',
      'Increasing stack ⇒ next smaller element. Iterate left-to-right or right-to-left to pick which side you compute.',
      'Each index is pushed and popped at most once ⇒ amortized O(n) total.',
    ],
    pointsToPonder: [
      'Strict vs non-strict comparison (`>` vs `>=`) — which one you need depends on how duplicates should be treated.',
      'For circular variants (LC 503), why does iterating 2n (or doubling the array conceptually) capture all wraparound answers?',
      'When indices are not enough (you need values), do you really need a second stack — or can you index back into the array?',
    ],
    code: `# Daily Temperatures (LC 739)
ans = [0] * len(T)
stk = []  # indices, decreasing temperatures
for i, t in enumerate(T):
    while stk and T[stk[-1]] < t:
        j = stk.pop()
        ans[j] = i - j
    stk.append(i)
return ans`,
  },

  '4. Monotonic Stack — Histogram / Rectangle Problems': {
    crux: 'For each bar, find the nearest smaller bar on the left and right — width = R - L - 1, area = bar * width.',
    concepts: [
      'Largest Rectangle in Histogram (LC 84) is the foundational template — Maximal Rectangle, Trapping Rain Water reduce to it.',
      'Sentinel value 0 at the end forces the stack to drain in one pass.',
      'Maximal Rectangle (LC 85) = per-row histogram heights, then LC 84 on each row.',
    ],
    pointsToPonder: [
      'Why does the moment of POP give you exactly the right boundary for the popped bar (and not the bar still in the stack)?',
      'For Trapping Rain Water with a stack, what does the "trapped water on pop" formula look like — and why does it differ from the two-pointer version?',
      'How do you avoid the off-by-one error when computing width on an empty stack after the pop?',
    ],
    code: `# Largest Rectangle in Histogram (LC 84)
heights.append(0)
stk, best = [], 0
for i, h in enumerate(heights):
    while stk and heights[stk[-1]] > h:
        top = stk.pop()
        L = stk[-1] if stk else -1
        best = max(best, heights[top] * (i - L - 1))
    stk.append(i)
return best`,
  },

  '5. Monotonic Stack — Stock Span / Price Problems': {
    crux: 'For each new price, pop all PRIOR prices it dominates, then carry their cumulative span — a stack of (value, span) pairs.',
    concepts: [
      'Online Stock Span (LC 901): pop while top.price <= today; new span = 1 + sum of popped spans.',
      '132 Pattern (LC 456): scan right-to-left maintaining a max "third" seen so far; stack holds candidate "twos" greater than third.',
      'Maximum Width Ramp (LC 962): build a strictly decreasing stack from the left, then scan right-to-left popping while index satisfies the ramp.',
    ],
    pointsToPonder: [
      'For Stock Span, why does carrying the popped spans give the correct count without re-scanning?',
      'For 132 Pattern, why must the scan go right-to-left — and what role does the "max popped" play as the "2"?',
      'For Max Width Ramp, why does only the leftmost occurrence of each "low" need to be on the stack?',
    ],
    code: `# Online Stock Span (LC 901)
class StockSpanner:
    def __init__(self): self.stk = []  # (price, span)
    def next(self, price):
        span = 1
        while self.stk and self.stk[-1][0] <= price:
            span += self.stk.pop()[1]
        self.stk.append((price, span))
        return span`,
  },

  '6. Monotonic Stack — Subarray Contribution / Sum Problems': {
    crux: 'For each element, count how many subarrays it is the min/max of using left/right "smaller/greater" boundaries; sum its contribution.',
    concepts: [
      'contribution(arr[i]) = arr[i] * left_count * right_count, where left/right counts come from nearest-smaller/greater indices.',
      'Duplicate handling: use STRICT on one side and NON-STRICT on the other to avoid double-counting (e.g., < left, ≤ right).',
      'Sum of Subarray Ranges (LC 2104) = sum-of-max minus sum-of-min — apply the technique twice.',
    ],
    pointsToPonder: [
      'Why is the asymmetric strict/non-strict comparison the canonical fix for duplicates — what would symmetric give?',
      'How does the contribution technique generalize from sum-of-mins to median, k-th order, or product?',
      'For Sum of Total Strength of Wizards (LC 2281), why does the inner formula need prefix-of-prefix sums?',
    ],
    code: `# Sum of Subarray Minimums (LC 907) — contribution
MOD = 10**9 + 7
n = len(arr)
L, R = [0]*n, [0]*n
stk = []
for i, x in enumerate(arr):
    while stk and arr[stk[-1]] > x: stk.pop()
    L[i] = i - stk[-1] if stk else i + 1
    stk.append(i)
stk.clear()
for i in range(n-1, -1, -1):
    while stk and arr[stk[-1]] >= arr[i]: stk.pop()
    R[i] = stk[-1] - i if stk else n - i
    stk.append(i)
return sum(arr[i]*L[i]*R[i] for i in range(n)) % MOD`,
  },

  '7. Monotonic Stack — Lexicographic / Greedy Removal': {
    crux: 'Build the answer onto a stack; pop the top whenever it is "worse" than the incoming AND you still have budget / future occurrences.',
    concepts: [
      'Remove K Digits (LC 402): increasing stack; pop while top > current and k > 0.',
      'Remove Duplicate Letters (LC 316): also forbid popping the LAST occurrence of a character; maintain an in_stack set.',
      'Create Maximum Number (LC 321): pick best k1 from nums1, k2 from nums2 (k1 + k2 = k), then merge greedily — two layers of greedy.',
    ],
    pointsToPonder: [
      'For Remove Duplicate Letters, why is "last occurrence" the exact invariant that makes the greedy safe?',
      'For Create Maximum Number, why does the merge step compare suffixes (not just current chars) when ties occur?',
      'After the main loop, why do you slice off the trailing k unused budget rather than popping during the loop?',
    ],
    code: `# Remove K Digits (LC 402)
stk = []
for c in num:
    while stk and stk[-1] > c and k > 0:
        stk.pop(); k -= 1
    stk.append(c)
res = ''.join(stk[:len(stk)-k]).lstrip('0')
return res or '0'`,
  },

  '8. Expression Evaluation / Calculator': {
    crux: 'Walk left-to-right with an operand stack and a current sign / pending operator; parentheses save/restore the current context.',
    concepts: [
      'Basic Calculator I (LC 224): only `+ -` and parentheses → stack of (result, sign) pushed at `(`, popped at `)`.',
      'Basic Calculator II (LC 227): add `* /` → keep the LAST number separate; apply * / immediately, defer + - to the final sum.',
      'Basic Calculator III (LC 772) = I + II — recurse into parentheses or use a single stack with sign tracking.',
      'Reverse Polish (LC 150): pure operand stack — pop two on operator, push result.',
    ],
    pointsToPonder: [
      'Why does treating `-` as `+ (-num)` simplify the sign logic — and where can it bite you (unary minus, leading minus)?',
      'For * and /, why do you apply them eagerly (against the last number) instead of pushing onto the stack?',
      'Integer division semantics: truncate toward zero vs floor — they differ for negative results; which does Python `//` give vs C++ `/`?',
    ],
    code: `# Basic Calculator II (LC 227)
num, sign, stk = 0, '+', []
s += '+'
for c in s:
    if c.isdigit(): num = num*10 + int(c)
    elif c in '+-*/':
        if   sign == '+': stk.append(num)
        elif sign == '-': stk.append(-num)
        elif sign == '*': stk.append(stk.pop() * num)
        else:             stk.append(int(stk.pop() / num))
        sign, num = c, 0
return sum(stk)`,
  },

  '9. Stack for DFS / Iterative Traversal': {
    crux: 'Replace recursion with an explicit stack of (node, state) — state encodes which children have been visited.',
    concepts: [
      'Iterative inorder: push lefts until null, then visit + go right.',
      'Iterative postorder: either reverse-modified-preorder (root, right, left → reverse) OR a marker / two-stack approach.',
      'BST Iterator (LC 173): the inorder stack template, exposed as a class with next() / hasNext().',
    ],
    pointsToPonder: [
      'For postorder, why is the naive "push left then right" insufficient — and what state lets you know children are done?',
      'When does iterative traversal actually matter (deep trees risking stack overflow) vs is recursion fine?',
      'For Construct Binary Tree from Preorder + Inorder, can you avoid O(n) lookup with a hashmap of value → inorder index?',
    ],
    code: `# Iterative Inorder Traversal (LC 94)
stk, cur, out = [], root, []
while cur or stk:
    while cur:
        stk.append(cur); cur = cur.left
    cur = stk.pop()
    out.append(cur.val)
    cur = cur.right
return out`,
  },

  '10. Decode / Nested Structure with Stack': {
    crux: 'Push current context on `[` / `(` / open-token; pop and combine on the matching close-token.',
    concepts: [
      'Decode String (LC 394): stack of (prev_string, repeat_count); on `]`, prev + curr * count.',
      'Number of Atoms (LC 726): stack of dicts; on `)` multiply the popped dict and merge into parent.',
      'Nested List / Mini Parser (LC 385): stack of NestedInteger lists; build from inside out.',
    ],
    pointsToPonder: [
      'What two pieces of state must you push on `[` so that the close action can rebuild correctly?',
      'For multi-digit repeat counts, why does parsing the full number BEFORE the `[` matter?',
      'When is recursion (single function call per nesting level) cleaner than an explicit stack — and when does it crash on deep nesting?',
    ],
    code: `# Decode String (LC 394)
stk, cur, k = [], '', 0
for c in s:
    if c.isdigit(): k = k*10 + int(c)
    elif c == '[':
        stk.append((cur, k)); cur, k = '', 0
    elif c == ']':
        prev, rep = stk.pop()
        cur = prev + cur * rep
    else: cur += c
return cur`,
  },

  '11. Monotonic Deque (Sliding Window Min/Max)': {
    crux: 'A deque of indices with monotone values; pop from BACK on violations, pop from FRONT when out of window — front is the answer.',
    concepts: [
      'Sliding Window Maximum (LC 239): decreasing deque; front = current window max.',
      'Use the SAME pattern to optimize DPs where dp[i] = f(max/min over dp[i-k..i-1]) (LC 1425, 1696).',
      'For Shortest Subarray with Sum at Least K (LC 862), build prefix sums and run a monotonic-increasing deque on prefixes.',
    ],
    pointsToPonder: [
      'Why does the deque store INDICES, not values — what would break if you stored only values?',
      'Front pop (out-of-window) vs back pop (dominated value) — which side is for which condition?',
      'For LC 862, why does the deque on prefix sums need to be INCREASING (not decreasing as in LC 239)?',
    ],
    code: `# Sliding Window Maximum (LC 239)
from collections import deque
dq, out = deque(), []
for i, x in enumerate(nums):
    while dq and dq[0] <= i - k: dq.popleft()
    while dq and nums[dq[-1]] <= x: dq.pop()
    dq.append(i)
    if i >= k - 1: out.append(nums[dq[0]])
return out`,
  },

  '12. BFS Queue / Level-Order Traversal': {
    crux: 'Process the tree level by level: capture the queue size at the start of the loop = number of nodes in the current level.',
    concepts: [
      'Snapshot len(queue) before the inner loop to bound this level exactly.',
      'Zigzag (LC 103): toggle a direction flag; either reverse the level list or use a deque appending front/back.',
      'Right Side View (LC 199): take the LAST node enqueued at each level (or first if traversing right-first).',
    ],
    pointsToPonder: [
      'Why is "snapshot the size at start" the cleanest level-separator — vs sentinel nulls or per-level queues?',
      'For "average of levels" / "deepest leaves sum", which is cleaner: BFS by level or DFS with depth tracking?',
      'For Maximum Width (LC 662), why must you carry POSITION INDICES (not just nodes) in the queue?',
    ],
    code: `# Binary Tree Level Order Traversal (LC 102)
from collections import deque
q, out = deque([root] if root else []), []
while q:
    level = []
    for _ in range(len(q)):
        node = q.popleft()
        level.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    out.append(level)
return out`,
  },

  '13. Queue for BFS on Graphs / Grids': {
    crux: 'Plain BFS from a source (or MULTI-SOURCE — seed all starts at once) gives shortest-path-by-edges in O(V + E).',
    concepts: [
      'Mark visited BEFORE enqueue (not on dequeue) to avoid duplicate work on dense graphs.',
      'Multi-source BFS: enqueue all sources with distance 0 — solves Rotting Oranges (LC 994), Walls and Gates (LC 286), 01 Matrix (LC 542) in one pass.',
      'For state-as-vertex problems (Word Ladder, Open the Lock, Sliding Puzzle), the "neighbors" are computed lazily — define them once cleanly.',
    ],
    pointsToPonder: [
      'Why is multi-source BFS equivalent to BFS from a virtual super-source — and when is that mental model useful?',
      'Why does marking on enqueue (not dequeue) matter for correctness AND efficiency?',
      'When does BFS become a poor choice (weighted edges → Dijkstra; cycles + cost → Bellman-Ford)?',
    ],
    code: `# Rotting Oranges (LC 994) — multi-source BFS
from collections import deque
q, fresh = deque(), 0
for r in range(R):
    for c in range(C):
        if grid[r][c] == 2: q.append((r, c, 0))
        elif grid[r][c] == 1: fresh += 1
last = 0
while q:
    r, c, t = q.popleft(); last = t
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
            grid[nr][nc] = 2; fresh -= 1
            q.append((nr, nc, t+1))
return last if fresh == 0 else -1`,
  },

  '14. Deque / 0-1 BFS': {
    crux: 'Edges have weight 0 or 1: push 0-edges to the FRONT of the deque, 1-edges to the BACK — Dijkstra without a heap, O(V + E).',
    concepts: [
      'Same correctness as Dijkstra: deque invariant = "front has the smallest known distance".',
      'Minimum Cost to Make Valid Path (LC 1368): moving in arrow direction = 0, other = 1.',
      'When weights are 0/1, 0-1 BFS strictly dominates Dijkstra (no log factor, simpler code).',
    ],
    pointsToPonder: [
      'Why is appendleft (not append) the key step — what would happen if you appended both kinds to the back?',
      'When does popping a vertex that has already been processed need to be skipped (relaxation check)?',
      'How does this extend to weights {0, 1, ..., k}? (Hint: it does not directly — you need k-bucket BFS / Dijkstra.)',
    ],
    code: `# Minimum Cost Path (LC 1368) — 0-1 BFS skeleton
from collections import deque
INF = float('inf')
dist = [[INF]*C for _ in range(R)]
dist[0][0] = 0
dq = deque([(0, 0)])
arrow = {1:(0,1), 2:(0,-1), 3:(1,0), 4:(-1,0)}
while dq:
    r, c = dq.popleft()
    for d, (dr, dc) in arrow.items():
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C:
            w = 0 if grid[r][c] == d else 1
            if dist[r][c] + w < dist[nr][nc]:
                dist[nr][nc] = dist[r][c] + w
                if w == 0: dq.appendleft((nr, nc))
                else:      dq.append((nr, nc))
return dist[R-1][C-1]`,
  },

  '15. Circular Queue / Deque Design': {
    crux: 'Maintain head/tail pointers in a fixed-size array, advanced modulo capacity — O(1) per op, no shifting.',
    concepts: [
      'Track size explicitly to disambiguate full vs empty (when head == tail).',
      'Front Middle Back Queue (LC 1670): two deques, rebalance so |left| ≤ |right| ≤ |left| + 1.',
      'Max Frequency Stack (LC 895): map freq → stack of values pushed at that frequency.',
    ],
    pointsToPonder: [
      'Why is "size variable" cleaner than the "leave one slot empty" trick — and when does each matter (memory vs speed)?',
      'For Front Middle Back, why does the rebalance need to happen at the END of every modifying op?',
      'For Max Freq Stack, why does mapping freq → stack-of-values give O(1) pop without any heap?',
    ],
    code: `# Design Circular Queue (LC 622)
class MyCircularQueue:
    def __init__(self, k):
        self.buf, self.head, self.size, self.cap = [0]*k, 0, 0, k
    def enQueue(self, v):
        if self.size == self.cap: return False
        self.buf[(self.head + self.size) % self.cap] = v
        self.size += 1; return True
    def deQueue(self):
        if not self.size: return False
        self.head = (self.head + 1) % self.cap
        self.size -= 1; return True
    def Front(self): return -1 if not self.size else self.buf[self.head]
    def Rear(self):  return -1 if not self.size else self.buf[(self.head + self.size - 1) % self.cap]`,
  },

  '16. Stack for Path / Directory / String Simplification': {
    crux: 'Treat the output as a stack — push on normal token, pop on cancel token (`..`, backspace, adjacent duplicate).',
    concepts: [
      'Simplify Path (LC 71): split by `/`, push real names, pop on `..`, ignore `.` and empty.',
      'Remove Adjacent Duplicates II (LC 1209): stack of (char, count); pop or merge when count hits k.',
      'Removing Stars (LC 2390): push letters, pop on `*` — single pass, no regex.',
    ],
    pointsToPonder: [
      'Why is "stack as output" the same conceptual move as "stack as undo" — what makes the LIFO order natural here?',
      'For Adjacent Duplicates II, why is storing (char, count) pairs strictly better than storing repeated chars?',
      'For Simplify Path, why must you ignore empty tokens that come from repeated `/`?',
    ],
    code: `# Simplify Path (LC 71)
stk = []
for part in path.split('/'):
    if part in ('', '.'): continue
    if part == '..':
        if stk: stk.pop()
    else:
        stk.append(part)
return '/' + '/'.join(stk)`,
  },

  '17. Stack-Based Greedy / Construction': {
    crux: 'Push candidates; pop whenever the top is dominated by the incoming under the problem-specific "worse" predicate.',
    concepts: [
      'Asteroid Collision (LC 735): right-mover on top + incoming left-mover → resolve by size; loop until stable.',
      'Validate Stack Sequences (LC 946): simulate — push pushed[i], then pop greedily while top == popped[j].',
      'Car Fleet (LC 853): sort by start position desc; pop the fleet ahead if current catches up (time ≤ top.time).',
    ],
    pointsToPonder: [
      'For Asteroid, why is the WHILE loop (not IF) essential for correctness on cascading collisions?',
      'For Validate Stack Sequences, why does greedy popping after every push give the correct decision?',
      'For Car Fleet, why does sorting by position descending make the stack logic cleaner than ascending?',
    ],
    code: `# Asteroid Collision (LC 735)
stk = []
for a in asteroids:
    alive = True
    while alive and a < 0 and stk and stk[-1] > 0:
        if stk[-1] < -a:    stk.pop()
        elif stk[-1] == -a: stk.pop(); alive = False
        else:                          alive = False
    if alive: stk.append(a)
return stk`,
  },

  '18. Stack for Undo / History / Browser': {
    crux: 'Two stacks (or one stack + an index) — one for the past, one for the future; an action moves between them.',
    concepts: [
      'Browser History (LC 1472): forward stack + history list with index, or back/forward dual stacks.',
      'Min/Max Stack (LC 155 / 716): augment each entry with min/max so far → O(1) min/max alongside push/pop.',
      'Text Editor (LC 2296): two stacks split at the cursor — type/delete/move become symmetric.',
    ],
    pointsToPonder: [
      'For Min Stack, why does storing (value, min_so_far) per entry beat keeping a parallel min-stack with conditional pushes (or does it)?',
      'For a text editor, why is the "two stacks split at cursor" representation strictly better than an array + index?',
      'Snapshot Array (LC 1146): why does binary search on per-index version lists outperform a literal copy-on-snapshot?',
    ],
    code: `# Min Stack (LC 155)
class MinStack:
    def __init__(self): self.stk = []   # (val, cur_min)
    def push(self, x):
        cur = x if not self.stk else min(x, self.stk[-1][1])
        self.stk.append((x, cur))
    def pop(self): self.stk.pop()
    def top(self): return self.stk[-1][0]
    def getMin(self): return self.stk[-1][1]`,
  },

  '19. Multi-Stack / Stack of Stacks': {
    crux: 'When a single stack would violate a constraint (capacity, frequency tiers), maintain a list/heap of stacks indexed by that constraint.',
    concepts: [
      'Dinner Plate Stacks (LC 1172): list of stacks, capacity cap; min-heap of indices that still have room.',
      'Maximum Frequency Stack (LC 895): map freq → stack-of-values; pushing increments freq, popping returns from the top freq-stack.',
      'Stack With Increment (LC 1381): lazy increment — store delta at the bottom of an affected range; apply on pop.',
    ],
    pointsToPonder: [
      'For Dinner Plates, why is a HEAP of "available-to-push" indices the right structure — and why must you lazy-clean it?',
      'For Max Freq Stack, what makes the "stack-per-frequency" mapping naturally handle ties (most recent wins)?',
      'For Increment Stack, why is the lazy-delta approach O(1) amortized vs O(k) naive?',
    ],
    code: `# Max Frequency Stack (LC 895)
from collections import defaultdict
class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)
        self.group = defaultdict(list)
        self.maxf = 0
    def push(self, x):
        self.freq[x] += 1
        f = self.freq[x]
        self.maxf = max(self.maxf, f)
        self.group[f].append(x)
    def pop(self):
        x = self.group[self.maxf].pop()
        self.freq[x] -= 1
        if not self.group[self.maxf]: self.maxf -= 1
        return x`,
  },

  '20. Asteroid / Collision Simulation': {
    crux: 'Process events in some order; the stack tracks "survivors so far" — pop on each collision until stable.',
    concepts: [
      'The stack always holds the same-direction (or compatible) survivors; the incoming event collides only with the top.',
      'Car Fleet (LC 853, 1776): sort by start position; survivors are fleets, collision predicate is "catch up time".',
      'Robot Collisions (LC 2751): identical to Asteroid but with healths and indices — bookkeeping is the only added complexity.',
    ],
    pointsToPonder: [
      'Why is the collision rule always "incoming vs top of stack" — what guarantees no further collisions deeper in?',
      'When does collision processing need a WHILE loop vs a single IF (cascading vs single-event)?',
      'For Robot Collisions, why must you restore original order at the end — and what data structure makes that easy?',
    ],
    code: `# Robot Collisions (LC 2751) — sketch
order = sorted(range(n), key=lambda i: positions[i])
stk = []  # (idx, health, dir)
for i in order:
    cur = [i, healths[i], directions[i]]
    while stk and cur[2] == 'L' and stk[-1][2] == 'R':
        top = stk[-1]
        if top[1] > cur[1]: top[1] -= 1; cur = None; break
        elif top[1] < cur[1]: cur[1] -= 1; stk.pop()
        else: stk.pop(); cur = None; break
    if cur: stk.append(cur)`,
  },

  '21. Intervals / Merging with Stack': {
    crux: 'Sort intervals by start; maintain a stack of merged intervals — extend the top if the next overlaps, else push.',
    concepts: [
      'Merge Intervals: sort by start; if next.start ≤ top.end, top.end = max(top.end, next.end); else push.',
      'Remove Covered Intervals (LC 1288): sort by (start asc, end desc); pop if top covers current OR current covers top.',
      'Exclusive Time of Functions (LC 636): stack of active function ids; "start" pushes, "end" pops and credits time to the new top.',
    ],
    pointsToPonder: [
      'Why does sorting by start (vs end) matter for MERGING vs COUNT-OVERLAP problems?',
      'For Exclusive Time, why is the difference between consecutive timestamps the right credit-amount — and which function gets credited when?',
      'When does a sweep-line / +1-/-1 timeline beat the stack approach?',
    ],
    code: `# Exclusive Time of Functions (LC 636)
out = [0] * n
stk = []   # (fn_id, last_resume_time)
for log in logs:
    fn, evt, t = log.split(':'); fn, t = int(fn), int(t)
    if evt == 'start':
        if stk: out[stk[-1][0]] += t - stk[-1][1]
        stk.append([fn, t])
    else:
        f, s = stk.pop()
        out[f] += t - s + 1
        if stk: stk[-1][1] = t + 1
return out`,
  },

  '22. Queue-Based Simulation / Round-Robin': {
    crux: 'Model "first-come-first-served" steps with a queue; rotate or dequeue elements as the simulation progresses.',
    concepts: [
      'Dota2 Senate (LC 649): two queues (R, D); compare front indices, ban the other, re-enqueue at index + n.',
      'Reveal Cards In Increasing Order (LC 950): simulate the reveal process with a deque of positions, then place sorted cards.',
      'Number of Recent Calls (LC 933): sliding-window queue — pop while front < t - 3000.',
    ],
    pointsToPonder: [
      'For Dota2 Senate, why does the "+ n trick" naturally encode "act again next round" without an explicit round counter?',
      'For Reveal Cards, why does running the reveal process IN REVERSE give a direct placement instead of trial-and-error?',
      'For Number of Recent Calls, why is a queue strictly better than a list + index here?',
    ],
    code: `# Dota2 Senate (LC 649)
from collections import deque
R = deque(i for i, c in enumerate(senate) if c == 'R')
D = deque(i for i, c in enumerate(senate) if c == 'D')
n = len(senate)
while R and D:
    r, d = R.popleft(), D.popleft()
    if r < d: R.append(r + n)
    else:     D.append(d + n)
return 'Radiant' if R else 'Dire'`,
  },

  '23. Bidirectional BFS (Queue-Based)': {
    crux: 'Run BFS from BOTH ends; alternate expanding the smaller frontier; meet in the middle ⇒ O(b^(d/2)) instead of O(b^d).',
    concepts: [
      'Use two sets (or two queues) — expand the smaller set each iteration to keep the branching factor low.',
      'Word Ladder (LC 127): the classic application — frontier sizes are critical.',
      'Open the Lock (LC 752), Minimum Genetic Mutation (LC 433), Sliding Puzzle (LC 773) — same template.',
    ],
    pointsToPonder: [
      'Why is expanding the SMALLER frontier always the right heuristic (not strictly smaller, just not-larger)?',
      'How do you detect "meet in the middle" — is intersecting sets the cleanest check?',
      'When does bidirectional BFS NOT help (e.g., reverse moves not defined, or asymmetric edges)?',
    ],
    code: `# Word Ladder (LC 127) — bidirectional BFS
words = set(wordList)
if endWord not in words: return 0
front, back = {beginWord}, {endWord}
steps = 1
while front and back:
    if len(front) > len(back): front, back = back, front
    nxt = set()
    for w in front:
        for i in range(len(w)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                cand = w[:i] + c + w[i+1:]
                if cand in back: return steps + 1
                if cand in words: nxt.add(cand); words.discard(cand)
    front = nxt; steps += 1
return 0`,
  },

  '24. Monotonic Stack + Prefix Sum / DP Optimization': {
    crux: 'When the DP/aggregation needs the min/max (or sum) over a left/right boundary, a monotonic stack finds those boundaries in O(n).',
    concepts: [
      'Sum of Total Strength of Wizards (LC 2281): boundary indices from monotonic stack + prefix-of-prefix sums → O(n) total.',
      'Maximum Subarray Min-Product (LC 1856): like LC 84 — for each min, find its range, multiply by range sum (prefix sums).',
      'Odd Even Jump (LC 975): monotonic stack on sorted indices to precompute next-larger-or-equal / next-smaller for each i → DP from right.',
    ],
    pointsToPonder: [
      'When is "find left/right boundary with stack, then use prefix sums" the right factoring — what does it save vs naive O(n²)?',
      'For Min-Product, why is the multiplication of (min × range_sum) the right contribution — and how do you handle duplicates?',
      'For Odd Even Jump, why does the DP go RIGHT to LEFT — and how does the "next larger" precomputation enable O(1) transitions?',
    ],
    code: `# Maximum Subarray Min-Product (LC 1856)
MOD = 10**9 + 7
P = [0]
for x in nums: P.append(P[-1] + x)
n = len(nums)
L, R = [-1]*n, [n]*n
stk = []
for i, x in enumerate(nums):
    while stk and nums[stk[-1]] >= x: stk.pop()
    L[i] = stk[-1] if stk else -1
    stk.append(i)
stk.clear()
for i in range(n-1, -1, -1):
    while stk and nums[stk[-1]] >= nums[i]: stk.pop()
    R[i] = stk[-1] if stk else n
    stk.append(i)
return max(nums[i] * (P[R[i]] - P[L[i]+1]) for i in range(n)) % MOD`,
  },

  '25. Advanced / Contest-Level Stack & Queue': {
    crux: 'Most "hard" problems are a COMPOSITION: monotonic stack + prefix sums, BFS + state encoding, deque + DP, or a custom stack-of-stacks design.',
    concepts: [
      'When stuck, ask: which canonical pattern (NGE? histogram? contribution? deque-DP?) fits — and what extra dimension is the problem adding?',
      'For design problems, decompose into independent invariants and pick a structure per invariant (heap + map + stack is common).',
      'Brace Expansion II / Parse Lisp / Tag Validator: hand-rolled recursive-descent over a stack of contexts beats regex hacks every time.',
    ],
    pointsToPonder: [
      'Can you reduce THIS problem to a known one (histogram, NGE, deque-DP, multi-source BFS)?',
      'What is the smallest counterexample that would break the obvious greedy / single-pass approach — is that signaling DP?',
      'For design problems, what is the dominant cost op — and is each invariant maintained in O(log n) or O(1) amortized?',
    ],
    code: `# Shortest Subarray with Sum at Least K (LC 862) — deque on prefix sums
from collections import deque
P = [0]
for x in nums: P.append(P[-1] + x)
dq, best = deque(), float('inf')
for i, p in enumerate(P):
    while dq and p - P[dq[0]] >= k:
        best = min(best, i - dq.popleft())
    while dq and P[dq[-1]] >= p: dq.pop()
    dq.append(i)
return best if best < float('inf') else -1`,
  },
}

const conceptMaps = {
  greedy,
  'dynamic-programming': dynamicProgramming,
  'stack-queue': stackQueue,
}

export default conceptMaps
