## 1. Two Pointers — Opposite Direction

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

Used in: sorted array pair sum, 3Sum, container with most water.

---

## 2. Two Pointers — Same Direction

```cpp
int j = 0;

for (int i = 0; i < n; i++) {
    while (j < n && valid(i, j)) {
        j++;
    }

    // window [i, j - 1]
}
```

Used in: counting subarrays, variable window problems.

---

## 3. Sliding Window — Fixed Size

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

Used in: max sum subarray of size `k`.

---

## 4. Sliding Window — Variable Size

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

Used in: longest subarray with sum constraint, at most K distinct, etc.

---

## 5. Prefix Sum

```cpp
vector<long long> pref(n + 1, 0);

for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + a[i];
}

// sum from l to r
long long rangeSum = pref[r + 1] - pref[l];
```

Used in: range sum queries, subarray sum.

---

## 6. Prefix Sum + HashMap

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

Used in: count subarrays with sum `k`.

---

## 7. Longest Subarray With Sum K

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

---

## 8. Kadane’s Algorithm — Maximum Subarray Sum

```cpp
long long best = a[0];
long long curr = a[0];

for (int i = 1; i < n; i++) {
    curr = max((long long)a[i], curr + a[i]);
    best = max(best, curr);
}
```

Used in: max subarray sum, stock-style problems.

---

## 9. Kadane With Indices

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

---

## 10. Difference Array — Range Updates

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

Used in: multiple range update queries.

---

## 11. Prefix Max / Suffix Max

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

Used in: trapping rain water, partition problems.

---

## 12. Trapping Rain Water

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

---

## 13. Dutch National Flag — Sort 0, 1, 2

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

---

## 14. Move Zeroes

```cpp
int pos = 0;

for (int i = 0; i < n; i++) {
    if (a[i] != 0) {
        swap(a[pos++], a[i]);
    }
}
```

---

## 15. Remove Duplicates From Sorted Array

```cpp
int idx = 0;

for (int i = 0; i < n; i++) {
    if (i == 0 || a[i] != a[i - 1]) {
        a[idx++] = a[i];
    }
}

// new size = idx
```

---

## 16. Next Permutation

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

---

## 17. Rotate Array By K

```cpp
k %= n;

reverse(a.begin(), a.end());
reverse(a.begin(), a.begin() + k);
reverse(a.begin() + k, a.end());
```

Right rotation by `k`.

---

## 18. Find Missing Number

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

---

## 19. Find Single Number

Every number appears twice except one:

```cpp
int ans = 0;

for (int x : a) {
    ans ^= x;
}
```

---

## 20. Majority Element — Boyer Moore

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

---

## 21. Majority Element > n/3

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

---

## 22. Merge Intervals

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

---

## 23. Insert Interval

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

---

## 24. Product Except Self

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

---

## 25. Stock Buy Sell — One Transaction

```cpp
int minPrice = a[0];
int profit = 0;

for (int i = 1; i < n; i++) {
    profit = max(profit, a[i] - minPrice);
    minPrice = min(minPrice, a[i]);
}
```

---

## 26. Stock Buy Sell — Infinite Transactions

```cpp
int profit = 0;

for (int i = 1; i < n; i++) {
    if (a[i] > a[i - 1]) {
        profit += a[i] - a[i - 1];
    }
}
```

---

## 27. Monotonic Stack — Next Greater Element

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

---

## 28. Monotonic Stack — Previous Smaller Element

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

---

## 29. Largest Rectangle in Histogram

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

---

## 30. Circular Next Greater Element

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

---

## 31. Subarray Minimums Contribution

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

---

## 32. Cyclic Sort

For numbers from `1` to `n`:

```cpp
int i = 0;

while (i < n) {
    int correct = a[i] - 1;

    if (a[i] >= 1 && a[i] <= n && a[i] != a[correct]) {
        swap(a[i], a[correct]);
    } else {
        i++;
    }
}
```

Used in: missing positive, duplicate number, disappeared numbers.

---

## 33. First Missing Positive

```cpp
int i = 0;

while (i < n) {
    int correct = a[i] - 1;

    if (a[i] >= 1 && a[i] <= n && a[i] != a[correct]) {
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

---

## 34. Count Inversions — Merge Sort

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

---

## 35. Merge Two Sorted Arrays

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

---

## 36. 3Sum

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

---

## 37. 4Sum

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

---

## 38. Maximum Product Subarray

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

---

## 39. Sort by Frequency

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

---

## 40. Coordinate Compression

```cpp
vector<int> vals = a;

sort(vals.begin(), vals.end());
vals.erase(unique(vals.begin(), vals.end()), vals.end());

for (int &x : a) {
    x = lower_bound(vals.begin(), vals.end(), x) - vals.begin();
}
```

Used in: Fenwick tree, segment tree, large values.

---

## 41. Kth Largest Element

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

---

## 42. Quickselect

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

---

## 43. Binary Search on Answer

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

Used in: minimum capacity, minimum days, aggressive cows.

---

## 44. Count Subarrays With At Most K Distinct

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

---

## 45. Count Subarrays With Sum At Most K

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

---

## 46. Minimum Size Subarray Sum

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

---

## 47. Maximum Consecutive Ones With K Flips

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

---

## 48. Subarray XOR Equals K

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

---

## 49. Rearrange Positive and Negative Alternately

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

---

## 50. Spiral Matrix

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

---

## 51. Rotate Matrix 90 Degrees

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

---

## 52. Set Matrix Zeroes

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

---

## 53. Search in Row-Col Sorted Matrix

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

---

## 54. Search in Fully Sorted Matrix

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

---

## 55. Pascal Triangle

```cpp
vector<vector<int>> pascal(n);

for (int i = 0; i < n; i++) {
    pascal[i].resize(i + 1, 1);

    for (int j = 1; j < i; j++) {
        pascal[i][j] = pascal[i - 1][j - 1] + pascal[i - 1][j];
    }
}
```

---

## 56. Mo’s Algorithm Skeleton

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

---

## 57. Random Useful STL

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

---

## Quick Revision Map

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
