## 1. Basic Trie — array children (lowercase a–z)

**Use when:** The problem asks for insert, search and prefix queries on lowercase words.

**Complexity:** O(L) time per operation for a word of length L. O(26 · nodes) space, with at most one node per inserted character.

```cpp
struct Trie {
    struct Node {
        Node* child[26] = {};
        bool end = false;
    };
    Node* root = new Node();

    void insert(const string& word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->child[i]) cur->child[i] = new Node();
            cur = cur->child[i];
        }
        cur->end = true;
    }

    bool search(const string& word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->child[i]) return false;
            cur = cur->child[i];
        }
        return cur->end;
    }

    bool startsWith(const string& prefix) {
        Node* cur = root;
        for (char c : prefix) {
            int i = c - 'a';
            if (!cur->child[i]) return false;
            cur = cur->child[i];
        }
        return true;
    }
};
```

**Example:** Insert `"app"`. Then `search("app")` is `true`, `search("ap")` is `false`, and `startsWith("ap")` is `true`.

**Pitfalls:**

- `search` must return `cur->end`, not `true`: reaching a node only proves a prefix exists.
- `c - 'a'` is out of range for anything but lowercase letters.

**Used in:** LC 14, LC 208, LC 720, LC 1065

---

## 2. Trie — hash-map children (arbitrary alphabet)

**Use when:** The charset is large or sparse: mixed case, punctuation, Unicode or whole tokens.

**Complexity:** O(L) expected time per insert. Space is proportional to the characters stored, with no empty slots, but each map has a higher constant.

```cpp
struct Node {
    unordered_map<char, Node*> child;
    bool end = false;
};

void insert(Node* root, const string& word) {
    Node* cur = root;
    for (char c : word) {
        if (!cur->child.count(c)) cur->child[c] = new Node();
        cur = cur->child[c];
    }
    cur->end = true;
}
```

**Example:** `insert(root, "Hi!")` creates the chain `H`, `i`, `!`, with `end = true` on the `!` node.

**Pitfalls:**

- Reading with `cur->child[c]` creates an entry when the key is missing. Use `find` or `count` in read-only searches.
- `unordered_map` has no sorted order: use `map` or sort the keys when output must be lexicographic.

**Used in:** LC 588, LC 642, LC 1023

---

## 3. Autocomplete — collect all words with a prefix

**Use when:** "Suggest the words that start with what was typed so far."

**Complexity:** O(P) to walk a prefix of length P, then O(size of that subtree) to collect it. O(longest word) recursion depth, plus the output.

```cpp
void dfs(Node* node, string& path, vector<string>& out) {
    if (node->end) out.push_back(path);
    for (int i = 0; i < 26; i++) {
        if (node->child[i]) {
            path.push_back('a' + i);
            dfs(node->child[i], path, out);
            path.pop_back();
        }
    }
}

vector<string> autocomplete(Node* root, const string& prefix) {
    Node* cur = root;
    for (char c : prefix) {
        int i = c - 'a';
        if (!cur->child[i]) return {};
        cur = cur->child[i];
    }
    vector<string> out;
    string path = prefix;
    dfs(cur, path, out);
    return out;
}
```

**Example:** With `car`, `card`, `cat` and `dog` inserted, `autocomplete(root, "ca")` returns `{"car", "card", "cat"}`, and `autocomplete(root, "x")` returns `{}`.

**Pitfalls:**

- Start `path` at the prefix, not empty, or the results lose their first letters.
- Check `node->end` before the children, so `car` comes before `card` and a word equal to the prefix isn't lost.
- Pop the character after each recursive call, or `path` keeps growing.

**Used in:** LC 642, LC 1268

---

## 4. Wildcard Search — `.` matches any char

**Use when:** "`.` can match any letter" in a dictionary you also add to.

**Complexity:** `addWord` is O(L). `search` is O(L) with no dots and up to O(26^d · L) with d dots. Recursion is O(L) deep.

```cpp
struct WordDictionary {
    struct Node { Node* child[26] = {}; bool end = false; };
    Node* root = new Node();

    void addWord(const string& word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->child[i]) cur->child[i] = new Node();
            cur = cur->child[i];
        }
        cur->end = true;
    }

    bool search(const string& word) {
        return dfs(word, 0, root);
    }

    bool dfs(const string& w, int idx, Node* node) {
        if (!node) return false;
        if (idx == (int)w.size()) return node->end;

        char c = w[idx];
        if (c == '.') {
            for (int i = 0; i < 26; i++)
                if (dfs(w, idx + 1, node->child[i])) return true;
            return false;
        }
        return dfs(w, idx + 1, node->child[c - 'a']);
    }
};
```

**Example:** After adding `bad` and `mad`: `search(".ad")` and `search("b..")` are `true`, while `search("b.")` and `search("pad")` are `false`.

**Pitfalls:**

- The word has to end on an `end` node: `"b."` reaches a node, but no word stops there.
- On a dot, return `true` as soon as one child succeeds. Returning the first child's result skips the others.

**Used in:** LC 211, LC 676

---

## 5. Word Search II — trie + grid backtracking

**Use when:** "Return all words from this list that can be traced on the board" through adjacent cells.

**Complexity:** O(total word length) to build. Search is at most O(R · C · 4 · 3^(L-1)) for longest word L. O(L) recursion depth.

```cpp
struct Node { Node* child[26] = {}; string word; };

void addWord(Node* root, const string& w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->child[i]) cur->child[i] = new Node();
        cur = cur->child[i];
    }
    cur->word = w; // store full word at terminal for O(1) collection
}

void dfs(vector<vector<char>>& b, int r, int c, Node* node,
         vector<string>& out) {
    char ch = b[r][c];
    if (ch == '#' || !node->child[ch - 'a']) return;

    node = node->child[ch - 'a'];
    if (!node->word.empty()) {
        out.push_back(node->word);
        node->word.clear();      // dedupe
    }

    b[r][c] = '#';
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    for (int d = 0; d < 4; d++) {
        int nr = r + dr[d], nc = c + dc[d];
        if (nr >= 0 && nr < (int)b.size() &&
            nc >= 0 && nc < (int)b[0].size())
            dfs(b, nr, nc, node, out);
    }
    b[r][c] = ch;
}
```

**Example:** On `{{a,b},{c,d}}` with words `ab`, `acdb` and `ad`, calling `dfs` from every cell finds `acdb` and `ab`. `ad` isn't adjacent.

**Pitfalls:**

- Call `dfs` from every cell with the root: the function only handles one starting point.
- Restore `b[r][c]` after the loop, or later starts see a damaged board.
- `node->word.clear()` removes duplicates, but doesn't prune. Remove empty child nodes too if LC 212 hits the time limit.

**Used in:** LC 212

---

## 6. Bitwise Trie — Maximum XOR Pair

**Use when:** "Maximum XOR of a pair" or "maximum XOR with a query value."

**Complexity:** O(B) per insert and query, with 31 levels here, so O(n · B) in all. Up to O(n · B) nodes.

```cpp
struct BitTrie {
    struct Node { Node* child[2] = {}; };
    Node* root = new Node();
    static const int B = 30; // bits, high to low

    void insert(int x) {
        Node* cur = root;
        for (int b = B; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (!cur->child[bit]) cur->child[bit] = new Node();
            cur = cur->child[bit];
        }
    }

    int maxXor(int x) {
        Node* cur = root;
        int res = 0;
        for (int b = B; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (cur->child[bit ^ 1]) {       // greedily take opposite bit
                res |= (1 << b);
                cur = cur->child[bit ^ 1];
            } else {
                cur = cur->child[bit];
            }
        }
        return res;
    }
};
```

Usage:

```cpp
BitTrie t;
int best = 0;
for (int x : nums) {
    t.insert(x);
    best = max(best, t.maxXor(x));
}
```

**Example:** For `nums = {3, 10, 5}`, `best` ends at `15`, from `10 ^ 5`.

**Pitfalls:**

- Insert before you query: `maxXor` on an empty trie follows a null pointer.
- `B = 30` covers non-negative `int` values only. Offset negatives or handle the sign bit.
- Insert from the high bit down. The greedy only works in that order.

**Used in:** LC 421, LC 1707, LC 1938

---

## 7. Bitwise Trie — count pairs with XOR < limit

**Use when:** "Count pairs whose XOR is below a limit" or "lies between low and high."

**Complexity:** O(B) per insert and count, so O(n · B) in all. Up to O(n · B) nodes.

```cpp
struct Node { Node* child[2] = {}; int cnt = 0; };

void insert(Node* root, int x, int B) {
    Node* cur = root;
    for (int b = B; b >= 0; b--) {
        int bit = (x >> b) & 1;
        if (!cur->child[bit]) cur->child[bit] = new Node();
        cur = cur->child[bit];
        cur->cnt++;
    }
}

// count inserted numbers y with (x ^ y) < limit
int countLess(Node* root, int x, int limit, int B) {
    Node* cur = root;
    int res = 0;
    for (int b = B; b >= 0 && cur; b--) {
        int xb = (x >> b) & 1;
        int lb = (limit >> b) & 1;
        if (lb == 1) {
            // taking same bit keeps xor bit 0 < 1 -> all of that subtree count
            if (cur->child[xb]) res += cur->child[xb]->cnt;
            cur = cur->child[xb ^ 1]; // descend where xor bit = 1
        } else {
            cur = cur->child[xb];     // must keep xor bit 0 to stay < limit
        }
    }
    return res;
}
```

**Example:** With `1` and `4` inserted and `B = 3`, `countLess(root, 2, 5, B)` returns `1`, since `2 ^ 1 = 3` is below 5 and `2 ^ 4 = 6` isn't.

**Pitfalls:**

- The bound is strict. For a range, compute `countLess(high + 1) - countLess(low)`.
- Query `x` before inserting it, or it pairs with itself and each pair is counted twice.
- Pick `B` to cover both the values and `limit`. `high + 1` can need one more bit than `high`.

**Used in:** LC 1803

---

## 8. Trie + DP — Word Break

**Use when:** "Can s be segmented into dictionary words?" with a long or prefix-heavy dictionary.

**Complexity:** O(n · min(n, W)) for string length n and longest word W, plus the trie build. O(n) for `dp`.

```cpp
bool wordBreak(const string& s, Node* root) {
    int n = s.size();
    vector<char> dp(n + 1, false);
    dp[0] = true;

    for (int i = 0; i < n; i++) {
        if (!dp[i]) continue;
        Node* cur = root;
        for (int j = i; j < n; j++) {
            int idx = s[j] - 'a';
            if (!cur->child[idx]) break;
            cur = cur->child[idx];
            if (cur->end) dp[j + 1] = true;
        }
    }

    return dp[n];
}
```

**Example:** With `cat`, `cats`, `and`, `sand` and `dog`, `wordBreak("catsand", root)` is `true` and `wordBreak("catsan", root)` is `false`.

**Pitfalls:**

- A word ending at index `j` sets `dp[j + 1]`, because `dp[i]` means the first `i` characters.
- Keep walking after a match: `cat` and `cats` can both lead to a valid split.
- Skip positions with `dp[i]` false: they can't start a new word.

**Used in:** LC 139, LC 140, LC 472, LC 2707

---

## 9. Trie with Counts — prefix frequency / count words

**Use when:** "How many words equal this?" or "how many words start with this prefix?"

**Complexity:** O(L) per operation. O(26 · nodes) space.

```cpp
struct Node {
    Node* child[26] = {};
    int pass = 0; // words passing through (prefix count)
    int end = 0;  // words ending here (exact count)
};

void insert(Node* root, const string& w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->child[i]) cur->child[i] = new Node();
        cur = cur->child[i];
        cur->pass++;
    }
    cur->end++;
}

int countWordsEqualTo(Node* root, const string& w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->child[i]) return 0;
        cur = cur->child[i];
    }
    return cur->end;
}

int countWordsStartingWith(Node* root, const string& p) {
    Node* cur = root;
    for (char c : p) {
        int i = c - 'a';
        if (!cur->child[i]) return 0;
        cur = cur->child[i];
    }
    return cur->pass;
}
```

**Example:** Insert `app`, `app` and `apple`. `countWordsEqualTo(root, "app")` is `2`, and `countWordsStartingWith(root, "app")` is `3`.

**Pitfalls:**

- Increment `pass` after stepping to the child, so the root isn't what counts each prefix.
- `end` is an exact count, and `pass` includes the word itself plus longer ones. Don't swap them.
- A delete must decrement `pass` along the whole path, as well as `end` at the last node.

**Used in:** LC 677, LC 2416

---

## 10. Trie — Shortest Unique Prefix / Replace Words

**Use when:** "Replace each word with its shortest dictionary root."

**Complexity:** O(L) per word, stopping early at the first root found.

Replace each word by the shortest root in the dictionary.

```cpp
string shortestRoot(Node* root, const string& word) {
    Node* cur = root;
    string prefix;
    for (char c : word) {
        int i = c - 'a';
        if (!cur->child[i]) return word;  // no root found
        prefix.push_back(c);
        cur = cur->child[i];
        if (cur->end) return prefix;      // shortest root reached
    }
    return word;
}
```

**Example:** With `ca`, `cat` and `rat` inserted: `shortestRoot(root, "cattle")` returns `"ca"`, `"the"` stays `"the"`, and `"c"` stays `"c"`.

**Pitfalls:**

- Check `end` after stepping to the child, or a root equal to the whole word gets missed.
- When no root applies, return the original word rather than the partial prefix.

**Used in:** LC 648

---

## 11. Digit Trie — numbers as fixed-width strings

**Use when:** Numbers must be compared digit by digit at the same depth.

**Complexity:** O(W) per insert for width W, and O(W) nodes per number at most. Here W = 10.

```cpp
// pad to fixed width so all numbers share depth (e.g. 10 digits)
string pad(long long x, int width = 10) {
    string s = to_string(x);
    return string(width - s.size(), '0') + s;
}

void insertNumber(Node* root, long long x) {
    string s = pad(x);
    Node* cur = root;
    for (char c : s) {
        int i = c - '0';
        if (!cur->child[i]) cur->child[i] = new Node();
        cur = cur->child[i];
    }
    cur->end = true;
}
```

(Node here uses `child[10]`.)

**Example:** `pad(42, 5)` returns `"00042"`. `insertNumber(root, 42)` walks the digits of `"0000000042"`.

**Pitfalls:**

- `width - s.size()` underflows if the number has more digits than `width`, so choose a width that fits the maximum.
- Padding lines up place values, but breaks digit prefixes: `12` and `123` no longer share a path. Skip it for prefix problems.
- Negative numbers don't fit this scheme, because `-` isn't a digit.

**Used in:** LC 3043 (insert without padding, since it compares prefixes)

---

## 12. Aho-Corasick — multi-pattern matching

**Use when:** "Find every occurrence of many patterns in a text or stream."

**Complexity:** O(26 · total pattern length) to build, then O(text length + matches) to scan. O(26 · nodes) space, plus the output lists.

Build a trie of patterns, then BFS to wire suffix (fail) links.

```cpp
struct Aho {
    struct Node {
        int child[26];
        int fail = 0;
        vector<int> out;          // pattern ids ending here
        Node() { fill(child, child + 26, -1); }
    };
    vector<Node> t{1};            // node 0 = root

    void add(const string& s, int id) {
        int u = 0;
        for (char c : s) {
            int i = c - 'a';
            if (t[u].child[i] == -1) {
                t[u].child[i] = t.size();
                t.emplace_back();
            }
            u = t[u].child[i];
        }
        t[u].out.push_back(id);
    }

    void build() {
        queue<int> q;
        for (int i = 0; i < 26; i++) {
            if (t[0].child[i] == -1) t[0].child[i] = 0;
            else { t[t[0].child[i]].fail = 0; q.push(t[0].child[i]); }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int i = 0; i < 26; i++) {
                int v = t[u].child[i];
                if (v == -1) {
                    t[u].child[i] = t[t[u].fail].child[i];
                } else {
                    t[v].fail = t[t[u].fail].child[i];
                    // inherit matches via fail link
                    auto& src = t[t[v].fail].out;
                    t[v].out.insert(t[v].out.end(), src.begin(), src.end());
                    q.push(v);
                }
            }
        }
    }

    // call for each position of text; collect matched pattern ids
    void match(const string& text) {
        int u = 0;
        for (char c : text) {
            u = t[u].child[c - 'a'];
            for (int id : t[u].out) {
                // pattern `id` ends at current position
            }
        }
    }
};
```

**Example:** Add `a` (id 0), `ab` (id 1) and `bab` (id 2), then scan `"bab"`. Nothing matches at index 0, id 0 at index 1, and ids 1 and 2 at index 2.

**Pitfalls:**

- Call `build()` after the last `add` and before `match`, or `-1` entries get used as node indexes.
- Build in BFS order: `t[u].fail` must already be final when `u` is processed.
- Keep the fail-link inheritance of `out`, or matches that end inside a longer pattern go missing.

**Used in:** LC 616, LC 758, LC 1032, LC 3291

---

## 13. Persistent Trie — versioned bitwise insert

**Use when:** "Maximum XOR with an element in nums[L..R]", or queries against an earlier version, when they can't be sorted offline.

**Complexity:** O(B) time and O(B) new nodes per insert, so O(n · B) in all. Range queries walk two versions in O(B).

Each insert creates a new root sharing untouched subtrees.

```cpp
struct Node { int child[2] = {-1, -1}; int cnt = 0; };
vector<Node> t(1);          // t[0] = empty node
vector<int> roots;          // roots[i] = version after i inserts

int insert(int prev, int x, int b) {
    int cur = t.size();
    t.push_back(prev == -1 ? Node() : t[prev]);
    if (b < 0) { t[cur].cnt++; return cur; }

    int bit = (x >> b) & 1;
    int nxt = insert(prev == -1 ? -1 : t[prev].child[bit], x, b - 1);
    t[cur].child[bit] = nxt;
    t[cur].cnt++;           // one more number passes through this node
    return cur;
}
// query max-xor on [l, r] by diffing roots[r+1] and roots[l]
```

**Example:** With `roots = {0}`, insert `5` then `3` using `b = 2`, pushing each returned root. `t[roots[2]].cnt` is `2`, `t[roots[1]].cnt` is `1`, and the two versions share the node for the `1` branch of `5`.

**Pitfalls:**

- A child can be `-1`, so check it before indexing `t`. Summing both children directly reads out of bounds.
- Version `i` holds the first `i` numbers, so range `[l, r]` is `roots[r + 1]` minus `roots[l]`.
- Don't keep a `Node&` across `insert`: `push_back` can reallocate `t`. This code uses indexes for that reason.

**Used in:** LC 1938 (also solvable offline; the other Section 13 problems have no LC number)

---

## 14. Trie + Greedy — lexicographically smallest result

**Use when:** The answer is the lexicographically smallest string that follows a path in the trie.

**Complexity:** O(26 · length) time, O(length) for the result.

Walk children in ascending order to build the smallest valid string.

```cpp
string smallest(Node* root, int length) {
    Node* cur = root;
    string res;
    for (int step = 0; step < length; step++) {
        for (int i = 0; i < 26; i++) {
            if (cur->child[i]) {     // earliest letter that exists
                res.push_back('a' + i);
                cur = cur->child[i];
                break;
            }
        }
    }
    return res;
}
```

**Example:** With `cab` and `bad` inserted, `smallest(root, 3)` is `"bad"`. `smallest(root, 5)` is also `"bad"`, since the path runs out.

**Pitfalls:**

- The result can be shorter than `length` when the path ends. Check its size if the length must be exact.
- This walk ignores `end`, so it can stop on a prefix that isn't a word. Add that check if the output must be a dictionary word.

**Used in:** LC 720

---

## Common Choose-What Pattern

**Use when:** You know the problem needs a trie, and you're choosing which kind.

**Complexity:** Word tries cost O(L) per operation and bitwise tries cost O(B). Grid search, wildcard search and Aho-Corasick matching add their own costs, listed in their sections.

```cpp
// Prefix lookup / startsWith         -> basic trie
// Large/sparse alphabet              -> hash-map children
// Wildcard '.' search                -> trie + DFS fallback
// Words embedded in a grid           -> trie + backtracking (store word at leaf)
// Max/min XOR, bit constraints       -> bitwise trie (high bit first)
// Count pairs by XOR threshold       -> bitwise trie with subtree counts
// Segment-into-dictionary-words      -> trie + DP (word break)
// Prefix / exact frequency           -> trie with pass + end counters
// Shortest unique root               -> stop at first end while descending
// Multi-pattern text search          -> Aho-Corasick (fail links)
// Range / versioned bit queries      -> persistent trie
```

**Example:** "Find every listed word on a board" matches the grid line, so use trie + backtracking (Section 5).

**Pitfalls:**

- Only exact lookups, with no prefix, order or pruning? A hash set is simpler than any line here.
- XOR with an exact target needs a hash map of prefix XORs, not a bitwise trie.

**Used in:** LC 139, LC 208, LC 211, LC 212, LC 421, LC 648, LC 1032, LC 1803, LC 1938, LC 2416
