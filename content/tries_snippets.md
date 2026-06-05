## 1. Basic Trie — array children (lowercase a–z)

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

---

## 2. Trie — hash-map children (arbitrary alphabet)

Use when the charset is large or sparse.

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

---

## 3. Autocomplete — collect all words with a prefix

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

---

## 4. Wildcard Search — `.` matches any char

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

---

## 5. Word Search II — trie + grid backtracking

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

---

## 6. Bitwise Trie — Maximum XOR Pair

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

---

## 7. Bitwise Trie — count pairs with XOR < limit

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

---

## 8. Trie + DP — Word Break

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

---

## 9. Trie with Counts — prefix frequency / count words

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

---

## 10. Trie — Shortest Unique Prefix / Replace Words

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

---

## 11. Digit Trie — numbers as fixed-width strings

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

---

## 12. Aho-Corasick — multi-pattern matching

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

---

## 13. Persistent Trie — versioned bitwise insert

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
    t[cur].cnt = (t[t[cur].child[0]].cnt) + (t[t[cur].child[1]].cnt);
    return cur;
}
// query max-xor on [l, r] by diffing roots[r+1] and roots[l]
```

---

## 14. Trie + Greedy — lexicographically smallest result

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

---

# Common Choose-What Pattern

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
