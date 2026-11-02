// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const twoPointers = {
  '1. Opposite Direction — Pair Sum / Target': {
    crux: 'On sorted data, one comparison of the two ends rules out a whole element, so the pair search drops from O(n²) to O(n).',
    signals: [
      '"Sorted in non-decreasing order, find two numbers such that they add up to a target": the textbook case.',
      '"All the triplets [nums[i], nums[j], nums[k]] such that the sum is 0" or "closest to target": fix one value, then run the pair search on the rest.',
      '"Count pairs whose sum is less than target": sort, and every position between the pointers counts at once.',
      '"Pick two numbers whose sum equals k and remove them": order doesn\'t matter, so you\'re free to sort.',
    ],
    notThis: [
      'Two Sum (LC 1) asks for original indices of unsorted data: sorting loses them, so use a hash map.',
      'Subarray Sum Equals K (LC 560) wants a contiguous range, not two chosen values: use prefix sums.',
      'Closest Subsequence Sum (LC 1755) has too many subsets to sort directly: split the array in half first, then run two pointers across the two lists of subset sums.',
    ],
    concepts: [
      'If a[l] + a[r] is too small, a[l] paired with anything at or left of r is also too small, so l is finished. The mirror argument finishes r when the sum is too big.',
      'k-Sum is k − 2 nested anchors around one pair search: O(n^(k−1)) time.',
      'For counting, when a[l] + a[r] < target every index in (l, r] pairs with l, so add r − l and move l.',
    ],
    example: {
      problem: 'Two Sum II with a = [2,3,4,8,11], target = 12',
      lc: 167,
      walkthrough: [
        'l = 0, r = 4: 2 + 11 = 13 is too big. 11 can\'t pair with anything, because 2 is already the smallest. r = 3.',
        'l = 0, r = 3: 2 + 8 = 10 is too small. l = 1.',
        'l = 1, r = 3: 3 + 8 = 11 is too small. l = 2.',
        'l = 2, r = 3: 4 + 8 = 12 matches. LC 167 is 1-indexed, so the answer is [3, 4].',
      ],
    },
    code: `# Two Sum II — sorted input, 1-indexed answer
def two_sum(a, target):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target:
            return [l + 1, r + 1]
        if s < target:
            l += 1
        else:
            r -= 1
    return []`,
    complexity: 'O(n) time and O(1) space for one pair search, plus O(n log n) if you must sort first. 3Sum is O(n²) and 4Sum is O(n³).',
    pitfalls: [
      'Using `l <= r` pairs an element with itself.',
      'In 3Sum, skipping duplicates only for the anchor still leaves repeated triplets: after a match, also move l past equal values.',
      'Counting pairs with r − l + 1 includes the pair (l, l). The right count is r − l.',
      'Sorting when the answer needs original indices: keep (value, index) pairs instead.',
    ],
    pointsToPonder: [
      'Why does a single comparison let you discard a whole row of the O(n²) pair grid?',
      'LC 1498 sorts a subsequence problem: why do only the minimum and maximum of a subsequence matter?',
      'What would you have to change if the array were sorted but rotated?',
    ],
    practice: [1099, 2824, 167, 15, 1498],
    snippet: '1-opposite-direction-pair-sum-in-sorted-array',
  },

  '2. Opposite Direction — Container / Area / Trapping': {
    crux: 'Start from the widest pair and always move the side that limits the answer, because moving the other side can never help.',
    signals: [
      '"Find two lines that together with the x-axis form a container": the area depends only on the two ends.',
      '"Compute how much water it can trap after raining": each bar holds min(best left, best right) − its height.',
      '"The number of triplets that can make triangles": sort, fix the longest side, and pair-count the other two.',
      '"Each boat carries at most two people" or "minimize the maximum pair sum": pair the extremes of a sorted array.',
    ],
    notThis: [
      'Trapping Rain Water II (LC 407) is a 2D grid: water escapes in any direction, so grow inward from the border with a heap.',
      'Largest Rectangle in Histogram (LC 84): the height is the minimum of every bar in the range, not just the two ends, so use a monotonic stack.',
      'Smallest Range II (LC 910) is listed here but has no converging pointers: sort, then try each split point between "add k" and "subtract k".',
    ],
    concepts: [
      'Container: area = min(h[l], h[r]) × (r − l). Moving the taller wall shrinks the width and can\'t raise the minimum, so only moving the shorter wall can improve the area.',
      'Trapping: if h[l] < h[r], the right side already has a wall at least as tall as h[l], so the water at l depends only on leftMax.',
      'Valid Triangle: with the longest side at k, if a[l] + a[r] > a[k] then every index in [l, r) also works with r, so add r − l.',
    ],
    example: {
      problem: 'Container With Most Water with h = [1,8,6,2,5]',
      lc: 11,
      walkthrough: [
        'l = 0, r = 4: min(1,5) × 4 = 4, so best = 4. The left wall is shorter, so l = 1.',
        'l = 1, r = 4: min(8,5) × 3 = 15, so best = 15. The right wall is shorter, so r = 3.',
        'l = 1, r = 3: min(8,2) × 2 = 4. The right wall is shorter, so r = 2.',
        'l = 1, r = 2: min(8,6) × 1 = 6. The right wall is shorter, so r = 1 and the pointers meet.',
        'The answer is 15, from the walls at indices 1 and 4.',
      ],
    },
    code: `# Container With Most Water
def max_area(h):
    l, r = 0, len(h) - 1
    best = 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]:
            l += 1
        else:
            r -= 1
    return best`,
    complexity: 'O(n) time and O(1) space. Add O(n log n) when you sort first, and Valid Triangle (LC 611) is O(n²) overall.',
    pitfalls: [
      'Moving the taller wall in Container: it looks harmless but skips the optimal pair.',
      'In Trapping Rain Water, updating leftMax after adding water can produce a negative amount for that bar: update it first.',
      'Using height × width with the taller wall: water spills over the shorter one.',
      'Valid Triangle with zero-length sides: 0 can never form a triangle, and the sum check handles it only if the array is sorted first.',
    ],
    pointsToPonder: [
      'Can you state, as a proof, why every pair skipped in Container is no better than the best you\'ve already seen?',
      'Why can Trapping Rain Water stop looking at the taller side, even though it doesn\'t know the exact maximum there?',
      'Bag of Tokens (LC 948) spends from both ends: what does each end stand for?',
    ],
    practice: [1877, 11, 881, 611, 42],
    snippet: '2-opposite-direction-container-with-most-water',
  },

  '3. Opposite Direction — Palindrome / Reversal': {
    crux: 'A palindrome is a set of mirrored pairs, so compare or swap from the outside in and stop at the first pair that fails.',
    signals: [
      '"Reads the same forward and backward", "after removing all non-alphanumeric characters": outer pointers, with skipping.',
      '"Can be palindrome after deleting at most one character": at the first mismatch, try skipping either side.',
      '"Reverse ... in-place with O(1) extra memory", or reverse only some characters such as vowels or letters.',
      '"Longest palindromic substring": still mirrored pairs, but you expand outward from each center.',
    ],
    notThis: [
      'Longest Palindromic Subsequence (LC 516) can delete anywhere, which needs DP. One skip is fine with pointers, but many skips branch too much.',
      'Palindrome Partitioning (LC 131) asks for every split: use backtracking, with pointers only for the check.',
      'Shortest Palindrome (LC 214) needs the longest palindromic prefix fast: use KMP or hashing, since pointers from every center would be O(n²).',
    ],
    concepts: [
      'Inward scan: while l < r, require s[l] == s[r]. A middle character in an odd-length string never needs a check.',
      'One deletion: the matched outer pairs stay matched, so only the part between the mismatch needs rechecking, and only two options exist.',
      'Expand from center: try 2n − 1 centers, because even-length palindromes center between two characters.',
    ],
    example: {
      problem: 'Valid Palindrome II with s = "abcca"',
      lc: 680,
      walkthrough: [
        'l = 0, r = 4: a equals a, so move inward to l = 1, r = 3.',
        'l = 1, r = 3: b is not c, so this is the one allowed deletion. Try both options.',
        'Delete s[1] and check indices 2 to 3: c equals c, then the pointers cross, so it\'s a palindrome.',
        'The first option works, so the answer is true: deleting "b" leaves "acca".',
      ],
    },
    code: `# Valid Palindrome II — at most one deletion
def valid_palindrome(s):
    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return is_pal(l + 1, r) or is_pal(l, r - 1)
        l += 1
        r -= 1
    return True`,
    complexity: 'O(n) time and O(1) space for the inward scan, including the one-deletion case, which is at most about 3 passes. Expand from center is O(n²) time.',
    pitfalls: [
      'In LC 680, trying only one of the two deletions: "cbbcc" works only by deleting the right character of the mismatch.',
      'In LC 125, not rechecking l < r inside the skip loops runs off the string when it has only punctuation.',
      'Expanding only around single characters misses even palindromes such as "abba".',
      'For Palindrome Linked List (LC 234), reversing the second half without restoring it leaves the caller\'s list changed.',
    ],
    pointsToPonder: [
      'Allowing k deletions branches up to 2^k ways. At what k would you switch to DP, as in Valid Palindrome III (LC 1216)?',
      'How would you reverse the words in a sentence in-place using only the reverse operation (LC 151)?',
      'Why does Manacher\'s algorithm beat expand-from-center, and which repeated work does it avoid?',
    ],
    practice: [344, 125, 917, 680, 5],
    snippet: '4-opposite-direction-palindrome-check',
  },

  '4. Opposite Direction — Sorted Array Manipulation': {
    crux: 'Use the sorted order to find the next element in constant time, and fill the output from whichever end you know for certain.',
    signals: [
      '"Sorted in non-decreasing order, return ... the squares of each number": the largest square is at one of the two ends.',
      '"Merge nums2 into nums1 ... nums1 has a length of m + n": write from the back to avoid overwriting.',
      '"Objects of the same color are adjacent ... without using the library\'s sort": three regions, three pointers.',
      '"Maximizes its advantage" or "each child gets at most one cookie": sort both sides, then match with pointers.',
    ],
    notThis: [
      'Sort Colors logic is unstable: LC 2161 says "relative order ... is maintained", so make separate passes into a new array instead.',
      'Next Permutation (LC 31) isn\'t sorted input: scan from the right for the first descent, then swap and reverse the suffix.',
      'Sorting more than three distinct values in place: partition recursively or use counting sort, because the Dutch flag only gives three regions.',
    ],
    concepts: [
      'When the largest output comes from an end of the input, fill the result from the back.',
      'Dutch National Flag: [0, lo) holds 0s, [lo, mid) holds 1s, (hi, n) holds 2s, and [mid, hi] is unprocessed.',
      'After swapping a[mid] with a[hi], don\'t advance mid: the value that arrived hasn\'t been examined yet.',
    ],
    example: {
      problem: 'Squares of a Sorted Array with a = [-4,-1,0,3]',
      lc: 977,
      walkthrough: [
        'k = 3, l = 0, r = 3: |-4| > |3|, so res[3] = 16 and l = 1.',
        'k = 2, l = 1, r = 3: |-1| < |3|, so res[2] = 9 and r = 2.',
        'k = 1, l = 1, r = 2: |-1| > |0|, so res[1] = 1 and l = 2.',
        'k = 0, l = 2, r = 2: the values tie, so take the right one. res[0] = 0.',
        'The result is [0,1,9,16].',
      ],
    },
    code: `# Squares of a Sorted Array — fill from the back
def sorted_squares(a):
    n = len(a)
    res = [0] * n
    l, r = 0, n - 1
    for k in range(n - 1, -1, -1):
        if abs(a[l]) > abs(a[r]):
            res[k] = a[l] ** 2
            l += 1
        else:
            res[k] = a[r] ** 2
            r -= 1
    return res`,
    complexity: 'O(n) time. O(1) extra space, not counting the result array. The sort adds O(n log n) for the greedy matching problems.',
    pitfalls: [
      'Squaring and filling from the front: the smallest square is somewhere in the middle, and you don\'t know where.',
      'In Sort Colors, advancing mid after a swap with hi skips the value that was just swapped in.',
      'In Merge Sorted Array, looping until both pointers are done: only j matters, because the rest of nums1 is already in place.',
      'In Advantage Shuffle, sorting nums2 directly loses its original positions: sort indices instead.',
    ],
    pointsToPonder: [
      'Why does merging from the back never overwrite an unread element of nums1?',
      'In Sort Colors, why can you advance mid after swapping with lo but not after swapping with hi?',
      'In Interval List Intersections (LC 986), why can you always discard the interval that ends first?',
    ],
    practice: [977, 88, 455, 75, 986],
    snippet: '6-same-direction-merge-two-sorted-arrays',
  },

  '5. Same Direction — Read/Write (In-Place Filtering)': {
    crux: 'The read pointer looks at every element and the write pointer marks the end of the kept part, so filtering needs no extra array.',
    signals: [
      '"Remove ... in-place ... return the number of elements" or "the first k elements should hold the result".',
      '"At most twice": compare against the kept element two slots back.',
      '"Move all 0\'s to the end while maintaining the relative order".',
      '"You must use only constant extra space" with a string or run-length result, as in String Compression.',
    ],
    notThis: [
      'Remove Duplicate Letters (LC 316) must find the smallest result in lexicographic order: use a monotonic stack that can undo earlier choices.',
      'Partition Labels (LC 763) is listed here but keeps everything: record each letter\'s last index and extend the current part greedily.',
      'Removing Stars (LC 2390) and LC 1047 undo earlier writes: step the write pointer back, which makes it a stack in disguise.',
    ],
    concepts: [
      'Invariant: a[0..w) is the correct answer for everything read so far, and w <= read always holds.',
      'To allow k copies in a sorted array, keep x if w < k or x != a[w − k]. Compare with the kept part, not the original neighbor.',
      'If order doesn\'t matter (LC 27), you may swap with the end instead, which saves writes when few elements are removed.',
    ],
    example: {
      problem: 'Remove Duplicates from Sorted Array II with a = [1,1,1,2,2,3]',
      lc: 80,
      walkthrough: [
        'x = 1 and x = 1: w is below 2, so keep both. a begins [1,1] and w = 2.',
        'x = 1: a[w − 2] = a[0] = 1 is the same value, so skip it. w stays 2.',
        'x = 2: a[0] = 1 differs, so a[2] = 2 and w = 3.',
        'x = 2: a[1] = 1 differs, so a[3] = 2 and w = 4.',
        'x = 3: a[2] = 2 differs, so a[4] = 3 and w = 5.',
        'Return 5, and the first five slots hold [1,1,2,2,3].',
      ],
    },
    code: `# Remove Duplicates II — keep at most 2 copies
def remove_duplicates(a):
    w = 0
    for x in a:
        if w < 2 or x != a[w - 2]:
            a[w] = x
            w += 1
    return w`,
    complexity: 'O(n) time and O(1) extra space. Each element is read once and written at most once.',
    pitfalls: [
      'Comparing with a[read − 2] instead of a[w − 2]: earlier writes have changed what\'s behind you, and the original neighbors no longer describe the kept part.',
      'Returning the last write index instead of the length: w is already the count.',
      'In String Compression (LC 443), forgetting that a count like 12 takes two characters.',
      'In Move Zeroes, overwriting instead of swapping means you must zero-fill the tail afterwards.',
    ],
    pointsToPonder: [
      'Why can the write pointer never overtake the read pointer, and why does that make overwriting safe?',
      'What single number changes between LC 26 and LC 80? How would you handle "at most k copies"?',
      'At what point does a write pointer that moves backwards become a stack?',
    ],
    practice: [27, 26, 283, 80, 443],
    snippet: '5-same-direction-read-write-in-place-filter',
  },

  '6. Same Direction — Merge Two Sequences': {
    crux: 'Keep one pointer per sequence and advance the one that can no longer contribute, so each element is passed only once.',
    signals: [
      '"Given two sorted arrays", "merge the two lists": the classic form.',
      '"Return the intersection ... each element should appear as many times as it shows in both".',
      '"A subsequence of a string is formed by deleting ... without disturbing the relative positions": match s against t, left to right.',
      '"Each list of intervals is pairwise disjoint and in sorted order": the same walk, but over intervals.',
    ],
    notThis: [
      'Merge k Sorted Lists (LC 23) has too many pointers to compare by hand: use a heap.',
      'Median of Two Sorted Arrays (LC 4) demands O(log(m+n)): a linear merge is too slow, so binary search the partition.',
      'Minimum Absolute Sum Difference (LC 1818) and LC 1877 are listed here but use different tools: binary search for the replacement, and pairing opposite ends.',
    ],
    concepts: [
      'The element at the behind pointer can\'t match anything later in the other sequence, so it\'s safe to pass it.',
      'For intervals, the one that ends first can\'t reach any later interval, so advance it.',
      'Shortest Word Distance (LC 243) is a merge of the two words\' position lists, done in one scan by remembering the last index of each.',
    ],
    example: {
      problem: 'Interval List Intersections with A = [[0,2],[5,10]], B = [[1,5],[8,12]]',
      lc: 986,
      walkthrough: [
        '[0,2] and [1,5]: lo = 1 and hi = 2, so add [1,2]. A\'s interval ends first, so i = 1.',
        '[5,10] and [1,5]: lo = 5 and hi = 5, so add [5,5]. Touching at a point counts. B\'s interval ends first, so j = 1.',
        '[5,10] and [8,12]: lo = 8 and hi = 10, so add [8,10]. A\'s interval ends first, so i = 2 and A runs out.',
        'The answer is [[1,2],[5,5],[8,10]].',
      ],
    },
    code: `# Interval List Intersections
def interval_intersection(A, B):
    i = j = 0
    res = []
    while i < len(A) and j < len(B):
        lo = max(A[i][0], B[j][0])
        hi = min(A[i][1], B[j][1])
        if lo <= hi:
            res.append([lo, hi])
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
    return res`,
    complexity: 'O(m + n) time. O(1) extra space, not counting the output.',
    pitfalls: [
      'Advancing both pointers after a match on intervals: one long interval can overlap several in the other list.',
      'Using lo < hi in LC 986 drops single-point intersections such as [5,5].',
      'Stopping the merge when one list runs out, then forgetting to copy the other list\'s tail.',
      'In Long Pressed Name (LC 925), not checking the characters left in typed after name is matched: "alex" against "aaleexa" must fail.',
    ],
    pointsToPonder: [
      'Which advance rule would you use if the intervals could overlap within one list?',
      'For LC 350 with one huge array on disk and one small array in memory, would you still merge?',
      'How does LC 392 change when you have a billion queries against one t?',
    ],
    practice: [88, 21, 392, 350, 986],
    snippet: '6-same-direction-merge-two-sorted-arrays',
  },

  '7. Fast-Slow Pointers (Linked List / Cycle Detection)': {
    crux: 'Two pointers at different speeds give you position without a length, and they must meet if there is a cycle.',
    signals: [
      '"Determine if the linked list has a cycle" or "return the node where the cycle begins", especially with "O(1) memory".',
      '"Return the middle node": fast covers the list while slow covers half of it.',
      '"Without modifying the array and using only constant extra space", with n + 1 values in the range [1, n]: treat values as next pointers.',
      '"This process ... loops endlessly in a cycle" in Happy Number: any repeated function has a hidden cycle.',
    ],
    notThis: [
      'Longest Cycle in a Graph (LC 2360) has many components: Floyd finds one cycle from one start, so mark nodes with visit times instead.',
      'Intersection of Two Linked Lists (LC 160) uses equal speeds: each pointer walks both lists, so they cover the same distance.',
      'Find All Duplicates (LC 442) has many duplicates and allows changes: mark visited values by negating at their index.',
    ],
    concepts: [
      'Inside a cycle the gap between the pointers changes by one per step, so fast can\'t jump over slow.',
      'Say the cycle entrance is F steps in and they meet C steps into the cycle. Slow then walked F + C, and fast walked twice that, so F + C is a multiple of the cycle length. Walking F more from the meeting point lands on the entrance.',
      'In LC 287, index i points to a[i]. Two indices share a value, so that value has two incoming edges, which makes it the cycle entrance.',
    ],
    example: {
      problem: 'Find the Duplicate Number with a = [1,3,4,2,2]',
      lc: 287,
      walkthrough: [
        'Follow i → a[i]: 0 → 1 → 3 → 2 → 4 → 2. Value 2 is entered twice. Start with slow = fast = a[0] = 1.',
        'Step 1: slow = a[1] = 3, and fast = a[a[1]] = a[3] = 2.',
        'Step 2: slow = a[3] = 2, and fast = a[a[2]] = a[4] = 2. They meet at 2.',
        'Phase 2: reset slow = a[0] = 1 and keep fast = 2. Move both one step: slow = a[1] = 3, fast = a[2] = 4.',
        'Move again: slow = a[3] = 2, fast = a[4] = 2. They meet, so the duplicate is 2.',
      ],
    },
    code: `# Find the Duplicate Number — Floyd on i -> a[i]
def find_duplicate(a):
    slow = fast = a[0]
    while True:
        slow = a[slow]
        fast = a[a[fast]]
        if slow == fast:
            break
    slow = a[0]
    while slow != fast:
        slow = a[slow]
        fast = a[fast]
    return slow`,
    complexity: 'O(n) time and O(1) space. Fast takes at most about 2n steps before the meeting, and phase 2 takes at most n.',
    pitfalls: [
      'Not checking fast and fast.next before moving two steps: a list without a cycle crashes on null.',
      'In phase 2, moving fast two steps: both pointers must move one step.',
      'For the middle of an even list, the loop condition decides which middle you get. LC 876 wants the second one, while Sort List (LC 148) wants the first one to split evenly.',
      'Starting phase 2 from the wrong place: slow must restart where phase 1 started.',
    ],
    pointsToPonder: [
      'Why must fast be exactly twice as fast for the phase 2 argument? Would speed 3 still detect a cycle?',
      'In LC 287, why is index 0 guaranteed to lie outside the cycle?',
      'What guarantees that Happy Number enters a cycle instead of growing forever?',
    ],
    practice: [141, 876, 202, 142, 287],
    snippet: '7-fast-slow-pointers-cycle-detection-floyd',
  },

  '8. Fixed-Size Sliding Window': {
    crux: 'Going from one window of size k to the next changes only two elements, so update the answer instead of recomputing it.',
    signals: [
      '"Of length k", "size k" or "k consecutive": the size is handed to you.',
      '"Permutation of s1" or "anagrams of p": the window size is the pattern\'s length.',
      '"Take one card from the beginning or the end, exactly k cards": what you leave behind is a window of size n − k.',
      '"Two distinct indices i and j such that abs(i − j) <= k": a set holding the last k elements.',
    ],
    notThis: [
      '"Longest" or "shortest" with no given length: the size must change, so use a variable window.',
      'Sliding Window Maximum (LC 239) can\'t be updated by add and subtract, because removing the maximum loses information: use a monotonic deque.',
      'Sliding Window Median (LC 480) needs an ordered structure: use two heaps or a multiset.',
    ],
    concepts: [
      'Each step does three things: add a[i], remove a[i − k] once i >= k, and record the answer once i >= k − 1.',
      'This works when the summary can be undone: sums, counts and frequency arrays can, but max and min can\'t.',
      'Complement trick: choosing k from both ends means leaving a middle window of size n − k, so minimize that instead.',
    ],
    example: {
      problem: 'Maximum Number of Vowels with s = "abciiidef", k = 3',
      lc: 1456,
      walkthrough: [
        'i = 0 to 2: "abc" has 1 vowel, so count = 1 and best = 1.',
        'i = 3: add i, remove a, so "bci" has count = 1.',
        'i = 4: add i, remove b, so "cii" has count = 2 and best = 2.',
        'i = 5: add i, remove c, so "iii" has count = 3 and best = 3.',
        'i = 6: add d, remove i, so "iid" has count = 2.',
        'i = 7: add e, remove i, so "ide" has count = 2.',
        'i = 8: add f, remove i, so "def" has count = 1. The answer is 3.',
      ],
    },
    code: `# Maximum Vowels in a Window of Size k
def max_vowels(s, k):
    vowels = set("aeiou")
    count = best = 0
    for i, c in enumerate(s):
        count += c in vowels
        if i >= k:
            count -= s[i - k] in vowels
        if i >= k - 1:
            best = max(best, count)
    return best`,
    complexity: 'O(n) time. O(1) space for a count or a fixed alphabet, and O(k) for a hash map of the window.',
    pitfalls: [
      'Off-by-one on the two checks: remove when i >= k, and record when i >= k − 1.',
      'Initializing best to 0 when window sums can be negative, as in LC 643: start from the first full window instead.',
      'Forgetting that k can exceed the length when the problem allows it: LC 438 has to return an empty list.',
      'In LC 219, the set must hold at most k elements before the membership check, because the gap can equal k but not exceed it.',
    ],
    pointsToPonder: [
      'Which window summaries can be undone in O(1), and which can\'t?',
      'How would you recognize the complement trick when the problem never says "window"?',
      'In Grumpy Bookstore Owner (LC 1052), what exactly does the window measure?',
    ],
    practice: [643, 2379, 1456, 567, 438],
    snippet: '8-fixed-size-sliding-window-max-sum-of-window-k',
  },

  '9. Variable-Size Sliding Window — Longest / Maximum': {
    crux: 'Grow the right side every step and move the left side only as far as needed to make the window valid again.',
    signals: [
      '"Longest substring" or "maximum length subarray" with a limit such as "at most k distinct" or "without repeating".',
      '"You can flip at most k 0\'s" or "change any character ... at most k times": the budget is how many changes the window holds.',
      '"Total cost ... less than or equal to maxCost": a running sum against a budget, with no negative costs.',
      '"Each basket can only hold a single type of fruit" with two baskets: "at most two distinct" in disguise.',
    ],
    notThis: [
      'Maximum Size Subarray Sum Equals k (LC 325) allows negatives: adding an element can make the sum go either way, so use a prefix sum and a hash map.',
      'Maximum Points in an Archery Competition (LC 2212) is listed here but picks arbitrary sections: with 12 sections, try every subset with a bitmask.',
      'Longest Palindromic Substring (LC 5): shrinking a non-palindrome doesn\'t tend to make it one, so validity isn\'t monotonic. Expand from each center.',
    ],
    concepts: [
      'The window works only if validity is monotonic: if a window is valid, so is every window inside it.',
      'Every index enters and leaves the window at most once, so the nested loop is still O(n) in total.',
      'Some problems need a rephrasing first. LC 1838 sorts, then asks: how much does it cost to raise the window to its largest value?',
    ],
    example: {
      problem: 'Max Consecutive Ones III with a = [1,0,1,0,0,1,1], k = 1',
      lc: 1004,
      walkthrough: [
        'right = 0 to 2: the window [1,0,1] has 1 zero, which is allowed. best = 3.',
        'right = 3: zeros = 2 is too many. Drop a[0] = 1 and a[1] = 0, so left = 2 and zeros = 1. Length is 2.',
        'right = 4: zeros = 2 again. Drop a[2] = 1 and a[3] = 0, so left = 4 and zeros = 1. Length is 1.',
        'right = 5: the window [0,1] has length 2.',
        'right = 6: the window [0,1,1] has length 3, which ties best. The answer is 3.',
      ],
    },
    code: `# Max Consecutive Ones III
def longest_ones(a, k):
    left = zeros = best = 0
    for right, x in enumerate(a):
        zeros += x == 0
        while zeros > k:
            zeros -= a[left] == 0
            left += 1
        best = max(best, right - left + 1)
    return best`,
    complexity: 'O(n) time, since left only moves forward. O(1) space with a single counter, or O(alphabet) with a frequency map.',
    pitfalls: [
      'Updating best before the shrink loop records an invalid window.',
      'When using a map, leaving keys with count 0 makes len(map) overcount the distinct values.',
      'Applying this to arrays with negative numbers: a longer window is no longer always a bigger sum.',
      'In LC 1493 you must delete one element, so an array of all 1s gives n − 1, not n.',
    ],
    pointsToPonder: [
      'What makes "at most k" monotonic, and why isn\'t "exactly k" monotonic?',
      'LC 424 keeps a max frequency that never goes down. Why doesn\'t that stale value give a wrong answer? See section 24.',
      'Which problems here need sorting first, and why is a subarray of the sorted array still the right thing to search?',
    ],
    practice: [3090, 3, 1004, 424, 340],
    snippet: '9-variable-window-longest-non-shrinkable-template',
  },

  '10. Variable-Size Sliding Window — Shortest / Minimum': {
    crux: 'Grow until the window is valid, then shrink from the left for as long as it stays valid, recording the answer at each step.',
    signals: [
      '"Minimum length of a subarray whose sum is greater than or equal to target", with positive numbers.',
      '"Minimum window substring ... every character in t is included".',
      '"Minimum number of consecutive cards you have to pick up to have a pair of matching cards".',
      '"Minimum number of operations to reduce x to 0" by removing from the ends: find the longest middle part with sum total − x.',
    ],
    notThis: [
      'Shortest Subarray with Sum at Least K (LC 862) allows negatives: shrinking can raise the sum, so use a deque over prefix sums.',
      'Minimum Window Subsequence (LC 727) cares about order, and a count can\'t capture that: scan forward to match, then backward to tighten, or use DP.',
      'Smallest Range Covering Elements from K Lists (LC 632) has several sorted lists: keep one pointer per list and a heap of the current values.',
    ],
    concepts: [
      'Here, validity must be upward-monotonic: if a window is valid, so is every window that contains it.',
      'Record the answer inside the shrink loop, because this is the only time the window is known to be valid.',
      'Use a "formed" counter so that each step checks validity in O(1), instead of comparing whole frequency maps.',
    ],
    example: {
      problem: 'Minimum Size Subarray Sum with a = [2,3,1,2,4,3], target = 7',
      lc: 209,
      walkthrough: [
        'right = 0 to 2: the sum reaches 2, 5, then 6, which is still under 7.',
        'right = 3: sum = 8, so length 4 gives best = 4. Remove 2, so sum = 6 and left = 1.',
        'right = 4: sum = 10, length 4. Remove 3, so sum = 7 and left = 2. Length 3 gives best = 3. Remove 1, so sum = 6 and left = 3.',
        'right = 5: sum = 9, length 3. Remove 2, so sum = 7 and left = 4. Length 2 gives best = 2. Remove 4, so sum = 3 and left = 5.',
        'The answer is 2, for the subarray [4,3].',
      ],
    },
    code: `# Minimum Size Subarray Sum
def min_subarray_len(target, a):
    left = total = 0
    best = inf
    for right, x in enumerate(a):
        total += x
        while total >= target:
            best = min(best, right - left + 1)
            total -= a[left]
            left += 1
    return 0 if best == inf else best`,
    complexity: 'O(n) time. O(1) space, or O(alphabet) when tracking characters.',
    pitfalls: [
      'Returning inf when no window qualifies: most of these problems want 0, -1 or an empty string.',
      'Using `if` instead of `while`: one element leaving may not be enough to reach the shortest window.',
      'In Minimum Window Substring, decrementing "formed" on every removal: do it only when a count drops below what\'s needed.',
      'Using a plain window on values that can be negative: removing a negative raises the sum, so the shrink rule no longer holds.',
    ],
    pointsToPonder: [
      'Why does the window for "shortest" record inside the loop, while the one for "longest" records after it?',
      'Which question is really being asked by LC 1658: shortest on the outside, or longest on the inside?',
      'How would you handle LC 209 if values could be zero? What about negative?',
    ],
    practice: [209, 2260, 1658, 1234, 76],
    snippet: '10-variable-window-shortest-shrinkable-template',
  },

  '11. Sliding Window — Exact Count / "Exactly K" Pattern': {
    crux: 'To count subarrays, add the number of valid windows ending at each right, and rewrite "exactly k" as atMost(k) − atMost(k − 1).',
    signals: [
      '"Number of subarrays with exactly k different integers" or "exactly k odd numbers".',
      '"Number of contiguous subarrays where the product ... is strictly less than k": every shorter suffix also qualifies.',
      '"Contains at least one occurrence of all these characters" or "appears at least k times": once valid, every earlier start also counts.',
      '"The minimum value equals minK and the maximum equals maxK": track the last position of each requirement.',
    ],
    notThis: [
      'Subarray Sum Equals K (LC 560) allows negatives: atMost isn\'t monotonic there, so use a prefix sum and a hash map.',
      'Number of Substrings With Only 1s (LC 1513) needs no window: each run of length m contributes m(m + 1)/2.',
      'Questions that want the longest such subarray rather than a count: a plain variable window is simpler.',
    ],
    concepts: [
      'If [left, right] is valid and validity is monotonic, each of the right − left + 1 subarrays ending at right is valid too.',
      'Exactly k is not monotonic, because shrinking can leave or re-enter it. atMost(k) is monotonic, so subtract.',
      'For "at least", shrink while the window stays valid, then add left: each start before left also works.',
    ],
    example: {
      problem: 'Subarrays with K Different Integers with a = [1,2,1,2,3], k = 2',
      lc: 992,
      walkthrough: [
        'atMost(2), right = 0 to 3: the windows have lengths 1, 2, 3, 4, so total = 10.',
        'atMost(2), right = 4: 3 makes three distinct. Drop 1, 2, 1 to get left = 3. The window [2,3] adds 2, so total = 12.',
        'atMost(1): every value differs from its neighbor, so each right keeps a window of length 1. The total is 5.',
        'The answer is 12 − 5 = 7.',
      ],
    },
    code: `# Subarrays with exactly k distinct values
def at_most(a, k):
    cnt = Counter()
    left = total = 0
    for right, x in enumerate(a):
        cnt[x] += 1
        while len(cnt) > k:
            cnt[a[left]] -= 1
            if cnt[a[left]] == 0:
                del cnt[a[left]]
            left += 1
        total += right - left + 1
    return total

def exactly(a, k):
    return at_most(a, k) - at_most(a, k - 1)`,
    complexity: 'O(n) time for two passes. O(k) space for the map.',
    pitfalls: [
      'Adding 1 per right instead of right − left + 1: that counts windows rather than subarrays.',
      'In Subarray Product Less Than K, not handling k <= 1: no product of positive integers is below 1, and the window would empty and then cross.',
      'Mixing up the two counts: "at most" adds right − left + 1, while "at least" adds left.',
      'Letting the count overflow 32-bit: up to n(n + 1)/2 subarrays exist.',
    ],
    pointsToPonder: [
      'Why does atMost(k) − atMost(k − 1) still work when neither count is itself the answer?',
      'Can you solve LC 992 in one pass by keeping two left pointers?',
      'For Count Subarrays With Fixed Bounds (LC 2444), why is subtraction awkward and last-position tracking easier?',
    ],
    practice: [1513, 713, 930, 1248, 992],
    snippet: '11-sliding-window-exactly-k-via-atmost',
  },

  '12. Sliding Window — String Pattern Matching': {
    crux: 'Anagrams and character coverage ignore order, so a window with a frequency table can answer them, but exact-order matching can\'t.',
    signals: [
      '"One of s1\'s permutations is the substring of s2" or "all the start indices of p\'s anagrams": fixed window of size len(p).',
      '"Every character in t (including duplicates) is included in the window": variable window with a coverage counter.',
      '"All binary codes of length k": collect the set of k-length windows and count how many you found.',
      '"Replace a substring so that each character appears n/4 times": window over what you can change, valid when the rest is balanced.',
    ],
    notThis: [
      'Find the Index of the First Occurrence (LC 28) needs exact order: use KMP or a rolling hash.',
      'Group Anagrams (LC 49) compares whole strings: there\'s no window, so hash each string\'s sorted form or letter counts.',
      'Longest Duplicate Substring (LC 1044) has no fixed length: binary search on the length, with rolling hashes.',
    ],
    concepts: [
      'For a small alphabet, compare two 26-element arrays: each comparison is O(26), which is O(1).',
      'To avoid the comparison, keep a count of the letters whose frequency matches, and adjust only the two letters that changed.',
      'Repeated DNA Sequences (LC 187) and LC 1461 need window identity, not frequency: hash the substring or roll a bitmask.',
    ],
    example: {
      problem: 'Permutation in String with p = "ab", s = "eidbaooo"',
      lc: 567,
      walkthrough: [
        'The window size is 2 and need = {a: 1, b: 1}.',
        'i = 0: the window has e. It\'s too short to match.',
        'i = 1: the window "ei" doesn\'t match.',
        'i = 2: add d, drop e. The window "id" doesn\'t match.',
        'i = 3: add b, drop i. The window "db" doesn\'t match.',
        'i = 4: add a, drop d. The window "ba" has a: 1, b: 1, which matches need. Return true.',
      ],
    },
    code: `# Permutation in String
def check_inclusion(p, s):
    k = len(p)
    need, window = [0] * 26, [0] * 26
    for c in p:
        need[ord(c) - 97] += 1
    for i, c in enumerate(s):
        window[ord(c) - 97] += 1
        if i >= k:
            window[ord(s[i - k]) - 97] -= 1
        if window == need:
            return True
    return False`,
    complexity: 'O(26 · n) time, which is O(n), and O(26) space. A generic map costs O(alphabet) space instead.',
    pitfalls: [
      'Assuming lowercase only: LC 76 includes uppercase, so 26 slots aren\'t enough.',
      'Dropping s[i − k + 1] instead of s[i − k]: that removes a character still in the window.',
      'Rebuilding the frequency table for each window turns O(n) into O(nk).',
      'For LC 76, counting a satisfied letter twice: only count it when its frequency reaches the required amount exactly.',
    ],
    pointsToPonder: [
      'How do you recognize that order doesn\'t matter in the question\'s wording?',
      'How would you update a matches counter when one letter enters and another leaves?',
      'What would have to change in LC 567 if s1 could contain wildcards?',
    ],
    practice: [567, 438, 3, 424, 76],
    snippet: '13-sliding-window-find-all-anagrams',
  },
}
