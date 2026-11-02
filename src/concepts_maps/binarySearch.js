// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const binarySearch = {
  '1. Classic Binary Search / Array Search': {
    crux: 'The input is sorted and you want one exact item: halve the range until you find it or the range is empty.',
    signals: [
      '"Given a sorted array of integers... return its index, or -1 if it does not exist."',
      '"You must write an algorithm with O(log n) runtime complexity" alongside sorted input.',
      '"Return the index where it would be if it were inserted in order."',
      'A black-box API such as guess(num) or isBadVersion(v), and you are told to "minimize the number of calls".',
    ],
    notThis: [
      'The target repeats and you need its first or last position, as in LC 34: stopping at any match is wrong, so use a boundary search (section 2).',
      'The sorted array was rotated, as in LC 33: comparing with the target alone can send you the wrong way (section 3).',
      'The input is unsorted and you only need membership, as in Intersection of Two Arrays (LC 349): a hash set is simpler and O(n).',
    ],
    concepts: [
      'The invariant: if the target exists, it is inside [lo, hi]. Each step discards a half that cannot hold it.',
      'Closed range [lo, hi] pairs with `while lo <= hi` and with `mid + 1` / `mid - 1`, because mid has been fully checked.',
      'When the loop fails, lo is the insertion point: every index before lo holds a smaller value and every index from lo on holds a larger one.',
    ],
    example: {
      problem: 'Binary Search with nums = [-1, 0, 3, 5, 9, 12], target = 2',
      lc: 704,
      walkthrough: [
        'lo = 0, hi = 5, so mid = 2. nums[2] = 3 is greater than 2, so hi = 1.',
        'lo = 0, hi = 1, so mid = 0. nums[0] = -1 is less than 2, so lo = 1.',
        'lo = 1, hi = 1, so mid = 1. nums[1] = 0 is less than 2, so lo = 2.',
        'Now lo = 2 is greater than hi = 1, so the range is empty and the answer is -1.',
        'lo = 2 is also where 2 would be inserted, which is the answer to Search Insert Position (LC 35).',
      ],
    },
    complexity: 'O(log n) time, because each comparison halves the range. O(1) space.',
    pitfalls: [
      'Mixing range styles: `while lo < hi` with `hi = mid - 1` skips candidates, and `while lo <= hi` with `hi = mid` can loop forever.',
      'Writing (lo + hi) / 2 in C++ or Java: the sum can overflow on large ranges, so use lo + (hi - lo) / 2.',
      'Returning hi instead of lo for an insert position: after the loop, hi sits one slot before it.',
      'Reading the guess() API backwards in LC 374: -1 means your guess is too high, not too low.',
    ],
    pointsToPonder: [
      'Why does lo always land on the insertion point when the target is missing?',
      'What exactly does each half you discard prove about the elements inside it?',
      'What would you do differently if comparing two elements were very expensive?',
    ],
    code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1   # lo is the insertion point here`,
    practice: [704, 374, 35, 278, 702],
    snippet: '1-classic-binary-search-exact-target',
  },

  '2. Lower Bound / Upper Bound / Boundary Finding': {
    crux: 'Don\'t stop on a match: keep shrinking until the range closes on the exact point where a condition flips from false to true.',
    signals: [
      '"Find the starting and ending position of a given target value" in a sorted array with duplicates.',
      '"The first version that fails", or "the smallest element greater than target".',
      '"How many elements are less than or equal to x" for many queries over sorted data.',
      '"Maximum size of a subsequence with sum at most queries[i]": sort, take prefix sums, and look for the last prefix that fits.',
    ],
    notThis: [
      'All values are unique and you only need to find one, as in LC 704: the classic search (section 1) is simpler.',
      'Elements arrive with their positions mattering, as in Count of Smaller Numbers After Self (LC 315): one bound over a static array can\'t answer it, so use a BIT or merge sort (section 18).',
      'Russian Doll Envelopes (LC 354) uses a lower bound, but only inside an LIS: the insight lives in section 14.',
    ],
    concepts: [
      'Lower bound is the first index with a[i] >= x. Upper bound is the first index with a[i] > x.',
      'Half-open range [lo, hi) with hi = len(a): the answer can be len(a), meaning "no such element".',
      'Count of x = upper(x) - lower(x). Count of values <= x = upper(x). Last index of x = upper(x) - 1.',
    ],
    example: {
      problem: 'Find First and Last Position with a = [5, 7, 7, 8, 8, 10], t = 8',
      lc: 34,
      walkthrough: [
        'First call, lower_bound(a, 8): lo = 0, hi = 6, mid = 3. a[3] = 8 >= 8, so hi = 3.',
        'lo = 0, hi = 3, mid = 1. a[1] = 7 < 8, so lo = 2.',
        'lo = 2, hi = 3, mid = 2. a[2] = 7 < 8, so lo = 3. The range is closed and first = 3, and a[3] is indeed 8.',
        'Second call, lower_bound(a, 9): lo = 0, hi = 6, mid = 3. a[3] = 8 < 9, so lo = 4.',
        'lo = 4, hi = 6, mid = 5. a[5] = 10 >= 9, so hi = 5.',
        'lo = 4, hi = 5, mid = 4. a[4] = 8 < 9, so lo = 5. The call returns 5, so last = 5 - 1 = 4.',
        'The answer is [3, 4].',
      ],
    },
    complexity: 'O(log n) time per bound and O(1) space. Answering q queries over a sorted array costs O(q log n).',
    pitfalls: [
      'Reading a[first] without checking first < len(a): when every element is smaller than the target, lower bound returns len(a).',
      'Forgetting that lower bound does not prove the target exists: always compare a[first] with the target.',
      'Starting with hi = len(a) - 1 in the half-open form: "insert after the end" can then never be returned.',
      'Using t + 1 for the upper bound on non-integers or at INT_MAX: write a real upper bound in those cases.',
    ],
    pointsToPonder: [
      'Why does `hi = mid` terminate while `lo = mid` might not, when mid rounds down?',
      'How do you get last index <= x, last index < x and first index > x from a single lower bound function?',
      'H-Index II (LC 275) has no target at all, so what is the boundary?',
    ],
    code: `def lower_bound(a, x):
    lo, hi = 0, len(a)          # answer may be len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] >= x:
            hi = mid            # mid might be the answer
        else:
            lo = mid + 1
    return lo

def search_range(a, t):
    first = lower_bound(a, t)
    if first == len(a) or a[first] != t:
        return [-1, -1]
    return [first, lower_bound(a, t + 1) - 1]`,
    practice: [35, 744, 2389, 34, 2055],
    snippet: '2-lower-bound-first-index-target',
  },

  '3. Rotated / Shifted Sorted Array': {
    crux: 'One side of mid is always sorted: find which one, ask whether the target can be inside it, and discard the other side.',
    signals: [
      '"An integer array sorted in ascending order is rotated at an unknown pivot."',
      '"Possibly rotated": the words that rule out a plain binary search.',
      '"Find the minimum element" of an array that has been "rotated between 1 and n times".',
      '"How many times was the array rotated?": that is the index of the minimum.',
      '"May contain duplicates": expect a slower worst case.',
    ],
    notThis: [
      'Check if Array Is Sorted and Rotated (LC 1752) asks about the whole array: count the descents in one O(n) pass.',
      'Search in a Sorted Array of Unknown Size (LC 702) is sorted but has no known end, so it needs exponential search (section 22).',
      'The array rises and then falls, as in a mountain array (LC 852): compare neighbors instead (section 8).',
    ],
    concepts: [
      'If a[lo] <= a[mid], the left half is sorted. Otherwise the right half is sorted. A rotation break can only be in one half.',
      'Decide using the sorted half only, because that is the side where a range check can be trusted.',
      'For the minimum, compare a[mid] with a[hi]. If a[mid] > a[hi], the break is to the right of mid. Otherwise the minimum is at mid or to its left.',
      'Duplicates can make a[lo] == a[mid] == a[hi], which reveals nothing. Shrink by one, which makes the worst case O(n).',
    ],
    example: {
      problem: 'Search in Rotated Sorted Array with a = [4, 5, 6, 7, 0, 1, 2], t = 0',
      lc: 33,
      walkthrough: [
        'lo = 0, hi = 6, mid = 3, a[3] = 7. a[0] = 4 <= 7, so the left half [4, 5, 6, 7] is sorted.',
        '4 <= 0 is false, so 0 can\'t be in the left half. Set lo = 4.',
        'lo = 4, hi = 6, mid = 5, a[5] = 1. a[4] = 0 <= 1, so the left half [0, 1] is sorted.',
        '0 <= 0 < 1 holds, so the target is inside it. Set hi = 4.',
        'lo = 4, hi = 4, mid = 4, a[4] = 0, which is the target. The answer is 4.',
      ],
    },
    complexity: 'O(log n) time and O(1) space with distinct values. With duplicates (LC 81, LC 154), the worst case is O(n), for example on [1, 1, 1, 1, 0, 1].',
    pitfalls: [
      'Writing a[lo] < a[mid] instead of <=: when lo == mid, the one-element left half must still count as sorted.',
      'Comparing a[mid] with a[lo] to find the minimum: in an unrotated array that points the wrong way, so compare with a[hi].',
      'Using strict and loose bounds in the wrong places: the range check is a[lo] <= t < a[mid], because a[mid] has already been ruled out.',
      'In LC 154, returning early on a[mid] == a[hi]: all you can safely do is hi -= 1.',
    ],
    pointsToPonder: [
      'Why must at least one half be sorted, whatever the rotation is?',
      'Why do duplicates break the logarithmic bound, while still leaving most inputs fast?',
      'Can you solve LC 33 in two steps, by finding the minimum and then running a normal search on one side?',
    ],
    code: `def search_rotated(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == t:
            return mid
        if a[lo] <= a[mid]:             # left half is sorted
            if a[lo] <= t < a[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                           # right half is sorted
            if a[mid] < t <= a[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    practice: [1752, 153, 33, 81, 154],
    snippet: '10-search-in-rotated-sorted-array',
  },

  '4. Binary Search on Answer (Minimize Maximum / Maximize Minimum)': {
    crux: 'When a min-max objective is hard to compute but easy to test, search over the answer and let a greedy check say "is this value achievable?".',
    signals: [
      '"Minimize the largest sum among these k subarrays", or "the minimum possible maximum".',
      '"Maximize the minimum distance between any two": place cows, balls or stores as far apart as possible.',
      '"Within D days", "at most k splits" or "to k children": a resource budget paired with a threshold.',
      'Constraints such as values up to 10^9, which rule out searching every answer but suit a log factor.',
    ],
    notThis: [
      'The feasibility check has no greedy, as when any job can go to any worker in LC 1723: testing one value is itself exponential, so use backtracking or bitmask DP.',
      'Maximum Distance Between a Pair of Values (LC 1855) has two sorted arrays and no threshold to test: two pointers solve it in O(n + m).',
      'You want a count of ways or an exact total: there is no yes/no threshold to search, so think DP.',
    ],
    concepts: [
      'Monotonicity is what makes this work: if capacity c is enough, any larger capacity is too. The answers look like F F F T T T.',
      'Minimize the maximum means finding the first true. Maximize the minimum means finding the last true, where answers look like T T T F F F.',
      'Choose bounds that surely contain the answer. For LC 410, lo = max(nums), since a part must fit the biggest item, and hi = sum(nums), which is one part.',
      'When the predicate is true at mid and you keep mid (lo = mid), round mid up so the range always shrinks.',
    ],
    example: {
      problem: 'Split Array Largest Sum with nums = [7, 2, 5, 10, 8], k = 2',
      lc: 410,
      walkthrough: [
        'lo = max(nums) = 10, hi = sum(nums) = 32.',
        'mid = 21. Fill greedily: 7 + 2 + 5 = 14, and adding 10 makes 24 > 21, so start a new part: 10 + 8 = 18. That is 2 parts, which fits, so hi = 21.',
        'lo = 10, hi = 21, mid = 15. Parts are [7, 2, 5], [10], [8], because 10 + 8 = 18 > 15. That is 3 parts, too many, so lo = 16.',
        'lo = 16, hi = 21, mid = 18. Parts are [7, 2, 5], [10, 8]. That is 2 parts, which fits, so hi = 18.',
        'lo = 16, hi = 18, mid = 17. 10 + 8 = 18 > 17 forces 3 parts, so lo = 18.',
        'lo = hi = 18. The answer is 18, the split [7, 2, 5] and [10, 8].',
      ],
    },
    complexity: 'O(n log S) time, where S is the size of the answer range (here the sum of the array). O(1) extra space.',
    pitfalls: [
      'Setting lo to 0 or 1 in LC 410 or LC 1011: a capacity below the largest item makes the greedy check misbehave, so start at max(nums).',
      'Using `mid = lo + (hi - lo) // 2` with `lo = mid` when maximizing: with hi = lo + 1, mid equals lo and the loop never ends.',
      'Summing into a 32-bit int in the check: totals often pass 2^31, so use long long.',
      'Forgetting to sort positions first in the Aggressive Cows family: the greedy placement assumes sorted order.',
    ],
    pointsToPonder: [
      'How do you prove the predicate is monotonic, rather than assuming it?',
      'Why does the greedy check, taking as much as fits, never use more parts than necessary?',
      'Why is the search result guaranteed to be an achievable value, not just a bound on one?',
    ],
    code: `def split_array(nums, k):
    def feasible(cap):      # at most k parts, each sum <= cap?
        parts, cur = 1, 0
        for x in nums:
            if cur + x > cap:
                parts, cur = parts + 1, 0
            cur += x
        return parts <= k

    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid        # mid works; try smaller
        else:
            lo = mid + 1
    return lo

# Maximize the minimum: mirror it and round mid UP
#   mid = lo + (hi - lo + 1) // 2
#   if feasible(mid): lo = mid
#   else: hi = mid - 1`,
    practice: [2226, 1011, 1552, 2064, 410],
    snippet: '8-binary-search-on-answer-minimum-feasible-answer',
  },

  '5. Binary Search on Answer (Feasibility Check / Counting)': {
    crux: 'Find the smallest rate, day or threshold that passes: run a simple simulation or count for a candidate, then binary search on that yes/no.',
    signals: [
      '"Return the minimum integer k such that she can eat all the bananas within h hours."',
      '"The minimum number of days you need to wait", or "the minimum time for all buses to finish".',
      '"The smallest divisor such that the result is at most threshold."',
      '"Minimum speed", "minimum limit" or "maximum number you can make": one number whose increase only ever helps or only ever hurts.',
    ],
    notThis: [
      'Most Profit Assigning Work (LC 826) looks up the best job for each worker: sort and sweep, as in section 12, with no answer to guess.',
      'Path With Minimum Effort (LC 1631) has the same outer loop, but its check is a graph search, which section 13 covers.',
      'Sum of Mutated Array (LC 1300) wants the value closest to a target, so also compare the two neighbors of the crossing point.',
    ],
    concepts: [
      'The check is usually one pass: sum of ceil(pile / k), count of trips by time t, or adjacent bloomed flowers on day d.',
      'Bounds come from the extremes: at speed max(piles), each pile takes one hour, so no faster speed is ever needed.',
      'The same frame searches values in Nth Magical Number (LC 878) by counting with inclusion-exclusion: count(x) = x/a + x/b - x/lcm(a, b).',
    ],
    example: {
      problem: 'Koko Eating Bananas with piles = [3, 6, 7, 11], h = 8',
      lc: 875,
      walkthrough: [
        'lo = 1, hi = max(piles) = 11.',
        'mid = 6. Hours = 1 + 1 + 2 + 2 = 6, which is within 8, so hi = 6.',
        'lo = 1, hi = 6, mid = 3. Hours = 1 + 2 + 3 + 4 = 10 > 8, so lo = 4.',
        'lo = 4, hi = 6, mid = 5. Hours = 1 + 2 + 2 + 3 = 8, which fits, so hi = 5.',
        'lo = 4, hi = 5, mid = 4. Hours = 1 + 2 + 2 + 3 = 8, which fits, so hi = 4.',
        'lo = hi = 4. The answer is 4 bananas per hour.',
      ],
    },
    complexity: 'O(n log M) time, where M is the size of the answer range. O(1) extra space.',
    pitfalls: [
      'Computing ceil through floating point: use (p + k - 1) // k, because float rounding can miscount on large values.',
      'Starting lo at 0 when dividing by the candidate, as in LC 875 and LC 1283: mid can then be 0, so start at 1.',
      'Missing the impossible case: LC 1482 returns -1 when m * k exceeds the number of flowers, and that must be checked first.',
      'Picking hi too small in LC 2187: the slowest possible finish is min(time) * totalTrips, which needs 64 bits.',
    ],
    pointsToPonder: [
      'What is the physical reason that the predicate is monotonic here: more time, or more speed, never hurts?',
      'Why is the final lo guaranteed to pass the check, even if that exact value was never tested?',
      'LC 1898 searches over how many removals to apply. What makes that count monotonic?',
    ],
    code: `def min_speed(piles, h):
    def hours(k):
        return sum((p + k - 1) // k for p in piles)   # ceil(p / k)

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [875, 1283, 1482, 2187, 1870],
    snippet: '8-binary-search-on-answer-minimum-feasible-answer',
  },

  '6. Kth Element / Median Finding via Binary Search': {
    crux: 'Too many candidates to list? Search on the value itself: the k-th smallest is the smallest x with at least k candidates <= x.',
    signals: [
      '"Return the k-th smallest element in the matrix" where rows and columns are sorted.',
      '"K-th smallest among all the pair distances", or the "k-th number in the m x n multiplication table".',
      '"Find the median of the two sorted arrays... O(log(m + n))."',
      'The candidate set is huge (n^2 or m*n) while counting candidates <= x is fast.',
    ],
    notThis: [
      'K-th largest in one unsorted array: use a heap or quickselect, since listing is already cheap.',
      'Find K Pairs with Smallest Sums (LC 373) wants all k pairs, not one value, so a heap fits better.',
      'Count of Smaller Numbers After Self (LC 315) and Count of Range Sum (LC 327) are per-element counts, not one k-th value: see section 18.',
    ],
    concepts: [
      'count(x) rises with x, so "count(x) >= k" is a false-then-true predicate. Find its first true.',
      'The first x to reach count k must be a real candidate: if x were not one, count(x - 1) would already be k.',
      'Median of Two Sorted Arrays (LC 4) is different: binary search the partition point in the shorter array so both left parts together hold half the elements.',
      'Kth Missing Positive (LC 1539) searches indices: a[i] - (i + 1) is how many numbers are missing before a[i].',
    ],
    example: {
      problem: 'Kth Smallest in Multiplication Table with m = 3, n = 3, k = 5',
      lc: 668,
      walkthrough: [
        'The table holds 1, 2, 2, 3, 3, 4, 6, 6, 9, so we expect 3. Start with lo = 1, hi = 9.',
        'mid = 5. count = min(5 // 1, 3) + min(5 // 2, 3) + min(5 // 3, 3) = 3 + 2 + 1 = 6. Since 6 >= 5, hi = 5.',
        'lo = 1, hi = 5, mid = 3. count = 3 + 1 + 1 = 5. Since 5 >= 5, hi = 3.',
        'lo = 1, hi = 3, mid = 2. count = 2 + 1 + 0 = 3. Since 3 < 5, lo = 3.',
        'lo = hi = 3. The answer is 3.',
      ],
    },
    complexity: 'O(C log V) time, where C is the cost of one count and V is the size of the value range. For LC 668, that is O(m log(mn)). O(1) space.',
    pitfalls: [
      'Using `count == k` to stop early: mid can have exactly k values below it without being in the set, so finish the search.',
      'Mixing up `<= x` and `< x` in the count: duplicates then shift the answer by one rank.',
      'In LC 4, partitioning the longer array: the other array\'s index can go out of range, so always search the shorter one.',
      'In LC 719, not sorting first: the sliding window count relies on sorted values.',
    ],
    pointsToPonder: [
      'Why is the first x with count(x) >= k guaranteed to be in the table, though you never looked at the table?',
      'When would a heap beat this approach, given k and the shape of the data?',
      'K-th Smallest Prime Fraction (LC 786) has real-valued answers, so how do you recover the exact fraction?',
    ],
    code: `def kth_in_table(m, n, k):
    def count(x):           # how many table values are <= x?
        return sum(min(x // row, n) for row in range(1, m + 1))

    lo, hi = 1, m * n
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if count(mid) >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [1539, 378, 668, 719, 4],
    snippet: '6-first-true-in-monotonic-predicate',
  },

  '7. Binary Search on Matrix': {
    crux: 'Read how the matrix is sorted: a globally sorted one flattens to a single array, while rows and columns sorted separately need a staircase walk.',
    signals: [
      '"The first integer of each row is greater than the last integer of the previous row": flatten it.',
      '"Integers in each row are sorted left to right, and in each column top to bottom": walk from a corner.',
      '"Row-sorted binary matrix... the leftmost column with a 1": walk, with a limited number of calls.',
      '"Count negative numbers" in a matrix sorted in non-increasing order.',
    ],
    notThis: [
      'Rows and columns are sorted but rows overlap, as in LC 240: flattening breaks, because the flat list isn\'t sorted.',
      'You want the k-th smallest (LC 378) or a median: search on the value and count with the staircase (section 6).',
    ],
    concepts: [
      'Flattening: index i in an m x n matrix is row i // n, column i % n, so the classic search applies with no extra space.',
      'Staircase: from the top-right corner, a larger value rules out its column and a smaller value rules out its row. Each step removes one line.',
      'The staircase also counts: in one O(m + n) pass it can count values <= x, which is the check for k-th smallest.',
    ],
    example: {
      problem: 'Search a 2D Matrix with mat = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], t = 3',
      lc: 74,
      walkthrough: [
        'm = 3, n = 4, so flat indices run from 0 to 11. lo = 0, hi = 11.',
        'mid = 5, which is row 1, column 1, value 11. 11 > 3, so hi = 4.',
        'lo = 0, hi = 4, mid = 2, which is row 0, column 2, value 5. 5 > 3, so hi = 1.',
        'lo = 0, hi = 1, mid = 0, value 1. 1 < 3, so lo = 1.',
        'lo = 1, hi = 1, mid = 1, which is row 0, column 1, value 3. Found, so the answer is true.',
      ],
    },
    complexity: 'Flattened search: O(log(mn)) time. Staircase: O(m + n) time. Both use O(1) space.',
    pitfalls: [
      'Dividing by the wrong dimension: the row is i // n, where n is the number of columns, not the number of rows.',
      'Starting the staircase at the top-left: both directions increase there, so neither move rules anything out.',
      'Binary searching each row of LC 240: that costs O(m log n), and is usually worse than the staircase.',
    ],
    pointsToPonder: [
      'Why does the staircase work from the top-right or bottom-left, but not from the other two corners?',
      'If m is much smaller than n, when does a binary search per row beat the staircase?',
      'How does Leftmost Column (LC 1428) use the staircase to keep its API calls low?',
    ],
    code: `def search_flat(mat, t):        # rows continue one another
    m, n = len(mat), len(mat[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = mat[mid // n][mid % n]
        if val == t:
            return True
        if val < t:
            lo = mid + 1
        else:
            hi = mid - 1
    return False

def search_staircase(mat, t):   # rows and columns sorted separately
    r, c = 0, len(mat[0]) - 1
    while r < len(mat) and c >= 0:
        if mat[r][c] == t:
            return True
        if mat[r][c] > t:
            c -= 1              # everything below is larger
        else:
            r += 1              # everything to the left is smaller
    return False`,
    practice: [1351, 74, 240, 1428, 378],
    snippet: '15-binary-search-in-2d-matrix',
  },

  '8. Binary Search on Sorted / Nearly Sorted Structures': {
    crux: 'Nothing is fully sorted, but the slope at mid tells you which side the answer is on, so compare mid with its neighbor.',
    signals: [
      '"A peak element is strictly greater than its neighbors... return any peak... O(log n)."',
      '"Mountain array": values strictly rise and then strictly fall.',
      '"Each element appears exactly twice, except for one element" in a sorted array.',
      '"Each element may be misplaced by at most one position": the nearly sorted classic.',
    ],
    notThis: [
      'Valid Mountain Array (LC 941) must check every element, so a linear scan is the only correct way.',
      'The array is a rotation of a sorted one (LC 153): compare with the right end instead (section 3).',
      'Elements can be equal to their neighbors: plateaus hide the slope, so a peak can\'t be located by comparing neighbors.',
    ],
    concepts: [
      'If a[mid] < a[mid + 1], you are on a rising slope, and a peak must exist to the right. Otherwise one exists at mid or to the left.',
      'This works on unsorted data since you only need some peak, and treating the edges as -infinity means one always exists.',
      'Find in Mountain Array (LC 1095) takes three searches: the peak, then the rising side, then the falling side with its comparison reversed.',
      'Missing Element (LC 1060): a[i] - a[0] - i counts the numbers missing before index i, which only grows.',
    ],
    example: {
      problem: 'Find Peak Element with a = [1, 2, 1, 3, 5, 6, 4]',
      lc: 162,
      walkthrough: [
        'lo = 0, hi = 6, mid = 3. a[3] = 3 < a[4] = 5, so we are rising. Set lo = 4.',
        'lo = 4, hi = 6, mid = 5. a[5] = 6 is not less than a[6] = 4, so we are falling. Set hi = 5.',
        'lo = 4, hi = 5, mid = 4. a[4] = 5 < a[5] = 6, so lo = 5.',
        'lo = hi = 5. a[5] = 6 is a peak, since 5 and 4 are both smaller. Index 1 would also be valid, as any peak is accepted.',
      ],
    },
    complexity: 'O(log n) time and O(1) space. Find in Mountain Array makes about three times as many reads for its three searches.',
    pitfalls: [
      'Using `while lo <= hi` here: then mid can be the last index, and a[mid + 1] is out of range. `lo < hi` keeps mid + 1 valid.',
      'Reusing a plain search on the falling side of a mountain: the comparisons must be flipped.',
      'In LC 1095, not caching get() results: the call limit is tight, so avoid re-reading the same index.',
      'In the nearly sorted classic, stepping by 1: after checking mid - 1, mid and mid + 1, move to mid + 2 or mid - 2.',
    ],
    pointsToPonder: [
      'Why is a peak guaranteed on the rising side, even though the array is otherwise arbitrary?',
      'What changes if the problem needs the highest peak rather than any peak?',
      'Single Element in a Sorted Array (LC 540) has no slope at all, so what does it compare instead?',
    ],
    code: `def find_peak(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:              # mid + 1 is always valid
        mid = lo + (hi - lo) // 2
        if a[mid] < a[mid + 1]:
            lo = mid + 1        # rising: a peak lies to the right
        else:
            hi = mid            # falling: mid may be the peak
    return lo`,
    practice: [941, 852, 162, 540, 1095],
    snippet: '12-peak-element',
  },

  '9. Binary Search + Greedy': {
    crux: 'Fix the threshold first, and an optimization with no obvious greedy becomes a simple yes/no scan that one greedy rule can answer.',
    signals: [
      '"Maximum tastiness": the smallest difference among k chosen items, as large as possible.',
      '"Packages must be shipped in the order given": take items in sequence until a limit is reached.',
      '"Form m groups of k adjacent flowers": a left-to-right scan that takes each group as soon as it can.',
      '"Find p pairs so the maximum difference is minimized": after sorting, greedily pair neighbors.',
    ],
    notThis: [
      'Minimum Replacement to Sort Array (LC 2366) is a direct right-to-left greedy with no threshold to guess.',
      'Most Profit Assigning Work (LC 826) only needs sorting and a running best profit: see section 12.',
      'The check needs exploring choices, such as subset-sum-like assignments: then the inner step is DP, not greedy.',
    ],
    concepts: [
      'The search supplies the threshold and the greedy supplies the test. Each is simple on its own.',
      'The greedy step usually takes the earliest possible item, which leaves the most room for later choices: an exchange argument.',
      'Sort first if selection is free, as in LC 2517. Keep input order if the problem requires contiguous groups, as in LC 410.',
    ],
    example: {
      problem: 'Maximum Tastiness of Candy Basket with price = [13, 5, 1, 8, 21, 2], k = 3',
      lc: 2517,
      walkthrough: [
        'Sort to [1, 2, 5, 8, 13, 21]. lo = 0, hi = 21 - 1 = 20. We maximize, so mid rounds up.',
        'mid = 10. Take 1, then 13 (first >= 11), and nothing is >= 23. That is 2 candies, too few, so hi = 9.',
        'mid = 5. Take 1, 8, 13, 21, which is at least 3, so lo = 5.',
        'lo = 5, hi = 9, mid = 7. Take 1, 8, 21, which is 3, so lo = 7.',
        'lo = 7, hi = 9, mid = 8. Take 1, 13, 21, which is 3, so lo = 8.',
        'lo = 8, hi = 9, mid = 9. Take 1, 13, and nothing is >= 22. That is 2, so hi = 8.',
        'lo = hi = 8. The answer is 8, from the basket [1, 13, 21].',
      ],
    },
    complexity: 'O(n log n) to sort, plus O(n log V) for the search, where V is the value range. O(1) extra space beyond the sort.',
    pitfalls: [
      'Rounding mid down while using lo = mid: when hi = lo + 1, the range stops shrinking and the loop hangs.',
      'Using the greedy without justifying it: if taking the earliest item can block a better choice, the check says no to something achievable.',
      'In LC 2616, not skipping past a used pair: after pairing i and i + 1, continue from i + 2.',
    ],
    pointsToPonder: [
      'Why does always taking the first valid item never reduce how many you can take in total?',
      'Could you solve LC 2517 without the search? What would be hard about it?',
      'How would the check change if the chosen candies had to be adjacent in the original array?',
    ],
    code: `def maximum_tastiness(price, k):
    price.sort()

    def can(gap):           # pick k candies, each >= gap apart?
        count, last = 1, price[0]
        for p in price[1:]:
            if p - last >= gap:
                count, last = count + 1, p
        return count >= k

    lo, hi = 0, price[-1] - price[0]
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2   # round up
        if can(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`,
    practice: [2187, 1011, 1482, 2517, 410],
    snippet: '9-binary-search-on-answer-maximum-feasible-answer',
  },

  '10. Binary Search + Sliding Window / Two Pointer': {
    crux: 'Binary search a value, then use one linear window pass to count or check it: O(n) per test instead of O(n log n).',
    signals: [
      '"Return the k-th smallest distance among all the pairs."',
      '"The k-th smallest subarray sum", with positive values, so window sums only grow.',
      '"Remove the first k indices from removable... p is still a subsequence": two pointers answer one k.',
      '"Minimize the maximum difference among p pairs": a threshold plus one pass over sorted values.',
    ],
    notThis: [
      'Count Number of Nice Subarrays (LC 1248) is plain "at most k" windowing: there is no answer value to search for.',
      'Longest Duplicate Substring (LC 1044) searches a length, but its check hashes substrings: see section 17.',
      'Minimum Window Subsequence (LC 727) is usually two pointers or DP: a shorter window isn\'t tested by a threshold.',
      'Negative numbers break window monotonicity, so window sums no longer work.',
    ],
    concepts: [
      'After sorting, count pairs with distance <= d using a right pointer and a left pointer that only moves forward: O(n) per test.',
      'Why the window works: if a[right] - a[left] > d, then that left is also too far for every later right.',
      'The window count for each right is right - left, since every index in [left, right) pairs with it.',
    ],
    example: {
      problem: 'Find K-th Smallest Pair Distance with nums = [1, 3, 1, 6], k = 3',
      lc: 719,
      walkthrough: [
        'Sort to [1, 1, 3, 6]. The distances are 0, 2, 2, 3, 5, 5, so the third smallest is 2. Start with lo = 0, hi = 5.',
        'mid = 2. right = 1 adds 1 pair. right = 2 adds 2 pairs, as 3 - 1 = 2 fits. right = 3 moves left up to 3 and adds 0. The total is 3 >= 3, so hi = 2.',
        'lo = 0, hi = 2, mid = 1. right = 1 adds 1. right = 2 moves left to 2 and adds 0. right = 3 moves left to 3 and adds 0. The total is 1 < 3, so lo = 2.',
        'lo = hi = 2. The answer is 2.',
      ],
    },
    complexity: 'O(n log n + n log V) time, where V is the distance range. O(1) extra space beyond the sort.',
    pitfalls: [
      'Resetting the left pointer for each right: that makes the count O(n^2) and loses the point of the window.',
      'Adding right - left + 1: that counts a pair of an element with itself.',
      'Not sorting first in LC 719: the left pointer is only monotonic on sorted values.',
      'Using `count == k` as a stopping rule: keep searching until the bounds meet.',
    ],
    pointsToPonder: [
      'What property of the data lets the left pointer never move back?',
      'In LC 1898, you search over how many removals to apply. Why is "still a subsequence" monotonic in that number?',
      'When is one sorted scan enough, so that a window isn\'t needed at all?',
    ],
    code: `def kth_smallest_distance(nums, k):
    nums.sort()

    def count_within(d):    # pairs with distance <= d
        total = left = 0
        for right in range(len(nums)):
            while nums[right] - nums[left] > d:
                left += 1
            total += right - left
        return total

    lo, hi = 0, nums[-1] - nums[0]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if count_within(mid) >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [1552, 1898, 2616, 1918, 719],
    snippet: '6-first-true-in-monotonic-predicate',
  },

  '11. Binary Search + Prefix Sum': {
    crux: 'With non-negative values, prefix sums are sorted, so "how far can I go before the total passes x?" is a lower bound lookup.',
    signals: [
      '"Pick an index with probability w[i] / sum(w)."',
      '"Maximum size of a subsequence with sum at most queries[i]": many queries, each a budget.',
      '"Plates between candles in the substring": prefix counts plus nearest-position lookups.',
      '"Split into three parts where left <= mid <= right": two moving boundaries for each cut.',
      '"For each query, minimum operations to make all elements equal to q": split the sorted array at q.',
    ],
    notThis: [
      'Values can be negative, as in Maximum Size Subarray Sum Equals k (LC 325): prefix sums aren\'t sorted, so use a hash map.',
      'Find Right Interval (LC 436) has no totals at all, just sorted starts: see section 12.',
      'Maximum Sum of 3 Non-Overlapping Subarrays (LC 689) picks fixed windows, so it needs DP or a sliding scan.',
    ],
    concepts: [
      'Prefix sums turn a range total into one subtraction, and non-negative values make the array non-decreasing.',
      'Weighted pick: each index owns a slice of [1, total] as wide as its weight, and a lower bound finds whose slice a random number hits.',
      'Offline-style query: sort the values, build prefix sums once, then answer each query in O(log n).',
    ],
    example: {
      problem: 'Random Pick with Weight with w = [1, 3, 2], and a random draw of r = 5',
      lc: 528,
      walkthrough: [
        'Prefix sums are [1, 4, 6], so index 0 owns {1}, index 1 owns {2, 3, 4} and index 2 owns {5, 6}.',
        'Draw r = 5 from 1 to 6, then find the first prefix >= 5. lo = 0, hi = 3.',
        'mid = 1. prefix[1] = 4 < 5, so lo = 2.',
        'lo = 2, hi = 3, mid = 2. prefix[2] = 6 >= 5, so hi = 2.',
        'lo = hi = 2, so index 2 is picked, which is right for r = 5. It wins 2 of 6 draws, matching its weight.',
      ],
    },
    complexity: 'O(n) to build the prefix array, then O(log n) per query. O(n) space.',
    pitfalls: [
      'Drawing r from [0, total) with a lower bound: index 0 then gets one extra value, and its odds drift. Pair [1, total] with lower bound.',
      'Running this on data with negatives: the array isn\'t sorted, and the search returns nonsense without any error.',
      'In LC 2389, confusing the bound: "sum at most q" needs an upper bound, since a prefix equal to q still fits.',
      'Summing in 32 bits in LC 2602: totals can reach 10^14.',
    ],
    pointsToPonder: [
      'Why does the weight of index i exactly match the number of draws that land on it?',
      'In LC 1712, why do two binary searches per cut give a valid range of second cuts?',
      'What would you do if weights changed between picks? Which structure replaces the prefix array?',
    ],
    code: `def build(w):
    prefix, total = [], 0
    for x in w:
        total += x
        prefix.append(total)
    return prefix

def pick_index(prefix, r):      # r is random in 1..prefix[-1]
    lo, hi = 0, len(prefix)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if prefix[mid] >= r:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [2389, 528, 2055, 2602, 1712],
    snippet: '2-lower-bound-first-index-target',
  },

  '12. Binary Search + Sorting': {
    crux: 'Sort one side, then answer each element of the other side with a lookup: an O(n^2) pair loop becomes O(n log n).',
    signals: [
      '"For each spell, how many potions form a successful pair": count partners that pass a threshold.',
      '"For each worker, the most profitable job they can do": the best partner within a limit.',
      '"Closest element to x": change one value to shrink an absolute difference, as in LC 1818.',
      '"Number of pairs such that a[i] * b[j] >= k", where order between the two lists doesn\'t matter.',
    ],
    notThis: [
      'Both sides can be sorted and swept together, as in Two Sum II (LC 167) or 3Sum Closest (LC 16): two pointers avoid the log factor.',
      'Order between elements matters, as in LC 315: sorting destroys that, so use a BIT or merge sort (section 18).',
      'Minimize Maximum Pair Sum (LC 1877) just pairs smallest with largest after sorting, with no search at all.',
    ],
    concepts: [
      'Sort the side you search in, and keep the other side in place, so the output order still matches the input.',
      'Rewrite the condition so the sorted value stands alone: spell * potion >= s becomes potion >= ceil(s / spell).',
      'To look up "best value so far", sort by key and keep a running maximum in the sorted order, as in LC 826.',
    ],
    example: {
      problem: 'Successful Pairs of Spells and Potions with spells = [5, 1, 3], potions = [1, 2, 3, 4, 5], success = 7',
      lc: 2300,
      walkthrough: [
        'potions is already sorted. For spell 5, need = ceil(7 / 5) = 2.',
        'lo = 0, hi = 5: mid = 2, potion 3 >= 2, so hi = 2. mid = 1, potion 2 >= 2, so hi = 1. mid = 0, potion 1 < 2, so lo = 1. That leaves 5 - 1 = 4 pairs.',
        'For spell 1, need = 7. mid = 2, potion 3 < 7, so lo = 3. mid = 4, potion 5 < 7, so lo = 5. That leaves 5 - 5 = 0 pairs.',
        'For spell 3, need = ceil(7 / 3) = 3. mid = 2, potion 3 >= 3, so hi = 2. mid = 1, potion 2 < 3, so lo = 2. That leaves 5 - 2 = 3 pairs.',
        'The answer is [4, 0, 3].',
      ],
    },
    complexity: 'O((n + m) log m) time, to sort the m items and search them n times. O(1) extra space beyond the sort.',
    pitfalls: [
      'Sorting the side whose order the output must follow: searching the other side avoids tracking original indices.',
      'Using float division to get need: write (success + spell - 1) // spell, as large values round incorrectly.',
      'In LC 1818, checking only one neighbor: the closest value can be at the lower bound or just before it.',
      'Multiplying spell * potion in 32 bits: the product overflows, which is why rewriting the condition helps.',
    ],
    pointsToPonder: [
      'If you sort both sides, can you drop the binary search altogether? What does that change?',
      'Which side should you sort when one list is far shorter than the other?',
      'What information does sorting lose, and how can you tell when a problem needs that information?',
    ],
    code: `def successful_pairs(spells, potions, success):
    potions.sort()
    out = []
    for s in spells:
        need = (success + s - 1) // s     # ceil(success / s)
        lo, hi = 0, len(potions)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if potions[mid] >= need:
                hi = mid
            else:
                lo = mid + 1
        out.append(len(potions) - lo)
    return out`,
    practice: [2389, 167, 2300, 826, 1818],
    snippet: '2-lower-bound-first-index-target',
  },
}
