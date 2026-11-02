// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const arrays = {
  '1. Two Pointers (Opposite Direction)': {
    crux: 'On sorted or ends-matter input, each comparison lets you throw away one end for good, so one pass replaces the nested loop.',
    signals: [
      '"Input array is sorted" plus "find a pair that sums to target": move the end that makes the sum wrong.',
      '"Container", "maximum area between two lines": the shorter side limits the area, so move it.',
      '"Return all unique triplets" or "closest to target": sort, fix one number, run the pair scan on the rest.',
      '"In-place", "reverse", "palindrome": compare or swap from both ends and walk inward.',
      '"Each boat carries at most two people": pair the heaviest remaining with the lightest remaining.',
    ],
    notThis: [
      'The input is unsorted and you must return original indices, as in Two Sum (LC 1): sorting loses the indices, so use a hash map.',
      'You need a contiguous range rather than two separate positions, as in Minimum Size Subarray Sum (LC 209): both pointers move the same way, so use a sliding window.',
    ],
    concepts: [
      'The discard argument: if a[l] + a[r] is too small, a[l] paired with anything left of r is smaller still, so l can never be part of an answer.',
      'k-Sum reduces to pair scan: sort, then fix k-2 numbers with loops and run one pair scan inside. That gives O(n^(k-1)).',
      'Skip duplicates after a match by moving past equal neighbours. Sorting is what puts duplicates side by side.',
      'Greedy pairing (LC 881, 1877): pair the extremes, because the largest item has the fewest possible partners.',
      'Three-way partition (LC 75) keeps low and high boundaries and scans between them.',
    ],
    example: {
      problem: 'Two Sum II with numbers = [1,3,4,6,9], target = 9',
      lc: 167,
      walkthrough: [
        'Start with l = 0 and r = 4.',
        'numbers[0] + numbers[4] = 1 + 9 = 10, which is above 9. Every pair using 9 is at least 10, so r = 3.',
        'numbers[0] + numbers[3] = 1 + 6 = 7, which is below 9. Every pair using 1 is at most 7, so l = 1.',
        'numbers[1] + numbers[3] = 3 + 6 = 9. Found it.',
        'LC 167 uses 1-based indices, so the answer is [2, 4].',
      ],
    },
    code: `l, r = 0, len(numbers) - 1
while l < r:
    total = numbers[l] + numbers[r]
    if total == target:
        answer = [l + 1, r + 1]
        break
    if total < target:
        l += 1
    else:
        r -= 1`,
    complexity: 'O(n) time for a pair scan, plus O(n log n) if you must sort first. O(1) extra space. 3Sum is O(n^2).',
    pitfalls: [
      'Forgetting to sort before the scan: the discard argument only holds on ordered data.',
      'In 3Sum, deduplicating the fixed number with a[i] == a[i+1]: that skips valid triplets such as [-1,-1,2]. Compare with a[i-1].',
      'After a match, moving only one pointer: the same pair value can repeat, so you get duplicates or an endless loop.',
      'Overflow in 4Sum: four values near 10^9 overflow a 32-bit sum, so use a 64-bit one.',
      'Container With Most Water: moving the taller side can never help, because the width shrinks and the height stays capped.',
    ],
    pointsToPonder: [
      'Why does moving the shorter line in LC 11 never skip the best answer?',
      'What exactly breaks in the discard argument if the array has no order?',
      'Trapping Rain Water (LC 42) has no target. What fact lets you settle the smaller side right away?',
    ],
    practice: [977, 167, 11, 15, 42],
    snippet: '1-two-pointers-opposite-direction',
  },

  '2. Two Pointers (Same Direction / Fast-Slow)': {
    crux: 'A slow pointer marks where the kept output ends and a fast pointer reads ahead, so you filter in place without extra memory.',
    signals: [
      '"Remove ... in-place" or "return the new length": slow writes, fast reads.',
      '"Do not allocate extra space for another array": the output fits inside the input as it shrinks.',
      '"Is s a subsequence of t": one pointer per string, and only the matching pointer advances.',
      '"Merge ... into nums1 as one sorted array": two read pointers, filling from the back so nothing is overwritten.',
      '"Find the duplicate" with values in 1..n and no writes allowed: treat values as next-pointers and run Floyd.',
    ],
    notThis: [
      'You must judge a range using a sum or count, as in Longest Substring Without Repeating Characters (LC 3): that is a sliding window, because the left edge shrinks based on window state.',
      'The pointers should approach from both ends, as in Container With Most Water (LC 11): use the opposite-direction scan.',
    ],
    concepts: [
      'Invariant: everything before slow is the finished output, and everything between slow and fast is junk that can be overwritten.',
      'Generalized dedupe: keep a value if it differs from nums[write - k], which allows at most k copies (LC 26 uses k = 1, LC 80 uses k = 2).',
      'Filling from the back (LC 88) stops writes from destroying unread input.',
      'Floyd cycle detection (LC 141, 287): fast moves twice as far as slow. If there is a cycle they must meet inside it.',
    ],
    example: {
      problem: 'Remove Duplicates from Sorted Array with nums = [1,1,2,2,3]',
      lc: 26,
      walkthrough: [
        'Start with write = 1, because the first element is always kept.',
        'read = 1: 1 equals nums[0], so skip it.',
        'read = 2: 2 differs from nums[0] = 1. Write it at index 1, giving [1,2,2,2,3], and write = 2.',
        'read = 3: 2 equals nums[1] = 2, so skip it.',
        'read = 4: 3 differs from nums[1] = 2. Write it at index 2, giving [1,2,3,2,3], and write = 3.',
        'The answer is 3, and the first three elements are [1,2,3]. Anything past them is ignored.',
      ],
    },
    code: `write = 1
for read in range(1, len(nums)):
    if nums[read] != nums[write - 1]:
        nums[write] = nums[read]
        write += 1`,
    complexity: 'O(n) time, because each pointer only moves forward. O(1) extra space.',
    pitfalls: [
      'Comparing with nums[read - 1] after you have already overwritten earlier slots. Comparing with nums[write - 1] is always safe.',
      'Returning the last index rather than the length: write is already the count.',
      'Empty input: write = 1 is wrong when the array can be empty, so guard it where the constraints allow n = 0.',
      'Merge Sorted Array: merging from the front overwrites unread nums1 values. Fill from index m + n - 1 downward.',
      'Move Zeroes: a shortcut that writes zeros while reading can clobber values, so swap or fill the tail afterwards.',
    ],
    pointsToPonder: [
      'Why is the fast pointer never behind the slow pointer, and why does that make the overwrites safe?',
      'How does the "keep at most k copies" rule change if the array is not sorted?',
      'Why does LC 287 count as a linked-list cycle problem when no list appears in it?',
    ],
    practice: [26, 27, 283, 392, 80],
    snippet: '2-two-pointers-same-direction',
  },

  '3. Sliding Window — Fixed Size': {
    crux: 'When the window length is given, slide it one step at a time: add the element entering and remove the element leaving.',
    signals: [
      '"Subarray of length k" or "every k consecutive elements": the size is stated in the problem.',
      '"Find all anagrams" or "does s2 contain a permutation of s1": a window of len(p) with matching letter counts.',
      '"Take k cards from either end": the cards left behind form a fixed window of n - k.',
      '"Maximum in each window of size k": fixed window plus a monotonic deque.',
      '"Within distance k", as in nums[i] == nums[j] and abs(i - j) <= k: keep a set of the last k elements.',
    ],
    notThis: [
      'The length is what you are solving for, as in "smallest subarray with sum at least target" (LC 209): use a variable window.',
      'You want a sum over one arbitrary range per query, as in Range Sum Query (LC 303): prefix sums answer each query in O(1) without sliding.',
    ],
    concepts: [
      'Rolling state: after the first k elements, each step does exactly one add and one remove.',
      'The state need not be a sum. It can be a count array (LC 438), a set (LC 219) or a deque (LC 239).',
      'Complement windows: picking from both ends (LC 1423) is the same as leaving one middle window of size n - k.',
      'Extra-gain windows (LC 1052): compute a base score, then slide a window over the gain each element would add.',
      'Window max needs a monotonic deque (LC 239), and window median needs two heaps or an ordered set (LC 480).',
    ],
    example: {
      problem: 'Maximum Average Subarray I with nums = [1,12,-5,-6,50,3], k = 4',
      lc: 643,
      walkthrough: [
        'The first window is [1,12,-5,-6], with sum 2. So best = 2.',
        'i = 4: add 50 and remove nums[0] = 1, so window = 2 + 50 - 1 = 51. Now best = 51.',
        'i = 5: add 3 and remove nums[1] = 12, so window = 51 + 3 - 12 = 42. best stays 51.',
        'The answer is 51 / 4 = 12.75.',
      ],
    },
    code: `window = sum(nums[:k])
best = window
for i in range(k, len(nums)):
    window += nums[i] - nums[i - k]
    best = max(best, window)
answer = best / k`,
    complexity: 'O(n) time. O(1) extra space for a sum, O(alphabet) for counts, O(k) for a deque or set.',
    pitfalls: [
      'Initializing best = 0: with all-negative values the true best is below 0, so start from the first window.',
      'Off-by-one on the outgoing element: when i enters, the one leaving is nums[i - k], not nums[i - k - 1].',
      'k larger than n: the first-window sum silently covers a shorter range. Check the constraints.',
      'Recomputing the state from scratch for each window: that turns O(n) into O(nk) and misses the point.',
      'Comparing count maps by value when a zero count is left behind: delete keys at zero or use a fixed array.',
    ],
    pointsToPonder: [
      'Why does "take from both ends" turn into a fixed window once you look at what you did not take?',
      'A sum updates in O(1) when an element leaves. Why does a maximum not, and how does a deque fix that?',
      'How would you detect an anagram window in O(1) per step instead of O(26)?',
    ],
    practice: [643, 1456, 1423, 438, 239],
    snippet: '3-sliding-window-fixed-size',
  },

  '4. Sliding Window — Variable Size': {
    crux: 'Grow the right edge, shrink the left edge while the window breaks a rule, and record the answer at the point the rule guarantees.',
    signals: [
      '"Longest substring without repeating characters" or "at most k distinct": longest valid window, so shrink while invalid.',
      '"Smallest subarray with sum at least target": shortest valid window, so shrink while valid.',
      '"If you can flip at most k zeros" or "replace at most k characters": the budget is the rule, and left moves when you overspend it.',
      '"Number of subarrays with exactly k ...": compute atMost(k) - atMost(k - 1).',
      '"Minimum operations to remove from both ends": look for the longest middle window with the complement sum.',
    ],
    notThis: [
      'The array can have negatives and the rule is about a sum, as in Subarray Sum Equals K (LC 560): adding an element may lower the sum, so a window has no safe shrink rule. Use prefix sums with a hash map.',
      'Shortest subarray with sum at least K with negatives (LC 862): keep a monotonic deque over prefix sums.',
      'The elements need not be contiguous, as in Longest Increasing Subsequence (LC 300): windows only cover contiguous ranges, so use DP.',
    ],
    concepts: [
      'Monotonic rule: the window works only if making it smaller never breaks validity (for longest) and making it larger never breaks it (for shortest).',
      'Longest uses "while invalid: shrink; then record". Shortest uses "while valid: record; shrink".',
      'Counting: when every smaller window ending at r is also valid, r adds r - l + 1 subarrays.',
      'atMost(k) - atMost(k - 1) turns "exactly k" into two easy counting windows (LC 992, 1248, 930).',
      'Sort first when values can move, as in LC 1838 and LC 2779: on sorted data the cost of a window is easy to compute.',
    ],
    example: {
      problem: 'Minimum Size Subarray Sum with nums = [2,3,1,2,4,3], target = 7',
      lc: 209,
      walkthrough: [
        'r = 0, 1, 2: total grows to 2, 5, 6. None reach 7.',
        'r = 3: total = 8. Record length 4, remove nums[0] = 2, so total = 6 and l = 1.',
        'r = 4: total = 10. Record length 4, remove 3, so total = 7 and l = 2. It still qualifies: record length 3, remove 1, so total = 6 and l = 3.',
        'r = 5: total = 9. Record length 3, remove 2, so total = 7 and l = 4. It still qualifies: record length 2, remove 4, so total = 3 and l = 5.',
        'The answer is 2, from the subarray [4,3].',
      ],
    },
    code: `l, total, best = 0, 0, inf
for r, x in enumerate(nums):
    total += x
    while total >= target:
        best = min(best, r - l + 1)
        total -= nums[l]
        l += 1
answer = 0 if best == inf else best`,
    complexity: 'O(n) time, because l and r each move at most n times, even with the inner while. O(1) space for sums, O(alphabet or k) for counts.',
    pitfalls: [
      'Using a window on negative numbers with a sum rule: shrinking may raise the sum, so the left edge has no correct move.',
      'Using `if` rather than `while` to shrink: one removal may not restore the rule. Some "longest" tricks use `if` on purpose, but know why.',
      'Recording the answer on the wrong side of the shrink: longest records after it, shortest records inside it.',
      'Forgetting to undo state when shrinking, such as leaving a count key at zero when you test size() on the map.',
      'Returning the sentinel: if no window qualifies in LC 209 the answer is 0, not infinity.',
    ],
    pointsToPonder: [
      'Why does a nested while loop still give O(n) overall?',
      'Why does "exactly k" not have a monotonic shrink rule, while "at most k" does?',
      'In LC 424, why is it fine for the tracked max frequency to go stale when the window shrinks?',
    ],
    practice: [209, 3, 1004, 424, 76],
    snippet: '4-sliding-window-variable-size',
  },

  '5. Prefix Sum': {
    crux: 'Store running totals so that any range sum becomes one subtraction. Then "subarray with property X" becomes "two prefixes with a related value".',
    signals: [
      '"Sum of elements between indices left and right" with many queries: precompute once, then each query is O(1).',
      '"Number of subarrays whose sum equals k", especially with negatives: prefix sums plus a hash map.',
      '"Divisible by k" or "multiple of k": two prefixes with the same remainder bound a valid subarray.',
      '"Left sum equals right sum": total minus the running prefix gives the other side.',
      '"Pick an index with probability proportional to its weight": binary search on the prefix array.',
    ],
    notThis: [
      'Values change between queries, as in Range Sum Query Mutable (LC 307): one update would rewrite O(n) prefixes, so use a Fenwick tree or segment tree.',
      'All values are positive and you want a longest or shortest window, as in LC 209: a sliding window does it with O(1) space.',
      'Updates are ranges and reads happen after them all, as in Car Pooling (LC 1094): that is the reverse trick, a difference array.',
    ],
    concepts: [
      'pref[i] is the sum of the first i elements, so sum(l..r) = pref[r + 1] - pref[l]. The leading 0 removes every special case.',
      'Subarray sum k: prefix[r] - prefix[l] = k, so at each r look up how many earlier prefixes equal prefix[r] - k.',
      'Modular version (LC 974, 523): if two prefixes have the same remainder, the sum between them is divisible by k.',
      'Longest instead of count (LC 325): store the first index of each prefix, not how many times it appeared.',
      'The same idea works for XOR (LC 1310), for counts of a property (LC 2055) and in 2D (LC 304) with inclusion-exclusion.',
    ],
    example: {
      problem: 'Subarray Sum Equals K with nums = [1,2,3,-3], k = 3',
      lc: 560,
      walkthrough: [
        'Start with seen = {0: 1}, because the empty prefix exists, along with total = 0 and answer = 0.',
        'x = 1: total = 1, and total - k = -2 was not seen. Record prefix 1.',
        'x = 2: total = 3, and total - k = 0 was seen once, so answer = 1 (the subarray [1,2]). Record prefix 3.',
        'x = 3: total = 6, and total - k = 3 was seen once, so answer = 2 (the subarray [3]). Record prefix 6.',
        'x = -3: total = 3, and total - k = 0 was seen once, so answer = 3 (the whole array). Prefix 3 now has count 2.',
        'The answer is 3. A sliding window would miss this, because -3 makes the sum go down.',
      ],
    },
    code: `seen = {0: 1}
total = answer = 0
for x in nums:
    total += x
    answer += seen.get(total - k, 0)
    seen[total] = seen.get(total, 0) + 1`,
    complexity: 'O(n) to build, O(1) per range query, O(n) extra space. The hash-map count is O(n) expected time and O(n) space.',
    pitfalls: [
      'Forgetting seen[0] = 1: subarrays that start at index 0 go uncounted.',
      'Inserting the current prefix before the lookup: with k = 0 the element matches itself and counts an empty subarray.',
      'Off-by-one: sum(l..r) is pref[r + 1] - pref[l], not pref[r] - pref[l].',
      'Negative remainders in LC 974: in C++ and Java -1 % 5 is -1, so normalize with ((x % k) + k) % k.',
      'Overflow: use 64-bit prefixes when n is 10^5 and values reach 10^9.',
    ],
    pointsToPonder: [
      'Why must the lookup happen before you insert the current prefix?',
      'What changes in the hash map when the question moves from "how many" to "how long"?',
      'LC 523 needs length at least 2. How does storing the earliest index enforce that?',
    ],
    practice: [1480, 303, 724, 560, 974],
    snippet: '5-prefix-sum',
  },

  '6. Difference Array / Sweep Line': {
    crux: 'Record only where a change starts and stops, then run a prefix sum once to recover every position.',
    signals: [
      '"Add val to every element from i to j" for many ranges, then read the final array: a difference array.',
      '"Trips", "passengers get on at from and off at to": +k at the start and -k at the end.',
      '"Minimum number of meeting rooms" or "maximum number of overlapping": sweep and track the running count.',
      '"How many flowers are in bloom at time t": sorted start and end times, or a sweep with queries.',
      '"Book" repeatedly with "k-booking": a sorted map of +1 and -1 keeps the sweep online (LC 731, 732).',
    ],
    notThis: [
      'Queries and updates are mixed, so reads happen between updates: use a Fenwick tree or lazy segment tree instead of one final prefix pass.',
      'You need to merge or return the intervals themselves, as in Merge Intervals (LC 56): sort by start and merge.',
      'Coordinates reach 10^9 and a plain array will not fit: use a sorted map or compress the coordinates.',
    ],
    concepts: [
      'For a range [l, r], do diff[l] += v and diff[r + 1] -= v. The prefix sum of diff is the final array.',
      'Sweep line: turn each interval into two events and sort them. A running sum is the number of active intervals.',
      'Tie order encodes the rules. At equal times, process ends before starts if a room can be reused immediately.',
      'Half-open intervals: if an interval ends at time r and stops counting at r, place the -v at r, not r + 1. Read the problem to pick.',
      'Skyline (LC 218) sweeps events too, but needs the max of the active heights, so it adds a heap or multiset.',
    ],
    example: {
      problem: 'Corporate Flight Bookings with bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5',
      lc: 1109,
      walkthrough: [
        '[1,2,10]: diff[1] += 10 and diff[3] -= 10.',
        '[2,3,20]: diff[2] += 20 and diff[4] -= 20.',
        '[2,5,25]: diff[2] += 25 and diff[6] -= 25.',
        'For days 1 to 5, diff is now 10, 45, -10, -20, 0.',
        'The running sum gives 10, 55, 45, 25, 25, which is the answer.',
      ],
    },
    code: `diff = [0] * (n + 2)
for first, last, seats in bookings:
    diff[first] += seats
    diff[last + 1] -= seats
answer, running = [], 0
for day in range(1, n + 1):
    running += diff[day]
    answer.append(running)`,
    complexity: 'O(n + q) time and O(n) space for a difference array. A sweep over sorted events is O(q log q) time and O(q) space.',
    pitfalls: [
      'Sizing diff at n when you write to r + 1: index r + 1 can be n, so allocate one more slot, or two for 1-based input.',
      'Car Pooling drops passengers at `to`, so they free the seat at `to` rather than at `to + 1`. Flight bookings include the last day, so they use last + 1.',
      'Sorting events with the wrong tie rule: [1,2] and [2,3] may or may not need two rooms, depending on the tie order.',
      'Reading diff directly: until you run the prefix sum, diff holds changes, not values.',
      'Allocating a giant array when times reach 10^9: use a sorted map of events instead.',
    ],
    pointsToPonder: [
      'Why are prefix sums and difference arrays exact inverses of each other?',
      'LC 1526 has no explicit ranges. How can it be solved by looking only at adjacent differences?',
      'When does a sweep need only a counter, and when does it need a heap of active items?',
    ],
    practice: [1854, 1109, 1094, 253, 732],
    snippet: '10-difference-array-range-updates',
  },

  '7. Hash Map / Counting on Arrays': {
    crux: 'Trade O(n) memory for O(1) lookups, so "have I seen the value I need?" replaces a second loop.',
    signals: [
      '"Return indices of the two numbers" on unsorted input: look up the complement of each value.',
      '"Contains duplicate", "appears at least", "most frequent": a count map.',
      '"Group ... together" such as anagrams: build a canonical key and bucket by it.',
      '"Longest consecutive sequence" in "O(n) time": a set, starting only where x - 1 is absent.',
      '"Within k of each other": map each value to its last index, or keep a set of the last k values.',
    ],
    notThis: [
      'The input is already sorted and you want O(1) space, as in Two Sum II (LC 167): use two pointers.',
      'You need a majority in O(1) space (LC 169): use Boyer-Moore voting.',
      'Values lie in 1..n and extra space is banned (LC 41, 448): use the array itself as the hash map.',
    ],
    concepts: [
      'Complement lookup: scan once and check for target - x before inserting x.',
      'Canonical keys: sorted letters or a count tuple make all members of a group hash the same.',
      'Sets for streaks (LC 128): only start counting from a value with no predecessor, so each streak is walked once.',
      'Frequency to bucket (LC 347): counts are at most n, so bucket by count instead of sorting.',
      'Value to last index (LC 219) and value to first index (LC 697) solve distance and span questions.',
    ],
    example: {
      problem: 'Two Sum with nums = [3,8,5,2], target = 7',
      lc: 1,
      walkthrough: [
        'i = 0, x = 3: we need 4, which is not in seen. Store seen[3] = 0.',
        'i = 1, x = 8: we need -1, which is not in seen. Store seen[8] = 1.',
        'i = 2, x = 5: we need 2, which is not in seen. Store seen[5] = 2.',
        'i = 3, x = 2: we need 5, and seen[5] = 2. The answer is [2, 3].',
      ],
    },
    code: `seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        answer = [seen[target - x], i]
        break
    seen[x] = i`,
    complexity: 'O(n) expected time and O(n) extra space. Building sorted-string keys for grouping adds O(k log k) per word.',
    pitfalls: [
      'Inserting before checking: with target = 6 and x = 3, the element would pair with itself.',
      'Counting a streak from every element in LC 128: that is O(n^2). Start only when x - 1 is absent.',
      'In C++, reading mp[key] to test membership inserts the key. Use count() or find().',
      'Using a mutable list as a key: in Python convert it to a tuple, and in C++ build a string key.',
      'Worst-case hashing: adversarial inputs can make unordered_map degrade badly, which matters on contest judges.',
    ],
    pointsToPonder: [
      'Why does checking before inserting handle duplicates correctly, as in [3,3] with target 6?',
      'LC 128 has a loop inside a loop. Why is the whole thing still O(n)?',
      'When is sorting first a better trade than a hash map?',
    ],
    practice: [1, 217, 219, 128, 347],
    snippet: '6-prefix-sum-hashmap',
  },

  "8. Kadane's Algorithm / Maximum Subarray Variants": {
    crux: 'At each index choose: extend the best subarray ending just before, or start fresh here.',
    signals: [
      '"Largest sum" of a "contiguous subarray": classic Kadane.',
      '"Maximum product subarray": track both max and min, because a negative flips them.',
      '"Circular array": the best wrap-around is the total minus the minimum subarray.',
      '"At most one deletion" or "one operation allowed": two DP states, one before using it and one after.',
      '"Buy on one day and sell on a later day": Kadane over daily differences, or tracking the lowest price so far.',
    ],
    notThis: [
      'The subarray has a fixed length, as in Maximum Average Subarray I (LC 643): use a fixed sliding window.',
      'You need a target sum rather than the largest sum, as in LC 560: use prefix sums with a hash map.',
      'The elements need not be contiguous, as in House Robber (LC 198): this is DP over skip or take choices.',
    ],
    concepts: [
      'State: cur is the best sum of a subarray ending exactly at i. The global answer is the best cur ever seen.',
      'Restart rule: if cur + x is less than x, the prefix is hurting you, so drop it.',
      'Circular (LC 918): the answer is max(normal best, total - min subarray), except when every element is negative.',
      'Products (LC 152): keep cur_max and cur_min, and swap them when x is negative.',
      'Kadane is DP with one state. Adding a state (deleted or not, LC 1186) handles "at most one change" variants.',
    ],
    example: {
      problem: 'Maximum Subarray with nums = [-2,3,-1,2,-4,1]',
      lc: 53,
      walkthrough: [
        'Start with cur = best = -2.',
        'x = 3: max(3, -2 + 3 = 1) = 3, so restart here. cur = 3 and best = 3.',
        'x = -1: max(-1, 3 - 1 = 2) = 2, so extend. cur = 2 and best = 3.',
        'x = 2: max(2, 2 + 2 = 4) = 4, so extend. cur = 4 and best = 4.',
        'x = -4: max(-4, 4 - 4 = 0) = 0, so extend. cur = 0 and best = 4.',
        'x = 1: max(1, 0 + 1 = 1) = 1. cur = 1 and best = 4.',
        'The answer is 4, from [3,-1,2].',
      ],
    },
    code: `cur = best = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)`,
    complexity: 'O(n) time and O(1) extra space.',
    pitfalls: [
      'Initializing best = 0: on [-3,-1] that returns 0, but the subarray must be non-empty, so the answer is -1.',
      'Circular case: if every number is negative, total - min is 0 (an empty array), so return the normal best instead.',
      'Products: tracking only the max misses that two negatives multiply into a new max.',
      'A zero in a product problem resets both trackers, which the max(x, ...) form handles naturally.',
      'Resetting cur to 0 when it goes negative, before updating best: that breaks all-negative input.',
    ],
    pointsToPonder: [
      'Why is it enough to remember one number instead of all subarrays ending at i?',
      'What is the two-state recurrence for LC 1186, and what does each state mean?',
      'How is Best Time to Buy and Sell Stock (LC 121) the same algorithm on a different array?',
    ],
    practice: [121, 53, 152, 918, 1186],
    snippet: '8-kadane-s-algorithm-maximum-subarray-sum',
  },

  '9. In-Place Array Manipulation / Cyclic Sort': {
    crux: 'If values fit the index range, each value already has a home, so swap it there and the array tells you what is missing.',
    signals: [
      '"Numbers in the range [1, n]" or "[0, n]": every value maps to an index.',
      '"Missing", "disappeared", "duplicate" together with "O(1) extra space": put values home and scan for mismatches.',
      '"In-place" with "do not return anything": the input array is your only storage.',
      '"Next lexicographically greater permutation": a fixed sequence of find, swap and reverse.',
      '"Rotate to the right by k steps": three reversals.',
    ],
    notThis: [
      'Values are unbounded, so the index mapping does not fit: use a hash set, or sort.',
      'The input is read-only, as in Find the Duplicate Number (LC 287): you cannot swap, so use Floyd on value-as-pointer or binary search on the value range.',
      'You need a stable order: cyclic sort moves elements far away, so it does not keep the original relative order.',
    ],
    concepts: [
      'Cyclic sort: while nums[i] is in range and its home does not already hold it, swap it home. Every swap places one value for good, so the total is O(n).',
      'After placement, the first index where nums[i] != i + 1 gives the missing value.',
      'Sign marking (LC 448, 442) is the no-swap alternative: negate the slot a value points to, then read the signs.',
      'Encoding two values in one cell (LC 289) stores old and new state at once, using extra bits.',
      'Reversal tricks: rotation is reverse all, then reverse each part. Next permutation ends with reversing a suffix.',
    ],
    example: {
      problem: 'First Missing Positive with nums = [3,4,-1,1]',
      lc: 41,
      walkthrough: [
        'i = 0, v = 3: index 2 holds -1, so swap, giving [-1,4,3,1].',
        'i = 0, v = -1: out of range, so i = 1.',
        'i = 1, v = 4: index 3 holds 1, so swap, giving [-1,1,3,4].',
        'i = 1, v = 1: index 0 holds -1, so swap, giving [1,-1,3,4].',
        'i = 1, v = -1: out of range, so i = 2. Values 3 and 4 are already home, so i runs to 4.',
        'Scan: index 0 holds 1, which is correct. Index 1 holds -1, not 2, so the answer is 2.',
      ],
    },
    code: `n = len(nums)
i = 0
while i < n:
    v = nums[i]
    if 1 <= v <= n and nums[v - 1] != v:
        nums[i], nums[v - 1] = nums[v - 1], nums[i]
    else:
        i += 1
answer = n + 1
for i in range(n):
    if nums[i] != i + 1:
        answer = i + 1
        break`,
    complexity: 'O(n) time, because each swap puts a value home and that happens at most n times. O(1) extra space.',
    pitfalls: [
      'Testing nums[i] != i + 1 rather than nums[v - 1] != v: with duplicates the two slots can hold the same value and the loop never ends.',
      'Advancing i after a swap: the value swapped in has not been placed yet, so stay on i.',
      'Forgetting that the answer can be n + 1 when the array already holds 1..n.',
      'In C++, computing a[i] - 1 before the range check overflows on INT_MIN, so check the range first.',
      'Rotate Array: k can exceed n, so take k %= n first.',
    ],
    pointsToPonder: [
      'Why is the answer to LC 41 always in 1..n + 1, and how does that justify ignoring other values?',
      'Which is better here: swapping or negating? What does each one destroy?',
      'Why do the steps of Next Permutation produce the very next ordering, not just a larger one?',
    ],
    practice: [268, 448, 442, 287, 41],
    snippet: '32-cyclic-sort',
  },

  '10. Matrix Traversal / Spiral / Rotation': {
    crux: 'Keep shrinking boundaries for spirals, and build rotations out of simple moves such as transpose and reverse.',
    signals: [
      '"Return all elements in spiral order": four boundaries that close in.',
      '"Rotate the image by 90 degrees ... in-place": transpose, then reverse each row.',
      '"Elements on the same diagonal": i - j is constant, and i + j is constant on anti-diagonals.',
      '"Integers in each row are sorted" and in each column too: start at the top-right corner and eliminate a row or column per step.',
      '"Set its entire row and column to 0" with O(1) space: use the first row and column as markers.',
    ],
    notThis: [
      'Moves spread out from cells under connectivity rules, as in Number of Islands (LC 200): that is BFS or DFS on a grid.',
      'You need the best path cost through the grid, as in Minimum Path Sum (LC 64): that is grid DP.',
      'You need many submatrix sums, as in LC 304: build a 2D prefix sum instead of traversing.',
    ],
    concepts: [
      'Spiral: walk top row, right column, bottom row, left column, shrinking one boundary after each.',
      'Rotation identities: 90 degrees clockwise is transpose + reverse rows. Counter-clockwise is transpose + reverse columns.',
      'Diagonal grouping: i - j identifies a main diagonal and i + j an anti-diagonal, which covers LC 498, 766 and 1424.',
      'Flattening: cell (r, c) maps to r * cols + c, so a matrix can act as a 1D array (LC 74, 566, 1260).',
      'Staircase search (LC 240): from the top-right, a larger value removes the column and a smaller one removes the row.',
    ],
    example: {
      problem: 'Spiral Matrix with matrix = [[1,2,3],[4,5,6]]',
      lc: 54,
      walkthrough: [
        'Start with top = 0, bottom = 1, left = 0, right = 2.',
        'Top row, left to right: 1, 2, 3. Then top = 1.',
        'Right column, from row 1 to row 1: 6. Then right = 1.',
        'top <= bottom, so read the bottom row from column 1 to column 0: 5, 4. Then bottom = 0.',
        'left <= right, so read the left column from row 0 up to row 1. That range is empty. Then left = 1.',
        'top > bottom, so stop. The answer is [1,2,3,6,5,4].',
      ],
    },
    code: `answer = []
top, bottom = 0, len(matrix) - 1
left, right = 0, len(matrix[0]) - 1
while top <= bottom and left <= right:
    for c in range(left, right + 1):
        answer.append(matrix[top][c])
    top += 1
    for r in range(top, bottom + 1):
        answer.append(matrix[r][right])
    right -= 1
    if top <= bottom:
        for c in range(right, left - 1, -1):
            answer.append(matrix[bottom][c])
        bottom -= 1
    if left <= right:
        for r in range(bottom, top - 1, -1):
            answer.append(matrix[r][left])
        left += 1`,
    complexity: 'O(rows * cols) time for traversal. O(1) extra space beyond the output. Rotation is O(n^2) time and O(1) space. Staircase search is O(rows + cols).',
    pitfalls: [
      'Dropping the inner checks in a spiral: on a single row or column you read the same cells twice.',
      'Mixing up rows and columns on non-square input: spiral and reshape must use both sizes.',
      'Transposing with j from 0 rather than from i + 1: each pair swaps twice and nothing changes.',
      'Set Matrix Zeroes: if the first row and column act as markers, record whether they originally had a zero before you use them.',
      'Game-of-Life-style updates in place: you overwrite values that neighbours still need.',
    ],
    pointsToPonder: [
      'Why do a transpose and a reflection combine into a rotation?',
      'Why does the staircase search need to start at a corner where one direction grows and the other shrinks?',
      'What does r * cols + c make possible for binary search on LC 74?',
    ],
    practice: [867, 54, 48, 73, 240],
    snippet: '50-spiral-matrix',
  },

  '11. Subarray Counting / Contribution Technique': {
    crux: 'Do not list subarrays. Count how many valid ones end at each index, or how many subarrays each element affects.',
    signals: [
      '"Sum of ... over all subarrays" or "of all substrings": ask how much each element contributes.',
      '"Sum of subarray minimums" or "ranges": for each element, count the subarrays where it is the min or max.',
      '"Number of subarrays with exactly k ...": atMost(k) - atMost(k - 1), or prefix sums with a hash map.',
      '"Subarrays where the maximum is between left and right": count by the last position that broke each bound.',
      '"Containing all three characters" or "at least k times": once a window qualifies, every extension to the left does too.',
    ],
    notThis: [
      'You need one best subarray, not a count over all of them, as in Maximum Subarray (LC 53): use Kadane.',
      'The elements need not be contiguous, as in LC 446: "subsequence" counting needs DP.',
      'You only need a yes or no for one target, as in LC 523: prefix remainders are simpler than counting.',
    ],
    concepts: [
      'Total by index: an element at i with L choices of left edge and R choices of right edge is in L * R subarrays.',
      'Monotonic stacks find L and R for min or max problems in O(n).',
      'Break ties on one side only, with > on one pass and >= on the other, so that a subarray with equal minimums is counted once.',
      'Count ending at r: when validity is monotonic, each r adds r - l + 1, which sums to the total.',
      'Last-seen indices (LC 2444, 828) count without a window: for each r, valid starts form a range defined by the last occurrence of each constraint.',
    ],
    example: {
      problem: 'Sum of Subarray Minimums with arr = [3,1,2,4]',
      lc: 907,
      walkthrough: [
        'Left pass, popping values greater than arr[i]: left = [1,2,1,1]. For example 1 pops 3 and can extend across 2 starts.',
        'Right pass, popping values greater than or equal to arr[i]: right = [1,3,2,1]. For example 1 is the min of ranges ending at any of the last 3 positions.',
        '3 contributes 3 * 1 * 1 = 3.',
        '1 contributes 1 * 2 * 3 = 6.',
        '2 contributes 2 * 1 * 2 = 4.',
        '4 contributes 4 * 1 * 1 = 4.',
        'The answer is 3 + 6 + 4 + 4 = 17.',
      ],
    },
    code: `n = len(arr)
left, right, stack = [0] * n, [0] * n, []
for i in range(n):
    while stack and arr[stack[-1]] > arr[i]:
        stack.pop()
    left[i] = i - stack[-1] if stack else i + 1
    stack.append(i)
stack = []
for i in range(n - 1, -1, -1):
    while stack and arr[stack[-1]] >= arr[i]:
        stack.pop()
    right[i] = stack[-1] - i if stack else n - i
    stack.append(i)
answer = sum(arr[i] * left[i] * right[i] for i in range(n))`,
    complexity: 'O(n) time and O(n) space for the stacks. Each index is pushed and popped at most once. Window-based counts need O(1) to O(k) space.',
    pitfalls: [
      'Using strict comparison on both passes: subarrays with equal minimums get counted twice or not at all.',
      'Forgetting the modulus: LC 907 asks for the answer mod 10^9 + 7, and the raw sum overflows 32 bits.',
      'Trying "exactly k" with a single window: it has no monotonic shrink rule.',
      'Off-by-one in widths: L = i - previous and R = next - i, with sentinels at -1 and n.',
      'For ranges (LC 2104), subtracting a contribution for max and min requires both passes with consistent tie rules.',
    ],
    pointsToPonder: [
      'Why is switching the view from "each subarray" to "each element" what removes the n^2?',
      'Why does a tie rule break the double count, and does it matter which side gets the strict comparison?',
      'LC 2281 multiplies min by sum. What second precomputation does that require?',
    ],
    practice: [560, 1248, 795, 907, 992],
    snippet: '31-subarray-minimums-contribution',
  },

  '12. Merge Intervals / Interval Processing': {
    crux: 'Sort by start, and every interval can only overlap the group you are building, so one pass does the merge.',
    signals: [
      '"Merge all overlapping intervals": sort by start, then extend or append.',
      '"Insert into a sorted list of non-overlapping intervals": copy before, merge the overlaps, copy after.',
      '"Two lists of closed intervals", "intersection": advance the interval that ends first.',
      '"Can attend all meetings" or "free time": sort and look at neighbours or gaps.',
      '"Remove the fewest" or "minimum arrows": sort by end, greedy.',
    ],
    notThis: [
      'You need the peak overlap count, as in Meeting Rooms II (LC 253): a sweep or a heap is simpler than merging.',
      'Intervals arrive one by one, as in Data Stream as Disjoint Intervals (LC 352): keep a sorted map so you need not re-sort.',
      'Many range updates with one final read, as in Car Pooling (LC 1094): use a difference array.',
    ],
    concepts: [
      'After sorting by start, a new interval overlaps the last merged one if and only if start <= last end.',
      'Sort by start to merge and sort by end to pick the most non-overlapping intervals. The goal decides the key.',
      'Two-list intersection: the overlap is [max(starts), min(ends)], and you advance whichever ends first.',
      'Insert is three phases, and takes O(n) with no sort, because the input is already ordered.',
      'Covered intervals (LC 1288): sort by start ascending and end descending, so that a covering interval comes first.',
    ],
    example: {
      problem: 'Merge Intervals with intervals = [[8,10],[1,3],[2,6],[15,18]]',
      lc: 56,
      walkthrough: [
        'Sort by start: [1,3], [2,6], [8,10], [15,18].',
        '[1,3]: merged is empty, so append it.',
        '[2,6]: 2 <= 3, so it overlaps. The end becomes max(3, 6) = 6, giving [1,6].',
        '[8,10]: 8 > 6, so append it.',
        '[15,18]: 15 > 10, so append it.',
        'The answer is [[1,6],[8,10],[15,18]].',
      ],
    },
    code: `intervals.sort()
merged = []
for s, e in intervals:
    if merged and s <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])`,
    complexity: 'O(n log n) time for the sort, then O(n) for the pass. O(n) space for the output.',
    pitfalls: [
      'Writing last end = e instead of max(last end, e): [1,10] followed by [2,3] would shrink the interval.',
      'Getting touching intervals wrong: LC 56 merges [1,4] and [4,5], but LC 435 treats them as not overlapping.',
      'Sorting by end when merging: an interval with an early start but a late end appears too late.',
      'Comparing in the wrong direction when inserting: use intervals[i][1] < new[0] for "fully before".',
      'Mutating the input interval objects when the caller still needs them.',
    ],
    pointsToPonder: [
      'Why does sorting by start guarantee that you only need to compare with the last merged interval?',
      'Why does LC 435 sort by end when LC 56 sorts by start?',
      'What changes if intervals keep arriving after you have merged?',
    ],
    practice: [252, 56, 57, 435, 986],
    snippet: '22-merge-intervals',
  },
}
