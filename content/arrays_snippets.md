## 1. Two Pointers — Opposite Direction

**Use when:** The array is sorted and you need a pair with a target sum, or a decision that compares both ends.

```cpp
int l = 0, r = n - 1;

while (l < r) {
    int sum = a[l] + a[r];

    if (sum == target) {
        // found pair
        break;
    } else if (sum < target) {
        l++;
    } else {
        r--;
    }
}
```

**Complexity:** O(n) time, plus O(n log n) if you sort first. O(1) space.

**Example:** `a = [1,3,4,6,9]`, `target = 9` stops at `l = 1`, `r = 3` (3 + 6).

**Pitfalls:** Only valid on sorted input. Keep `l < r`, not `l <= r`, or an element pairs with itself.

**Used in:** LC 167, LC 15, LC 16, LC 11, LC 881, LC 1099.

---

## 2. Two Pointers — Same Direction

**Use when:** For each start `i`, push `j` as far as the window stays valid, and `j` never moves back.

```cpp
int j = 0;

for (int i = 0; i < n; i++) {
    while (j < n && valid(i, j)) {
        j++;
    }

    // window [i, j - 1]
}
```

**Complexity:** O(n) time in total, because `j` only moves forward, provided `valid` is O(1). O(1) space.

**Example:** With `valid(i, j)` meaning `a[j] - a[i] <= 2` on `a = [1,2,3,4]`, `i = 0` gives the window [0, 2] and `i = 1` gives [1, 3].

**Pitfalls:** Do not reset `j` for each `i`, or it becomes O(n^2). If `valid` depends on running state, remove `a[i]` from that state at the end of each iteration.

**Used in:** LC 2779, LC 845, LC 26, LC 80.

---

## 3. Sliding Window — Fixed Size

**Use when:** Every window of exactly `k` consecutive elements, such as "maximum sum of a subarray of size k".

```cpp
int sum = 0;

for (int i = 0; i < k; i++) {
    sum += a[i];
}

int ans = sum;

for (int i = k; i < n; i++) {
    sum += a[i];
    sum -= a[i - k];

    ans = max(ans, sum);
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,12,-5,-6,50,3]`, `k = 4` gives `ans = 51` (the window [12,-5,-6,50]).

**Pitfalls:** Needs `n >= k`. Start `ans` at the first window, not 0, so all-negative input works. Use `long long` for big sums.

**Used in:** LC 643, LC 1456, LC 1423, LC 1052, LC 2090.

---

## 4. Sliding Window — Variable Size

**Use when:** Longest subarray whose sum stays at most `target`, when every value is non-negative.

```cpp
int l = 0;
long long sum = 0;
int ans = 0;

for (int r = 0; r < n; r++) {
    sum += a[r];

    while (sum > target) {
        sum -= a[l];
        l++;
    }

    ans = max(ans, r - l + 1);
}
```

**Complexity:** O(n) time, because `l` and `r` each move at most n times. O(1) space.

**Example:** `a = [3,1,2,1,4]`, `target = 5` gives `ans = 3` (the subarray [1,2,1]).

**Pitfalls:** Negative values break the shrink rule, so use prefix sums instead. With `target < 0` the inner loop moves `l` past `r` and reads out of bounds.

**Used in:** LC 1004, LC 3, LC 424, LC 904, LC 1208.

---

## 5. Prefix Sum

**Use when:** Many range-sum queries on an array that never changes.

```cpp
vector<long long> pref(n + 1, 0);

for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + a[i];
}

// sum from l to r
long long rangeSum = pref[r + 1] - pref[l];
```

**Complexity:** O(n) to build, O(1) per query, O(n) space.

**Example:** `a = [2,4,1,3]` gives `pref = [0,2,6,7,10]`, so the sum over [1, 2] is `pref[3] - pref[1] = 5`.

**Pitfalls:** The sum over [l, r] is `pref[r + 1] - pref[l]`. Using `pref[r] - pref[l]` drops `a[r]`. Keep `pref` as `long long`.

**Used in:** LC 303, LC 1480, LC 724, LC 1685, LC 2055.

---

## 6. Prefix Sum + HashMap

**Use when:** Count subarrays whose sum is exactly `k`, when values can be negative.

```cpp
unordered_map<long long, int> mp;
mp[0] = 1;

long long sum = 0;
int count = 0;

for (int x : a) {
    sum += x;

    if (mp.count(sum - k)) {
        count += mp[sum - k];
    }

    mp[sum]++;
}
```

**Complexity:** O(n) expected time and O(n) space.

**Example:** `a = [1,2,3,-3]`, `k = 3` gives `count = 3`: [1,2], [3] and [1,2,3,-3].

**Pitfalls:** Set `mp[0] = 1` before the loop, or subarrays starting at index 0 are missed. Look up before inserting the current sum, or `k = 0` counts empty subarrays.

**Used in:** LC 560, LC 930, LC 1248, LC 523, LC 974.

---

## 7. Longest Subarray With Sum K

**Use when:** Longest subarray with sum exactly `k`, when values can be negative.

For arrays with negative numbers:

```cpp
unordered_map<long long, int> first;
long long sum = 0;
int ans = 0;

for (int i = 0; i < n; i++) {
    sum += a[i];

    if (sum == k) {
        ans = i + 1;
    }

    if (first.count(sum - k)) {
        ans = max(ans, i - first[sum - k]);
    }

    if (!first.count(sum)) {
        first[sum] = i;
    }
}
```

**Complexity:** O(n) expected time and O(n) space.

**Example:** `a = [1,-1,5,-2,3]`, `k = 3` gives `ans = 4` (the subarray [1,-1,5,-2]).

**Pitfalls:** Store only the first index of each prefix sum, never overwrite it, because the earliest start gives the longest subarray. With only non-negative values, a sliding window does this in O(1) space.

**Used in:** LC 325, LC 1658.

---

## 8. Kadane’s Algorithm — Maximum Subarray Sum

**Use when:** Largest sum of a non-empty contiguous subarray.

```cpp
long long best = a[0];
long long curr = a[0];

for (int i = 1; i < n; i++) {
    curr = max((long long)a[i], curr + a[i]);
    best = max(best, curr);
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [-2,3,-1,2,-4,1]` gives `best = 4` (the subarray [3,-1,2]).

**Pitfalls:** Start from `a[0]`, not 0, so an all-negative array returns its largest element. Guard empty input before reading `a[0]`.

**Used in:** LC 53, LC 121, LC 918, LC 1749.

---

## 9. Kadane With Indices

**Use when:** You need where the best subarray starts and ends, not just its sum.

```cpp
long long best = a[0], curr = a[0];
int start = 0, bestL = 0, bestR = 0;

for (int i = 1; i < n; i++) {
    if (a[i] > curr + a[i]) {
        curr = a[i];
        start = i;
    } else {
        curr += a[i];
    }

    if (curr > best) {
        best = curr;
        bestL = start;
        bestR = i;
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [-2,3,-1,2,-4,1]` gives `best = 4`, `bestL = 1`, `bestR = 3`.

**Pitfalls:** `a[i] > curr + a[i]` restarts only when `curr` is negative. Use `>=` to prefer shorter subarrays. `curr > best` keeps the first best on ties.

**Used in:** LC 53, LC 918.

---

## 10. Difference Array — Range Updates

**Use when:** Many "add `val` to every element in [l, r]" updates, with the final array read once.

```cpp
vector<int> diff(n + 1, 0);

// add val to range [l, r]
diff[l] += val;
diff[r + 1] -= val;

// final array
vector<int> res(n);
int curr = 0;

for (int i = 0; i < n; i++) {
    curr += diff[i];
    res[i] = curr;
}
```

**Complexity:** O(1) per update, O(n) to rebuild. O(n) space.

**Example:** `n = 5` with 3 added to [1, 3] gives `res = [0,3,3,3,0]`.

**Pitfalls:** `diff` needs `n + 1` slots because `r + 1` can be `n`. `diff` holds changes, not values, so run the prefix sum before reading it. For 1-based input, shift indices or allocate `n + 2`.

**Used in:** LC 1109, LC 1094, LC 370, LC 2381, LC 3355.

---

## 11. Prefix Max / Suffix Max

**Use when:** Each index needs the largest value to its left and to its right.

```cpp
vector<int> prefMax(n), suffMax(n);

prefMax[0] = a[0];
for (int i = 1; i < n; i++) {
    prefMax[i] = max(prefMax[i - 1], a[i]);
}

suffMax[n - 1] = a[n - 1];
for (int i = n - 2; i >= 0; i--) {
    suffMax[i] = max(suffMax[i + 1], a[i]);
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [3,0,2,0,4]` gives `prefMax = [3,3,3,3,4]` and `suffMax = [4,4,4,4,4]`, so the trapped water is 3 + 1 + 3 = 7.

**Pitfalls:** Both arrays include `a[i]` itself, which keeps `min(prefMax[i], suffMax[i]) - a[i]` from going negative. Guard `n = 0` before reading `a[0]`.

**Used in:** LC 42, LC 123, LC 581.

---

## 12. Trapping Rain Water

**Use when:** Total trapped water with O(1) extra space.

```cpp
int l = 0, r = n - 1;
int leftMax = 0, rightMax = 0;
int water = 0;

while (l < r) {
    if (a[l] < a[r]) {
        leftMax = max(leftMax, a[l]);
        water += leftMax - a[l];
        l++;
    } else {
        rightMax = max(rightMax, a[r]);
        water += rightMax - a[r];
        r--;
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [3,0,2,0,4]` gives `water = 7`.

**Pitfalls:** Move the side with the smaller height: its water level is settled, because the other side is at least as tall. Update the max before adding water.

**Used in:** LC 42, LC 11.

---

## 13. Dutch National Flag — Sort 0, 1, 2

**Use when:** Sort an array holding only three kinds of values (0, 1, 2) in one pass.

```cpp
int low = 0, mid = 0, high = n - 1;

while (mid <= high) {
    if (a[mid] == 0) {
        swap(a[low++], a[mid++]);
    } else if (a[mid] == 1) {
        mid++;
    } else {
        swap(a[mid], a[high--]);
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [2,0,2,1,1,0]` becomes `[0,0,1,1,2,2]`.

**Pitfalls:** Do not advance `mid` after swapping with `high`, because the value swapped in has not been checked. The loop condition is `mid <= high`. It is not stable, so LC 2161 needs a different approach.

**Used in:** LC 75, LC 905.

---

## 14. Move Zeroes

**Use when:** Shift non-zero values left in their original order and push zeros to the end, in place.

```cpp
int pos = 0;

for (int i = 0; i < n; i++) {
    if (a[i] != 0) {
        swap(a[pos++], a[i]);
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [0,1,0,3,12]` becomes `[1,3,12,0,0]`.

**Pitfalls:** Swapping keeps the zeros. If you copy with `a[pos++] = a[i]` instead, fill the tail with zeros afterwards.

**Used in:** LC 283, LC 27, LC 905.

---

## 15. Remove Duplicates From Sorted Array

**Use when:** A sorted array where you keep one copy of each value in place.

```cpp
int idx = 0;

for (int i = 0; i < n; i++) {
    if (i == 0 || a[i] != a[i - 1]) {
        a[idx++] = a[i];
    }
}

// new size = idx
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,1,2,2,3]` gives `idx = 3`, and the array starts with [1,2,3].

**Pitfalls:** Only works on sorted input. To keep up to two copies (LC 80), compare with `a[idx - 2]` instead.

**Used in:** LC 26, LC 80.

---

## 16. Next Permutation

**Use when:** Rearrange into the next lexicographically greater permutation, in place.

```cpp
int i = n - 2;

while (i >= 0 && a[i] >= a[i + 1]) {
    i--;
}

if (i >= 0) {
    int j = n - 1;
    while (a[j] <= a[i]) {
        j--;
    }
    swap(a[i], a[j]);
}

reverse(a.begin() + i + 1, a.end());
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,3,2]` becomes `[2,1,3]`. The last permutation `[3,2,1]` wraps to `[1,2,3]`.

**Pitfalls:** Use `>=` and `<=` so duplicates work, as in `[1,5,1]` becoming `[5,1,1]`. Reverse the suffix even when `i = -1`.

**Used in:** LC 31.

---

## 17. Rotate Array By K

**Use when:** Rotate an array right by `k` steps in place.

```cpp
k %= n;

reverse(a.begin(), a.end());
reverse(a.begin(), a.begin() + k);
reverse(a.begin() + k, a.end());
```

Right rotation by `k`.

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,2,3,4,5,6,7]`, `k = 3` becomes `[5,6,7,1,2,3,4]`.

**Pitfalls:** Take `k %= n` first, because `k` can exceed `n`. Guard `n = 0` to avoid division by zero. To rotate left, reverse the two parts first and then the whole array.

**Used in:** LC 189, LC 1260.

---

## 18. Find Missing Number

**Use when:** Values are `0..n` with exactly one missing.

For numbers from `0` to `n`:

```cpp
int xr = 0;

for (int i = 0; i <= n; i++) {
    xr ^= i;
}

for (int x : a) {
    xr ^= x;
}

// xr is missing number
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [3,0,1]` (so `n = 3`) gives `xr = 2`.

**Pitfalls:** Here `n` is `a.size()` and the first loop runs to `n` inclusive. The sum formula `n * (n + 1) / 2` also works but can overflow `int`.

**Used in:** LC 268, LC 645.

---

## 19. Find Single Number

**Use when:** Every value appears twice except one.

Every number appears twice except one:

```cpp
int ans = 0;

for (int x : a) {
    ans ^= x;
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [4,1,2,1,2]` gives `ans = 4`.

**Pitfalls:** XOR only cancels values that appear an even number of times. "Three times except one" (LC 137) needs per-bit counts modulo 3.

**Used in:** LC 136, LC 260.

---

## 20. Majority Element — Boyer Moore

**Use when:** Find the value that appears more than n / 2 times, in O(1) space.

```cpp
int candidate = -1;
int count = 0;

for (int x : a) {
    if (count == 0) {
        candidate = x;
        count = 1;
    } else if (x == candidate) {
        count++;
    } else {
        count--;
    }
}
```

Verify if needed:

```cpp
int freq = 0;

for (int x : a) {
    if (x == candidate) freq++;
}

if (freq > n / 2) {
    // candidate is majority
}
```

**Complexity:** O(n) time and O(1) space, plus one more O(n) pass to verify.

**Example:** `a = [2,2,1,1,1,2,2]` gives `candidate = 2`, and verification counts `freq = 4 > 3`.

**Pitfalls:** The vote only gives a candidate. Verify it unless a majority is guaranteed: on `[1,2,3]` it returns 3.

**Used in:** LC 169, LC 1157.

---

## 21. Majority Element > n/3

**Use when:** All values that appear more than n / 3 times. There can be at most two.

```cpp
int c1 = 0, c2 = 1;
int cnt1 = 0, cnt2 = 0;

for (int x : a) {
    if (x == c1) {
        cnt1++;
    } else if (x == c2) {
        cnt2++;
    } else if (cnt1 == 0) {
        c1 = x;
        cnt1 = 1;
    } else if (cnt2 == 0) {
        c2 = x;
        cnt2 = 1;
    } else {
        cnt1--;
        cnt2--;
    }
}
```

Verification:

```cpp
cnt1 = cnt2 = 0;

for (int x : a) {
    if (x == c1) cnt1++;
    else if (x == c2) cnt2++;
}

vector<int> ans;

if (cnt1 > n / 3) ans.push_back(c1);
if (cnt2 > n / 3) ans.push_back(c2);
```

**Complexity:** O(n) time and O(1) space, plus a verification pass.

**Example:** `a = [3,2,3]` gives `ans = [3]`.

**Pitfalls:** Check whether `x` matches a candidate before checking for an empty slot, or one value can fill both slots. The two starting candidates differ (0 and 1), so they can never be equal. Always verify.

**Used in:** LC 229.

---

## 22. Merge Intervals

**Use when:** Combine all overlapping intervals.

```cpp
sort(intervals.begin(), intervals.end());

vector<vector<int>> res;

for (auto &in : intervals) {
    if (res.empty() || res.back()[1] < in[0]) {
        res.push_back(in);
    } else {
        res.back()[1] = max(res.back()[1], in[1]);
    }
}
```

**Complexity:** O(n log n) time for the sort and O(n) space for the output.

**Example:** `[[8,10],[1,3],[2,6],[15,18]]` gives `[[1,6],[8,10],[15,18]]`.

**Pitfalls:** Extend with `max(end, in[1])`, not `in[1]`, or [1,10] followed by [2,3] shrinks. Because the test is `back < start`, touching intervals such as [1,4] and [4,5] merge.

**Used in:** LC 56, LC 759, LC 616.

---

## 23. Insert Interval

**Use when:** Add one interval to a sorted, non-overlapping list in O(n) without re-sorting.

```cpp
vector<vector<int>> res;
int i = 0;

while (i < n && intervals[i][1] < newInterval[0]) {
    res.push_back(intervals[i++]);
}

while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = min(newInterval[0], intervals[i][0]);
    newInterval[1] = max(newInterval[1], intervals[i][1]);
    i++;
}

res.push_back(newInterval);

while (i < n) {
    res.push_back(intervals[i++]);
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `intervals = [[1,3],[6,9]]` with `newInterval = [2,5]` gives `[[1,5],[6,9]]`.

**Pitfalls:** The first loop uses `<` and the second uses `<=`, so an interval touching the new one is merged. Here `n` is `intervals.size()`.

**Used in:** LC 57.

---

## 24. Product Except Self

**Use when:** For each index, the product of every other element, with no division.

```cpp
vector<int> ans(n, 1);

int pref = 1;
for (int i = 0; i < n; i++) {
    ans[i] = pref;
    pref *= a[i];
}

int suff = 1;
for (int i = n - 1; i >= 0; i--) {
    ans[i] *= suff;
    suff *= a[i];
}
```

**Complexity:** O(n) time and O(1) extra space beyond the output.

**Example:** `a = [1,2,3,4]` gives `ans = [24,12,8,6]`.

**Pitfalls:** Write `ans[i]` before multiplying the running product, or the element includes itself. Zeros need no special case here, unlike the divide-the-total approach.

**Used in:** LC 238.

---

## 25. Stock Buy Sell — One Transaction

**Use when:** Best profit from one buy followed by one later sell.

```cpp
int minPrice = a[0];
int profit = 0;

for (int i = 1; i < n; i++) {
    profit = max(profit, a[i] - minPrice);
    minPrice = min(minPrice, a[i]);
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [7,1,5,3,6,4]` gives `profit = 5` (buy at 1, sell at 6).

**Pitfalls:** The profit starts at 0, because you may choose not to trade. Guard `n = 0` before reading `a[0]`.

**Used in:** LC 121, LC 1014.

---

## 26. Stock Buy Sell — Infinite Transactions

**Use when:** Best profit when you may buy and sell as many times as you like.

```cpp
int profit = 0;

for (int i = 1; i < n; i++) {
    if (a[i] > a[i - 1]) {
        profit += a[i] - a[i - 1];
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [7,1,5,3,6,4]` gives `profit = 7` (4 + 3).

**Pitfalls:** Summing every rise equals the best set of trades. It no longer holds with a fee or a cooldown, which need DP.

**Used in:** No question in this topic uses it. LC 122 is in the Greedy and DP topics.

---

## 27. Monotonic Stack — Next Greater Element

**Use when:** For each element, the next value to its right that is strictly greater.

```cpp
vector<int> nge(n, -1);
stack<int> st;

for (int i = n - 1; i >= 0; i--) {
    while (!st.empty() && st.top() <= a[i]) {
        st.pop();
    }

    if (!st.empty()) {
        nge[i] = st.top();
    }

    st.push(a[i]);
}
```

**Complexity:** O(n) time and O(n) space, because each value is pushed and popped once.

**Example:** `a = [2,1,2,4,3]` gives `nge = [4,2,4,-1,-1]`.

**Pitfalls:** The stack stores values. Store indices instead if you need distances. Popping on `<=` gives strictly greater, while popping on `<` gives greater or equal.

**Used in:** LC 901 (the same stack, scanning for the previous greater element). LC 496 and LC 503 are in the Stack & Queue topic.

---

## 28. Monotonic Stack — Previous Smaller Element

**Use when:** For each element, the nearest value to its left that is strictly smaller.

```cpp
vector<int> pse(n, -1);
stack<int> st;

for (int i = 0; i < n; i++) {
    while (!st.empty() && st.top() >= a[i]) {
        st.pop();
    }

    if (!st.empty()) {
        pse[i] = st.top();
    }

    st.push(a[i]);
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [3,1,2,4]` gives `pse = [-1,-1,1,2]`.

**Pitfalls:** Pop on `>=` for strictly smaller, or on `>` for smaller or equal. Contribution problems need opposite tie rules on the left and right passes.

**Used in:** LC 907, LC 1856, LC 2281, LC 1793.

---

## 29. Largest Rectangle in Histogram

**Use when:** Largest rectangle where every bar is at least the height you pick, or the widest range where a value is the minimum.

```cpp
stack<int> st;
long long ans = 0;

for (int i = 0; i <= n; i++) {
    int curr = (i == n ? 0 : a[i]);

    while (!st.empty() && a[st.top()] >= curr) {
        int h = a[st.top()];
        st.pop();

        int left = st.empty() ? -1 : st.top();
        int width = i - left - 1;

        ans = max(ans, 1LL * h * width);
    }

    st.push(i);
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [2,1,5,6,2,3]` gives `ans = 10` (height 5, width 2).

**Pitfalls:** The sentinel height 0 at `i == n` flushes the stack. When the stack is empty the width is `i`, which `left = -1` handles. Multiply in `long long`.

**Used in:** LC 1793, LC 1856.

---

## 30. Circular Next Greater Element

**Use when:** Next greater element when the array wraps around.

```cpp
vector<int> ans(n, -1);
stack<int> st;

for (int i = 2 * n - 1; i >= 0; i--) {
    int idx = i % n;

    while (!st.empty() && st.top() <= a[idx]) {
        st.pop();
    }

    if (i < n && !st.empty()) {
        ans[idx] = st.top();
    }

    st.push(a[idx]);
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [1,2,1]` gives `ans = [2,-1,2]`.

**Pitfalls:** Loop over `2n` indices but write answers only when `i < n`, and still push during the first lap. The maximum value always stays at -1.

**Used in:** No question in this topic uses it. LC 503 is in the Stack & Queue topic.

---

## 31. Subarray Minimums Contribution

**Use when:** Sum of the minimum (or maximum) over every subarray.

```cpp
vector<int> left(n), right(n);
stack<int> st;

for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] > a[i]) {
        st.pop();
    }

    left[i] = st.empty() ? i + 1 : i - st.top();
    st.push(i);
}

while (!st.empty()) st.pop();

for (int i = n - 1; i >= 0; i--) {
    while (!st.empty() && a[st.top()] >= a[i]) {
        st.pop();
    }

    right[i] = st.empty() ? n - i : st.top() - i;
    st.push(i);
}

long long ans = 0;

for (int i = 0; i < n; i++) {
    ans += 1LL * a[i] * left[i] * right[i];
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [3,1,2,4]` gives `ans = 17`.

**Pitfalls:** Keep the tie rules asymmetric (`>` on the left pass, `>=` on the right) so equal minimums are counted once. LC 907 wants the answer mod 1e9 + 7.

**Used in:** LC 907, LC 2104, LC 2281.

---

## 32. Cyclic Sort

**Use when:** Values are meant to be `1..n` and you want each one at index `value - 1`, in place.

For numbers from `1` to `n`:

```cpp
int i = 0;

while (i < n) {
    if (a[i] >= 1 && a[i] <= n && a[i] != a[a[i] - 1]) {
        int correct = a[i] - 1;
        swap(a[i], a[correct]);
    } else {
        i++;
    }
}
```

**Complexity:** O(n) time, because each swap puts one value home for good. O(1) space.

**Example:** `a = [3,1,5,4,2]` becomes `[1,2,3,4,5]`.

**Pitfalls:** Check the range before computing `a[i] - 1`, because `INT_MIN - 1` overflows. Compare `a[i] != a[correct]`, not `i != correct`, or duplicates loop forever.

**Used in:** LC 41, LC 448, LC 442, LC 645.

---

## 33. First Missing Positive

**Use when:** Smallest missing positive in O(n) time and O(1) space.

```cpp
int i = 0;

while (i < n) {
    if (a[i] >= 1 && a[i] <= n && a[i] != a[a[i] - 1]) {
        int correct = a[i] - 1;
        swap(a[i], a[correct]);
    } else {
        i++;
    }
}

int ans = n + 1;

for (int i = 0; i < n; i++) {
    if (a[i] != i + 1) {
        ans = i + 1;
        break;
    }
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [3,4,-1,1]` gives `ans = 2`, and `a = [1,2,3]` gives `ans = 4`.

**Pitfalls:** Values can be `INT_MIN`, so compute `a[i] - 1` only after the range check. The answer is `n + 1` when 1..n are all present.

**Used in:** LC 41.

---

## 34. Count Inversions — Merge Sort

**Use when:** Count pairs `i < j` with `a[i] > a[j]`, or any pair count that becomes easy on sorted halves.

```cpp
long long mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return 0;

    int mid = l + (r - l) / 2;

    long long inv = 0;
    inv += mergeSort(a, l, mid);
    inv += mergeSort(a, mid + 1, r);

    vector<int> temp;
    int i = l, j = mid + 1;

    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) {
            temp.push_back(a[i++]);
        } else {
            inv += mid - i + 1;
            temp.push_back(a[j++]);
        }
    }

    while (i <= mid) temp.push_back(a[i++]);
    while (j <= r) temp.push_back(a[j++]);

    for (int k = l; k <= r; k++) {
        a[k] = temp[k - l];
    }

    return inv;
}
```

Usage:

```cpp
long long inversions = mergeSort(a, 0, n - 1);
```

**Complexity:** O(n log n) time and O(n) space.

**Example:** `a = [2,4,1,3,5]` gives `inversions = 3`: (2,1), (4,1) and (4,3).

**Pitfalls:** Use `<=` in the merge so equal values are not counted. Return `long long`, because there can be about n^2 / 2 inversions. If the count condition differs from the sort order, as in LC 493, count in a separate pass before merging.

**Used in:** LC 315, LC 493, LC 327, LC 912.

---

## 35. Merge Two Sorted Arrays

**Use when:** Merge sorted `b` into sorted `a`, which has room at the end, in place.

```cpp
int i = n - 1;
int j = m - 1;
int k = n + m - 1;

while (i >= 0 && j >= 0) {
    if (a[i] > b[j]) {
        a[k--] = a[i--];
    } else {
        a[k--] = b[j--];
    }
}

while (j >= 0) {
    a[k--] = b[j--];
}
```

Here `a` has size `n + m`.

**Complexity:** O(n + m) time and O(1) space.

**Example:** `a = [1,2,3,0,0,0]` (`n = 3`) with `b = [2,5,6]` becomes `[1,2,2,3,5,6]`.

**Pitfalls:** Fill from the back so unread values in `a` are never overwritten. Leftovers in `a` are already in place, so only `b` needs a final loop.

**Used in:** LC 88.

---

## 36. 3Sum

**Use when:** All unique triplets that sum to zero.

```cpp
sort(a.begin(), a.end());

vector<vector<int>> ans;

for (int i = 0; i < n; i++) {
    if (i > 0 && a[i] == a[i - 1]) continue;

    int l = i + 1, r = n - 1;

    while (l < r) {
        long long sum = 1LL * a[i] + a[l] + a[r];

        if (sum == 0) {
            ans.push_back({a[i], a[l], a[r]});

            while (l < r && a[l] == a[l + 1]) l++;
            while (l < r && a[r] == a[r - 1]) r--;

            l++;
            r--;
        } else if (sum < 0) {
            l++;
        } else {
            r--;
        }
    }
}
```

**Complexity:** O(n^2) time and O(1) extra space besides the output.

**Example:** `a = [-1,0,1,2,-1,-4]` gives `[[-1,-1,2],[-1,0,1]]`.

**Pitfalls:** Skip a repeated first number by comparing with `a[i - 1]`, not `a[i + 1]`, or [-1,-1,2] is lost. After a match, move both pointers past duplicates.

**Used in:** LC 15, LC 16.

---

## 37. 4Sum

**Use when:** All unique quadruplets that sum to `target`.

```cpp
sort(a.begin(), a.end());

vector<vector<int>> ans;

for (int i = 0; i < n; i++) {
    if (i > 0 && a[i] == a[i - 1]) continue;

    for (int j = i + 1; j < n; j++) {
        if (j > i + 1 && a[j] == a[j - 1]) continue;

        int l = j + 1, r = n - 1;

        while (l < r) {
            long long sum = 1LL * a[i] + a[j] + a[l] + a[r];

            if (sum == target) {
                ans.push_back({a[i], a[j], a[l], a[r]});

                while (l < r && a[l] == a[l + 1]) l++;
                while (l < r && a[r] == a[r - 1]) r--;

                l++;
                r--;
            } else if (sum < target) {
                l++;
            } else {
                r--;
            }
        }
    }
}
```

**Complexity:** O(n^3) time and O(1) extra space besides the output.

**Example:** `a = [1,0,-1,0,-2,2]`, `target = 0` gives `[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]`.

**Pitfalls:** Sum in `long long`, because four values near 1e9 overflow `int`. The second skip is `j > i + 1`, not `j > 0`.

**Used in:** LC 18.

---

## 38. Maximum Product Subarray

**Use when:** Largest product of a contiguous subarray, where negatives can flip the sign.

```cpp
long long maxProd = a[0];
long long minProd = a[0];
long long ans = a[0];

for (int i = 1; i < n; i++) {
    if (a[i] < 0) {
        swap(maxProd, minProd);
    }

    maxProd = max((long long)a[i], maxProd * a[i]);
    minProd = min((long long)a[i], minProd * a[i]);

    ans = max(ans, maxProd);
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [-2,3,-4]` gives `ans = 24`, and `a = [2,3,-2,4]` gives `ans = 6`.

**Pitfalls:** Swap max and min before multiplying by a negative. Taking `max(a[i], ...)` handles zeros, which reset both trackers.

**Used in:** LC 152.

---

## 39. Sort by Frequency

**Use when:** Order elements by how often they appear, with a tie-breaker.

```cpp
unordered_map<int, int> freq;

for (int x : a) {
    freq[x]++;
}

sort(a.begin(), a.end(), [&](int x, int y) {
    if (freq[x] == freq[y]) return x < y;
    return freq[x] > freq[y];
});
```

**Complexity:** O(n log n) time and O(n) space.

**Example:** `a = [1,1,2,2,2,3]` becomes `[2,2,2,1,1,3]`.

**Pitfalls:** LC 1636 wants increasing frequency and decreasing value on ties, so flip both comparisons. Capture `freq` by reference and keep the comparator strict.

**Used in:** LC 451, LC 1636, LC 347.

---

## 40. Coordinate Compression

**Use when:** Values are large or sparse, but only their order matters, for example to index a Fenwick tree.

```cpp
vector<int> vals = a;

sort(vals.begin(), vals.end());
vals.erase(unique(vals.begin(), vals.end()), vals.end());

for (int &x : a) {
    x = lower_bound(vals.begin(), vals.end(), x) - vals.begin();
}
```

**Complexity:** O(n log n) time and O(n) space.

**Example:** `a = [100,5,100,40]` becomes `[2,0,2,1]`.

**Pitfalls:** Sort before `unique`, because `unique` only removes adjacent duplicates. Ranks start at 0, so add 1 before using them in a 1-indexed Fenwick tree.

**Used in:** LC 1331, LC 315, LC 493, LC 2179.

---

## 41. Kth Largest Element

**Use when:** The k-th largest value, or the top k, from an array or a stream.

```cpp
priority_queue<int, vector<int>, greater<int>> pq;

for (int x : a) {
    pq.push(x);

    if (pq.size() > k) {
        pq.pop();
    }
}

int kthLargest = pq.top();
```

**Complexity:** O(n log k) time and O(k) space.

**Example:** `a = [3,2,1,5,6,4]`, `k = 2` gives `kthLargest = 5`.

**Pitfalls:** Use a min-heap of size k for the k-th largest, so the top is the smallest of the k largest. `pq.size()` is unsigned, so compare it with a non-negative `k`.

**Used in:** LC 215, LC 347.

---

## 42. Quickselect

**Use when:** The k-th smallest or largest value in O(n) average time, when you may reorder the array.

```cpp
int partition(vector<int>& a, int l, int r) {
    int pivot = a[r];
    int p = l;

    for (int i = l; i < r; i++) {
        if (a[i] <= pivot) {
            swap(a[i], a[p++]);
        }
    }

    swap(a[p], a[r]);
    return p;
}

int quickselect(vector<int>& a, int l, int r, int k) {
    if (l == r) return a[l];

    int p = partition(a, l, r);

    if (p == k) return a[p];
    if (p < k) return quickselect(a, p + 1, r, k);

    return quickselect(a, l, p - 1, k);
}
```

Usage for kth smallest:

```cpp
int ans = quickselect(a, 0, n - 1, k - 1);
```

For kth largest:

```cpp
int ans = quickselect(a, 0, n - 1, n - k);
```

**Complexity:** O(n) average time, O(n^2) in the worst case. O(log n) stack on average.

**Example:** `a = [3,2,1,5,6,4]` with `quickselect(a, 0, n - 1, n - 2)` gives 5, the 2nd largest.

**Pitfalls:** `k` is a 0-based index, so pass `n - k` for the k-th largest. A last-element pivot is O(n^2) on sorted input, so swap a random element into `r` first.

**Used in:** LC 215, LC 324.

---

## 43. Binary Search on Answer

**Use when:** "Minimum possible maximum", "smallest speed or capacity that works": a yes or no check that flips once as the value grows.

```cpp
bool can(int mid) {
    // return true if mid is possible
}

int lo = 0, hi = 1e9;
int ans = hi;

while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;

    if (can(mid)) {
        ans = mid;
        hi = mid - 1;
    } else {
        lo = mid + 1;
    }
}
```

**Complexity:** O(log(range) * cost of can()).

**Example:** With `lo = 1` and `can(mid)` meaning "piles [3,6,7,11] finish in 8 hours at speed mid", the loop returns `ans = 4`.

**Pitfalls:** `can` must be monotonic, or the search silently returns a wrong value. Start `lo` at 1 when `mid` is a divisor. If nothing is feasible, `ans` stays at `hi`.

**Used in:** LC 2141, LC 878.

---

## 44. Count Subarrays With At Most K Distinct

**Use when:** Count subarrays with at most k distinct values, and "exactly k" as a difference of two such counts.

```cpp
int atMostK(vector<int>& a, int k) {
    unordered_map<int, int> freq;
    int l = 0, ans = 0;

    for (int r = 0; r < a.size(); r++) {
        freq[a[r]]++;

        while (freq.size() > k) {
            freq[a[l]]--;

            if (freq[a[l]] == 0) {
                freq.erase(a[l]);
            }

            l++;
        }

        ans += r - l + 1;
    }

    return ans;
}
```

Exactly `K` distinct:

```cpp
int exactlyK = atMostK(a, k) - atMostK(a, k - 1);
```

**Complexity:** O(n) expected time and O(k) space.

**Example:** `a = [1,2,1,2,3]`, `k = 2`: `atMostK(a, 2) = 12` and `atMostK(a, 1) = 5`, so `exactlyK = 7`.

**Pitfalls:** Erase keys that reach zero, or `freq.size()` overcounts. `freq.size() > k` compares unsigned with signed, so keep `k >= 0`.

**Used in:** LC 992, LC 904, LC 340, LC 159.

---

## 45. Count Subarrays With Sum At Most K

**Use when:** Count subarrays with sum at most `k`, when all values are non-negative.

Only for non-negative arrays:

```cpp
int l = 0;
long long sum = 0;
long long ans = 0;

for (int r = 0; r < n; r++) {
    sum += a[r];

    while (sum > k) {
        sum -= a[l];
        l++;
    }

    ans += r - l + 1;
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,2,3]`, `k = 3` gives `ans = 4`: [1], [2], [3] and [1,2].

**Pitfalls:** With `k < 0` the inner loop moves `l` past `r` and reads out of bounds, so return 0 first. This matters for `atMost(goal - 1)` with `goal = 0`.

**Used in:** LC 930, LC 1248.

---

## 46. Minimum Size Subarray Sum

**Use when:** Shortest subarray with sum at least `target`, when values are positive.

```cpp
int l = 0;
long long sum = 0;
int ans = INT_MAX;

for (int r = 0; r < n; r++) {
    sum += a[r];

    while (sum >= target) {
        ans = min(ans, r - l + 1);
        sum -= a[l];
        l++;
    }
}

if (ans == INT_MAX) ans = 0;
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [2,3,1,2,4,3]`, `target = 7` gives `ans = 2` (the subarray [4,3]).

**Pitfalls:** Record the length inside the shrink loop, before removing `a[l]`. Return 0 when nothing qualifies. With negatives use a deque over prefix sums (LC 862).

**Used in:** LC 209.

---

## 47. Maximum Consecutive Ones With K Flips

**Use when:** Longest run of ones if you may flip at most `k` zeros.

```cpp
int l = 0;
int zeros = 0;
int ans = 0;

for (int r = 0; r < n; r++) {
    if (a[r] == 0) zeros++;

    while (zeros > k) {
        if (a[l] == 0) zeros--;
        l++;
    }

    ans = max(ans, r - l + 1);
}
```

**Complexity:** O(n) time and O(1) space.

**Example:** `a = [1,1,1,0,0,0,1,1,1,1,0]`, `k = 2` gives `ans = 6`.

**Pitfalls:** Count zeros in the window, not flips used. LC 1493 is `k = 1` with one element deleted, so subtract 1 from the window length.

**Used in:** LC 1004, LC 1493.

---

## 48. Subarray XOR Equals K

**Use when:** Count subarrays whose XOR is exactly `k`.

```cpp
unordered_map<int, int> mp;
mp[0] = 1;

int xr = 0;
int count = 0;

for (int x : a) {
    xr ^= x;

    if (mp.count(xr ^ k)) {
        count += mp[xr ^ k];
    }

    mp[xr]++;
}
```

**Complexity:** O(n) expected time and O(n) space.

**Example:** `a = [4,2,2,6,4]`, `k = 6` gives `count = 4`.

**Pitfalls:** Seed `mp[0] = 1`. The partner prefix is `xr ^ k`, not `xr - k`.

**Used in:** LC 1310 uses the same prefix XOR, without the map.

---

## 49. Rearrange Positive and Negative Alternately

**Use when:** Place positives and negatives in alternate slots when they occur in equal numbers.

Equal count case:

```cpp
vector<int> ans(n);
int pos = 0, neg = 1;

for (int x : a) {
    if (x >= 0) {
        ans[pos] = x;
        pos += 2;
    } else {
        ans[neg] = x;
        neg += 2;
    }
}
```

**Complexity:** O(n) time and O(n) space.

**Example:** `a = [3,1,-2,-5,2,-4]` gives `ans = [3,-2,1,-5,2,-4]`.

**Pitfalls:** Only correct when the counts are equal. Otherwise `pos` or `neg` runs past `n`, so check the counts or append the leftovers.

**Used in:** LC 922.

---

## 50. Spiral Matrix

**Use when:** Visit a matrix in spiral order.

```cpp
vector<int> ans;

int top = 0, bottom = n - 1;
int left = 0, right = m - 1;

while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++) {
        ans.push_back(mat[top][j]);
    }
    top++;

    for (int i = top; i <= bottom; i++) {
        ans.push_back(mat[i][right]);
    }
    right--;

    if (top <= bottom) {
        for (int j = right; j >= left; j--) {
            ans.push_back(mat[bottom][j]);
        }
        bottom--;
    }

    if (left <= right) {
        for (int i = bottom; i >= top; i--) {
            ans.push_back(mat[i][left]);
        }
        left++;
    }
}
```

**Complexity:** O(n * m) time and O(1) extra space besides the output.

**Example:** `mat = [[1,2,3],[4,5,6]]` gives `[1,2,3,6,5,4]`.

**Pitfalls:** Keep both inner checks, or a single row or column is read twice. Here `n` is the number of rows and `m` the number of columns.

**Used in:** LC 54, LC 59, LC 885.

---

## 51. Rotate Matrix 90 Degrees

**Use when:** Rotate a square matrix 90 degrees clockwise in place.

```cpp
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        swap(mat[i][j], mat[j][i]);
    }
}

for (int i = 0; i < n; i++) {
    reverse(mat[i].begin(), mat[i].end());
}
```

**Complexity:** O(n^2) time and O(1) space.

**Example:** `[[1,2,3],[4,5,6],[7,8,9]]` becomes `[[7,4,1],[8,5,2],[9,6,3]]`.

**Pitfalls:** Transpose with `j` starting at `i + 1`, or each pair swaps back. For counter-clockwise, reverse the columns instead of the rows. Only works on square matrices.

**Used in:** LC 48, LC 867.

---

## 52. Set Matrix Zeroes

**Use when:** Zero out every row and column that holds a 0, with O(1) extra space.

```cpp
bool firstRow = false, firstCol = false;

for (int j = 0; j < m; j++) {
    if (mat[0][j] == 0) firstRow = true;
}

for (int i = 0; i < n; i++) {
    if (mat[i][0] == 0) firstCol = true;
}

for (int i = 1; i < n; i++) {
    for (int j = 1; j < m; j++) {
        if (mat[i][j] == 0) {
            mat[i][0] = 0;
            mat[0][j] = 0;
        }
    }
}

for (int i = 1; i < n; i++) {
    for (int j = 1; j < m; j++) {
        if (mat[i][0] == 0 || mat[0][j] == 0) {
            mat[i][j] = 0;
        }
    }
}

if (firstRow) {
    for (int j = 0; j < m; j++) {
        mat[0][j] = 0;
    }
}

if (firstCol) {
    for (int i = 0; i < n; i++) {
        mat[i][0] = 0;
    }
}
```

**Complexity:** O(n * m) time and O(1) space.

**Example:** `[[1,1,1],[1,0,1],[1,1,1]]` becomes `[[1,0,1],[0,0,0],[1,0,1]]`.

**Pitfalls:** Record whether the first row and column held a zero before using them as markers, and clear them last.

**Used in:** LC 73.

---

## 53. Search in Row-Col Sorted Matrix

**Use when:** Every row and every column is sorted, but rows do not continue from one another.

```cpp
int i = 0, j = m - 1;

while (i < n && j >= 0) {
    if (mat[i][j] == target) {
        return true;
    } else if (mat[i][j] > target) {
        j--;
    } else {
        i++;
    }
}

return false;
```

**Complexity:** O(n + m) time and O(1) space.

**Example:** In `[[1,4,7],[2,5,8],[3,6,9]]`, `target = 5` returns true and `target = 10` returns false.

**Pitfalls:** Start at a corner where one direction increases and the other decreases (top-right or bottom-left). The top-left corner gives no way to discard anything.

**Used in:** LC 240.

---

## 54. Search in Fully Sorted Matrix

**Use when:** The matrix reads as one sorted list, with each row starting after the previous row ends.

```cpp
int l = 0, r = n * m - 1;

while (l <= r) {
    int mid = l + (r - l) / 2;

    int row = mid / m;
    int col = mid % m;

    if (mat[row][col] == target) {
        return true;
    } else if (mat[row][col] < target) {
        l = mid + 1;
    } else {
        r = mid - 1;
    }
}

return false;
```

**Complexity:** O(log(n * m)) time and O(1) space.

**Example:** In `[[1,3,5,7],[10,11,16,20],[23,30,34,60]]`, `target = 3` returns true and `target = 13` returns false.

**Pitfalls:** Index `mid` as row `mid / m`, column `mid % m`, where `m` is the column count. Compute `n * m` in `long long` when it can be large.

**Used in:** LC 74.

---

## 55. Pascal Triangle

**Use when:** Build Pascal's triangle, where each inner value is the sum of the two above it.

```cpp
vector<vector<int>> pascal(n);

for (int i = 0; i < n; i++) {
    pascal[i].resize(i + 1, 1);

    for (int j = 1; j < i; j++) {
        pascal[i][j] = pascal[i - 1][j - 1] + pascal[i - 1][j];
    }
}
```

**Complexity:** O(n^2) time and O(n^2) space.

**Example:** `n = 5` gives a last row of `[1,4,6,4,1]`.

**Pitfalls:** Values overflow `int` from row 34 onward. For a single row (LC 119), update one array from right to left.

**Used in:** LC 118, LC 119.

---

## 56. Mo’s Algorithm Skeleton

**Use when:** Many offline range queries where adding or removing one element updates the answer in O(1).

```cpp
int block = sqrt(n);

sort(queries.begin(), queries.end(), [&](auto &q1, auto &q2) {
    int b1 = q1.l / block;
    int b2 = q2.l / block;

    if (b1 != b2) return b1 < b2;
    return q1.r < q2.r;
});

int currL = 0, currR = -1;

for (auto &q : queries) {
    while (currL > q.l) add(--currL);
    while (currR < q.r) add(++currR);
    while (currL < q.l) remove(currL++);
    while (currR > q.r) remove(currR--);

    ans[q.idx] = getAnswer();
}
```

**Complexity:** O((n + q) * sqrt(n)) time and O(n + q) space.

**Example:** For distinct counts on `a = [1,2,1,3]`, queries [0, 2] and [1, 3] give `ans = [2,3]`.

**Pitfalls:** Grow the window before shrinking it, as the loop order here does, so the window is never invalid. Keep each query's original index for the answer. Not usable when queries must be answered online.

**Used in:** LC 2080.

---

## 57. Random Useful STL

**Use when:** Everyday one-liners for sorting, searching and counting.

```cpp
sort(a.begin(), a.end());

reverse(a.begin(), a.end());

int mn = *min_element(a.begin(), a.end());
int mx = *max_element(a.begin(), a.end());

long long sum = accumulate(a.begin(), a.end(), 0LL);

int cnt = count(a.begin(), a.end(), x);

auto it = lower_bound(a.begin(), a.end(), x);
auto it2 = upper_bound(a.begin(), a.end(), x);

bool exists = binary_search(a.begin(), a.end(), x);

a.erase(unique(a.begin(), a.end()), a.end());
```

**Complexity:** O(n log n) for `sort`, O(log n) for `lower_bound`, `upper_bound` and `binary_search`, and O(n) for the rest.

**Example:** Sorted `a = [1,2,2,3]` with `x = 2`: `lower_bound` points at index 1 and `upper_bound` at index 3, so 2 appears 3 - 1 = 2 times.

**Pitfalls:** The `reverse` line leaves the array descending, so re-sort before `lower_bound`, `upper_bound` or `binary_search`. `unique` only removes adjacent duplicates. `accumulate` needs `0LL` to avoid overflow.

**Used in:** LC 1150, LC 1331, LC 217.

---

## Quick Revision Map

**Use when:** You know the clue in the problem but need the pattern name fast.

```cpp
Two pointers       -> sorted pair, 3Sum, water
Sliding window     -> longest/shortest subarray
Prefix sum         -> range sum, subarray sum K
HashMap + prefix   -> count subarrays
Kadane             -> max subarray
Monotonic stack    -> NGE, histogram, subarray minimums
Cyclic sort        -> missing/duplicate positive numbers
Merge sort         -> inversions
Binary answer      -> min/max feasible value
Matrix traversal   -> spiral, rotate, search
```

**Complexity:** See each pattern's own section.

**Example:** "Count subarrays with sum exactly k" maps to `HashMap + prefix` (section 6).

**Pitfalls:** Wording is a starting point, not proof. Check the constraints too: negative values rule out a sliding window, and n near 40 points to meet-in-the-middle.

**Used in:** LC 167, LC 209, LC 560, LC 53, LC 907, LC 41, LC 315, LC 2141, LC 54.
