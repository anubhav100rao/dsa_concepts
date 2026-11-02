export const tries = {
  '1. Basic Trie Design / Implementation': {
    crux: 'A tree of character-keyed children with an isEnd flag at every word terminator — insert/search/startsWith are all O(L) in word length.',
    signals: [
      '"Implement a data structure that supports insert, search and startsWith": the prefix query is what rules out a plain hash set.',
      '"Search for a word that differs by exactly one character" or "search with a wildcard": a basic trie with a small twist in the walk.',
      '"Longest word that can be built one character at a time": each prefix of the word must be a marked node on the path.',
      'Many lowercase words that share prefixes, with queries arriving after the words are added.',
    ],
    notThis: [
      'Only exact lookups, as in Group Anagrams (LC 49): a hash map is simpler and uses far less memory.',
      'Longest Common Prefix (LC 14) asked once: comparing the strings column by column takes a few lines and no extra structure.',
    ],
    concepts: [
      'Two node-storage flavors: fixed children[26] (fast, alphabet-only) vs HashMap children (flexible, memory-light for sparse alphabets).',
      'Augment the node with metadata (count, value, sum, top-k) to power richer queries without changing the traversal shape.',
      'Delete is the trickiest op — decrement counts on the way down and prune dead leaves bottom-up.',
    ],
    example: {
      problem: 'Implement Trie: insert "app", query it, then insert "ap"',
      lc: 208,
      walkthrough: [
        'insert("app"): the root has no "a", so setdefault creates a -> p -> p and marks the last node end = True.',
        'search("app"): _walk follows a, p, p and lands on the marked node, so the answer is True.',
        'search("ap"): _walk lands on the second node, whose end is still False, so the answer is False.',
        'startsWith("ap"): _walk returns that same node. It isn\'t None, so the answer is True.',
        'insert("ap"): no new nodes are needed, only end = True on the second node. Now search("ap") is True.',
      ],
    },
    complexity: 'O(L) time per insert, search or startsWith, where L is the word length. O(total characters) nodes in the worst case, each holding up to alphabet-size child links.',
    pitfalls: [
      'Returning True from search because the walk finished: "ap" is a prefix of "app", but it isn\'t a word until its end flag is set.',
      'Hard-coding 26 children when the input can hold uppercase letters, digits or spaces: the index c - \'a\' goes out of range.',
      'Deleting a word by clearing only the end flag: any prefix counts stay too high and dead branches stay in the trie.',
    ],
    pointsToPonder: [
      'When does array[26] beat HashMap children — and when does the wasted space hurt (Unicode, sparse keys)?',
      'For Magic Dictionary (LC 676), is a trie with DFS+budget cleaner than precomputing all 1-edit neighbors into a HashSet?',
      'Does your trie need to support deletion? If yes, the node MUST store a parent / refcount, or you need recursive delete.',
    ],
    code: `# Implement Trie (LC 208)
class TrieNode:
    __slots__ = ('children', 'end')
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.end = True
    def _walk(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node.children: return None
            node = node.children[c]
        return node
    def search(self, word):
        node = self._walk(word); return bool(node and node.end)
    def startsWith(self, prefix):
        return self._walk(prefix) is not None`,
    practice: [14, 1065, 208, 211, 677],
    snippet: '1-basic-trie-array-children-lowercase-a-z',
  },

  '2. Search / Autocomplete / Prefix Matching': {
    crux: 'Walk the prefix in the trie; from the landing node, enumerate / rank descendants to surface matches.',
    signals: [
      '"After each character of searchWord is typed, suggest at most three products": walk one more node per keystroke.',
      '"Return the top 3 hot sentences that have the same prefix": rank what sits below the prefix node.',
      '"A dot can be matched with any letter": branch to every child at that position.',
      '"Check whether a suffix of the characters queried so far is one of the words": store the words reversed and walk the stream backward.',
    ],
    notThis: [
      'Number of Matching Subsequences (LC 792): the letters need not be adjacent, so a prefix walk fails. Bucket the words by the next letter each one is waiting for.',
      'Search Suggestions System (LC 1268) on a fixed list: sorting and binary searching for the prefix is shorter, because matches sit next to each other.',
    ],
    concepts: [
      'For top-k autocomplete, cache the top-k strings (or pointers) at every node — O(k) per query after O(N·L·k) build.',
      'For wildcard `.` search (LC 211), branch DFS at the wildcard position over all children.',
      'Stream of Characters (LC 1032) inserts patterns REVERSED so each new char walks backward through the trie.',
    ],
    example: {
      problem: 'Stream of Characters with words ["cd","f","kl"] and stream a, b, c, d, e, f',
      lc: 1032,
      walkthrough: [
        'Build from the reversed words: root -> d -> c ($), root -> f ($), root -> l -> k ($).',
        'query a, b, c: each new last letter is missing from the root, so the walk stops at once and returns False.',
        'query d: the stream is "abcd". Walking backward, d exists but has no $, then c exists and has $, so True ("cd" ended here).',
        'query e: e isn\'t in the root, so False.',
        'query f: f is in the root and has $, so True. The results are F, F, F, T, F, T.',
      ],
    },
    complexity: 'O(total word length) to build. Each query walks at most O(longest word) nodes, since the trie depth caps the backward walk. Space is O(total word length) plus the stored stream.',
    pitfalls: [
      'Checking for $ only where the walk stops: a shorter word can end earlier on the path, so test at every step.',
      'Inserting the words forward: you then need to restart a walk from every stream position, which is the slow approach reversing avoids.',
      'Keeping the whole stream forever: only the last (longest word) characters can ever matter, so a bounded buffer is enough.',
      'Treating a wildcard like a normal letter in LC 211: it has to try all children, not just one.',
    ],
    pointsToPonder: [
      'Why does the reverse-insertion trick work for streaming suffix-match — what does it turn suffix search into?',
      'When does Search Suggestions System (LC 1268) prefer "sort + binary search" over a trie — which is simpler given the input?',
      'For autocomplete ranking, when is top-k-per-node worth the storage vs ranking on the fly?',
    ],
    code: `# Stream of Characters (LC 1032) — suffix trie via reversed insert
class StreamChecker:
    def __init__(self, words):
        self.root = {}
        self.stream = []
        for w in words:
            node = self.root
            for c in reversed(w):
                node = node.setdefault(c, {})
            node['$'] = True
    def query(self, ch):
        self.stream.append(ch)
        node = self.root
        for c in reversed(self.stream):
            if c not in node: return False
            node = node[c]
            if node.get('$'): return True
        return False`,
    practice: [208, 1268, 211, 642, 1032],
    snippet: '3-autocomplete-collect-all-words-with-a-prefix',
  },

  '3. Word Search / Dictionary Problems': {
    crux: 'Build a trie of the dictionary, then DFS / DP through the input — the trie prunes branches that no word starts with.',
    signals: [
      '"Return all words on the board, formed from sequentially adjacent cells": many words share one grid search, so walk them together.',
      '"Can s be segmented into a space-separated sequence of dictionary words?": the walk from each position lists the possible next breaks.',
      '"Words comprised entirely of at least two shorter words in the given array": a word break run for each word.',
      '"Wrap every substring that appears in words in a pair of bold tags": mark each dictionary match in the string, then merge.',
    ],
    notThis: [
      'Word Search (LC 79) has one target word: plain grid backtracking does it, and a trie gains nothing.',
      'Word Ladder (LC 127) changes one letter per step toward a target: that is BFS over words, not a dictionary walk.',
    ],
    concepts: [
      'Word Search II (LC 212): DFS on the grid carrying a trie pointer; on a found word, REMOVE its leaf from the trie to prune future visits.',
      'Word Break (LC 139 / 140): trie membership check replaces O(1) HashSet lookup but enables early-exit when no prefix matches.',
      'Concatenated Words (LC 472): DP over each word, "next break" found by trie walk while scanning.',
    ],
    example: {
      problem: 'Word Search II on [[a,b],[c,d]] with words ["ab","acdb","ad"]',
      lc: 212,
      walkthrough: [
        'Build the trie: a -> b ($), a -> c -> d -> b ($), a -> d ($). The directions try down, up, right, then left.',
        'Start at a (0,0) and mark it #. Down goes to c, which is on the path a -> c. From c, the only unused neighbor is d, which is also on the path.',
        'From d, up reaches b, and that node holds $ = "acdb". Pop it into the output. The b node is now empty, so remove it, and the empty d and c nodes follow as the search unwinds.',
        'Back at a, right reaches b, and that node holds $ = "ab". Output it and prune it. Only a -> d remains.',
        'd isn\'t adjacent to a, so "ad" is never found. The other start cells (b, c and d) aren\'t root letters, so they stop at once. The answer is ["acdb","ab"].',
      ],
    },
    complexity: 'O(total word length) to build. The grid search is at most O(R·C·4·3^(L-1)) for longest word L, and pruning usually keeps it far below that. Space is O(total word length) plus O(L) recursion.',
    pitfalls: [
      'Reusing a cell in one word: mark it (here with #) before recursing and restore it afterward.',
      'Reporting a word twice when two paths spell it: popping $ the first time it is found removes the duplicate.',
      'Keeping found words in the trie: without pruning, later cells keep walking dead branches and LC 212 hits the time limit.',
      'Stopping a dictionary walk at the first word found: "cat" and "cats" can both lead to a different valid split.',
    ],
    pointsToPonder: [
      'For LC 212, why does deleting found words AND pruning empty leaves dramatically cut runtime — what is the upper bound on visits?',
      'For Word Break, is the trie strictly faster than a HashSet of words? When does it matter (long word lists, long input)?',
      'For Palindrome Pairs (LC 336), why is INSERTING REVERSED words the trick that turns the problem into a trie traversal?',
    ],
    code: `# Word Search II (LC 212) — trie + DFS with pruning
def findWords(board, words):
    root = {}
    for w in words:
        node = root
        for c in w: node = node.setdefault(c, {})
        node['$'] = w
    R, C, out = len(board), len(board[0]), []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        nxt = node[ch]
        if '$' in nxt:
            out.append(nxt.pop('$'))
        board[r][c] = '#'
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C:
                dfs(nr, nc, nxt)
        board[r][c] = ch
        if not nxt: node.pop(ch)
    for r in range(R):
        for c in range(C): dfs(r, c, root)
    return out`,
    practice: [648, 139, 2707, 212, 472],
    snippet: '5-word-search-ii-trie-grid-backtracking',
  },

  '4. Bitwise Trie (XOR Problems)': {
    crux: 'Insert each number bit-by-bit from MSB to LSB; for max XOR, greedily walk toward the OPPOSITE bit at every level.',
    signals: [
      '"Return the maximum result of nums[i] XOR nums[j]": for each number, you want its most different partner.',
      '"For each query [x, m], the maximum XOR of x with any element that does not exceed m": sort queries by m and insert as the bound grows.',
      '"Count pairs where low <= (nums[i] XOR nums[j]) <= high": store counts on the nodes.',
      '"Maximum XOR of any subarray": take prefix XORs, then it is a best-pair search over them.',
    ],
    notThis: [
      'Minimum XOR Sum of Two Arrays (LC 1879) gives every element exactly one partner: the best partner for one element can ruin another, so use bitmask DP.',
      'An exact target, as in "number of subarrays with XOR equal to k": the needed partner is known, so a hash map of prefix XORs finds it directly.',
    ],
    concepts: [
      '32 (or 30) levels deep, binary fan-out — total O(n · B) build, O(B) per query where B = bit width.',
      'Track count per node to support DELETE / range-count queries (LC 1803 Count Pairs With XOR in Range).',
      'Offline trick (LC 1707): sort queries by their upper bound and insert numbers as the bound grows.',
    ],
    example: {
      problem: 'Maximum XOR with nums = [3, 10, 5], which are 0011, 1010 and 0101',
      lc: 421,
      walkthrough: [
        'Insert all three. The bits above bit 3 are 0 for every number, so each query walks the single 0 branch and gains nothing there.',
        'Query 10 (1010). Bit 3: 10 has 1, want 0, and 3 and 5 are there, so res = 8.',
        'Bit 2: 10 has 0, want 1, and 5 is there (3 isn\'t), so res = 12. Bit 1: 10 has 1, want 0, and 5 has it, so res = 14. Bit 0: 10 has 0, want 1, and 5 has it, so res = 15.',
        'Query 3 (0011) goes to 10: bit 3 adds 8, bits 2 and 1 can\'t take the opposite, bit 0 adds 1, so res = 9.',
        'Query 5 (0101) goes to 10 and gets 15. The maximum of 9, 15, 15 is 15, and 10 XOR 5 = 15 confirms it.',
      ],
    },
    complexity: 'O(n·B) time and up to O(n·B) nodes, where B is the bit width (31 levels here). Each query is O(B).',
    pitfalls: [
      'Walking from the low bit: only high-bit-first makes the greedy valid, since one high bit outweighs all lower bits combined.',
      'Inserting fewer bits than the largest value needs: all numbers must have the same depth, or levels no longer line up.',
      'Querying an empty trie: the code assumes a path exists and would follow None. Insert before you query.',
      'Negative numbers: the sign bit breaks the ordering unless you offset the values or handle that bit separately.',
    ],
    pointsToPonder: [
      'Why MSB-first — what makes the highest set bit dominate every lower bit combined?',
      'For Count Pairs With XOR in Range, why does the recursion split into "definitely-in, definitely-out, recurse" based on the K-th bit?',
      'When the problem has negative numbers, how do you offset / handle the sign bit so the MSB ordering still works?',
    ],
    code: `# Maximum XOR of Two Numbers (LC 421)
class BitTrie:
    def __init__(self): self.ch = [None, None]
def insert(root, x, B=30):
    node = root
    for i in range(B, -1, -1):
        b = (x >> i) & 1
        if not node.ch[b]: node.ch[b] = BitTrie()
        node = node.ch[b]
def max_xor(root, x, B=30):
    node, res = root, 0
    for i in range(B, -1, -1):
        b = (x >> i) & 1
        want = 1 - b
        if node.ch[want]:
            res |= 1 << i; node = node.ch[want]
        else:
            node = node.ch[b]
    return res
root = BitTrie()
for x in nums: insert(root, x)
return max(max_xor(root, x) for x in nums)`,
    practice: [421, 1707, 1803, 1938],
    snippet: '6-bitwise-trie-maximum-xor-pair',
  },

  '5. Trie + DFS / Backtracking': {
    crux: 'Carry a trie pointer through a DFS / backtracking search; the trie pointer says "what continuations are still legal".',
    signals: [
      '"The kth row and column read the same string": each chosen row fixes a prefix the next row must start with.',
      '"Return all the numbers in the range [1, n] sorted in lexicographical order": a preorder walk of a digit tree.',
      '"Return the kth lexicographically smallest integer in the range [1, n]": count a subtree, then skip it or enter it.',
      'A search over "all ways to build a string" where most partial strings can\'t lead to a dictionary word.',
    ],
    notThis: [
      'Permutations (LC 46) has no dictionary to prune against: plain backtracking is all there is.',
      'Sum of Prefix Scores of Strings (LC 2416) never backtracks: it only reads counts along each word\'s own path, as in Section 17.',
    ],
    concepts: [
      'Trie pointer + DFS = "only explore prefixes that exist" — strictly prunes the brute-force search.',
      'Word Squares (LC 425): build prefix → words map (or trie), DFS row by row choosing words consistent with the partial square.',
      'Lexicographical Numbers (LC 386) / K-th Smallest (LC 440): walk a CONCEPTUAL trie (children 0..9, root has 1..9) without materializing it.',
    ],
    example: {
      problem: 'K-th Smallest in Lexicographical Order with n = 25, k = 13',
      lc: 440,
      walkthrough: [
        'The order starts 1, 10, 11, ..., 19, 2, 20, 21, and so on. Start with cur = 1 and k = 12, since cur is already the first number.',
        'count(1): one number at depth 1 (min(26, 2) - 1 = 1), then ten at depth 2 (min(26, 20) - 10 = 10), and 100 > 25 stops it. steps = 11.',
        '11 <= 12, so the whole subtree is before our target. k = 1 and cur moves to its sibling, 2.',
        'count(2): 1 at depth 1, then min(26, 30) - 20 = 6 at depth 2. steps = 7.',
        '7 > 1, so the target is inside this subtree. k = 0 and cur descends to 20.',
        'k = 0 ends the loop, so the answer is 20: the list reads 1, then 10 to 19 (11 numbers), then 2 (12th), then 20 (13th).',
      ],
    },
    complexity: 'O(log² n) for LC 440: at most 10 sibling moves per level over log n levels, each calling an O(log n) count. O(1) space. Grid and word-square searches depend on how hard the trie prunes.',
    pitfalls: [
      'Writing min(n, nxt) - cur: the bound must be n + 1, because n itself still counts at that depth.',
      'Starting with k instead of k - 1: cur = 1 is already the first number.',
      'Forgetting k -= 1 when descending: stepping into a child passes over the current node, which is one number.',
      'Overflow in fixed-width languages: cur and nxt grow past n by a factor of 10, so use a 64-bit type.',
    ],
    pointsToPonder: [
      'When does carrying the trie pointer save you over passing the current string/word index?',
      'For Word Squares, why does building "prefix → words containing that prefix" lookups beat a single trie traversal per cell?',
      'For LC 440, why is COUNTING the size of each conceptual subtree the key operation — and what is the closed-form?',
    ],
    code: `# K-th Smallest in Lexicographical Order (LC 440)
def findKthNumber(n, k):
    def count(prefix):
        cur, nxt = prefix, prefix + 1
        total = 0
        while cur <= n:
            total += min(n + 1, nxt) - cur
            cur *= 10; nxt *= 10
        return total
    cur, k = 1, k - 1
    while k > 0:
        steps = count(cur)
        if steps <= k:
            k -= steps; cur += 1
        else:
            k -= 1; cur *= 10
    return cur`,
    practice: [386, 211, 212, 425, 440],
    snippet: '5-word-search-ii-trie-grid-backtracking',
  },

  '6. Trie + DP': {
    crux: 'Use the trie to enumerate "next legal break points" during a DP over positions / states.',
    signals: [
      '"Break s into non-overlapping substrings from dictionary; minimize the extra characters left over": a DP on suffixes that tries every word from i.',
      '"Return all such possible sentences": memoize lists of sentences on the start index.',
      '"Determine if s can be segmented into dictionary words" when the dictionary is large and shares prefixes.',
      'A DP where the transition is "for every dictionary word that starts here", and the walk can stop when no word continues.',
    ],
    notThis: [
      'Number of Ways to Form a Target String (LC 1639): the DP runs on target index and column, and letter counts per column do the lookup. No trie needed.',
      'Minimum Cost to Convert String I (LC 2976) changes single letters: run Floyd-Warshall over the 26 letters. Tries matter only in the substring version.',
    ],
    concepts: [
      'Word Break II (LC 140): dp[i] = list of sentences for s[i:]; for each i, walk the trie through s[i:] to find every valid split.',
      'Extra Characters (LC 2707): dp[i] = min extras for s[i:]; transition either skips one char (+1) or matches a word in the trie (0).',
      'Number of Ways to Form Target (LC 1639): trie over columns of words gives an efficient lookup for "next char availability".',
    ],
    example: {
      problem: 'Extra Characters with s = "catsx" and dictionary ["cat","cats"]',
      lc: 2707,
      walkthrough: [
        'dp[5] = 0, since no characters are left. Fill from right to left, where dp[i] is the fewest extras in s[i:].',
        'i = 4 ("x"): skipping gives dp[5] + 1 = 1, and x isn\'t in the root. dp[4] = 1.',
        'i = 3, 2, 1: "s", "t" and "a" aren\'t in the root either, so each just adds 1. dp[3] = 2, dp[2] = 3, dp[1] = 4.',
        'i = 0: skipping gives dp[1] + 1 = 5. The walk c, a, t reaches $ at j = 2, so dp[0] = min(5, dp[3]) = 2.',
        'The walk continues to s and reaches $ at j = 3, so dp[0] = min(2, dp[4]) = 1. Then x isn\'t a child, so the walk stops. The answer is 1.',
      ],
    },
    complexity: 'O(total dictionary length) to build, then O(n·min(n, W)) for the DP, where W is the longest word. Space is O(n) plus the trie. Word Break II can be exponential in output size.',
    pitfalls: [
      'Using dp[j] instead of dp[j + 1]: a word ending at j leaves s[j + 1:] still to solve.',
      'Stopping at the first $: a longer word on the same path can do better, as "cats" beats "cat" here.',
      'Forgetting to break when the walk misses: that early exit is the reason to use a trie at all.',
      'Filling dp in the wrong direction: this form reads dp[j + 1], so it has to run from right to left.',
    ],
    pointsToPonder: [
      'When does the trie-augmented DP truly beat HashSet lookup — typically long words and many shared prefixes.',
      'For Word Break II, why does memoizing on suffix index suffice (the trie state is implicit)?',
      'For Palindrome Pairs (LC 336), how does Manacher / palindrome checks combine with trie walks?',
    ],
    code: `# Extra Characters in a String (LC 2707) — trie + DP
def minExtraChar(s, dictionary):
    root = {}
    for w in dictionary:
        node = root
        for c in w: node = node.setdefault(c, {})
        node['$'] = True
    n = len(s)
    dp = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        dp[i] = dp[i + 1] + 1   # skip char
        node = root
        for j in range(i, n):
            if s[j] not in node: break
            node = node[s[j]]
            if node.get('$'): dp[i] = min(dp[i], dp[j + 1])
    return dp[0]`,
    practice: [139, 2707, 140, 472],
    snippet: '8-trie-dp-word-break',
  },

  '7. Suffix Trie / Suffix-Based Problems': {
    crux: 'Insert all suffixes (or reversed words) into a trie to make suffix-membership / shared-suffix queries O(L).',
    signals: [
      '"Shortest reference string" where a word can be stored inside another if it is a suffix of it: reversed, suffixes become shared prefixes.',
      '"A suffix of the characters queried so far": match the stream tail by walking backward.',
      '"Find a word by both a prefix and a suffix": insert every suffix#word so one walk checks both.',
      '"Number of distinct substrings of a string": every substring is a prefix of some suffix, so count suffix-trie nodes.',
    ],
    notThis: [
      'Longest Duplicate Substring (LC 1044) on a long string: a suffix trie has O(n²) nodes. Use binary search with a rolling hash, or a suffix array.',
      'Longest Common Subpath (LC 1923): the sizes are too big for a trie, so binary search the length with hashing.',
    ],
    concepts: [
      'Short Encoding (LC 820): insert words REVERSED; only the deepest-leaf suffixes contribute to the encoding length.',
      'Stream of Characters (LC 1032): suffix trie over reversed patterns lets you match the stream tail char-by-char.',
      'Suffix-trie size is O(n²) for one string of length n — for large n, use suffix array / SA-IS instead.',
    ],
    example: {
      problem: 'Short Encoding of Words with ["time","me","bell"]',
      lc: 820,
      walkthrough: [
        'Insert reversed: "emit" creates e -> m -> i -> t. "em" follows e -> m and adds nothing. "lleb" creates its own branch.',
        'After all inserts, check each word\'s final node: is it still empty?',
        '"time" ends at t, which has no children, so it counts for 4 + 1 = 5.',
        '"me" ends at m, which has child i, so "me" is hidden inside "time" and counts for nothing.',
        '"bell" ends at b, which has no children, so it counts for 4 + 1 = 5. The total is 10, matching "time#bell#".',
      ],
    },
    complexity: 'O(total word length) time and space for reversed-word tries like this one. A suffix trie of one string of length n has O(n²) nodes, which is why large inputs need suffix arrays.',
    pitfalls: [
      'Checking for leaves during insertion: a later word can extend the node, so check only after all inserts.',
      'Leaving duplicates in: two copies of a word would each count as a leaf. The code uses set(words) to prevent that.',
      'Forgetting the +1: each kept word also needs its # terminator.',
      'Inserting words forward: then shared prefixes merge rather than shared suffixes, which is the wrong relation for LC 820.',
    ],
    pointsToPonder: [
      'Why does a SUFFIX trie blow up to O(n²) while a SUFFIX TREE compresses to O(n) — when do you need each?',
      'For LC 820, why does only counting LEAVES (* (depth+1)) give the right answer — what happens at internal duplicates?',
      'For Prefix and Suffix Search (LC 745), why does the combined key `suffix#prefix` give an O(L) lookup?',
    ],
    code: `# Short Encoding of Words (LC 820)
def minimumLengthEncoding(words):
    root = {}
    leaves = []
    for w in set(words):
        node = root
        for c in reversed(w):
            node = node.setdefault(c, {})
        leaves.append((node, len(w)))
    return sum(L + 1 for node, L in leaves if not node)`,
    practice: [820, 1062, 1032, 745, 1044],
  },

  '8. Compressed Trie / Radix Tree / Patricia Trie': {
    crux: 'Collapse chains of single-child nodes into one edge labeled with a substring — same queries, less memory.',
    signals: [
      '"Longest prefix match" on IP addresses or routes: the classic radix tree query.',
      '"Millions of keys with long shared prefixes" with a limit on memory.',
      'A design follow-up such as "how would you shrink this trie?": most nodes have one child, so merge those chains.',
      'Keys that are whole URL paths or hostnames, where single-character nodes would be wasteful.',
    ],
    notThis: [
      'Design File System (LC 1166): a plain trie on path components, or even a hash map of path to value, is enough for the interview.',
      'A small dictionary without a memory limit: a plain trie has the same query time with far less code, so split logic isn\'t worth writing.',
    ],
    concepts: [
      'Edges hold substrings (not single chars); a query walks edges and may split one mid-character on insert.',
      'Radix trees underpin IP routing (longest prefix match), filesystem paths, and version-control directories.',
      'Patricia tries are bit-level radix trees — historically used for routing tables.',
    ],
    example: {
      problem: 'Insert "test", "team", "te", then "tester" into an empty radix tree',
      walkthrough: [
        '"test": the root has no t, so add one edge labeled "test" to a new end node.',
        '"team": the edge "test" matches only "te" (j = 2), so split it. A new node sits under edge "te", and the old end node moves under edge "st". Then add edge "am" to a new end node.',
        '"te": edge "te" matches in full, so i = 2 and node = the split node. The word is used up, so the loop ends and node.end = True.',
        '"tester": walk "te", then edge "st" in full, reaching the old "test" end node at i = 4. It has no e child, so add edge "er" to a new end node.',
        'The four words now need 4 non-root nodes, where a per-character trie would need 8 (t, e, s, t, e, r, a, m).',
      ],
    },
    complexity: 'O(L) character comparisons per insert or lookup. Each insert adds at most 2 nodes, so there are O(number of words) nodes, plus the storage for the labels.',
    pitfalls: [
      'Moving end flags during a split: the old child keeps its own flag, and the split node gets end = True only if the new word stops exactly there.',
      'Keying children by the whole label: key them by first character so at most one edge can match.',
      'Treating a partial edge match as found on lookup: if the query stops mid-label, no key ends there.',
      'Forgetting to update the parent edge to label[:j] after moving the rest down to label[j:].',
    ],
    pointsToPonder: [
      'When does the memory savings of a radix tree justify the implementation complexity over a plain trie?',
      'For IP routing, why is LONGEST prefix match the natural query — and how does the radix tree enable it in O(W) (W = address width)?',
      'How does insert split an existing edge — and what bookkeeping (counts, isEnd) must move with the split?',
    ],
    code: `# Compressed trie sketch — edges hold substrings
class RadixNode:
    def __init__(self):
        self.children = {}   # first_char -> (label, RadixNode)
        self.end = False
def insert(root, word):
    node, i = root, 0
    while i < len(word):
        c = word[i]
        if c not in node.children:
            new = RadixNode(); new.end = True
            node.children[c] = (word[i:], new); return
        label, child = node.children[c]
        j = 0
        while j < len(label) and i + j < len(word) and label[j] == word[i + j]:
            j += 1
        if j == len(label):
            i += j; node = child
        else:
            split = RadixNode()
            split.children[label[j]] = (label[j:], child)
            node.children[c] = (label[:j], split)
            if i + j == len(word):
                split.end = True; return
            leaf = RadixNode(); leaf.end = True
            split.children[word[i + j]] = (word[i + j:], leaf)
            return
    node.end = True`,
    practice: [1166, 1948],
  },

  '9. Trie for Numbers (Digit Trie)': {
    crux: 'Treat each number as its DECIMAL digit sequence; the trie\'s 10-way branching encodes lexicographic order over numbers.',
    signals: [
      '"Return all the numbers in the range [1, n] sorted in lexicographical order" in O(n) time: preorder over digits, with no sorting.',
      '"Kth lexicographically smallest integer" with n up to 10^9: count subtrees without building them.',
      '"Longest common prefix between pairs of integers from two arrays": insert the digit strings of one array and walk the other.',
      '"Count the positive integers at most n that you can write using these digits": a walk over allowed digits, capped by n.',
    ],
    notThis: [
      'Count Special Integers (LC 2376) needs all-distinct digits: that state is a used-digit mask, so use digit DP.',
      'Largest Number (LC 179) orders given numbers by concatenation: a custom sort comparator solves it directly.',
    ],
    concepts: [
      'Lexicographical Numbers (LC 386): DFS the conceptual digit trie (root → 1..9, then 0..9 at each level), pruning at >n.',
      'K-th Smallest Lex (LC 440): count nodes ≤ n in each subtree via the formula min(n+1, next*10^k) - cur*10^k summed over depths.',
      'Numbers At Most N Given Digit Set (LC 902): digit DP that mirrors a trie walk over the allowed digit set.',
    ],
    example: {
      problem: 'Lexicographical Numbers with n = 13',
      lc: 386,
      walkthrough: [
        'dfs(1) adds 1, then tries children 10, 11, 12, 13. Each is added, and each one\'s first child (100, 110, ...) is over 13, so it returns.',
        'At 1, the next child is 14 > 13, so the loop returns. Larger digits would only be bigger.',
        'dfs(2) adds 2. Its first child, 20, is over 13, so it returns at once.',
        'dfs(3) through dfs(9) do the same.',
        'The result is [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9].',
      ],
    },
    complexity: 'O(n) time for LC 386, since each number is visited once with one failed child check. O(log n) recursion depth, plus the output list.',
    pitfalls: [
      'Starting the root loop at 0: numbers have no leading zero, so the first digit runs 1 to 9. Only deeper levels use 0 to 9.',
      'Using continue rather than return when nxt > n: all later digits are larger too, so continuing just wastes work.',
      'Sorting numbers as strings: it gives the right order, but O(n log n) time misses what the problem asks for.',
      'Comparing numbers by value inside the walk: 10 comes before 2 here, since order follows the digit path.',
    ],
    pointsToPonder: [
      'Why does the digit trie make lex-ordered iteration of numbers cheap, even though the numbers themselves are not lex-ordered as ints?',
      'For LC 440, why does materializing the trie cost too much but the subtree-size formula is O(log² n)?',
      'How does the digit trie generalize binary trie of XOR (LC 421) — same pattern, different base?',
    ],
    code: `# Lexicographical Numbers (LC 386) — DFS the conceptual digit trie
def lexicalOrder(n):
    out = []
    def dfs(cur):
        if cur > n: return
        out.append(cur)
        for d in range(10):
            nxt = cur * 10 + d
            if nxt > n: return
            dfs(nxt)
    for s in range(1, 10): dfs(s)
    return out`,
    practice: [386, 3043, 440, 902],
    snippet: '11-digit-trie-numbers-as-fixed-width-strings',
  },

  '10. Trie for File Systems / Paths': {
    crux: 'Each path component (directory or file name) is a trie node; the trie mirrors the directory tree exactly.',
    signals: [
      '"createPath returns false if the path already exists or its parent path doesn\'t exist": walk components and check each one.',
      '"ls returns the list of files and directories in lexicographic order": sorted children at a node.',
      '"Identical folders, with the same non-empty set of subfolders": build the tree, then compare subtrees.',
      'Paths given as "/a/b/c" or as lists like ["a","b"], where each piece is one level.',
    ],
    notThis: [
      'Simplify Path (LC 71) handles a single path string: a stack of components is all you need.',
      'Longest Absolute File Path (LC 388): a stack of lengths indexed by tab depth solves it in one pass with no tree.',
    ],
    concepts: [
      'Design File System (LC 1166): each createPath walks/creates the trie from "/"-split components; get is a lookup.',
      'In-Memory FS (LC 588): each node stores either children (directory) or a string buffer (file); ls returns sorted child names.',
      'Longest Absolute File Path (LC 388): track depth via leading-tab count; trie nodes optional — a stack suffices.',
    ],
    example: {
      problem: 'Design File System: create /a, /a/b and /c/d, then read',
      lc: 1166,
      walkthrough: [
        'createPath("/a", 1): split gives ["a"]. There are no parents to check, and a is new, so store it and return True.',
        'createPath("/a/b", 2): parent a exists, so step into its children. b is new, so store it and return True.',
        'createPath("/c/d", 3): parent c isn\'t in the root, so return False.',
        'createPath("/a", 5): a already exists, so return False.',
        'get("/a/b"): the walk finds a, then b, and val ends as 2. get("/c"): c is missing, so -1.',
      ],
    },
    complexity: 'O(P) per operation for a path with P characters (split plus the walk). O(total path components) space. In LC 588, ls adds O(k log k) to sort k children.',
    pitfalls: [
      'Forgetting that "/a".split("/") starts with an empty string: the [1:] slice drops it.',
      'Creating missing parents in LC 1166: createPath must fail instead. LC 588\'s mkdir, by contrast, does create them.',
      'In LC 588, ls on a file returns only that file\'s name, not a directory listing.',
      'Reassigning a value when the path already exists: the problem wants False, and the old value stays.',
    ],
    pointsToPonder: [
      'Why is the file-system trie naturally a RADIX tree (path components, not chars) — what would per-char branching cost?',
      'For deleteDuplicateFolders (LC 1948), how does subtree HASHING let you spot identical folder structures?',
      'How do you keep ls O(k log k) when each directory may have many children — sorted vs lazy-sort?',
    ],
    code: `# Design File System (LC 1166)
class FileSystem:
    def __init__(self):
        self.root = {}  # {name: (value, children)}
    def createPath(self, path, value):
        parts = path.split('/')[1:]
        node = self.root
        for p in parts[:-1]:
            if p not in node: return False
            node = node[p][1]
        if parts[-1] in node: return False
        node[parts[-1]] = (value, {})
        return True
    def get(self, path):
        parts = path.split('/')[1:]
        node = self.root; val = -1
        for p in parts:
            if p not in node: return -1
            val, node = node[p]
        return val`,
    practice: [1166, 71, 388, 588, 1948],
    snippet: '2-trie-hash-map-children-arbitrary-alphabet',
  },

  '11. Trie + Greedy': {
    crux: 'At each trie level, take the locally best branch (smallest char, opposite bit, shortest root) — the structure guarantees globally optimal.',
    signals: [
      '"Replace each derivative with the root; if several roots apply, use the shortest": the first end marker on the walk is the answer.',
      '"Longest word built one character at a time; on a tie, the lexicographically smallest": prefer smaller children during the walk.',
      '"Maximum XOR": take the opposite bit whenever it exists.',
      'A choice made level by level, where any option at a higher level beats everything below it.',
    ],
    notThis: [
      'Delete Columns to Make Sorted III (LC 960) is an LIS-style DP over columns, despite its listing here. No trie gives the answer.',
      'Minimum Number of Valid Strings to Form Target (LC 3291): walking one trie level is not enough. Compute the longest match at each position, then cover the target like Jump Game II.',
    ],
    concepts: [
      'Max XOR (LC 421): greedy "opposite bit" at every level → maximum result.',
      'Replace Words (LC 648): walk each word in the root trie; first time you hit an end-marker, you have the shortest root.',
      'K-th Smallest Lex (LC 440): greedy descent — if the current subtree has ≥ k, go deeper; else skip and decrement k.',
    ],
    example: {
      problem: 'Replace Words with dictionary ["ca","cat","rat"] and sentence "cattle rattled the"',
      lc: 648,
      walkthrough: [
        '"cattle": walk c, then a. The a node has $ = "ca", so return "ca" at once and never reach "cat".',
        '"rattled": walk r, a, t. The t node has $ = "rat", so return "rat".',
        '"the": t isn\'t in the root, so no root applies and the word stays.',
        'Join them to get "ca rat the".',
      ],
    },
    complexity: 'O(total dictionary length) to build, plus O(total sentence length) to replace. O(total dictionary length) space.',
    pitfalls: [
      'Checking for $ only at the end of the word: "cattle" would never match, since the root ends partway along the walk.',
      'Checking for $ before stepping to the child: a root that equals the whole word is then never seen, because no later letter triggers the check.',
      'Returning nothing when no root matches: the original word must stay in the sentence.',
      'Assuming greedy fits any level-by-level trie problem: it works only if the higher level strictly dominates, as a high bit or an earlier letter does.',
    ],
    pointsToPonder: [
      'When is the local trie-level choice provably optimal — and what is the exchange argument?',
      'For LC 648, what happens with multiple matching roots — does "first end on the way down" always give the shortest?',
      'For LC 3291 (Min Valid Strings to Form Target), how does the Aho-Corasick failure-link greedy interact with the trie?',
    ],
    code: `# Replace Words (LC 648) — greedy shortest root
def replaceWords(dictionary, sentence):
    root = {}
    for w in dictionary:
        node = root
        for c in w: node = node.setdefault(c, {})
        node['$'] = w
    def shortest(word):
        node = root
        for c in word:
            if c not in node: return word
            node = node[c]
            if '$' in node: return node['$']
        return word
    return ' '.join(shortest(w) for w in sentence.split())`,
    practice: [648, 720, 421, 440, 3291],
    snippet: '10-trie-shortest-unique-prefix-replace-words',
  },

  '12. Trie + Hashing / Serialization': {
    crux: 'Hash each subtree by its (children → child_hash) structure; identical subtrees collide → enables dedup / matching.',
    signals: [
      '"Two folders are identical if they contain the same non-empty set of identical subfolders": compare subtrees by a canonical string.',
      '"Serialize and deserialize an N-ary tree": write the structure with sentinels so it can be rebuilt.',
      '"Find duplicate subtrees" where the tree is built from paths or strings.',
      'Equality that depends on shape and child names, not on where the subtree sits.',
    ],
    notThis: [
      'Palindrome Pairs (LC 336) is listed here but runs on reversed words and palindrome checks, as in Section 20, with no subtree hashing.',
      'Implement Magic Dictionary (LC 676): hashing each word with one letter blanked out is enough, and subtrees never need comparing.',
    ],
    concepts: [
      'Delete Duplicate Folders (LC 1948): post-order serialize each subtree; folders with the same serial form an equivalence class to delete.',
      'Encode N-ary Tree (LC 431) / Serialize N-ary Tree (LC 428): linearize the trie/tree to a string with sentinels.',
      'For Palindrome Pairs (LC 336), trie + reverse insertion + palindrome-suffix check builds matches in O(N·L²).',
    ],
    example: {
      problem: 'Delete Duplicate Folders with paths /a, /c, /d, /a/b, /c/b and /d/a',
      lc: 1948,
      walkthrough: [
        'Build the tree: a holds b, c holds b, and d holds a.',
        'encode bottom-up: each leaf returns "". So a serializes to "b()", c also to "b()", and d to "a()". Now seen["b()"] = 2 and seen["a()"] = 1.',
        'collect at the root: a has s = "b()" with count 2, so skip it and its whole subtree. The same goes for c.',
        'd has s = "a()" with count 1, so output [d] and go into it.',
        'd/a is a leaf, so s = "" and the empty check keeps it. Output [d, a]. The answer is [[d], [d, a]].',
      ],
    },
    complexity: 'O(total path parts) to build. Encoding sorts each node\'s children and joins strings, so a deep tree can cost O(N²) characters in the worst case. Space is the same, for the stored serials.',
    pitfalls: [
      'Treating leaf folders as duplicates: their serial is empty, and the problem only compares folders with non-empty contents.',
      'Skipping the sort: the same children in a different order would produce different serials.',
      'Hashing pre-order: the parent\'s serial needs its children\'s serials, so it has to be post-order.',
      'Leaving out delimiters: without the parentheses, different shapes can flatten to the same string.',
    ],
    pointsToPonder: [
      'Why must subtree hashing be POST-ORDER — what breaks if you hash pre-order?',
      'When does string-based serialization beat tuple-based hashing — and when is the reverse true (collision risk)?',
      'For LC 1948, why is "delete only if duplicate class has ≥ 2 members" the exact criterion (single occurrence is kept)?',
    ],
    code: `# Delete Duplicate Folders (LC 1948) — subtree serialization
def deleteDuplicateFolder(paths):
    root = {}
    for p in paths:
        node = root
        for x in p: node = node.setdefault(x, {})
    from collections import Counter, defaultdict
    seen = Counter()
    serial = {}
    def encode(node):
        if not node: return ''
        parts = []
        for name in sorted(node):
            parts.append(name + '(' + encode(node[name]) + ')')
        s = ''.join(parts); serial[id(node)] = s; seen[s] += 1
        return s
    encode(root)
    out = []
    def collect(node, path):
        for name, child in node.items():
            s = serial.get(id(child), '')   # leaf folders have no serial
            if s and seen[s] >= 2: continue
            out.append(path + [name])
            collect(child, path + [name])
    collect(root, [])
    return out`,
    practice: [820, 676, 428, 1948, 336],
  },

  '13. Persistent Trie': {
    crux: 'Each update creates only the O(log W) nodes on the affected root-to-leaf path; old versions stay queryable.',
    concepts: [
      'For XOR-on-subarray queries, persistent BINARY trie over prefix XORs lets you query max/count XOR in a range [L,R].',
      'Each "version" is a root pointer; query at version v walks ONLY that version\'s nodes.',
      'Space: O((N + Q) · B) where B is bit width — manageable for B ≈ 30 and N, Q ≤ 10^5.',
    ],
    pointsToPonder: [
      'Why does path-copying preserve O(log W) per update — and how does it differ from copy-on-write at node granularity?',
      'For Max Genetic Difference (LC 1938), why does an Euler-tour + offline ordering let you avoid persistence (using insert/erase)?',
      'When is persistence strictly required vs when can offline sorting / Mo\'s on tree replace it?',
    ],
    code: `# Persistent binary trie sketch (subarray XOR queries)
class PNode:
    __slots__ = ('ch', 'cnt')
    def __init__(self): self.ch = [None, None]; self.cnt = 0
def insert(prev, x, B=30):
    cur = PNode(); root = cur
    src = prev
    for i in range(B, -1, -1):
        b = (x >> i) & 1
        cur.ch[1 - b] = src.ch[1 - b] if src else None
        cur.ch[b] = PNode()
        cur.cnt = (src.cnt if src else 0) + 1
        cur = cur.ch[b]
        src = src.ch[b] if src else None
    cur.cnt = (src.cnt if src else 0) + 1
    return root`,
  },

  '14. Trie on Tree (Trie + Tree Traversal)': {
    crux: 'Do a DFS over the (binary / general) tree while maintaining a TRIE of "values seen on the current root-to-node path".',
    concepts: [
      'Insert on the way down, delete on the way back up — the trie always reflects the path from the root.',
      'Max Genetic Difference (LC 1938): bitwise trie on ancestor genes; query each node\'s gene for max XOR with any ancestor.',
      'Count Palindromic Paths in Tree (LC 2791): bitmask of character parities along the path; "trie" is implicit via a HashMap.',
    ],
    pointsToPonder: [
      'Why must you BOTH insert (going down) AND remove (going back up) — what breaks if you only insert?',
      'For LC 1938, how do offline queries grouped by node + Euler tour eliminate persistent-trie complexity?',
      'When does the "trie" degenerate into a simple HashMap keyed by some path summary (bitmask, hash)?',
    ],
    code: `# Max Genetic Difference (LC 1938) — bitwise trie + DFS on tree
def maxGeneticDifference(parents, queries):
    n = len(parents)
    children = [[] for _ in range(n)]
    root = -1
    for i, p in enumerate(parents):
        if p == -1: root = i
        else: children[p].append(i)
    from collections import defaultdict
    Q = defaultdict(list)
    for i, (node, val) in enumerate(queries):
        Q[node].append((val, i))
    ans = [0] * len(queries)
    B = 17
    trie = [[0, 0, 0]]  # [child0, child1, count]
    def add(x, delta):
        cur = 0
        for i in range(B, -1, -1):
            b = (x >> i) & 1
            if trie[cur][b] == 0:
                trie.append([0, 0, 0]); trie[cur][b] = len(trie) - 1
            cur = trie[cur][b]; trie[cur][2] += delta
    def best(x):
        cur, res = 0, 0
        for i in range(B, -1, -1):
            b = (x >> i) & 1; want = 1 - b
            if trie[cur][want] and trie[trie[cur][want]][2]:
                res |= 1 << i; cur = trie[cur][want]
            else:
                cur = trie[cur][b]
        return res
    def dfs(u):
        add(u, +1)
        for val, idx in Q[u]: ans[idx] = best(val)
        for v in children[u]: dfs(v)
        add(u, -1)
    dfs(root)
    return ans`,
  },

  '15. Trie + Bit Manipulation': {
    crux: 'Binary trie (children[0], children[1]) lets you do bit-by-bit GREEDY queries — max XOR, count XOR in range, k-th XOR.',
    concepts: [
      'Same template as Section 4 but the bit-manipulation lens emphasizes COUNTING / range queries, not just max.',
      'Count Pairs With XOR in Range (LC 1803): at each bit, the K-bound and X-bit determine "definitely in / out / recurse".',
      'Min XOR Sum (LC 1879) uses bitmask DP, NOT a trie — recognize the distinction.',
    ],
    pointsToPonder: [
      'Why is the MSB the natural pivot for every bitwise greedy / counting problem?',
      'For LC 1803, why does the recursion split into ≤ 2 child branches per level (and the third short-circuits)?',
      'How would you support DELETE on the binary trie — what does cnt at each node need to track?',
    ],
    code: `# Count Pairs With XOR in Range (LC 1803)
class Node:
    __slots__ = ('ch', 'cnt')
    def __init__(self): self.ch = [None, None]; self.cnt = 0
def count_less(root, x, k, B=14):
    node, cnt = root, 0
    for i in range(B, -1, -1):
        if not node: break
        kb = (k >> i) & 1
        xb = (x >> i) & 1
        if kb == 1:
            if node.ch[xb]: cnt += node.ch[xb].cnt
            node = node.ch[1 - xb]
        else:
            node = node.ch[xb]
    return cnt`,
  },

  '16. Aho-Corasick (Multi-Pattern Matching on Trie)': {
    crux: 'Build a trie of all patterns; BFS to add FAILURE links (longest proper suffix that is also a prefix) → walk the text once, in O(N + total matches).',
    concepts: [
      'Failure link from u points to the trie node spelling the longest proper suffix of u\'s string that is also a trie prefix — KMP generalized to many patterns.',
      'Output links: at each node, walk failure pointers to collect all patterns ending here (or precompute the closest end-marker).',
      'Stream of Characters (LC 1032) is the cleanest interview-scale Aho-Corasick problem.',
    ],
    pointsToPonder: [
      'How do failure links generalize the KMP failure function — what is the single-pattern special case?',
      'Why does BFS (not DFS) build correct failure links — what invariant does it rely on?',
      'When does Aho-Corasick beat repeated KMP — and when does repeated KMP win (very few patterns)?',
    ],
    code: `# Aho-Corasick skeleton — build trie + failure links via BFS
from collections import deque
def build_ac(patterns):
    trie = [{}]
    out = [[]]; fail = [0]
    for p in patterns:
        node = 0
        for c in p:
            if c not in trie[node]:
                trie.append({}); out.append([]); fail.append(0)
                trie[node][c] = len(trie) - 1
            node = trie[node][c]
        out[node].append(p)
    q = deque()
    for c, v in trie[0].items():
        fail[v] = 0; q.append(v)
    while q:
        u = q.popleft()
        for c, v in trie[u].items():
            f = fail[u]
            while f and c not in trie[f]: f = fail[f]
            fail[v] = trie[f].get(c, 0) if v != trie[f].get(c, 0) else 0
            out[v].extend(out[fail[v]])
            q.append(v)
    return trie, fail, out`,
  },

  '17. Trie + Counting / Frequency': {
    crux: 'Augment each trie node with counts (words passing through, sum of values, top-k) to answer aggregate queries in O(L).',
    concepts: [
      'Map Sum Pairs (LC 677): each node stores SUM OF VALUES of all words passing through; insert delta-updates the path.',
      'Sum of Prefix Scores (LC 2416): node.cnt = #words sharing this prefix; answer for word = sum of cnt along its insertion path.',
      'Top-K Frequent Words (LC 692): trie + bucket (or count→list) gives an alternative to heap-based ranking.',
    ],
    pointsToPonder: [
      'For Map Sum Pairs, why must you store the DELTA when updating an existing key (not just the new value)?',
      'For Sum of Prefix Scores, why does node.cnt-during-insertion equal "number of words with this prefix"?',
      'When does counting on the trie beat a sorted HashMap or a Fenwick tree (typically when the trie structure is the natural index)?',
    ],
    code: `# Map Sum Pairs (LC 677)
class MapSum:
    def __init__(self):
        self.root = {'$': 0, '_v': {}}
        self.vals = {}
    def insert(self, key, val):
        delta = val - self.vals.get(key, 0)
        self.vals[key] = val
        node = self.root
        for c in key:
            node = node.setdefault(c, {'$': 0})
            node['$'] += delta
    def sum(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node: return 0
            node = node[c]
        return node['$']`,
  },

  '18. Trie vs HashMap — When Trie Wins': {
    crux: 'Trie wins when you need PREFIX semantics, ORDERED iteration, or PRUNING during traversal — HashMap loses all three.',
    concepts: [
      'Prefix queries (startsWith, autocomplete, longest-common-prefix) are O(L) in trie vs O(N·L) in HashMap.',
      'Pruning during DFS (Word Search II) — trie cuts dead branches that HashMap cannot see.',
      'Ordered / ranked retrieval (top-k autocomplete) — trie nodes can cache top-k cheaply.',
    ],
    pointsToPonder: [
      'For pure exact-match dictionary, when does HashMap actually win (small N, no prefix queries, no ordering)?',
      'For Word Search II, can you quantify why trie pruning gives a polynomial speedup over per-word HashSet checks?',
      'For Maximum XOR (LC 421), trie is O(N·32); is the HashSet variant truly the same complexity — what is the constant difference?',
    ],
    code: `# Trie startsWith vs HashSet — qualitative
# HashSet: must scan all keys, O(N * L) per query.
# Trie: walk prefix, O(L) per query.
def startsWith_trie(root, prefix):
    node = root
    for c in prefix:
        if c not in node: return False
        node = node[c]
    return True`,
  },

  '19. Trie in System Design Context': {
    crux: 'Trie is the canonical structure for autocomplete, typeahead, DNS resolution, IP routing, spell-check — anywhere prefix or hierarchical matching dominates.',
    concepts: [
      'Autocomplete: trie + per-node top-k cache; updates propagate top-k upward on insert.',
      'DNS / URL routing: trie on path components (radix tree) gives longest-prefix match in O(W).',
      'Spell check: trie + DFS with edit-distance budget gives "did you mean" suggestions.',
    ],
    pointsToPonder: [
      'When does sharding the trie matter (huge dictionaries)? What hash key — prefix, first-char, range?',
      'How does the top-k-per-node cache evict / update under writes — is it eventually-consistent or strict?',
      'For DNS hierarchical lookups, why does the trie naturally encode the zone-of-authority hierarchy?',
    ],
    code: `# Autocomplete sketch — trie node with top-k cache
class ACNode:
    def __init__(self):
        self.ch = {}
        self.top = []   # best K as (-freq, word), best first
def insert(root, word, freq, K=3):
    node = root
    for c in word:
        node = node.ch.setdefault(c, ACNode())
        node.top.append((-freq, word))
        node.top.sort()
        del node.top[K:]
def suggest(root, prefix):
    node = root
    for c in prefix:
        if c not in node.ch: return []
        node = node.ch[c]
    return [w for _, w in sorted(node.top)]`,
  },

  '20. Advanced / Contest-Level Trie Problems': {
    crux: 'Most "hard" trie problems COMBINE the trie with another technique: backtracking, bitmask, DP, hashing, Euler tour, or Aho-Corasick failure links.',
    concepts: [
      'Palindrome Pairs (LC 336): reverse-insert + palindrome-suffix probe at every node along the walk.',
      'Word Squares (LC 425): prefix → words map + DFS row by row, consistency check via the partial square.',
      'Min Valid Strings to Form Target (LC 3291): Aho-Corasick on patterns + greedy interval covering on the target.',
    ],
    pointsToPonder: [
      'Which canonical lens does THIS problem combine with — backtracking? bitmask? failure links? DSU?',
      'When the brute force is exponential, what does the trie collapse — repeated prefix work, branching factor, or both?',
      'If trie alone is not enough, what auxiliary structure (segment tree, BIT, Euler-tour timer) closes the gap?',
    ],
    code: `# Palindrome Pairs (LC 336) — trie + palindrome-suffix probe
def palindromePairs(words):
    def is_pal(s, i, j):
        while i < j:
            if s[i] != s[j]: return False
            i += 1; j -= 1
        return True
    root = {}
    for i, w in enumerate(words):
        node = root
        for j in range(len(w) - 1, -1, -1):
            # w[0..j] is what's left unconsumed if another word ends at this node
            if is_pal(w, 0, j): node.setdefault('pal', []).append(i)
            node = node.setdefault(w[j], {})
        node['$'] = i
    out = []
    for i, w in enumerate(words):
        node = root
        for k, c in enumerate(w):
            if '$' in node and node['$'] != i and is_pal(w, k, len(w) - 1):
                out.append([i, node['$']])
            if c not in node: break
            node = node[c]
        else:
            if '$' in node and node['$'] != i: out.append([i, node['$']])
            for j in node.get('pal', []):
                if j != i: out.append([i, j])
    return out`,
  },
}
