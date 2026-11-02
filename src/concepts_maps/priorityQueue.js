// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const priorityQueue = {
  '1. Basic Heap Operations / Kth Element': {
    crux: 'For the k-th largest, keep a min-heap of the k largest seen so far: its top is the answer, and anything smaller gets thrown away.',
    signals: [
      '"Return the kth largest element" or "the k closest points to the origin": keep a heap of size k with the worst of the k on top.',
      '"Add a number, then return the kth largest" on every call: the data keeps arriving, so sorting each time is too slow.',
      '"The k most frequent elements": count first, then rank the counts.',
      '"Smash the two heaviest stones" each turn: you need the current maximum again after every change.',
    ],
    notThis: [
      'One k-th query on a fixed array where O(n) average is wanted: Quickselect beats O(n log k), as in the follow-up to LC 215.',
      'Top k frequent where counts are at most n: bucket by count for O(n), as in the follow-up to LC 347.',
      'Third Maximum Number (LC 414) asks for distinct values: three variables or a set is simpler, and duplicates must not count.',
    ],
    concepts: [
      'The heap direction is the opposite of the question: k largest uses a min-heap, because the smallest of the k is the one to evict.',
      'Capping the heap at k gives O(n log k) time and O(k) space, which matters when k is much smaller than n.',
      'Heapifying everything and popping k times costs O(n + k log n), which is fine when all the data is already in memory.',
    ],
    example: {
      problem: 'Kth Largest Element in an Array with nums = [3,2,1,5,6,4], k = 2',
      lc: 215,
      walkthrough: [
        'Push 3, then 2. The heap is [2,3] and has size 2, so nothing is evicted.',
        'Push 1. The size is now 3, so pop the smallest, which is 1. The heap stays [2,3].',
        'Push 5 and pop 2. The heap is [3,5].',
        'Push 6 and pop 3. The heap is [5,6].',
        'Push 4 and pop 4. The heap stays [5,6].',
        'The top is 5, and the sorted array 6,5,4,3,2,1 confirms 5 is the 2nd largest.',
      ],
    },
    code: `def kth_largest(nums, k):
    heap = []                  # min-heap of the k largest so far
    for x in nums:
        heappush(heap, x)
        if len(heap) > k:
            heappop(heap)      # evict the smallest of k + 1
    return heap[0]`,
    complexity: 'O(n log k) time and O(k) space with the capped heap.',
    pitfalls: [
      'Using a max-heap and popping k times when the input is a stream: every value stays in memory, so space grows to O(n).',
      'Forgetting that C++ priority_queue is a max-heap by default, while Python heapq is a min-heap.',
      'Reading the k-th answer before the heap holds k values: LC 703 can start with fewer than k numbers.',
      'Duplicates count in LC 215: in [3,3,2] with k = 2 the answer is 3, not 2.',
    ],
    pointsToPonder: [
      'Why is the top of the size-k min-heap the k-th largest, even though it is the smallest thing in the heap?',
      'At what ratio of k to n would you stop capping the heap and just sort?',
      'Why does Quickselect not help once numbers arrive one at a time?',
    ],
    practice: [703, 1046, 215, 973, 347],
    snippet: '2-kth-largest-fixed-size-min-heap',
  },
  '2. Min-Heap Greedy / Simulation': {
    crux: 'When each step takes the current extreme and its result goes back into the pool, simulate exactly that with a heap.',
    signals: [
      '"Pick the largest number and reduce it to half" until a target is met: the maximum changes after every operation.',
      '"Reserve the smallest-numbered unreserved seat": you need the minimum of a set that gains and loses items.',
      '"Minimum number of operations so that...", where each operation clearly hits the biggest or smallest item.',
      '"Combine the two smallest into one" and repeat until one remains.',
    ],
    notThis: [
      'Nothing goes back into the pool, as in Reduce Array Size to The Half (LC 1338): sort the counts once and take from the top.',
      'Put Marbles in Bags (LC 2551) only needs sorted adjacent-pair sums, so there is no repeated extraction to simulate.',
      'Minimum Number of Work Sessions (LC 1986) has n up to 14 and no greedy rule: use bitmask DP despite its label here.',
      'Minimum Cost to Make Array Equal (LC 2448) is a weighted median problem, not a simulation.',
    ],
    concepts: [
      'A sorted array only works when you never re-insert. As soon as a result returns to the pool, you need a heap.',
      'The usual greedy argument is exchange: acting on the current extreme is never worse than acting on anything else.',
      'Count the operations before coding. If it can be huge, such as 10^9 steps, jump in bulk or use a formula rather than simulating one by one.',
    ],
    example: {
      problem: 'Minimum Operations to Halve Array Sum with nums = [5,19,8,1]',
      lc: 2208,
      walkthrough: [
        'The total is 33, so the target is to reach 16.5 or less.',
        'Pop 19 and halve it to 9.5. The total drops to 23.5. That is 1 operation.',
        'Pop 9.5, still the largest, and halve it to 4.75. The total drops to 18.75. That is 2 operations.',
        'Pop 8 and halve it to 4. The total drops to 14.75. That is 3 operations.',
        '14.75 <= 16.5, so stop. The answer is 3.',
      ],
    },
    code: `def halve_ops(nums):
    heap = [-x for x in nums]  # negate for a max-heap
    heapify(heap)
    total = sum(nums)
    target = total / 2
    ops = 0
    while total > target:
        half = -heappop(heap) / 2
        total -= half
        heappush(heap, -half)
        ops += 1
    return ops`,
    complexity: 'O(n + m log n) time for m operations, plus O(n) space for the heap. In LC 2208, m is at most n, because halving every number once already halves the sum.',
    pitfalls: [
      'Integer division when halving: LC 2208 needs real numbers, or the total never drops correctly.',
      'Forgetting to push the changed value back, which turns the simulation into a one-pass sort.',
      'Stopping on total < target when the problem says "at least half": use total > target as the loop condition.',
      'Overflow on running sums in C++: use long long.',
    ],
    pointsToPonder: [
      'Why is halving the largest always at least as good as halving any other number?',
      'How would you recognize that a simulation needs a formula instead, as in LC 2335?',
      'What changes if the pool only ever shrinks?',
    ],
    practice: [2335, 1046, 1845, 2208, 1167],
    snippet: '8-min-heap-greedy-minimum-cost-to-connect-sticks',
  },
  '3. Two Heaps (Min-Heap + Max-Heap)': {
    crux: 'Split the items around a moving boundary with one heap on each side, so the values next to the boundary are always one peek away.',
    signals: [
      '"Find the median" while numbers keep arriving: you need the middle of a set that keeps changing.',
      '"Each project needs minimum capital; maximize final capital": items move one way from a locked pool into an available pool.',
      '"Return the current maximum and minimum" after updates: one heap per end, usually with lazy deletion.',
      '"For each interval, the smallest start at or after its end": two sweeps can hand items across.',
    ],
    notThis: [
      'Balance a Binary Search Tree (LC 1382): the listing admits it isn\'t a heap problem. Take the inorder traversal and rebuild.',
      'Maximize Sum After K Negations (LC 1005) needs only the smallest value each time: one heap or a sort.',
      'You need the k-th element for an arbitrary k: two heaps only expose the boundary, so use an ordered set.',
    ],
    concepts: [
      'Median invariant: every value in lo is <= every value in hi, and len(lo) is len(hi) or one more.',
      'Pushing through the other heap keeps the value order correct. Add to lo, move lo\'s top to hi, then move one back if hi got bigger.',
      'The other shape is locked and available, as in IPO (LC 502): a min-heap of costs feeds a max-heap of profits as capital grows.',
    ],
    example: {
      problem: 'Find Median from Data Stream, adding 5, 2, 8, 1',
      lc: 295,
      walkthrough: [
        'Add 5: it moves through lo to hi, then back because hi got bigger. lo = [5], hi = []. The median is 5.',
        'Add 2: lo holds 5 and 2, and its top 5 moves to hi. lo = [2], hi = [5]. The sizes are equal, so the median is (2 + 5) / 2 = 3.5.',
        'Add 8: lo\'s top 8 moves to hi, and hi is now bigger, so 5 moves back. lo = [5,2], hi = [8]. The median is 5.',
        'Add 1: lo\'s top 5 moves to hi. lo = [2,1], hi = [5,8]. The median is (2 + 5) / 2 = 3.5.',
        'The sorted values 1,2,5,8 confirm a median of 3.5.',
      ],
    },
    code: `class MedianFinder:
    def __init__(self):
        self.lo, self.hi = [], []  # lo: max-heap via negatives; hi: min-heap

    def add(self, x):
        heappush(self.lo, -x)
        heappush(self.hi, -heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heappush(self.lo, -heappop(self.hi))

    def median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
    complexity: 'O(log n) per insert and O(1) per median, with O(n) space across the two heaps.',
    pitfalls: [
      'Balancing sizes without checking value order: a large value can land in lo, so always pass through the other heap.',
      'Forgetting to negate one direction in Python, or to negate back when reading.',
      'Integer division or overflow on the even case: divide by 2.0, and watch int overflow when adding the two middles in C++.',
      'Calling median on an empty structure: hi or lo is empty before the first insert.',
    ],
    pointsToPonder: [
      'Why does passing through the other heap guarantee the value invariant?',
      'What would have to change to support removing an arbitrary value? See section 7.',
      'In IPO, why can a project never leave the available heap except by being taken?',
    ],
    practice: [436, 2034, 295, 502, 480],
    snippet: '4-two-heaps-median-of-a-data-stream',
  },
  '4. K-Way Merge': {
    crux: 'Hold exactly one candidate per sorted source: the top is the next value overall, and popping it advances only that source.',
    signals: [
      '"Merge k sorted linked lists" or "merge k sorted arrays".',
      '"Smallest range that includes at least one number from each of the k lists": one pointer per list, moving the smallest forward.',
      '"Find the kth smallest" where rows or pairs are already sorted, and k is small.',
      '"The nth number whose only prime factors are...": each factor produces its own sorted stream.',
    ],
    notThis: [
      'Kth Smallest Product (LC 2040): k can be around 10^10, so a heap can\'t reach it. Binary search on the value.',
      'Ugly Number II (LC 264) can use three pointers in O(n), which is simpler than a heap with duplicate handling.',
      'The inputs aren\'t sorted: sort them or use a plain heap, because the one-head invariant relies on sorted order.',
    ],
    concepts: [
      'The heap never holds more than k entries, so each of the N total pops costs O(log k).',
      'Store which source each value came from and its position, so you know what to push next.',
      'Implicit streams count too. In a sorted matrix each row is a stream, and in LC 373 each a[i] paired with b[0..] is a stream.',
    ],
    example: {
      problem: 'Merge k Sorted Lists with lists = [[1,4],[1,3],[2]]',
      lc: 23,
      walkthrough: [
        'Seed the heap with each head as (value, list, position): (1,0,0), (1,1,0), (2,2,0).',
        'Pop (1,0,0) and output 1. List 0 advances, so push (4,0,1).',
        'Pop (1,1,0) and output 1. List 1 advances, so push (3,1,1).',
        'Pop (2,2,0) and output 2. List 2 is exhausted, so push nothing.',
        'Pop (3,1,1) and output 3, then pop (4,0,1) and output 4. Both lists are exhausted.',
        'The output is [1,1,2,3,4], and the heap never held more than 3 entries.',
      ],
    },
    code: `def merge_k(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapify(heap)
    out = []
    while heap:
        val, i, j = heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heappush(heap, (lists[i][j + 1], i, j + 1))
    return out`,
    complexity: 'O(N log k) time for N total values, and O(k) extra space for the heap beyond the output.',
    pitfalls: [
      'Pushing an empty list\'s head: filter empties when seeding.',
      'Putting raw list nodes in a Python heap: equal values then compare nodes and raise an error, so include the list index as a tiebreak.',
      'Concatenating everything and sorting: it works, but costs O(N log N) and misses what the interviewer is asking for.',
      'In LC 264, not removing duplicates: 6 comes from both 2 x 3 and 3 x 2.',
    ],
    pointsToPonder: [
      'Why is it safe to keep only one element per source in the heap?',
      'In Smallest Range (LC 632), why must you stop as soon as any list runs out?',
      'How does merging lists pairwise compare with the heap? See section 22.',
    ],
    practice: [264, 373, 378, 23, 632],
    snippet: '5-k-way-merge-merge-k-sorted-lists',
  },
  '5. Dijkstra / Shortest Path (Heap as Engine)': {
    crux: 'With non-negative weights, the first time a node is popped its distance is final, and the heap makes "closest unfinished node" cheap to find.',
    signals: [
      '"How long until all nodes receive the signal", given weighted directed edges.',
      '"Path with the maximum probability": multiply along the path and use a max-heap.',
      '"A route\'s effort is the maximum absolute difference along it": the path cost is a maximum, not a sum.',
      '"Number of ways to arrive in the shortest amount of time": count paths during relaxation.',
    ],
    notThis: [
      'All edges cost the same: plain BFS is O(V + E).',
      'Edges cost only 0 or 1, as in LC 1368 and LC 2290: 0-1 BFS with a deque drops the log factor.',
      'Negative edges: Dijkstra\'s finality argument breaks, so use Bellman-Ford.',
      'Cheapest Flights Within K Stops (LC 787): the best price may use too many stops, so either run k + 1 Bellman-Ford rounds or add stops to the state.',
    ],
    concepts: [
      'The heap can hold several entries per node. Skip a popped entry when d > dist[u], which is cheaper than a decrease-key.',
      'The relaxation rule is what varies: sum for time, product for probability, and max(d, w) for minimax effort.',
      'Extra constraints go in the state, such as (node, stops left) or (node, discounts used), so one city becomes several graph nodes.',
    ],
    example: {
      problem: 'Network Delay Time with times = [[1,2,4],[1,3,1],[3,2,1]], n = 3, k = 1',
      lc: 743,
      walkthrough: [
        'Start with dist = {1: 0} and heap [(0,1)].',
        'Pop (0,1). Relax to node 2 at 4 and node 3 at 1. The heap holds (1,3) and (4,2).',
        'Pop (1,3). Going through node 3 reaches node 2 at 1 + 1 = 2, which beats 4, so dist[2] = 2. Push (2,2).',
        'Pop (2,2). Node 2 has no outgoing edges.',
        'Pop (4,2). 4 > dist[2] = 2, so this entry is stale and gets skipped.',
        'All 3 nodes are reached, and the largest distance is 2, so the answer is 2.',
      ],
    },
    code: `def network_delay(times, n, k):
    g = defaultdict(list)
    for u, v, w in times:
        g[u].append((v, w))
    dist = {k: 0}
    heap = [(0, k)]
    while heap:
        d, u = heappop(heap)
        if d > dist[u]:
            continue           # stale entry
        for v, w in g[u]:
            if d + w < dist.get(v, inf):
                dist[v] = d + w
                heappush(heap, (dist[v], v))
    return max(dist.values()) if len(dist) == n else -1`,
    complexity: 'O(E log V) time and O(V + E) space with lazy stale entries.',
    pitfalls: [
      'Leaving out the stale check: the code stays correct but re-scans edges and can time out.',
      'Marking a node visited when pushing rather than popping, which can lock in a distance that isn\'t final yet.',
      'Forgetting the disconnected case: LC 743 returns -1 when a node is never reached.',
      'Overflow on long paths, or using LLONG_MAX + w in C++: use long long and check for unreached nodes first.',
    ],
    pointsToPonder: [
      'Which exact step of the finality argument fails when an edge is negative?',
      'Why does minimax effort still work with a heap, even though the cost isn\'t a sum?',
      'When is a plain O(V^2) array scan faster than the heap version?',
    ],
    practice: [743, 1514, 1631, 787, 778],
    snippet: '7-dijkstra-shortest-path-with-a-min-heap',
  },
  '6. Sliding Window + Heap': {
    crux: 'Store each value with its index, and before trusting the top, pop anything that has left the window.',
    signals: [
      '"You can jump at most k steps forward; maximize the score": each DP state reads the best of the last k states.',
      '"A subsequence where consecutive elements are at most k indices apart".',
      '"Maximum of each window of size k", especially with a follow-up asking for more than the maximum.',
      '"Maximize yi + yj + |xi - xj| with |xi - xj| <= k": rewrite the expression so one heap holds yi - xi.',
    ],
    notThis: [
      'Only the window maximum or minimum matters: a monotonic deque is O(n), as in LC 239, LC 1696 and LC 1438.',
      'You need the window median: use two heaps with removal, in section 12.',
      'Maximum Number of Visible People in a Queue (LC 1944) has no window at all: use a monotonic stack.',
      'Stock Price Fluctuation (LC 2034) is about corrected values rather than a window: see section 7.',
    ],
    concepts: [
      'Expiry is lazy: stale entries may sit deep in the heap, and they only matter when they reach the top.',
      'The heap is often an optimization of a DP: dp[i] = nums[i] + best of dp[i-k..i-1].',
      'Prefer the deque if the interviewer wants O(n), and mention the heap because it generalizes to richer queries.',
    ],
    example: {
      problem: 'Jump Game VI with nums = [1,-1,-2,4,-7,3], k = 2',
      lc: 1696,
      walkthrough: [
        'Index 0: the score is 1. The heap holds score 1 at index 0.',
        'Index 1: the best reachable score is 1, so the score is 1 + (-1) = 0.',
        'Index 2: the best is still 1 at index 0, so the score is 1 + (-2) = -1.',
        'Index 3: index 0 is now further than 2 back, so pop it. The best is 0 at index 1, so the score is 0 + 4 = 4.',
        'Index 4: the best is 4 at index 3, so the score is 4 + (-7) = -3.',
        'Index 5: the best is 4 at index 3, so the score is 4 + 3 = 7. The answer is 7.',
      ],
    },
    code: `def max_result(nums, k):
    heap = [(-nums[0], 0)]     # (-best score ending here, index)
    score = nums[0]
    for i in range(1, len(nums)):
        while heap[0][1] < i - k:
            heappop(heap)      # expired
        score = -heap[0][0] + nums[i]
        heappush(heap, (-score, i))
    return score`,
    complexity: 'O(n log n) time and O(n) space, since each index is pushed and popped at most once. The heap can hold up to n stale entries.',
    pitfalls: [
      'An off-by-one in the expiry test: with jumps of at most k, index i - k is still valid, so pop only when index < i - k.',
      'Using if rather than while when popping expired entries.',
      'Assuming the heap\'s size equals the window\'s size: it doesn\'t, because stale entries remain.',
      'Returning the maximum over all scores when the problem requires landing on the last index.',
    ],
    pointsToPonder: [
      'Why can a stale entry below the top be safely ignored?',
      'What does the monotonic deque throw away that the heap keeps, and why is that safe?',
      'How would you find the second largest in each window, where a deque no longer helps directly?',
    ],
    practice: [1696, 1438, 239, 1425, 1499],
    snippet: '9-sliding-window-maximum-heap-with-lazy-deletion',
  },
  '7. Lazy Deletion / Delayed Removal Heap': {
    crux: 'A heap can\'t remove from the middle, so record what is invalid and discard those entries only when they reach the top.',
    signals: [
      '"Correct the price at an earlier timestamp", followed by maximum or minimum queries.',
      '"Fill or replace the number at an index, then return the smallest index holding a number".',
      '"Median of each window": values must leave a heap from arbitrary positions.',
      'Skyline-style wording, where a building stops contributing at its right edge and could be anywhere in the heap.',
    ],
    notThis: [
      'You need the k-th element or sorted iteration: an ordered set does that directly.',
      'Stale entries would vastly outnumber live ones, with a tight memory limit: an ordered set frees them at once.',
      'Entries only ever expire by time or index: an expiry check is enough, with no extra map or trash heap, as in section 6.',
    ],
    concepts: [
      'There are three ways to detect a dead entry: compare it with a map of current values, compare its time with now, or keep a second trash heap.',
      'Every pushed entry is popped at most once, so the cleanup is amortized O(log u) over u updates.',
      'Clean only at the moment you read the top. Entries deeper down can stay dead with no effect on the answer.',
    ],
    example: {
      problem: 'Stock Price Fluctuation: update(1,10), update(2,5), maximum(), update(1,3), maximum(), update(4,2), minimum()',
      lc: 2034,
      walkthrough: [
        'After update(1,10) and update(2,5), price = {1: 10, 2: 5}. maximum() reads (10, t=1), which matches the map, so it returns 10.',
        'update(1,3) sets price[1] = 3 and pushes the new entry. The old (10, t=1) stays in both heaps.',
        'maximum() reads (10, t=1), but price[1] is 3, so that entry is dead and gets popped.',
        'The next top is (5, t=2), which matches price[2], so it returns 5.',
        'update(4,2) pushes (2, t=4). minimum() reads (2, t=4), which matches the map, so it returns 2.',
      ],
    },
    code: `class StockPrice:
    def __init__(self):
        self.price = {}
        self.latest = 0
        self.max_h, self.min_h = [], []

    def update(self, t, p):
        self.price[t] = p
        self.latest = max(self.latest, t)
        heappush(self.max_h, (-p, t))
        heappush(self.min_h, (p, t))

    def current(self):
        return self.price[self.latest]

    def maximum(self):
        while self.price[self.max_h[0][1]] != -self.max_h[0][0]:
            heappop(self.max_h)
        return -self.max_h[0][0]

    def minimum(self):
        while self.price[self.min_h[0][1]] != self.min_h[0][0]:
            heappop(self.min_h)
        return self.min_h[0][0]`,
    complexity: 'O(log u) per update and amortized O(log u) per query, with O(u) space for u updates.',
    pitfalls: [
      'Using if rather than while: several dead entries can sit on top at once.',
      'Trusting len(heap) as the live count: dead entries inflate it, so track live sizes separately when balancing two heaps.',
      'With a trash heap, removing a value that was never inserted: the trash can then never drain.',
      'Peeking without checking for an empty heap once cleanup has removed everything.',
    ],
    pointsToPonder: [
      'Why is cleanup amortized cheap even though one query might pop many entries?',
      'A price can return to an old value. Why does the dead-entry check still give the right answer?',
      'When does an ordered set beat lazy deletion in practice?',
    ],
    practice: [2349, 2034, 855, 480, 218],
    snippet: '10-lazy-deletion-heap-remove-arbitrary-elements',
  },
  '8. Scheduling / Interval Problems with Heap': {
    crux: 'Sort by start time so that time only moves forward, and keep what is currently running or available in a heap.',
    signals: [
      '"Minimum number of conference rooms" or "platforms needed": peak overlap, using a heap of end times.',
      '"The CPU picks the available task with the shortest processing time": a pool that fills up as time passes.',
      '"Attend at most one event per day, on any day in its range": on each day, pick the event that ends soonest.',
      '"For each query, the size of the smallest interval containing it": sort queries and sweep offline.',
    ],
    notThis: [
      'Jobs carry profits, as in LC 1235 and LC 1751: taking the earliest end can lose the best job, so use DP with binary search.',
      'Only the peak overlap on a small timeline is needed, as in Car Pooling (LC 1094): a difference array is simpler.',
      'Task Scheduler (LC 621) only asks for a length: the formula from section 13 needs no heap at all.',
    ],
    concepts: [
      'A heap of end times answers "does a room free up by now?" Its final size is the number of rooms used.',
      'Available-pool shape: push each task once its time arrives, then pop the best by the problem\'s rule.',
      'If the pool is empty, jump time forward to the next arrival rather than stepping by one.',
    ],
    example: {
      problem: 'Meeting Rooms II with intervals = [[0,30],[5,10],[15,20]]',
      lc: 253,
      walkthrough: [
        'They are already sorted by start. The heap of end times begins empty.',
        '[0,30]: there is no room to reuse, so push 30. The heap is [30].',
        '[5,10]: the earliest end is 30, and 30 > 5, so no room is free. Push 10. The heap is [10,30].',
        '[15,20]: the earliest end is 10, and 10 <= 15, so reuse that room. Pop 10 and push 20. The heap is [20,30].',
        'The heap holds 2 entries, so the answer is 2 rooms.',
      ],
    },
    code: `def min_meeting_rooms(intervals):
    intervals.sort()
    ends = []                  # min-heap of end times, one per room
    for start, end in intervals:
        if ends and ends[0] <= start:
            heappop(ends)      # reuse the room that frees first
        heappush(ends, end)
    return len(ends)`,
    complexity: 'O(n log n) time for the sort and heap, and O(n) space when every meeting overlaps.',
    pitfalls: [
      'Using < where a room can be reused at the moment another meeting ends: [1,5] and [5,8] need just 1 room, so test ends[0] <= start.',
      'In LC 1834, advancing time by 1 through a large gap instead of jumping to the next enqueue time.',
      'Keeping the original index when sorting: LC 1834 and LC 1851 report answers by original position.',
      'In LC 1353, not discarding events whose end has already passed before picking one for today.',
    ],
    pointsToPonder: [
      'Why is the final heap size the peak overlap, even though the heap never explicitly tracks a maximum?',
      'Why does choosing the event that ends soonest maximize attendance in LC 1353?',
      'When would you pick a +1/-1 sweep over a heap of end times?',
    ],
    practice: [253, 1094, 1834, 1353, 1851],
    snippet: '11-scheduling-meeting-rooms-ii-min-rooms',
  },
  '9. Greedy + Max-Heap (Regret-Based / Exchange)': {
    crux: 'Take every option optimistically, and when the budget breaks, undo the costliest choice so far, which the heap keeps at hand.',
    signals: [
      '"Take the maximum number of courses, each finishing before its deadline": over budget means dropping the longest course.',
      '"You may use a ladder or bricks; how far can you go?": assign ladders to the biggest climbs in hindsight.',
      '"Fewest refueling stops to reach the target": drive as far as possible, and only then claim the biggest fuel you passed.',
      'Any budget where a choice looks fine now and only proves bad later, with an option to swap it out.',
    ],
    notThis: [
      'Maximum Total Reward (LC 3181) needs DP over reachable sums, typically with a bitset, despite its listing here.',
      'Minimum Operations to Make a Subsequence (LC 1713) reduces to LIS: map target values to positions and use binary search.',
      'Maximum Number of Tasks You Can Assign (LC 2071) is binary search on the answer plus a deque or multiset.',
      'Nothing ever needs undoing, as in IPO (LC 502): plain best-available greedy is enough.',
    ],
    concepts: [
      'Fix the processing order first, usually by deadline or position, so that time only moves forward.',
      'The heap stores the choices already made, ordered by how much removing each one would refund.',
      'Exchange argument: swapping the costliest chosen item for a cheaper one keeps the count and leaves more budget for later.',
    ],
    example: {
      problem: 'Course Schedule III with courses = [[5,5],[2,5],[2,6]], each [duration, lastDay]',
      lc: 630,
      walkthrough: [
        'Sorting by deadline keeps the order [5,5], [2,5], [2,6].',
        'Take [5,5]: t = 5, and 5 <= 5, so it fits. The heap of taken durations is [5].',
        'Take [2,5]: t = 7, and 7 > 5, so the budget is broken. Regret the longest: drop 5, so t = 2. The heap is [2].',
        'Take [2,6]: t = 4, and 4 <= 6, so it fits. The heap is [2,2].',
        'The heap holds 2 courses, so the answer is 2. Being greedy without regret would have kept the 5-day course and stopped at 1.',
      ],
    },
    code: `def schedule_course(courses):
    courses.sort(key=lambda c: c[1])  # by deadline
    taken, t = [], 0           # max-heap of durations, via negatives
    for duration, last_day in courses:
        heappush(taken, -duration)
        t += duration
        if t > last_day:
            t += heappop(taken)  # negative value: drop the longest
    return len(taken)`,
    complexity: 'O(n log n) time for the sort and heap, and O(n) space for the chosen items.',
    pitfalls: [
      'Sorting by duration rather than deadline: short courses with far deadlines would crowd out urgent ones.',
      'Skipping a course that doesn\'t fit instead of adding it and then evicting the longest, which may be the new course or an older one.',
      'In LC 871, forgetting the fuel you passed before the target after the last station.',
      'In LC 1642, using a max-heap of climbs when a min-heap capped at the ladder count is the natural fit.',
    ],
    pointsToPonder: [
      'Why does dropping the longest course never reduce the best possible count?',
      'What makes this different from DP over courses and time, and when would the heap argument fail?',
      'Why does one eviction per step suffice in LC 630, with no need for a loop?',
    ],
    practice: [1642, 502, 871, 630],
    snippet: '13-regret-based-greedy-ipo-max-capital',
  },
  '10. Heap + Sorting (Sort-Then-Sweep)': {
    crux: 'You can\'t optimize two dimensions at once, so sort on one to fix it as you sweep, and let a size-k heap optimize the other.',
    signals: [
      '"Sum of k chosen values multiplied by the minimum of their other values".',
      '"Performance is the sum of speeds times the minimum efficiency".',
      '"Each worker must be paid in proportion to quality and at least their minimum wage": the wage-to-quality ratio is the sort key.',
      'A pair of attributes per item, where one acts as a bottleneck for the whole group.',
    ],
    notThis: [
      'Most Profit Assigning Work (LC 826): after sorting, a running maximum and a pointer are enough.',
      'Checking Existence of Edge Length Limited Paths (LC 1697) has the same offline sweep, but with union-find rather than a heap.',
      'Items have a single attribute: plain sorting or a Top-K heap from section 1 is enough.',
    ],
    concepts: [
      'Sorted descending on the bottleneck, the current item\'s value is the minimum for everything seen so far.',
      'The heap keeps the k best of the other dimension and evicts the worst, keeping a running sum.',
      'Evaluate the score at every step, because you don\'t know which bottleneck is optimal in advance.',
    ],
    example: {
      problem: 'Maximum Subsequence Score with nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3',
      lc: 2542,
      walkthrough: [
        'Pair as (multiplier, value), sorted by multiplier descending: (4,2), (3,3), (2,1), (1,3).',
        '(4,2): the heap is [2] and the sum is 2. There are fewer than 3 items, so no score yet.',
        '(3,3): the heap is [2,3] and the sum is 5. Still fewer than 3 items.',
        '(2,1): the heap is [1,2,3] and the sum is 6. Now there are 3 items, so the score is 6 x 2 = 12, and best = 12.',
        '(1,3): adding 3 gives sum 9, then evict the smallest, 1, for sum 8. The score is 8 x 1 = 8, so best stays 12.',
        'The answer is 12.',
      ],
    },
    code: `def max_score(nums1, nums2, k):
    pairs = sorted(zip(nums2, nums1), reverse=True)  # largest multiplier first
    heap, total, best = [], 0, 0
    for multiplier, x in pairs:
        heappush(heap, x)
        total += x
        if len(heap) > k:
            total -= heappop(heap)  # evict the smallest value
        if len(heap) == k:
            best = max(best, total * multiplier)
    return best`,
    complexity: 'O(n log n) time for the sort, plus O(n log k) for the sweep. O(n + k) space for the sorted pairs and the heap.',
    pitfalls: [
      'Scoring before the heap holds k items: for LC 2542 that is an invalid selection.',
      'Worrying when the current item is the one evicted: the score then uses a too-small multiplier, which only underestimates a valid choice, so the answer stays correct.',
      'In LC 1383, applying the modulo before comparing: track the true maximum, then take the modulo at the end.',
      'Comparing ratios as floats in LC 857: precision can matter, so compare cross-multiplied values where possible.',
    ],
    pointsToPonder: [
      'Why does sorting by the bottleneck let you ignore it for the rest of the sweep?',
      'Which attribute should be sorted and which heaped, and how do you tell from the formula?',
      'In LC 1383 the team is "at most k". What changes compared with exactly k?',
    ],
    practice: [253, 1834, 2542, 1383, 857],
    snippet: '13-regret-based-greedy-ipo-max-capital',
  },
  '11. MST / Prim\'s Algorithm (Heap-Driven)': {
    crux: 'Grow one connected tree, and always add the cheapest edge that reaches a node outside it.',
    signals: [
      '"Connect all points at minimum cost": every node must be joined, with no start or destination.',
      '"Return the minimum cost to connect all cities, or -1 if impossible".',
      '"Each house can build a well or lay a pipe": add a virtual node whose edges are the well costs.',
      '"Critical edges": questions about which edges appear in every minimum tree.',
    ],
    notThis: [
      'The cost between two specific nodes: that is a shortest path, so use Dijkstra.',
      'You must exclude or force particular edges, as in LC 1489: Kruskal with union-find is much easier to re-run.',
      'A sparse edge list with sorted edges available: Kruskal is usually shorter to write.',
    ],
    concepts: [
      'Prim is Dijkstra with one change: the key is the edge weight w, not the path total d + w.',
      'Cut property: the cheapest edge crossing any split of the nodes is safe to include in some minimum tree.',
      'On a complete graph, an O(n^2) array version beats the heap, whose cost grows to O(n^2 log n).',
    ],
    example: {
      problem: 'Min Cost to Connect All Points with points = [[0,0],[2,2],[3,10],[5,2],[7,0]]',
      lc: 1584,
      walkthrough: [
        'Pop (0, node 0), so cost = 0. Push edges to node 1 at 4, node 2 at 13, node 3 at 7, and node 4 at 7.',
        'Pop (4, node 1), so cost = 4. Push node 2 at 9, node 3 at 3, and node 4 at 7.',
        'Pop (3, node 3), so cost = 7. Push node 2 at 10 and node 4 at 4.',
        'Pop (4, node 4), so cost = 11. Push node 2 at 14.',
        'Pop the 7s for nodes 3 and 4. Both are already in the tree, so skip them.',
        'Pop (9, node 2), so cost = 20. All 5 nodes are in the tree, and the answer is 20.',
      ],
    },
    code: `def min_cost_connect(points):
    n = len(points)
    seen = [False] * n
    heap = [(0, 0)]            # (edge cost into the tree, node)
    cost = used = 0
    while used < n:
        d, u = heappop(heap)
        if seen[u]:
            continue           # already joined by a cheaper edge
        seen[u] = True
        cost += d
        used += 1
        for v in range(n):
            if not seen[v]:
                w = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                heappush(heap, (w, v))
    return cost`,
    complexity: 'O(E log E) time and O(E) space. On LC 1584\'s complete graph that is O(n^2 log n) time and O(n^2) space.',
    pitfalls: [
      'Using d + w as the key out of Dijkstra habit, which finds shortest paths rather than a minimum tree.',
      'Not skipping popped nodes that are already in the tree, which counts them twice.',
      'Forgetting the disconnected case: if the heap empties early, LC 1135 returns -1. The loop above assumes a connected graph.',
      'Building an explicit edge list for a complete graph: for n = 1000 it takes about 500,000 edges of memory.',
    ],
    pointsToPonder: [
      'Why does the cut property make a local choice globally safe?',
      'How does a virtual node turn wells into ordinary edges in LC 1168?',
      'When would you choose Kruskal over Prim, and vice versa?',
    ],
    practice: [1584, 1135, 1168, 1489],
    snippet: '7-dijkstra-shortest-path-with-a-min-heap',
  },
  '12. Median Maintenance / Running Statistics': {
    crux: 'Keep the middle between two heaps. When values can also leave, count departures and remove them only when they surface.',
    signals: [
      '"Return the median after each number is added".',
      '"Return the median of each sliding window of size k": it needs insertion and removal.',
      '"Mean, median, and mode of a large sample given as counts": no heap is needed when values have a small range.',
      '"Online" or "running" statistics, where each answer must come before the next input.',
    ],
    notThis: [
      'Statistics from a Large Sample (LC 1093): values are limited to 0-255, so walk the cumulative counts.',
      'Stock Price Fluctuation (LC 2034) wants the maximum and minimum rather than the median: one lazy heap per end, in section 7.',
      'The window maximum alone: a monotonic deque is simpler, in section 6.',
    ],
    concepts: [
      'The rule is the same as in section 3: lo holds the lower half, with len(lo) equal to len(hi) or one more.',
      'A removal is recorded in a counter and balanced straight away, as though the value had already gone.',
      'Track balance rather than heap sizes, because real sizes include entries that are already dead.',
    ],
    example: {
      problem: 'Sliding Window Median with nums = [1,3,-1,-3,5], k = 3',
      lc: 480,
      walkthrough: [
        'The first window [1,3,-1] gives lo = [1,-1] and hi = [3]. The median is lo\'s top, 1.',
        'Slide to i = 3: 1 leaves and -3 enters. Mark 1 dead. It was in lo (balance -1), and -3 goes into lo (balance back to 0).',
        'lo\'s top is the dead 1, so prune it. lo = [-1,-3], hi = [3]. The median is -1.',
        'Slide to i = 4: 3 leaves and 5 enters. Mark 3 dead. It was in hi (balance +1), and 5 goes into hi (balance back to 0).',
        'hi\'s top is the dead 3, so prune it. lo = [-1,-3], hi = [5]. The median is -1.',
        'The result is [1,-1,-1].',
      ],
    },
    code: `def median_window(nums, k):
    lo, hi, dead = [], [], Counter()  # lo: max-heap via negatives

    def prune(heap, sign):
        while heap and dead[sign * heap[0]]:
            dead[sign * heap[0]] -= 1
            heappop(heap)

    def median():
        return -lo[0] if k % 2 else (-lo[0] + hi[0]) / 2

    for x in nums[:k]:
        heappush(lo, -x)
        heappush(hi, -heappop(lo))
        if len(hi) > len(lo):
            heappush(lo, -heappop(hi))
    res = [median()]

    for i in range(k, len(nums)):
        x, out = nums[i], nums[i - k]
        dead[out] += 1
        balance = -1 if out <= -lo[0] else 1  # out leaves lo or hi
        if x <= -lo[0]:
            heappush(lo, -x)
            balance += 1
        else:
            heappush(hi, x)
            balance -= 1
        if balance > 0:
            heappush(hi, -heappop(lo))
        elif balance < 0:
            heappush(lo, -heappop(hi))
        prune(lo, -1)
        prune(hi, 1)
        res.append(median())
    return res`,
    complexity: 'O(n log n) time, since each value is pushed and popped a constant number of times. O(n) space, because dead entries wait in the heaps.',
    pitfalls: [
      'Using len(lo) and len(hi) to balance: dead entries make those sizes wrong.',
      'Pruning only one heap: after a move, either top can be dead.',
      'Overflow when adding the two middles in C++: values near 2^31 need a long long or double.',
      'Choosing the wrong side for the outgoing value when it equals lo\'s top: it counts as leaving lo, matching the out <= -lo[0] test.',
    ],
    pointsToPonder: [
      'Why can balance only be -2, 0 or 2 after each slide?',
      'What would a multiset version look like, and what does it make simpler?',
      'Why is it safe to prune by value, rather than by which index the entry came from?',
    ],
    practice: [1093, 2034, 295, 480],
    snippet: '4-two-heaps-median-of-a-data-stream',
  },
}
