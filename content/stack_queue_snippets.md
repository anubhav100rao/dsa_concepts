## 1. Basic Stack — array-backed

**Use when:** The newest item is the next one to act on: undo, cancel, or pair with the previous item.

```cpp
stack<int> st;

st.push(x);

if (!st.empty()) {
    int top = st.top();
    st.pop();
}

int sz = st.size();
```

Manual stack on a vector (faster, indexable):

```cpp
vector<int> st;

st.push_back(x);

if (!st.empty()) {
    int top = st.back();
    st.pop_back();
}
```

**Complexity:** `O(1)` per operation, `O(n)` space.

**Example:** `push 1`, `push 2`, `top` -> `2`; after `pop`, `top` -> `1`.

**Pitfalls:** Calling `top()` or `pop()` on an empty stack is undefined behavior, so check `empty()` first. `std::stack::pop()` returns nothing, so read `top()` before popping.

**Used in:** LC 682, LC 844, LC 1047, LC 1544, LC 1598

---

## 2. Parentheses / Bracket Matching

**Use when:** The problem says "valid" or "balanced" and there is more than one bracket type.

```cpp
bool isValid(string s) {
    stack<char> st;

    unordered_map<char, char> match = {
        {')', '('}, {']', '['}, {'}', '{'}
    };

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != match[c]) return false;
            st.pop();
        }
    }

    return st.empty();
}
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `"()[]{}"` -> `true`; `"([)]"` -> `false`; `"(("` -> `false`.

**Pitfalls:** Check for an empty stack before reading the top, or `")"` crashes. Return `st.empty()` at the end, or `"(("` passes.

**Used in:** LC 20, LC 921, LC 1249, LC 32, LC 678

---

## 3. Monotonic Stack — Next Greater Element (to the right)

**Use when:** You need the "next greater", "next smaller" or "how many days until" answer for every position.

Returns index of next strictly greater element, or `-1`.

```cpp
vector<int> nextGreater(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1);
    stack<int> st; // stores indices, decreasing values

    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] < a[i]) {
            res[st.top()] = i;
            st.pop();
        }
        st.push(i);
    }

    return res;
}
```

Variants — flip the comparison / direction:

```cpp
// Next smaller   -> a[st.top()] > a[i]
// Previous greater-> iterate right to left, a[st.top()] < a[i]
// Previous smaller-> iterate right to left, a[st.top()] > a[i]
```

**Complexity:** `O(n)` time, since each index is pushed and popped once. `O(n)` space.

**Example:** `a = [2, 1, 2, 4, 3]` -> `[3, 2, 3, -1, -1]`, which are indices, not values.

**Pitfalls:** `<` leaves equal values waiting for something strictly greater, and `<=` lets an equal value answer them. Choose by what the problem says about ties.

**Used in:** LC 496, LC 503, LC 739, LC 1475, LC 1019

---

## 4. Monotonic Stack — Largest Rectangle in Histogram

**Use when:** You want the "largest rectangle" under bars, or per-row heights in a binary matrix.

```cpp
long long largestRectangle(vector<int>& h) {
    int n = h.size();
    stack<int> st;
    long long best = 0;

    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];

        while (!st.empty() && h[st.top()] >= cur) {
            int height = h[st.top()];
            st.pop();
            int left = st.empty() ? -1 : st.top();
            int width = i - left - 1;
            best = max(best, (long long)height * width);
        }

        st.push(i);
    }

    return best;
}
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `h = [2, 1, 5, 6, 2, 3]` -> `10`.

**Pitfalls:** The loop must reach `i == n` with height 0, or bars still on the stack are never measured. Width after a pop uses the new top, with `-1` when the stack is empty.

**Used in:** LC 84, LC 85, LC 1504

---

## 5. Monotonic Stack — Stock Span

**Use when:** You need the count of consecutive earlier values that are less than or equal to the current one.

Consecutive days (including today) with price `<=` today's price.

```cpp
vector<int> stockSpan(vector<int>& price) {
    int n = price.size();
    vector<int> span(n);
    stack<int> st; // indices, decreasing price

    for (int i = 0; i < n; i++) {
        while (!st.empty() && price[st.top()] <= price[i]) {
            st.pop();
        }
        span[i] = st.empty() ? i + 1 : i - st.top();
        st.push(i);
    }

    return span;
}
```

**Complexity:** `O(n)` time, `O(1)` amortized per price. `O(n)` space.

**Example:** `price = [100, 80, 60, 70, 60, 75, 85]` -> `[1, 1, 1, 2, 1, 4, 6]`.

**Pitfalls:** Pop on `<=`, not `<`, because equal prices belong in the span. With an empty stack the span is `i + 1`, not `i`.

**Used in:** LC 901, LC 739, LC 1944

---

## 6. Monotonic Stack — Sum of Subarray Minimums

**Use when:** You need the "sum of the minimum" over every subarray and `n` is too large for `O(n²)`.

Contribution of each element as the minimum, over all subarrays.

```cpp
long long sumSubarrayMins(vector<int>& a) {
    const long long MOD = 1e9 + 7;
    int n = a.size();
    vector<long long> left(n), right(n);
    stack<int> st;

    // count of subarrays where a[i] is the min, extending left
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] > a[i]) st.pop();
        left[i] = st.empty() ? i + 1 : i - st.top();
        st.push(i);
    }

    while (!st.empty()) st.pop();

    // extending right (strict on one side to avoid double counting)
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && a[st.top()] >= a[i]) st.pop();
        right[i] = st.empty() ? n - i : st.top() - i;
        st.push(i);
    }

    long long res = 0;
    for (int i = 0; i < n; i++) {
        res = (res + (long long)a[i] * left[i] % MOD * right[i]) % MOD;
    }

    return res;
}
```

**Complexity:** `O(n)` time for two passes, `O(n)` space.

**Example:** `a = [3, 1, 2, 4]` -> `17`.

**Pitfalls:** One side must be strict and the other not, or `[2, 2]` counts its full subarray twice. Keep products in `long long` and reduce as you add.

**Used in:** LC 907, LC 2104, LC 2281

---

## 7. Monotonic Stack — Lexicographic / Greedy Removal

**Use when:** The problem asks for the "lexicographically smallest" result after removing characters that keep their order.

Remove `k` digits to make the smallest number.

```cpp
string removeKdigits(string num, int k) {
    string st;

    for (char c : num) {
        while (!st.empty() && k > 0 && st.back() > c) {
            st.pop_back();
            k--;
        }
        st.push_back(c);
    }

    while (k-- > 0 && !st.empty()) st.pop_back();

    // strip leading zeros
    int i = 0;
    while (i < (int)st.size() && st[i] == '0') i++;

    string res = st.substr(i);
    return res.empty() ? "0" : res;
}
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `num = "1432219"`, `k = 3` -> `"1219"`; `num = "10"`, `k = 2` -> `"0"`.

**Pitfalls:** Rising input like `"1234"` never pops, so spend leftover `k` from the end. Strip leading zeros, and return `"0"` if nothing is left.

**Used in:** LC 402, LC 1673, LC 321

---

## 8. Expression Evaluation — Basic Calculator (+ - * /)

**Use when:** You evaluate a string with `+ - * /` and need precedence but have no parentheses.

```cpp
int calculate(string s) {
    stack<int> nums;
    long long num = 0;
    char op = '+';

    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];

        if (isdigit(c)) num = num * 10 + (c - '0');

        if ((!isdigit(c) && c != ' ') || i == (int)s.size() - 1) {
            if (op == '+') nums.push(num);
            else if (op == '-') nums.push(-num);
            else if (op == '*') { int t = nums.top(); nums.pop(); nums.push(t * num); }
            else if (op == '/') { int t = nums.top(); nums.pop(); nums.push(t / num); }
            op = c;
            num = 0;
        }
    }

    int res = 0;
    while (!nums.empty()) { res += nums.top(); nums.pop(); }
    return res;
}
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `"3+2*2"` -> `7`; `" 3/2 "` -> `1`.

**Pitfalls:** The last number has no operator after it, so the `i == size - 1` check must flush it. This version has no parentheses: LC 224 and LC 772 need context saved at each `(`.

**Used in:** LC 227, LC 224, LC 772

---

## 9. Stack for Iterative DFS

**Use when:** You need depth-first order, but the depth could overflow the call stack.

```cpp
void dfsIterative(int src, vector<vector<int>>& g) {
    int n = g.size();
    vector<bool> visited(n, false);
    stack<int> st;

    st.push(src);

    while (!st.empty()) {
        int u = st.top();
        st.pop();

        if (visited[u]) continue;
        visited[u] = true;

        // process u

        for (int v : g[u]) {
            if (!visited[v]) st.push(v);
        }
    }
}
```

**Complexity:** `O(V + E)` time. `O(V + E)` space, because a vertex can be pushed once per incoming edge.

**Example:** `g = {0: [1, 2], 1: [3], 2: [], 3: []}`, `src = 0` -> visits `0, 2, 1, 3`.

**Pitfalls:** Neighbors pop in reverse order, so push them reversed if the order matters. Marking on pop means duplicates can sit on the stack, so keep the `visited` check after the pop.

**Used in:** LC 144, LC 114, LC 200

---

## 10. Decode Nested String

**Use when:** The input has nested "k[...]" parts, or any context to save at an opener and combine at a closer.

`3[a2[c]]` -> `accaccacc`.

```cpp
string decodeString(string s) {
    stack<int> counts;
    stack<string> strs;
    string cur;
    int k = 0;

    for (char c : s) {
        if (isdigit(c)) {
            k = k * 10 + (c - '0');
        } else if (c == '[') {
            counts.push(k);
            strs.push(cur);
            k = 0;
            cur.clear();
        } else if (c == ']') {
            int rep = counts.top(); counts.pop();
            string prev = strs.top(); strs.pop();
            string repeated;
            while (rep-- > 0) repeated += cur;
            cur = prev + repeated;
        } else {
            cur += c;
        }
    }

    return cur;
}
```

**Complexity:** Roughly `O(L)` time and space, where `L` is the decoded length.

**Example:** `"3[a2[c]]"` -> `"accaccacc"`; `"2[ab]3[c]"` -> `"ababccc"`.

**Pitfalls:** Counts can have several digits, so build `k` as `k * 10 + digit`. Reset both `k` and `cur` after pushing them.

**Used in:** LC 394, LC 726, LC 385, LC 1190

---

## 11. Monotonic Deque — Sliding Window Maximum

**Use when:** You need the "maximum of each window of size k", or a DP that takes the best of the last `k` states.

`O(n)` window max over window size `k`.

```cpp
vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> dq; // indices, decreasing values
    vector<int> res;

    for (int i = 0; i < (int)a.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();

        dq.push_back(i);

        if (i >= k - 1) res.push_back(a[dq.front()]);
    }

    return res;
}
```

For window **minimum**, flip to `a[dq.back()] >= a[i]`.

**Complexity:** `O(n)` time, since each index enters and leaves once. `O(k)` space.

**Example:** `a = [1, 3, -1, -3, 5]`, `k = 3` -> `[3, 3, 5]`.

**Pitfalls:** The window is `i - k + 1..i`, so expire the front when `dq.front() <= i - k`. Only output once `i >= k - 1`.

**Used in:** LC 239, LC 1696, LC 1425, LC 1438, LC 862

---

## 12. BFS Queue — Level-Order Traversal

**Use when:** The problem talks about "levels" of a tree: level order, zigzag, right side view, or minimum depth.

```cpp
void levelOrder(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int sz = q.size();

        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front();
            q.pop();

            // process node at current level

            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        // end of one level
    }
}
```

**Complexity:** `O(n)` time, `O(w)` space, where `w` is the widest level.

**Example:** `[3, 9, 20, null, null, 15, 7]` -> levels `[3]`, `[9, 20]`, `[15, 7]`.

**Pitfalls:** Save `q.size()` before the inner loop, since children change it. Handle a null root before pushing.

**Used in:** LC 102, LC 103, LC 199, LC 637, LC 111

---

## 13. BFS on Grid — shortest path in unweighted grid

```cpp
int bfsGrid(vector<vector<int>>& grid, int sr, int sc) {
    int n = grid.size(), m = grid[0].size();
    vector<vector<int>> dist(n, vector<int>(m, -1));
    queue<pair<int,int>> q;

    dist[sr][sc] = 0;
    q.push({sr, sc});

    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};

    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();

        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];

            if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
            if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;

            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }

    return dist[n - 1][m - 1];
}
```

---

## 14. Deque — 0-1 BFS

Edge weights are only 0 or 1; push 0-weight to front, 1-weight to back.

```cpp
vector<int> zeroOneBFS(int src, vector<vector<pair<int,int>>>& g) {
    int n = g.size();
    vector<int> dist(n, INT_MAX);
    deque<int> dq;

    dist[src] = 0;
    dq.push_front(src);

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();

        for (auto [v, w] : g[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }

    return dist;
}
```

---

## 15. Circular Queue — fixed capacity design

```cpp
struct CircularQueue {
    vector<int> data;
    int head = 0, count = 0, cap;

    CircularQueue(int k) : data(k), cap(k) {}

    bool enqueue(int x) {
        if (count == cap) return false;
        data[(head + count) % cap] = x;
        count++;
        return true;
    }

    bool dequeue() {
        if (count == 0) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }

    int front() { return count ? data[head] : -1; }
    int rear()  { return count ? data[(head + count - 1) % cap] : -1; }

    bool isEmpty() { return count == 0; }
    bool isFull()  { return count == cap; }
};
```

---

## 16. Stack for Path Simplification

`/a/./b/../../c/` -> `/c`.

```cpp
string simplifyPath(string path) {
    vector<string> st;
    stringstream ss(path);
    string part;

    while (getline(ss, part, '/')) {
        if (part.empty() || part == ".") continue;
        if (part == "..") {
            if (!st.empty()) st.pop_back();
        } else {
            st.push_back(part);
        }
    }

    string res;
    for (string& s : st) res += "/" + s;
    return res.empty() ? "/" : res;
}
```

---

## 17. Stack-Based Greedy — Remove Duplicate Letters

Smallest lexicographic result with each letter once.

```cpp
string removeDuplicateLetters(string s) {
    vector<int> last(26, 0);
    vector<bool> inStack(26, false);

    for (int i = 0; i < (int)s.size(); i++) last[s[i] - 'a'] = i;

    string st;

    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (inStack[c - 'a']) continue;

        while (!st.empty() && st.back() > c && last[st.back() - 'a'] > i) {
            inStack[st.back() - 'a'] = false;
            st.pop_back();
        }

        st.push_back(c);
        inStack[c - 'a'] = true;
    }

    return st;
}
```

---

## 18. Asteroid Collision

```cpp
vector<int> asteroidCollision(vector<int>& a) {
    vector<int> st;

    for (int x : a) {
        bool alive = true;

        while (alive && x < 0 && !st.empty() && st.back() > 0) {
            if (st.back() < -x) {
                st.pop_back();          // top explodes, x continues
            } else if (st.back() == -x) {
                st.pop_back();          // both explode
                alive = false;
            } else {
                alive = false;          // x explodes
            }
        }

        if (alive) st.push_back(x);
    }

    return st;
}
```

---

## 19. Queue via Two Stacks

Amortized `O(1)` per operation.

```cpp
struct MyQueue {
    stack<int> in, out;

    void push(int x) { in.push(x); }

    void transfer() {
        if (out.empty()) {
            while (!in.empty()) {
                out.push(in.top());
                in.pop();
            }
        }
    }

    int pop() {
        transfer();
        int x = out.top();
        out.pop();
        return x;
    }

    int peek() {
        transfer();
        return out.top();
    }

    bool empty() { return in.empty() && out.empty(); }
};
```

---

## 20. Min Stack — O(1) minimum

```cpp
struct MinStack {
    stack<int> st;
    stack<int> mn; // running minimum

    void push(int x) {
        st.push(x);
        mn.push(mn.empty() ? x : min(mn.top(), x));
    }

    void pop() {
        st.pop();
        mn.pop();
    }

    int top() { return st.top(); }
    int getMin() { return mn.top(); }
};
```

---

## 21. Bidirectional BFS

Meet in the middle from both ends; expand the smaller frontier.

```cpp
int biBFS(string start, string target,
          unordered_set<string>& dict) {
    unordered_set<string> a{start}, b{target}, visited;
    int steps = 1;

    while (!a.empty() && !b.empty()) {
        if (a.size() > b.size()) swap(a, b);

        unordered_set<string> next;

        for (string word : a) {
            for (string cand : neighbors(word, dict)) {
                if (b.count(cand)) return steps + 1;
                if (!visited.count(cand)) {
                    visited.insert(cand);
                    next.insert(cand);
                }
            }
        }

        a = next;
        steps++;
    }

    return 0;
}
```

---

## 22. Round-Robin / Queue Simulation

```cpp
// Tasks served in cycles; re-enqueue if work remains.
queue<pair<int,int>> q; // {id, remaining}

for (int i = 0; i < n; i++) q.push({i, work[i]});

int time = 0;

while (!q.empty()) {
    auto [id, rem] = q.front();
    q.pop();

    int run = min(rem, quantum);
    time += run;
    rem -= run;

    if (rem > 0) q.push({id, rem});
    else finish[id] = time;
}
```

---

## 23. Monotonic Stack + DP — Sum of Subarray Ranges

Range = max - min; sum contributions of max and min separately.

```cpp
long long subArrayRanges(vector<int>& a) {
    int n = a.size();

    auto sumExtreme = [&](bool wantMax) -> long long {
        vector<long long> left(n), right(n);
        stack<int> st;

        for (int i = 0; i < n; i++) {
            while (!st.empty() &&
                   (wantMax ? a[st.top()] <  a[i]
                            : a[st.top()] >  a[i])) st.pop();
            left[i] = st.empty() ? i + 1 : i - st.top();
            st.push(i);
        }

        while (!st.empty()) st.pop();

        for (int i = n - 1; i >= 0; i--) {
            while (!st.empty() &&
                   (wantMax ? a[st.top()] <= a[i]
                            : a[st.top()] >= a[i])) st.pop();
            right[i] = st.empty() ? n - i : st.top() - i;
            st.push(i);
        }

        long long sum = 0;
        for (int i = 0; i < n; i++)
            sum += (long long)a[i] * left[i] * right[i];
        return sum;
    };

    return sumExtreme(true) - sumExtreme(false);
}
```

---

## Common Choose-What Pattern

```cpp
// Balanced brackets / matching       -> stack
// Next/previous greater or smaller   -> monotonic stack (indices)
// Histogram / max rectangle          -> monotonic stack
// Subarray min/max contribution      -> monotonic stack + count of spans
// Lexicographically smallest result  -> greedy monotonic stack
// Nested decode / calculator         -> stack of state
// Sliding window min/max             -> monotonic deque
// Level-order / shortest unweighted  -> BFS queue
// Edge weights 0/1                    -> deque 0-1 BFS
// Queue from stacks / O(1) min       -> two-stack / aux-stack design
// FIFO with fixed capacity           -> circular queue
```
