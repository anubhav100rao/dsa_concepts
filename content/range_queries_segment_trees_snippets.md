## 1. Prefix Sum — static range sum `[l, r]`

```cpp
vector<long long> pref(n + 1, 0);

for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + a[i];
}

// sum from l to r, 0-indexed
long long rangeSum(int l, int r) {
    return pref[r + 1] - pref[l];
}
```

---

## 2. Prefix XOR — static range xor `[l, r]`

```cpp
vector<int> pxor(n + 1, 0);

for (int i = 0; i < n; i++) {
    pxor[i + 1] = pxor[i] ^ a[i];
}

int rangeXor(int l, int r) {
    return pxor[r + 1] ^ pxor[l];
}
```

---

## 3. Difference Array — range add, final array

Useful when many updates, no online queries.

```cpp
vector<long long> diff(n + 1, 0);

// add val to [l, r]
void rangeAdd(int l, int r, long long val) {
    diff[l] += val;
    if (r + 1 < n) diff[r + 1] -= val;
}

// build final array
for (int i = 1; i < n; i++) {
    diff[i] += diff[i - 1];
}
```

---

## 4. 2D Prefix Sum — matrix rectangle sum

```cpp
vector<vector<long long>> pref(n + 1, vector<long long>(m + 1, 0));

for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        pref[i + 1][j + 1] = a[i][j]
            + pref[i][j + 1]
            + pref[i + 1][j]
            - pref[i][j];
    }
}

// rectangle sum from (r1, c1) to (r2, c2), 0-indexed
long long rectSum(int r1, int c1, int r2, int c2) {
    return pref[r2 + 1][c2 + 1]
        - pref[r1][c2 + 1]
        - pref[r2 + 1][c1]
        + pref[r1][c1];
}
```

---

# Fenwick Tree / BIT

## 5. Fenwick Tree — point update, range sum query

```cpp
struct Fenwick {
    int n;
    vector<long long> bit;

    Fenwick(int n) : n(n), bit(n + 1, 0) {}

    void add(int idx, long long val) {
        idx++;
        while (idx <= n) {
            bit[idx] += val;
            idx += idx & -idx;
        }
    }

    long long sumPrefix(int idx) {
        idx++;
        long long res = 0;
        while (idx > 0) {
            res += bit[idx];
            idx -= idx & -idx;
        }
        return res;
    }

    long long rangeSum(int l, int r) {
        return sumPrefix(r) - (l ? sumPrefix(l - 1) : 0);
    }
};
```

Usage:

```cpp
Fenwick fw(n);

for (int i = 0; i < n; i++) {
    fw.add(i, a[i]);
}

fw.add(idx, delta);
long long ans = fw.rangeSum(l, r);
```

---

## 6. Fenwick Tree — range add, point query

```cpp
struct Fenwick {
    int n;
    vector<long long> bit;

    Fenwick(int n) : n(n), bit(n + 1, 0) {}

    void add(int idx, long long val) {
        idx++;
        while (idx <= n) {
            bit[idx] += val;
            idx += idx & -idx;
        }
    }

    long long get(int idx) {
        idx++;
        long long res = 0;
        while (idx > 0) {
            res += bit[idx];
            idx -= idx & -idx;
        }
        return res;
    }

    void rangeAdd(int l, int r, long long val) {
        add(l, val);
        if (r + 1 < n) add(r + 1, -val);
    }
};
```

---

## 7. Fenwick Tree — range add, range sum query

Uses two BITs.

```cpp
struct RangeFenwick {
    int n;
    vector<long long> bit1, bit2;

    RangeFenwick(int n) : n(n), bit1(n + 1, 0), bit2(n + 1, 0) {}

    void add(vector<long long>& bit, int idx, long long val) {
        idx++;
        while (idx <= n) {
            bit[idx] += val;
            idx += idx & -idx;
        }
    }

    long long sum(vector<long long>& bit, int idx) {
        idx++;
        long long res = 0;
        while (idx > 0) {
            res += bit[idx];
            idx -= idx & -idx;
        }
        return res;
    }

    void rangeAdd(int l, int r, long long val) {
        add(bit1, l, val);
        add(bit1, r + 1, -val);

        add(bit2, l, val * l);
        add(bit2, r + 1, -val * (r + 1));
    }

    long long prefixSum(int idx) {
        return sum(bit1, idx) * (idx + 1) - sum(bit2, idx);
    }

    long long rangeSum(int l, int r) {
        return prefixSum(r) - (l ? prefixSum(l - 1) : 0);
    }
};
```

---

# Segment Tree

## 8. Segment Tree — range sum, point update

```cpp
struct SegTree {
    int n;
    vector<long long> tree;

    SegTree(vector<int>& a) {
        n = a.size();
        tree.assign(4 * n, 0);
        build(1, 0, n - 1, a);
    }

    void build(int node, int l, int r, vector<int>& a) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }

        int mid = (l + r) / 2;
        build(2 * node, l, mid, a);
        build(2 * node + 1, mid + 1, r, a);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void update(int node, int l, int r, int idx, long long val) {
        if (l == r) {
            tree[node] = val;
            return;
        }

        int mid = (l + r) / 2;

        if (idx <= mid) update(2 * node, l, mid, idx, val);
        else update(2 * node + 1, mid + 1, r, idx, val);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];

        int mid = (l + r) / 2;

        return query(2 * node, l, mid, ql, qr)
             + query(2 * node + 1, mid + 1, r, ql, qr);
    }
};
```

Usage:

```cpp
SegTree st(a);

st.update(1, 0, n - 1, idx, val);
long long ans = st.query(1, 0, n - 1, l, r);
```

---

## 9. Segment Tree — range min query, point update

```cpp
struct MinSegTree {
    int n;
    vector<int> tree;

    MinSegTree(vector<int>& a) {
        n = a.size();
        tree.assign(4 * n, INT_MAX);
        build(1, 0, n - 1, a);
    }

    void build(int node, int l, int r, vector<int>& a) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }

        int mid = (l + r) / 2;
        build(2 * node, l, mid, a);
        build(2 * node + 1, mid + 1, r, a);

        tree[node] = min(tree[2 * node], tree[2 * node + 1]);
    }

    void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }

        int mid = (l + r) / 2;

        if (idx <= mid) update(2 * node, l, mid, idx, val);
        else update(2 * node + 1, mid + 1, r, idx, val);

        tree[node] = min(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return INT_MAX;
        if (ql <= l && r <= qr) return tree[node];

        int mid = (l + r) / 2;

        return min(
            query(2 * node, l, mid, ql, qr),
            query(2 * node + 1, mid + 1, r, ql, qr)
        );
    }
};
```

---

## 10. Lazy Segment Tree — range add, range sum query

```cpp
struct LazySegTree {
    int n;
    vector<long long> tree, lazy;

    LazySegTree(vector<int>& a) {
        n = a.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
        build(1, 0, n - 1, a);
    }

    void build(int node, int l, int r, vector<int>& a) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }

        int mid = (l + r) / 2;
        build(2 * node, l, mid, a);
        build(2 * node + 1, mid + 1, r, a);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void push(int node, int l, int r) {
        if (lazy[node] == 0) return;

        tree[node] += lazy[node] * (r - l + 1);

        if (l != r) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }

        lazy[node] = 0;
    }

    void rangeAdd(int node, int l, int r, int ql, int qr, long long val) {
        push(node, l, r);

        if (qr < l || r < ql) return;

        if (ql <= l && r <= qr) {
            lazy[node] += val;
            push(node, l, r);
            return;
        }

        int mid = (l + r) / 2;

        rangeAdd(2 * node, l, mid, ql, qr, val);
        rangeAdd(2 * node + 1, mid + 1, r, ql, qr, val);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        push(node, l, r);

        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];

        int mid = (l + r) / 2;

        return query(2 * node, l, mid, ql, qr)
             + query(2 * node + 1, mid + 1, r, ql, qr);
    }
};
```

Usage:

```cpp
LazySegTree st(a);

st.rangeAdd(1, 0, n - 1, l, r, val);
long long ans = st.query(1, 0, n - 1, l, r);
```

---

## 11. Lazy Segment Tree — range assign, range sum query

```cpp
struct AssignSegTree {
    int n;
    vector<long long> tree, lazy;
    vector<bool> marked;

    AssignSegTree(vector<int>& a) {
        n = a.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
        marked.assign(4 * n, false);
        build(1, 0, n - 1, a);
    }

    void build(int node, int l, int r, vector<int>& a) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }

        int mid = (l + r) / 2;
        build(2 * node, l, mid, a);
        build(2 * node + 1, mid + 1, r, a);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void apply(int node, int l, int r, long long val) {
        tree[node] = val * (r - l + 1);
        lazy[node] = val;
        marked[node] = true;
    }

    void push(int node, int l, int r) {
        if (!marked[node] || l == r) return;

        int mid = (l + r) / 2;

        apply(2 * node, l, mid, lazy[node]);
        apply(2 * node + 1, mid + 1, r, lazy[node]);

        marked[node] = false;
    }

    void rangeAssign(int node, int l, int r, int ql, int qr, long long val) {
        if (qr < l || r < ql) return;

        if (ql <= l && r <= qr) {
            apply(node, l, r, val);
            return;
        }

        push(node, l, r);

        int mid = (l + r) / 2;

        rangeAssign(2 * node, l, mid, ql, qr, val);
        rangeAssign(2 * node + 1, mid + 1, r, ql, qr, val);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];

        push(node, l, r);

        int mid = (l + r) / 2;

        return query(2 * node, l, mid, ql, qr)
             + query(2 * node + 1, mid + 1, r, ql, qr);
    }
};
```

---

# Sparse Table

## 12. Sparse Table — static range minimum query

`O(n log n)` build, `O(1)` query.

```cpp
int LOG = 20;
vector<vector<int>> st(LOG, vector<int>(n));
vector<int> lg(n + 1);

for (int i = 2; i <= n; i++) {
    lg[i] = lg[i / 2] + 1;
}

for (int i = 0; i < n; i++) {
    st[0][i] = a[i];
}

for (int k = 1; k < LOG; k++) {
    for (int i = 0; i + (1 << k) <= n; i++) {
        st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
    }
}

int rangeMin(int l, int r) {
    int k = lg[r - l + 1];
    return min(st[k][l], st[k][r - (1 << k) + 1]);
}
```

---

## 13. Sparse Table — static range GCD query

```cpp
int rangeGcd(int l, int r) {
    int k = lg[r - l + 1];
    return gcd(st[k][l], st[k][r - (1 << k) + 1]);
}
```

Build change:

```cpp
st[k][i] = gcd(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
```

---

# Monotonic Queue

## 14. Sliding Window Minimum

```cpp
deque<int> dq;
vector<int> ans;

for (int i = 0; i < n; i++) {
    while (!dq.empty() && dq.front() <= i - k) {
        dq.pop_front();
    }

    while (!dq.empty() && a[dq.back()] >= a[i]) {
        dq.pop_back();
    }

    dq.push_back(i);

    if (i >= k - 1) {
        ans.push_back(a[dq.front()]);
    }
}
```

---

## 15. Sliding Window Maximum

```cpp
deque<int> dq;
vector<int> ans;

for (int i = 0; i < n; i++) {
    while (!dq.empty() && dq.front() <= i - k) {
        dq.pop_front();
    }

    while (!dq.empty() && a[dq.back()] <= a[i]) {
        dq.pop_back();
    }

    dq.push_back(i);

    if (i >= k - 1) {
        ans.push_back(a[dq.front()]);
    }
}
```

---

# Square Root Decomposition

## 16. Sqrt Decomposition — range sum, point update

```cpp
int blockSize = sqrt(n) + 1;
vector<long long> block(blockSize, 0);

for (int i = 0; i < n; i++) {
    block[i / blockSize] += a[i];
}

void update(int idx, int val) {
    block[idx / blockSize] += val - a[idx];
    a[idx] = val;
}

long long query(int l, int r) {
    long long res = 0;

    while (l <= r) {
        if (l % blockSize == 0 && l + blockSize - 1 <= r) {
            res += block[l / blockSize];
            l += blockSize;
        } else {
            res += a[l];
            l++;
        }
    }

    return res;
}
```

---

# Ordered Set / Coordinate Compression Style

## 17. Count elements `<= x` in subarray `[l, r]` — merge sort tree

```cpp
struct MergeSortTree {
    int n;
    vector<vector<int>> tree;

    MergeSortTree(vector<int>& a) {
        n = a.size();
        tree.resize(4 * n);
        build(1, 0, n - 1, a);
    }

    void build(int node, int l, int r, vector<int>& a) {
        if (l == r) {
            tree[node] = {a[l]};
            return;
        }

        int mid = (l + r) / 2;

        build(2 * node, l, mid, a);
        build(2 * node + 1, mid + 1, r, a);

        merge(
            tree[2 * node].begin(), tree[2 * node].end(),
            tree[2 * node + 1].begin(), tree[2 * node + 1].end(),
            back_inserter(tree[node])
        );
    }

    int countLessEqual(int node, int l, int r, int ql, int qr, int x) {
        if (qr < l || r < ql) return 0;

        if (ql <= l && r <= qr) {
            return upper_bound(tree[node].begin(), tree[node].end(), x)
                 - tree[node].begin();
        }

        int mid = (l + r) / 2;

        return countLessEqual(2 * node, l, mid, ql, qr, x)
             + countLessEqual(2 * node + 1, mid + 1, r, ql, qr, x);
    }
};
```

---

# Mo's Algorithm

## 18. Mo's Algorithm — offline range queries

Example: distinct count in `[l, r]`.

```cpp
struct Query {
    int l, r, idx;
};

int blockSize;

bool cmp(Query& a, Query& b) {
    int blockA = a.l / blockSize;
    int blockB = b.l / blockSize;

    if (blockA != blockB) return blockA < blockB;

    return a.r < b.r;
}

vector<int> ans(q);
vector<int> freq(MAX_VAL + 1, 0);

int currL = 0, currR = -1;
int distinct = 0;

auto add = [&](int idx) {
    freq[a[idx]]++;
    if (freq[a[idx]] == 1) distinct++;
};

auto remove = [&](int idx) {
    freq[a[idx]]--;
    if (freq[a[idx]] == 0) distinct--;
};

blockSize = sqrt(n);
sort(queries.begin(), queries.end(), cmp);

for (auto qu : queries) {
    while (currL > qu.l) add(--currL);
    while (currR < qu.r) add(++currR);
    while (currL < qu.l) remove(currL++);
    while (currR > qu.r) remove(currR--);

    ans[qu.idx] = distinct;
}
```

---

# Common Choose-What Pattern

```cpp
// Static range sum        -> prefix sum
// Static range min/max    -> sparse table
// Point update + range sum/min/max -> segment tree / BIT
// Range update + range query -> lazy segment tree
// Range add + point query -> difference array / BIT
// Offline weird queries   -> Mo's algorithm
// Count <= x in range     -> merge sort tree
// 2D rectangle sum        -> 2D prefix sum
```
