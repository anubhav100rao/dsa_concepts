// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const strings = {
  '1. Basics & Traversal': {
    crux: 'One pass with an index or two: the only real work is building output cheaply and carrying digits from the right.',
    signals: [
      '"Reverse the string in-place" or "reverse the order of the words": swap from both ends, or split and rejoin.',
      '"Return the sum as a string" or "numbers too large for a built-in integer": do schoolbook arithmetic from the last digit.',
      '"Replace every..." or "return the string after...": a single scan that appends to a new buffer.',
      '"Does the robot return to the origin?": tally the characters and compare the tallies.',
    ],
    notThis: [
      'The question is about the best substring under a condition, as in LC 3: a plain scan restarts too often, so use a sliding window.',
      'Tokens nest inside brackets, as in Decode String (LC 394): one index can\'t remember the outer levels, so use a stack.',
    ],
    concepts: [
      'Reverse in place with l and r moving toward each other; a sub-range reversal is the same loop with different bounds.',
      'Digit arithmetic: walk both strings from the end, keep sum % base as the digit and sum // base as the carry.',
      'Multiply Strings: the digits at i and j land in positions i + j and i + j + 1 of a result array.',
      'Build output in a list or a mutable buffer. Repeated prepending copies the whole string each time.',
    ],
    example: {
      problem: 'Add Strings with a = "456" and b = "77"',
      lc: 415,
      walkthrough: [
        'Start with i and j on the last digits, and carry = 0.',
        '6 + 7 + 0 = 13: write 3, carry = 1.',
        '5 + 7 + 1 = 13: write 3, carry = 1.',
        'b has run out, so 4 + 1 = 5: write 5, carry = 0.',
        'Both strings are finished and carry is 0, so the loop stops with digits [3, 3, 5].',
        'Reverse them to get "533", and 456 + 77 = 533.',
      ],
    },
    code: `def add_strings(a, b):
    i, j, carry = len(a) - 1, len(b) - 1, 0
    digits = []
    while i >= 0 or j >= 0 or carry:
        total = carry
        if i >= 0:
            total += int(a[i])
            i -= 1
        if j >= 0:
            total += int(b[j])
            j -= 1
        digits.append(str(total % 10))
        carry = total // 10
    return ''.join(reversed(digits))`,
    complexity: 'O(n + m) time for the two lengths, and O(max(n, m)) space for the output. Multiply Strings is O(n * m).',
    pitfalls: [
      'Stopping when both indexes run out and dropping the last carry: "9" + "1" must give "10", not "0".',
      'Prepending inside the loop: result = digit + result is O(n^2) overall, so append and reverse at the end.',
      'Multiply Strings leaves leading zeros in the result array, and "0" * "123" must return "0", not "000".',
      'Reverse Words in a String (LC 151) allows extra spaces, so splitting on one space produces empty words.',
    ],
    pointsToPonder: [
      'Why does arithmetic run from the right when strings are read from the left?',
      'Which changes when the base goes from 10 to 2 (LC 67), and which stays the same?',
      'When can you reverse in place, and when does the language\'s immutable string force a copy?',
    ],
    practice: [344, 557, 415, 67, 43],
    snippet: '1-basic-string-traversal',
  },

  '2. Two Pointers (Strings)': {
    crux: 'Move two indexes under a rule, either from both ends or one per string, so nothing needs to be stored.',
    signals: [
      '"Reads the same forward and backward, ignoring non-alphanumeric characters": pointers from both ends.',
      '"After deleting at most one character": at the first mismatch, try skipping either side.',
      '"Is s a subsequence of t?": one pointer per string, and only s\'s pointer waits for a match.',
      '"Typed into text editors, where # means backspace": compare from the right, where deletions are already known.',
      '"Modify the array in-place" with O(1) extra space: a read pointer and a write pointer.',
    ],
    notThis: [
      'Sort Characters By Frequency (LC 451) is listed here, but no pointer rule solves it: count, then sort by count.',
      'The answer is a contiguous stretch that must satisfy a count, as in LC 424: use a sliding window.',
      'Up to k deletions, as in Valid Palindrome III (LC 1216): a single skip no longer works, so use interval DP.',
    ],
    concepts: [
      'Opposite ends: each comparison retires one character from each side, which gives O(n) in total.',
      'Same direction across two strings: the pointer only advances, so a greedy match is safe for subsequence checks.',
      'Read and write pointers: write never passes read, so compressing in place cannot overwrite unread input.',
      'Scanning from the right makes backspaces easy, because you see the # before the character it deletes.',
    ],
    example: {
      problem: 'Valid Palindrome II with s = "abca"',
      lc: 680,
      walkthrough: [
        'Start with l = 0 and r = 3. s[0] = a and s[3] = a match, so move to l = 1 and r = 2.',
        's[1] = b and s[2] = c differ, so this is where the one deletion must happen.',
        'Try deleting b: check the range l + 1 = 2 to r = 2. It holds one character, so it is a palindrome.',
        'That first attempt succeeds, so the answer is true: deleting b leaves "aca".',
      ],
    },
    code: `def valid_palindrome(s):
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
    complexity: 'O(n) time, since the skip is tried once and each attempt is a linear scan. O(1) extra space.',
    pitfalls: [
      'Trying only one side at the mismatch: both deletions must be tested, because either one may be the valid one.',
      'Recursing on every mismatch turns "at most one deletion" into an exponential search. Allow a single skip.',
      'LC 125: the inner skip loops need l < r as well, or a string with only punctuation runs out of bounds.',
      'LC 844: rebuilding both strings works, but only the right-to-left scan meets the O(1) space follow-up.',
    ],
    pointsToPonder: [
      'Why is it safe to skip characters greedily in Is Subsequence, instead of searching for a better match later?',
      'Why does scanning from the right make backspaces simple, when the left-to-right scan needs a stack?',
      'What breaks in Valid Palindrome II when one deletion becomes k, and why does that force DP?',
    ],
    practice: [125, 392, 844, 680, 443],
    snippet: '6-two-pointer-valid-palindrome-ignoring-non-alphanumeric',
  },

  '3. Sliding Window': {
    crux: 'Grow the right edge, shrink the left only when the window turns invalid, and each index moves forward at most once.',
    signals: [
      '"Longest substring with at most k distinct characters" or "without repeating characters": longest valid window.',
      '"Smallest substring that contains all characters of t": shrink while the window stays valid.',
      '"Contains a permutation of s1" or "all anagrams of p in s": a fixed window of size len(p) with counts.',
      '"At most k replacements" or "within a budget of maxCost": what you spend inside the window is the constraint.',
      '"Number of substrings containing..." or "exactly k": count at-most(k) minus at-most(k - 1).',
    ],
    notThis: [
      'The characters need not be adjacent ("subsequence"), as in LC 1143: a window can\'t skip characters, so use DP.',
      'Shrinking can\'t restore validity, as in Longest Nice Substring (LC 1763): split on characters that can never be part of an answer, or fix the number of distinct letters.',
      'The target is one exact string, as in LC 28: nothing about it can be tracked with counts, so use KMP.',
    ],
    concepts: [
      'Longest valid: update the answer after shrinking. Shortest valid: update inside the shrink loop.',
      'Fixed size k: add s[right], remove s[right - k], and compare counts.',
      'Count all substrings: a window ending at right adds right - left + 1 at-most-valid substrings.',
      'A window only works when validity is monotonic: a valid window stays valid when it shrinks, or an invalid one stays invalid when it grows.',
    ],
    example: {
      problem: 'Longest Substring Without Repeating Characters with s = "abba"',
      lc: 3,
      walkthrough: [
        'right = 0, c = a: a is new, so the window is "a", length 1, best = 1.',
        'right = 1, c = b: b is new, so the window is "ab", length 2, best = 2.',
        'right = 2, c = b: last[b] = 1 is inside the window, so left jumps to 2. The window is "b", length 1.',
        'right = 3, c = a: last[a] = 0 is before left = 2, so it is stale and left stays. The window is "ba", length 2.',
        'The answer is best = 2.',
      ],
    },
    code: `def length_of_longest(s):
    last, left, best = {}, 0, 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        best = max(best, right - left + 1)
    return best`,
    complexity: 'O(n) time, because left and right each move forward at most n times. O(alphabet) space for the counts.',
    pitfalls: [
      'Forgetting the last[c] >= left check: at the final a in "abba", left would jump back to 1 and report "bba" as valid.',
      'LC 76: counting distinct letters instead of required copies, when t = "aa" needs two a\'s.',
      'LC 424: right - left + 1 - maxFreq > k decides the shrink, and maxFreq never needs to go down.',
      'Treating "exactly k" as a window: it isn\'t monotonic, so subtract two at-most counts.',
    ],
    pointsToPonder: [
      'Why is the two-loop code O(n) rather than O(n^2)?',
      'Where does the answer update differ between longest-valid and shortest-valid windows, and why?',
      'What property of Longest Nice Substring stops a simple window from working?',
    ],
    practice: [1456, 3, 567, 424, 76],
    snippet: '14-sliding-window-longest-substring-without-repeating-chars',
  },

  '4. Hashing, Frequency & Anagrams': {
    crux: 'When order doesn\'t matter, a string is just its letter counts, so compare or group by those counts.',
    signals: [
      '"Anagram" or "using all the original letters exactly once": equal counts.',
      '"Can be constructed from the letters of magazine": every needed count is at most the available count.',
      '"First non-repeating character": count first, then scan the string again in order.',
      '"A bijection between a letter and a word" or "one-to-one mapping": two maps, one per direction.',
      '"Can be made the same by swapping any two letters": compare the sets of letters and the sorted counts (LC 1657).',
    ],
    notThis: [
      'The anagram sits inside a longer string, as in Find All Anagrams (LC 438): recounting every position is O(n * k), so slide a window.',
      'Order matters, as in LC 28: equal counts don\'t mean equal strings, so use exact pattern matching.',
    ],
    concepts: [
      'A count array of 26 is enough for lowercase letters; use a map for Unicode or unknown alphabets.',
      'Group by a canonical key: the sorted string (O(k log k)) or the count tuple (O(k)).',
      'Isomorphism needs both directions, because a -> x and b -> x must fail.',
      'Custom Sort String (LC 791): count, then write characters in the required order, then write the rest.',
    ],
    example: {
      problem: 'Group Anagrams with ["eat", "tea", "tan"]',
      lc: 49,
      walkthrough: [
        '"eat" has a = 1, e = 1, t = 1. That key is new, so create the group ["eat"].',
        '"tea" has the same counts, so it joins the group: ["eat", "tea"].',
        '"tan" has a = 1, n = 1, t = 1. That key is new, so create the group ["tan"].',
        'The answer is [["eat", "tea"], ["tan"]].',
      ],
    },
    code: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)
    return list(groups.values())`,
    complexity: 'O(n * k) time for n words of length k with count keys, or O(n * k log k) with sorted keys. O(n * k) space.',
    pitfalls: [
      'Using a list as a map key: lists are mutable, so convert the counts to a tuple or a string first.',
      'Joining counts into a key with no separator: counts 1, 11 and 11, 1 both become "111".',
      'LC 205 and LC 290: checking only one direction accepts "badc" -> "baba".',
      'LC 290: compare the word count with the pattern length before mapping anything.',
      'The 26-slot array breaks on uppercase or Unicode input, so read the constraints first.',
    ],
    pointsToPonder: [
      'When is a sorted key better than a count key, even though it is slower?',
      'Why does LC 1657 compare sorted counts and the set of letters, and why isn\'t either one enough alone?',
      'Which of these problems would break if the input could contain any Unicode character?',
    ],
    practice: [242, 383, 205, 49, 1657],
    snippet: '37-group-anagrams',
  },

  '5. Pattern Matching (KMP / Z / Rabin-Karp)': {
    crux: 'Reuse what the last comparison already proved: a failed match tells you the longest prefix that can still continue.',
    signals: [
      '"Find the index of the first occurrence of needle in haystack": classic KMP, or Z on needle + "$" + haystack.',
      '"Constructed by taking a substring and appending copies of it": the period is n - lps[n - 1].',
      '"Longest prefix which is also a suffix": that is exactly the last LPS value.',
      '"Add characters in front to make it a palindrome": LPS of s + "#" + reversed(s).',
      '"Score is the longest common prefix of each suffix with the whole string": that is the sum of the Z-array.',
      '"All indices where a occurs" with lengths up to 5 * 10^5: find every match in linear time (LC 3008).',
    ],
    notThis: [
      'Longest Common Prefix (LC 14) is listed here but needs no automaton: compare column by column.',
      'Number of Matching Subsequences (LC 792) is about subsequences: bucket words by their next needed letter.',
      'Many patterns share one text, as in Stream of Characters (LC 1032): use a trie.',
      'Inexact matches, as in LC 72: failure links can\'t model edits, so use DP.',
    ],
    concepts: [
      'lps[i] is the length of the longest proper prefix of pattern[0..i] that is also its suffix.',
      'On a mismatch, j falls back to lps[j - 1], and the text pointer never moves backward.',
      'z[i] is the longest match between s[i..] and the start of s, and pattern + "$" + text turns it into search.',
      'Rabin-Karp rolls a hash in O(1) per shift, and hashes also compare any two substrings in O(1) after preprocessing.',
    ],
    example: {
      problem: 'Find the First Occurrence with text = "abababc" and pattern = "ababc"',
      lc: 28,
      walkthrough: [
        'Build the LPS array for "ababc": [0, 0, 1, 2, 0].',
        'Text indexes 0 to 3 ("abab") all match, so j = 4.',
        'i = 4: text a differs from pattern[4] = c. Fall back to j = lps[3] = 2 and compare again.',
        'text a equals pattern[2] = a, so j = 3. The text pointer never moved back.',
        'i = 5: b matches, so j = 4. i = 6: c matches, so j = 5, the full pattern length.',
        'Return i - j + 1 = 6 - 5 + 1 = 2. Indeed "ababc" starts at index 2.',
      ],
    },
    code: `def str_str(text, pat):
    lps = [0] * len(pat)
    k = 0
    for i in range(1, len(pat)):
        while k and pat[i] != pat[k]:
            k = lps[k - 1]
        if pat[i] == pat[k]:
            k += 1
        lps[i] = k

    j = 0
    for i, c in enumerate(text):
        while j and c != pat[j]:
            j = lps[j - 1]
        if c == pat[j]:
            j += 1
        if j == len(pat):
            return i - j + 1
    return -1`,
    complexity: 'O(n + m) time for KMP and Z, with O(m) space for KMP and O(n + m) for Z. Rabin-Karp is O(n + m) expected, and O(n * m) if every hash hit must be verified.',
    pitfalls: [
      'After a full match, continue from j = lps[m - 1], or you will miss overlapping occurrences such as "aa" in "aaa".',
      'Using if instead of while on the fallback: one step back may still mismatch.',
      'LC 459: check lps[n - 1] > 0 as well as n % period == 0, or every string with n % n == 0 passes.',
      'Rabin-Karp: a hash match is only probable, so verify or use two moduli, and add mod before taking % after subtraction.',
      'The separator in pattern + "$" + text must not occur in either string.',
    ],
    pointsToPonder: [
      'Why does the text pointer never need to go backward in KMP?',
      'What is the difference between the information in the LPS array and in the Z-array?',
      'Why does Shortest Palindrome (LC 214) reduce to a border problem?',
    ],
    practice: [28, 459, 1392, 214, 2223],
    snippet: '18-kmp-string-matching',
  },

  '6. Palindromes': {
    crux: 'Decide first between substring and subsequence: substrings grow from a center, subsequences need an interval DP.',
    signals: [
      '"Longest palindromic substring" or "how many palindromic substrings": expand around each of the 2n - 1 centers.',
      '"Partition s so every part is a palindrome": backtracking to list them, and DP to minimize the cuts.',
      '"Longest palindromic subsequence" or "minimum insertions to make it a palindrome": interval DP on i and j.',
      '"Use all the characters to construct k palindromes": only the count of letters with odd frequency matters.',
      '"Maximum product of two non-overlapping palindromes" with n up to 10^5: Manacher\'s algorithm (LC 1960).',
    ],
    notThis: [
      'Is this one string a palindrome (LC 125)? Two pointers answer it in O(n) with no table.',
      'Palindrome Pairs (LC 336) concatenates two words: check prefixes and suffixes with a hash map of reversed words or a trie.',
      'Delete up to one character (LC 680): a single skip with two pointers is enough, so the DP is overkill.',
    ],
    concepts: [
      'Center expansion: odd centers at i, even centers between i and i + 1.',
      'Interval DP: dp[i][j] depends on dp[i + 1][j - 1], dp[i + 1][j] and dp[i][j - 1], so loop i from high to low.',
      'Minimum insertions = n - longest palindromic subsequence.',
      'Manacher reuses a mirror across the current center for O(n), but center expansion is usually enough in interviews.',
    ],
    example: {
      problem: 'Longest Palindromic Substring with s = "cbbd"',
      lc: 5,
      walkthrough: [
        'i = 0: the odd center gives "c", so best = 1 and start = 0. The even center compares c and b, giving length 0.',
        'i = 1: the odd center gives "b" (c and b differ next), so best stays 1.',
        'i = 1, even center: s[1] = s[2] = b, so expand. Then s[0] = c and s[3] = d differ, so stop with l = 0 and r = 3.',
        'The length is r - l - 1 = 2, so best = 2 and start = 1.',
        'i = 2 and i = 3 only find length 1 or 0, so nothing changes.',
        'The answer is s[1:3] = "bb".',
      ],
    },
    code: `def longest_palindrome(s):
    start, best = 0, 0

    def expand(l, r):
        nonlocal start, best
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        if r - l - 1 > best:
            best, start = r - l - 1, l + 1

    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + best]`,
    complexity: 'Center expansion is O(n^2) time and O(1) space. Interval DP is O(n^2) time and space. Manacher is O(n) time and space.',
    pitfalls: [
      'Forgetting even-length centers: "bb" has no middle character.',
      'After the loop, l and r sit one step outside the palindrome, so the length is r - l - 1, not r - l + 1.',
      'Filling dp in the wrong order: dp[i][j] needs row i + 1, so i must go from n - 1 down to 0.',
      'Confusing the two meanings: LC 5 asks for contiguous characters, and LC 516 lets you skip them.',
      'LC 132: the O(n^2) palindrome table must exist before cuts are computed, or the DP becomes O(n^3).',
    ],
    pointsToPonder: [
      'Why are there 2n - 1 centers rather than n?',
      'Why does longest palindromic subsequence equal the LCS of s and its reverse?',
      'In Construct K Palindrome Strings, why does the order of the characters not matter at all?',
    ],
    practice: [5, 647, 516, 131, 132],
    snippet: '16-expand-around-center-longest-palindromic-substring',
  },

  '7. Parsing, Encoding & Number Conversion': {
    crux: 'Walk with one index and treat the input as a small grammar: each token type gets its own step, in a fixed order.',
    signals: [
      '"Ignore leading whitespace, read an optional sign, stop at the first non-digit": a step-by-step scan.',
      '"Version numbers separated by dots": split, then compare each part as an integer.',
      '"Encode a list of strings to a single string" that "decodes back to the original": a length prefix.',
      '"Return all possible valid IP addresses": backtracking over 1 to 3 digits per part.',
      '"Serialized nested list" or "chemical formula with parentheses": a recursive parser or a stack.',
    ],
    notThis: [
      'Decode Ways (LC 91) asks "how many ways": parsing one reading can\'t count them all, so use DP on the prefix.',
      'A calculator with precedence, as in LC 227: the scan is similar, but the pending values belong on a stack.',
    ],
    concepts: [
      'Order the steps: whitespace, then sign, then digits, then overflow handling.',
      'Length-prefix encoding: "5#hello" stays unambiguous even when the text itself contains # or digits.',
      'Roman numerals: a value smaller than the next one is subtracted, and otherwise it is added.',
      'Integer to Roman is greedy over a value table that includes the subtractive pairs 900, 400, 90, 40, 9 and 4.',
      'For grammars with many rules (LC 65), name the state you are in, such as seenDigit, seenDot and seenExp.',
    ],
    example: {
      problem: 'String to Integer (atoi) with s = "  -42a"',
      lc: 8,
      walkthrough: [
        'Skip the two spaces, so i = 2.',
        's[2] is -, so sign = -1 and i = 3.',
        '4 is a digit: val = 0 * 10 + 4 = 4.',
        '2 is a digit: val = 4 * 10 + 2 = 42.',
        'a is not a digit, so the scan stops and the rest of the string is ignored.',
        'The result -42 is within the 32-bit range, so return -42.',
      ],
    },
    code: `def my_atoi(s):
    i, n = 0, len(s)
    while i < n and s[i] == ' ':
        i += 1
    sign = 1
    if i < n and s[i] in '+-':
        if s[i] == '-':
            sign = -1
        i += 1
    val = 0
    while i < n and s[i].isdigit():
        val = val * 10 + int(s[i])
        i += 1
    return max(-2**31, min(2**31 - 1, sign * val))`,
    complexity: 'O(n) time and O(1) space for scanning parsers. Restore IP Addresses is bounded by 3^4 digit splits, so it is effectively constant.',
    pitfalls: [
      'In a fixed-width language, check overflow before or during the multiply. A value past 2^63 wraps before you can clamp it.',
      'Reading past the end: every s[i] needs an i < n check first, including on input such as "+" or "   ".',
      'LC 165: comparing parts as strings makes "1.01" and "1.001" differ, although both parts equal 1.',
      'LC 93: "01" is not a valid part, while "0" is. Reject leading zeros and values above 255.',
      'LC 271: a plain delimiter fails as soon as a string contains it, so prefix each string with its length.',
    ],
    pointsToPonder: [
      'Why does a length prefix never need escaping, when a delimiter does?',
      'Which is easier to get right for Valid Number (LC 65): nested conditions or an explicit state machine?',
      'Why does the greedy value table work for Integer to Roman?',
    ],
    practice: [13, 12, 165, 8, 91],
    snippet: '31-manual-atoi',
  },

  '8. Stack-Based String Problems': {
    crux: 'Use a stack when the current character may cancel or close something earlier: the most recent open item resolves first.',
    signals: [
      '"Determine if the input string is valid" with bracket types: push openers, and match each closer against the top.',
      '"Repeatedly remove adjacent duplicates": the top of the stack is the left neighbor once earlier removals are done.',
      '"The encoded string inside the square brackets is repeated k times": save the outer state on [ and restore it on ].',
      '"Evaluate the expression" with + - * / and parentheses: a stack holds pending values and signs.',
      '"Canonical path" with . and ..: split on / and let .. pop a directory.',
    ],
    notThis: [
      'Only one bracket type and only a count is needed, as in LC 921: a balance counter is enough.',
      'Generate Parentheses (LC 22) builds strings rather than checking them: use backtracking with open and close counts.',
      'The goal is the lexicographically smallest result, as in LC 402: use a monotonic stack with a greedy rule, from section 11.',
    ],
    concepts: [
      'Save the outer context on an opener and restore it on the matching closer.',
      'Pair each character with a run count (LC 1209) so that removing k copies is O(1).',
      'LC 32: store indexes with a sentinel of -1, so the length is i minus the new top.',
      'LC 227: apply * and / to the top right away, and only total the stack at the end.',
      'A plain string with push_back and pop_back works as a stack and avoids a final reverse.',
    ],
    example: {
      problem: 'Decode String with s = "3[a2[c]]"',
      lc: 394,
      walkthrough: [
        '3: num = 3.',
        '[: push ("", 3), then reset cur = "" and num = 0.',
        'a: cur = "a". 2: num = 2.',
        '[: push ("a", 2), then reset cur = "" and num = 0.',
        'c: cur = "c".',
        ']: pop ("a", 2), so cur = "a" + "c" * 2 = "acc".',
        ']: pop ("", 3), so cur = "" + "acc" * 3 = "accaccacc", which is the answer.',
      ],
    },
    code: `def decode_string(s):
    stack, cur, num = [], '', 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '[':
            stack.append((cur, num))
            cur, num = '', 0
        elif c == ']':
            prev, k = stack.pop()
            cur = prev + cur * k
        else:
            cur += c
    return cur`,
    complexity: 'O(n) time and space for matching and removal problems. Decode String is O(output length), which can be far larger than the input.',
    pitfalls: [
      'Popping an empty stack on input such as "]": check it is non-empty before every pop.',
      'Returning true for "((": the stack must also be empty when the scan ends.',
      'Reading only one digit of a count: "12[a]" needs num = num * 10 + digit.',
      'LC 1249: the unmatched ( are only known at the end, so record their indexes rather than deleting as you go.',
      'LC 224: unary minus and spaces both break a simple tokenizer, and a sign before ( applies to the whole group.',
    ],
    pointsToPonder: [
      'What exactly is on the stack at any moment, and what does it represent?',
      'When can a stack be replaced by a counter, and what information does that lose?',
      'Why does Basic Calculator II need only one pass, and how do parentheses change that?',
    ],
    practice: [20, 1047, 921, 394, 224],
    snippet: '38-decode-string-stack-pattern',
  },

  '9. String DP': {
    crux: 'Define the state on prefixes: dp[i][j] answers the question for the first i characters of a and the first j of b.',
    signals: [
      '"Minimum number of operations (insert, delete, replace) to convert word1 to word2": edit distance.',
      '"Longest common subsequence" or "minimum deletions to make the two strings the same": LCS.',
      '"Number of distinct subsequences of s which equal t": count, adding the skip and take cases.',
      '"Formed by an interleaving of s1 and s2": a boolean table over two prefixes.',
      '"Can be segmented into a sequence of dictionary words": a one-dimensional DP over end positions.',
      '"* matches any sequence" or "? matches one character": pattern matching with a table.',
    ],
    notThis: [
      'A plain yes or no for Is Subsequence (LC 392): a greedy two-pointer pass does it in O(n).',
      'Substrings under a budget, as in LC 1208: contiguous and monotonic, so use a sliding window.',
      'An exact substring search, as in LC 28: KMP is linear, while the table would be O(n * m).',
    ],
    concepts: [
      'Size the table (n + 1) x (m + 1), so row 0 and column 0 stand for empty prefixes.',
      'When a[i - 1] == b[j - 1], the diagonal usually gives the answer. Otherwise combine the left and upper cells.',
      'Delete Operation (LC 583) = n + m - 2 * LCS, and Shortest Common Supersequence has length n + m - LCS.',
      'Reduce the table to one row when each cell only reads the previous row and the current row.',
      'Word Break: dp[i] is true if some j < i has dp[j] true and s[j:i] in the dictionary.',
    ],
    example: {
      problem: 'Edit Distance with a = "ab" and b = "bc"',
      lc: 72,
      walkthrough: [
        'The base rows give dp[0] = [0, 1, 2], dp[1][0] = 1 and dp[2][0] = 2.',
        'dp[1][1]: a and b differ, so 1 + min(1, 1, 0) = 1.',
        'dp[1][2]: a and c differ, so 1 + min(2, 1, 1) = 2.',
        'dp[2][1]: b and b match, so take the diagonal: dp[1][0] = 1.',
        'dp[2][2]: b and c differ, so 1 + min(dp[1][2] = 2, dp[2][1] = 1, dp[1][1] = 1) = 2.',
        'The answer is 2: delete a, then insert c at the end.',
      ],
    },
    code: `def edit_distance(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]`,
    complexity: 'O(n * m) time and space, or O(min(n, m)) space with rolling rows. Word Break is O(n^2) substring checks, each costing up to O(n) to hash.',
    pitfalls: [
      'Off-by-one between table and string: dp[i][j] compares a[i - 1] with b[j - 1].',
      'Leaving the base row at 0 in edit distance: turning "abc" into "" costs 3.',
      'With one rolling row, save the old diagonal value before it is overwritten.',
      'LC 44: a leading * can match empty, so dp[0][j] must stay true across the leading stars.',
      'LC 115: counts can get large in intermediate cells, so use a wide enough integer type.',
    ],
    pointsToPonder: [
      'What does each of the three neighbors in edit distance mean as an operation?',
      'Why does subsequence counting add two cases, while edit distance takes a minimum over three?',
      'How would you recover the actual answer string, rather than only its length, from the table?',
    ],
    practice: [1143, 583, 139, 72, 115],
    snippet: '40-edit-distance',
  },

  '10. Trie-Based String Problems': {
    crux: 'When many words share prefixes, store them as one tree: each lookup costs the word\'s length, however many words there are.',
    signals: [
      '"Any previously inserted word starts with the given prefix": the textbook use of a trie.',
      '"Replace each word with its shortest root": walk the word and stop at the first end-of-word node.',
      '"Suggest at most three products after each character is typed": walk one step per character.',
      '"Find all words from the dictionary on the board": prune the grid DFS with the trie.',
      '"Word may contain . which matches any letter": branch across every child at a dot.',
      '"Does a suffix of the characters streamed so far match a word?": insert the words reversed (LC 1032).',
    ],
    notThis: [
      'You only need exact whole-word lookups, with no prefix questions: a hash set is simpler and just as fast.',
      'One pattern and one text, as in LC 28: KMP uses less memory.',
      'A sorted static list with prefix queries, as in LC 1268: binary search also works and needs no tree.',
    ],
    concepts: [
      'Each node holds its children (an array of 26 or a map) and an end-of-word flag.',
      'Store extra data on a node: prefix counts for LC 2416, the value sum for LC 677, or the full word for LC 212.',
      'In Word Search II, delete or mark found words so that the same word isn\'t reported twice, and prune empty branches.',
      'Reversing the words turns a suffix query into a prefix query.',
    ],
    example: {
      problem: 'Replace Words with dictionary ["cat", "bat"] and sentence "the cattle"',
      lc: 648,
      walkthrough: [
        'Insert "cat" and "bat", which marks an end of word after c-a-t and after b-a-t.',
        '"the": the root has no child t, so no root applies and the word stays as it is.',
        '"cattle": c, then a, then t all exist, and the node after t is an end of word.',
        'Stop at index 2 and replace the word with "cat", ignoring the rest.',
        'The answer is "the cat".',
      ],
    },
    code: `def replace_words(dictionary, sentence):
    root = {}
    for word in dictionary:
        node = root
        for c in word:
            node = node.setdefault(c, {})
        node['$'] = True

    def shortest_root(word):
        node = root
        for i, c in enumerate(word):
            if c not in node:
                return word
            node = node[c]
            if '$' in node:
                return word[:i + 1]
        return word

    return ' '.join(shortest_root(w) for w in sentence.split())`,
    complexity: 'O(L) per insert or lookup, where L is the word length. Space is O(total characters * alphabet) with arrays, and less with maps.',
    pitfalls: [
      'Confusing a prefix with a word: search must also check the end-of-word flag, while startsWith must not.',
      'Allocating 26 pointers in each node can exhaust memory on large inputs, so consider a map or a node pool.',
      'LC 211: one dot means trying all children, so a query with many dots gets expensive.',
      'LC 212: without pruning found words, the DFS keeps revisiting dead branches and can report duplicates.',
    ],
    pointsToPonder: [
      'What would a hash set of all prefixes cost compared with a trie, in both time and memory?',
      'What should each node store to answer "how many words start with this prefix?" in O(L)?',
      'Why does Stream of Characters insert the words reversed?',
    ],
    practice: [720, 208, 648, 211, 212],
    snippet: '23-trie',
  },

  '11. Greedy / Construction': {
    crux: 'Build the answer left to right and let the earliest position win: a smaller or larger character there beats anything later.',
    signals: [
      '"Smallest possible integer after removing k digits": pop a larger digit when a smaller one arrives.',
      '"Smallest in lexicographical order" and "each letter exactly once": pop only if that letter appears again later.',
      '"No two adjacent characters are the same": place the most frequent first, and it fails if one exceeds (n + 1) / 2.',
      '"At least n intervals between the same tasks": the most frequent task sets the frame.',
      '"Arrange them to form the largest number": sort with a + b against b + a.',
    ],
    notThis: [
      'Zigzag Conversion (LC 6) and License Key Formatting (LC 482) have nothing to choose: they are simulations.',
      'A choice now changes which later choices are valid and no exchange argument holds, as in LC 72: use DP.',
      'Removing adjacent equal pairs with no ordering goal, as in LC 1047: a plain stack works with no greedy rule.',
    ],
    concepts: [
      'Monotonic stack: keep the kept characters increasing, and pop while removal budget or later copies allow it.',
      'Max-heap by count: take the most frequent available letter, and hold the last used one back until it is allowed again.',
      'Task Scheduler: (maxCount - 1) * (n + 1) + number of tasks tied at maxCount, floored at the task count.',
      'Exchange argument: swapping a and b is an improvement exactly when a + b beats b + a, which is why the comparator is valid.',
      'GCD of Strings: if a + b != b + a, no common divisor exists. Otherwise its length is gcd(len(a), len(b)).',
    ],
    example: {
      problem: 'Remove K Digits with num = "1432219" and k = 3',
      lc: 402,
      walkthrough: [
        '1: push, so the stack is [1]. 4: push, so the stack is [1, 4].',
        '3: 4 > 3, so pop and k = 2. Push to get [1, 3].',
        '2: 3 > 2, so pop and k = 1. Push to get [1, 2].',
        '2: equal to the top, so push to get [1, 2, 2].',
        '1: 2 > 1, so pop and k = 0. The budget is spent, so push to get [1, 2, 1].',
        '9: push to get [1, 2, 1, 9]. No budget or leading zeros remain, so the answer is "1219".',
      ],
    },
    code: `def remove_k_digits(num, k):
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop()
            k -= 1
        stack.append(d)
    stack = stack[:len(stack) - k]
    return ''.join(stack).lstrip('0') or '0'`,
    complexity: 'O(n) time and space for the monotonic stack. Heap-based rearrangement is O(n log A) for alphabet size A. Comparator sorting is O(k log k) comparisons, each of string length.',
    pitfalls: [
      'Leaving unused budget: on "12345" with k = 2 nothing pops, so cut k digits from the end.',
      'Returning "" or "0200": strip leading zeros, and return "0" if nothing is left.',
      'LC 316: popping without checking for later copies drops a letter for good, and an already-used letter must be skipped.',
      'LC 179: when all the numbers are 0, the result must be "0" rather than "00".',
      'LC 767: placing evens first only works when you start with the most frequent letter.',
    ],
    pointsToPonder: [
      'Why does a smaller digit earlier always beat any change later?',
      'What is the single extra check that turns Remove K Digits into Remove Duplicate Letters?',
      'Why is the a + b comparator a consistent ordering, when comparing characters directly is not?',
    ],
    practice: [1903, 1221, 767, 402, 316],
    snippet: '57-lexicographically-smallest-subsequence-of-distinct-chars',
  },

  '12. Bit & ASCII Tricks': {
    crux: 'A letter is a small integer: XOR cancels pairs, a 26-bit mask stores a set of letters, and bit 5 flips the case.',
    signals: [
      '"t is s with one added letter" or "every element appears twice except one": XOR everything.',
      '"The two words do not share common letters": compare letter masks with AND.',
      '"Transform every letter to lowercase or uppercase" to list all strings: a branch per letter, with c ^ 32 flipping the case.',
      '"Return all possible subsets": each mask from 0 to 2^n - 1 picks one subset.',
      '"Bitwise AND of all numbers in the range": the common binary prefix of the two ends.',
    ],
    notThis: [
      'Letter Combinations of a Phone Number (LC 17) is listed here, but it is plain backtracking with no bit logic.',
      'Restore the Array From Adjacent Pairs (LC 1743) is also listed here, but it is a graph problem: walk the path from an endpoint.',
      'You need letter counts, as in LC 242: a mask only stores presence, so use a frequency array.',
    ],
    concepts: [
      'x ^ x = 0 and x ^ 0 = x, so everything that appears in pairs cancels and order doesn\'t matter.',
      'mask |= 1 << (c - \'a\') adds a letter, and a & b == 0 means the two sets are disjoint.',
      'In ASCII, upper and lower case differ only in bit 5 (value 32), so c ^ 32 toggles the case of a letter.',
      'Keep only the longest word per mask to shrink the pair loop in LC 318.',
    ],
    example: {
      problem: 'Maximum Product of Word Lengths with ["ab", "cd", "a"]',
      lc: 318,
      walkthrough: [
        'Build the masks: "ab" = 0011, "cd" = 1100 and "a" = 0001.',
        'Pair ("ab", "cd"): 0011 & 1100 = 0, so no letters are shared, and the product is 2 * 2 = 4. best = 4.',
        'Pair ("ab", "a"): 0011 & 0001 = 0001, so they share a letter. Skip it.',
        'Pair ("cd", "a"): 1100 & 0001 = 0, and the product is 2 * 1 = 2, so best stays 4.',
        'The answer is 4.',
      ],
    },
    code: `def max_product(words):
    masks = []
    for word in words:
        mask = 0
        for c in word:
            mask |= 1 << (ord(c) - ord('a'))
        masks.append(mask)

    best = 0
    for i in range(len(words)):
        for j in range(i + 1, len(words)):
            if masks[i] & masks[j] == 0:
                best = max(best, len(words[i]) * len(words[j]))
    return best`,
    complexity: 'O(L + n^2) for L total characters across n words, with O(n) masks. XOR scans are O(n) time and O(1) space. Enumerating subsets is O(2^n * n).',
    pitfalls: [
      'Operator precedence: in C++ and Java, a & b == 0 parses as a & (b == 0), so write (a & b) == 0.',
      'c ^ 32 on a digit or a symbol turns it into a different character, so check that it is a letter first (LC 784).',
      'XOR only isolates the odd one out when everything else appears an even number of times.',
      'A mask loses counts and order: "aab" and "ab" have the same mask.',
      'Using 1 << 31 or higher in a 32-bit int overflows, which matters for masks over a larger alphabet or subsets.',
    ],
    pointsToPonder: [
      'Why does XOR not care about the order of the characters?',
      'For LC 318, why is it worth storing just the longest word for each mask?',
      'When is a bitmask a better set than a hash set, and when does it stop being possible?',
    ],
    practice: [136, 389, 784, 318, 201],
  },
}
