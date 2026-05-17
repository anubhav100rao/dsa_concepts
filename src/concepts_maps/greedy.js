export const greedy = {
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
