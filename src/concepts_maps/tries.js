export const tries = {
  '1. Basic Trie Design / Implementation': {
    crux: 'A tree of character-keyed children with an isEnd flag at every word terminator — insert/search/startsWith are all O(L) in word length.',
    concepts: [
      'Two node-storage flavors: fixed children[26] (fast, alphabet-only) vs HashMap children (flexible, memory-light for sparse alphabets).',
      'Augment the node with metadata (count, value, sum, top-k) to power richer queries without changing the traversal shape.',
      'Delete is the trickiest op — decrement counts on the way down and prune dead leaves bottom-up.',
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
  },

  '2. Search / Autocomplete / Prefix Matching': {
    crux: 'Walk the prefix in the trie; from the landing node, enumerate / rank descendants to surface matches.',
    concepts: [
      'For top-k autocomplete, cache the top-k strings (or pointers) at every node — O(k) per query after O(N·L·k) build.',
      'For wildcard `.` search (LC 211), branch DFS at the wildcard position over all children.',
      'Stream of Characters (LC 1032) inserts patterns REVERSED so each new char walks backward through the trie.',
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
  },

  '3. Word Search / Dictionary Problems': {
    crux: 'Build a trie of the dictionary, then DFS / DP through the input — the trie prunes branches that no word starts with.',
    concepts: [
      'Word Search II (LC 212): DFS on the grid carrying a trie pointer; on a found word, REMOVE its leaf from the trie to prune future visits.',
      'Word Break (LC 139 / 140): trie membership check replaces O(1) HashSet lookup but enables early-exit when no prefix matches.',
      'Concatenated Words (LC 472): DP over each word, "next break" found by trie walk while scanning.',
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
  },

  '4. Bitwise Trie (XOR Problems)': {
    crux: 'Insert each number bit-by-bit from MSB to LSB; for max XOR, greedily walk toward the OPPOSITE bit at every level.',
    concepts: [
      '32 (or 30) levels deep, binary fan-out — total O(n · B) build, O(B) per query where B = bit width.',
      'Track count per node to support DELETE / range-count queries (LC 1803 Count Pairs With XOR in Range).',
      'Offline trick (LC 1707): sort queries by their upper bound and insert numbers as the bound grows.',
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
  },

  '5. Trie + DFS / Backtracking': {
    crux: 'Carry a trie pointer through a DFS / backtracking search; the trie pointer says "what continuations are still legal".',
    concepts: [
      'Trie pointer + DFS = "only explore prefixes that exist" — strictly prunes the brute-force search.',
      'Word Squares (LC 425): build prefix → words map (or trie), DFS row by row choosing words consistent with the partial square.',
      'Lexicographical Numbers (LC 386) / K-th Smallest (LC 440): walk a CONCEPTUAL trie (children 0..9, root has 1..9) without materializing it.',
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
  },

  '6. Trie + DP': {
    crux: 'Use the trie to enumerate "next legal break points" during a DP over positions / states.',
    concepts: [
      'Word Break II (LC 140): dp[i] = list of sentences for s[i:]; for each i, walk the trie through s[i:] to find every valid split.',
      'Extra Characters (LC 2707): dp[i] = min extras for s[i:]; transition either skips one char (+1) or matches a word in the trie (0).',
      'Number of Ways to Form Target (LC 1639): trie over columns of words gives an efficient lookup for "next char availability".',
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
  },

  '7. Suffix Trie / Suffix-Based Problems': {
    crux: 'Insert all suffixes (or reversed words) into a trie to make suffix-membership / shared-suffix queries O(L).',
    concepts: [
      'Short Encoding (LC 820): insert words REVERSED; only the deepest-leaf suffixes contribute to the encoding length.',
      'Stream of Characters (LC 1032): suffix trie over reversed patterns lets you match the stream tail char-by-char.',
      'Suffix-trie size is O(n²) for one string of length n — for large n, use suffix array / SA-IS instead.',
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
  },

  '8. Compressed Trie / Radix Tree / Patricia Trie': {
    crux: 'Collapse chains of single-child nodes into one edge labeled with a substring — same queries, less memory.',
    concepts: [
      'Edges hold substrings (not single chars); a query walks edges and may split one mid-character on insert.',
      'Radix trees underpin IP routing (longest prefix match), filesystem paths, and version-control directories.',
      'Patricia tries are bit-level radix trees — historically used for routing tables.',
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
  },

  '9. Trie for Numbers (Digit Trie)': {
    crux: 'Treat each number as its DECIMAL digit sequence; the trie\'s 10-way branching encodes lexicographic order over numbers.',
    concepts: [
      'Lexicographical Numbers (LC 386): DFS the conceptual digit trie (root → 1..9, then 0..9 at each level), pruning at >n.',
      'K-th Smallest Lex (LC 440): count nodes ≤ n in each subtree via the formula min(n+1, next*10^k) - cur*10^k summed over depths.',
      'Numbers At Most N Given Digit Set (LC 902): digit DP that mirrors a trie walk over the allowed digit set.',
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
  },

  '10. Trie for File Systems / Paths': {
    crux: 'Each path component (directory or file name) is a trie node; the trie mirrors the directory tree exactly.',
    concepts: [
      'Design File System (LC 1166): each createPath walks/creates the trie from "/"-split components; get is a lookup.',
      'In-Memory FS (LC 588): each node stores either children (directory) or a string buffer (file); ls returns sorted child names.',
      'Longest Absolute File Path (LC 388): track depth via leading-tab count; trie nodes optional — a stack suffices.',
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
  },

  '11. Trie + Greedy': {
    crux: 'At each trie level, take the locally best branch (smallest char, opposite bit, shortest root) — the structure guarantees globally optimal.',
    concepts: [
      'Max XOR (LC 421): greedy "opposite bit" at every level → maximum result.',
      'Replace Words (LC 648): walk each word in the root trie; first time you hit an end-marker, you have the shortest root.',
      'K-th Smallest Lex (LC 440): greedy descent — if the current subtree has ≥ k, go deeper; else skip and decrement k.',
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
  },

  '12. Trie + Hashing / Serialization': {
    crux: 'Hash each subtree by its (children → child_hash) structure; identical subtrees collide → enables dedup / matching.',
    concepts: [
      'Delete Duplicate Folders (LC 1948): post-order serialize each subtree; folders with the same serial form an equivalence class to delete.',
      'Encode N-ary Tree (LC 431) / Serialize N-ary Tree (LC 428): linearize the trie/tree to a string with sentinels.',
      'For Palindrome Pairs (LC 336), trie + reverse insertion + palindrome-suffix check builds matches in O(N·L²).',
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
            s = serial[id(child)]
            if s and seen[s] >= 2: continue
            out.append(path + [name])
            collect(child, path + [name])
    collect(root, [])
    return out`,
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
import heapq
class ACNode:
    def __init__(self):
        self.ch = {}
        self.top = []   # min-heap of (-freq, word)
def insert(root, word, freq, K=3):
    node = root
    for c in word:
        node = node.ch.setdefault(c, ACNode())
        heapq.heappush(node.top, (-freq, word))
        if len(node.top) > K: heapq.heappop(node.top)
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
            node = node.setdefault(w[j], {})
            if is_pal(w, 0, j): node.setdefault('pal', []).append(i)
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
            for j in node.get('pal', []):
                if j != i: out.append([i, j])
    return out`,
  },
}
