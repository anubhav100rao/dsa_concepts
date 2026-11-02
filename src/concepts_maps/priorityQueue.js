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
  '13. Reorganize / Rearrange with Heap': {
    crux: 'Always place the item with the most copies left, and hold back the one you just used so it can\'t repeat too soon.',
    signals: [
      '"Rearrange so that no two adjacent characters are the same".',
      '"The same task must be at least n units apart".',
      '"A string with no \'aaa\', \'bbb\' or \'ccc\'", or "at most repeatLimit in a row".',
      '"Return any valid arrangement, or an empty string if impossible".',
    ],
    notThis: [
      'Task Scheduler (LC 621) only asks for a length: (maxCount - 1) x (n + 1) + ties, floored at the task count, needs no simulation.',
      'Maximum Number of Weeks (LC 1953) is decided by comparing the largest count with the sum of the rest.',
      'Least Number of Unique Integers (LC 1481) has no ordering rule: sort the counts and remove from the smallest.',
      'Minimize Deviation in Array (LC 1675) isn\'t about arranging anything: see section 23.',
    ],
    concepts: [
      'The most frequent item is the one that can run out of room, so it gets placed first.',
      'Feasibility check: arrangement is impossible when the top count exceeds (n + 1) / 2, for a gap of one.',
      'For a larger gap k, keep a queue of k held items and release the oldest once its cooldown ends.',
    ],
    example: {
      problem: 'Reorganize String with s = "aaabb"',
      lc: 767,
      walkthrough: [
        'The counts are a:3 and b:2, and nothing is held.',
        'Pop a (3). Output "a" and hold a with 2 left.',
        'Pop b (2). Output "ab", release a back to the heap, and hold b with 1 left.',
        'Pop a (2). Output "aba", release b, and hold a with 1 left.',
        'Pop b (1). Output "abab", release a, and hold nothing because b has run out.',
        'Pop a (1). Output "ababa". The length matches s, so "ababa" is the answer. "aaab" would stop at "aba" with an a still held, and return "".',
      ],
    },
    code: `def reorganize(s):
    heap = [(-c, ch) for ch, c in Counter(s).items()]
    heapify(heap)
    out, hold = [], None       # hold: just used, on cooldown
    while heap:
        cnt, ch = heappop(heap)
        out.append(ch)
        if hold:
            heappush(heap, hold)
        hold = (cnt + 1, ch) if cnt + 1 < 0 else None
    return ''.join(out) if len(out) == len(s) else ''`,
    complexity: 'O(n log a) time and O(a) space for an alphabet of a distinct items, which is effectively O(n) for lowercase letters.',
    pitfalls: [
      'Pushing the used item back immediately: it comes straight back out and repeats.',
      'Releasing the held item before popping the next one, which has the same effect.',
      'Not checking the final length: when the heap runs out with an item still held, the arrangement failed.',
      'In LC 1405, popping the top when it has just been used twice: use the second largest, and return if there isn\'t one.',
    ],
    pointsToPonder: [
      'Why does placing the most frequent item first avoid dead ends?',
      'Why does (n + 1) / 2 exactly capture feasibility for a gap of one?',
      'Which part of this changes when the gap grows to k, as in LC 358?',
    ],
    practice: [767, 1054, 1405, 621, 358],
    snippet: '12-greedy-max-heap-task-scheduler-reorganize-string',
  },
  '14. Multi-Source BFS with Priority Queue': {
    crux: 'Start the heap from every boundary or source at once and always expand the lowest frontier cell, so the level you reach a cell at is its bottleneck.',
    signals: [
      '"How much water can it trap" on a 2D height map: the outside is the source, and the lowest rim decides the level.',
      '"The water rises to t; the least time to swim to the corner": a path\'s cost is its highest cell.',
      '"A route\'s effort is the maximum difference along it": the same minimax shape, on edges.',
      'Grid wording where cost is a maximum along the route rather than a sum.',
    ],
    notThis: [
      'Map of Highest Peak (LC 1765): every step costs 1, so plain multi-source BFS with a queue is enough.',
      'Minimum Cost to Make at Least One Valid Path (LC 1368): edges cost only 0 or 1, so use 0-1 BFS.',
      'Cut Off Trees for Golf Event (LC 675): the visiting order is fixed, so run a BFS between consecutive trees.',
      'Trapping Rain Water in 1D (LC 42): two pointers are enough, because each side has a single boundary.',
    ],
    concepts: [
      'Seeding all sources means one sweep answers for every source, rather than one run per source.',
      'When a cell is popped, its level is the lowest possible maximum of any route from outside, as in Dijkstra with max instead of sum.',
      'Trapped water: a neighbour lower than the current level holds level - height, and its own level becomes max(level, height).',
    ],
    example: {
      problem: 'Trapping Rain Water II with heightMap = [[3,3,3],[3,1,2],[3,3,3]]',
      lc: 407,
      walkthrough: [
        'Seed the heap with the 8 border cells. The lowest is the 2 at row 1, column 2.',
        'Pop level 2 at (1,2). Its only unseen neighbour is (1,1), with height 1.',
        'Water at (1,1) is 2 - 1 = 1, so water = 1. Push (1,1) with level max(2,1) = 2.',
        'Pop level 2 at (1,1). All its neighbours are seen.',
        'The remaining border cells at level 3 have no unseen neighbours, so the answer is 1. The rim\'s lowest cell sets the level, not its tallest.',
      ],
    },
    code: `def trap_rain(h):
    m, n = len(h), len(h[0])
    heap, seen = [], set()
    for r in range(m):
        for c in range(n):
            if r in (0, m - 1) or c in (0, n - 1):
                heappush(heap, (h[r][c], r, c))
                seen.add((r, c))
    water = 0
    while heap:
        level, r, c = heappop(heap)
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen:
                seen.add((nr, nc))
                water += max(0, level - h[nr][nc])
                heappush(heap, (max(level, h[nr][nc]), nr, nc))
    return water`,
    complexity: 'O(mn log(mn)) time and O(mn) space, since each cell is pushed once.',
    pitfalls: [
      'Pushing a neighbour\'s own height rather than max(level, height): cells behind a submerged one then get too low a level.',
      'Marking cells seen when popped rather than pushed: each cell would get counted more than once.',
      'Seeding only the corners, or one side, rather than the full border.',
      'Applying the 1D left-max and right-max formula to a 2D map: water can escape around a tall row.',
    ],
    pointsToPonder: [
      'Why does expanding the lowest frontier cell guarantee that a cell\'s water level is final?',
      'How is this algorithm related to Dijkstra with a minimax cost?',
      'What goes wrong if you process cells from the highest down?',
    ],
    practice: [1765, 1631, 778, 1368, 407],
    snippet: '7-dijkstra-shortest-path-with-a-min-heap',
  },
  '15. Huffman Coding / Optimal Merge Patterns': {
    crux: 'Every merge is paid again by each later merge that includes it, so merge the two smallest first to keep the big items shallow.',
    signals: [
      '"The cost to connect two sticks is their sum; return the minimum total".',
      '"Merging two files costs the sum of their sizes".',
      '"Build a prefix-free code with the shortest total length", given frequencies.',
      'Items may merge in any order, and the merged result is available for further merging.',
    ],
    notThis: [
      'Only adjacent items can merge, as in Minimum Cost to Merge Stones (LC 1000): the order is constrained, so use interval DP.',
      'Reduce Array Size to The Half (LC 1338) has no merging: sort the counts and take from the largest.',
      'The cost is the larger item rather than the sum, or the result can\'t be reused: the double-counting argument no longer applies.',
    ],
    concepts: [
      'View it as a tree: each item\'s total cost is size x depth, so the smallest items should sit deepest.',
      'The exchange argument: swapping a deeper large item with a shallower small one never raises the total.',
      'Once sorted, two queues give O(n) overall: merged results come out in non-decreasing order, so they need no heap.',
    ],
    example: {
      problem: 'Minimum Cost to Connect Sticks with sticks = [1,8,3,5]',
      lc: 1167,
      walkthrough: [
        'The heap holds 1, 3, 5, 8.',
        'Merge 1 and 3 into 4. Cost is 4. The heap holds 4, 5, 8.',
        'Merge 4 and 5 into 9. Cost is 4 + 9 = 13. The heap holds 8, 9.',
        'Merge 8 and 9 into 17. Cost is 13 + 17 = 30. Only one stick remains.',
        'The answer is 30. Merging the two largest first would give 13 + 16 + 17 = 46.',
      ],
    },
    code: `def connect_sticks(sticks):
    heapify(sticks)
    cost = 0
    while len(sticks) > 1:
        merged = heappop(sticks) + heappop(sticks)
        cost += merged
        heappush(sticks, merged)
    return cost`,
    complexity: 'O(n log n) time and O(n) space for the heap, or O(1) extra space if the input is heapified in place.',
    pitfalls: [
      'Sorting once and folding from the left: a merged stick can be larger than the next one, so the order must update.',
      'A single stick costs 0: don\'t pop twice on a one-element heap.',
      'Using int for the running total on large inputs: use long long.',
      'Extending the idea to k-way merges without padding: when (n - 1) mod (k - 1) isn\'t 0, add zero-size items first.',
    ],
    pointsToPonder: [
      'Why does the merged-values order stay non-decreasing, making the two-queue method work?',
      'Why does this greedy fail once only adjacent piles can merge?',
      'How do you read off Huffman codes from the merge tree?',
    ],
    practice: [1167, 1338, 1000],
    snippet: '8-min-heap-greedy-minimum-cost-to-connect-sticks',
  },
  '16. Heap + Binary Search / Two Pointer': {
    crux: 'For a k-th value in sorted structures, a heap walks the frontier in about k log n, while binary search counts values <= x without visiting them. Let the size of k decide.',
    signals: [
      '"Kth smallest element in a sorted matrix", where rows and columns are sorted.',
      '"The k pairs with the smallest sums": you must list the pairs, so the heap\'s frontier fits best.',
      '"The kth smallest product" or "the kth smallest fraction": k can reach n^2 or more, which rules out walking.',
      'A question where counting values <= x is easy, even though finding the k-th directly looks hard.',
    ],
    notThis: [
      'An unsorted array with one query: Quickselect, in section 22.',
      'Minimum Cost to Hire K Workers (LC 857) is sort plus heap with nothing to binary search: see section 10.',
      'Smallest Range (LC 632) holds one element per list, which is k-way merge: see section 4.',
    ],
    concepts: [
      'Binary search on the value needs count(x) to be monotonic in x, and the answer is the smallest x with count(x) >= k.',
      'In a sorted matrix, a staircase walk from the bottom-left corner counts values <= x in O(n).',
      'Only the heap hands back the items themselves, so use it when the output is the pairs rather than just the k-th value.',
    ],
    example: {
      problem: 'Kth Smallest Element in a Sorted Matrix with matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8',
      lc: 378,
      walkthrough: [
        'The value range is lo = 1 to hi = 15.',
        'mid = 8: 2 values are <= 8 (1 and 5). 2 < 8, so lo = 9.',
        'mid = 12: 6 values are <= 12. 6 < 8, so lo = 13.',
        'mid = 14: 8 values are <= 14. 8 >= 8, so hi = 14.',
        'mid = 13: 8 values are <= 13. 8 >= 8, so hi = 13.',
        'lo = hi = 13, so the answer is 13.',
      ],
    },
    code: `def kth_smallest(matrix, k):
    n = len(matrix)

    def count_le(x):           # staircase from the bottom-left
        r, c, cnt = n - 1, 0, 0
        while r >= 0 and c < n:
            if matrix[r][c] <= x:
                cnt += r + 1
                c += 1
            else:
                r -= 1
        return cnt

    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = (lo + hi) // 2
        if count_le(mid) >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    complexity: 'O(n log R) time for value range R and O(1) space. The heap alternative takes O(k log n) time and O(n) space.',
    pitfalls: [
      'Returning mid when count(mid) == k: mid may not be in the matrix, so keep narrowing until lo == hi.',
      'Using hi = mid - 1 with this loop, which can skip the answer.',
      'With negative values, (lo + hi) // 2 and C++\'s / round differently: a truncating divide can loop forever, so use lo + (hi - lo) / 2.',
      'In LC 373, pushing every (i, j) pair up front rather than the frontier, which costs too much memory.',
    ],
    pointsToPonder: [
      'Why is the final lo guaranteed to be a real value in the matrix?',
      'At what size of k does binary search overtake the heap for LC 378?',
      'How does the count change for LC 786 fractions or LC 2040 products?',
    ],
    practice: [373, 378, 786, 1439, 2040],
    snippet: '6-k-smallest-pairs-matrix-heap-of-frontier',
  },
  '17. Heap for BFS State Space / A\\*': {
    crux: 'Treat each whole configuration as a node. A* orders the search by moves so far plus an estimate that never overshoots, so it reaches the goal with fewer expansions.',
    signals: [
      '"Least number of moves to reach the solved board": the state is the whole board.',
      '"Eliminate at most k obstacles": the state is a position plus what\'s left to spend.',
      '"Minimum moves on an infinite board": the search needs direction, or it spreads everywhere.',
      'A small input limit, such as a 2 x 3 board, is a hint that you can enumerate states.',
    ],
    notThis: [
      'Every move costs 1 and the state space is small: plain BFS is simpler and also optimal, which fits LC 773, LC 1210 and LC 1293.',
      'Minimum Knight Moves (LC 1197) also has a symmetry-based BFS or formula, so a heap isn\'t required.',
      'You can\'t find an estimate that never overshoots: A* may return a wrong answer, so use BFS or Dijkstra.',
    ],
    concepts: [
      'Order the heap by f = g + h, where g is the moves made and h is the estimated moves left.',
      'Admissible means h never overestimates. With a consistent h, the first time the goal is popped, its g is optimal.',
      'With h = 0, A* is exactly Dijkstra. A good h only reduces how many states get expanded.',
    ],
    example: {
      problem: 'Sliding Puzzle with board = [[1,2,3],[0,4,5]]',
      lc: 773,
      walkthrough: [
        'The start (1,2,3,0,4,5) has tiles 4 and 5 each one step from home, so h = 2 and f = 2.',
        'Pop it. Swapping the blank with 1 gives h = 3 and f = 4. Swapping it with 4 gives (1,2,3,4,0,5), with h = 1 and f = 2.',
        'Pop (1,2,3,4,0,5) at g = 1. Swapping with 5 gives the goal, with f = 2. Swapping with 2 gives f = 4. Swapping with 4 returns to the start, which is no better, so it is skipped.',
        'Pop the goal at g = 2 and return 2. The states with f = 4 were never expanded.',
      ],
    },
    code: `NEIGHBORS = {0: (1, 3), 1: (0, 2, 4), 2: (1, 5), 3: (0, 4), 4: (1, 3, 5), 5: (2, 4)}

def sliding_puzzle(board):
    goal = (1, 2, 3, 4, 5, 0)

    def h(state):              # sum of Manhattan distances, ignoring the blank
        total = 0
        for i, tile in enumerate(state):
            if tile:
                home = goal.index(tile)
                total += abs(i // 3 - home // 3) + abs(i % 3 - home % 3)
        return total

    start = tuple(board[0] + board[1])
    best = {start: 0}
    heap = [(h(start), 0, start)]
    while heap:
        _, g, state = heappop(heap)
        if state == goal:
            return g
        if g > best[state]:
            continue           # stale entry
        blank = state.index(0)
        for nb in NEIGHBORS[blank]:
            next_state = list(state)
            next_state[blank], next_state[nb] = next_state[nb], next_state[blank]
            next_state = tuple(next_state)
            if g + 1 < best.get(next_state, inf):
                best[next_state] = g + 1
                heappush(heap, (g + 1 + h(next_state), g + 1, next_state))
    return -1`,
    complexity: 'O(S log S) time and O(S) space in the worst case, for S reachable states. For LC 773, S is at most 6! = 720, and a good h expands far fewer.',
    pitfalls: [
      'An overestimating h, such as counting the blank as a tile: A* can stop on a non-optimal path.',
      'Using an unhashable state: convert the board to a tuple or string.',
      'Leaving a dimension out of the state, such as obstacle eliminations left in LC 1293.',
      'Marking states visited when pushed: a later, shorter route to the state is then ignored.',
    ],
    pointsToPonder: [
      'Why does Manhattan distance never overestimate the moves left in this puzzle?',
      'When does A* stop being worth the extra code compared with BFS?',
      'How would you detect an unsolvable board without searching at all?',
    ],
    practice: [1197, 1293, 773, 675, 1210],
    snippet: '7-dijkstra-shortest-path-with-a-min-heap',
  },
  '18. Heap with Custom Comparator / Multi-Key Sort': {
    crux: 'The whole ordering rule, tiebreaks included, goes into the key or comparator, and the heap then does the rest.',
    signals: [
      '"Sorted by frequency; words with the same frequency in lexicographical order".',
      '"Choose the task with the shortest processing time; if tied, the smallest index".',
      '"The free server with the smallest weight; if tied, the smallest index".',
      'Any statement with "if there is a tie", "breaking ties by", or "if multiple".',
    ],
    notThis: [
      'Nothing changes after the first ordering: one sort with the same key is simpler than a heap.',
      'Minimum Time to Visit a Cell (LC 2577) is mostly about waiting logic in Dijkstra: see section 5.',
      'The problem says "return in any order": skip the tiebreak key, since it adds nothing.',
    ],
    concepts: [
      'In Python, a tuple key is compared left to right: (-count, word) means higher count first, then smaller word.',
      'In C++, the comparator answers "does a rank below b?", so a true result puts b nearer the top. That is why a min-heap uses >.',
      'A comparator must be a strict weak ordering: using <= or >= is undefined behaviour in C++.',
    ],
    example: {
      problem: 'Top K Frequent Words with words = ["the","day","is","the","day"], k = 2',
      lc: 692,
      walkthrough: [
        'The counts are the:2, day:2 and is:1.',
        'Build the keys (-2,"the"), (-2,"day") and (-1,"is"), then heapify.',
        'The first pop is (-2,"day"): both have count 2, and "day" sorts before "the".',
        'The second pop is (-2,"the").',
        'The answer is ["day","the"].',
      ],
    },
    code: `def top_k_words(words, k):
    heap = [(-c, w) for w, c in Counter(words).items()]
    heapify(heap)              # higher count first, then smaller word
    return [heappop(heap)[1] for _ in range(k)]`,
    complexity: 'O(n + u + k log u) time and O(u) space for u unique words. A size-k heap gives O(n + u log k) time and O(u) space for the counts.',
    pitfalls: [
      'Writing the C++ comparator as though it means "comes first": it is inverted, so a < b puts the largest on top.',
      'Capping a min-heap at k here: the tiebreak must flip too, so that the evicted word is the lexicographically larger one.',
      'Negating a string in Python isn\'t possible: use a wrapper class with __lt__ if the size-k version needs reverse order.',
      'Comparing distances as floats in LC 973: squared integer distances avoid sqrt and rounding.',
    ],
    pointsToPonder: [
      'Why does a capped heap for LC 692 need the tiebreak reversed but an uncapped heap doesn\'t?',
      'What breaks in C++ if a comparator returns true for equal elements?',
      'When is a sort key enough, and when do you need a real comparator function?',
    ],
    practice: [973, 692, 1834, 1882, 218],
    snippet: '14-custom-comparator-multi-key-heap',
  },
  '19. Indexed / Addressable Priority Queue': {
    crux: 'Items change priority while in the heap. Keep a map from item to its current key, and either update its position or let old entries die.',
    signals: [
      '"changeRating(food, newRating)", followed by "highestRated(cuisine)".',
      '"Replace the number at an index", then "return the smallest index for a number".',
      '"Decrease-key" in a shortest path or MST context.',
      '"Reserve the smallest available" and "unreserve": items leave and later come back.',
    ],
    notThis: [
      'Items only get pushed and popped: a plain heap is enough, as in LC 1845 and LC 2336.',
      'Range Module (LC 715) tracks merged intervals: use an ordered map of ranges.',
      'Design Twitter (LC 355) never updates a tweet: it is a k-way merge of recent posts, as in section 4.',
    ],
    concepts: [
      'A true indexed heap keeps pos[item] so that sift-up and sift-down can start from the item\'s slot, giving O(log n) updates.',
      'An ordered set with erase and reinsert gives the same bound, with less code in C++.',
      'The lazy method pushes a new entry per update and checks entries against the map on read, which is the usual choice in Python.',
    ],
    example: {
      problem: 'Design a Food Rating System with kimchi (korean, 9), ramen (japanese, 14), bulgogi (korean, 7)',
      lc: 2353,
      walkthrough: [
        'The korean heap holds (-9,kimchi) and (-7,bulgogi). highestRated("korean") reads kimchi, whose entry matches the map.',
        'changeRating("bulgogi", 16) updates the map and pushes (-16,bulgogi). highestRated("korean") reads bulgogi, which matches.',
        'changeRating("bulgogi", 8) updates the map and pushes (-8,bulgogi).',
        'highestRated("korean") reads (-16,bulgogi), but the map says 8, so that entry is dead and gets popped.',
        'The next top is (-9,kimchi), which matches, so the answer is kimchi.',
      ],
    },
    code: `class FoodRatings:
    def __init__(self, foods, cuisines, ratings):
        self.rating = dict(zip(foods, ratings))
        self.cuisine = dict(zip(foods, cuisines))
        self.heaps = defaultdict(list)
        for f, c, r in zip(foods, cuisines, ratings):
            heappush(self.heaps[c], (-r, f))

    def change_rating(self, food, new_rating):
        self.rating[food] = new_rating
        heappush(self.heaps[self.cuisine[food]], (-new_rating, food))

    def highest_rated(self, cuisine):
        heap = self.heaps[cuisine]
        while -heap[0][0] != self.rating[heap[0][1]]:
            heappop(heap)      # dead: this food's rating has changed
        return heap[0][1]`,
    complexity: 'O(log u) per change and amortized O(log u) per query, with O(n + u) space for n items and u updates.',
    pitfalls: [
      'Scanning the heap to find the old entry: that costs O(n) and defeats the structure.',
      'In a C++ set version, erasing with the new key rather than the old one: update the map only after the erase.',
      'In a hand-built indexed heap, forgetting to update pos on every swap.',
      'Assuming only one entry per item can be valid: equal old and new keys make duplicates, which is harmless here but matters when counting.',
    ],
    pointsToPonder: [
      'Why do most interview solutions pick lazy entries over a true indexed heap?',
      'How much does decrease-key actually save in Dijkstra on a sparse graph?',
      'What does a set give you that a heap can\'t, and what does it cost?',
    ],
    practice: [2336, 1845, 2349, 2353, 855],
    snippet: '15-indexed-addressable-pq-decrease-key-via-map',
  },
  '20. Heap for Stream Processing / Online Algorithms': {
    crux: 'The input never ends, so keep only what future answers can need, and have each call do just O(log n) work.',
    signals: [
      '"Design a class", followed by methods such as add, popSmallest or addBack.',
      '"Return the kth largest after each call".',
      '"Calls will be made up to 10^4 times": repeated sorting would be too slow.',
      '"The 10 most recent tweets from people you follow": merge fresh items only when asked.',
    ],
    notThis: [
      'Online Election (LC 911): the timeline is fixed up front, so precompute the leaders and binary search each query.',
      'Design a Leaderboard (LC 1244): k differs per call and scores change, so an ordered map or a sort per query fits better.',
      'All the data is available before the first query: solve it offline in a single sort.',
    ],
    concepts: [
      'Decide what can be discarded. A size-k heap can drop values that can never become the answer again.',
      'An infinite or huge range is represented by a pointer, and only exceptions go in the heap, as in LC 2336.',
      'A heap plus a set is a common pair: the heap gives order, and the set blocks duplicates.',
    ],
    example: {
      problem: 'Smallest Number in Infinite Set: popSmallest, popSmallest, addBack(1), addBack(5), popSmallest, popSmallest',
      lc: 2336,
      walkthrough: [
        'Start with next = 1 and an empty heap. The set is implicitly all of 1, 2, 3...',
        'popSmallest: the heap is empty, so return 1 and set next = 2. popSmallest again returns 2, and next = 3.',
        'addBack(1): 1 < next and it isn\'t in the heap, so push it. The heap is [1].',
        'addBack(5): 5 >= next, so 5 is already in the set. Nothing happens.',
        'popSmallest: the heap isn\'t empty, so return 1.',
        'popSmallest: the heap is empty again, so return 3, and next = 4.',
      ],
    },
    code: `class SmallestInfiniteSet:
    def __init__(self):
        self.next = 1          # everything from here up is present
        self.heap = []         # added-back numbers below next
        self.in_heap = set()

    def pop_smallest(self):
        if self.heap:
            x = heappop(self.heap)
            self.in_heap.remove(x)
            return x
        self.next += 1
        return self.next - 1

    def add_back(self, x):
        if x < self.next and x not in self.in_heap:
            self.in_heap.add(x)
            heappush(self.heap, x)`,
    complexity: 'O(log m) per call and O(m) space, for m numbers added back.',
    pitfalls: [
      'Adding a duplicate to the heap: addBack on a number already present must do nothing.',
      'Comparing the heap top with next before popping: every heap value is below next, so the heap always wins.',
      'Pre-filling the heap with a large range "to be safe", which costs memory and time.',
      'In LC 703, reading the top before k values have arrived.',
    ],
    pointsToPonder: [
      'What invariant makes it safe to check the heap first, without comparing with next?',
      'How would you adapt a size-k heap when k changes between calls?',
      'What would have to be true of the stream for an offline solution to work?',
    ],
    practice: [703, 1845, 2336, 355, 295],
    snippet: '2-kth-largest-fixed-size-min-heap',
  },
  '21. Heap + Prefix / Suffix Computations': {
    crux: 'When an answer depends on a split point, precompute the best k-element sum for every prefix and every suffix with a heap, then try each split.',
    signals: [
      '"Remove exactly n elements, then split the rest into a first part and a second part".',
      '"Minimum difference between the sums of the two parts".',
      'A question with a choice from the left and a choice from the right, joined at an unknown split.',
      '"Choose k from the first i items" for every i, rather than for one fixed i.',
    ],
    notThis: [
      'Minimum Operations to Make a Subsequence (LC 1713) reduces to LIS, with no heap.',
      'Minimum Cost to Make Array Equal (LC 2448): the cost is convex, so use a weighted median or binary search.',
      'Only one direction matters, as in LC 2542 and LC 1383: a single sort-and-heap sweep is enough, in section 10.',
    ],
    concepts: [
      'One sweep from the left gives left[i], the smallest sum of n values in nums[..i], using a max-heap to evict the largest.',
      'A sweep from the right gives the matching best for each suffix, using a min-heap to evict the smallest.',
      'This is the prefix-suffix idea from arrays, applied when each stored value is a best-k sum rather than a simple total.',
    ],
    example: {
      problem: 'Minimum Difference in Sums After Removal of Elements with nums = [7,9,5,8,1,3]',
      lc: 2163,
      walkthrough: [
        'Here n = 2. The first 2 values sum to 16, so left[1] = 16, with the max-heap holding 9 and 7.',
        'Sweep left: 5 evicts 9, so left[2] = 12. Then 8 is evicted right away, so left[3] = 12.',
        'Start right with the last 2 values, 1 and 3, whose sum is 4. The split at index 3 gives left[3] - 4 = 8.',
        'Sweep right: at index 3, 8 enters and evicts 1, so the sum is 11. left[2] - 11 = 1, so best = 1.',
        'At index 2, 5 enters and evicts 3, so the sum is 13. left[1] - 13 = 3, so best stays 1.',
        'The answer is 1.',
      ],
    },
    code: `def minimum_difference(nums):
    n = len(nums) // 3
    high = [-x for x in nums[:n]]  # max-heap: keep the n smallest
    heapify(high)
    s = sum(nums[:n])
    left = {n - 1: s}
    for i in range(n, 2 * n):
        s += nums[i] + heappushpop(high, -nums[i])  # pops the negated largest
        left[i] = s

    low = nums[2 * n:]         # min-heap: keep the n largest
    heapify(low)
    s = sum(low)
    best = left[2 * n - 1] - s
    for i in range(2 * n - 1, n - 1, -1):
        s += nums[i] - heappushpop(low, nums[i])
        best = min(best, left[i - 1] - s)
    return best`,
    complexity: 'O(n log n) time and O(n) space for the heaps and the left table.',
    pitfalls: [
      'Using the same heap direction in both sweeps: the left wants small values and the right wants large ones.',
      'An off-by-one at the split: a suffix that starts at i pairs with left[i - 1].',
      'Letting the split go outside [n - 1, 2n - 1], which leaves a part with fewer than n values.',
      'Forgetting the initial split, before any element has joined the right side.',
    ],
    pointsToPonder: [
      'Why is removing n elements the same as choosing a split and taking the best from each side?',
      'Why can a heap value evicted in one prefix never be needed in a longer prefix?',
      'Could you get the same result with a single sweep? Why or why not?',
    ],
    practice: [2542, 502, 1383, 2163],
    snippet: '2-kth-largest-fixed-size-min-heap',
  },
  '22. Heap in Divide and Conquer': {
    crux: 'Many heap problems also split in half. Merge pairs or partition around a pivot when the data is static, and use the heap when it arrives over time.',
    signals: [
      '"Merge k sorted lists", especially with "constant extra space" or a request for an alternative to the heap.',
      '"Kth largest", with "can you solve it without sorting?" or O(n) average expected.',
      '"How many smaller elements to the right": a count collected while merging sorted halves.',
      '"Combine two skylines": each half is solved separately, then the results merge.',
    ],
    notThis: [
      'Create Maximum Number (LC 321) splits k across two arrays, then uses a monotonic stack and a greedy merge, with no heap.',
      'Closest Subsequence Sum (LC 1755) is meet in the middle, with sorted subset sums and two pointers.',
      'The data arrives online: you can\'t divide what you haven\'t seen, so stay with a heap.',
    ],
    concepts: [
      'A heap and pairwise merging both cost O(N log k): each value takes part in about log k comparisons.',
      'Quickselect recurses on one side only, so it averages O(n), while a heap can answer k-th queries over a stream.',
      'Merge sort exposes order between the halves, which is what makes counting problems like LC 315 work.',
    ],
    example: {
      problem: 'Merge k Sorted Lists by rounds with lists = [[1,4],[1,3],[2],[0,5]]',
      lc: 23,
      walkthrough: [
        'There are 4 lists, so pair them as ([1,4], [1,3]) and ([2], [0,5]).',
        'Merging the first pair gives [1,1,3,4]. Merging the second gives [0,2,5].',
        'There are 2 lists left, so pair them once more.',
        'Merging gives [0,1,1,2,3,4,5]. One list remains, so that is the answer.',
        'There were 2 rounds, which is log2(4), and each round touched every value once.',
      ],
    },
    code: `def merge_two(a, b):
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    return out + a[i:] + b[j:]

def merge_k(lists):
    if not lists:
        return []
    while len(lists) > 1:
        lists = [merge_two(lists[i], lists[i + 1] if i + 1 < len(lists) else [])
                 for i in range(0, len(lists), 2)]
    return lists[0]`,
    complexity: 'O(N log k) time for N values across k lists. This array version uses O(N) space per round, while linked lists can relink in O(1) extra space with the bottom-up version.',
    pitfalls: [
      'Merging lists one at a time into a growing result: that costs O(Nk), not O(N log k).',
      'Dropping the unpaired list when k is odd: pair it with an empty list so that it carries over.',
      'Using a fixed pivot in Quickselect on sorted or adversarial input: choose it at random.',
      'Quickselect with many duplicates: a two-way partition degrades, so use three-way partitioning.',
    ],
    pointsToPonder: [
      'Why do the heap and pairwise merge give the same bound, even though they look so different?',
      'Which of the two would you choose for external sorting of files on disk, and why?',
      'What does Quickselect\'s average O(n) depend on?',
    ],
    practice: [215, 23, 218, 315],
    snippet: '5-k-way-merge-merge-k-sorted-lists',
  },
  '23. Double-Ended Priority Queue / Min-Max Heap': {
    crux: 'When you need both the minimum and the maximum, check first whether one is easy to track. If not, pair two heaps or use an ordered set.',
    signals: [
      '"The difference between the maximum and minimum": both ends matter on every step.',
      '"The absolute difference between any two elements is at most limit": the window\'s max and min decide validity.',
      '"Return the highest and lowest" after changes.',
      '"Minimum deviation" where operations can only shrink the large values or grow the small ones.',
    ],
    notThis: [
      'Only window ends change, as in LC 1438: two monotonic deques are O(n).',
      'Maximum Gap (LC 164) needs linear time, so use buckets and the pigeonhole principle.',
      'Only the middle matters, as in LC 295 and LC 480: two heaps meeting at the median, in sections 3 and 12.',
    ],
    concepts: [
      'In C++ a multiset gives both ends in O(1) and removal in O(log n). In Python, use SortedList or a pair of lazy heaps.',
      'If one end only moves one way, a plain variable can track it, as in LC 1675, where the minimum can only be lowered by halving.',
      'Normalize first when operations are reversible: in LC 1675, doubling each odd number lets every later step be a halving.',
    ],
    example: {
      problem: 'Minimize Deviation in Array with nums = [1,2,3,4]',
      lc: 1675,
      walkthrough: [
        'Double the odd numbers so every value can only go down: [2,2,6,4]. The tracked minimum is 2.',
        'Pop 6. The deviation is 6 - 2 = 4, so best = 4. 6 is even, so push 3. The minimum stays 2.',
        'Pop 4. The deviation is 4 - 2 = 2, so best = 2. 4 is even, so push 2. The minimum stays 2.',
        'Pop 3. The deviation is 3 - 2 = 1, so best = 1. 3 is odd and can\'t shrink, so stop.',
        'The answer is 1.',
      ],
    },
    code: `def minimum_deviation(nums):
    heap = [-(x * 2 if x % 2 else x) for x in nums]  # max-heap
    heapify(heap)
    low = -max(heap)
    best = inf
    while True:
        top = -heappop(heap)
        best = min(best, top - low)
        if top % 2:
            return best        # an odd max can't shrink any further
        low = min(low, top // 2)
        heappush(heap, -(top // 2))`,
    complexity: 'O(n log n log M) time for maximum value M, because each number halves at most log M times. O(n) space.',
    pitfalls: [
      'Forgetting the normalization step and trying to double and halve at once, which makes the search branch.',
      'Not updating the tracked minimum after pushing a halved value.',
      'Continuing after an odd maximum: the maximum can\'t fall further, so no later step can improve the result.',
      'Building a real min-max heap in an interview, when a multiset or two lazy heaps does the job with much less code.',
    ],
    pointsToPonder: [
      'Why is the answer already final as soon as the maximum is odd?',
      'When can a tracked variable replace a second heap?',
      'What would two lazy heaps need to share in order to stay in sync on removal?',
    ],
    practice: [1438, 2034, 295, 1675],
    snippet: '10-lazy-deletion-heap-remove-arbitrary-elements',
  },
  '24. Heap + Graph (Non-Dijkstra)': {
    crux: 'Beyond shortest paths, a heap in a graph either grows a spanning tree or keeps each node\'s best k edges or neighbours.',
    signals: [
      '"Sum of a node\'s value and at most k of its neighbours": rank per node, not across the graph.',
      '"Connect all points at minimum cost": Prim, in section 11.',
      '"You can use at most d discounts": a graph state with an extra dimension.',
      '"How many nodes can be reached within maxMoves": Dijkstra with counting on the edges.',
    ],
    notThis: [
      'A minimum cost between two given nodes with no extra rules: plain Dijkstra, in section 5.',
      'Critical and Pseudo-Critical Edges (LC 1489): the task re-runs an MST with edges forced or banned, which is easiest with Kruskal.',
      'Minimum Cost to Reach City With Discounts (LC 2093) and LC 882 are still shortest paths despite the listing here, so reuse the Dijkstra template.',
    ],
    concepts: [
      'Per-node top-k: each node owns a small heap, so the total cost is O(E log k) rather than a global sort.',
      'Only positive neighbours help when "at most k" allows you to skip the rest.',
      'Prim\'s key is the edge weight, Dijkstra\'s is the path total, and per-node ranking has no traversal at all.',
    ],
    example: {
      problem: 'Maximum Star Sum of a Graph with vals = [1,2,3,4,10,-10,-20], edges = [[0,1],[1,2],[1,3],[3,4],[3,5],[3,6]], k = 2',
      lc: 2497,
      walkthrough: [
        'Keep each node\'s 2 largest positive neighbours.',
        'Node 0 keeps 2 (node 1), so its star is 1 + 2 = 3.',
        'Node 1 sees 1, 3 and 4, keeps 3 and 4, and its star is 2 + 7 = 9. Node 2 keeps 2, so its star is 3 + 2 = 5.',
        'Node 3 sees 2, 10, -10 and -20, keeps 2 and 10, and its star is 4 + 12 = 16.',
        'Node 4 keeps 4, so its star is 14. Nodes 5 and 6 keep 4, so their stars are -6 and -16.',
        'The largest star is 16, at node 3.',
      ],
    },
    code: `def max_star_sum(vals, edges, k):
    best = defaultdict(list)   # node -> min-heap of its k largest positive neighbours

    def add(u, v):
        if vals[v] > 0:
            heappush(best[u], vals[v])
            if len(best[u]) > k:
                heappop(best[u])

    for u, v in edges:
        add(u, v)
        add(v, u)
    return max(vals[i] + sum(best[i]) for i in range(len(vals)))`,
    complexity: 'O(V + E log k) time and O(V + min(E, Vk)) space.',
    pitfalls: [
      'Adding each edge in one direction only: the graph is undirected, so both ends need it.',
      'Including negative neighbours: "at most k" lets you leave them out.',
      'Initializing the best star to 0: all values can be negative, and a single node is a valid star.',
      'k = 0: only the node\'s own value counts, and the capped heap handles this if it pops after each push.',
    ],
    pointsToPonder: [
      'Why is a per-node heap better than one global sort of edges here?',
      'How do you spot that a "graph" problem involves no traversal at all?',
      'What is the extra dimension in the state for LC 2093, and how large does it get?',
    ],
    practice: [2497, 1584, 2093, 882, 1489],
    snippet: '2-kth-largest-fixed-size-min-heap',
  },
  '25. Hard / Contest-Level Heap Problems': {
    crux: 'Hard heap problems stack two ideas: find the sweep or the state first, then ask what the heap orders. Several in this list are better solved without a heap.',
    signals: [
      '"Key points of the outline" with buildings that start and end: a sweep plus a max-heap of live heights.',
      '"Smallest range with at least one number from each list": k-way merge, tracking the maximum.',
      '"Minimum possible maximum" or "maximize the minimum": try binary search on the answer first, and use a heap only inside the check.',
      '"Kth smallest pair distance" with n up to 10^4: n^2 pairs won\'t fit, so binary search on the value.',
    ],
    notThis: [
      'Maximize the Minimum Powered City (LC 2528) and Maximum Running Time of N Computers (LC 2141) are binary search on the answer.',
      'Find K-th Smallest Pair Distance (LC 719) times out with a heap: binary search with two pointers instead.',
      'Count of Range Sum (LC 327) uses merge sort or a Fenwick tree on prefix sums.',
      'Maximum Total Reward (LC 3181) is DP over reachable sums, and Closest Subsequence Sum (LC 1755) is meet in the middle.',
    ],
    concepts: [
      'Sweeps are the main way a heap meets geometry: sort events by coordinate, and let the heap hold what is currently active.',
      'Expiry is usually lazy: an old height stays in the heap until it reaches the top.',
      'Read the limits before choosing: n up to 10^5 with a monotonic check suggests binary search; k ordered picks suggest a heap.',
    ],
    example: {
      problem: 'The Skyline Problem with buildings = [[2,9,10],[3,7,15],[5,12,12]]',
      lc: 218,
      walkthrough: [
        'The event x values are 2, 3, 5, 7, 9, 12. The heap starts with a ground entry of height 0 that never expires.',
        'x = 2: add height 10 (ends at 9). The top is 10, a change, so output [2,10].',
        'x = 3: add height 15 (ends at 7). The top is 15, so output [3,15].',
        'x = 5: add height 12 (ends at 12). The top is still 15, so output nothing.',
        'x = 7: 15 has expired, so pop it. The top is 12, so output [7,12].',
        'x = 9: height 10 has expired but isn\'t on top, so it stays. The top is still 12, so output nothing.',
        'x = 12: pop 12, then the expired 10. The ground is on top, so output [12,0].',
      ],
    },
    code: `def skyline(buildings):
    buildings.sort()
    xs = sorted({x for left, right, _ in buildings for x in (left, right)})
    live = [(0, inf)]          # (-height, right edge); ground never expires
    res, i = [], 0
    for x in xs:
        while i < len(buildings) and buildings[i][0] <= x:
            left, right, height = buildings[i]
            heappush(live, (-height, right))
            i += 1
        while live[0][1] <= x:
            heappop(live)      # lazily expire
        h = -live[0][0]
        if not res or res[-1][1] != h:
            res.append([x, h])
    return res`,
    complexity: 'O(n log n) time for the sort and heap operations, and O(n) space.',
    pitfalls: [
      'Emitting a point at every event: output only when the top height changes, or equal neighbours produce duplicates.',
      'Using < rather than <= when expiring: a building whose right edge is x no longer covers x.',
      'Removing the ground entry, which leaves the heap empty at the end of a run of buildings.',
      'Reaching for a heap because the problem is listed here: check for a monotonic answer first.',
    ],
    pointsToPonder: [
      'Why does adding all buildings that start at x before reading the top solve the tie cases?',
      'How do you tell a binary search on the answer from a heap problem by reading the statement alone?',
      'Which two simpler patterns make up Trapping Rain Water II (LC 407)?',
    ],
    practice: [871, 632, 218, 407, 1675],
    snippet: '9-sliding-window-maximum-heap-with-lazy-deletion',
  },
}
