## 1. Basic Stack — array-backed

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

---

## 2. Parentheses / Bracket Matching

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

---

## 3. Monotonic Stack — Next Greater Element (to the right)

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

---

## 4. Monotonic Stack — Largest Rectangle in Histogram

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

---

## 5. Monotonic Stack — Stock Span

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

---

## 6. Monotonic Stack — Sum of Subarray Minimums

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

---

## 7. Monotonic Stack — Lexicographic / Greedy Removal

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

---

## 8. Expression Evaluation — Basic Calculator (+ - * /)

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

---

## 9. Stack for Iterative DFS

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

---

## 10. Decode Nested String

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

---

## 11. Monotonic Deque — Sliding Window Maximum

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

---

## 12. BFS Queue — Level-Order Traversal

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

# Common Choose-What Pattern

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
