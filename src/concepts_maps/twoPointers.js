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

  '13. Sliding Window + Hash Map / Frequency Counter': {
    crux: 'The map is the window\'s memory: decide what it stores (counts, last index or distinct total) so that validity is one O(1) check.',
    signals: [
      '"Without repeating characters" or "all the elements of the subarray are distinct": a set, or a map of last positions.',
      '"Contains at most k distinct" or "you can only pick from two baskets": the map\'s size is the constraint.',
      '"Minimum number of consecutive cards ... to have a pair of matching cards": map each value to where you last saw it.',
      '"At least k pairs (i, j) such that arr[i] == arr[j]": adding x creates count[x] new pairs, so keep a running pair total.',
    ],
    notThis: [
      'Max Consecutive Ones III (LC 1004) and LC 1248 are listed here, but one integer counter is enough: don\'t pay for a map.',
      'Lowercase-only strings: a 26-element array is faster and simpler than a hash map.',
      'Windows that need the maximum or the median, such as LC 1438: a map has no order, so use a deque or a multiset.',
    ],
    concepts: [
      'Count map: use it when validity depends on how many of each value are inside. Delete keys at zero so that its size equals the distinct count.',
      'Last-index map: left can jump straight past a repeat instead of walking there one step at a time.',
      'Keep derived totals (distinct, pairs, formed) alongside the map, and update them only on the transitions 0 → 1 and 1 → 0.',
    ],
    example: {
      problem: 'Longest Substring Without Repeating Characters with s = "abba"',
      lc: 3,
      walkthrough: [
        'right = 0, a: unseen. last[a] = 0, and the length is 1, so best = 1.',
        'right = 1, b: unseen. last[b] = 1, and the length is 2, so best = 2.',
        'right = 2, b: last[b] = 1 is inside the window, so left = 2. last[b] = 2, and the length is 1.',
        'right = 3, a: last[a] = 0 is before left, so it\'s stale and left stays 2. last[a] = 3, and the length is 2.',
        'The answer is 2.',
      ],
    },
    code: `# Longest Substring Without Repeating Characters
def length_of_longest(s):
    last = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        best = max(best, right - left + 1)
    return best`,
    complexity: 'O(n) expected time. O(min(n, alphabet)) space, or O(k) when the map is capped at k distinct keys.',
    pitfalls: [
      'Jumping left without checking last[c] >= left: on "abba", the final a would move left backwards to 1 and report a window containing two b\'s.',
      'Leaving zero-count keys in the map, so len(map) overcounts the distinct values.',
      'In LC 2537, updating in the wrong order: add count[x] pairs before incrementing on entry, and decrement before subtracting on exit.',
      'Looking up a missing key in a C++ unordered_map inserts it, which can quietly inflate its size.',
    ],
    pointsToPonder: [
      'When does a last-index map beat a count map, and when can\'t it replace one?',
      'Can a hash map make the worst case worse than O(n), and when would that matter?',
      'In Minimum Window Substring (LC 76), why is one "formed" integer enough to know the whole map is satisfied?',
    ],
    practice: [3, 904, 2260, 438, 76],
    snippet: '12-sliding-window-minimum-window-substring',
  },

  '14. Sliding Window + Monotonic Deque': {
    crux: 'Keep only the candidates that could still become the window\'s best, in sorted order, so the answer is always at the front.',
    signals: [
      '"Return the max sliding window": the direct form.',
      '"You can jump at most k steps" or "j − i <= k": dp[i] needs the best of the last k values.',
      '"The absolute difference between any two elements ... is less than or equal to limit": a window that needs both its max and its min.',
      '"Shortest subarray with sum at least K", where values can be negative: a deque over prefix sums.',
    ],
    notThis: [
      'Median or k-th of a window (LC 480): a deque only exposes the extreme, so use two heaps or a multiset.',
      'Number of Visible People in a Queue (LC 1944) has no window to expire: a monotonic stack is enough.',
      'Maximum Sum Circular Subarray (LC 918) is usually simpler with Kadane: take the larger of the best subarray and the total minus the worst subarray.',
    ],
    concepts: [
      'Before pushing x, pop every back element that is no better than x: it is older and weaker, so it can never be the answer again.',
      'Store indices, not values, so that you can tell when the front has left the window.',
      'DP optimization: dp[i] = a[i] + max(dp[i − k..i − 1]) drops from O(nk) to O(n) with a deque of dp values.',
    ],
    example: {
      problem: 'Sliding Window Maximum with a = [1,3,-1,-3,5], k = 3',
      lc: 239,
      walkthrough: [
        'i = 0, x = 1: the deque holds indices [0].',
        'i = 1, x = 3: 3 beats 1, so pop index 0. The deque is [1].',
        'i = 2, x = -1: push, giving [1,2]. The window is full and the front is a[1] = 3, so the result is [3].',
        'i = 3, x = -3: push, giving [1,2,3]. Index 1 is still inside, so the result is [3,3].',
        'i = 4, x = 5: pop all three, giving [4]. The result is [3,3,5].',
      ],
    },
    code: `# Sliding Window Maximum
def max_sliding_window(a, k):
    dq = deque()  # indices, with values decreasing
    res = []
    for i, x in enumerate(a):
        while dq and a[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(a[dq[0]])
    return res`,
    complexity: 'O(n) time, since each index is pushed and popped at most once. O(k) space.',
    pitfalls: [
      'Storing values instead of indices: you can\'t tell whether the front has expired, and duplicates get confused.',
      'Off-by-one on expiry: the front is out when dq[0] <= i − k.',
      'In DP versions, reading the front before removing expired indices uses a state that\'s out of reach.',
      'In LC 1438, moving left by checking values rather than indices: compare the front index with left before popping.',
    ],
    pointsToPonder: [
      'Why does each pop never lose an answer? State it as "older and weaker".',
      'LC 862 pops from both ends for different reasons. What does each pop mean?',
      'When is a deque DP possible? What must the transition look like for the optimization to apply?',
    ],
    practice: [1696, 1438, 239, 1425, 862],
    snippet: '14-sliding-window-monotonic-deque',
  },

  '15. Sliding Window + Heap / Multiset': {
    crux: 'When you need more than the extreme, such as a median or k-th value, keep the window in an ordered structure that supports deletion.',
    signals: [
      '"Median of each window": the classic reason to use two heaps or a multiset.',
      '"Each price ... may be corrected" with "current", "maximum" and "minimum" queries (LC 2034): heap entries can go stale.',
      '"Smallest range that includes at least one number from each of the k lists": a heap of one pointer per list.',
      '"Add a number" and "find the median" with no removals (LC 295): two heaps, without the expiry work.',
    ],
    notThis: [
      'You only need the maximum or minimum of a window: a monotonic deque is O(n) and has no log factor.',
      'Only a sum or a count matters: subtract the element that leaves, and no ordered structure is needed.',
      'Values come from a small range: a frequency array with a moving median pointer can avoid the log factor entirely.',
    ],
    concepts: [
      'Ordered multiset: insert and erase in O(log k). In C++, erase by iterator so that only one copy goes.',
      'Two heaps: a max-heap for the lower half and a min-heap for the upper half, with sizes differing by at most 1.',
      'Lazy deletion: heaps can\'t delete from the middle, so note what expired and discard it only when it reaches the top.',
    ],
    example: {
      problem: 'Sliding Window Median with a = [1,3,-1,-3,5], k = 3',
      lc: 480,
      walkthrough: [
        'i = 0 and 1: the sorted window grows to [1,3], which isn\'t full yet.',
        'i = 2: insert -1, giving [-1,1,3]. The median is 1.',
        'i = 3: insert -3, then remove a[0] = 1, giving [-3,-1,3]. The median is -1.',
        'i = 4: insert 5, then remove a[1] = 3, giving [-3,-1,5]. The median is -1.',
        'The result is [1,-1,-1].',
      ],
    },
    code: `# Sliding Window Median — sorted list version
def median_window(a, k):
    win, res = [], []
    for i, x in enumerate(a):
        insort(win, x)
        if i >= k:
            win.pop(bisect_left(win, a[i - k]))
        if i >= k - 1:
            res.append((win[k // 2] + win[(k - 1) // 2]) / 2)
    return res`,
    complexity: 'O(n log k) time with a balanced tree or indexable sorted structure, and O(k) space. The plain sorted list above is O(nk) because inserting shifts elements, while heaps with lazy deletion are O(n log n).',
    pitfalls: [
      'multiset.erase(value) in C++ removes every copy: use erase(find(value)).',
      'Adding two 32-bit values for an even-sized median can overflow: LC 480 allows values up to 2^31 − 1, so widen first.',
      'With lazy deletion, the heaps\' actual sizes include dead entries: balance using counts of live elements.',
      'Advancing a multiset iterator from begin() on every step costs O(k), which silently makes the loop O(nk).',
    ],
    pointsToPonder: [
      'Why can heaps get away with deleting late? What must be true of an expired element before it reaches the top?',
      'How would you move a median iterator by one position after each insert and erase, rather than recomputing it?',
      'For LC 1438, the deque and multiset both work. What would make you pick the slower one?',
    ],
    practice: [2034, 1438, 295, 632, 480],
    snippet: '15-sliding-window-multiset',
  },

  '16. Sliding Window on Circular Array': {
    crux: 'Handle wraparound by walking indices modulo n, or turn it inside out and work on the complement.',
    signals: [
      '"Circular array", "the next element of the last is the first", or "swap to group ... in a circular array".',
      '"Take one card from the beginning or the end": the k cards form a window across the wrap point.',
      '"Remove the character at the start and append it to the end": any rotation is allowed, which is the same as a circle.',
      '"Infinitely appending the elements of nums": whole copies plus one wrapped window.',
    ],
    notThis: [
      'Next Greater Element II (LC 503) wraps but has no window: walk twice with a monotonic stack.',
      'Maximum Sum Circular Subarray (LC 918) has no fixed size: use Kadane on the total minus the minimum subarray, or a deque over prefix sums.',
      'House Robber II (LC 213) is circular only through a constraint: run the DP twice, once excluding each end.',
    ],
    concepts: [
      'Walk i from 0 to n + k − 2 and read a[i % n]: that visits each of the n windows exactly once, with no need to copy the array.',
      'Complement: choosing a wrapping window of size k is the same as leaving a linear window of size n − k.',
      'Grouping: to gather all m ones, slide a window of size m. The swaps needed equal the zeros inside it.',
    ],
    example: {
      problem: 'Minimum Swaps to Group All 1\'s Together II with a = [0,1,0,1,1,0,0]',
      lc: 2134,
      walkthrough: [
        'There are three 1s, so k = 3. Slide a size-3 window and keep the most 1s seen.',
        'i = 2: the window [0,1,0] has count = 1, so best = 1.',
        'i = 3: the window [1,0,1] has count = 2, so best = 2.',
        'i = 4 and 5: the windows [0,1,1] and [1,1,0] both have count = 2.',
        'i = 6: [1,0,0] has count = 1. i = 7 wraps: [0,0,0] has count = 0. i = 8: [0,0,1] has count = 1.',
        'Best is 2, so one zero sits inside the best window. The answer is 3 − 2 = 1.',
      ],
    },
    code: `# Minimum Swaps to Group All 1's Together II
def min_swaps(a):
    n, k = len(a), sum(a)
    count = best = 0
    for i in range(n + k - 1):
        count += a[i % n]
        if i >= k:
            count -= a[(i - k) % n]
        if i >= k - 1:
            best = max(best, count)
    return k - best`,
    complexity: 'O(n + k) time, which is O(n) when k <= n. O(1) space when you use indices rather than a doubled array.',
    pitfalls: [
      'Looping to 2n when you want one pass per start: some windows are counted twice, which is harmless for a maximum but wrong for a count.',
      'If k can exceed n, a window would hold the same element twice: handle whole cycles separately, as LC 2875 does.',
      'Writing (i − k) % n in C++ when i − k could be negative: the result is negative too. Python doesn\'t have this problem.',
      'LC 1652 has k > 0, k < 0 and k = 0 as separate cases: the window\'s direction flips.',
    ],
    pointsToPonder: [
      'When is modulo indexing clearer than doubling, and when is doubling clearer?',
      'How could you solve LC 1423 by sliding the complement and also by a wrapped window? Which is less error-prone?',
      'Why does the number of zeros in the window equal the swaps needed in LC 2134?',
    ],
    practice: [1652, 1423, 2134, 918, 1888],
    snippet: '16-sliding-window-on-circular-array',
  },

  '17. Multi-Pointer / K-Pointer': {
    crux: 'Reduce the problem to two pointers by fixing the others, or keep one pointer per sorted run and always advance the one that\'s behind.',
    signals: [
      '"All the triplets" or "all unique quadruplets": nested anchors around one pair search.',
      '"Sort ... with values 0, 1 and 2, in-place": three pointers separate three regions.',
      '"Smallest range that includes at least one number from each of the k lists": one pointer per list.',
      '"The number of smaller elements to the right" or "reverse pairs": pointers across the sorted halves of merge sort.',
    ],
    notThis: [
      'Combination Sum (LC 39), or k-Sum with a large k: nested pointers grow as n^(k−1), so use DP or backtracking.',
      'Two Sum (LC 1) on unsorted input where you need original indices: use a hash map.',
      'Closest Subsequence Sum (LC 1755) has too many subsets to enumerate: meet in the middle first, then use two pointers on the sums.',
    ],
    concepts: [
      'Each extra anchor costs a factor of n, and sorting pays for both the search and the duplicate skipping.',
      'Merge-sort counting: both halves are sorted, so for each left element the matching boundary on the right only moves forward. Count before you merge.',
      'k lists: a min-heap holds each list\'s current value, and the range runs from the heap\'s minimum to the largest value it currently holds.',
    ],
    example: {
      problem: '3Sum with a = [-1,0,1,2,-1,-4]',
      lc: 15,
      walkthrough: [
        'Sort to get [-4,-1,-1,0,1,2].',
        'Anchor -4: the best possible sum is -4 + 1 + 2 = -1, so l walks to r with no match.',
        'Anchor -1 at i = 1: l = 2, r = 5 gives -1 − 1 + 2 = 0, so add [-1,-1,2]. Move to l = 3, r = 4.',
        'l = 3, r = 4 gives -1 + 0 + 1 = 0, so add [-1,0,1]. The pointers cross.',
        'Anchor -1 at i = 2 repeats the previous anchor, so skip it.',
        'Anchor 0: l = 4, r = 5 gives 0 + 1 + 2 = 3, too big, so r moves to l. The answer is [[-1,-1,2],[-1,0,1]].',
      ],
    },
    code: `# 3Sum
def three_sum(a):
    a.sort()
    res = []
    for i in range(len(a) - 2):
        if i > 0 and a[i] == a[i - 1]:
            continue
        l, r = i + 1, len(a) - 1
        while l < r:
            s = a[i] + a[l] + a[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([a[i], a[l], a[r]])
                l += 1
                r -= 1
                while l < r and a[l] == a[l - 1]:
                    l += 1
    return res`,
    complexity: '3Sum is O(n²) time and O(1) extra space beyond sorting. Merge-sort counting is O(n log n) time and O(n) space. The k-list heap is O(N log k) for N total elements.',
    pitfalls: [
      'Checking a[i] == a[i + 1] instead of a[i − 1] for the anchor: that skips valid triplets such as [-1,-1,2].',
      'In 4Sum, the sum of four 32-bit values can overflow: use a wider type.',
      'In Reverse Pairs (LC 493), merging while counting: the 2 × a[j] test has a different order from the merge, so count in a separate pass.',
      'In Sort Colors, using i < hi rather than i <= hi leaves the last unknown value unchecked.',
    ],
    pointsToPonder: [
      'Why doesn\'t r need its own duplicate skip after a match in this code?',
      'What early exits can you add to 3Sum using the sorted order?',
      'Why does a merge sort give you a monotonic pointer that a plain nested loop doesn\'t have?',
    ],
    practice: [75, 15, 16, 259, 18],
    snippet: '17-multi-pointer-3sum',
  },

  '18. Two Pointers on Strings': {
    crux: 'Give each string its own pointer and match greedily, moving through both once instead of building new strings.',
    signals: [
      '"Typed into empty text editors" and "# means a backspace", especially with "O(1) space": scan from the right.',
      '"Is a subsequence of" or "formed by deleting some characters": one greedy matching pass.',
      '"Your friend ... long pressed" or "stretchy words": compare runs of equal characters.',
      '"Exactly one edit distance apart": find the first difference, then the rest must match.',
    ],
    notThis: [
      'Edit Distance (LC 72) allows any number of edits, and each mismatch branches three ways: use DP.',
      'Find the First Occurrence (LC 28) on adversarial input: restarting after a mismatch is O(nm), so use KMP.',
      'Number of Matching Subsequences (LC 792) has many words: rescanning s for each is slow, so bucket words by their next character.',
    ],
    concepts: [
      'Greedy subsequence matching takes the earliest match, because this leaves the most room for the rest.',
      'Scan right to left when later characters change the meaning of earlier ones, as backspaces do.',
      'Run comparison: consume a whole run from each string, then compare characters and lengths.',
    ],
    example: {
      problem: 'Backspace String Compare with s = "ab#c", t = "ad#c"',
      lc: 844,
      walkthrough: [
        'Start at i = 3, j = 3. Neither c is erased, and c equals c, so move to i = 2, j = 2.',
        'In s: index 2 is #, so skip = 1 and we move to index 1. b uses up the skip, and we stop on a at index 0.',
        'In t: index 2 is #, and d uses up the skip, so we also stop on a at index 0.',
        'a equals a, so move both to -1. The loop ends, and the answer is true.',
      ],
    },
    code: `# Backspace String Compare — O(1) space
def backspace_compare(s, t):
    def prev_char(x, i):
        skip = 0
        while i >= 0:
            if x[i] == '#':
                skip += 1
            elif skip:
                skip -= 1
            else:
                break
            i -= 1
        return i

    i, j = len(s) - 1, len(t) - 1
    while i >= 0 or j >= 0:
        i, j = prev_char(s, i), prev_char(t, j)
        if i < 0 or j < 0:
            return i < 0 and j < 0
        if s[i] != t[j]:
            return False
        i -= 1
        j -= 1
    return True`,
    complexity: 'O(n + m) time and O(1) space. The naive first-occurrence search and word-list problems like LC 524 cost O(n × m) in the worst case.',
    pitfalls: [
      'In LC 844, stopping when one pointer runs out: the other string may still have only erased characters left.',
      'In LC 925, accepting extra characters in typed that continue no run.',
      'In LC 161, treating equal strings as a match: they\'re zero edits apart, and the answer must be false.',
      'In LC 165, comparing versions as strings: "1.01" equals "1.001", and "1.0" equals "1".',
    ],
    pointsToPonder: [
      'Why is the earliest match always safe in subsequence checking?',
      'Why can\'t you scan LC 844 from the left in O(1) space?',
      'What preprocessing would turn LC 392 into a fast check for many queries?',
    ],
    practice: [344, 125, 392, 844, 680],
    snippet: '18-two-pointers-on-strings-backspace-compare',
  },

  '19. Two Pointers on Linked Lists': {
    crux: 'A list has no indices, so use a gap between two pointers to measure distance, and a dummy head so the first node isn\'t a special case.',
    signals: [
      '"Remove the n-th node from the end of the list": hold a gap of n.',
      '"Reorder L0 → Ln → L1 → Ln−1": find the middle, reverse the second half, then weave.',
      '"All nodes less than x come before nodes greater than or equal to x", keeping "relative order": two output lists.',
      '"The node at which the two lists intersect": switch heads so that both walk the same total.',
    ],
    notThis: [
      'Merge k Sorted Lists (LC 23) has too many heads to compare one by one: use a heap.',
      'Reverse Nodes in k-Group (LC 25) is mostly rewiring: the pointers just mark group boundaries.',
      'Copy List with Random Pointer (LC 138) depends on node identity: use a hash map or interleave copies.',
    ],
    concepts: [
      'Gap: advance fast n steps first, and when fast reaches the last node, slow is just before the target.',
      'Dummy node: it gives the head a predecessor, so that removing the head needs no extra branch.',
      'Many hard list problems combine three steps: find the middle, reverse a part, then merge.',
    ],
    example: {
      problem: 'Remove Nth Node From End with 1→2→3→4→5, n = 2',
      lc: 19,
      walkthrough: [
        'Add a dummy before 1. Start with fast and slow both on dummy.',
        'Move fast 2 steps, to node 2. Slow stays on dummy.',
        'Move both: fast 3, slow 1. Then fast 4, slow 2. Then fast 5, slow 3.',
        'fast.next is empty, so stop. Slow is on 3, just before the target node 4.',
        'Set 3.next to 5. The result is 1→2→3→5.',
      ],
    },
    code: `# Remove Nth Node From End of List
def remove_nth(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
    complexity: 'O(n) time and O(1) space. Recursive solutions and Sort List\'s top-down merge sort use extra call stack space.',
    pitfalls: [
      'Not using a dummy: removing the head when n equals the length crashes or needs a special case.',
      'Stopping slow on the target rather than just before it: you need the predecessor to unlink.',
      'In Reorder List, forgetting to cut the list at the middle creates a cycle.',
      'In Rotate List (LC 61), not taking k modulo the length: k can be far larger than the list.',
    ],
    pointsToPonder: [
      'Why does the gap method use one pass, and is it actually cheaper than walking twice?',
      'In LC 160, why do the two pointers meet at the intersection, or both reach null at the same moment?',
      'Which of these problems can you solve without changing any next pointers?',
    ],
    practice: [21, 83, 876, 19, 143],
    snippet: '19-two-pointers-on-linked-lists-nth-from-end',
  },

  '20. Two Pointers + Binary Search': {
    crux: 'Binary search chooses a candidate answer, and a linear two-pointer pass counts or checks it, or one pointer is replaced with a binary search per element.',
    signals: [
      '"K-th smallest distance among all the pairs": search on the distance, and count the pairs at or below it.',
      '"Minimize the maximum difference" among p pairs: search on the limit, and check it greedily.',
      '"The minimum magnetic force ... is maximum": search on the gap, and place balls greedily.',
      '"For each spell, the number of potions that ... at least success": sort one side, then search for each query.',
    ],
    notThis: [
      'A sorted pair search with a fixed target: two pointers alone are O(n), and a search per element only adds a log factor.',
      'Count of Range Sum (LC 327) counts prefix-sum pairs where index order matters, and sorting would lose it: use merge sort or a Fenwick tree.',
      'K-th Largest Element (LC 215) has its values on hand: a heap or quickselect is simpler than a search on the answer.',
    ],
    concepts: [
      'The search on the answer needs a monotonic check: if a limit d works, then every larger limit also works.',
      'Counting pairs in a sorted array within d is O(n), because left never moves back as right increases.',
      'A per-element binary search costs O(n log n), and it\'s a replacement for a second pointer when the targets aren\'t monotonic.',
    ],
    example: {
      problem: 'Find K-th Smallest Pair Distance with a = [1,2,4,7], k = 3',
      lc: 719,
      walkthrough: [
        'It\'s sorted already, so lo = 0 and hi = 7 − 1 = 6.',
        'mid = 3: right = 1 adds 1, right = 2 adds 2, and right = 3 moves left to 2 and adds 1. The count is 4, at least k, so hi = 3.',
        'mid = 1: right = 1 adds 1, and the others add 0. The count is 1, below k, so lo = 2.',
        'mid = 2: right = 1 adds 1, right = 2 moves left to 1 and adds 1, and right = 3 adds 0. The count is 2, below k, so lo = 3.',
        'lo = hi = 3. The sorted distances are 1,2,3,3,5,6, so the third is indeed 3.',
      ],
    },
    code: `# Find K-th Smallest Pair Distance
def kth_distance(a, k):
    a.sort()

    def count_within(d):
        left = total = 0
        for right in range(len(a)):
            while a[right] - a[left] > d:
                left += 1
            total += right - left
        return total

    lo, hi = 0, a[-1] - a[0]
    while lo < hi:
        mid = (lo + hi) // 2
        if count_within(mid) >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    complexity: 'O(n log n + n log W) time for LC 719, where W is the value range. O(1) extra space beyond sorting. Search-per-query problems cost O((n + m) log m).',
    pitfalls: [
      'Using lo = mid when searching for the smallest valid answer: the loop can run forever.',
      'Counting with right − left + 1 includes the element paired with itself, but pairs need two different indices.',
      'Setting hi to a[n − 1] instead of the largest distance, or forgetting to sort before computing hi.',
      'In LC 2300, spell × potion overflows 32 bits, and floor division gives the wrong threshold: use 64-bit products or ceiling division.',
    ],
    pointsToPonder: [
      'Why is the final lo guaranteed to be an actual distance, even though mid values often aren\'t?',
      'How do you decide between a search on the answer and a heap of k candidates?',
      'If the queries were sorted, how could LC 2300 drop its binary search?',
    ],
    practice: [2300, 15, 16, 1552, 719],
    snippet: '20-two-pointers-binary-search',
  },

  '21. Two Pointers + Greedy': {
    crux: 'Sort, then let the two pointers decide who to match next, with an exchange argument showing that the extreme choice is always safe.',
    signals: [
      '"Each boat carries at most two people at the same time": pair the heaviest with the lightest, if they fit.',
      '"Each child ... at most one cookie" or "each player ... at most one trainer": maximize matches between two sorted lists.',
      '"Minimize the maximum pair sum": pair the smallest with the largest.',
      '"Play a token face up or face down" (LC 948): buy with the cheapest and sell the dearest.',
    ],
    notThis: [
      'Boats that hold more than two people: that\'s bin packing, which has no such greedy solution.',
      'Partition to K Equal Sum Subsets (LC 698) has to fill exactly equal groups: use backtracking or a bitmask DP.',
      'Maximum Distance Between a Pair of Values (LC 1855) is listed here, but both arrays are already sorted and the pointers move the same way, with no pairing argument.',
    ],
    concepts: [
      'Exchange argument: take any optimal answer, swap in the greedy choice, and show that it\'s no worse.',
      'The heaviest person has to go somewhere. If they can\'t fit with the lightest, they can\'t fit with anyone.',
      'Same-direction matching: when a resource is too small for the current need, it\'s too small for all later ones.',
    ],
    example: {
      problem: 'Boats to Save People with people = [3,2,2,1], limit = 3',
      lc: 881,
      walkthrough: [
        'Sort to get [1,2,2,3], with l = 0, r = 3.',
        '1 + 3 = 4 is over the limit, so 3 goes alone. r = 2 and boats = 1.',
        '1 + 2 = 3 fits, so they share. l = 1, r = 1 and boats = 2.',
        'l = r = 1: 2 + 2 = 4 is over the limit, because that\'s one person counted twice, so they go alone. r = 0 and boats = 3.',
        'The answer is 3.',
      ],
    },
    code: `# Boats to Save People
def num_boats(people, limit):
    people.sort()
    l, r = 0, len(people) - 1
    boats = 0
    while l <= r:
        if people[l] + people[r] <= limit:
            l += 1
        r -= 1
        boats += 1
    return boats`,
    complexity: 'O(n log n) time for the sort and O(n) for the pass. O(1) extra space, or O(log n) for the sort\'s stack.',
    pitfalls: [
      'Using l < r in Boats: the last single person never gets a boat.',
      'Moving the wrong pointer when a pair doesn\'t fit: the heavy person must leave, because the light one might still fit with someone else.',
      'In Bag of Tokens (LC 948), playing the last token face down for no gain: stop when the trade can\'t raise the score.',
      'Assuming every sort-and-pair problem pairs opposite ends: LC 455 and LC 2410 match small with small.',
    ],
    pointsToPonder: [
      'Can you write out the exchange argument for pairing the heaviest with the lightest?',
      'When is it best to pair opposite ends, and when should you pair neighbors?',
      'In Advantage Shuffle (LC 870), why give up your weakest card on their strongest when you can\'t beat it?',
    ],
    practice: [455, 2410, 881, 11, 948],
    snippet: '21-two-pointers-greedy-boats-to-save-people',
  },

  '22. Sliding Window + Prefix Sum': {
    crux: 'A subarray sum is the difference of two prefix sums, so with negatives you look up the partner prefix instead of moving a window.',
    signals: [
      '"Total number of subarrays whose sum equals k", where values may be negative: a hash map of prefix counts.',
      '"Sum at least K", where values may be negative: a monotonic deque over prefix sums.',
      '"Two non-overlapping subarrays with lengths firstLen and secondLen": prefix sums plus the best block so far.',
      '"The sum of left is less than or equal to the sum of mid": two boundaries on a prefix array that only move forward.',
    ],
    notThis: [
      'All values are positive and you want a sum threshold: a plain window needs only O(1) space.',
      'Maximum Subarray (LC 53) has no target: Kadane\'s algorithm is simpler.',
      'Values change between queries (LC 307): a prefix array would need rebuilding, so use a Fenwick or segment tree.',
    ],
    concepts: [
      'sum(i..j) = P[j + 1] − P[i], so for each end you want the number of earlier prefixes equal to P − k.',
      'Seed the map with {0: 1}, which stands for the empty prefix, so that a subarray starting at index 0 gets counted.',
      'Negatives break a window because the sum no longer rises and falls predictably as the window grows and shrinks.',
    ],
    example: {
      problem: 'Subarray Sum Equals K with a = [1,-1,1,1], k = 1',
      lc: 560,
      walkthrough: [
        'Start with seen = {0: 1}, prefix = 0 and count = 0.',
        'x = 1: prefix = 1. seen[0] = 1, so count = 1. Now seen = {0: 1, 1: 1}.',
        'x = -1: prefix = 0. seen[-1] = 0, so count stays 1. Now seen = {0: 2, 1: 1}.',
        'x = 1: prefix = 1. seen[0] = 2, so count = 3. Now seen = {0: 2, 1: 2}.',
        'x = 1: prefix = 2. seen[1] = 2, so count = 5. The answer is 5.',
      ],
    },
    code: `# Subarray Sum Equals K
def subarray_sum(a, k):
    seen = Counter({0: 1})
    prefix = count = 0
    for x in a:
        prefix += x
        count += seen[prefix - k]
        seen[prefix] += 1
    return count`,
    complexity: 'O(n) expected time and O(n) space for the map. A deque version is also O(n), and a fixed-length block needs only the prefix array.',
    pitfalls: [
      'Forgetting the {0: 1} seed misses every subarray that starts at index 0.',
      'Updating seen before the lookup with k = 0 counts the empty subarray.',
      'Using a window on LC 560 because it "looks like" LC 209: a negative makes it miss answers.',
      'Prefix sums can overflow 32-bit when the array is long and values are large.',
    ],
    pointsToPonder: [
      'For LC 930 and LC 1248, the window and prefix approaches both work. Which needs less memory?',
      'What should the map store if you want the longest subarray rather than a count? (See LC 325.)',
      'Why does LC 862 use a deque rather than a map, even though both look at prefix sums?',
    ],
    practice: [2483, 560, 930, 1248, 862],
    snippet: '22-sliding-window-prefix-sum-subarray-sum-equals-k',
  },

  '23. Sliding Window on Matrix / 2D': {
    crux: 'Fix a band of rows to squash the 2D problem into one array of column values, then run a 1D technique on it.',
    signals: [
      '"Number of non-empty submatrices that sum to target": fix top and bottom rows, then count as in 1D.',
      '"Sum of a rectangle ... no larger than k": the same squash, then a sorted set of prefixes.',
      '"Calculate the sum of the elements ... inside the rectangle", with many queries: a 2D prefix sum.',
      '"Largest rectangle containing only 1\'s": heights per row, which is a histogram.',
    ],
    notThis: [
      'Maximal Rectangle (LC 85) and Count Submatrices With All Ones (LC 1504) are listed here but use row heights with a monotonic stack.',
      'Maximal Square (LC 221) is a DP: dp[r][c] depends on three neighbors.',
      'Word Search (LC 79) on a grid needs paths, not rectangles: use DFS.',
    ],
    concepts: [
      'With R rows, there are O(R²) bands. Each one adds its new row to a running array of column sums in O(C).',
      'Run the loop over the smaller dimension: O(min(R,C)² × max(R,C)).',
      '2D prefix: P[r+1][c+1] = a[r][c] + P[r][c+1] + P[r+1][c] − P[r][c], with inclusion-exclusion for each rectangle query.',
    ],
    example: {
      problem: 'Number of Submatrices That Sum to Target with m = [[1,-1],[-1,1]], target = 0',
      lc: 1074,
      walkthrough: [
        'Row 0 only, columns [1,-1]: the prefixes are 1 and 0. The prefix 0 matches the seed, so total = 1.',
        'Rows 0 to 1, columns [0,0]: the prefixes are 0 and 0. The first matches once and the second twice, so total = 4.',
        'Row 1 only, columns [-1,1]: the prefixes are -1 and 0. The prefix 0 matches the seed, so total = 5.',
        'The answer is 5.',
      ],
    },
    code: `# Number of Submatrices That Sum to Target
def num_submatrix(m, target):
    R, C = len(m), len(m[0])
    total = 0
    for top in range(R):
        col = [0] * C
        for bottom in range(top, R):
            for c in range(C):
                col[c] += m[bottom][c]
            seen = Counter({0: 1})
            prefix = 0
            for v in col:
                prefix += v
                total += seen[prefix - target]
                seen[prefix] += 1
    return total`,
    complexity: 'O(R² × C) time and O(C) space, with expected-time hashing. LC 363 adds a log factor for its sorted set.',
    pitfalls: [
      'Resetting col only when bottom changes: it must reset for each new top, and accumulate as bottom grows.',
      'Forgetting a fresh seen map for each band: prefixes from another band mean nothing here.',
      'Off-by-one in 2D prefix queries: subtract at r1 and c1, and add back the corner P[r1][c1].',
      'Looping bands over the larger dimension when R and C differ a lot: this can turn a pass into a timeout.',
    ],
    pointsToPonder: [
      'Why does squashing rows lose nothing for a rectangle problem?',
      'Which 1D technique does each problem reduce to: Kadane, hash map, sorted set or stack?',
      'LC 2132 combines a prefix sum with a difference array. What does each one answer?',
    ],
    practice: [304, 221, 1504, 1074, 363],
    snippet: '23-sliding-window-on-matrix-best-row-band-1d-window',
  },

  '24. Shrinkable vs Non-Shrinkable Window Templates': {
    crux: 'For a longest window, you never need a smaller one, so you can slide at the current size instead of shrinking back to valid.',
    signals: [
      '"Longest" or "maximum length" and you only return the length: the non-shrinkable form applies.',
      '"Minimum length" or "smallest window": record while shrinking with a while loop.',
      '"After performing at most k operations": a cost that makes the window invalid, and validity is restored by moving left.',
      '"Number of subarrays": you need each right\'s exact valid boundary, so shrink fully.',
    ],
    notThis: [
      'Counting problems such as LC 992: non-shrinkable windows can be invalid, so right − left + 1 isn\'t a count of valid subarrays.',
      'Shortest-window problems such as LC 76: using `if` moves left only once per step, which can miss the minimum.',
      'Anything where the window itself is the answer: the final non-shrinkable window may be invalid, so record the start whenever the size grows.',
    ],
    concepts: [
      'Shrinkable: `while invalid: move left`. The window is always valid after the loop, and left can move many steps.',
      'Non-shrinkable: `if invalid: move left`. Right and left move together when invalid, so the size never decreases, and its final value is the answer.',
      'In LC 424, max_freq never decreases. A stale value is safe, because the size can only grow when a truly higher frequency appears.',
    ],
    example: {
      problem: 'Longest Repeating Character Replacement with s = "AABABBA", k = 1',
      lc: 424,
      walkthrough: [
        'right = 0 to 3 ("AABA"): max_freq reaches 3 and the size is 4. Changes needed = 4 − 3 = 1, which is allowed.',
        'right = 4 ("AABAB"): size 5, needing 2 changes. Slide: drop A, so left = 1 and the size stays 4.',
        'right = 5 ("ABABB"): size 5, needing 2 changes. Slide: drop A, so left = 2.',
        'right = 6 ("BABBA"): B has count 3, so size 5 needs 2 changes. Slide: drop B, so left = 3.',
        'The final window [3..6] is "ABBA", which needs 2 changes and so isn\'t itself valid, but its size is the answer: 7 − 3 = 4.',
      ],
    },
    code: `# Longest Repeating Character Replacement — non-shrinkable
def character_replacement(s, k):
    cnt = Counter()
    left = max_freq = 0
    for right, c in enumerate(s):
        cnt[c] += 1
        max_freq = max(max_freq, cnt[c])
        if right - left + 1 - max_freq > k:
            cnt[s[left]] -= 1
            left += 1
    return len(s) - left`,
    complexity: 'Both are O(n) time. Non-shrinkable moves left at most once per step, so it has a smaller constant, and it lets LC 424 skip rescanning for the frequency.',
    pitfalls: [
      'Reading the final non-shrinkable window as the answer itself: "ABBA" above isn\'t valid, and only its length is meaningful.',
      'Using `if` on a shortest-window problem: left must move as far as it can on each step.',
      'Mixing the two: an `if` shrink with right − left + 1 counted as subarrays gives wrong totals.',
      'Trying to decrease max_freq in LC 424 when characters leave: this costs a rescan and doesn\'t change the answer.',
    ],
    pointsToPonder: [
      'Why does the window size never decrease in the `if` form, and why does that prove the final size is the maximum?',
      'What would you record to recover an actual longest window rather than just its length?',
      'When would you still prefer the `while` form for a "longest" problem?',
    ],
    practice: [3, 209, 1004, 424, 76],
    snippet: '24-shrinkable-vs-non-shrinkable-templates',
  },

  '25. Advanced / Contest-Level Two Pointers & Sliding Window': {
    crux: 'Hard problems are a basic window plus one twist, so name the base template first, then ask what breaks it and what fixes that.',
    signals: [
      '"The minimum value equals minK and the maximum equals maxK": track the last position of each requirement.',
      '"Shortest subarray with sum at least K", where values may be negative: monotonicity is gone, so use a deque over prefix sums.',
      '"max(chargeTimes) + k × sum(runningCosts) <= budget": a window with a monotonic deque for the max term.',
      '"Product of its sum and its length is strictly less than k": a positive cost that grows with size, so a plain window still works.',
    ],
    notThis: [
      'Sum of Total Strength of Wizards (LC 2281) is listed here, but it\'s a monotonic stack for the range where each minimum applies, plus a prefix of prefix sums.',
      'Count of Smaller Numbers After Self (LC 315) has no window: count while merging, or use a Fenwick tree.',
      'Minimum Number of Moves to Make Palindrome (LC 2193) is a greedy adjacent-swap simulation, even though it pairs both ends.',
    ],
    concepts: [
      'First test: is validity monotonic? If so, a plain window works. If negatives break that, use prefix sums.',
      'Second test: what does the window summary need? Sum needs a variable, max needs a deque, median needs heaps, and distinct needs a map.',
      'Third test: are you counting? If so, count by right endpoint, and use atMost or last positions.',
    ],
    example: {
      problem: 'Count Subarrays With Fixed Bounds with a = [1,3,5,2,7,5], minK = 1, maxK = 5',
      lc: 2444,
      walkthrough: [
        'Start with bad = last_min = last_max = -1 and total = 0.',
        'i = 0, x = 1: last_min = 0. min(0, -1) − (-1) = 0, so total stays 0.',
        'i = 1, x = 3: nothing changes, so total stays 0.',
        'i = 2, x = 5: last_max = 2. min(0, 2) − (-1) = 1, so total = 1.',
        'i = 3, x = 2: nothing changes, and it adds 1 again, so total = 2.',
        'i = 4, x = 7: out of range, so bad = 4. min(0, 2) − 4 is negative, which adds 0.',
        'i = 5, x = 5: last_max = 5. min(0, 5) − 4 is negative, which adds 0. The answer is 2.',
      ],
    },
    code: `# Count Subarrays With Fixed Bounds
def count_fixed_bounds(a, min_k, max_k):
    bad = last_min = last_max = -1
    total = 0
    for i, x in enumerate(a):
        if x < min_k or x > max_k:
            bad = i
        if x == min_k:
            last_min = i
        if x == max_k:
            last_max = i
        total += max(0, min(last_min, last_max) - bad)
    return total`,
    complexity: 'O(n) time and O(1) space here. Elsewhere in this section, deque problems are O(n), heap problems are O(n log k), and binary search on the answer adds O(log W).',
    pitfalls: [
      'Forgetting max(0, ...): a stale last_min before the bad index would subtract from the total.',
      'Using shrink logic on LC 2444: the count depends on three positions, not on one window boundary.',
      'When min_k equals max_k, both last positions must update from the same element: use two separate `if`s, not `elif`.',
      'Totals for subarray counts can reach about n²/2: use a 64-bit type in C++.',
    ],
    pointsToPonder: [
      'Pick any problem here and name the base template. What single thing stops the base template from working?',
      'What do Fixed Bounds (LC 2444) and Subarrays with K Different Integers (LC 992) share in how they count?',
      'What does an interviewer learn when you say why a plain window fails before you fix it?',
    ],
    practice: [239, 76, 2444, 992, 862],
    snippet: '14-sliding-window-monotonic-deque',
  },
}
