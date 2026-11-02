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

  '13. Binary Search + BFS / DFS / Graph': {
    crux: 'To minimize the worst edge on a path, guess the limit, ignore every edge above it, and ask whether the destination is still reachable.',
    signals: [
      '"A route\'s effort is the maximum absolute difference between two consecutive cells... return the minimum effort."',
      '"At time t, the water depth is t... the least time until you can reach the bottom right."',
      '"Return the maximum number of minutes you can stay in your initial position" before fire blocks the way.',
      'A path cost that is a maximum or minimum along the path, not a sum: this is called a bottleneck path.',
    ],
    notThis: [
      'The path cost is a sum, as in Minimum Obstacle Removal (LC 2290): use 0-1 BFS or Dijkstra, since there is no threshold to guess.',
      'The limit is a state you carry along, as in Shortest Path with Obstacles Elimination (LC 1293): BFS over (cell, removals left).',
      'Minimum Number of Days to Disconnect Island (LC 1568) has an answer of at most 2, so try each one directly.',
      'Edge Length Limited Paths (LC 1697) has many queries: sort them offline and grow a union-find.',
    ],
    concepts: [
      'Raising the limit only adds edges, so reachability can flip from false to true just once. That is the monotonic predicate.',
      'Any reachability check works inside: BFS, DFS or union-find. Pick whichever is shortest to write.',
      'Alternatives exist for bottleneck paths: Dijkstra with max() in place of +, or adding edges in sorted order to a union-find.',
    ],
    example: {
      problem: 'Path With Minimum Effort with heights = [[1,2,2],[3,8,2],[5,3,5]]',
      lc: 1631,
      walkthrough: [
        'lo = 0, and hi = 8 - 1 = 7, the biggest possible difference.',
        'mid = 3. The route 1, 3, 5, 3, 5 has differences of 2 at every step, so it reaches the corner. Set hi = 3.',
        'lo = 0, hi = 3, mid = 1. From 1 we can reach only the 2s along the top and right. Going further needs a step from 2 to 5, a difference of 3, so the corner is unreachable. Set lo = 2.',
        'lo = 2, hi = 3, mid = 2. The route 1, 3, 5, 3, 5 is allowed, so the corner is reachable. Set hi = 2.',
        'lo = hi = 2. The answer is 2.',
      ],
    },
    complexity: 'O(mn log V) time for an m x n grid, where V is the range of cell values. O(mn) space for the visited set and queue.',
    pitfalls: [
      'Reusing the visited set between checks: it must start empty for every mid.',
      'Filtering on the wrong thing: the check compares the edge against the limit, and in LC 778 the start cell itself must also be within it.',
      'In LC 2258, ignoring ties at the safehouse: you may arrive at the same minute as the fire there, but nowhere else.',
      'Setting hi too low: use the largest difference in the grid, not the difference between start and end.',
    ],
    pointsToPonder: [
      'Why does Dijkstra with max() in place of + still give a correct answer here?',
      'Which is faster in theory: this search, Dijkstra or union-find? Does it matter in an interview?',
      'What about the path cost would need to change for monotonicity to break?',
    ],
    code: `def minimum_effort(h):
    m, n = len(h), len(h[0])

    def can(limit):         # BFS using only steps of <= limit
        seen, q = {(0, 0)}, deque([(0, 0)])
        while q:
            r, c = q.popleft()
            if (r, c) == (m - 1, n - 1):
                return True
            for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
                if (0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen
                        and abs(h[nr][nc] - h[r][c]) <= limit):
                    seen.add((nr, nc))
                    q.append((nr, nc))
        return False

    lo, hi = 0, max(map(max, h)) - min(map(min, h))
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [1631, 778, 2258],
    snippet: '8-binary-search-on-answer-minimum-feasible-answer',
  },

  '14. Binary Search + DP': {
    crux: 'A DP step needs "the best earlier state that fits", and when those states are sorted, a binary search finds it in O(log n), not O(n).',
    signals: [
      '"Length of the longest strictly increasing subsequence", with n too large for O(n^2).',
      '"One envelope can fit into another if both width and height are greater": LIS in two dimensions.',
      '"Maximum profit... no two jobs overlap": take a job, then jump to the last job that ended in time.',
      '"The longest obstacle course ending at each index": non-decreasing LIS, reported per position.',
      '"Fewest moves with k eggs and n floors": a DP whose cost curves cross at a point you can search for.',
    ],
    notThis: [
      'Largest Sum of Averages (LC 813) is an ordinary partition DP: O(k n^2) passes, and no binary search is needed.',
      'Minimum Number of Days to Eat N Oranges (LC 1553) is memoized recursion on halving and has nothing sorted to search.',
      'Longest Common Subsequence has two sequences and needs a full table: tails only applies to one sequence and an order.',
    ],
    concepts: [
      'LIS tails: tails[i] is the smallest possible ending value of an increasing subsequence of length i + 1. This array is always sorted.',
      'Each x replaces the first tail >= x, or extends the array. A smaller tail can only help later elements.',
      'Weighted intervals: sort by end time, then dp[i] = max(dp[i - 1], profit[i] + dp[j]), where a search finds the last job j ending by start[i].',
      'Super Egg Drop (LC 887): one curve rises and one falls as the floor changes, so search for where they cross.',
    ],
    example: {
      problem: 'Longest Increasing Subsequence with nums = [10, 9, 2, 5, 3, 7, 101, 18]',
      lc: 300,
      walkthrough: [
        '10: tails is empty, so append. tails = [10].',
        '9: it replaces 10, the first tail >= 9. tails = [9]. Then 2 replaces 9, so tails = [2].',
        '5: larger than every tail, so append. tails = [2, 5].',
        '3: it replaces 5. tails = [2, 3]. A subsequence of length 2 can now end at a smaller value.',
        '7: append. tails = [2, 3, 7]. 101: append. tails = [2, 3, 7, 101].',
        '18: it replaces 101. tails = [2, 3, 7, 18].',
        'The length of tails is 4, so the answer is 4, for example from 2, 3, 7, 18.',
      ],
    },
    complexity: 'O(n log n) time and O(n) space for LIS and weighted job scheduling, compared with O(n^2) for the plain DP.',
    pitfalls: [
      'Reporting tails as the actual subsequence: it can mix elements from different subsequences, so store parent links to rebuild one.',
      'Using the wrong bound: strict LIS uses a lower bound, but non-decreasing (LC 1964) uses an upper bound.',
      'In LC 354, sorting heights ascending within equal widths: equal widths can then chain. Sort heights descending for ties.',
      'In LC 1235, sorting by start and then searching ends: the ends are only sorted if you sort by end time.',
    ],
    pointsToPonder: [
      'Why is tails always sorted, and what would break if it weren\'t?',
      'Why does replacing a tail never destroy a longer subsequence you already found?',
      'How would you get the LIS length ending at each index, as LC 1671 and LC 1964 need?',
    ],
    code: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)   # first tail >= x
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x            # smaller ending for length i + 1
    return len(tails)`,
    practice: [300, 1964, 1671, 354, 1235],
    snippet: '2-lower-bound-first-index-target',
  },

  '15. Binary Search on Floating Point / Real Numbers': {
    crux: 'When the answer is a real number, the same halving works, but you stop after a fixed precision, not when lo meets hi.',
    signals: [
      '"Answers within 10^-5 of the actual answer will be accepted."',
      '"Add k new gas stations... minimize the maximum distance": the optimum needn\'t be an integer.',
      '"Maximum average value of a subarray of length at least k": the answer is a fraction.',
      '"Compute the nth root" or a cube root to a given precision.',
    ],
    notThis: [
      'The answer must be an integer, even if the check uses division, as in LC 1870 and LC 1283: use the integer template, which ends exactly.',
      'Pow(x, n) (LC 50) computes a value directly, so use repeated squaring, not a search.',
      'Median of Two Sorted Arrays (LC 4) returns a fraction, but it searches over an integer partition index.',
    ],
    concepts: [
      'Each pass halves the range, so 100 iterations takes a range of 10^9 far below double precision.',
      'With no integer gap to step over, both moves are `lo = mid` or `hi = mid`. Never add or subtract 1.',
      'The check often rewrites the goal: an average >= x is the same as a sum of (a[i] - x) >= 0, as in LC 644.',
    ],
    example: {
      problem: 'Minimize Max Distance to Gas Station with stations = [1, 7], k = 2',
      lc: 774,
      walkthrough: [
        'The only gap is 6. A limit d needs ceil(6 / d) - 1 new stations. lo = 0, hi = 6.',
        'mid = 3: needs 1 station, which is within 2. Set hi = 3.',
        'mid = 1.5: needs 3 stations, too many. Set lo = 1.5.',
        'mid = 2.25: ceil(2.67) - 1 = 2 stations, which fits. Set hi = 2.25.',
        'mid = 1.875: ceil(3.2) - 1 = 3 stations, too many. Set lo = 1.875.',
        'The range keeps closing around 2.0, and 100 iterations return 2.0. That matches stations at 3 and 5, with gaps of 2.',
      ],
    },
    complexity: 'O(n * I) time, where I is the iteration count, usually 60 to 100. O(1) extra space.',
    pitfalls: [
      'Writing `while lo < hi` with doubles: the loop may never end, so use a fixed count or `hi - lo > eps`.',
      'Choosing eps too small for large values: at 10^15, adjacent doubles are farther apart than 1e-7, so the loop hangs. Fixed iterations avoid this.',
      'Starting lo at 0 and dividing by mid: the first mid is positive, but check for zero if the range can collapse.',
      'Comparing floats for equality in the check: use a one-sided comparison, which keeps the predicate monotonic.',
    ],
    pointsToPonder: [
      'How many iterations does a range of 10^9 need to reach 10^-6 precision? Can you work that out by hand?',
      'Should you return lo, hi or their midpoint, and when does the choice matter?',
      'Why does a fixed iteration count behave better than eps at very large and very small values?',
    ],
    code: `def min_max_gap(stations, k):
    gaps = [b - a for a, b in zip(stations, stations[1:])]

    def needed(d):          # new stations so every gap <= d
        return sum(ceil(g / d) - 1 for g in gaps)

    lo, hi = 0.0, float(max(gaps))
    for _ in range(100):
        mid = (lo + hi) / 2
        if needed(mid) <= k:
            hi = mid
        else:
            lo = mid
    return hi`,
    practice: [69, 1870, 774, 644],
    snippet: '14-floating-point-binary-search',
  },

  '16. Binary Search on Bit Manipulation / Math': {
    crux: 'A closed-form function that only grows is a sorted array you never have to store, so search its input.',
    signals: [
      '"Return the square root rounded down. You must not use any built-in exponent function."',
      '"How many complete rows of the staircase will you build?"',
      '"f(x) is the number of zeroes at the end of x!... how many x have f(x) = k?"',
      '"The nth positive integer divisible by a or b": counting multiples is easy, and listing them isn\'t.',
      '"n + 1 integers in [1, n], without modifying the array, using constant extra space."',
    ],
    notThis: [
      'Pow(x, n) (LC 50) and Super Pow (LC 372) halve the exponent to compute a value, and nothing is being searched.',
      'Count Primes (LC 204) is a sieve, and First Missing Positive (LC 41) uses in-place marking: neither has a search to do.',
      'The function isn\'t monotonic, for example it depends on digit sums: you can\'t discard half of the range.',
    ],
    concepts: [
      'Treat f(x) as a sorted virtual array over x, then apply lower or upper bound to it.',
      'Sqrt is the last x with x * x <= n. Arranging Coins is the last k with k(k + 1) / 2 <= n. Same template, different function.',
      'Search over the value range, not indices: LC 287 asks how many elements are <= mid, and that count exceeds mid once mid reaches the duplicate.',
      'Preimage Size (LC 793): f(x) grows in steps of 5 values of x, so the answer is always 0 or 5.',
    ],
    example: {
      problem: 'Arranging Coins with n = 8',
      lc: 441,
      walkthrough: [
        'We want the last k with k(k + 1) / 2 <= 8. lo = 0, hi = 8, and mid rounds up.',
        'mid = 4. 4 * 5 / 2 = 10 > 8, so hi = 3.',
        'lo = 0, hi = 3, mid = 2. 2 * 3 / 2 = 3 <= 8, so lo = 2.',
        'lo = 2, hi = 3, mid = 3. 3 * 4 / 2 = 6 <= 8, so lo = 3.',
        'lo = hi = 3. The answer is 3: rows of 1, 2 and 3 coins use 6, and 2 are left over.',
      ],
    },
    complexity: 'O(C log R) time, where C is the cost of one function evaluation and R is the size of the range. O(1) space.',
    pitfalls: [
      'Computing mid * mid in 32 bits: for x near 2^31, mid can reach 46341 and overflow. Use long long, or compare mid with x / mid.',
      'Using hi = x in C++ and then x + 1 somewhere: x + 1 itself can overflow at INT_MAX.',
      'Using a float sqrt() for exact checks: rounding can make a perfect square look wrong.',
      'In LC 878, multiplying a * b for the lcm before dividing by gcd, and forgetting the final modulo.',
    ],
    pointsToPonder: [
      'What makes "count of elements <= mid" monotonic in LC 287, even though the array is unsorted?',
      'Why can Preimage Size (LC 793) only return 0 or 5?',
      'Could you beat the search with Newton\'s method for sqrt? What would you trade?',
    ],
    code: `def arrange_coins(n):
    lo, hi = 0, n
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2   # round up: lo = mid below
        if mid * (mid + 1) // 2 <= n:
            lo = mid
        else:
            hi = mid - 1
    return lo`,
    practice: [69, 367, 441, 287, 793],
    snippet: '13-square-root-using-binary-search',
  },

  '17. Binary Search on String / Hashing': {
    crux: 'If a match of length L exists, a match of length L - 1 does too, so binary search the length and check each one with a rolling hash.',
    signals: [
      '"Return any duplicated substring that has the longest possible length."',
      '"The longest common subpath shared by every friend": the same question across many sequences.',
      '"Maximum length of a subarray that appears in both arrays."',
      'String lengths around 10^4 to 10^5, where comparing all pairs of substrings is far too slow.',
    ],
    notThis: [
      'Shortest Palindrome (LC 214) and Longest Happy Prefix (LC 1392) have a fixed shape at one end: the KMP prefix function does it in O(n).',
      'Maximum Length of Repeated Subarray (LC 718) has small enough limits for an O(nm) DP, which is simpler to write.',
      'Longest Palindromic Substring doesn\'t fit directly: an even-length palindrome doesn\'t imply an odd one of length L - 1, so search the two parities apart or use Manacher.',
    ],
    concepts: [
      'Monotonic length: any substring of a repeated substring is also repeated, so feasibility flips once, from true to false.',
      'A rolling hash updates in O(1) per slide, so testing one length takes O(n).',
      'Collisions: either compare the actual text when two hashes match, or use two independent mods.',
    ],
    example: {
      problem: 'Longest Duplicate Substring with s = "banana"',
      lc: 1044,
      walkthrough: [
        'Search the length: lo = 0, hi = 5, and mid rounds up.',
        'mid = 3. The substrings are ban, ana, nan, ana. "ana" repeats at index 3, so lo = 3 and start = 3.',
        'lo = 3, hi = 5, mid = 4. The substrings are bana, anan, nana, with no repeat. So hi = 3.',
        'lo = hi = 3. The answer is s[3:6] = "ana".',
      ],
    },
    complexity: 'O(n log n) expected time, with O(n) work for each of about log n lengths. O(n) space for the hash set.',
    pitfalls: [
      'Trusting a hash match: a collision gives a wrong answer, so compare the substrings or use double hashing.',
      'Using a small mod with a large n: by the birthday bound, collisions appear much sooner than you expect.',
      'Letting the removed term go negative in a language with a signed `%`: add the mod back before reducing.',
      'Recording the length but not the position: you must return the substring, so save a start index when a check passes.',
    ],
    pointsToPonder: [
      'Which problems about substrings are monotonic in length, and which are not?',
      'How does a suffix array answer LC 1044 without any hash? What does it cost to write?',
      'If an adversary knew your base and mod, what could they do? How do random bases help?',
    ],
    code: `def longest_dup(s):
    MOD, BASE = (1 << 61) - 1, 131

    def find(L):            # start of a repeated length-L substring, or -1
        power = pow(BASE, L, MOD)
        h = 0
        for ch in s[:L]:
            h = (h * BASE + ord(ch)) % MOD
        seen = {h: [0]}
        for i in range(1, len(s) - L + 1):
            h = (h * BASE - ord(s[i-1]) * power + ord(s[i+L-1])) % MOD
            for j in seen.get(h, []):
                if s[j:j+L] == s[i:i+L]:    # rule out a collision
                    return i
            seen.setdefault(h, []).append(i)
        return -1

    lo, hi, start = 0, len(s) - 1, 0
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2
        i = find(mid)
        if i != -1:
            lo, start = mid, i
        else:
            hi = mid - 1
    return s[start:start+lo]`,
    practice: [718, 1062, 1044, 1923],
    snippet: '9-binary-search-on-answer-maximum-feasible-answer',
  },

  '18. Binary Search on Segment Tree / BIT / Ordered Set': {
    crux: 'When sorted data changes as you go, a tree or ordered set gives you the same "how many are below x?" lookup while allowing updates.',
    signals: [
      '"Return an array where counts[i] is the number of smaller elements to the right of nums[i]."',
      '"Count reverse pairs: i < j and nums[i] > 2 * nums[j]": a value condition and a position condition together.',
      '"How many times does value appear in the subarray from left to right?"',
      'Queries or insertions interleaved, with values that need sorted lookups, as in "book this range if it is free".',
    ],
    notThis: [
      'The array never changes and the query is a threshold: sort it once and use a plain bound (section 12).',
      'Range Frequency Queries (LC 2080) is static: a sorted position list per value and two bounds beat any tree.',
      'The query is a simple range sum with no search: a plain BIT or prefix sums is all you need.',
    ],
    concepts: [
      'Handle one condition by order of processing, and the other with the structure. In LC 315, walk from the right so only later elements are in the tree.',
      'Coordinate compression uses binary search to map large values to small ranks, so a BIT has one slot per distinct value.',
      'An ordered set gives lower_bound on changing data in O(log n), as with std::set. A BIT can also descend bit by bit to find the k-th element.',
    ],
    example: {
      problem: 'Count of Smaller Numbers After Self with nums = [5, 2, 6, 1]',
      lc: 315,
      walkthrough: [
        'Compress the values: ranks = [1, 2, 5, 6], so 1, 2, 5, 6 become ranks 1, 2, 3, 4. Walk from the right, with an empty tree.',
        'x = 1, rank 1. total(0) = 0 smaller values seen, then add rank 1.',
        'x = 6, rank 4. total(3) = 1 (just the 1), then add rank 4.',
        'x = 2, rank 2. total(1) = 1 (just the 1), then add rank 2.',
        'x = 5, rank 3. total(2) = 2 (the 1 and the 2), then add rank 3.',
        'The counts were found in reverse order as 0, 1, 1, 2, so the answer is [2, 1, 1, 0].',
      ],
    },
    complexity: 'O(n log n) time for sorting plus n tree operations at O(log n) each. O(n) space.',
    pitfalls: [
      'Using rank instead of rank - 1 for "strictly smaller": equal values then count as smaller.',
      'Using 0-based BIT indices: `i += i & -i` never moves from 0, so the loop hangs. Shift ranks to start at 1.',
      'In LC 493, doubling in 32 bits: 2 * nums[j] overflows, so use 64-bit values.',
      'Inserting into a sorted array and calling it O(log n): the search is fast, but the insert shifts O(n) elements.',
    ],
    pointsToPonder: [
      'Why does merge sort solve the same counting problem, and when would you choose it over a BIT?',
      'Which ordering of the elements turns a pair condition into a prefix query?',
      'How does a BIT find the k-th smallest without a separate binary search?',
    ],
    code: `from bisect import bisect_left

def count_smaller(nums):
    ranks = sorted(set(nums))
    tree = [0] * (len(ranks) + 1)

    def add(i):
        while i < len(tree):
            tree[i] += 1
            i += i & -i

    def total(i):           # how many seen with rank <= i
        s = 0
        while i > 0:
            s += tree[i]
            i -= i & -i
        return s

    out = []
    for x in reversed(nums):
        r = bisect_left(ranks, x) + 1   # 1-based rank
        out.append(total(r - 1))        # strictly smaller
        add(r)
    return out[::-1]`,
    practice: [2080, 729, 731, 315, 493],
    snippet: '18-stl-equivalent',
  },

  '19. Binary Search in Design / Online Problems': {
    crux: 'Append-only history is already sorted by time, so a read is simply "the last entry at or before t".',
    signals: [
      '"Returns the value with the largest timestamp_prev <= timestamp."',
      '"All the timestamps of set are strictly increasing": sorted for free.',
      '"Snap, then get the value at index for a given snap_id."',
      '"Who was leading the election at time t?"',
      '"After each character typed, suggest three products with that prefix."',
    ],
    notThis: [
      'Find Median from Data Stream (LC 295) inserts anywhere, so two heaps give O(log n) per add, while a sorted list costs O(n).',
      'Design Hit Counter (LC 362) only looks at the recent window: a queue or a fixed circular array is simpler.',
      'Range Module (LC 715) and My Calendar (LC 729) insert into the middle: use an ordered map (section 23).',
    ],
    concepts: [
      'Per-key history: store sorted lists per key, and appending keeps them sorted because time only moves forward.',
      'Precompute at write time so reads stay cheap. Online Election stores the leader after each vote, then searches the times.',
      'Snapshot Array saves memory by storing only (snap_id, value) changes for each index, not whole copies.',
    ],
    example: {
      problem: 'Time Based Key-Value Store: set("foo", "bar", 1), then set("foo", "bar2", 4), then get("foo", 3) and get("foo", 0)',
      lc: 981,
      walkthrough: [
        'After both sets, times["foo"] = [1, 4] and vals["foo"] = ["bar", "bar2"].',
        'get("foo", 3): lo = 0, hi = 2, mid = 1. times[1] = 4 > 3, so hi = 1.',
        'lo = 0, hi = 1, mid = 0. times[0] = 1 <= 3, so lo = 1. The range is closed, and vals[lo - 1] = vals[0] = "bar".',
        'get("foo", 0): mid = 1, 4 > 0, so hi = 1. Then mid = 0, 1 > 0, so hi = 0.',
        'lo = 0 means nothing was set by that time, so the result is "".',
      ],
    },
    complexity: 'set is O(1). get is O(log n) for n entries under that key. O(total entries) space.',
    pitfalls: [
      'Returning vals[lo] instead of vals[lo - 1]: the search finds the first entry after t, one past the one you want.',
      'Not handling lo == 0: a query before the first write must return the empty result, and vals[-1] silently reads the last value in Python.',
      'In Snapshot Array, returning the latest value when a snap_id has no entry: search for the last entry with id <= snap_id, and seed each index with (0, 0).',
      'In Search Suggestions (LC 1268), reading three products without checking they still start with the prefix.',
    ],
    pointsToPonder: [
      'What breaks if timestamps can arrive out of order, and which structure would you use then?',
      'How do you decide what to precompute on write versus search on read?',
      'Why does Snapshot Array store changes per index, and not one list per snapshot?',
    ],
    code: `class TimeMap:
    def __init__(self):
        self.times, self.vals = defaultdict(list), defaultdict(list)

    def set(self, key, value, t):       # t only increases
        self.times[key].append(t)
        self.vals[key].append(value)

    def get(self, key, t):
        times = self.times.get(key, [])
        lo, hi = 0, len(times)          # first entry with time > t
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if times[mid] > t:
                hi = mid
            else:
                lo = mid + 1
        return self.vals[key][lo - 1] if lo else ""`,
    practice: [528, 981, 911, 1146, 1268],
    snippet: '5-last-index-target',
  },

  '20. Binary Search on Monotonic Functions / Abstract BS': {
    crux: 'Binary search needs no sorted array, only a yes/no question whose answer flips once. Finding that question is the whole problem.',
    signals: [
      '"You must write an algorithm that runs in O(log n)", on data that isn\'t sorted.',
      '"Every element appears exactly twice, except for one": pairs shift after the single element, which creates a flip.',
      '"The array is sorted in ascending order of citations": h-index compares values with distance from the end.',
      '"Return any peak": any local direction is enough to choose a side.',
      '"Without modifying the array and using only constant extra space": search the value range instead.',
    ],
    notThis: [
      'The yes/no answer can flip more than once, such as "subarray sum >= x" with negative numbers: discarding half can throw away the answer.',
      'You need every element checked, as with an unsorted array and an arbitrary target: nothing lets you skip any.',
      'Super Egg Drop (LC 887) searches inside a DP step, so it is a DP problem first (section 14).',
    ],
    concepts: [
      'Reduce everything to F F F T T T: define a predicate on mid, then find the first true.',
      'A predicate can use structure, not values: in LC 540, it is "does the pair at this even index still match?".',
      'Prove the single flip: if the predicate is true at x, show it is true at every larger x.',
    ],
    example: {
      problem: 'Single Element in a Sorted Array with a = [1, 1, 2, 3, 3, 4, 4, 8, 8]',
      lc: 540,
      walkthrough: [
        'Before the single element, pairs start at even indices, and after it they start at odd ones. So "a[even] == a[even + 1]" is true and then false.',
        'lo = 0, hi = 8, mid = 4, which is even. a[4] = 3 and a[5] = 4 differ, so the single is at 4 or earlier. Set hi = 4.',
        'lo = 0, hi = 4, mid = 2, which is even. a[2] = 2 and a[3] = 3 differ, so hi = 2.',
        'lo = 0, hi = 2, mid = 1, which is odd, so step back to mid = 0. a[0] = a[1], so the single is after this pair. Set lo = 2.',
        'lo = hi = 2. The answer is a[2] = 2.',
      ],
    },
    complexity: 'O(C log R) time, where C is the cost of evaluating the predicate and R is the search range. For LC 540, that is O(log n). O(1) space.',
    pitfalls: [
      'Searching without checking monotonicity: the code runs and returns a confident wrong answer.',
      'In LC 540, not aligning mid to an even index: comparing at an odd mid reverses the meaning of the match.',
      'In LC 287, confusing index with value: lo and hi are values in [1, n], not positions.',
      'Skipping the case where no flip exists: decide what lo means if the predicate is never true.',
    ],
    pointsToPonder: [
      'What does it take for a yes/no question to be searchable? Can you state it in one sentence?',
      'Could a problem with two flips be split into two searches? When?',
      'For an unfamiliar problem, what should you try first to find the predicate?',
    ],
    code: `def single_non_duplicate(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if mid % 2 == 1:
            mid -= 1            # align to the start of a pair
        if a[mid] == a[mid + 1]:
            lo = mid + 2        # pairs intact: single is later
        else:
            hi = mid            # pairs broken: single is here or earlier
    return a[lo]`,
    practice: [875, 162, 153, 540, 287],
    snippet: '6-first-true-in-monotonic-predicate',
  },

  '21. Ternary Search / Unimodal Functions': {
    crux: 'A function that falls then rises has one best point: compare two probes and discard the third of the range that can\'t hold it.',
    signals: [
      '"Find x that minimizes..." where the cost clearly falls and then rises.',
      '"Minimize the sum of the Euclidean distances to all customers": convex in each coordinate.',
      'A mountain array, where neighbor comparisons also work.',
      'A cost built from sums of absolute values or squares of x, which are convex.',
    ],
    notThis: [
      'Minimum Moves to Equal Array Elements II (LC 462) is convex, but the median gives it directly with no search.',
      'Pour Water Between Buckets (LC 2137) has a monotonic check on the final level, so ordinary real-valued search applies (section 15).',
      'Three Equal Parts (LC 927) is about counting ones and comparing suffixes, despite the "three" in its name.',
      'The function has flat stretches away from the optimum: equal probes reveal nothing about which side to keep.',
    ],
    concepts: [
      'Unimodal means strictly up then strictly down, or the reverse. The two probes tell you which outer third is safe to drop.',
      'On integers, prefer binary search on the slope: test f(mid) against f(mid + 1). That needs fewer evaluations per halving.',
      'Multiple variables can nest: run a ternary search on x whose inner cost is a ternary search on y, as with LC 1515.',
    ],
    example: {
      problem: 'Peak Index in a Mountain Array with a = [0, 1, 3, 7, 6, 4, 2, 1]',
      lc: 852,
      walkthrough: [
        'lo = 0, hi = 7, third = 2, so m1 = 2 and m2 = 5. a[2] = 3 < a[5] = 4, so the peak is after m1. Set lo = 3.',
        'lo = 3, hi = 7, third = 1, so m1 = 4 and m2 = 6. a[4] = 6 > a[6] = 2, so the peak is before m2. Set hi = 5.',
        'hi - lo = 2, so stop probing and scan indices 3, 4 and 5, which hold 7, 6 and 4.',
        'The largest is at index 3, which is the answer.',
      ],
    },
    complexity: 'O(log n) evaluations, with a base of 3/2, so about 1.7 log2 n iterations at 2 evaluations each. O(1) space.',
    pitfalls: [
      'Using ternary search with plateaus: when two probes are equal away from the peak, either choice can discard the optimum.',
      'Looping until lo == hi on integers: small ranges stop shrinking, so stop at a gap of 2 and scan the rest.',
      'Assuming a function is unimodal without proof: check that it is convex, for example a sum of convex terms.',
      'Mixing up min and max: minimizing a function means keeping the side of the smaller probe.',
    ],
    pointsToPonder: [
      'Ternary search reduces the range by a third with two evaluations. Why is comparing mid and mid + 1 more efficient?',
      'When is a sum of functions unimodal, even if the terms aren\'t identical?',
      'Golden-section search reuses one probe each step. How does that lower the cost?',
    ],
    code: `def peak_ternary(a):
    lo, hi = 0, len(a) - 1
    while hi - lo > 2:
        third = (hi - lo) // 3
        m1, m2 = lo + third, hi - third
        if a[m1] < a[m2]:
            lo = m1 + 1         # peak is after m1
        else:
            hi = m2 - 1         # peak is before m2
    return max(range(lo, hi + 1), key=lambda i: a[i])`,
    practice: [852, 162, 462, 2137, 1515],
    snippet: '12-peak-element',
  },

  '22. Exponential Search / Unbounded Search': {
    crux: 'With no upper bound, double a probe until you pass the target, then binary search the last gap.',
    signals: [
      '"You do not know the array size... you have access to an ArrayReader."',
      '"Returns 2^31 - 1 if the index is out of bounds."',
      '"Infinite sorted array."',
      '"Find the smallest x where f(x) becomes positive", with no limit on x given.',
    ],
    notThis: [
      'The size is known: plain search (section 1) is simpler and has the same bound.',
      'The array is rotated or unsorted: doubling relies on values rising, so a probe says nothing about what comes after it.',
    ],
    concepts: [
      'Doubling finds a bound within a factor of 2 of the answer position p in about log p steps.',
      'After stopping, the answer is between hi // 2 and hi, a gap of size about p, and searching it takes another log p steps.',
      'The cost depends on p, not on the array size, so this also beats binary search on huge arrays when targets sit near the front.',
    ],
    example: {
      problem: 'Search in a Sorted Array of Unknown Size with [-1, 0, 3, 5, 9, 12], t = 9',
      lc: 702,
      walkthrough: [
        'hi = 1: get(1) = 0 < 9, so double. hi = 2: get(2) = 3 < 9, so double.',
        'hi = 4: get(4) = 9, which isn\'t less than 9, so stop. lo = 4 // 2 = 2.',
        'lo = 2, hi = 4, mid = 3. get(3) = 5 < 9, so lo = 4.',
        'lo = 4, hi = 4, mid = 4. get(4) = 9, so the answer is 4.',
      ],
    },
    complexity: 'O(log p) time, where p is the position of the target. O(1) space.',
    pitfalls: [
      'Starting at hi = 0: doubling 0 stays 0 and loops forever, so start at 1.',
      'Setting lo = hi + 1 or lo = hi after the doubling: use hi // 2, which still covers index 0 when hi = 1.',
      'Overflowing hi in a language with fixed-size ints when the range is huge: use a 64-bit type.',
      'Special-casing out-of-bounds reads: 2^31 - 1 simply reads as "too big", so the normal comparison already handles them.',
    ],
    pointsToPonder: [
      'Why does doubling cost only about as much as the binary search that follows it?',
      'Would tripling work? What changes in the total cost?',
      'When would this beat a normal binary search, even with a known array size?',
    ],
    code: `def search_unknown(reader, t):
    hi = 1
    while reader.get(hi) < t:   # out of bounds returns 2^31 - 1
        hi *= 2
    lo = hi // 2
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = reader.get(mid)
        if val == t:
            return mid
        if val < t:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    practice: [702],
    snippet: '1-classic-binary-search-exact-target',
  },

  '23. Bisect on Events / Sweep Line + BS': {
    crux: 'Keep events sorted by time, so a new interval only needs checking against its two neighbors.',
    signals: [
      '"Book the event if it does not cause a double booking": events arrive one at a time.',
      '"Add a range, remove a range, is this range covered?": maintained sorted intervals.',
      '"For each query, the smallest interval containing it": sort events and queries together.',
      '"Maximum profit from non-overlapping jobs": find the last job ending before this one starts.',
    ],
    notThis: [
      'All intervals are known up front and you just want a count: a plain sort and sweep or a heap needs no search, as in Meeting Rooms II (LC 253).',
      'The Skyline Problem (LC 218) needs the current tallest building, so use a sweep with a heap or multiset.',
      'Describe the Painting (LC 1943) only needs a difference map over the endpoints.',
      'My Calendar II and III (LC 731, 732) count overlap depth: a difference map or segment tree handles it better than neighbors alone.',
    ],
    concepts: [
      'If existing events never overlap, sorting by start also sorts by end, so only the immediate neighbors can collide.',
      'A new event [s, e) conflicts if the previous event ends after s or the next event starts before e.',
      'In C++, std::map or std::set does this with lower_bound and O(log n) inserts.',
    ],
    example: {
      problem: 'My Calendar I: book(10, 20), then book(15, 25), then book(20, 30)',
      lc: 729,
      walkthrough: [
        'book(10, 20): events is empty, so i = 0 with no neighbors. Insert. events = [(10, 20)].',
        'book(15, 25): i = 1. The previous event ends at 20, and 20 > 15, so they overlap. Return False.',
        'book(20, 30): i = 1. The previous event ends at 20, and 20 > 20 is false. There is no next event. Insert and return True.',
        'events = [(10, 20), (20, 30)]. Touching at 20 is fine, since end times are exclusive.',
      ],
    },
    complexity: 'O(log n) to find the position per booking. Inserting costs O(n) in a Python list or O(log n) in an ordered map. O(n) space.',
    pitfalls: [
      'Using >= where the interval is half-open: [10, 20) and [20, 30) don\'t overlap.',
      'Checking only the next neighbor: a long earlier event can still overlap the new one.',
      'Assuming a list insert is cheap: it shifts O(n) elements, so use an ordered map if many bookings arrive.',
      'Extending this to double bookings (LC 731): events then overlap, so sorting by start no longer sorts by end.',
    ],
    pointsToPonder: [
      'Why is checking two neighbors enough? What invariant does it rely on?',
      'How would you handle closed intervals, where touching does count as a conflict?',
      'For Range Module (LC 715), how many existing intervals can one add operation merge?',
    ],
    code: `from bisect import bisect_right

class MyCalendar:
    def __init__(self):
        self.events = []        # sorted, never overlapping

    def book(self, start, end):
        ev = self.events
        i = bisect_right(ev, (start, end))
        if i > 0 and ev[i - 1][1] > start:
            return False        # previous event runs into this one
        if i < len(ev) and ev[i][0] < end:
            return False        # this one runs into the next event
        ev.insert(i, (start, end))
        return True`,
    practice: [729, 253, 731, 1235, 1851],
    snippet: '2-lower-bound-first-index-target',
  },

  '24. Interactive / Guessing Game Binary Search': {
    crux: 'The data is hidden behind an API and you pay per call, so use each answer to throw away as much of the range as you can.',
    signals: [
      '"You should minimize the number of calls to the API."',
      '"You are given an API bool isBadVersion(version)."',
      '"I pick a number... call guess(num), which returns -1, 1 or 0."',
      '"You can\'t access the array directly, only through MountainArray.get", with "more than 100 calls" judged wrong.',
    ],
    notThis: [
      'Guess the Word (LC 843) gives a match count, not a direction: choose guesses that eliminate the most candidates.',
      'The data is directly readable: the API constraint is what sets this section apart, and otherwise it is section 1 or 2.',
    ],
    concepts: [
      'The API answer is a predicate, so First Bad Version is exactly "first true".',
      'Budget matters: 30 calls cover 2^30 values, so work out the budget before you start.',
      'Reuse calls where you can. In LC 1095, cache get() results, and in LC 1428, the staircase uses at most m + n calls.',
    ],
    example: {
      problem: 'First Bad Version with n = 5, where versions 4 and 5 are bad',
      lc: 278,
      walkthrough: [
        'lo = 1, hi = 5, mid = 3. is_bad(3) is false, so lo = 4.',
        'lo = 4, hi = 5, mid = 4. is_bad(4) is true, so hi = 4.',
        'lo = hi = 4. The answer is 4, after only 2 calls.',
      ],
    },
    complexity: 'O(log n) API calls and O(1) space. Find in Mountain Array takes about 3 log n calls.',
    pitfalls: [
      'Overflow in (lo + hi) / 2: LC 278 is known for this, since n goes up to 2^31 - 1.',
      'Reading guess() backwards: -1 means your guess is higher than the number.',
      'Calling the API a second time for the same mid: keep the value in a variable, as each call counts.',
      'Starting lo at 0: versions are numbered from 1, so version 0 doesn\'t exist.',
    ],
    pointsToPonder: [
      'What is the fewest calls any strategy can guarantee, and why does halving reach it?',
      'If "too high" and "too low" had different costs, should you still split in the middle?',
      'How is Guess the Word still about shrinking candidates, though it can\'t split them in half?',
    ],
    code: `def first_bad(n, is_bad):
    lo, hi = 1, n
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if is_bad(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    practice: [374, 278, 702, 1428, 1095],
    snippet: '6-first-true-in-monotonic-predicate',
  },

  '25. Binary Search on Answer — Rare / Tricky Variants': {
    crux: 'The outer search is the usual template, and all the difficulty hides in the check: a math rewrite, a counting argument or a graph search.',
    signals: [
      '"Maximum average value of a subarray of length at least k."',
      '"Run all n computers simultaneously... the maximum number of minutes."',
      '"Add k more power stations... maximize the minimum power of a city."',
      '"All digits of n in base k are 1": a small number of digit counts to try, each with its own search.',
    ],
    notThis: [
      'Closest Subsequence Sum (LC 1755) has n up to 40: split it in half, list the subset sums, and search the sorted side (meet in the middle).',
      'Minimum Time to Visit a Cell (LC 2577) needs Dijkstra, because waiting changes the arrival time at each cell.',
      'If the check is simple, this is an ordinary problem from section 4 or 5, so start there first.',
    ],
    concepts: [
      'Math rewrite: in LC 644, an average >= x becomes a sum of (a[i] - x) >= 0, solved with prefix sums and a running minimum.',
      'Capped contribution: in LC 2141, a battery can run at most t minutes in a t-minute plan, so it contributes min(b, t).',
      'Delayed updates: in LC 2528, walk left to right and place stations as far right as still helps, with a difference array to keep the check O(n).',
      'Two boundaries: in LC 793, the count of x with f(x) = k is the lower bound of k + 1 minus the lower bound of k.',
    ],
    example: {
      problem: 'Maximum Running Time of N Computers with n = 2, batteries = [3, 3, 3]',
      lc: 2141,
      walkthrough: [
        'A plan of t minutes needs n * t battery-minutes, and each battery gives at most min(b, t). lo = 0, hi = 9 // 2 = 4.',
        'mid = 2. Available = 2 + 2 + 2 = 6, and needed = 4. It fits, so lo = 2.',
        'lo = 2, hi = 4, mid = 3. Available = 3 + 3 + 3 = 9, and needed = 6. It fits, so lo = 3.',
        'lo = 3, hi = 4, mid = 4. Available = 3 + 3 + 3 = 9, and needed = 8. It fits, so lo = 4.',
        'lo = hi = 4. The answer is 4, since batteries can be swapped at any moment.',
      ],
    },
    complexity: 'O(n log S) time here, where S is the sum of the batteries. O(1) extra space. Harder checks raise the cost of each step.',
    pitfalls: [
      'Summing full battery values in LC 2141: a battery bigger than t is capped at t, or the check overstates what is available.',
      'In LC 644, requiring length exactly k: the running minimum must allow any start at least k positions back.',
      'In LC 483, 64-bit overflow when computing 1 + k + k^2 + ...: stop early once the sum passes n.',
      'Assuming the check is greedy without testing a small counterexample: a wrong check still returns an answer.',
    ],
    pointsToPonder: [
      'In LC 2141, why is the capped sum enough? What schedule actually achieves it?',
      'In LC 644, what is the rewrite that gets rid of the division, and where else could it apply?',
      'What would make you suspect a hard problem is really a search with a clever check?',
    ],
    code: `def max_run_time(n, batteries):
    def can(t):             # keep n computers running for t minutes?
        return sum(min(b, t) for b in batteries) >= n * t

    lo, hi = 0, sum(batteries) // n
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2
        if can(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`,
    practice: [287, 2141, 644, 774, 2528],
    snippet: '9-binary-search-on-answer-maximum-feasible-answer',
  },
}
