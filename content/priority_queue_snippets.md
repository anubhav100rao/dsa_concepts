## 1. Heap Basics — declarations & comparators

```cpp
priority_queue<int> maxHeap;                                   // top = largest

priority_queue<int, vector<int>, greater<int>> minHeap;        // top = smallest

// pairs sort by first, then second (max-heap on first)
priority_queue<pair<int,int>> pqPair;

// min-heap on pairs
priority_queue<pair<int,int>, vector<pair<int,int>>,
               greater<pair<int,int>>> minPair;
```

Common ops:

```cpp
pq.push(x);
int top = pq.top();
pq.pop();
bool empty = pq.empty();
int sz = pq.size();
```

---

## 2. Kth Largest — fixed-size min-heap

Keep the `k` largest seen so far; top is the kth largest. `O(n log k)`.

```cpp
int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> pq; // min-heap of size k

    for (int x : a) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop(); // drop smallest
    }

    return pq.top();
}
```

For **kth smallest**, use a max-heap of size `k`.

---

## 3. Top-K Frequent Elements

```cpp
vector<int> topKFrequent(vector<int>& a, int k) {
    unordered_map<int,int> freq;
    for (int x : a) freq[x]++;

    // min-heap on frequency, size capped at k
    priority_queue<pair<int,int>, vector<pair<int,int>>,
                   greater<>> pq;

    for (auto& [val, f] : freq) {
        pq.push({f, val});
        if ((int)pq.size() > k) pq.pop();
    }

    vector<int> res;
    while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }
    return res;
}
```

---

## 4. Two Heaps — Median of a Data Stream

Max-heap holds the lower half, min-heap the upper half.

```cpp
struct MedianFinder {
    priority_queue<int> lo;                                // max-heap (lower half)
    priority_queue<int, vector<int>, greater<int>> hi;     // min-heap (upper half)

    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();          // balance value-wise

        if (hi.size() > lo.size()) {          // keep lo >= hi in size
            lo.push(hi.top()); hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};
```

---

## 5. K-Way Merge — merge K sorted lists

```cpp
ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);

    for (ListNode* node : lists) if (node) pq.push(node);

    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = node;
        if (node->next) pq.push(node->next);
    }

    return dummy.next;
}
```

---

## 6. K Smallest Pairs / Matrix — heap of frontier

```cpp
// k smallest sums of pairs (u from a, v from b), both sorted ascending
vector<pair<int,int>> kSmallestPairs(vector<int>& a, vector<int>& b, int k) {
    priority_queue<tuple<int,int,int>,
                   vector<tuple<int,int,int>>, greater<>> pq;
    vector<pair<int,int>> res;

    for (int i = 0; i < min((int)a.size(), k); i++)
        pq.push({a[i] + b[0], i, 0});

    while (k-- > 0 && !pq.empty()) {
        auto [sum, i, j] = pq.top(); pq.pop();
        res.push_back({a[i], b[j]});
        if (j + 1 < (int)b.size()) pq.push({a[i] + b[j + 1], i, j + 1});
    }

    return res;
}
```

---

## 7. Dijkstra — shortest path with a min-heap

```cpp
vector<long long> dijkstra(int src, vector<vector<pair<int,int>>>& g) {
    int n = g.size();
    vector<long long> dist(n, LLONG_MAX);
    priority_queue<pair<long long,int>,
                   vector<pair<long long,int>>, greater<>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;            // stale entry

        for (auto [v, w] : g[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}
```

---

## 8. Min-Heap Greedy — Minimum Cost to Connect Sticks

Repeatedly merge the two smallest. Classic Huffman/optimal-merge shape.

```cpp
long long connectSticks(vector<int>& sticks) {
    priority_queue<int, vector<int>, greater<int>> pq(
        sticks.begin(), sticks.end());

    long long cost = 0;

    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        cost += a + b;
        pq.push(a + b);
    }

    return cost;
}
```

---

## 9. Sliding Window Maximum — heap with lazy deletion

Stale entries are skipped when they fall outside the window.

```cpp
vector<int> maxSlidingWindow(vector<int>& a, int k) {
    priority_queue<pair<int,int>> pq; // {value, index}
    vector<int> res;

    for (int i = 0; i < (int)a.size(); i++) {
        pq.push({a[i], i});

        if (i >= k - 1) {
            while (pq.top().second <= i - k) pq.pop(); // discard expired
            res.push_back(pq.top().first);
        }
    }

    return res;
}
```

(A monotonic deque is `O(n)`; this heap version is `O(n log n)` but generalizes to "top-k in window".)

---

## 10. Lazy Deletion Heap — remove arbitrary elements

Defer removals; clean the top only when needed.

```cpp
struct LazyHeap {
    priority_queue<int> pq;        // active + to-delete
    priority_queue<int> trash;     // marked for deletion

    void push(int x) { pq.push(x); }
    void remove(int x) { trash.push(x); }

    void prune() {
        while (!trash.empty() && pq.top() == trash.top()) {
            pq.pop();
            trash.pop();
        }
    }

    int top() { prune(); return pq.top(); }
    void pop() { prune(); pq.pop(); }
    bool empty() { prune(); return pq.empty(); }
};
```

---

## 11. Scheduling — Meeting Rooms II (min rooms)

Min-heap of end times; a free room is the earliest-ending meeting.

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end()); // by start
    priority_queue<int, vector<int>, greater<int>> endTimes;

    for (auto& iv : intervals) {
        if (!endTimes.empty() && endTimes.top() <= iv[0]) {
            endTimes.pop();                    // reuse a room
        }
        endTimes.push(iv[1]);
    }

    return endTimes.size();
}
```

---

## 12. Greedy Max-Heap — Task Scheduler / Reorganize String

Always emit the highest-remaining-count item; recycle after a cooldown.

```cpp
string reorganizeString(string s) {
    array<int, 26> freq{};
    for (char c : s) freq[c - 'a']++;

    priority_queue<pair<int,char>> pq; // {count, char}
    for (int i = 0; i < 26; i++)
        if (freq[i]) pq.push({freq[i], char('a' + i)});

    string res;
    pair<int,char> hold = {0, 0}; // last used, on cooldown

    while (!pq.empty()) {
        auto [cnt, ch] = pq.top(); pq.pop();
        res += ch;

        if (hold.first > 0) pq.push(hold); // release previous

        hold = {cnt - 1, ch};
    }

    return res.size() == s.size() ? res : "";
}
```

---

## 13. Regret-Based Greedy — IPO / max capital

Add affordable projects to a max-heap by profit; take the best repeatedly.

```cpp
int findMaximizedCapital(int k, int w, vector<int>& profits,
                         vector<int>& capital) {
    int n = profits.size();
    vector<pair<int,int>> proj(n);            // {capital, profit}
    for (int i = 0; i < n; i++) proj[i] = {capital[i], profits[i]};
    sort(proj.begin(), proj.end());

    priority_queue<int> available;            // profits we can afford
    int i = 0;

    while (k-- > 0) {
        while (i < n && proj[i].first <= w) available.push(proj[i++].second);
        if (available.empty()) break;
        w += available.top();
        available.pop();
    }

    return w;
}
```

---

## 14. Custom Comparator — multi-key heap

Struct comparator (note: `operator()` returns true when `a` has *lower* priority):

```cpp
struct Job { int priority, time, id; };

struct Cmp {
    bool operator()(const Job& a, const Job& b) const {
        if (a.priority != b.priority) return a.priority < b.priority; // max prio
        return a.time > b.time;                                       // tie: min time
    }
};

priority_queue<Job, vector<Job>, Cmp> pq;
```

Lambda comparator:

```cpp
auto cmp = [](const Job& a, const Job& b) {
    return a.priority < b.priority; // top = highest priority
};
priority_queue<Job, vector<Job>, decltype(cmp)> pq(cmp);
```

---

## 15. Indexed / Addressable PQ — decrease-key via map

`std::priority_queue` can't update keys; emulate with a `set` or lazy entries.

```cpp
// set-based: supports erase + reinsert in O(log n)
set<pair<int,int>> pq; // {dist, node}

pq.insert({0, src});

while (!pq.empty()) {
    auto [d, u] = *pq.begin();
    pq.erase(pq.begin());

    for (auto [v, w] : g[u]) {
        if (d + w < dist[v]) {
            pq.erase({dist[v], v});    // decrease-key: remove old
            dist[v] = d + w;
            pq.insert({dist[v], v});   // insert new
        }
    }
}
```

---

## 16. Manual Binary Heap — array-backed

When you need raw control (sift-up/down, custom indexing).

```cpp
struct MinHeap {
    vector<int> h;

    void push(int x) {
        h.push_back(x);
        int i = h.size() - 1;
        while (i > 0) {
            int p = (i - 1) / 2;
            if (h[p] <= h[i]) break;
            swap(h[p], h[i]);
            i = p;
        }
    }

    int top() { return h[0]; }

    void pop() {
        h[0] = h.back();
        h.pop_back();
        int i = 0, n = h.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, small = i;
            if (l < n && h[l] < h[small]) small = l;
            if (r < n && h[r] < h[small]) small = r;
            if (small == i) break;
            swap(h[i], h[small]);
            i = small;
        }
    }

    bool empty() { return h.empty(); }
};
```

---

# Common Choose-What Pattern

```cpp
// Kth largest / smallest             -> fixed-size heap of size k
// Top-K frequent / by score          -> count then size-k heap
// Running median                     -> two heaps (max-lo + min-hi)
// Merge K sorted streams             -> min-heap of stream heads
// Shortest path (non-negative)       -> Dijkstra min-heap
// Repeatedly merge two smallest      -> min-heap (Huffman / optimal merge)
// Most rooms / overlap count         -> min-heap of end times
// Emit highest count w/ cooldown     -> max-heap greedy + hold slot
// Pick best affordable now           -> regret-based two-heap greedy
// Need decrease-key                  -> set-based or lazy-deletion PQ
// Multi-key ordering                 -> custom comparator (struct/lambda)
```
