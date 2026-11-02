## 1. Prefix Sum — static range sum `[l, r]`

**Use when:** You need many range sums on an array that never changes, such as "sum between left and right".

**Complexity:** `O(n)` build, `O(1)` per query, `O(n)` space.

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

**Example:** `a = [2, 4, 1, 3]` gives `pref = [0, 2, 6, 7, 10]`, and `rangeSum(1, 2)` returns `7 - 2 = 5`.

**Pitfalls:** The array needs `n + 1` slots, and the formula uses `pref[r + 1]`, not `pref[r]`. Use 64-bit totals when values are large.

**Used in:** LC 303, 724, 560, 523, 525, 325, 1031.

---

## 2. Prefix XOR — static range xor `[l, r]`

**Use when:** You need many XORs of a subarray on an array that never changes.

**Complexity:** `O(n)` build, `O(1)` per query, `O(n)` space.

```cpp
vector<int> pxor(n + 1, 0);

for (int i = 0; i < n; i++) {
    pxor[i + 1] = pxor[i] ^ a[i];
}

int rangeXor(int l, int r) {
    return pxor[r + 1] ^ pxor[l];
}
```

**Example:** `a = [5, 1, 3, 6]` gives `pxor = [0, 5, 4, 7, 1]`, and `rangeXor(1, 3)` returns `1 ^ 5 = 4`.

**Pitfalls:** The bounds match prefix sum, `pxor[r + 1] ^ pxor[l]`. XOR is its own inverse, so there is no subtraction step. This works for XOR and sum but not for min or max.

**Used in:** No question listed in this topic uses XOR; LC 303 is the same pattern with sums.

---

## 3. Difference Array — range add, final array

**Use when:** You have many "add val to l..r" updates and read the array only after all of them.

**Complexity:** `O(1)` per update, `O(n)` to build the final array, `O(n)` space.

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

**Example:** `n = 5`, `rangeAdd(1, 3, 2)`, `rangeAdd(2, 4, 3)` gives the final array `[0, 2, 5, 5, 3]`.

**Pitfalls:** Close the range at `r + 1`, or at `to` when the end is exclusive, as in LC 1094. Reading before the build step returns differences, not values. This version starts from zeros, so add the original `a[i]` if it isn't all zeros.

**Used in:** LC 1854, 370, 1109, 1094, 848, 2381.

---

## 4. 2D Prefix Sum — matrix rectangle sum

**Use when:** You need many rectangle sums on a matrix that never changes.

**Complexity:** `O(nm)` build, `O(1)` per query, `O(nm)` space.

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

**Example:** `a = [[1, 2], [3, 4]]` gives `pref = [[0, 0, 0], [0, 1, 3], [0, 4, 10]]`, and `rectSum(0, 1, 1, 1)` returns `10 - 0 - 4 + 0 = 6`.

**Pitfalls:** The build subtracts the corner `pref[i][j]`, and the query adds `pref[r1][c1]` back, because each was counted twice. Size the table `(n + 1)` by `(m + 1)`.

**Used in:** LC 304, 1314, 1292, 1074, 2132.

---

## 5. Fenwick Tree — point update, range sum query

**Use when:** Point updates are mixed with range sums, or you need to count inserted values with a prefix.

**Complexity:** `O(log n)` per `add` and query, `O(n log n)` to build with `add` calls, `O(n)` space.

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

**Example:** `a = [1, 3, 5]`: `rangeSum(0, 2)` returns `9`. After `add(1, -1)`, `rangeSum(0, 2)` returns `8`.

**Pitfalls:** `add` takes a delta, not the new value, so keep the array to compute `new - old`. The public API is 0-indexed and shifts by one inside. Passing `-1` to `sumPrefix` is safe and returns 0.

**Used in:** LC 307, 1409, 315, 493, 327, 1649.

---

## 6. Fenwick Tree — range add, point query

**Use when:** Range adds are mixed with reads of a single index.

**Complexity:** `O(log n)` per range add and read, `O(n)` space.

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

**Example:** `n = 4`, `rangeAdd(1, 2, 5)`: `get(2)` returns `5` and `get(3)` returns `0`.

**Pitfalls:** `get` returns only what was added, so add the original `a[idx]`. It reads one value, not a range sum. If every read comes after every update, use the plain difference array.

**Used in:** LC 370, 1109.

---

## 7. Fenwick Tree — range add, range sum query

**Use when:** Range adds are mixed with range sums, and two BITs are enough. Min, max and assign need a lazy segment tree.

**Complexity:** `O(log n)` per operation, with four BIT updates per range add, and `O(n)` space.

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

**Example:** `n = 4`, `rangeAdd(1, 2, 5)`: `rangeSum(0, 2)` returns `10` and `rangeSum(3, 3)` returns `0`.

**Pitfalls:** `bit2` stores value times index, so overflow is the main risk. The weights here are `l` and `r + 1` because indices are 0-based; a 1-indexed version uses `l - 1` and `r`.

**Used in:** No listed LC question needs it. Section 6's classic problems have no LC number, and LC 891, also listed there, is solved by sorting.

---

## 8. Segment Tree — range sum, point update

**Use when:** Point assignments are mixed with range queries, and you want a tree you can change to other aggregates.

**Complexity:** `O(n)` build, `O(log n)` per update and query, `O(n)` space with `4n` slots.

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

**Example:** `a = [1, 3, 5]`: `query(1, 0, 2, 0, 2)` returns `9`. After `update(1, 0, 2, 1, 2)` it returns `8`.

**Pitfalls:** `update` assigns the value, unlike Fenwick's delta. Pass root arguments `(1, 0, n - 1)` on every call. `4 * n` is needed, and an empty array must be handled first because `build` assumes `n >= 1`.

**Used in:** LC 307. With `+` swapped for `max`: LC 300, 673, 2407.

---

## 9. Segment Tree — range min query, point update

**Use when:** Point updates are mixed with range minimums, or maximums after swapping `min` for `max`.

**Complexity:** `O(n)` build, `O(log n)` per update and query, `O(n)` space with `4n` slots.

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

**Example:** `a = [4, 2, 7]`: `query(1, 0, 2, 0, 2)` returns `2`. After `update(1, 0, 2, 1, 9)` it returns `4`.

**Pitfalls:** Out-of-range returns `INT_MAX`, the identity for `min`; a max tree must return a low identity instead. Returning 0 silently breaks the result.

**Used in:** LC 1438, and with `max` instead: LC 2407, 1425.

---

## 10. Lazy Segment Tree — range add, range sum query

**Use when:** Range adds are mixed with range sums, or you need a template to adapt to other tags.

**Complexity:** `O(n)` build, `O(log n)` per update and query, `O(n)` space with `4n` slots.

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

**Example:** `a = [1, 2, 3, 4]`: after `rangeAdd(1, 0, 3, 0, 1, 10)`, `query(1, 0, 3, 1, 2)` returns `15`.

**Pitfalls:** Here `push` applies the node's own tag, so it must run first in both functions, before any return. The recompute after recursing relies on both children having been pushed.

**Used in:** LC 732. With a flip tag: LC 2569.

---

## 11. Lazy Segment Tree — range assign, range sum query

**Use when:** Range assignments are mixed with range sums.

**Complexity:** `O(n)` build, `O(log n)` per update and query, `O(n)` space with `4n` slots.

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

**Example:** `a = [1, 2, 3, 4]`: after `rangeAssign(1, 0, 3, 1, 2, 9)`, `query(1, 0, 3, 0, 3)` returns `1 + 9 + 9 + 4 = 23`.

**Pitfalls:** 0 is a valid assign value, so `marked` records whether a tag exists. A new assign overwrites the old tag rather than adding to it, and mixing in adds needs a tag composition rule.

**Used in:** LC 715, 699.

---

## 12. Sparse Table — static range minimum query

**Use when:** You need many range min or max queries on an array that never changes, answered online.

**Complexity:** `O(n log n)` time and space to build, `O(1)` per query.

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

**Example:** `a = [4, 6, 1, 5, 7, 3]`: `rangeMin(3, 5)` returns `3` and `rangeMin(0, 1)` returns `4`.

**Pitfalls:** It needs `LOG` above `log2(n)`, and 20 covers `n` up to about a million. Only overlap-safe operations work, so never sums. `lg` is sized `n + 1` because the query indexes it by length.

**Used in:** LC 1438, 907, 795.

---

## 13. Sparse Table — static range GCD query

**Use when:** You need many range GCD queries on an array that never changes.

**Complexity:** `O(n log n * log A)` to build, where `A` is the largest value, `O(log A)` per query, `O(n log n)` space.

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

**Example:** `a = [12, 18, 6, 9]`: `rangeGcd(0, 1)` returns `6` and `rangeGcd(1, 3)` returns `3`.

**Pitfalls:** This reuses `st` and `lg` from section 12, with only the combine step changed. `gcd` needs C++17 and `<numeric>`. Overlap is safe because `gcd(x, x) = x`.

**Used in:** No numbered LC question in this topic; it answers section 3's unnumbered "Range GCD Query".

---

## 14. Sliding Window Minimum

**Use when:** You need the minimum of every window of fixed size k, or a window that only moves forward.

**Complexity:** `O(n)` total, because each index is pushed and popped at most once, and `O(k)` space.

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

**Example:** `a = [4, 2, 5, 1, 3]`, `k = 3` gives `[2, 1, 1]`.

**Pitfalls:** Store indices, not values, so old elements can expire. Expire with `front <= i - k`. Output starts only at `i >= k - 1`.

**Used in:** LC 1438, 862.

---

## 15. Sliding Window Maximum

**Use when:** You need the maximum of every window of fixed size k, or a window that only moves forward.

**Complexity:** `O(n)` total, because each index is pushed and popped at most once, and `O(k)` space.

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

**Example:** `a = [1, 3, -1, -3, 5]`, `k = 3` gives `[3, 3, 5]`.

**Pitfalls:** The back comparison flips to `<=` from the minimum version. Store indices, not values. Output starts only at `i >= k - 1`.

**Used in:** LC 1438, 1425.

---

## 16. Sqrt Decomposition — range sum, point update

**Use when:** You need point updates and range queries with a summary per block, or an operation a tree can't merge cleanly.

**Complexity:** `O(n)` build, `O(1)` per update, `O(sqrt n)` per query, `O(sqrt n)` extra space.

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

**Example:** `a = [1, 3, 5, 2, 4, 6]`, `blockSize = 3`: `query(1, 5)` returns `20`. After `update(4, 10)` it returns `26`.

**Pitfalls:** Compute the delta before overwriting `a[idx]`. Take a whole block only when `l` is its start and the block ends by `r`. For plain sums, a BIT is better.

**Used in:** LC 307. Also listed but better solved another way: LC 1157.

---

## 17. Count elements `<= x` in subarray `[l, r]` — merge sort tree

**Use when:** You need the count of values `<= x` in an index range, answered online with no updates.

**Complexity:** `O(n log n)` time and space to build, `O(log^2 n)` per query.

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

**Example:** `a = [5, 1, 4, 2]`: `countLessEqual(1, 0, 3, 1, 3, 3)` returns `2`, for the values 1 and 2.

**Pitfalls:** `upper_bound` counts `<= x`, and `lower_bound` counts `< x`. Memory is the usual limit, at `n log n` integers. Updates are expensive, so it fits static arrays.

**Used in:** LC 315. Section 13's other range-count problems have no LC number.

---

## 18. Mo's Algorithm — offline range queries

**Use when:** Queries can be read up front, adding or removing one element is `O(1)`, and range summaries don't merge cleanly, as in distinct count.

**Complexity:** `O((n + q) * sqrt n)` moves plus `O(q log q)` to sort, `O(n + q)` space.

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

**Example:** `a = [1, 2, 1, 3]` with queries `(0, 2)` and `(1, 3)` returns `[2, 3]`.

**Pitfalls:** Expand the window before shrinking it, which the loop order here does. Compress values before indexing `freq`. Store answers by `qu.idx`, because queries are processed out of order. `blockSize` must be set before sorting.

**Used in:** LC 2080, though binary search on positions is simpler. Section 14's distinct-count and mode problems have no LC number.

---

## Common Choose-What Pattern

**Use when:** You've read the constraints and need to choose a structure. Ask whether the data changes and whether the answer can be subtracted.

**Complexity:** Prefix sum `O(1)`, sparse table `O(1)`, BIT and segment tree `O(log n)`, sqrt and Mo's about `O(sqrt n)` per query.

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

**Example:** "No updates, range minimum" picks a sparse table. "Update index, range sum" picks a BIT, and "assign range, range sum" picks a lazy tree.

**Pitfalls:** A sparse table can't do sums, and a BIT can't do range min by subtraction. Mo's algorithm requires queries that can be reordered.

**Used in:** LC 303, 1438, 307, 1109, 2569, 315, 304.
