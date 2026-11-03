export const greedy = {
  '1. Sorting + Greedy (Sort-Then-Decide)': {
    crux: 'Pick the right sort order, then sweep once making irrevocable local decisions.',
    signals: [
      '"Assign", "pair up" or "match" items where you may reorder the input freely: sort first and see what the order gives you.',
      '"Minimum number of boats" or "minimize the maximum pair sum": sort, then pair from the ends.',
      '"Form the largest number" or "arrange so that...": the answer depends on a custom sort order.',
      '"After at most k moves" or "remove three elements" on the extremes: once sorted, only the ends can matter.',
    ],
    notThis: [
      'The original order carries meaning, as in Longest Increasing Subsequence (LC 300): sorting destroys what you are asked about.',
      'You choose a subset under a weight limit with indivisible items, as in 0/1 knapsack: sorting by ratio can lose, so use DP.',
    ],
    concepts: [
      'The sort criterion IS the algorithm — end-time, deadline, ratio, or a custom a+b vs b+a comparator each define a different problem.',
      'After sorting, a single linear pass with a small running state (last end, total, count) is usually enough.',
      'Two-pointer pairing (greedy match smallest-with-largest or smallest-with-smallest) is a frequent sub-pattern.',
    ],
    example: {
      problem: 'Assign Cookies with children g = [1,3] and cookies s = [1,2,4]',
      lc: 455,
      walkthrough: [
        'Sort both lists. Here `items` is the cookies, and the state is i, the next hungriest child to feed. Start with i = 0.',
        'Cookie 1: good, since 1 >= g[0] = 1. Take it, so i = 1.',
        'Cookie 2: not good, since 2 < g[1] = 3. Skip it, because it can\'t satisfy anyone still waiting.',
        'Cookie 4: good, since 4 >= g[1] = 3. Take it, so i = 2.',
        'Both children are fed, so the answer is 2.',
      ],
    },
    complexity: 'O(n log n) time for the sort, then one O(n) pass. O(1) extra space beyond the sort.',
    pitfalls: [
      'Reaching for the first sort key that comes to mind: Two City Scheduling (LC 1029) sorts by the cost difference, not by either cost.',
      'Writing a C++ comparator with `<=` or `>=`: it must be a strict ordering, or sort can crash.',
      'Spending the largest resource on the smallest need: in LC 455, feed each child the smallest cookie that fits.',
      'Forgetting that a greedy pass can leave one item unpaired, as with the last person in Boats to Save People (LC 881).',
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
    practice: [455, 1502, 881, 1029, 1877],
    snippet: '12-assign-cookies',
  },

  '2. Interval Scheduling / Merging': {
    crux: 'Sort by END time to pack the most non-overlapping intervals; sort by START to merge.',
    signals: [
      '"Maximum number of non-overlapping..." or "remove the fewest intervals so that none overlap": sort by end time.',
      '"Merge all overlapping..." or "insert into a sorted list of intervals": sort by start time.',
      '"Minimum number of rooms, platforms or arrows": ask how many intervals overlap at one moment.',
      'The input is a list of [start, end] pairs and only their order and overlap matter.',
    ],
    notThis: [
      'Intervals carry values, as in Maximum Profit in Job Scheduling (LC 1235): taking the earliest end can lose the most valuable job, so use DP with binary search.',
      'Bookings arrive one at a time, as in My Calendar (LC 729): you can\'t sort up front, so keep a sorted map.',
    ],
    concepts: [
      'Activity selection: sort by end time, greedily take the interval whose start ≥ last chosen end.',
      'Merge intervals: sort by start; if next.start ≤ cur.end, extend cur.end = max(cur.end, next.end).',
      'Min meeting rooms = max overlap = sweep-line with a +1/-1 timeline, or a min-heap of end times.',
    ],
    example: {
      problem: 'Non-overlapping Intervals with [[1,2],[2,3],[3,4],[1,3]]',
      lc: 435,
      walkthrough: [
        'Sort by end time: [1,2], [2,3], [1,3], [3,4]. Start with end = -inf and count = 0.',
        '[1,2]: 1 >= -inf, so keep it. Now end = 2 and count = 1.',
        '[2,3]: 2 >= 2, so keep it, because touching at a point doesn\'t count as overlap here. Now end = 3 and count = 2.',
        '[1,3]: 1 < 3, so skip it.',
        '[3,4]: 3 >= 3, so keep it. Now end = 4 and count = 3.',
        'We kept 3 of 4 intervals, so the answer is 1 removal.',
      ],
    },
    complexity: 'O(n log n) time for the sort, then one O(n) pass. O(1) extra space, or O(n) if you build a merged list.',
    pitfalls: [
      'Sorting by start time when counting non-overlapping intervals: one long early interval can block many short ones.',
      'Using `<` where the problem needs `<=`: LC 435 lets intervals touch, while LC 56 merges them.',
      'When merging, writing cur.end = next.end instead of max(cur.end, next.end): [1,10] followed by [2,3] would shrink the interval.',
      'In a meeting-room sweep, handle ends before starts at equal times if a room can be reused at that moment.',
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
    practice: [2848, 56, 435, 57, 253],
    snippet: '1-activity-selection-non-overlapping-intervals',
  },

  '3. Jump Game Family (Greedy Range Extension)': {
    crux: 'Track the farthest index reachable so far; extend the "current frontier" lazily.',
    signals: [
      '"Each element is your maximum jump length": track the farthest reachable index.',
      '"Can you reach the last index?" asks about reachability, and "minimum number of jumps" asks about levels.',
      '"Minimum number of clips, taps or stations to cover the whole range": each option extends a reachable frontier.',
    ],
    notThis: [
      'You must jump exactly arr[i] in either direction, as in Jump Game III (LC 1306): the moves aren\'t ranges, so use BFS.',
      'The next jump depends on the last one, as in Frog Jump (LC 403): the state includes the jump size, so use DP.',
      'Forbidden positions and a limit on backward moves, as in Minimum Jumps to Reach Home (LC 1654): use BFS with a state for direction.',
    ],
    concepts: [
      'Reachability (Jump Game I): walk left-to-right, if i > farthest you are stuck; else farthest = max(farthest, i + nums[i]).',
      'Min jumps (Jump Game II): BFS-like — `end` marks the boundary of the current jump level; when i == end, you must spend a jump and advance end to farthest.',
      'Refueling / taps / video stitching: treat reachable range as the state and pick the option that extends it the most.',
    ],
    example: {
      problem: 'Jump Game II with nums = [2,3,1,1,4]',
      lc: 45,
      walkthrough: [
        'Start with farthest = 0, end = 0 and jumps = 0. The loop stops before the last index.',
        'i = 0: farthest = max(0, 0+2) = 2. Since i == end, spend a jump: jumps = 1 and end = 2.',
        'i = 1: farthest = max(2, 1+3) = 4. i is not at end.',
        'i = 2: farthest = max(4, 2+1) = 4. Since i == end, spend a jump: jumps = 2 and end = 4.',
        'i = 3: farthest stays 4, and i is not at end. The loop finishes, so the answer is 2.',
      ],
    },
    complexity: 'O(n) time and O(1) space for the Jump Game pair. Refueling Stops adds a heap: O(n log n) time and O(n) space.',
    pitfalls: [
      'Looping up to the last index in Jump Game II: at i == n-1 with i == end, you count one jump too many.',
      'Updating farthest only at the boundary: every index in the current level must get a chance to extend it.',
      'In Jump Game I, reading nums[i] before checking i > farthest: an unreachable index must not extend the range.',
      'In Video Stitching (LC 1024), not checking for a gap: if farthest doesn\'t grow at the boundary, return -1.',
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
    practice: [55, 45, 1024, 1326, 871],
    snippet: '7-jump-game-ii',
  },

  '4. Activity Selection / Scheduling': {
    crux: 'Order tasks by a deadline/priority, then either greedily accept or swap out a worse past pick.',
    signals: [
      '"Deadline", "must finish by day d" or "lastDay": sort by deadline.',
      '"Maximum number of courses or tasks you can complete": count what fits, and evict if it doesn\'t.',
      '"The CPU picks the shortest available task", as in LC 1834: simulate with a heap of ready tasks.',
      '"The same task must be n units apart": the most frequent task sets the layout, so count frequencies.',
    ],
    notThis: [
      'Jobs have profits and fixed time ranges, as in Maximum Profit in Job Scheduling (LC 1235): use DP with binary search.',
      'Sessions have a capacity and n is at most 14, as in Minimum Number of Work Sessions (LC 1986): use bitmask DP.',
    ],
    concepts: [
      'Earliest-deadline-first ordering is the default for deadline-bounded scheduling.',
      'A max-heap of accepted tasks enables "regret": if a new task does not fit, evict the worst already accepted if it is worse than the new one.',
      'Task Scheduler with cooldown is a counting problem, not a sort problem: layout governed by the most frequent task.',
    ],
    example: {
      problem: 'Course Schedule III with courses = [[3,4],[2,5],[1,5]] as [duration, deadline]',
      lc: 630,
      walkthrough: [
        'Sorting by deadline keeps the order [3,4], [2,5], [1,5]. Start with an empty heap and time = 0.',
        '[3,4]: push 3, so time = 3. Since 3 <= 4, keep it.',
        '[2,5]: push 2, so time = 5. Since 5 <= 5, keep it.',
        '[1,5]: push 1, so time = 6. Since 6 > 5, drop the longest course (3), so time = 3.',
        'The heap holds durations 2 and 1, so the answer is 2 courses.',
      ],
    },
    complexity: 'O(n log n) time for the sort and the heap operations. O(n) space for the heap.',
    pitfalls: [
      'Sorting Course Schedule III by duration: a short course with a late deadline can crowd out an urgent one.',
      'Dropping the course you just added rather than the longest one: only evicting the longest frees the most time.',
      'Skipping the max() in the Task Scheduler formula: with many distinct tasks, the answer is tasks.size() with no idle time.',
      'In Single-Threaded CPU (LC 1834), not jumping the clock forward when no task is ready, which leaves the loop stuck.',
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
    practice: [435, 646, 1353, 621, 630],
    snippet: '26-greedy-with-priority-queue-course-schedule-iii',
  },

  "5. Greedy + Heap (Regret-Based / Exchange Argument)": {
    crux: 'Commit greedily as you go, but keep a heap of past decisions so you can "undo" the worst one when a better option appears.',
    signals: [
      '"At most k" of something scarce, with ladders, refuels or projects: spend it now and reassign it later if a better use appears.',
      '"Use the ladders on the largest climbs" or "how far can you get?": keep the commitments you might want to take back.',
      '"Pick k items to maximize sum times minimum": sort by one factor and keep the best k of the other in a heap.',
      '"You may only start a project once you have enough capital": unlock options in order and always take the best unlocked one.',
    ],
    notThis: [
      'A yes/no check gets easy once the answer is fixed, as in Maximum Running Time of N Computers (LC 2141): binary search the answer.',
      'The task reduces to matching order, as in Minimum Operations to Make a Subsequence (LC 1713): map to indices and run LIS.',
    ],
    concepts: [
      'Pattern: scan in some order → push current into heap → if constraint violated, pop the worst.',
      'Course Schedule III, IPO, Minimum Refueling Stops, Furthest Building are all this exact pattern with different "worst" definitions.',
      'The heap is not a priority queue of FUTURE options — it is a priority queue of PAST commitments you may want to revoke.',
    ],
    example: {
      problem: 'Minimum Number of Refueling Stops with target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]',
      lc: 871,
      walkthrough: [
        'fuel = 10 means we can reach position 10. Push the only reachable station, so the heap holds {60}.',
        'Pop 60: fuel = 70 and stops = 1.',
        'fuel = 70 < 100, so push the stations at 20, 30 and 60. The heap holds {30, 30, 40}.',
        'Pop 40: fuel = 110 and stops = 2.',
        'fuel >= target ends the loop, so the answer is 2.',
      ],
    },
    complexity: 'O(n log n) time, since each item is pushed and popped at most once. O(n) space for the heap.',
    pitfalls: [
      'Forgetting that Python\'s heapq is a min-heap: store negated values for a max-heap, and negate again on pop.',
      'Pushing all stations up front instead of only reachable ones: you would be refueling at a place you can\'t get to.',
      'Choosing the wrong thing to regret: in LC 1642 the heap holds ladder climbs, and the smallest one moves to bricks.',
      'In LC 2542 and LC 1383, leaving the score unchecked until the heap is full: only a full k-sized heap gives a valid answer.',
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
    practice: [1642, 2542, 630, 871, 502],
    snippet: '27-minimum-refueling-stops',
  },

  '6. Two Pointer Greedy': {
    crux: 'Two pointers from opposite ends; on each step, move the one whose move cannot improve the answer.',
    signals: [
      '"Sorted array" plus "find a pair" or "closest to target": move the end that can\'t help.',
      '"Two lines that form a container": the shorter side caps the result, so it moves.',
      '"Each boat holds at most two people", or any "pair lightest with heaviest" rule: sort and pair from the ends.',
      '"Do it in place with O(1) extra space" on an array: one pointer reads and the other writes.',
    ],
    notThis: [
      'Subarray sums with negative numbers, as in Subarray Sum Equals K (LC 560): moving a pointer isn\'t safe, so use prefix sums and a hash map.',
      'Partition Labels (LC 763) sits in this list, but it depends on the last position of each letter, so see section 11.',
    ],
    concepts: [
      'Container With Most Water: area is bounded by the shorter wall, so move the shorter pointer — the taller one cannot improve area while paired with anything shorter.',
      'Boats / Assign Cookies: pair smallest-with-largest (or smallest-with-smallest) to satisfy a capacity constraint.',
      '3Sum / 3Sum Closest: fix one, then two-pointer the rest of a sorted array.',
    ],
    example: {
      problem: 'Container With Most Water with h = [1,8,6,2,5]',
      lc: 11,
      walkthrough: [
        'l = 0, r = 4: area = min(1,5) * 4 = 4, so best = 4. h[l] < h[r], so move l to 1.',
        'l = 1, r = 4: area = min(8,5) * 3 = 15, so best = 15. h[l] >= h[r], so move r to 3.',
        'l = 1, r = 3: area = min(8,2) * 2 = 4, so best stays 15. Move r to 2.',
        'l = 1, r = 2: area = min(8,6) * 1 = 6, so best stays 15. Move r to 1.',
        'l == r ends the loop, so the answer is 15.',
      ],
    },
    complexity: 'O(n) time and O(1) space, plus O(n log n) if the input must be sorted first. 3Sum costs O(n^2).',
    pitfalls: [
      'Moving the taller wall: the width shrinks and the height is still capped by the shorter wall, so the area can\'t improve.',
      'Using `l <= r` when a pair needs two distinct elements. Boats (LC 881) does want `<=`, since one person can ride alone.',
      'In 3Sum (LC 15), skipping duplicates only at the fixed index: the two inner pointers need skipping too.',
      'Applying the sorted-array move to unsorted input, as in Two Sum (LC 1): moving a pointer no longer tells you anything.',
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
    practice: [455, 977, 167, 881, 11],
    snippet: '30-two-pointer-greedy-pairing',
  },

  '7. Greedy String Construction / Manipulation': {
    crux: 'Build the answer char by char; use a stack to retract earlier choices that turned out worse.',
    signals: [
      '"Lexicographically smallest" or "smallest possible number" after removing characters: a stack retracts bad earlier picks.',
      '"Remove k digits" or "most competitive subsequence of size k": you have a fixed budget of removals.',
      '"Each letter exactly once, in smallest order": the stack rule plus a check that the letter appears again later.',
      '"No two adjacent characters are the same" or "at most k in a row": always emit the most plentiful legal character from a heap.',
    ],
    notThis: [
      'Any rotation or swap is allowed, as in Orderly Queue (LC 899): reachability decides the answer, so analyze the operation first.',
      'You must keep a contiguous piece, as in Last Substring in Lexicographic Order (LC 1163): subsequence stack rules don\'t apply.',
    ],
    concepts: [
      'Lexicographic-smallest result + budget of K removals → monotonic increasing stack; pop while top > current and budget remains.',
      'Remove Duplicate Letters: same stack pattern, but also enforce "do not pop the last occurrence".',
      'For "largest" or "reorganize" variants, use a max-heap of (count, char) to always emit the most-available legal char.',
    ],
    example: {
      problem: 'Remove K Digits with num = "1432219" and k = 3',
      lc: 402,
      walkthrough: [
        '1 and then 4: nothing to pop, so the stack is 1 4.',
        '3: pop 4 since 4 > 3, so k = 2 and the stack is 1 3.',
        '2: pop 3, so k = 1 and the stack is 1 2. The next 2 isn\'t smaller, so the stack is 1 2 2.',
        '1: pop one 2, so k = 0 and the stack is 1 2 1. The budget is spent, so 9 just goes on: 1 2 1 9.',
        'k = 0, so nothing is trimmed from the end and there are no leading zeros. The answer is "1219".',
      ],
    },
    complexity: 'O(n) time, since each character is pushed and popped at most once. O(n) space for the stack. Heap variants take O(n log A) for alphabet size A.',
    pitfalls: [
      'Leaving k unused on a rising input: "12345" with k = 2 pops nothing, so trim the last k characters to get "123".',
      'Forgetting leading zeros and the empty result: "10200" with k = 1 gives "200", and "10" with k = 2 gives "0".',
      'In Remove Duplicate Letters (LC 316), popping a letter that never appears again, or adding one already in the stack.',
      'In Reorganize String (LC 767), not returning "" when a letter appears more than (n+1)/2 times.',
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
    practice: [402, 1081, 316, 767, 321],
    snippet: '18-greedy-with-monotonic-stack-remove-k-digits',
  },

  '8. Greedy Array Manipulation / Transformation': {
    crux: 'Maintain a small running quantity (current sum, min seen, deficit) and make local decisions against it.',
    signals: [
      '"Maximum sum of a contiguous subarray": decide at each element whether to extend or restart.',
      '"You may buy and sell as many times as you like": collect every upward step.',
      '"Minimum moves to make all elements equal": look for a target value such as the median or the minimum.',
      '"Minimum increments to make the array unique": sort and push each value just past the previous one.',
    ],
    notThis: [
      'A cap on transactions, as in Best Time to Buy and Sell Stock IV (LC 188): collecting every rise breaks the cap, so use DP.',
      'Signs can flip the result, as in Maximum Product Subarray (LC 152): a plain Kadane misses it, so track both max and min.',
      'A window with an exact target, as in Minimum Operations to Reduce X to Zero (LC 1658): turn it into a sliding window.',
    ],
    concepts: [
      "Kadane: cur = max(x, cur + x) — restart when prefix becomes a liability.",
      'Best Time to Buy/Sell I: track running min, take max(profit, price - min).',
      'Gas Station: total≥0 ⇒ a solution exists; the unique start is the index right after the last "tank goes negative".',
    ],
    example: {
      problem: 'Maximum Subarray with nums = [-2,1,-3,4,-1,2]',
      lc: 53,
      walkthrough: [
        'Start with cur = best = -2.',
        'x = 1: cur = max(1, -1) = 1, so best = 1.',
        'x = -3: cur = max(-3, -2) = -2, so best stays 1.',
        'x = 4: cur = max(4, 2) = 4, so best = 4.',
        'x = -1: cur = max(-1, 3) = 3, so best stays 4.',
        'x = 2: cur = max(2, 5) = 5, so best = 5. The answer is 5, from [4,-1,2].',
      ],
    },
    complexity: 'O(n) time and O(1) space for the running-state problems. Add O(n log n) where sorting is needed.',
    pitfalls: [
      'Starting cur and best at 0: with all-negative input like [-3,-1] the answer is -1, not 0.',
      'Using the mean in LC 462: the median is what minimizes the sum of absolute differences.',
      'In Gas Station (LC 134), returning the start without checking that total gas covers total cost.',
      'In Product of Array Except Self (LC 238), dividing the total product: a zero in the input breaks it.',
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
    practice: [976, 122, 53, 134, 238],
    snippet: '21-max-profit-stock-buy-sell-multiple-transactions',
  },

  '9. Greedy Graph / Tree': {
    crux: 'For graphs: sort edges + union-find (Kruskal) or grow a tree (Prim). For trees: post-order, decide at each node from its children.',
    signals: [
      '"Connect all points or cities at minimum total cost": build a minimum spanning tree.',
      '"Fewest cameras" or "minimum moves" on a binary tree: decide bottom-up, from the children to the parent.',
      '"Sum of distances for every node": compute one root, then reroot in O(1) per edge.',
      '"Assign importance values to nodes" or "pick up to k neighbors": sort by degree or edge value.',
    ],
    notThis: [
      'Cheapest route between two nodes, as in Network Delay Time (LC 743): an MST minimizes the total edge weight, not a path, so use Dijkstra.',
      'A rooted subtree choice with several interacting states, as in House Robber III (LC 337): use tree DP, since a local rule isn\'t enough.',
      'Edges are directed, as in Detonate the Maximum Bombs (LC 2101): there is no MST to build, so run BFS or DFS from each node.',
    ],
    concepts: [
      'MST cut property: the lightest edge crossing any cut is in some MST — justifies Kruskal/Prim greedy.',
      'Tree DP-greedy: at a node, aggregate child answers and make a local decision (Binary Tree Cameras, Distribute Coins).',
      'Rerooting: compute answer for one root, then transition to neighbors in O(1) — turns O(n²) into O(n).',
    ],
    example: {
      problem: 'Connecting Cities With Minimum Cost, with cities numbered 0 to 3 and edges [0,1,1], [1,2,2], [0,2,3], [2,3,4]',
      lc: 1135,
      walkthrough: [
        'The edges are already sorted by weight. Each city starts as its own component, and total = 0.',
        '[0,1,1]: different components, so union them. total = 1.',
        '[1,2,2]: different components, so union them. total = 3.',
        '[0,2,3]: 0 and 2 are already connected, so skip this edge to avoid a cycle.',
        '[2,3,4]: different components, so union them. total = 7, and the answer is 7.',
      ],
    },
    complexity: 'Kruskal takes O(E log E) time for the sort and O(V) space. Tree post-order takes O(n) time and O(h) stack space.',
    pitfalls: [
      'Not checking connectivity: if fewer than n-1 unions happened, the graph is disconnected and LC 1135 expects -1.',
      'Using 0-based arrays on 1-based city labels, as in LC 1135: allocate n+1 or shift the labels.',
      'In Binary Tree Cameras (LC 968), treating a null child as needing coverage: count it as covered, or you add extra cameras at the leaves.',
      'In Distribute Coins (LC 979), losing the sign: pass up the signed excess and add its absolute value to the moves.',
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
    practice: [1557, 1319, 1584, 1135, 968],
  },

  '10. Greedy + Binary Search': {
    crux: 'Binary search the answer; verify feasibility with a greedy O(n) check.',
    signals: [
      '"Minimum possible maximum" or "maximum possible minimum": binary search that answer.',
      '"Smallest capacity or speed so that it finishes within D days or h hours": the check gets easier as the value grows.',
      '"Split into k contiguous parts" with a limit on each: greedy packing answers the yes/no check.',
      'Values up to 10^9 alongside n up to 10^5: search the value range instead of the input.',
    ],
    notThis: [
      'Items can go to any group, as in Find Minimum Time to Finish All Jobs (LC 1723): left-to-right packing isn\'t optimal, so use backtracking or bitmask DP.',
      'The check isn\'t monotonic: if a larger value can turn a yes into a no, binary search can skip the answer.',
    ],
    concepts: [
      'Predicate must be MONOTONIC in the search variable (if X works, X+1 also works — or vice versa).',
      'The crux is the feasibility function: usually a one-pass greedy simulation.',
      'Split-Array-Largest-Sum / Ship-Packages: search the max-group-sum; greedy packs left-to-right.',
    ],
    example: {
      problem: 'Capacity to Ship Packages with weights = [1,2,3,4] and D = 2',
      lc: 1011,
      walkthrough: [
        'lo = max(weights) = 4 and hi = sum(weights) = 10.',
        'mid = 7: load 1, 3, 6, and adding 4 would make 10 > 7, so start day 2 with load 4. That takes 2 days, which works, so hi = 7.',
        'mid = 5: load 1, 3, and adding 3 makes 6 > 5, so day 2 has load 3. Adding 4 makes 7 > 5, so day 3. That takes 3 days, which fails, so lo = 6.',
        'mid = 6: load 1, 3, 6, then adding 4 starts day 2. That takes 2 days, which works, so hi = 6.',
        'lo == hi = 6, so the answer is 6, shipping [1,2,3] and then [4].',
      ],
    },
    complexity: 'O(n log R) time, where R is the search range (here sum - max). O(1) extra space.',
    pitfalls: [
      'Setting lo below max(weights): one package could never fit, and the check quietly loads it anyway.',
      'Using the minimize template to maximize: with lo = mid you need mid = (lo + hi + 1) // 2, or the loop never ends.',
      'Resetting load to 0 when a package overflows and then skipping it: the current package must start the new day\'s load.',
      'In C++, letting sums overflow int: LC 1482, LC 2187 and LC 2861 all need 64-bit values.',
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
    practice: [875, 1011, 1482, 1552, 410],
  },

  '11. Greedy Counting / Frequency': {
    crux: 'Counter + a rule keyed on max frequency (or "last seen index" for partitioning).',
    signals: [
      '"Each letter appears in at most one part": record each letter\'s last position.',
      '"Same task must wait n intervals" or "no two adjacent equal": the most frequent item decides feasibility.',
      '"Remove the fewest elements" so that the unique count or set size hits a target: count, sort the counts, take from one end.',
      '"Groups of k consecutive cards": count values and consume from the smallest.',
    ],
    notThis: [
      'A fixed-size window over a string, as in Find All Anagrams in a String (LC 438): the counts slide, so use a sliding window.',
      'Which items you pick changes later options, as in Minimum Deletions variants with costs: when each deletion has a price, compare with DP.',
    ],
    concepts: [
      'Partition Labels: precompute last[c]; extend partition end = max(end, last[c]) until i == end.',
      'Task Scheduler with cooldown k: answer = max(n, (max_freq - 1) * (k + 1) + count_of_max).',
      'Min Deletions for Unique Frequencies: decrement collisions; greedy walks frequencies downward.',
    ],
    example: {
      problem: 'Partition Labels with s = "abaccd"',
      lc: 763,
      walkthrough: [
        'Last positions: a = 2, b = 1, c = 4, d = 5. Start with start = 0 and end = 0.',
        'i = 0 (a): end = 2. i = 1 (b): end stays 2.',
        'i = 2 (a): end stays 2 and i == end, so close a part of size 3. start = 3.',
        'i = 3 (c): end = 4. i = 4 (c): i == end, so close a part of size 2. start = 5.',
        'i = 5 (d): end = 5 and i == end, so close a part of size 1. The answer is [3,2,1].',
      ],
    },
    complexity: 'O(n) time for counting, and O(k) space for k distinct values. Sorting the counts adds O(k log k).',
    pitfalls: [
      'Closing a partition before reaching end: a letter inside the part can push the boundary further out.',
      'Using the count-based Task Scheduler answer without max(n, ...): it undercounts when no idling is needed.',
      'In Minimum Rounds (LC 2244), missing that a count of 1 is impossible, so return -1.',
      'In Hand of Straights (LC 846), starting a group anywhere other than the smallest remaining card.',
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
    practice: [1481, 1338, 763, 1647, 621],
    snippet: '20-partition-labels',
  },

  '12. Greedy Digit / Number Construction': {
    crux: 'Walk digits left-to-right (for max) or right-to-left (for monotone fix-up) and patch the first violation with 9s.',
    signals: [
      '"Largest number less than or equal to n" with a digit rule: find the first violation and pad with 9s.',
      '"You can swap two digits at most once" for the largest result: swap an early digit with the largest later one.',
      '"Next greater number using the same digits": find the pivot from the right, as in Next Permutation.',
      '"Remove k digits", or "smallest number" after deleting: earlier digits outweigh later ones, so fix them first.',
    ],
    notThis: [
      'Counting numbers up to n with a digit rule, as in Numbers At Most N Given Digit Set (LC 902): this is counting, so use digit DP.',
      'Exact arithmetic with repeats, as in Fraction to Recurring Decimal (LC 166): do long division and use a hash map of remainders.',
    ],
    concepts: [
      'Monotone Increasing Digits: scan right-to-left, on a drop decrement the left digit and 9-pad to the right.',
      'Maximum Swap: for each digit, swap with the LATEST occurrence of the largest digit to its right.',
      'Next Permutation: find first decreasing pair from the right, swap with the smallest-larger suffix digit, reverse the suffix.',
    ],
    example: {
      problem: 'Monotone Increasing Digits with n = 332',
      lc: 738,
      walkthrough: [
        'd = [3,3,2] and marker = 3.',
        'i = 2: d[1] = 3 > d[2] = 2, so d[1] becomes 2 and marker = 2. Now d = [3,2,2].',
        'i = 1: d[0] = 3 > d[1] = 2, so d[0] becomes 2 and marker = 1. Now d = [2,2,2].',
        'Fill from marker to the end with 9s: d = [2,9,9].',
        'The answer is 299.',
      ],
    },
    complexity: 'O(d) time and O(d) space for d digits, plus any sort for reordering problems like Largest Number.',
    pitfalls: [
      'Scanning Monotone Increasing Digits left to right: a decrement can create a new violation to its left, as in 332.',
      'Forgetting a leading zero: 10 becomes "09", so convert back to an integer.',
      'In Maximum Swap (LC 670), using the first occurrence of the max: 1993 needs the last 9 to reach 9913, not 9193.',
      'In Next Greater Element III (LC 556), not checking that the result fits in 32 bits, which must return -1.',
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
    practice: [66, 738, 670, 31, 402],
    snippet: '18-greedy-with-monotonic-stack-remove-k-digits',
  },

  '13. Greedy Partitioning / Splitting': {
    crux: 'Extend the current partition until a closing condition is forced; then start a new one.',
    signals: [
      '"Split into the maximum number of parts" or "fewest substrings" under a local rule: close a part only when forced, or as soon as allowed.',
      '"Each part has unique characters" or "value at most k": extend until the next element breaks the rule.',
      '"Balanced strings" or "equal sum parts": a running count hits a target that marks a cut.',
    ],
    notThis: [
      'Each part has a cost tied to its contents, as in Minimum Cost to Split an Array (LC 2547): one early cut can cost more later, so use DP.',
      'Part value depends on a max across the part, as in Partition Array for Maximum Sum (LC 1043): try every part length with DP.',
      'Cuts are scored in pairs, as in Put Marbles in Bags (LC 2551): sort the adjacent pair sums rather than scan.',
    ],
    concepts: [
      'Partition Labels: close when i reaches max last-seen.',
      'Optimal Partition of String: close when adding the next char would introduce a duplicate.',
      'Split Array Largest Sum: when paired with binary search, the greedy "extend until > cap, then close" packs optimally.',
    ],
    example: {
      problem: 'Optimal Partition of String with s = "abacaba"',
      lc: 2405,
      walkthrough: [
        'Start with count = 1 and an empty set.',
        'a and b are new, so seen = {a, b}.',
        'a is a repeat, so count = 2 and seen = {a}. c is new, so seen = {a, c}.',
        'a is a repeat, so count = 3 and seen = {a}. b is new, so seen = {a, b}.',
        'a is a repeat, so count = 4 and seen = {a}. The answer is 4: "ab", "ac", "ab", "a".',
      ],
    },
    complexity: 'O(n) time and O(alphabet) space for the scan. With binary search on top, as in LC 410: O(n log R).',
    pitfalls: [
      'Starting count at 0: the first part exists before any cut, so count starts at 1.',
      'Clearing the set on a cut without adding the current character: it belongs to the new part.',
      'In LC 2522, not returning -1 when a single digit already exceeds k.',
      'In LC 1013, stopping at exactly three cuts: with sum 0, as in [0,0,0,0], count at least three parts instead.',
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
    practice: [1221, 1013, 2405, 763, 410],
    snippet: '20-partition-labels',
  },

  '14. Greedy with Math / Geometry': {
    crux: 'Find an invariant — parity, median, GCD, perfect-square count — and let it drive the choice.',
    signals: [
      '"Double or subtract 1" in the fewest steps: work backwards from the target.',
      '"Every i-th bulb is toggled" or "after n rounds": find the rule by counting divisors.',
      '"Minimum moves to make all elements equal" with +1 and -1: the median minimizes the total.',
      '"Moving by 2 is free": only parity matters, so count odd and even positions.',
    ],
    notThis: [
      'The geometry needs real enumeration, as in Max Points on a Line (LC 149): count slopes from each point with a hash map, since no local choice exists.',
      'Multiple operation sequences must be compared, as in Coin Change (LC 322): this needs DP unless the coin system is canonical.',
    ],
    concepts: [
      'Median minimizes Σ|x - m| (the L1 optimal point).',
      'Bulb Switcher: a bulb ends ON iff it has an odd number of divisors iff it is a perfect square.',
      'Broken Calculator: work BACKWARD from target — halving when even is strictly better than doubling many times.',
    ],
    example: {
      problem: 'Broken Calculator with startValue = 3 and target = 10',
      lc: 991,
      walkthrough: [
        'target = 10 is even, so halve it to 5. ops = 1.',
        'target = 5 is odd, so add 1 to get 6. ops = 2.',
        'target = 6 is even, so halve it to 3. ops = 3.',
        'target = 3 is no longer above start, so stop. Add start - target = 0, and the answer is 3.',
      ],
    },
    complexity: 'O(log target) time and O(1) space for Broken Calculator. Median problems take O(n log n) with a sort.',
    pitfalls: [
      'Searching forward from start in LC 991: the reverse direction has a forced move at every step.',
      'Forgetting the case where start > target: the loop never runs, and the answer is just start - target.',
      'Using the mean in LC 462: the median is the right center for absolute differences.',
      'In Bulb Switcher (LC 319), simulating the rounds: n can reach 10^9, and the answer is floor(sqrt(n)).',
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
    practice: [1217, 1518, 462, 991, 319],
  },

  '15. Greedy + Stack (Monotonic Stack Greedy)': {
    crux: 'Maintain a monotonic stack; pop when the top is worse than the incoming element under the chosen ordering.',
    signals: [
      '"Next greater" or "next smaller" element: finalize answers as a stack pops.',
      '"Remove k digits", or "subsequence of size k" that is most competitive: pop worse earlier picks.',
      '"Asteroids collide" or "cars merge into a fleet": the stack holds the survivors so far.',
      '"Find i < j < k with a pattern", as in 132 Pattern: a stack keeps the best candidate for the middle.',
    ],
    notThis: [
      'The maximum of each fixed window, as in Sliding Window Maximum (LC 239): items also leave from the front, so use a deque.',
      'Pairs may be anywhere, with no "nearest" meaning: if nearness isn\'t part of the question, a monotonic stack won\'t help.',
    ],
    concepts: [
      'Decreasing stack ⇒ each pop computes a "next greater" answer; increasing stack ⇒ "next smaller".',
      'Remove K Digits and Most Competitive Subsequence: same monotonic-stack template, just different budget logic.',
      'Asteroid Collision / Car Fleet: the stack tracks survivors after pairwise greedy resolution.',
    ],
    example: {
      problem: 'Next greater value for each index, with nums = [2,1,3,0]',
      walkthrough: [
        'i = 0, x = 2: the stack is empty, so push index 0.',
        'i = 1, x = 1: nums[0] = 2 isn\'t smaller, so push index 1.',
        'i = 2, x = 3: pop index 1, so ans[1] = 3. Pop index 0, so ans[0] = 3. Push index 2.',
        'i = 3, x = 0: nums[2] = 3 isn\'t smaller, so push index 3.',
        'Indices 2 and 3 stay on the stack and keep -1. The answer is [3,3,-1,-1].',
      ],
    },
    complexity: 'O(n) time, since each index is pushed and popped at most once. O(n) space for the stack.',
    pitfalls: [
      'Storing values rather than indices when you need to write into an answer array.',
      'Mixing `<` and `<=`: on duplicates this decides whether "next greater" means strictly greater.',
      'In Asteroid Collision (LC 735), missing that equal sizes destroy both asteroids.',
      'In Car Fleet (LC 853), comparing arrival times with integer division: use a float or cross-multiply.',
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
    practice: [402, 735, 1673, 853, 321],
    snippet: '18-greedy-with-monotonic-stack-remove-k-digits',
  },

  '16. Greedy Bit Manipulation': {
    crux: 'Process bits from the MOST significant; greedily set the current bit if a valid completion still exists.',
    signals: [
      '"Maximum XOR of two numbers": try to set each bit from the top.',
      '"Interpret each row as a binary number" and maximize the score: the highest bit outweighs all lower ones.',
      '"Minimum flips" so that a OR b equals c, or to reach a target: count per bit.',
      '"Multiply by 2 at most k times" to maximize the OR: put every doubling on one element.',
    ],
    notThis: [
      'Longest subarray with the maximum AND, as in LC 2419: AND can\'t exceed the largest element, so find runs of the max value.',
      'XOR over any subset, not a pair: a pair check won\'t do, so use a linear basis.',
    ],
    concepts: [
      'Maximum XOR: for each bit from MSB, try to set it; check if some pair achieves it (often via a trie).',
      'Score After Flipping Matrix: leftmost column must all be 1 (flip rows to ensure); for each later column, flip to majority-1.',
      'MSB-first greedy works because one MSB is worth more than all lower bits combined.',
    ],
    example: {
      problem: 'Maximum XOR of Two Numbers with nums = [3,10,5]',
      lc: 421,
      walkthrough: [
        'Bits above bit 3 are 0 in all numbers, so they can\'t be set. Start at bit 3 with ans = 0.',
        'Bit 3: prefixes = {0, 8}. Candidate 8 works, since 8 ^ 0 = 8 is in the set. ans = 8.',
        'Bit 2: prefixes = {0, 8, 4}. Candidate 12 works, since 12 ^ 8 = 4 is in the set. ans = 12.',
        'Bit 1: prefixes = {2, 10, 4}. Candidate 14 works, since 14 ^ 10 = 4 is in the set. ans = 14.',
        'Bit 0: prefixes = {3, 10, 5}. Candidate 15 works, since 15 ^ 10 = 5 is in the set. The answer is 15, from 10 ^ 5.',
      ],
    },
    complexity: 'O(B * n) time for B bits, and O(n) space for the prefix set. B is 32 here.',
    pitfalls: [
      'Going from the low bits up: one high bit is worth more than all lower bits together, so the search must start at the top.',
      'In C++, writing `a ^ b == c`: == binds tighter than ^, so add parentheses.',
      'In C++, writing `1 << 31` on a signed int: it overflows, so start at bit 30 for non-negative input.',
      'In LC 2680, splitting doublings across elements: applying all k to one number always does at least as well.',
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
    practice: [2220, 1318, 861, 421, 1888],
  },

  '17. Gas Station / Circular Greedy': {
    crux: 'Reset the start index whenever the running tank goes negative; total≥0 ⇒ that reset point is the unique answer.',
    signals: [
      '"Circular route" and "return the starting index": try the reset-on-negative scan.',
      '"The solution is guaranteed to be unique": a hint that one pass can pin down the start.',
      '"The last element connects back to the first", or "circular array": think about total minus the worst linear part.',
      '"Senators take turns in rounds": each one acts on the nearest opponent, so model it with queues.',
    ],
    notThis: [
      'Candy (LC 135) sits in this list, but its row isn\'t circular, so use two passes from section 19.',
      'A fixed-size circular window, as in Minimum Swaps to Group All 1\'s Together II (LC 2134): count ones in a sliding window over the doubled array.',
      'Josephus elimination has a known recurrence: J(n) = (J(n-1) + k) % n, with no choice to make.',
    ],
    concepts: [
      'Gas Station: one pass; track tank and total; if tank dips below 0, reset start = i+1, tank = 0.',
      'Candy: two passes (left-then-right) and take max — a constant-time-per-element greedy.',
      'Circular subarrays: max circular sum = max(linear Kadane, total - min subarray) with an all-negative edge case.',
    ],
    example: {
      problem: 'Gas Station with gas = [1,2,3,4,5] and cost = [3,4,5,1,2]',
      lc: 134,
      walkthrough: [
        'i = 0: diff = -2, total = -2, tank = -2. The tank is negative, so start = 1 and tank = 0.',
        'i = 1: diff = -2, total = -4, tank = -2. So start = 2 and tank = 0.',
        'i = 2: diff = -2, total = -6, tank = -2. So start = 3 and tank = 0.',
        'i = 3: diff = 3, total = -3, tank = 3.',
        'i = 4: diff = 3, total = 0, tank = 6.',
        'total >= 0, so the answer is start = 3.',
      ],
    },
    complexity: 'O(n) time and O(1) space. Doing the scan once is enough: no need to loop the array twice.',
    pitfalls: [
      'Returning start without checking total: a negative total means no start works, so return -1.',
      'Restarting at start + 1 instead of i + 1: every station up to i fails as well, and the retries make it O(n^2).',
      'In LC 918, using total - min when all values are negative: that gives 0 for an empty subarray, so return the Kadane max.',
      'In Can Place Flowers (LC 605), forgetting the ends: a missing neighbor counts as empty.',
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
    practice: [605, 134, 918, 649, 135],
    snippet: '8-gas-station',
  },

  '18. Greedy Matrix / Grid': {
    crux: 'Fix the highest-value row/column first, then sweep remaining rows/columns greedily.',
    signals: [
      '"Toggle any row or column" and "interpret each row as a binary number": fix the highest-value column first.',
      '"Make every row and column palindromic" with fewest flips: mirrored cells form groups, and you decide each group.',
      '"In place" or "O(1) extra space" on a matrix: reuse the first row and column, or encode two states in one cell.',
      '"Beams between non-empty rows": the grid reduces to a count per row.',
    ],
    notThis: [
      'Moving through cells for a shortest or cheapest route, as in Minimum Path Sum (LC 64): earlier cells limit later choices, so use DP or BFS.',
      'Spiral Matrix (LC 54) and Rotate Image (LC 48) sit in this list, but they are pure simulation with no choice to make.',
    ],
    concepts: [
      'Score After Flipping Matrix: ensure column 0 is all 1s (flip rows as needed); then for each later column, flip if it has more 0s than 1s.',
      'Each column contributes 2^(cols - col - 1) — leftmost columns dominate, so prioritize them.',
      'Many grid greedy problems are "set the most valuable bit/cell first" in disguise.',
    ],
    example: {
      problem: 'Score After Flipping Matrix with grid = [[0,0,1],[1,0,0]]',
      lc: 861,
      walkthrough: [
        'Row 0 starts with 0, so flip it to [1,1,0]. Row 1 already starts with 1. Column values are 4, 2 and 1.',
        'Column 0: 2 ones out of 2, so it adds 2 * 4 = 8.',
        'Column 1: 1 one out of 2, so max(1, 1) = 1 adds 1 * 2 = 2.',
        'Column 2: 0 ones out of 2, so flipping gives max(0, 2) = 2, which adds 2 * 1 = 2.',
        'The answer is 8 + 2 + 2 = 12, which matches rows 111 and 101: 7 + 5.',
      ],
    },
    complexity: 'O(R * C) time and O(1) extra space.',
    pitfalls: [
      'Comparing rows as whole values rather than fixing column 0 first: the top bit outweighs all the others.',
      'Actually flipping each column: max(ones, R - ones) already gives the better count.',
      'In Game of Life (LC 289), updating cells as you read them: encode old and new states so neighbors see the old one.',
      'In Set Matrix Zeroes (LC 73), using row 0 and column 0 as markers without separately noting whether they had zeros.',
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
    practice: [2125, 48, 54, 73, 861],
  },

  '19. Greedy Two-Pass / Multi-Pass': {
    crux: 'Enforce one constraint left-to-right, the other right-to-left, then combine (max/min/sum).',
    signals: [
      '"Higher rating than its neighbors": left and right constraints, so run a pass in each direction.',
      '"Product of all elements except self" or "without division": combine a prefix and a suffix.',
      '"Water above each bar": the answer depends on the tallest bar on both sides.',
      '"Answer for i depends on everything to its left and everything to its right": precompute each side.',
    ],
    notThis: [
      'Each index has a choice with two states, as in Minimum Swaps to Make Sequences Increasing (LC 801): use DP on swap or no swap.',
      'Only one direction matters, as in Minimum Number of Increments on Subarrays (LC 1526): one pass that adds the positive differences is enough.',
    ],
    concepts: [
      'Candy: left pass enforces "if r[i] > r[i-1] then c[i] > c[i-1]"; right pass enforces the mirror; answer = sum(max(L,R)).',
      'Trapping Rain Water: left-max[i] and right-max[i]; water at i = min(L,R) - h[i].',
      'Product Except Self: prefix product and suffix product, multiplied at each index.',
    ],
    example: {
      problem: 'Candy with ratings = [1,0,2]',
      lc: 135,
      walkthrough: [
        'Start with L = [1,1,1] and R = [1,1,1].',
        'Left pass: i = 1 has 0 < 1, so L[1] stays 1. i = 2 has 2 > 0, so L[2] = 2. L = [1,1,2].',
        'Right pass: i = 1 has 0 < 2, so R[1] stays 1. i = 0 has 1 > 0, so R[0] = 2. R = [2,1,1].',
        'Take the max at each index: 2, 1 and 2.',
        'The answer is 2 + 1 + 2 = 5.',
      ],
    },
    complexity: 'O(n) time and O(n) space for the two arrays. Some problems reduce the space to O(1), as in Trapping Rain Water with two pointers.',
    pitfalls: [
      'Running only one pass: [3,2,1] needs the right pass, since the left pass gives everyone 1.',
      'Taking the sum of both passes instead of the max: one candy count must satisfy both sides at once.',
      'Treating equal ratings as a rule: neighbors with the same rating may have different candy, so don\'t copy the value.',
      'In a one-array version, assigning candy[i] = candy[i+1] + 1 in the right pass, which erases the left pass result. Use max().',
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
    practice: [121, 238, 484, 135, 42],
    snippet: '11-candy-distribution',
  },

  '20. Huffman / Optimal Encoding Greedy': {
    crux: 'Repeatedly combine the two cheapest items via a min-heap; cost accumulates on each merge.',
    signals: [
      '"Connect ropes or sticks", where each merge costs the sum: always merge the two smallest.',
      '"Minimum total cost to merge" with free choice of what to merge: a min-heap fits.',
      '"Assign shorter codes to more frequent symbols": this is exactly Huffman.',
      'An item is paid for again every time it is merged, so frequently paid items should come in last.',
    ],
    notThis: [
      'Only adjacent piles can merge, as in Minimum Cost to Merge Stones (LC 1000): position matters, so use interval DP.',
      'Packing into sessions of a fixed capacity, as in Minimum Number of Work Sessions (LC 1986): despite the name it is not a merge cost, so use bitmask DP.',
      'Reduce Array Size to The Half (LC 1338) sits in this list, but you remove the most frequent values first, with no merging.',
    ],
    concepts: [
      'Min-cost to connect sticks is textbook Huffman: pop two smallest, push their sum, add to cost.',
      'Total Huffman cost = sum of all INTERNAL node weights of the merge tree.',
      'Generalizes to k-way merges via padding with zero-weight elements until size ≡ 1 (mod k-1).',
    ],
    example: {
      problem: 'Minimum Cost to Connect Sticks with sticks = [2,4,3]',
      lc: 1167,
      walkthrough: [
        'Heapify the sticks into {2, 3, 4}, with cost = 0.',
        'Pop 2 and 3: cost = 5. Push 5, so the heap holds {4, 5}.',
        'Pop 4 and 5: cost = 5 + 9 = 14. Push 9, so the heap holds {9}.',
        'One stick is left, so the answer is 14.',
      ],
    },
    complexity: 'O(n log n) time for n-1 merges, each with heap operations. O(n) space, or O(1) extra if you heapify in place.',
    pitfalls: [
      'Returning the last merged size rather than the running total: that is just the sum of all sticks.',
      'Sorting once and merging from the front without a heap: a merged stick may belong in the middle of the order.',
      'Mishandling a single stick: no merge happens, and the cost is 0.',
      'Using int for the cost in C++: repeated merges can overflow, so use long long.',
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
    practice: [1338, 1167, 1000],
    snippet: '15-huffman-coding-combine-smallest-first',
  },

  '21. Exchange Argument Greedy (Proof Pattern)': {
    crux: 'Prove correctness by showing any "out-of-order" adjacent pair in an optimal solution can be swapped to match greedy without worsening the result.',
    signals: [
      '"Arrange them so that they form the largest number": compare pairs by which order wins.',
      '"Send exactly n people to each city": sort by the difference between the two costs.',
      '"Reconstruct the queue" from heights and counts: place the tallest first, then insert by count.',
      'A task with a pair of attributes and "any order is allowed": test which of two neighbors should go first.',
    ],
    notThis: [
      'A subset under a capacity, as in 0/1 knapsack: with W = 50 and (value, weight) pairs (60,10), (100,20), (120,30), ratio order gives 160 but the best is 220, so use DP.',
      'Settling debts with the fewest transfers, as in Optimal Account Balancing (LC 465): no pairwise swap settles it, so use backtracking or bitmask DP.',
    ],
    concepts: [
      'Largest Number: sort by comparator (a+b > b+a) — the swap argument shows local order ⇒ global order.',
      'Hire K Workers: sort by wage/quality ratio — fixing the ratio fixes the "captain" and the rest is a heap.',
      'The proof is the design: if you can prove an exchange does not worsen the optimum, the greedy is correct.',
    ],
    example: {
      problem: 'Largest Number with nums = [3,30,34]',
      lc: 179,
      walkthrough: [
        'Convert to strings: "3", "30", "34".',
        'Compare "3" and "30": "330" > "303", so "3" goes first.',
        'Compare "3" and "34": "334" < "343", so "34" goes first.',
        'Compare "30" and "34": "3034" < "3430", so "34" goes first. The order is "34", "3", "30".',
        'Join them to get "34330". It doesn\'t start with 0, so that is the answer.',
      ],
    },
    complexity: 'O(n log n * L) time, since each comparison concatenates strings of length L. O(n * L) space for the strings.',
    pitfalls: [
      'Comparing numbers or plain strings: "3" vs "30" needs concatenation, since neither direct order gets it right.',
      'Returning "000" for all zeros: strip leading zeros, or check the first element after sorting, and return "0".',
      'Writing a C++ comparator with `>=` on equal concatenations: it must be a strict ordering.',
      'Assuming a good adjacent swap proves the order: the comparator must also be transitive for the sort to be valid.',
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
    practice: [1029, 406, 179, 857, 630],
    snippet: '24-greedy-with-sorting-by-custom-comparator',
  },

  '22. Greedy + Union-Find': {
    crux: 'Sort edges or operations by cost/time, then process in order while a DSU tracks connectivity.',
    signals: [
      '"Minimum cost to connect all..." with an edge list or points: sort edges and union.',
      '"Is there a path using only edges with weight below limit?" across many queries: sort queries and edges together.',
      '"Earliest time" or "smallest t so that they are connected": add edges or cells in order of value until it connects.',
      '"Remove the maximum number of edges" and keep it traversable: add the shared edges first.',
    ],
    notThis: [
      'Minimizing the sum along a route, as in Network Delay Time (LC 743): union-find only tracks connectivity, so use Dijkstra.',
      'Edges are removed online with no way to reorder: a plain DSU can\'t split sets, so process in reverse if the input can be read offline.',
    ],
    concepts: [
      'Kruskal\'s MST: sort edges, union non-cyclic ones — exactly n-1 unions occur.',
      'Edge-length-limited path queries: sort queries AND edges by limit; process queries in order, adding edges as the limit grows (offline trick).',
      'Swim in Rising Water / Path in Threshold Grid: sort cells by value; union neighbors as cells "appear".',
    ],
    example: {
      problem: 'Min Cost to Connect All Points with points = [[0,0],[2,2],[3,3]]',
      lc: 1584,
      walkthrough: [
        'Distances: (1,2) = 2, (0,1) = 4, (0,2) = 6. Sorted, that gives this order.',
        'Edge (1,2) with weight 2: union succeeds, so cost = 2 and picked = 1.',
        'Edge (0,1) with weight 4: union succeeds, so cost = 6 and picked = 2.',
        'picked == n - 1, so stop before reaching (0,2). The answer is 6.',
      ],
    },
    complexity: 'For n points, n^2 edges cost O(n^2 log n) time and O(n^2) space. Each DSU operation is nearly O(1) with path compression and union by rank.',
    pitfalls: [
      'Writing union without a return value: the code above needs it to return True only when two sets actually merged.',
      'Sorting queries and losing their order: keep each query\'s original index, as LC 1697 expects answers in input order.',
      'In LC 1697, adding edges with weight equal to the limit: the paths must be strictly less than limit.',
      'In LC 1319, not checking for at least n-1 edges first: with fewer cables, the answer is -1.',
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
    practice: [684, 1319, 721, 1584, 1697],
  },

  '23. Greedy Subsequence Selection': {
    crux: 'Build "best so far" piles via patience sorting; bisect to place each element.',
    signals: [
      '"Longest strictly increasing subsequence", with n up to 10^5: O(n^2) DP is too slow, so keep tails with binary search.',
      '"Fit one envelope inside another" with two dimensions: sort one, then run LIS on the other.',
      '"Longest course or chain up to each position": read the tails position as an answer at each index.',
      '"Is s a subsequence of t?": match characters as early as possible.',
    ],
    notThis: [
      'You must list the sequence or count them all, as in Number of Longest Increasing Subsequence (LC 673): tails only gives the length, so use DP.',
      'Contiguous pieces, as in Longest Continuous Increasing Subsequence (LC 674): a subarray needs a simple scan, not tails.',
      'The next link depends on word content, as in Longest String Chain (LC 1048): sort by length and use DP with a hash map.',
    ],
    concepts: [
      'LIS in O(n log n): keep `tails`; for each x, replace the first tails[i] ≥ x (or append).',
      'tails is NOT the actual LIS — but its LENGTH equals the LIS length.',
      'Russian Doll Envelopes: sort by width asc, height DESC (to prevent same-width chaining), then LIS on heights.',
    ],
    example: {
      problem: 'Longest Increasing Subsequence with nums = [4,5,1,6]',
      lc: 300,
      walkthrough: [
        'x = 4: the list is empty, so append. tails = [4].',
        'x = 5: it is past the end, so append. tails = [4,5].',
        'x = 1: bisect_left gives 0, so replace. tails = [1,5].',
        'x = 6: it is past the end, so append. tails = [1,5,6].',
        'The answer is 3. Note that [1,5,6] isn\'t a real subsequence: the actual one is [4,5,6], and only the length carries over.',
      ],
    },
    complexity: 'O(n log n) time and O(n) space for tails.',
    pitfalls: [
      'Using bisect_right for strictly increasing: duplicates would extend the length. LC 1964 is non-decreasing, so there it is correct.',
      'Reading tails as the answer sequence: it is only a record of the smallest ending values for each length.',
      'In Russian Doll Envelopes (LC 354), sorting equal widths by ascending height: same-width envelopes would chain together.',
      'In LC 1713, running LIS without the mapping: first convert values to their index in target, and drop any not present.',
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
    practice: [392, 944, 300, 646, 354],
  },

  '24. Greedy Water / Resource Distribution': {
    crux: 'Two pointers from outside in; the weaker boundary moves because it cannot improve while paired with anything.',
    signals: [
      '"How much water can it trap?" over an elevation map: each bar\'s water depends on the lower of its two side maxima.',
      '"Two lines that together hold the most water": the shorter one caps the area.',
      '"Height map" on a grid, with water trapped in 3D: expand from the boundary with a min-heap.',
      '"Minimum moves to spread coins evenly over a tree": excess flows across each edge.',
    ],
    notThis: [
      'Pour Water (LC 755) simulates each drop with a direction rule, with no pair of boundaries to compare.',
      'Distribute Candies (LC 575) and Water Bottles (LC 1518) are direct formulas despite the names: min(n/2, kinds), and a repeated exchange.',
      'Capacities along paths and a maximum total, as in true flow problems: use max flow, since local choices can block later ones.',
    ],
    concepts: [
      'Container With Most Water: shorter wall caps area, so move it.',
      'Trapping Rain Water: at each step, the side with the smaller max can finalize its water (water = its_max - h).',
      'Trapping Rain Water II (3D): min-heap of boundary cells — always pop the shortest wall (the limiting factor).',
    ],
    example: {
      problem: 'Trapping Rain Water with h = [0,2,0,3,1,2]',
      lc: 42,
      walkthrough: [
        'l = 0, r = 5: 0 < 2, so lmax = 0 and water += 0. Move l to 1.',
        'l = 1, r = 5: 2 < 2 is false, so rmax = 2 and water += 0. Move r to 4.',
        'l = 1, r = 4: 2 < 1 is false, so rmax stays 2 and water += 2 - 1 = 1. Move r to 3.',
        'l = 1, r = 3: 2 < 3, so lmax = 2 and water += 0. Move l to 2.',
        'l = 2, r = 3: 0 < 3, so lmax stays 2 and water += 2 - 0 = 2, making 3. Move l to 3.',
        'l == r ends the loop, so the answer is 3.',
      ],
    },
    complexity: 'O(n) time and O(1) space with two pointers. Trapping Rain Water II takes O(mn log(mn)) time and O(mn) space.',
    pitfalls: [
      'Subtracting before updating the max: update lmax or rmax first, so water at a bar is never negative.',
      'Moving the side with the larger height: its water isn\'t settled yet, since only the smaller side has a known limit.',
      'Using two pointers on a 2D map: water can escape in four directions, so LC 407 needs the boundary heap.',
      'In LC 407, not pushing max(wall, neighbor height) when expanding: a low neighbor still sits behind the taller wall.',
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
    practice: [575, 1518, 11, 134, 42],
  },

  '25. Advanced / Contest-Level Greedy': {
    crux: 'Identify which canonical lens applies: regret heap, exchange argument, binary-search-the-answer, or two-pass.',
    signals: [
      '"Minimum number of patches so that every number in [1, n] can be formed": keep the smallest sum you can\'t reach.',
      '"Maximize sum times minimum, choosing up to k": sort by one factor and keep a heap on the other.',
      '"Reduce to the original by reversing operations", as in Stamping The Sequence: work backwards from the final state.',
      'n up to 10^5 and a hard rating, where DP would be too slow: try each lens in turn, such as regret heap, exchange, binary search or two passes.',
    ],
    notThis: [
      'Sorting makes the order fixed, but costs interact, as in Minimum Total Distance Traveled (LC 2463): use DP on the sorted lists.',
      'The set of reachable rewards matters, as in Maximum Total Reward Using Operations (LC 3181): after sorting, use a DP or bitset over sums.',
      'A small counterexample beats your rule: stop patching the greedy and switch to DP.',
    ],
    concepts: [
      'Most "advanced" greedy problems are a composition: e.g., binary search the answer + greedy feasibility + heap for the inner check.',
      'Patching Array: maintain reachable [1, miss); if next num > miss, patch with miss itself.',
      'When greedy seems to fail, check: is the comparator non-transitive? does a "future cost" make a local choice non-optimal? if yes, DP.',
    ],
    example: {
      problem: 'Patching Array with nums = [1,3] and n = 6',
      lc: 330,
      walkthrough: [
        'Start with miss = 1, so nothing can yet be formed, and patches = 0.',
        'nums[0] = 1 <= 1, so use it: miss = 2 and i = 1.',
        'nums[1] = 3 > 2, so 2 can\'t be formed. Patch with 2: miss = 4 and patches = 1.',
        'nums[1] = 3 <= 4, so use it: miss = 7 and i = 2.',
        'miss = 7 > 6 ends the loop, so the answer is 1 patch.',
      ],
    },
    complexity: 'Patching Array takes O(len(nums) + log n) time and O(1) space. Other problems here vary, usually O(n log n) with a sort or heap.',
    pitfalls: [
      'Letting miss overflow in C++: it can double past n near the limit of int, so use long long.',
      'Patching with something other than miss: miss itself extends the range the most without leaving a gap.',
      'Trusting a rule because it passed the samples: test it against a brute force on small inputs before relying on it.',
      'In LC 2366, scanning left to right: the last element can only shrink by splitting earlier ones, so go right to left.',
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
    practice: [135, 502, 330, 857, 2141],
  },
}
