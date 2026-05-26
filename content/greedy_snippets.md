## 1. Activity Selection / Non-overlapping intervals

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

Used in: max meetings, non-overlapping intervals, erase minimum intervals.

---

## 2. Minimum intervals to remove

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

---

## 3. Merge Intervals

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

---

## 4. Meeting Rooms / Minimum platforms

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

---

## 5. Greedy with min-heap: Meeting Rooms II

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

---

## 6. Jump Game I

```cpp
int farthest = 0;

for (int i = 0; i < nums.size(); i++) {
    if (i > farthest) return false;

    farthest = max(farthest, i + nums[i]);
}

return true;
```

---

## 7. Jump Game II

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

---

## 8. Gas Station

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

---

## 9. Fractional Knapsack

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

---

## 10. Job Sequencing with Deadlines

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

---

## 11. Candy Distribution

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

---

## 12. Assign Cookies

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

---

## 13. Boats to Save People

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

---

## 14. Minimum arrows to burst balloons

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

---

## 15. Huffman Coding / Combine smallest first

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

Used in: minimum cost to connect ropes, Huffman coding.

---

## 16. Minimum cost to connect ropes

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

---

## 17. Greedy using max-heap: reorganize string

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

---

## 18. Greedy with monotonic stack: remove K digits

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

---

## 19. Lexicographically smallest subsequence of distinct chars

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

---

## 20. Partition Labels

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

---

## 21. Max profit stock buy/sell multiple transactions

```cpp
int profit = 0;

for (int i = 1; i < prices.size(); i++) {
    if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
    }
}
```

---

## 22. Greedy interval coverage

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

Used in: minimum taps to water garden, video stitching.

---

## 23. Greedy choose smallest/largest available

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

Common when smallest valid choice is always safe.

---

## 24. Greedy with sorting by custom comparator

```cpp
sort(nums.begin(), nums.end(), [](int a, int b) {
    string x = to_string(a) + to_string(b);
    string y = to_string(b) + to_string(a);

    return x > y;
});
```

Used in: largest number problem.

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
