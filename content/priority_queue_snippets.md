## 1. Heap Basics — declarations & comparators

**Use when:** You need the current largest or smallest value again and again while the collection changes.

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

**Complexity:** `top` is O(1), `push` and `pop` are O(log n), and building from a range is O(n). Space is O(n).

**Example:** Push 3, 1, 2. `maxHeap.top()` is 3 and `minHeap.top()` is 1.

**Pitfalls:** `priority_queue` is a max-heap by default. `pop()` returns nothing, so read `top()` first. Calling `top()` or `pop()` on an empty heap is undefined behaviour.

**Used in:** LC 215, LC 703, LC 1046, LC 506

---

## 2. Kth Largest — fixed-size min-heap

**Use when:** The problem says "kth largest", "k closest", or anything where only the best k values matter.

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

**Complexity:** O(n log k) time and O(k) space.

**Example:** `a = [3,2,1,5,6,4]`, `k = 2` returns `5`.

**Pitfalls:** The heap direction is opposite to the question: k largest uses a min-heap. Duplicates count, so `[3,3,2]` with `k = 2` returns 3. `k` must be at most `n`, or `top()` returns the wrong value.

**Used in:** LC 215, LC 703, LC 973, LC 378

---

## 3. Top-K Frequent Elements

**Use when:** The problem says "k most frequent": count first, then rank the counts.

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

**Complexity:** O(n + u log k) time and O(u) space, for u distinct values.

**Example:** `a = [1,1,1,2,2,3]`, `k = 2` returns `[2,1]`, because the heap pops the lower count first.

**Pitfalls:** The output runs from lower to higher frequency, so reverse it if the order matters. LC 692 also needs a tiebreak on the word. When counts are at most n, bucket sort gives O(n).

**Used in:** LC 347, LC 692, LC 451, LC 1636

---

## 4. Two Heaps — Median of a Data Stream

**Use when:** The problem asks for the "median" while numbers keep arriving.

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

**Complexity:** `addNum` is O(log n), `findMedian` is O(1), and space is O(n).

**Example:** Add 1 and 2, and the median is `1.5`. Add 3, and the median is `2`.

**Pitfalls:** Always pass a new value through the other heap, or a large value can stay in `lo`. `lo.top() + hi.top()` can overflow `int` when values approach 2^31, so widen first. `findMedian` needs at least one number.

**Used in:** LC 295, LC 480

---

## 5. K-Way Merge — merge K sorted lists

**Use when:** The problem says "merge k sorted" or needs the next smallest across several sorted sources.

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

**Complexity:** O(N log k) time for N total nodes, and O(k) space for the heap.

**Example:** `[[1,4,5],[1,3,4],[2,6]]` returns `1,1,2,3,4,4,5,6`.

**Pitfalls:** Skip null heads when seeding, or the comparator dereferences null. The comparator uses `>` to make a min-heap. `lists` may be empty, and the dummy head handles that by returning null.

**Used in:** LC 23, LC 378, LC 632

---

## 6. K Smallest Pairs / Matrix — heap of frontier

**Use when:** The problem says "k smallest pairs", or the kth value lies across sorted rows and k is small.

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

**Complexity:** O(m log m + k log m) time for m = min(`a.size()`, k), and O(m + k) space including the result.

**Example:** `a = [1,7,11]`, `b = [2,4,6]`, `k = 3` returns `[1,2],[1,4],[1,6]`.

**Pitfalls:** `b[0]` is out of bounds if `b` is empty, so check that first when the input allows it. Advancing only `j` from a seeded `i` visits each pair once, so no visited set is needed. If k can be huge, binary search on the value instead.

**Used in:** LC 373, LC 378, LC 1439, LC 786

---

## 7. Dijkstra — shortest path with a min-heap

**Use when:** The problem asks for the "minimum time" or "cheapest" route over non-negative edge weights.

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

**Complexity:** O(E log V) time and O(V + E) space.

**Example:** Edges 0→1 (4), 0→2 (1), 2→1 (2) with `src = 0` return `[0,3,1]`.

**Pitfalls:** Without the stale check the result stays correct but can time out. Negative edges break the algorithm. Unreached nodes stay at `LLONG_MAX`, so check before adding to them. `g[u]` holds `{v, w}` pairs.

**Used in:** LC 743, LC 1514, LC 1631, LC 778, LC 1976, LC 2642

---

## 8. Min-Heap Greedy — Minimum Cost to Connect Sticks

**Use when:** The problem says "the cost to join two is their sum": merge in any order, and reuse the result.

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

**Complexity:** O(n log n) time and O(n) space.

**Example:** `[1,8,3,5]` returns `30`, from merges costing 4, 9 and 17.

**Pitfalls:** A single stick costs 0, which the `size() > 1` loop handles. The sticks are `int`, so `a + b` can overflow on very large values before it reaches `cost`. Sorting once isn't enough, because merged sticks must re-enter the order.

**Used in:** LC 1167, LC 1046, LC 2208

---

## 9. Sliding Window Maximum — heap with lazy deletion

**Use when:** The problem asks for the "maximum of each window of size k", and you may need more than the max later.

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

**Complexity:** O(n log n) time and O(n) space, because stale entries remain in the heap.

**Example:** `a = [1,3,-1,-3,5,3,6,7]`, `k = 3` returns `[3,3,5,5,6,7]`.

**Pitfalls:** Index `i - k` has just left the window, so expire with `<=`. Use `while`, because several expired entries can sit on top. Only read a result once `i >= k - 1`.

**Used in:** LC 239, LC 1696, LC 1425, LC 1499

---

## 10. Lazy Deletion Heap — remove arbitrary elements

**Use when:** The problem says a value can "change" or "be removed" while you still read the top of a heap.

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

**Complexity:** `push` and `remove` are O(log n), and `top` and `pop` are amortized O(log n). Space is O(u) for u pushes.

**Example:** Push 5, 3, 8, then `remove(8)`. `top()` returns `5`.

**Pitfalls:** Only remove values that are in the heap: a stray value never drains from `trash`, and can cause `top()` on an empty heap. Prune before every read. `pq.size()` includes dead entries, so track live sizes yourself.

**Used in:** LC 480, LC 2034, LC 2349, LC 218, LC 855

---

## 11. Scheduling — Meeting Rooms II (min rooms)

**Use when:** The problem asks for the "minimum number of rooms", "platforms", or the peak number of overlapping intervals.

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

**Complexity:** O(n log n) time and O(n) space.

**Example:** `[[0,30],[5,10],[15,20]]` returns `2`.

**Pitfalls:** `endTimes.top() <= iv[0]` allows reuse when one meeting ends as another starts. Use `<` if those count as overlapping. Sort by start first, or the heap's final size is meaningless.

**Used in:** LC 253, LC 1094

---

## 12. Greedy Max-Heap — Task Scheduler / Reorganize String

**Use when:** The problem says "no two adjacent are the same" or "at least n apart": place the most frequent item first.

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

**Complexity:** O(n log a) time and O(a) space for an alphabet of a letters, here at most 26.

**Example:** `"aab"` returns `"aba"`, and `"aaab"` returns `""`.

**Pitfalls:** Release the held item only after popping the next one, or it can repeat. A short result means failure, so compare lengths at the end. This code handles a gap of one, so LC 621 and LC 358 need a cooldown queue instead of one slot.

**Used in:** LC 767, LC 621, LC 1054, LC 358, LC 1405, LC 2182

---

## 13. Regret-Based Greedy — IPO / max capital

**Use when:** Items unlock as a budget grows, and the problem says to "maximize" after at most k picks: take the best affordable item each time.

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

**Complexity:** O(n log n + k log n) time and O(n) space.

**Example:** `k = 2`, `w = 0`, `profits = [1,2,3]`, `capital = [0,1,1]` returns `4`.

**Pitfalls:** Unlock with `<=`, since exactly enough capital qualifies. Stop early when nothing is affordable, because more capital can't appear on its own. IPO never undoes a pick: true regret, as in LC 630, instead evicts a past choice from the heap when the budget breaks.

**Used in:** LC 502, LC 630, LC 871, LC 1642

---

## 14. Custom Comparator — multi-key heap

**Use when:** The problem says "if tied, pick the smallest index", or the order depends on more than one field.

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

**Complexity:** Each `push` and `pop` is O(log n) comparisons, and space is O(n).

**Example:** Jobs `{priority, time}` of `{1,5}`, `{2,9}`, `{2,3}` pop as `{2,3}`, `{2,9}`, `{1,5}` with `Cmp`.

**Pitfalls:** The comparator is inverted: returning true puts `a` further from the top. Use `<` or `>`, never `<=` or `>=`, because a comparator that returns true for equal items is undefined behaviour. A lambda must be passed to the constructor as `pq(cmp)`.

**Used in:** LC 692, LC 973, LC 1834, LC 1882, LC 218, LC 857

---

## 15. Indexed / Addressable PQ — decrease-key via map

**Use when:** The problem changes the priority of an item already in the queue, as in "changeRating" or a decrease-key.

`std::priority_queue` can't update keys; emulate with a `set` or lazy entries.

```cpp
// set-based: supports erase + reinsert in O(log n)
set<pair<int,int>> pq; // {dist, node}

dist[src] = 0;
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

**Complexity:** O((V + E) log V) time for this Dijkstra, and O(V) space for the set. Each update is one erase and one insert, both O(log n).

**Example:** Edges 0→1 (4), 0→2 (1), 2→1 (2) with `src = 0` give `dist = [0,3,1]`.

**Pitfalls:** Erase using the old key, before updating `dist[v]`. `dist` starts at infinity with `dist[src] = 0`, or a cycle back to `src` corrupts it. Erasing a key that isn't there is a harmless no-op on the first visit to a node.

**Used in:** LC 743, LC 2349, LC 2353

---

## 16. Manual Binary Heap — array-backed

**Use when:** The interviewer bans the library, or you need sift control for something like an indexed heap.

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

**Complexity:** `push` and `pop` are O(log n), `top` is O(1), and space is O(n).

**Example:** Push 5, 1, 3. `top()` returns `1`, and after `pop()` it returns `3`.

**Pitfalls:** The parent is `(i - 1) / 2`, and the children are `2i + 1` and `2i + 2`. Using 1-based formulas on a 0-based array corrupts the heap. `top()` and `pop()` assume the heap isn't empty.

**Used in:** LC 215, LC 703, LC 1046

---

## Common Choose-What Pattern

**Use when:** You have read the problem and need to map its wording to one of the templates above.

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

**Complexity:** Most of these templates cost O(n log n) or O(n log k) time and O(n) or O(k) space. Each section above gives the exact cost.

**Example:** "Merge k sorted lists" maps to the min-heap of stream heads. "Repeatedly merge two smallest" maps to section 8.

**Pitfalls:** A heap isn't always the best tool. A window max is O(n) with a monotonic deque, and a kth query with a huge k needs binary search on the value.

**Used in:** LC 215, LC 347, LC 295, LC 23, LC 743, LC 1167, LC 253, LC 767, LC 502, LC 2353, LC 692

