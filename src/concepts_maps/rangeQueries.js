// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const rangeQueries = {
  '1. Prefix Sum / Static Range Sum': {
    crux: 'Store running totals once, so any range is the difference of two prefixes.',
    signals: [
      '"Sum of the elements between indices left and right", called many times on an array that never changes.',
      '"Number of subarrays whose sum equals k" with negative numbers allowed: a sliding window can\'t tell when to shrink, so count matching prefixes.',
      '"Equal number of 0s and 1s" or "sum is a multiple of k": rewrite the values (0 becomes -1) or store prefixes mod k, then look for a repeated prefix.',
      '"Index where the left sum equals the right sum": compare the running left total with total - left - nums[i].',
    ],
    notThis: [
      'Values change between queries, as in Range Sum Query Mutable (LC 307): one update can shift n prefixes, so use a BIT.',
      'You want the min or max of a range: you can\'t subtract two prefix minimums, so use a sparse table.',
      'All values are positive and you want the longest or shortest window: a sliding window does it in O(1) space.',
    ],
    concepts: [
      'pref[i] holds the sum of the first i elements, so sum(l..r) = pref[r + 1] - pref[l].',
      'A subarray ending here sums to k exactly when an earlier prefix equals pref - k. A hash map counts those prefixes.',
      'Store the first index of each prefix when the question asks for the longest subarray (LC 325, LC 525).',
      '2D version: add the top and left rectangles, then subtract the corner counted twice.',
    ],
    example: {
      problem: 'Subarray Sum Equals K with nums = [1, 2, -1, 2], k = 3',
      lc: 560,
      walkthrough: [
        'Start with seen = {0: 1}, pref = 0 and count = 0. The 0 stands for the empty prefix.',
        'x = 1: pref = 1. Look up pref - k = -2, which is absent. Now seen = {0: 1, 1: 1}.',
        'x = 2: pref = 3. Look up 0, which appears once, so count = 1. That subarray is [1, 2]. Add 3 to seen.',
        'x = -1: pref = 2. Look up -1, which is absent. Add 2 to seen.',
        'x = 2: pref = 4. Look up 1, which appears once, so count = 2. That subarray is [2, -1, 2].',
        'The answer is 2.',
      ],
    },
    code: `# Count subarrays with sum k
def subarray_sum(nums, k):
    seen = {0: 1}  # prefix sum -> how many times seen
    pref = count = 0
    for x in nums:
        pref += x
        count += seen.get(pref - k, 0)
        seen[pref] = seen.get(pref, 0) + 1
    return count`,
    complexity: 'Range-sum form: O(n) build, O(1) per query, O(n) space. Hash-map form: O(n) expected time and O(n) space.',
    pitfalls: [
      'Forgetting the seed seen = {0: 1}: subarrays that start at index 0 are never counted.',
      'Updating the map before the lookup: with k = 0, each element would match its own prefix.',
      'For "longest subarray", overwriting the stored index: keep the first occurrence, because it gives the longest span.',
      'Making the prefix array size n instead of n + 1: the empty prefix has nowhere to go, and l = 0 needs a special case.',
      'In LC 523, negative remainders in C++ and Java: normalize with ((x % k) + k) % k.',
    ],
    pointsToPonder: [
      'Why does a negative number break the sliding window here but not the prefix-sum count?',
      'Which aggregates can be undone by subtraction, and what does that tell you about where prefix tricks work?',
      'In LC 1074, how does fixing a pair of rows turn a 2D count into LC 560?',
    ],
    practice: [303, 724, 560, 525, 304],
    snippet: '1-prefix-sum-static-range-sum-l-r',
  },

  '2. Difference Array / Range Update — Point Query': {
    crux: 'Mark only where a range update starts and stops, then one running sum applies them all.',
    signals: [
      '"Add val to every element from l to r", many times, then "return the final array".',
      '"Passengers get on at from and get off at to" with "capacity is never exceeded": the load at each stop is a running sum of changes.',
      '"Which year had the most people alive?": each birth and death is a +1 and a -1.',
      '"Increment all cells in the submatrix": the same idea in 2D, with four corner marks.',
    ],
    notThis: [
      'Queries arrive between updates: reading a value would mean re-summing the array, so use a BIT over differences.',
      'Coordinates reach 10^9, as in Number of Flowers in Full Bloom (LC 2251): sort the starts and ends and binary search instead of allocating an array.',
      'Range Addition II (LC 598) always updates a corner rectangle, so the answer is just min(a) * min(b).',
    ],
    concepts: [
      'Adding v to [l, r] becomes diff[l] += v and diff[r + 1] -= v.',
      'A prefix sum over diff rebuilds the array. That single pass makes all the updates cost O(n + q) together.',
      'Difference and prefix sum undo each other, which is why one fast operation trades against the other.',
      '2D marks: +v at (r1, c1), -v at (r1, c2 + 1) and (r2 + 1, c1), +v at (r2 + 1, c2 + 1).',
    ],
    example: {
      problem: 'Corporate Flight Bookings with bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5',
      lc: 1109,
      walkthrough: [
        '[1,2,10]: diff[1] += 10 and diff[3] -= 10.',
        '[2,3,20]: diff[2] += 20 and diff[4] -= 20.',
        '[2,5,25]: diff[2] += 25 and diff[6] -= 25.',
        'Now diff[1..6] = [10, 45, -10, -20, 0, -25].',
        'Running sum over days 1 to 5: 10, 55, 45, 25, 25.',
        'The answer is [10, 55, 45, 25, 25].',
      ],
    },
    code: `# Corporate Flight Bookings (days are 1-indexed)
def corp_flight_bookings(bookings, n):
    diff = [0] * (n + 2)
    for first, last, seats in bookings:
        diff[first] += seats
        diff[last + 1] -= seats
    run, ans = 0, []
    for day in range(1, n + 1):
        run += diff[day]
        ans.append(run)
    return ans`,
    complexity: 'O(n + q) time for q updates and one rebuild. O(n) space.',
    pitfalls: [
      'Writing to diff[r + 1] when r is the last index: allocate one extra slot or guard the write.',
      'Treating every end as inclusive: in Car Pooling (LC 1094) passengers leave at to, so the -1 goes at to, not to + 1.',
      'In Shifting Letters II (LC 2381), negative shifts: normalize with ((x % 26) + 26) % 26.',
      'Mixing 1-indexed input with a 0-indexed array: LC 1109 days start at 1.',
    ],
    pointsToPonder: [
      'Why does the order of the updates not matter once they are all in diff?',
      'What would you need to change if a query could arrive between two updates?',
      'In Stamping the Grid (LC 2132), why do you need a 2D prefix sum and a 2D difference array together?',
    ],
    practice: [1854, 1109, 1094, 2381],
    snippet: '3-difference-array-range-add-final-array',
  },

  '3. Sparse Table (Static RMQ — Range Min/Max/GCD)': {
    crux: 'Precompute every power-of-two window, then answer with two windows that may overlap.',
    signals: [
      '"Minimum, maximum or GCD of a[l..r]" with up to 10^5 queries and no updates.',
      '"Longest subarray where max - min is at most limit": as the window moves you need its range min and max.',
      'A binary search on the answer that needs an O(1) check of the "GCD of this subarray".',
      'Queries must be answered as they arrive, so you can\'t sort them first.',
    ],
    notThis: [
      'The array changes: a single update can touch O(n) table entries, so use a segment tree.',
      'You want a range sum or XOR: overlapping windows count elements twice, so use a prefix array.',
      'The window slides in one direction: a monotonic deque gives O(n), and that is the usual answer to LC 1438.',
      'Some listed problems have simpler answers: LC 907 and LC 795 count with a monotonic stack or a linear scan, LC 2055 uses prefix counts, and LC 1717 is greedy with a stack.',
    ],
    concepts: [
      'st[k][i] is the answer for the window of length 2^k starting at i.',
      'Build each level from two halves: st[k][i] = min(st[k-1][i], st[k-1][i + 2^(k-1)]).',
      'Query with k = floor(log2(length)): the windows at l and at r - 2^k + 1 together cover [l, r].',
      'The overlap is safe only when combining a value with itself changes nothing: min, max, GCD, AND, OR.',
    ],
    example: {
      problem: 'Range minimum on a = [4, 6, 1, 5, 7, 3], query (3, 5)',
      walkthrough: [
        'Level 0 is the array itself: [4, 6, 1, 5, 7, 3].',
        'Level 1 holds windows of length 2: [4, 1, 1, 5, 3].',
        'Level 2 holds windows of length 4, built from level 1: min(4, 1), min(1, 5), min(1, 3) gives [1, 1, 1].',
        'Query (3, 5) has length 3, so k = 1 and each window has length 2.',
        'The left window starts at l = 3 and the right one at r - 2 + 1 = 4, giving st[1][3] = 5 and st[1][4] = 3.',
        'min(5, 3) = 3, which matches the elements 5, 7, 3.',
      ],
    },
    code: `def build(a):
    st = [a[:]]
    k = 1
    while (1 << k) <= len(a):
        prev, half = st[-1], 1 << (k - 1)
        st.append([min(prev[i], prev[i + half])
                   for i in range(len(a) - (1 << k) + 1)])
        k += 1
    return st

def query(st, l, r):  # inclusive
    k = (r - l + 1).bit_length() - 1
    return min(st[k][l], st[k][r - (1 << k) + 1])`,
    complexity: 'O(n log n) time and space to build. O(1) per query.',
    pitfalls: [
      'Using it for sums: the two windows overlap, so the middle elements count twice.',
      'Looping i too far when building: stop when i + 2^k passes n.',
      'Calling floating-point log2 in the query: rounding can pick the wrong level, so precompute a log table or use bit length.',
      'Allocating 20 levels of n ints for small inputs: the table is the main memory cost.',
    ],
    pointsToPonder: [
      'Why does min tolerate overlap when sum doesn\'t?',
      'When would you accept the O(log n) query of a segment tree over this O(1) query?',
      'How could you get the index of the minimum instead of its value?',
    ],
    practice: [795, 2055, 907, 1438],
    snippet: '12-sparse-table-static-range-minimum-query',
  },

  '4. Binary Indexed Tree (BIT / Fenwick) — Point Update, Range Sum': {
    crux: 'Each index stores the sum of a block sized by its lowest set bit, so updates and prefix sums take log n hops.',
    signals: [
      '"Update the value at index i" mixed with "sum of elements from left to right".',
      '"How many elements to the right are smaller than nums[i]?": insert values as you scan and count with a prefix sum.',
      '"Count pairs i < j with nums[i] > 2 * nums[j]": a pair-count inequality with one side already inserted.',
      '"Move the queried value to the front" with its current position required, as in LC 1409: count what sits before it.',
    ],
    notThis: [
      'You need the min or max of a range: a BIT answers a range by subtracting two prefixes, and min can\'t be subtracted. Use a segment tree.',
      'The array never changes: a prefix array is O(1) per query.',
      'Some listed problems have simpler answers: LC 2731 sorts and uses prefix sums, LC 2080 binary searches on stored positions, and LC 1569 is combinatorics on a BST.',
    ],
    concepts: [
      'i & -i isolates the lowest set bit. t[i] covers that many elements, ending at i.',
      'Update climbs with i += i & -i. Prefix query descends with i -= i & -i.',
      'Range sum = prefix(r) - prefix(l - 1), so the aggregate must be invertible.',
      'As a counter: index by value, add 1 on insert, and prefix(v) counts the values up to v.',
    ],
    example: {
      problem: 'Range Sum Query Mutable with nums = [1, 3, 5]: sumRange(0, 2), update(1, 2), sumRange(0, 2)',
      lc: 307,
      walkthrough: [
        'Add 1 at position 1: t[1] = 1, then 1 + 1 = 2 gives t[2] = 1, then 4 is past the end.',
        'Add 3 at position 2: t[2] = 4, then 2 + 2 = 4 is past the end.',
        'Add 5 at position 3: t[3] = 5, then 3 + 1 = 4 is past the end. Now t[1..3] = [1, 4, 5].',
        'sumRange(0, 2) = prefix(3): t[3] + t[2] = 5 + 4 = 9, hopping 3 to 2 to 0.',
        'update(1, 2) replaces 3 with 2, so the delta is -1 at position 2: t[2] = 3.',
        'sumRange(0, 2) = t[3] + t[2] = 5 + 3 = 8.',
      ],
    },
    code: `class BIT:
    def __init__(self, n):
        self.t = [0] * (n + 1)

    def add(self, i, delta):  # 1-indexed
        while i < len(self.t):
            self.t[i] += delta
            i += i & -i

    def prefix(self, i):  # sum of positions 1..i
        s = 0
        while i > 0:
            s += self.t[i]
            i -= i & -i
        return s

    def range_sum(self, l, r):
        return self.prefix(r) - self.prefix(l - 1)`,
    complexity: 'O(log n) per update and query. O(n log n) to build by repeated add, or O(n) with a direct build. O(n) space.',
    pitfalls: [
      'Calling add with i = 0: i & -i is 0, so the loop never ends. Shift 0-indexed input by one.',
      'Passing the new value to add: it takes a delta, so keep the current array to compute new - old.',
      'Writing prefix(l) instead of prefix(l - 1): this drops element l from the range.',
      'Overflow when summing large values: use 64-bit integers in C++ and Java.',
    ],
    pointsToPonder: [
      'Why is an index with many trailing zeros responsible for a longer block?',
      'What exactly goes wrong if you try to store range minimums in a BIT?',
      'Why do LC 493 and LC 327 need coordinate compression while LC 307 doesn\'t?',
    ],
    practice: [307, 1409, 315, 493, 327],
    snippet: '5-fenwick-tree-point-update-range-sum-query',
  },

  '5. BIT — Range Update, Point Query (Difference Trick)': {
    crux: 'Keep the difference array inside a BIT: a range add is two point updates, and a value is a prefix sum.',
    signals: [
      '"Add val to all elements in [l, r]" mixed with "what is the value at index i now?".',
      'Interval updates arrive online and you only ever read one position at a time.',
      '"How many intervals so far cover point x?": add 1 over each interval and read x.',
    ],
    notThis: [
      'All updates come before all reads: a plain difference array is O(n + q) and needs no tree, which covers LC 370 and LC 1109 as stated.',
      'You need the sum of a range: move to two BITs or a lazy segment tree.',
      'The update assigns instead of adds: differences can\'t express that, so use a lazy segment tree.',
      'Some listed problems don\'t use this at all: LC 2460 is direct simulation, LC 1551 is arithmetic, and LC 330 is greedy.',
    ],
    concepts: [
      'If d is the difference array, a[i] is the sum of d[0..i], which is a BIT prefix query.',
      'range_add(l, r, v) is add(l, +v) and add(r + 1, -v).',
      'This swaps the two roles from section 4: updates become ranges and queries become points.',
      'The BIT holds only the added amounts, so add the original a[i] to the result.',
    ],
    example: {
      problem: 'Range Addition, read online, with length = 3 and updates [[0,1,2],[1,2,3]]',
      lc: 370,
      walkthrough: [
        'range_add(0, 1, 2) calls add(1, +2) and add(3, -2). Now t[1] = 2, t[2] = 2 and t[3] = -2.',
        'range_add(1, 2, 3) calls add(2, +3) and add(4, -3). Now t[2] = 5, and position 4 is past the end, so it is skipped.',
        'point(0) = prefix(1) = t[1] = 2.',
        'point(1) = prefix(2) = t[2] = 5.',
        'point(2) = prefix(3) = t[3] + t[2] = -2 + 5 = 3.',
        'The array is [2, 5, 3], which matches adding 2 to indices 0-1 and 3 to indices 1-2.',
      ],
    },
    code: `# Uses BIT from section 4; l, r, i are 0-indexed
def range_add(bit, l, r, v):
    bit.add(l + 1, v)
    bit.add(r + 2, -v)  # skipped when past the end

def point(bit, i):
    return bit.prefix(i + 1)`,
    complexity: 'O(log n) per range add and per point read. O(n) space.',
    pitfalls: [
      'Using this for a range sum: a prefix of differences gives one value, not a sum of values.',
      'Getting the closing mark wrong: with a 1-indexed BIT and 0-indexed r, it goes at r + 2.',
      'Forgetting to add the original array when the input starts non-zero.',
    ],
    pointsToPonder: [
      'Why does a difference array turn a range update into two point updates?',
      'If reads only start after all the updates, what does the BIT buy you?',
      'How would you count how many times a bit has been flipped using this structure?',
    ],
    practice: [1551, 370, 1109],
    snippet: '6-fenwick-tree-range-add-point-query',
  },

  '6. BIT — Range Update, Range Query (Two-BIT Trick)': {
    crux: 'A prefix sum of a difference array is linear in i, so one BIT holds the slope and a second holds the correction.',
    signals: [
      '"Add val to [l, r]" mixed with "sum of [l, r]", where only additions occur.',
      'Tight limits where a lazy segment tree risks a time limit and the operations are just add and sum.',
      'You want the shortest code for range add and range sum, and a recursive tree feels heavy.',
    ],
    notThis: [
      'You need range min or max, or updates that assign: only a lazy segment tree supports those.',
      'You only read one index at a time: a single BIT over differences is enough.',
      'Sum of Subsequence Widths (LC 891), the only numbered problem here, is really sorting plus each element\'s contribution. It needs no tree.',
    ],
    concepts: [
      'With differences d, prefix(i) = sum of d[j] * (i - j + 1), which splits into i * sum(d[j]) - sum(d[j] * (j - 1)).',
      'b1 stores d[j], and b2 stores d[j] * (j - 1).',
      'range_add(l, r, v) adds v at l and -v at r + 1 in b1, and v * (l - 1) at l and -v * r at r + 1 in b2.',
      'prefix(i) = b1.prefix(i) * i - b2.prefix(i), and a range is the difference of two prefixes.',
    ],
    example: {
      problem: 'n = 4, range_add(2, 3, 5), then range_sum(1, 3) (1-indexed)',
      walkthrough: [
        'The array becomes [0, 5, 5, 0], so the expected sum is 10.',
        'b1 records +5 at position 2 and -5 at position 4.',
        'b2 records 5 * (2 - 1) = +5 at position 2 and -5 * 3 = -15 at position 4.',
        'prefix(3) = b1.prefix(3) * 3 - b2.prefix(3) = 5 * 3 - 5 = 10.',
        'prefix(0) = 0, so range_sum(1, 3) = 10 - 0 = 10.',
        'Check past the range: prefix(4) = 0 * 4 - (5 - 15) = 10, which is correct because a[4] is 0.',
      ],
    },
    code: `# Uses BIT from section 4; positions are 1-indexed
class RangeBIT:
    def __init__(self, n):
        self.b1, self.b2 = BIT(n), BIT(n)

    def range_add(self, l, r, v):
        self.b1.add(l, v)
        self.b1.add(r + 1, -v)
        self.b2.add(l, v * (l - 1))
        self.b2.add(r + 1, -v * r)

    def prefix(self, i):
        return self.b1.prefix(i) * i - self.b2.prefix(i)

    def range_sum(self, l, r):
        return self.prefix(r) - self.prefix(l - 1)`,
    complexity: 'O(log n) per range add and range sum, with four BIT operations per update. O(n) space.',
    pitfalls: [
      'Mixing index conventions in b2: the weights change with 0-indexing, so use l and r + 1 there instead of l - 1 and r.',
      'Overflow: b2 stores value times index, so use 64-bit integers.',
      'Trying to extend it to min or max: the derivation depends on subtraction.',
    ],
    pointsToPonder: [
      'Derive the two-BIT formula from the double sum. Which term depends on i and which doesn\'t?',
      'When would you still pick a lazy segment tree, even though this is shorter?',
      'What would a third BIT let you do if the update added an arithmetic progression?',
    ],
    practice: [891],
    snippet: '7-fenwick-tree-range-add-range-sum-query',
  },

  '7. 2D BIT / 2D Prefix': {
    crux: 'Extend the 1D idea to rectangles with inclusion-exclusion: use a 2D prefix if the matrix is static and a 2D BIT if it changes.',
    signals: [
      '"Sum of the rectangle with corners (row1, col1) and (row2, col2)", many times on a fixed matrix.',
      '"Update matrix[row][col]" mixed with "sumRegion": prefix tables can\'t absorb updates, so use a 2D BIT.',
      '"Number of submatrices that sum to target": fix a pair of rows and run the 1D hash-map count on column sums.',
      '"Largest square with sum at most threshold": binary search on the side length, using O(1) rectangle sums.',
    ],
    notThis: [
      'Count Submatrices With All Ones (LC 1504) and Largest Submatrix With Rearrangements (LC 1727) work on per-row column heights, with a monotonic stack or sorting.',
      'Rectangle updates with only a final read: use a 2D difference array, from section 2.',
      'A row-only or column-only aggregate: separate 1D structures per row are simpler.',
    ],
    concepts: [
      'P[i][j] is the sum of the top-left i-by-j rectangle.',
      'Build: P[i+1][j+1] = a[i][j] + P[i][j+1] + P[i+1][j] - P[i][j].',
      'Query: P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1].',
      'A 2D BIT nests two loops, one for rows and one for columns. It computes rectangles with the same four corners.',
    ],
    example: {
      problem: 'Range Sum Query 2D with matrix = [[3,0,1],[5,6,3],[1,2,0]], sumRegion(1, 1, 2, 2)',
      lc: 304,
      walkthrough: [
        'Row 1 of P, after the zero column: 3, 3, 4.',
        'Row 2: P[2][1] = 5 + 3 + 0 - 0 = 8, P[2][2] = 6 + 3 + 8 - 3 = 14, P[2][3] = 3 + 4 + 14 - 3 = 18.',
        'Row 3: P[3][1] = 1 + 8 + 0 - 0 = 9, P[3][2] = 2 + 14 + 9 - 8 = 17, P[3][3] = 0 + 18 + 17 - 14 = 21.',
        'sumRegion(1, 1, 2, 2) = P[3][3] - P[1][3] - P[3][1] + P[1][1].',
        'That is 21 - 4 - 9 + 3 = 11, which matches 6 + 3 + 2 + 0.',
      ],
    },
    code: `def build(a):
    n, m = len(a), len(a[0])
    P = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n):
        for j in range(m):
            P[i + 1][j + 1] = a[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j]
    return P

def region(P, r1, c1, r2, c2):
    return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]

# With updates (1-indexed)
class BIT2D:
    def __init__(self, n, m):
        self.t = [[0] * (m + 1) for _ in range(n + 1)]

    def add(self, r, c, delta):
        while r < len(self.t):
            j = c
            while j < len(self.t[0]):
                self.t[r][j] += delta
                j += j & -j
            r += r & -r

    def prefix(self, r, c):
        s = 0
        while r > 0:
            j = c
            while j > 0:
                s += self.t[r][j]
                j -= j & -j
            r -= r & -r
        return s`,
    complexity: '2D prefix: O(nm) build, O(1) per query. 2D BIT: O(log n * log m) per operation. Both use O(nm) space.',
    pitfalls: [
      'Sizing the table n by m: it needs n + 1 by m + 1, or the first row and column need special cases.',
      'Forgetting the + P[r1][c1] corner: it was subtracted twice.',
      'In the BIT, not resetting the column index for each row: copy c into j inside the outer loop.',
      'In LC 1074, looping over rows when columns are fewer: fix the smaller dimension for O(min^2 * max).',
    ],
    pointsToPonder: [
      'Draw the four rectangles in the query formula. Which area is counted how many times?',
      'How does fixing two rows reduce LC 1074 to a problem you have already solved?',
      'Why does binary search work in LC 1292: what happens to the feasibility of a smaller square?',
    ],
    practice: [304, 1292, 308, 1074],
    snippet: '4-2d-prefix-sum-matrix-rectangle-sum',
  },

  '8. Segment Tree — Point Update, Range Query': {
    crux: 'Store each segment\'s answer in a tree, so a range becomes O(log n) nodes and an update repairs one path.',
    signals: [
      '"Update index i" mixed with "minimum or maximum of [l, r]": anything that can\'t be subtracted.',
      'DP where dp[x] = 1 + best dp over a range of earlier values: read a range, then write a point.',
      '"Book [start, end) if it doesn\'t overlap": a range check followed by a write, when coordinates can be compressed.',
      'The aggregate needs a merge of two summaries, such as "longest run" or "majority candidate", not just a number.',
    ],
    notThis: [
      'You only need sums: a BIT is shorter and faster.',
      'Updates cover a range: repeating point updates is O(n log n) per update, so use lazy propagation.',
      'The array is static: use a sparse table for min or max and a prefix array for sums.',
      'Max Sum of Rectangle No Larger Than K (LC 363) relies on prefix sums and an ordered set. My Calendar I (LC 729) is simpler with a sorted map.',
    ],
    concepts: [
      'A node stores merge(left child, right child). You must define the merge and its identity value.',
      'Bottom-up layout: leaves sit at t[n..2n-1], and t[i] merges t[2i] and t[2i+1].',
      'A query walks up from both ends, taking a node whenever it is a right child on the left edge or a left child on the right edge.',
      'The merge must be associative. Keep left and right results separate if it isn\'t commutative.',
    ],
    example: {
      problem: 'Range Sum Query Mutable with nums = [1, 3, 5, 7]: query [1, 3), update(2, 10), query [1, 3)',
      lc: 307,
      walkthrough: [
        'Leaves t[4..7] = 1, 3, 5, 7. Then t[2] = 4, t[3] = 12 and t[1] = 16.',
        'query(1, 3): l = 5 and r = 7. l is odd, so res = t[5] = 3 and l = 6.',
        'r is odd, so r = 6 and res = 3 + t[6] = 8. Halving gives l = r = 3, so the loop stops with 8.',
        'update(2, 10): i = 6, so t[6] = 10. Then t[3] = 10 + 7 = 17 and t[1] = 4 + 17 = 21.',
        'query(1, 3) again: res = t[5] + t[6] = 3 + 10 = 13.',
      ],
    },
    code: `class SegTree:
    def __init__(self, a, op=lambda x, y: x + y, identity=0):
        self.n, self.op, self.id = len(a), op, identity
        self.t = [identity] * self.n + list(a)
        for i in range(self.n - 1, 0, -1):
            self.t[i] = op(self.t[2 * i], self.t[2 * i + 1])

    def update(self, i, v):
        i += self.n
        self.t[i] = v
        while i > 1:
            i //= 2
            self.t[i] = self.op(self.t[2 * i], self.t[2 * i + 1])

    def query(self, l, r):  # half-open [l, r)
        res, l, r = self.id, l + self.n, r + self.n
        while l < r:
            if l & 1:
                res = self.op(res, self.t[l])
                l += 1
            if r & 1:
                r -= 1
                res = self.op(res, self.t[r])
            l //= 2
            r //= 2
        return res`,
    complexity: 'O(n) build. O(log n) per update and query. O(n) space: 2n bottom-up, up to 4n recursive.',
    pitfalls: [
      'Mixing the half-open [l, r) of this version with the inclusive [l, r] of a recursive one: pick one per solution.',
      'Using the wrong identity: 0 for sum and max of non-negatives, +inf for min. A 0 identity silently breaks min.',
      'Merging a non-commutative aggregate in this loop\'s single res: keep separate left and right results.',
      'Allocating only 2n for a recursive tree: the recursive layout needs up to 4n.',
    ],
    pointsToPonder: [
      'Why is the number of nodes visited by a query O(log n), not O(n)?',
      'What should a node store to answer "longest run of equal values"?',
      'Which part of the tree does a point update have to recompute, and why nothing else?',
    ],
    practice: [307, 729, 300, 673, 2407],
    snippet: '8-segment-tree-range-sum-point-update',
  },

  '9. Segment Tree with Lazy Propagation (Range Update + Range Query)': {
    crux: 'Stop at fully covered nodes and leave a note, and pass that note to the children only when you must go below.',
    signals: [
      '"Add x to all elements in [l, r]" mixed with "sum of [l, r]".',
      '"Flip all bits in [l, r]" mixed with "count the ones", as in LC 2569.',
      '"Drop a square and report the tallest stack" or "track and remove a range": assign over a range, then query over a range.',
      'Two or more range operations must compose, such as assign then add.',
    ],
    notThis: [
      'Only additions and sums: two BITs are shorter.',
      'You only read one index: a BIT over differences is enough.',
      'All updates come before queries: a difference array is linear.',
      'Painting the Walls (LC 2742) is a knapsack and Max Sum of 3 Non-Overlapping Subarrays (LC 689) is a window DP. Neither needs a lazy tree, despite being listed here.',
    ],
    concepts: [
      'A node\'s value is always correct for its segment. Its lazy tag describes what the children still owe.',
      'apply(node, v): update the node\'s value for its full length, and merge v into its tag.',
      'push(node): apply the tag to both children, then clear it. Do this before going below the node.',
      'After recursing, recompute the node from its children.',
      'Tag composition depends on the operation: adds sum, flips XOR, and an assign overwrites any pending tag.',
    ],
    example: {
      problem: 'a = [1, 2, 3, 4]: add(0, 1, +10), then query(1, 2)',
      walkthrough: [
        'Build: node 1 covers [0,3] with sum 10, node 2 covers [0,1] with sum 3, node 3 covers [2,3] with sum 7, and leaves 4 to 7 hold 1, 2, 3, 4.',
        'add(0, 1, +10): node 1 is partly covered, so go down. Node 2 is fully covered: its sum becomes 3 + 10 * 2 = 23 and lazy[2] = 10. Stop there.',
        'Node 3 doesn\'t overlap. Going back up, node 1 becomes 23 + 7 = 30. Leaves 4 and 5 are now stale, which is fine.',
        'query(1, 2): node 2 is partly covered, so push first: leaf 4 becomes 11, leaf 5 becomes 12, and lazy[2] = 0.',
        'Leaf 4 is outside the range and gives 0. Leaf 5 is inside and gives 12.',
        'Node 3 is partly covered with no tag. Leaf 6 gives 3 and leaf 7 gives 0.',
        'The answer is 12 + 3 = 15, which matches a[1] + a[2] = 12 + 3.',
      ],
    },
    code: `class LazySeg:
    def __init__(self, a):
        self.n = len(a)
        self.sum = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, a)

    def build(self, node, l, r, a):
        if l == r:
            self.sum[node] = a[l]
            return
        m = (l + r) // 2
        self.build(2 * node, l, m, a)
        self.build(2 * node + 1, m + 1, r, a)
        self.sum[node] = self.sum[2 * node] + self.sum[2 * node + 1]

    def apply(self, node, l, r, v):
        self.sum[node] += v * (r - l + 1)
        self.lazy[node] += v

    def push(self, node, l, r):
        if self.lazy[node]:
            m = (l + r) // 2
            self.apply(2 * node, l, m, self.lazy[node])
            self.apply(2 * node + 1, m + 1, r, self.lazy[node])
            self.lazy[node] = 0

    def add(self, ql, qr, v, node=1, l=0, r=None):
        r = self.n - 1 if r is None else r
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            self.apply(node, l, r, v)
            return
        self.push(node, l, r)
        m = (l + r) // 2
        self.add(ql, qr, v, 2 * node, l, m)
        self.add(ql, qr, v, 2 * node + 1, m + 1, r)
        self.sum[node] = self.sum[2 * node] + self.sum[2 * node + 1]

    def query(self, ql, qr, node=1, l=0, r=None):
        r = self.n - 1 if r is None else r
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.sum[node]
        self.push(node, l, r)
        m = (l + r) // 2
        return (self.query(ql, qr, 2 * node, l, m)
                + self.query(ql, qr, 2 * node + 1, m + 1, r))`,
    complexity: 'O(n) build. O(log n) per range update and query. O(n) space with 4n arrays.',
    pitfalls: [
      'Recursing into children before pushing: they return stale values.',
      'Forgetting to recompute the parent after an update: higher nodes keep old sums.',
      'Using 0 to mean "no pending assign" when 0 is a valid value: keep a separate marked flag.',
      'Composing tags wrongly: an assign must discard a pending add, and an add arriving after an assign changes the assign value.',
      'Scaling by the wrong length: sum changes by v * (r - l + 1), but a max changes by just v.',
    ],
    pointsToPonder: [
      'Why is it safe for a leaf to be wrong as long as an ancestor holds its tag?',
      'What should the tag store if the operations are both add and assign?',
      'In LC 2569, how does flipping a segment change its count of ones without visiting the leaves?',
    ],
    practice: [699, 715, 850, 2569],
    snippet: '10-lazy-segment-tree-range-add-range-sum-query',
  },

  '10. Segment Tree on Coordinates / Coordinate Compression': {
    crux: 'Only the order of the values matters, so replace huge values with their ranks and index the tree by rank.',
    signals: [
      '"-10^9 <= nums[i] <= 10^9" with n up to 10^5, and a tree or BIT indexed by value.',
      '"How many elements to the right are smaller than nums[i]?": count on value ranks during a scan.',
      '"Number of pairs with nums[i] > 2 * nums[j]" or "lower <= sum <= upper": the lookup value isn\'t in the array itself.',
      '"Squares drop at positions up to 10^8" or "rectangles up to 10^9": compress the interval endpoints.',
    ],
    notThis: [
      'Values are already small: index by value directly.',
      'Pair counts can also use merge sort, which needs no tree and sometimes less code.',
      'The problem is online with unseen values: you can\'t rank in advance, so use a dynamic segment tree.',
      'Maximum White Tiles Covered by a Carpet (LC 2271) is sorting with a sliding window and prefix sums.',
    ],
    concepts: [
      'sorted(set(values)) gives the rank table, and bisect or a map converts a value to its rank.',
      'Include every value you will look up, not just the input: 2 * x for LC 493, pref - upper for LC 327.',
      'Scan in one direction, query the tree for elements seen so far, then insert.',
      'For intervals, leaf i stands for the gap [xs[i], xs[i+1]), so its real length comes from xs.',
    ],
    example: {
      problem: 'Count of Smaller Numbers After Self with nums = [5, 2, 6, 1]',
      lc: 315,
      walkthrough: [
        'The sorted distinct values are [1, 2, 5, 6], so the ranks are 1->1, 2->2, 5->3 and 6->4. Scan from the right.',
        'i = 3, value 1, rank 1: prefix(0) = 0. Add at rank 1, so t[1], t[2] and t[4] become 1.',
        'i = 2, value 6, rank 4: prefix(3) = t[3] + t[2] = 0 + 1 = 1. Add at rank 4, so t[4] = 2.',
        'i = 1, value 2, rank 2: prefix(1) = t[1] = 1. Add at rank 2, so t[2] = 2 and t[4] = 3.',
        'i = 0, value 5, rank 3: prefix(2) = t[2] = 2. Add at rank 3, so t[3] = 1 and t[4] = 4.',
        'The answer is [2, 1, 1, 0].',
      ],
    },
    code: `# Uses BIT from section 4
def count_smaller(nums):
    rank = {v: i + 1 for i, v in enumerate(sorted(set(nums)))}
    bit = BIT(len(rank))
    ans = [0] * len(nums)
    for i in range(len(nums) - 1, -1, -1):
        r = rank[nums[i]]
        ans[i] = bit.prefix(r - 1)  # strictly smaller
        bit.add(r, 1)
    return ans`,
    complexity: 'O(n log n) to sort the values and O(log n) per tree operation. O(n) space for the rank table and tree.',
    pitfalls: [
      'Compressing only the input when the lookup uses a different value: bisect into the table, or add those values first.',
      'Using prefix(r) when the problem wants strictly smaller: duplicates of the current value get counted.',
      'In LC 493, computing 2 * x in 32 bits: it overflows.',
      'Compressing interval endpoints and treating leaves as points: [1, 2] and [3, 4] look adjacent, and lengths come out wrong.',
    ],
    pointsToPonder: [
      'Why is compression allowed when the question only compares values? When would it be wrong?',
      'In LC 327, what prefixes are you counting, and which ranks bound them?',
      'How does LC 2426 become a counting problem after you move terms to one side?',
    ],
    practice: [315, 493, 327, 2426, 218],
    snippet: '5-fenwick-tree-point-update-range-sum-query',
  },

  '11. Segment Tree + DP': {
    crux: 'When a DP transition takes the best value over a range of earlier states, a tree over those states makes it O(log n).',
    signals: [
      '"Longest subsequence where adjacent elements differ by at most k": dp[x] needs the best dp over values [x - k, x - 1].',
      '"Subsequence where consecutive indices differ by at most k": dp[i] needs the best over the last k indices.',
      '"Best team with no conflicts" or "maximum earnings from rides": sort first, then the transition reads a range of earlier states.',
      'A plain O(n^2) DP is obvious, n is 10^5, and the inner loop only computes a min or max.',
    ],
    notThis: [
      'The range slides forward with i, as in LC 1425: a monotonic deque gives O(n).',
      'Plain LIS or Russian Doll Envelopes (LC 354): patience sorting with binary search is shorter.',
      'Weighted intervals, as in LC 1235: sort by end and binary search into the DP array.',
    ],
    concepts: [
      'Index the tree by whatever defines the range: value, position or sorted rank.',
      'Each step reads a range for the best earlier answer, adds this element, and writes a point.',
      'The processing order enforces the "earlier" rule: anything not yet inserted can\'t be chosen.',
      'Counting variants, as in LC 673, store (best length, ways) and merge on ties.',
    ],
    example: {
      problem: 'Longest Increasing Subsequence II with nums = [1, 5, 3, 4], k = 2',
      lc: 2407,
      walkthrough: [
        'Keep a max tree over values 0 to 5, all 0. Each x reads values in [x - k, x - 1].',
        'x = 1: the best in [0, 0] is 0, so cur = 1. Set dp[1] = 1.',
        'x = 5: the best in [3, 4] is 0, so cur = 1. Set dp[5] = 1.',
        'x = 3: the best in [1, 2] is dp[1] = 1, so cur = 2. Set dp[3] = 2.',
        'x = 4: the best in [2, 3] is dp[3] = 2, so cur = 3. Set dp[4] = 3.',
        'The answer is 3, from the subsequence 1, 3, 4.',
      ],
    },
    code: `# Uses SegTree from section 8
def length_of_lis(nums, k):
    st = SegTree([0] * (max(nums) + 1), max, 0)
    best = 0
    for x in nums:
        cur = st.query(max(0, x - k), x) + 1  # values in [x - k, x - 1]
        st.update(x, cur)  # never lowers dp[x]: the range only improves
        best = max(best, cur)
    return best`,
    complexity: 'O(n log V) time and O(V) space, where V is the largest value. Compress the values if V is large.',
    pitfalls: [
      'Querying a range that includes x itself: the subsequence would stop being strictly increasing.',
      'In LC 354 and LC 1626, getting the tie order wrong: equal keys can chain unless the sort handles them.',
      'In LC 1425, forgetting that the best earlier value may be negative: use nums[i] + max(0, best).',
      'Reaching for a tree when the window only slides forward: a deque is simpler.',
    ],
    pointsToPonder: [
      'How do you decide whether to index the tree by value or by position?',
      'What does processing in sorted order guarantee in LC 1626?',
      'What should a node store in LC 673, and how do you merge two nodes with the same length?',
    ],
    practice: [673, 1626, 2008, 1425, 2407],
    snippet: '9-segment-tree-range-min-query-point-update',
  },

  '12. Segment Tree Descent / Walk on Tree': {
    crux: 'Let each node\'s summary tell you which child holds the answer, and walk from root to leaf in O(log n).',
    signals: [
      '"Find the earliest row with at least k free seats": the first index where a value is at least x.',
      '"Find the k-th one" or "the k-th smallest" among values that change: walk by subtree counts.',
      'You first think of binary search over range queries, which costs O(log^2 n).',
      'Queries like "leftmost index in [l, r] satisfying..." where a node can rule out its whole segment.',
    ],
    notThis: [
      'No updates: binary search over a prefix array or sparse table is simpler.',
      'A global minimum or maximum only: a heap is enough.',
      'The property can\'t be decided from a node summary: without a yes or no at each node, you can\'t choose a side.',
      'Online Majority Element In Subarray (LC 1157) also needs stored positions and a binary search, or randomized sampling. The descent is only part of it.',
    ],
    concepts: [
      'For "first value >= x", store max. If the left child\'s max >= x, go left, otherwise go right.',
      'For "k-th one", store counts. If k <= left count, go left, otherwise subtract it and go right.',
      'Check the root first: if the root fails, no leaf can succeed.',
      'To restrict to [l, r], split into O(log n) covering nodes and descend into the first one that qualifies.',
    ],
    example: {
      problem: 'Booking Concert Tickets, gather step, with free seats = [2, 5, 1, 4], k = 4, maxRow = 3',
      lc: 2286,
      walkthrough: [
        'Leaves t[4..7] = 2, 5, 1, 4. Then t[2] = 5, t[3] = 4 and t[1] = 5.',
        'first_at_least(4): t[1] = 5 passes, and t[2] = 5 >= 4, so go left to node 2.',
        't[4] = 2 < 4, so go right to node 5. That leaf is row 1, which is within maxRow.',
        'Book 4 seats: update(1, 1) sets t[5] = 1, then t[2] = 2 and t[1] = 4.',
        'The next request for 4: t[1] = 4 passes, but t[2] = 2 < 4, so go right to node 3.',
        't[6] = 1 < 4, so go right to node 7, which is row 3.',
        'A request for 5 now fails right away because t[1] = 4.',
      ],
    },
    code: `class MaxTree:
    def __init__(self, a):
        self.size = 1
        while self.size < len(a):
            self.size *= 2  # descent needs a power of two
        self.t = [0] * (2 * self.size)
        self.t[self.size:self.size + len(a)] = a
        for i in range(self.size - 1, 0, -1):
            self.t[i] = max(self.t[2 * i], self.t[2 * i + 1])

    def update(self, i, v):
        i += self.size
        self.t[i] = v
        while i > 1:
            i //= 2
            self.t[i] = max(self.t[2 * i], self.t[2 * i + 1])

    def first_at_least(self, x, limit):
        if self.t[1] < x:
            return -1
        i = 1
        while i < self.size:
            i = 2 * i if self.t[2 * i] >= x else 2 * i + 1
        pos = i - self.size
        return pos if pos <= limit else -1`,
    complexity: 'O(log n) per descent and per update, against O(log^2 n) for binary search over range queries. O(n) space.',
    pitfalls: [
      'Using the bottom-up layout with n not a power of two: nodes no longer follow array order, so "go left first" can return the wrong index. Pad to a power of two.',
      'Trying the right child first: you find an answer, but not the leftmost.',
      'Rejecting by limit too early: find the leftmost match first, then compare it with limit.',
      'In LC 2286, scanning rows one by one in scatter: skip fully booked rows with a moving pointer or a sum descent.',
    ],
    pointsToPonder: [
      'Why is one descent faster than binary searching with range queries, even though both use the same tree?',
      'What must a node store so the walk can pick a side without looking further down?',
      'How does restricting the search to [l, r] change the number of nodes you visit?',
    ],
    practice: [1157, 2286],
  },

  '13. Merge Sort Tree / Persistent Segment Tree': {
    crux: 'To ask about values inside an index range, keep sorted lists per segment, or keep a version of the tree for every prefix.',
    signals: [
      '"How many values in a[l..r] are at most x?", with queries answered as they arrive.',
      '"Find the k-th smallest in a[l..r]": a persistent tree per prefix, compared by subtraction.',
      '"Number of distinct values in a[l..r]", when you can\'t reorder queries for Mo\'s algorithm.',
      '"What was the answer as of version v?": keep the old roots and share the unchanged nodes.',
    ],
    notThis: [
      'All queries are known up front: sort them by x and sweep with a BIT, which is shorter and uses O(n) memory.',
      'A count over the whole array, as in Count of Smaller Numbers After Self (LC 315): a BIT with compression is enough.',
      'Values change often: a merge sort tree can\'t update cheaply, so look at a BIT of ordered sets or square root decomposition.',
    ],
    concepts: [
      'Merge sort tree: each node keeps its segment sorted, which is what merge sort produces level by level.',
      'A query splits [l, r] into O(log n) nodes and binary searches in each one.',
      'Persistence: an update copies only the O(log n) nodes on one path and creates a new root.',
      'k-th smallest: the tree over value ranks for prefix r, minus the one for prefix l - 1, gives the counts for [l, r]. Walk down by those counts.',
    ],
    example: {
      problem: 'Count values at most x = 3 in a[1..3] for a = [5, 1, 4, 2]',
      walkthrough: [
        'Build the sorted lists: the leaves are [5], [1], [4], [2]. Their parents are [1, 5] and [2, 4], and the root is [1, 2, 4, 5].',
        'The root covers [0, 3], which is only partly inside [1, 3], so go down.',
        'The left child covers [0, 1], again partly inside. Leaf 0 is outside and gives 0.',
        'Leaf 1 is inside, with list [1]. bisect_right gives 1.',
        'The right child covers [2, 3], fully inside, with list [2, 4]. bisect_right(3) gives 1.',
        'The total is 1 + 0 + 1 = 2, which matches the values 1 and 2.',
      ],
    },
    code: `from bisect import bisect_right
from heapq import merge

class MergeSortTree:
    def __init__(self, a):
        self.n = len(a)
        self.tree = [[] for _ in range(4 * self.n)]
        self.build(1, 0, self.n - 1, a)

    def build(self, node, l, r, a):
        if l == r:
            self.tree[node] = [a[l]]
            return
        m = (l + r) // 2
        self.build(2 * node, l, m, a)
        self.build(2 * node + 1, m + 1, r, a)
        self.tree[node] = list(merge(self.tree[2 * node], self.tree[2 * node + 1]))

    def count(self, ql, qr, x, node=1, l=0, r=None):  # values <= x
        r = self.n - 1 if r is None else r
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return bisect_right(self.tree[node], x)
        m = (l + r) // 2
        return (self.count(ql, qr, x, 2 * node, l, m)
                + self.count(ql, qr, x, 2 * node + 1, m + 1, r))`,
    complexity: 'Merge sort tree: O(n log n) time and space to build, O(log^2 n) per query. Persistent tree: O(log n) per version and per query, O(n log n) space.',
    pitfalls: [
      'Using upper_bound when the question says strictly less: "at most x" and "less than x" differ by one bisect choice.',
      'Reusing a node in a persistent tree by writing to it: always copy, or older versions change too.',
      'Underestimating memory: n log n integers at n = 10^6 is often over the limit.',
      'Getting k-th smallest with merge sort tree alone: it needs another binary search over values, for O(log^3 n) per query.',
    ],
    pointsToPonder: [
      'Why does each element appear in only O(log n) lists?',
      'What makes subtraction of two tree versions valid for the k-th smallest query?',
      'How would you turn "number of distinct values in [l, r]" into a count over previous-occurrence indices?',
    ],
    practice: [315],
    snippet: '17-count-elements-x-in-subarray-l-r-merge-sort-tree',
  },

  '14. Mo\'s Algorithm (Offline Range Queries)': {
    crux: 'Answer queries in an order that moves a window as little as possible, when adding or removing one element is easy.',
    signals: [
      '"Number of distinct values in a[l..r]" for 10^5 queries, all given before you must answer.',
      '"Most frequent value in each range": adding one element is easy, but merging two ranges isn\'t.',
      'Your node summary would have to be a whole frequency table, so a segment tree won\'t merge cheaply.',
      'n and q are about 10^5 and the time limit allows roughly 10^8 simple steps.',
    ],
    notThis: [
      'Queries must be answered online: the reordering isn\'t allowed, so use a persistent tree.',
      'Plain sum, min or max: prefix sums, a sparse table or a segment tree are all faster.',
      'Some listed problems have simpler answers: LC 992 subtracts two at-most-k windows, LC 2488 counts balance prefixes around k, and LC 2080 binary searches on stored positions.',
    ],
    concepts: [
      'Split the left endpoints into blocks of size about sqrt(n). Sort by (block of l, r).',
      'Within a block, r only moves forward and l moves at most one block per query, which gives the bound.',
      'Keep a current window [L, R] and move it one element at a time with add and remove.',
      'Answers are stored at each query\'s original index, because you process them out of order.',
    ],
    example: {
      problem: 'Distinct count on a = [1, 2, 1, 3] with queries (0, 2) and (1, 3)',
      walkthrough: [
        'Here size = 2. Both queries have l in block 0, so sorting by r leaves them in this order.',
        'Start with the empty window L = 0, R = -1 and distinct = 0.',
        'Query (0, 2): add a[0] = 1, so distinct = 1. Add a[1] = 2, so distinct = 2. Add a[2] = 1, whose count goes to 2, so distinct stays 2. Store 2.',
        'Query (1, 3): add a[3] = 3, so distinct = 3. Remove a[0] = 1, whose count falls to 1, so distinct stays 3. Store 3.',
        'The answers are [2, 3].',
      ],
    },
    code: `from collections import Counter

def distinct_in_ranges(a, queries):
    size = max(1, int(len(a) ** 0.5))
    order = sorted(range(len(queries)),
                   key=lambda q: (queries[q][0] // size, queries[q][1]))
    freq, distinct = Counter(), 0
    L, R = 0, -1
    ans = [0] * len(queries)

    for q in order:
        l, r = queries[q]
        while R < r:  # grow before shrinking
            R += 1
            freq[a[R]] += 1
            distinct += freq[a[R]] == 1
        while L > l:
            L -= 1
            freq[a[L]] += 1
            distinct += freq[a[L]] == 1
        while R > r:
            freq[a[R]] -= 1
            distinct -= freq[a[R]] == 0
            R -= 1
        while L < l:
            freq[a[L]] -= 1
            distinct -= freq[a[L]] == 0
            L += 1
        ans[q] = distinct
    return ans`,
    complexity: 'O((n + q) * sqrt(n)) window moves, plus O(q log q) to sort. O(n + q) space.',
    pitfalls: [
      'Shrinking before growing: the window can become invalid, with L past R, and counts go negative.',
      'Returning answers in sorted order: store them by original index.',
      'Indexing freq by raw values up to 10^9: compress them first.',
      'A wrong block size: a fixed or too-small block loses the sqrt bound.',
      'Using it when removal is hard, such as for max: you need a rollback variant that only adds.',
    ],
    pointsToPonder: [
      'Work out the total movement of R and of L. Why does sqrt(n) balance them?',
      'Why does sorting odd blocks by descending r speed things up in practice?',
      'What would you do if a query could arrive between updates to the array?',
    ],
    practice: [2080, 992, 2488],
    snippet: '18-mo-s-algorithm-offline-range-queries',
  },

  '15. Square Root Decomposition': {
    crux: 'Split the array into about sqrt(n) blocks: whole blocks use a summary, and the edges are done by hand.',
    signals: [
      'A range operation whose results won\'t merge cleanly, such as "count values at least x in [l, r], with range adds".',
      '"Update, then query" with n and q around 10^5, where about 10^7 to 10^8 steps fit the limit.',
      'You can picture a per-block summary, like a sorted copy of the block, but no tree node summary.',
      'You want something simple to code first, with less risk than a complex tree.',
    ],
    notThis: [
      'Plain sum, min or max: a BIT or segment tree gets O(log n) with about the same code.',
      'Queries can be reordered: Mo\'s algorithm often has a smaller constant for frequency questions.',
      'Shortest Subarray with Sum at Least K (LC 862) is a monotonic deque on prefix sums, despite being listed here. LC 1157 has simpler position-based answers too.',
    ],
    concepts: [
      'With block size b, a query touches at most 2b edge elements and n / b whole blocks. b = sqrt(n) balances them.',
      'Each block keeps a summary: a sum, a sorted copy, or a pending add.',
      'A point update changes one element and fixes one block\'s summary.',
      'Range add: tag whole blocks, and rewrite the elements at the edges.',
    ],
    example: {
      problem: 'Range Sum Query Mutable with nums = [1, 3, 5, 2, 4, 6]: query(1, 5), update(4, 10), query(1, 5)',
      lc: 307,
      walkthrough: [
        'size = int(sqrt(6)) + 1 = 3, so the blocks are [1, 3, 5] and [2, 4, 6] with sums 9 and 12.',
        'query(1, 5): l = 1 isn\'t a block start, so add a[1] = 3 and move to l = 2.',
        'l = 2 isn\'t a block start, so add a[2] = 5 and move to l = 3.',
        'l = 3 starts a block and 3 + 2 <= 5, so add the block sum 12 and jump to l = 6. The total is 20.',
        'update(4, 10): the block sum grows by 10 - 4 = 6 to 18, and a[4] = 10.',
        'query(1, 5) again: 3 + 5 + 18 = 26.',
      ],
    },
    code: `class SqrtSum:
    def __init__(self, a):
        self.a = a
        self.size = int(len(a) ** 0.5) + 1
        self.block = [0] * self.size
        for i, x in enumerate(a):
            self.block[i // self.size] += x

    def update(self, i, v):
        self.block[i // self.size] += v - self.a[i]
        self.a[i] = v

    def query(self, l, r):  # inclusive
        res = 0
        while l <= r:
            if l % self.size == 0 and l + self.size - 1 <= r:
                res += self.block[l // self.size]
                l += self.size
            else:
                res += self.a[l]
                l += 1
        return res`,
    complexity: 'O(n) build, O(1) per point update here, and O(sqrt(n)) per query. O(sqrt(n)) extra space for block sums.',
    pitfalls: [
      'Overwriting a[i] before computing the delta: the block sum then gets v - v = 0.',
      'Taking a whole block without checking that it ends within r: the block can run past the query.',
      'With block tags, forgetting to include the tag when you read an edge element.',
      'A slow block size: for sorted-block queries the best b is larger than sqrt(n), because each block adds a log factor.',
    ],
    pointsToPonder: [
      'If a query costs n / b + b, what value of b minimizes it, and what changes when whole blocks cost log b?',
      'When is O(sqrt(n)) per query fast enough to beat a harder O(log n) design in practice?',
      'How would you support "count values at least x" with a sorted copy per block?',
    ],
    practice: [307, 862, 1157],
    snippet: '16-sqrt-decomposition-range-sum-point-update',
  },

  '16. Heavy-Light Decomposition / LCA + Segment Tree': {
    crux: 'Cut the tree into chains so any path crosses O(log n) of them, then answer each chain with a segment tree.',
    signals: [
      '"Sum or maximum on the path from u to v", mixed with "update the value of node x".',
      '"Maximum edge weight between two nodes" with changing weights.',
      '"Add to every node in the subtree of x" and "sum of the subtree": this needs only an Euler tour.',
      'A tree with 10^5 nodes and 10^5 queries, where walking each path is too slow.',
    ],
    notThis: [
      'Only subtree queries: an Euler tour plus a BIT is much shorter.',
      'Only LCA or static path sums: binary lifting, or root prefix sums plus LCA, is enough.',
      'Number of Good Paths (LC 2421) adds nodes in value order with a DSU, and LCA II (LC 1644) is one recursive DFS. Neither needs this, despite being listed.',
    ],
    concepts: [
      'The heavy child is the one with the largest subtree. Every other edge is light.',
      'Going down a light edge at least halves the subtree size, so a path has O(log n) light edges.',
      'Visiting the heavy child first makes each chain a contiguous block of positions.',
      'For a path query, repeatedly lift the node whose chain head is deeper, querying its chain segment, until both are on one chain.',
      'The same order gives each subtree the block [pos[u], pos[u] + size[u] - 1].',
    ],
    example: {
      problem: 'Path sum from 4 to 2 on edges 0-1, 0-2, 1-3, 1-4 with node values [1, 2, 3, 4, 5]',
      walkthrough: [
        'Subtree sizes are 5, 3, 1, 1, 1 for nodes 0 to 4. The heavy child of 0 is 1, and the heavy child of 1 is 3, the first of a tie.',
        'The chains are 0-1-3, 4 and 2. The positions are 0:0, 1:1, 3:2, 4:3, 2:4, so the base array is [1, 2, 4, 5, 3].',
        'u = 4 has head 4 at depth 2 and v = 2 has head 2 at depth 1. Lift u, the deeper head: add positions [3, 3], which is 5. Then u = parent[4] = 1.',
        'u = 1 has head 0 at depth 0 and v = 2 has head 2 at depth 1. Swap so u = 2: add positions [4, 4], which is 3. Then u = parent[2] = 0 and v = 1.',
        'Both are now on chain 0. Add positions [0, 1], which is 1 + 2 = 3.',
        'The total is 5 + 3 + 3 = 11, which matches 5 + 2 + 1 + 3 along 4-1-0-2.',
      ],
    },
    code: `# Uses SegTree from section 8; build it over values by pos
def build_hld(adj, root=0):
    n = len(adj)
    par, depth, size = [-1] * n, [0] * n, [1] * n
    heavy, head, pos = [-1] * n, [0] * n, [0] * n

    def dfs(u):
        best = 0
        for v in adj[u]:
            if v != par[u]:
                par[v], depth[v] = u, depth[u] + 1
                dfs(v)
                size[u] += size[v]
                if size[v] > best:
                    best, heavy[u] = size[v], v
    dfs(root)

    cur = 0
    def decompose(u, h):
        nonlocal cur
        head[u], pos[u] = h, cur
        cur += 1
        if heavy[u] != -1:
            decompose(heavy[u], h)
        for v in adj[u]:
            if v != par[u] and v != heavy[u]:
                decompose(v, v)
    decompose(root, root)
    return par, depth, head, pos

def path_sum(u, v, par, depth, head, pos, st):
    res = 0
    while head[u] != head[v]:
        if depth[head[u]] < depth[head[v]]:
            u, v = v, u
        res += st.query(pos[head[u]], pos[u] + 1)
        u = par[head[u]]
    if pos[u] > pos[v]:
        u, v = v, u
    return res + st.query(pos[u], pos[v] + 1)`,
    complexity: 'O(n) to decompose. O(log^2 n) per path query or update with a segment tree: O(log n) chains, each O(log n). O(n) space.',
    pitfalls: [
      'Comparing the depths of u and v instead of their chain heads: you can lift past the LCA.',
      'Recursion depth on a long chain: Python and sometimes C++ need an iterative DFS at 10^5 nodes.',
      'For edge weights, stored at the child: skip the LCA with pos[u] + 1 on the last segment.',
      'Non-commutative merges: the two sides of a path run in opposite directions, so keep them separate.',
    ],
    pointsToPonder: [
      'Why does a light edge at least halve the subtree size, and why does that bound the number of chains?',
      'Why does the same visiting order serve both path queries and subtree queries?',
      'What would you use if the tree edges could also be added and removed?',
    ],
    practice: [1644, 2421],
  },

  '17. Range Queries in Design / Online Problems': {
    crux: 'List the operations and their frequency first, because the required mix chooses the structure.',
    signals: [
      '"Implement a class with book(start, end)": a sorted map of intervals.',
      '"snap() and get(index, snap_id)": per-index history with a binary search.',
      '"Return the frequency of value in the subarray [left, right]": positions per value with a binary search.',
      '"Seat the student as far as possible from others": a sorted set of occupied seats or gaps.',
      '"Latest, max and min price, where a correction can arrive for an old timestamp": a map plus an ordered multiset.',
    ],
    notThis: [
      'There are no mutations: precompute with a prefix array or sparse table, and skip the class-level structure.',
      'Writes are rare and reads are constant: rebuilding on write can be simplest.',
      'Every query can be read first, as in Number of Flowers in Full Bloom (LC 2251): sort and sweep offline.',
    ],
    concepts: [
      'Interval sets: keep disjoint intervals in a sorted map, and merge or split around the changed range.',
      'Versioning: a history list per key costs far less than copying the array on each snapshot.',
      'Positions per value: a count in [l, r] is two binary searches.',
      'Dynamic segment tree: create nodes only when touched, for coordinates up to 10^9 that aren\'t known ahead.',
    ],
    example: {
      problem: 'Range Frequency Queries with arr = [1, 2, 1, 3, 1]: query(1, 4, 1) and query(0, 1, 3)',
      lc: 2080,
      walkthrough: [
        'Build the positions: 1 -> [0, 2, 4], 2 -> [1] and 3 -> [3].',
        'query(1, 4, 1): bisect_left([0, 2, 4], 1) = 1, the first position at or after 1.',
        'bisect_right([0, 2, 4], 4) = 3, just past the last position at or before 4.',
        'The count is 3 - 1 = 2, for positions 2 and 4.',
        'query(0, 1, 3): in [3], bisect_left of 0 is 0 and bisect_right of 1 is 0, so the count is 0.',
      ],
    },
    code: `from bisect import bisect_left, bisect_right
from collections import defaultdict

class RangeFreqQuery:
    def __init__(self, arr):
        self.pos = defaultdict(list)
        for i, x in enumerate(arr):
            self.pos[x].append(i)  # sorted, since i only grows

    def query(self, left, right, value):
        p = self.pos[value]
        return bisect_right(p, right) - bisect_left(p, left)`,
    complexity: 'For this design: O(n) build, O(log n) per query, O(n) space. Other designs here cost O(log n) per operation with a sorted map or segment tree.',
    pitfalls: [
      'Mixing interval conventions: LC 729 and LC 715 use half-open ranges, so touching intervals don\'t overlap.',
      'In LC 1146, returning the latest value for an old snapshot: binary search for the last write at or before snap_id.',
      'In LC 2034, leaving stale prices behind: remove the old price from the multiset, or discard stale heap entries when they surface.',
      'In LC 855, removing a seat without merging the two neighbouring gaps.',
      'Pre-allocating a tree for 10^9 coordinates: use a dynamic tree or compress the values.',
    ],
    pointsToPonder: [
      'For each design, which operation would you make slower to make the frequent one faster?',
      'When does a sorted map beat a segment tree for intervals, and when does it lose?',
      'What would LC 2080 need if the array could be updated too?',
    ],
    practice: [729, 1146, 2080, 2034, 855],
  },

  '18. Advanced / Contest-Level Range Query Problems': {
    crux: 'Reduce the problem first, into events, ranks and a sweep. Then decide what a node stores and how updates compose.',
    signals: [
      '"Total area covered by all the rectangles, counting overlaps once": sweep one axis and track covered length on the other.',
      '"Outline formed by the buildings": a sweep over x with the current maximum height.',
      '"Flip this range, then add p times the count of ones": one tree tracks the state that another operation consumes.',
      '"Number of range sums between lower and upper": prefix sums, then a counted pair inequality on ranks.',
    ],
    notThis: [
      'A simpler tool still fits: try the choices in earlier sections before designing a custom node.',
      'The Skyline Problem (LC 218) is usually simpler with a sweep and a heap of active heights.',
      'Pair-count problems (LC 327, LC 493) also fall to merge sort, with no tree at all.',
    ],
    concepts: [
      'Turn 2D problems into 1D plus time: sweep one axis, and let the tree hold the state of the other.',
      'Compress coordinates so tree size depends on n and not on the range of values.',
      'Before coding, write down the node value, the tag, the merge and the tag composition.',
      'For the area problem each update is undone by an exactly matching removal, so a cover count needs no push-down.',
    ],
    example: {
      problem: 'Rectangle Area II with rectangles = [[0,0,2,2],[1,0,2,3],[1,0,3,1]]',
      lc: 850,
      walkthrough: [
        'xs = [0, 1, 2, 3], so the leaves are the gaps [0,1), [1,2) and [2,3). Events sorted by y: at y = 0 add all three, at y = 1 remove [1,3), at y = 2 remove [0,2), at y = 3 remove [1,2).',
        'y = 0: covered length is 0, so no area is added. After the three adds, the union is [0,3), so covered length = 3.',
        'y = 1: area += 3 * 1 = 3. Remove [1,3). The rest is [0,2), so covered length = 2.',
        'y = 2: area += 2 * 1, giving 5. Remove [0,2). The rest is [1,2), so covered length = 1.',
        'y = 3: area += 1 * 1, giving 6. Remove [1,2), which leaves nothing covered.',
        'The answer is 6.',
      ],
    },
    code: `def rectangle_area(rects):
    xs = sorted({x for r in rects for x in (r[0], r[2])})
    idx = {x: i for i, x in enumerate(xs)}
    events = []
    for x1, y1, x2, y2 in rects:
        events.append((y1, idx[x1], idx[x2], 1))
        events.append((y2, idx[x1], idx[x2], -1))
    events.sort()

    m = len(xs) - 1  # leaf i is the gap [xs[i], xs[i + 1])
    cnt, cov = [0] * (4 * len(xs)), [0] * (4 * len(xs))

    def update(node, l, r, a, b, v):  # node covers leaves [l, r)
        if b <= l or r <= a:
            return
        if a <= l and r <= b:
            cnt[node] += v
        else:
            mid = (l + r) // 2
            update(2 * node, l, mid, a, b, v)
            update(2 * node + 1, mid, r, a, b, v)
        if cnt[node]:
            cov[node] = xs[r] - xs[l]
        else:
            cov[node] = 0 if r - l == 1 else cov[2 * node] + cov[2 * node + 1]

    area, prev = 0, events[0][0]
    for y, a, b, v in events:
        area += cov[1] * (y - prev)
        prev = y
        update(1, 0, m, a, b, v)
    return area % (10**9 + 7)`,
    complexity: 'O(n log n) for this sweep, with 2n events and O(log n) per update. O(n) space. Most problems here have the same bound.',
    pitfalls: [
      'Adding area after applying the event: the strip below y uses the covered length from before the event.',
      'Treating leaves as points when they represent gaps: lengths come from xs[r] - xs[l].',
      'Reusing this no-push-down tree when removals don\'t match earlier adds: it relies on them being exact.',
      'Forgetting the required modulo in LC 850, or 64-bit totals in other languages.',
      'In LC 699, treating squares that only touch at an edge as overlapping.',
    ],
    pointsToPonder: [
      'Why can this tree avoid lazy push-down when most range-update trees can\'t?',
      'How would you find the area covered by at least two rectangles?',
      'For a new hard problem, what would you try to write down first: the sweep axis, the node value or the tag?',
    ],
    practice: [493, 327, 699, 218, 850],
    snippet: '10-lazy-segment-tree-range-add-range-sum-query',
  },
}
