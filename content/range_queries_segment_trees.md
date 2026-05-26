---
id: range-queries
title: "Range Queries & Segment Trees"
icon: 📐
description: "Prefix sum, BIT, segment tree, lazy propagation, Mo's"
problems: 250+
categories: 18
order: 70
---
# Range Queries & Segment Trees — Interview Question Bank

---

## 1. Prefix Sum / Static Range Sum

| #   | Problem                                       | LC # | Difficulty |
| --- | --------------------------------------------- | ---- | ---------- |
| 1   | Range Sum Query — Immutable                   | 303  | Easy       |
| 2   | Range Sum Query 2D — Immutable                | 304  | Medium     |
| 3   | Subarray Sum Equals K                         | 560  | Medium     |
| 4   | Continuous Subarray Sum                       | 523  | Medium     |
| 5   | Contiguous Array                              | 525  | Medium     |
| 6   | Maximum Size Subarray Sum Equals K            | 325  | Medium     |
| 7   | Number of Submatrices That Sum to Target      | 1074 | Hard       |
| 8   | Matrix Block Sum                              | 1314 | Medium     |
| 9   | Maximum Sum of Two Non-Overlapping Subarrays  | 1031 | Medium     |
| 10  | Find Pivot Index                              | 724  | Easy       |

---

## 2. Difference Array / Range Update — Point Query

| #   | Problem                                          | LC # | Difficulty |
| --- | ------------------------------------------------ | ---- | ---------- |
| 1   | Range Addition                                   | 370  | Medium     |
| 2   | Range Addition II                                | 598  | Easy       |
| 3   | Car Pooling                                      | 1094 | Medium     |
| 4   | Corporate Flight Bookings                        | 1109 | Medium     |
| 5   | Shifting Letters                                 | 848  | Medium     |
| 6   | Shifting Letters II                              | 2381 | Medium     |
| 7   | Maximum Population Year                          | 1854 | Easy       |
| 8   | Increment Submatrices by One                     | 2536 | Medium     |
| 9   | Stamping the Grid                                | 2132 | Hard       |
| 10  | Number of Flowers in Full Bloom                  | 2251 | Hard       |

---

## 3. Sparse Table (Static RMQ — Range Min/Max/GCD)

| #   | Problem                                                    | LC # | Difficulty |
| --- | ---------------------------------------------------------- | ---- | ---------- |
| 1   | Range Minimum Query (offline) — classic                    | —    | Medium     |
| 2   | Longest Subarray with Absolute Diff ≤ Limit                | 1438 | Medium     |
| 3   | Sum of Subarray Minimums (paired with monotonic stack)     | 907  | Medium     |
| 4   | Maximum of Minimum Values in All Subarrays of Size K       | —    | Medium     |
| 5   | Number of Subarrays with Bounded Maximum                   | 795  | Medium     |
| 6   | Range GCD Query                                            | —    | Medium     |
| 7   | Plates Between Candles                                     | 2055 | Medium     |
| 8   | Subarray with Largest Sum (offline RMQ on prefix)          | —    | Medium     |
| 9   | Maximum Score From Removing Substrings (greedy + RMQ idea) | 1717 | Medium     |
| 10  | Online RMQ Design                                          | —    | Hard       |

---

## 4. Binary Indexed Tree (BIT / Fenwick) — Point Update, Range Sum

| #   | Problem                                          | LC # | Difficulty |
| --- | ------------------------------------------------ | ---- | ---------- |
| 1   | Range Sum Query — Mutable                        | 307  | Medium     |
| 2   | Count of Smaller Numbers After Self              | 315  | Hard       |
| 3   | Reverse Pairs                                    | 493  | Hard       |
| 4   | Count of Range Sum                               | 327  | Hard       |
| 5   | Create Sorted Array Through Instructions         | 1649 | Hard       |
| 6   | Queries on a Permutation With Key                | 1409 | Medium     |
| 7   | Number of Ways to Reorder Array to Get Same BST  | 1569 | Hard       |
| 8   | Maximum Frequency Score of a Subarray            | —    | Hard       |
| 9   | Movement of Robots (offline BIT)                 | 2731 | Medium     |
| 10  | Range Frequency Queries                          | 2080 | Medium     |

---

## 5. BIT — Range Update, Point Query (Difference Trick)

| #   | Problem                                          | LC # | Difficulty |
| --- | ------------------------------------------------ | ---- | ---------- |
| 1   | Range Addition (offline equivalent)              | 370  | Medium     |
| 2   | Corporate Flight Bookings                        | 1109 | Medium     |
| 3   | Apply Operations to an Array                     | 2460 | Easy       |
| 4   | Minimum Number of Operations to Make Array Equal | 1551 | Medium     |
| 5   | Patching Array (related accumulation idea)       | 330  | Hard       |

---

## 6. BIT — Range Update, Range Query (Two-BIT Trick)

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Range Sum with Range Updates (classic)                 | —    | Hard       |
| 2   | Online Range Update + Range Sum Design                 | —    | Hard       |
| 3   | Sum of Subsequence Widths (offline range update)       | 891  | Hard       |
| 4   | Maximum Number of Books You Can Take (lazy via BIT)    | —    | Hard       |

---

## 7. 2D BIT / 2D Prefix

| #   | Problem                                       | LC # | Difficulty |
| --- | --------------------------------------------- | ---- | ---------- |
| 1   | Range Sum Query 2D — Mutable                  | 308  | Hard       |
| 2   | Range Sum Query 2D — Immutable                | 304  | Medium     |
| 3   | Number of Submatrices That Sum to Target      | 1074 | Hard       |
| 4   | Count Submatrices With All Ones               | 1504 | Medium     |
| 5   | Maximum Side Length of Square With Sum ≤ K    | 1292 | Medium     |
| 6   | Largest Submatrix With Rearrangements         | 1727 | Medium     |
| 7   | Number of Ways to Build Walls (2D BIT design) | —    | Hard       |

---

## 8. Segment Tree — Point Update, Range Query

| #   | Problem                                          | LC # | Difficulty |
| --- | ------------------------------------------------ | ---- | ---------- |
| 1   | Range Sum Query — Mutable                        | 307  | Medium     |
| 2   | The Skyline Problem (segment tree on x)          | 218  | Hard       |
| 3   | Falling Squares                                  | 699  | Hard       |
| 4   | Longest Increasing Subsequence II                | 2407 | Hard       |
| 5   | Number of Longest Increasing Subsequence         | 673  | Medium     |
| 6   | Longest Increasing Subsequence (segment tree DP) | 300  | Medium     |
| 7   | Range Module                                     | 715  | Hard       |
| 8   | My Calendar I / II / III                         | 729  | Medium     |
| 9   | My Calendar III                                  | 732  | Hard       |
| 10  | Online Majority Element In Subarray              | 1157 | Hard       |
| 11  | Max Sum of Rectangle No Larger Than K            | 363  | Hard       |

---

## 9. Segment Tree with Lazy Propagation (Range Update + Range Query)

| #   | Problem                                                  | LC # | Difficulty |
| --- | -------------------------------------------------------- | ---- | ---------- |
| 1   | Handling Sum Queries After Update                        | 2569 | Hard       |
| 2   | Range Module                                             | 715  | Hard       |
| 3   | Booking Concert Tickets in Groups                        | 2286 | Hard       |
| 4   | Amount of New Area Painted Each Day                      | 2158 | Hard       |
| 5   | Rectangle Area II                                        | 850  | Hard       |
| 6   | Falling Squares                                          | 699  | Hard       |
| 7   | Painting the Walls (lazy DP optimization)                | 2742 | Hard       |
| 8   | Max Sum of 3 Non-Overlapping Subarrays                   | 689  | Hard       |
| 9   | Range Assign + Range Sum (chtholly variant)              | —    | Hard       |

---

## 10. Segment Tree on Coordinates / Coordinate Compression

| #   | Problem                                            | LC # | Difficulty |
| --- | -------------------------------------------------- | ---- | ---------- |
| 1   | Count of Smaller Numbers After Self                | 315  | Hard       |
| 2   | Reverse Pairs                                      | 493  | Hard       |
| 3   | Count of Range Sum                                 | 327  | Hard       |
| 4   | Rectangle Area II                                  | 850  | Hard       |
| 5   | The Skyline Problem                                | 218  | Hard       |
| 6   | Number of Pairs Satisfying Inequality              | 2426 | Hard       |
| 7   | Falling Squares                                    | 699  | Hard       |
| 8   | Maximum White Tiles Covered by a Carpet            | 2271 | Medium     |

---

## 11. Segment Tree + DP

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Longest Increasing Subsequence II                      | 2407 | Hard       |
| 2   | Number of Longest Increasing Subsequence               | 673  | Medium     |
| 3   | Constrained Subsequence Sum (deque + ST variant)       | 1425 | Hard       |
| 4   | Maximum Earnings From Taxi                             | 2008 | Medium     |
| 5   | Jump Game V                                            | 1340 | Hard       |
| 6   | Best Team With No Conflicts                            | 1626 | Medium     |
| 7   | Russian Doll Envelopes (offline ST DP)                 | 354  | Hard       |
| 8   | Maximum Profit in Job Scheduling                       | 1235 | Hard       |

---

## 12. Segment Tree Descent / Walk on Tree

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Booking Concert Tickets in Groups                      | 2286 | Hard       |
| 2   | Find Kth Smallest in Range (online)                    | —    | Hard       |
| 3   | First element ≥ X in range (segment tree walk)         | —    | Hard       |
| 4   | Range Mode Query                                       | —    | Hard       |
| 5   | Online Majority Element In Subarray                    | 1157 | Hard       |

---

## 13. Merge Sort Tree / Persistent Segment Tree

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Count of Smaller Numbers After Self                    | 315  | Hard       |
| 2   | Number of pairs (i, j) with a[i] < a[j] and i < j      | —    | Hard       |
| 3   | Kth Smallest in Range [l, r] (persistent ST)           | —    | Hard       |
| 4   | Number of distinct values in range                     | —    | Hard       |
| 5   | Range LIS / Range Inversion Queries                    | —    | Hard       |

---

## 14. Mo's Algorithm (Offline Range Queries)

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Range Distinct Count (offline)                         | —    | Hard       |
| 2   | Range Mode Query (offline)                             | —    | Hard       |
| 3   | Subarrays With K Different Integers (Mo's variant)     | 992  | Hard       |
| 4   | Count Subarrays with Median K (offline)                | 2488 | Hard       |
| 5   | Range Frequency Queries                                | 2080 | Medium     |

---

## 15. Square Root Decomposition

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Range Sum Query — Mutable (sqrt approach)              | 307  | Medium     |
| 2   | Online Range Update + Range Sum (sqrt blocks)          | —    | Hard       |
| 3   | Shortest Subarray with Sum ≥ K (heavy-light style)     | 862  | Hard       |
| 4   | Online Majority Element In Subarray                    | 1157 | Hard       |

---

## 16. Heavy-Light Decomposition / LCA + Segment Tree

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Path Sum Queries on Tree                               | —    | Hard       |
| 2   | Path Max / Min Edge Queries                            | —    | Hard       |
| 3   | Subtree Sum / Update with Euler Tour + BIT             | —    | Hard       |
| 4   | Number of Good Paths                                   | 2421 | Hard       |
| 5   | Lowest Common Ancestor (with segment tree on Euler)    | 1644 | Medium     |

---

## 17. Range Queries in Design / Online Problems

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Design a Range Module                                  | 715  | Hard       |
| 2   | My Calendar I / II / III                               | 729  | Medium     |
| 3   | Booking Concert Tickets in Groups                      | 2286 | Hard       |
| 4   | Exam Room                                              | 855  | Medium     |
| 5   | Snapshot Array (versioned per-index range idea)        | 1146 | Medium     |
| 6   | Range Frequency Queries                                | 2080 | Medium     |
| 7   | Number of Flowers in Full Bloom                        | 2251 | Hard       |
| 8   | Stock Price Fluctuation                                | 2034 | Medium     |

---

## 18. Advanced / Contest-Level Range Query Problems

| #   | Problem                                                | LC # | Difficulty |
| --- | ------------------------------------------------------ | ---- | ---------- |
| 1   | Handling Sum Queries After Update                      | 2569 | Hard       |
| 2   | Longest Increasing Subsequence II                      | 2407 | Hard       |
| 3   | Booking Concert Tickets in Groups                      | 2286 | Hard       |
| 4   | Rectangle Area II                                      | 850  | Hard       |
| 5   | The Skyline Problem                                    | 218  | Hard       |
| 6   | Range Module                                           | 715  | Hard       |
| 7   | Online Majority Element In Subarray                    | 1157 | Hard       |
| 8   | Count of Range Sum                                     | 327  | Hard       |
| 9   | Reverse Pairs                                          | 493  | Hard       |
| 10  | Falling Squares                                        | 699  | Hard       |

---

## Study Strategy

**Pattern mastery order:**

1. Prefix sum (1D and 2D), difference array (370, 1109)
2. Sparse table for static RMQ (immutable arrays, O(1) queries)
3. BIT / Fenwick for point update + prefix sum (307, 315)
4. Coordinate compression to apply BIT/ST to value ranges (315, 327, 493)
5. Iterative segment tree (point update, range query) — your default mutable tool (307)
6. Recursive segment tree with lazy propagation (range update, range query) (2569)
7. Segment tree on intervals — sweep line / event-based (218, 850, 699)
8. Segment tree descent — walk the tree for k-th / first-position queries (2286, 1157)
9. Merge sort tree / persistent segment tree (kth-in-range, offline)
10. Mo's algorithm and sqrt decomposition (when ST/BIT don't fit)
11. Euler tour + BIT/ST for subtree queries
12. Heavy-Light Decomposition for path queries on trees

**Important Patterns:**

- **Pick the right tool first**: prefix sum for immutable arrays, BIT for point update + prefix sum (smaller constant, less code), segment tree when you need range updates or non-additive aggregates (min, max, gcd, assignment). Interviewers love when you justify the choice instead of defaulting to segment tree
- **Coordinate compression + BIT**: the canonical trick for (315) Count of Smaller After Self, (493) Reverse Pairs, (327) Count of Range Sum — compress values to [0, n), then BIT on compressed indices. Know this cold
- **Sweep line + segment tree on intervals**: (218) Skyline, (850) Rectangle Area II, (699) Falling Squares all reduce to: sort events, maintain a segment tree over compressed x-coordinates, query/update active intervals
- **Lazy propagation invariant**: push pending tags to children before recursing into them, then re-aggregate on the way up. The two pitfalls are pushing too late (corrupting child queries) and forgetting to combine pending tags when stacking updates (e.g., assign-then-add)
- **Segment tree descent**: for "find the k-th 1 in [l,r]" or "find first index ≥ x in [l,r]", descend the tree using subtree aggregates as the decision oracle. This turns a query that looks O(n log n) (binary search + range query) into a clean O(log n). (2286) is the canonical interview problem
- **BIT range update + range query**: maintain two BITs — one for prefix sums of the diff array, one for prefix sums of (i × diff[i]). Useful when you need range update + range sum and want shorter code than lazy segment tree
- **Offline trick**: if updates and queries are all known upfront, sort them, run a BIT in one pass instead of a heavy segment tree. (327, 493, 315, 2426) all fall to this pattern

**Templates:**

```cpp
// ============ BIT / Fenwick — Point Update, Prefix Sum ============
struct BIT {
    vector<long long> t;
    int n;
    BIT(int n) : n(n), t(n + 1, 0) {}

    void update(int i, long long delta) {           // 1-indexed
        for (; i <= n; i += i & -i) t[i] += delta;
    }

    long long query(int i) {                        // prefix [1..i]
        long long s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }

    long long range(int l, int r) {                 // [l..r]
        return query(r) - query(l - 1);
    }
};
```

```cpp
// ============ Iterative Segment Tree — Point Update, Range Sum ============
struct SegTree {
    int n;
    vector<long long> t;
    SegTree(int n) : n(n), t(2 * n, 0) {}

    void update(int i, long long v) {               // 0-indexed
        for (t[i += n] = v; i >>= 1; )
            t[i] = t[2 * i] + t[2 * i + 1];
    }

    long long query(int l, int r) {                 // [l, r)
        long long res = 0;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res += t[l++];
            if (r & 1) res += t[--r];
        }
        return res;
    }
};
```

```cpp
// ============ Recursive Segment Tree with Lazy Propagation ============
// Range-add update, range-sum query
struct LazySeg {
    int n;
    vector<long long> sum, lazy;

    LazySeg(int n) : n(n), sum(4 * n, 0), lazy(4 * n, 0) {}

    void push(int node, int l, int r) {
        if (lazy[node]) {
            int mid = (l + r) / 2;
            int L = 2 * node, R = 2 * node + 1;
            sum[L]  += lazy[node] * (mid - l + 1);
            lazy[L] += lazy[node];
            sum[R]  += lazy[node] * (r - mid);
            lazy[R] += lazy[node];
            lazy[node] = 0;
        }
    }

    void update(int node, int l, int r, int ql, int qr, long long v) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) {
            sum[node]  += v * (r - l + 1);
            lazy[node] += v;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        update(2 * node, l, mid, ql, qr, v);
        update(2 * node + 1, mid + 1, r, ql, qr, v);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return sum[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        return query(2 * node, l, mid, ql, qr)
             + query(2 * node + 1, mid + 1, r, ql, qr);
    }
};
```

```cpp
// ============ Sparse Table — Static RMQ, O(n log n) build, O(1) query ============
struct SparseTable {
    vector<vector<int>> st;
    vector<int> lg;

    SparseTable(vector<int>& a) {
        int n = a.size(), k = __lg(n) + 1;
        st.assign(k, vector<int>(n));
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        st[0] = a;
        for (int j = 1; j < k; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                st[j][i] = min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
    }

    int query(int l, int r) {                       // [l, r] inclusive
        int j = lg[r - l + 1];
        return min(st[j][l], st[j][r - (1 << j) + 1]);
    }
};
```

**Common interview traps:**

- Off-by-one between 0-indexed and 1-indexed BIT — pick a convention (BIT is naturally 1-indexed) and stick to it everywhere
- Forgetting coordinate compression when values are large (10^9) — BIT/ST is indexed by position, not value
- Lazy propagation: not pushing pending updates before recursing into children, or not handling tag composition for mixed update types (assign vs add)
- Confusing iterative segment tree's `[l, r)` half-open interval with recursive's `[l, r]` closed interval — pick one and never mix
- Sparse table on non-idempotent functions (sum, xor) — only works for idempotent operations (min, max, gcd, and). For sum, use BIT/ST
- Using recursive segment tree on tight constraints (n up to 5×10^5, q up to 5×10^5) without iterative or BIT — gets TLE due to recursion overhead
- Mo's algorithm with the wrong block size (should be √n) or wrong sort order — kills the O((n + q)√n) bound
- Building a fresh segment tree per query in design problems instead of persistent or amortized structures

**Total: ~250+ problems across 18 categories**
