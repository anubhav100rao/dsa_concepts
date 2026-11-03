## 1. Activity Selection / Non-overlapping intervals

**Use when:** "Maximum number of non-overlapping" intervals, meetings or events you can attend.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(intervals.begin(), intervals.end(), [](auto &a, auto &b) {
    return a[1] < b[1]; // sort by end time
});

int count = 0;
int lastEnd = INT_MIN;

for (auto &in : intervals) {
    int start = in[0], end = in[1];

    if (start >= lastEnd) {
        count++;
        lastEnd = end;
    }
}
```

**Example:** `intervals = [[1,2],[2,3],[3,4],[1,3]]` gives `count = 3`.

**Pitfalls:** `start >= lastEnd` lets intervals that touch at a point both count. Use `>` if touching counts as overlap. Sorting by start instead of end is the classic wrong answer.

**Used in:** LC 435, LC 646

---

## 2. Minimum intervals to remove

**Use when:** "Remove the fewest intervals so the rest don't overlap": n minus the activity-selection count.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(intervals.begin(), intervals.end(), [](auto &a, auto &b) {
    return a[1] < b[1];
});

int removed = 0;
int lastEnd = intervals[0][1];

for (int i = 1; i < intervals.size(); i++) {
    if (intervals[i][0] < lastEnd) {
        removed++;
    } else {
        lastEnd = intervals[i][1];
    }
}
```

**Example:** `intervals = [[1,2],[2,3],[3,4],[1,3]]` gives `removed = 1`.

**Pitfalls:** `intervals[0]` crashes on empty input, so return 0 first. When two intervals overlap, keep the one that ends earlier, which the end-time sort already guarantees.

**Used in:** LC 435

---

## 3. Merge Intervals

**Use when:** "Merge all overlapping intervals" or "total length covered": sort by start, extend or open a new interval.

**Complexity:** O(n log n) time for the sort, O(n) space for the output.

```cpp
sort(intervals.begin(), intervals.end());

vector<vector<int>> merged;

for (auto &in : intervals) {
    if (merged.empty() || merged.back()[1] < in[0]) {
        merged.push_back(in);
    } else {
        merged.back()[1] = max(merged.back()[1], in[1]);
    }
}
```

**Example:** `intervals = [[1,3],[8,10],[2,6]]` gives `merged = [[1,6],[8,10]]`.

**Pitfalls:** Write `max(back, in[1])`, not `in[1]`: `[1,10]` followed by `[2,3]` must stay `[1,10]`. `back < in[0]` merges intervals that touch, like `[1,2],[2,3]`. Use `<=` if they shouldn't merge.

**Used in:** LC 56, LC 2848

---

## 4. Meeting Rooms / Minimum platforms

**Use when:** "Minimum number of rooms or platforms", meaning the most intervals overlapping at once, when only that count matters.

**Complexity:** O(n log n) time for the two sorts, O(1) extra space.

```cpp
sort(start.begin(), start.end());
sort(end.begin(), end.end());

int i = 0, j = 0;
int rooms = 0, ans = 0;

while (i < start.size()) {
    if (start[i] < end[j]) {
        rooms++;
        ans = max(ans, rooms);
        i++;
    } else {
        rooms--;
        j++;
    }
}
```

**Example:** `start = [0,5,15]` and `end = [30,10,20]` (from `[[0,30],[5,10],[15,20]]`) give `ans = 2`.

**Pitfalls:** Sort the two arrays separately. Pairing them no longer matters. `start[i] < end[j]` frees a room that ends exactly when the next meeting starts. Use `<=` if the end time is inclusive.

**Used in:** LC 253, LC 252

---

## 5. Greedy with min-heap: Meeting Rooms II

**Use when:** Same as the rooms count, but you also need to know which room frees up first, as in assigning meetings to rooms.

**Complexity:** O(n log n) time, O(n) space for the heap.

```cpp
sort(intervals.begin(), intervals.end());

priority_queue<int, vector<int>, greater<int>> pq; // end times

for (auto &in : intervals) {
    int start = in[0], end = in[1];

    if (!pq.empty() && pq.top() <= start) {
        pq.pop();
    }

    pq.push(end);
}

int minRooms = pq.size();
```

**Example:** `intervals = [[0,30],[5,10],[15,20]]` gives `minRooms = 2`.

**Pitfalls:** Sort by start time, not end. Pop at most one room per meeting: one free room is enough, and the heap size is the answer.

**Used in:** LC 253

---

## 6. Jump Game I

**Use when:** "Each element is your maximum jump length. Can you reach the last index?"

**Complexity:** O(n) time, O(1) space.

```cpp
int farthest = 0;

for (int i = 0; i < nums.size(); i++) {
    if (i > farthest) return false;

    farthest = max(farthest, i + nums[i]);
}

return true;
```

**Example:** `nums = [2,3,1,1,4]` returns `true`. `nums = [3,2,1,0,4]` returns `false`, since index 4 is beyond `farthest = 3`.

**Pitfalls:** Check `i > farthest` before using `nums[i]`, because an unreachable index can't extend the range. A zero isn't a dead end unless nothing jumps past it.

**Used in:** LC 55

---

## 7. Jump Game II

**Use when:** "Minimum number of jumps to reach the last index", treating each jump as a BFS level over a range.

**Complexity:** O(n) time, O(1) space.

```cpp
int jumps = 0;
int currEnd = 0;
int farthest = 0;

for (int i = 0; i < nums.size() - 1; i++) {
    farthest = max(farthest, i + nums[i]);

    if (i == currEnd) {
        jumps++;
        currEnd = farthest;
    }
}
```

**Example:** `nums = [2,3,1,1,4]` gives `jumps = 2`.

**Pitfalls:** Stop at `nums.size() - 1`. Visiting the last index can count an extra jump. That expression is unsigned, so it wraps on an empty array, but LC 45 guarantees n >= 1.

**Used in:** LC 45

---

## 8. Gas Station

**Use when:** "Circular route" with gas and cost per station, asking for the start index.

**Complexity:** O(n) time, O(1) space.

```cpp
int total = 0;
int tank = 0;
int start = 0;

for (int i = 0; i < gas.size(); i++) {
    int diff = gas[i] - cost[i];

    total += diff;
    tank += diff;

    if (tank < 0) {
        start = i + 1;
        tank = 0;
    }
}

int ans = total >= 0 ? start : -1;
```

**Example:** `gas = [1,2,3,4,5]` and `cost = [3,4,5,1,2]` give `ans = 3`.

**Pitfalls:** Without the `total >= 0` check you return a start that fails. After a failure, restart at `i + 1`, not `start + 1`: every station in between fails too.

**Used in:** LC 134

---

## 9. Fractional Knapsack

**Use when:** Items can be split, and you want the most value under a weight limit: take the best value-to-weight ratio first.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
struct Item {
    int value, weight;
};

sort(items.begin(), items.end(), [](Item &a, Item &b) {
    return (double)a.value / a.weight > (double)b.value / b.weight;
});

double profit = 0.0;

for (auto &item : items) {
    if (W >= item.weight) {
        profit += item.value;
        W -= item.weight;
    } else {
        profit += (double)item.value / item.weight * W;
        break;
    }
}
```

**Example:** Items `(60,10), (100,20), (120,30)` with `W = 50` give `profit = 240.0`: the first two whole, plus 2/3 of the third.

**Pitfalls:** This is only correct when items can be split. For 0/1 knapsack the same order gives 160 instead of 220, so use DP. Cast to double before dividing.

**Used in:** None in greedy.md. This is the classic fractional knapsack, and section 21 contrasts it with 0/1 knapsack.

---

## 10. Job Sequencing with Deadlines

**Use when:** Unit-time jobs with a deadline and a profit, to maximize total profit: richest first, in the latest free slot.

**Complexity:** O(n log n + n * D) time for the largest deadline D, O(D) space. See section 25 for the faster DSU version.

```cpp
struct Job {
    int deadline, profit;
};

sort(jobs.begin(), jobs.end(), [](Job &a, Job &b) {
    return a.profit > b.profit;
});

int maxDeadline = 0;
for (auto &job : jobs) maxDeadline = max(maxDeadline, job.deadline);

vector<int> slot(maxDeadline + 1, -1);

int totalProfit = 0, jobsDone = 0;

for (int i = 0; i < jobs.size(); i++) {
    for (int d = jobs[i].deadline; d >= 1; d--) {
        if (slot[d] == -1) {
            slot[d] = i;
            totalProfit += jobs[i].profit;
            jobsDone++;
            break;
        }
    }
}
```

**Example:** Jobs `(deadline, profit)` = `(2,100), (1,19), (2,27), (1,25), (3,15)` give `totalProfit = 142` from 3 jobs: 27, 100 and 15.

**Pitfalls:** Scan slots from `deadline` down to 1, not up: the latest free slot keeps earlier ones open. Slots are 1-based, so allocate `maxDeadline + 1`.

**Used in:** Job Sequencing Problem (classic, no LC number) in sections 4 and 21.

---

## 11. Candy Distribution

**Use when:** "Each child with a higher rating than a neighbor gets more": run a left pass and a right pass.

**Complexity:** O(n) time, O(n) space.

```cpp
int n = ratings.size();
vector<int> candy(n, 1);

for (int i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
        candy[i] = candy[i - 1] + 1;
    }
}

for (int i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
        candy[i] = max(candy[i], candy[i + 1] + 1);
    }
}

int total = accumulate(candy.begin(), candy.end(), 0);
```

**Example:** `ratings = [1,0,2]` gives `total = 5`, from `candy = [2,1,2]`.

**Pitfalls:** The right pass must take `max(candy[i], candy[i + 1] + 1)`, or it erases the left pass. Equal neighbors don't need equal candy.

**Used in:** LC 135

---

## 12. Assign Cookies

**Use when:** Match each need to the smallest resource that covers it, as in "maximum number of content children".

**Complexity:** O(n log n + m log m) time for the sorts, O(1) extra space.

```cpp
sort(g.begin(), g.end()); // greed
sort(s.begin(), s.end()); // cookie size

int i = 0, j = 0;

while (i < g.size() && j < s.size()) {
    if (s[j] >= g[i]) {
        i++;
    }
    j++;
}

int satisfied = i;
```

**Example:** `g = [1,2,3]` and `s = [1,1]` give `satisfied = 1`.

**Pitfalls:** Always advance the cookie pointer `j`, but advance the child pointer `i` only on a match. Swapping the roles of g and s silently returns the wrong count.

**Used in:** LC 455

---

## 13. Boats to Save People

**Use when:** "Each boat carries at most two people" with a weight limit: pair the lightest with the heaviest.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(people.begin(), people.end());

int l = 0, r = people.size() - 1;
int boats = 0;

while (l <= r) {
    if (people[l] + people[r] <= limit) {
        l++;
    }

    r--;
    boats++;
}
```

**Example:** `people = [3,2,2,1]` with `limit = 3` gives `boats = 3`.

**Pitfalls:** Use `l <= r`, not `l < r`: the last person left in the middle still needs a boat. The heaviest person always leaves, either alone or with the lightest.

**Used in:** LC 881

---

## 14. Minimum arrows to burst balloons

**Use when:** "Minimum arrows to burst all balloons": a point hits every interval that contains it.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(points.begin(), points.end(), [](auto &a, auto &b) {
    return a[1] < b[1];
});

int arrows = 0;
long long lastEnd = LLONG_MIN;

for (auto &p : points) {
    if (p[0] > lastEnd) {
        arrows++;
        lastEnd = p[1];
    }
}
```

**Example:** `points = [[10,16],[2,8],[1,6],[7,12]]` gives `arrows = 2`.

**Pitfalls:** Use `p[0] > lastEnd`, because balloons that touch can share an arrow. Coordinates can be `INT_MIN`, which is why `lastEnd` starts at `LLONG_MIN`. Sorting with `a[1] - b[1]` overflows.

**Used in:** LC 452

---

## 15. Huffman Coding / Combine smallest first

**Use when:** Merge repeatedly where each merge costs the combined size and any two items may merge: always take the two smallest.

**Complexity:** O(n log n) time, O(n) space for the heap.

```cpp
priority_queue<int, vector<int>, greater<int>> pq;

for (int x : freq) pq.push(x);

int cost = 0;

while (pq.size() > 1) {
    int a = pq.top(); pq.pop();
    int b = pq.top(); pq.pop();

    cost += a + b;
    pq.push(a + b);
}
```

**Example:** `freq = [5,9,12,13,16,45]` gives `cost = 224`.

**Pitfalls:** A single item costs 0, since there are no merges. Large inputs can overflow `int`, so use `long long`. If only adjacent items may merge, it becomes interval DP (LC 1000).

**Used in:** LC 1167

---

## 16. Minimum cost to connect ropes

**Use when:** "Connect all ropes or sticks, where each connection costs the sum of the two". This is section 15 under a different name.

**Complexity:** O(n log n) time, O(n) space for the heap.

```cpp
priority_queue<int, vector<int>, greater<int>> pq;

for (int rope : ropes) pq.push(rope);

int cost = 0;

while (pq.size() > 1) {
    int a = pq.top(); pq.pop();
    int b = pq.top(); pq.pop();

    cost += a + b;
    pq.push(a + b);
}
```

**Example:** `ropes = [4,3,2,6]` gives `cost = 29`.

**Pitfalls:** Return the running `cost`, not the final rope length (which is just the sum). Use `long long` if the lengths are large.

**Used in:** LC 1167

---

## 17. Greedy using max-heap: reorganize string

**Use when:** "Rearrange so that no two adjacent characters are the same": always place the two most plentiful characters.

**Complexity:** O(n log A) time for alphabet size A, O(A) space.

```cpp
vector<int> freq(26, 0);
for (char c : s) freq[c - 'a']++;

priority_queue<pair<int, char>> pq;

for (int i = 0; i < 26; i++) {
    if (freq[i]) pq.push({freq[i], char('a' + i)});
}

string ans;

while (pq.size() >= 2) {
    auto [f1, c1] = pq.top(); pq.pop();
    auto [f2, c2] = pq.top(); pq.pop();

    ans += c1;
    ans += c2;

    if (--f1 > 0) pq.push({f1, c1});
    if (--f2 > 0) pq.push({f2, c2});
}

if (!pq.empty()) {
    auto [f, c] = pq.top();
    if (f > 1) return "";
    ans += c;
}
```

**Example:** `s = "aab"` gives `"aba"`. `s = "aaab"` returns `""`.

**Pitfalls:** Pop two characters per round, so the same one never sits next to itself. A leftover character with a count above 1 means it can't be done. Quick check: any count > (n + 1) / 2 is impossible.

**Used in:** LC 767

---

## 18. Greedy with monotonic stack: remove K digits

**Use when:** "Remove k digits to make the smallest number", or keep k items of a sequence in the smallest order.

**Complexity:** O(n) time, O(n) space.

```cpp
string st;

for (char c : num) {
    while (!st.empty() && k > 0 && st.back() > c) {
        st.pop_back();
        k--;
    }

    st.push_back(c);
}

while (k > 0 && !st.empty()) {
    st.pop_back();
    k--;
}

int i = 0;
while (i < st.size() && st[i] == '0') i++;

string ans = st.substr(i);
if (ans.empty()) ans = "0";
```

**Example:** `num = "1432219"` with `k = 3` gives `"1219"`.

**Pitfalls:** Leftover `k` must trim from the end, as with `"12345"` and `k = 2`. Strip leading zeros, and return `"0"` if nothing is left, as with `"10"` and `k = 2`.

**Used in:** LC 402, LC 1673

---

## 19. Lexicographically smallest subsequence of distinct chars

**Use when:** "Smallest result, each distinct letter exactly once, in subsequence order".

**Complexity:** O(n) time, O(alphabet) space.

```cpp
vector<int> last(26);
vector<bool> used(26, false);

for (int i = 0; i < s.size(); i++) {
    last[s[i] - 'a'] = i;
}

string st;

for (int i = 0; i < s.size(); i++) {
    int c = s[i] - 'a';

    if (used[c]) continue;

    while (!st.empty() &&
           st.back() > s[i] &&
           last[st.back() - 'a'] > i) {
        used[st.back() - 'a'] = false;
        st.pop_back();
    }

    st.push_back(s[i]);
    used[c] = true;
}
```

**Example:** `s = "cbacdcbc"` gives `"acdb"`.

**Pitfalls:** Pop only if the letter appears again later (`last[...] > i`). Skip letters already in the stack, or you get duplicates. Clear `used` when you pop.

**Used in:** LC 316, LC 1081

---

## 20. Partition Labels

**Use when:** "Split into as many parts as possible so each letter appears in at most one part".

**Complexity:** O(n) time, O(alphabet) space.

```cpp
vector<int> last(26);

for (int i = 0; i < s.size(); i++) {
    last[s[i] - 'a'] = i;
}

vector<int> ans;

int start = 0, end = 0;

for (int i = 0; i < s.size(); i++) {
    end = max(end, last[s[i] - 'a']);

    if (i == end) {
        ans.push_back(end - start + 1);
        start = i + 1;
    }
}
```

**Example:** `s = "abaccd"` gives `ans = [3,2,1]`.

**Pitfalls:** Extend with `max(end, last[c])` at every index, not only at the start of a part. Close only when `i == end`.

**Used in:** LC 763

---

## 21. Max profit stock buy/sell multiple transactions

**Use when:** "Buy and sell as many times as you like": every price rise is profit you can take.

**Complexity:** O(n) time, O(1) space.

```cpp
int profit = 0;

for (int i = 1; i < prices.size(); i++) {
    if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
    }
}
```

**Example:** `prices = [7,1,5,3,6,4]` gives `profit = 7`.

**Pitfalls:** Only correct with unlimited transactions and no fee. A cap on transactions (LC 188) or a cooldown needs DP.

**Used in:** LC 122

---

## 22. Greedy interval coverage

**Use when:** "Fewest intervals, clips or taps to cover [0, target]": jump to the farthest reach among options that start inside the covered range.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(intervals.begin(), intervals.end());

int i = 0;
int n = intervals.size();
int count = 0;
int coveredTill = 0;

while (coveredTill < target) {
    int best = coveredTill;

    while (i < n && intervals[i][0] <= coveredTill) {
        best = max(best, intervals[i][1]);
        i++;
    }

    if (best == coveredTill) {
        return -1; // cannot extend coverage
    }

    coveredTill = best;
    count++;
}
```

**Example:** `intervals = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]]` with `target = 10` gives `count = 3`.

**Pitfalls:** If `best` doesn't grow, there is a gap, so return -1. For taps (LC 1326), first turn each tap into `[i - r, i + r]` clamped to the garden.

**Used in:** LC 1024, LC 1326, LC 45

---

## 23. Greedy choose smallest/largest available

**Use when:** The smallest valid choice is always safe, so sort and take items while the state allows it.

**Complexity:** O(n log n) time for the sort, O(1) extra space.

```cpp
sort(nums.begin(), nums.end());

int ans = 0;

for (int x : nums) {
    if (/* x can be used */) {
        ans++;
        // update state
    }
}
```

**Example:** With "x can be used" meaning `budget >= x` and the update `budget -= x`, `nums = [1,3,2,4,1]` with `budget = 7` gives `ans = 4`.

**Pitfalls:** Prove the safety claim before trusting it: if picking a small item can block a later, more valuable one, you need DP.

**Used in:** LC 455, LC 1338, LC 1481

---

## 24. Greedy with sorting by custom comparator

**Use when:** "Arrange the numbers to form the largest number": compare by which concatenation is bigger.

**Complexity:** O(n log n * L) time for digit length L, O(L) extra per comparison.

```cpp
sort(nums.begin(), nums.end(), [](int a, int b) {
    string x = to_string(a) + to_string(b);
    string y = to_string(b) + to_string(a);

    return x > y;
});
```

**Example:** `nums = [3,30,34,5,9]` sorts to `9, 5, 34, 3, 30`, so the joined answer is `"9534330"`.

**Pitfalls:** The comparator must be strict (`x > y`, never `>=`), or `sort` can crash. If the first element after sorting is 0, the answer is `"0"`.

**Used in:** LC 179

---

## 25. Greedy for scheduling by profit using DSU optimization

```cpp
vector<int> parent(maxDeadline + 1);

for (int i = 0; i <= maxDeadline; i++) {
    parent[i] = i;
}

function<int(int)> find = [&](int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);
};

sort(jobs.begin(), jobs.end(), [](Job &a, Job &b) {
    return a.profit > b.profit;
});

int profit = 0;

for (auto &job : jobs) {
    int availableSlot = find(job.deadline);

    if (availableSlot > 0) {
        profit += job.profit;
        parent[availableSlot] = find(availableSlot - 1);
    }
}
```

---

## 26. Greedy with priority queue: Course Schedule III

```cpp
sort(courses.begin(), courses.end(), [](auto &a, auto &b) {
    return a[1] < b[1]; // deadline
});

priority_queue<int> pq;
int time = 0;

for (auto &c : courses) {
    int duration = c[0], deadline = c[1];

    time += duration;
    pq.push(duration);

    if (time > deadline) {
        time -= pq.top();
        pq.pop();
    }
}

int maxCourses = pq.size();
```

---

## 27. Minimum refueling stops

```cpp
priority_queue<int> pq;

int fuel = startFuel;
int i = 0;
int stops = 0;

while (fuel < target) {
    while (i < stations.size() && stations[i][0] <= fuel) {
        pq.push(stations[i][1]);
        i++;
    }

    if (pq.empty()) return -1;

    fuel += pq.top();
    pq.pop();

    stops++;
}
```

---

## 28. CPU Task Scheduler

```cpp
vector<int> freq(26, 0);
for (char t : tasks) freq[t - 'A']++;

int maxFreq = *max_element(freq.begin(), freq.end());

int countMax = 0;
for (int f : freq) {
    if (f == maxFreq) countMax++;
}

int partCount = maxFreq - 1;
int partLength = n - (countMax - 1);
int emptySlots = partCount * partLength;
int availableTasks = tasks.size() - maxFreq * countMax;
int idles = max(0, emptySlots - availableTasks);

int ans = tasks.size() + idles;
```

---

## 29. Greedy for valid parenthesis with wildcard

```cpp
int low = 0, high = 0;

for (char c : s) {
    if (c == '(') {
        low++;
        high++;
    } else if (c == ')') {
        low--;
        high--;
    } else {
        low--;
        high++;
    }

    if (high < 0) return false;

    low = max(low, 0);
}

return low == 0;
```

---

## 30. Two-pointer greedy pairing

```cpp
sort(nums.begin(), nums.end());

int l = 0, r = nums.size() - 1;
int ans = 0;

while (l < r) {
    if (/* nums[l] and nums[r] can pair */) {
        l++;
        r--;
        ans++;
    } else {
        r--;
    }
}
```

Used in: boats, rescue pairing, max matching under condition.

---

## How to recognize greedy

Use greedy when:

```cpp
// 1. Sort by earliest finish time
// 2. Sort by smallest/largest value
// 3. Pick current best using heap
// 4. Maintain farthest reachable
// 5. Replace previous bad choice with better choice
// 6. Use stack to maintain lexicographic/minimum structure
```

Most common greedy proof ideas:

```cpp
// Exchange argument:
// If optimal uses X but greedy uses Y,
// show replacing X with Y does not make answer worse.

// Stays-ahead argument:
// After every step, greedy has at least as good state as any other solution.

// Local optimal choice:
// Current best choice never blocks future better solution.
```
