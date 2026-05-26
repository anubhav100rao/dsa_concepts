# 1. Memoization template

```cpp
int solve(int i, vector<int>& nums, vector<int>& dp) {
    if (i >= nums.size()) return 0;

    if (dp[i] != -1) return dp[i];

    int take = nums[i] + solve(i + 2, nums, dp);
    int skip = solve(i + 1, nums, dp);

    return dp[i] = max(take, skip);
}

// usage:
// vector<int> dp(n, -1);
// int ans = solve(0, nums, dp);
```

---

# 2. 1D DP — House Robber

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];

    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);

    for (int i = 2; i < n; i++) {
        dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]);
    }

    return dp[n - 1];
}
```

Space optimized:

```cpp
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;

    for (int x : nums) {
        int curr = max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = curr;
    }

    return prev1;
}
```

---

# 3. Grid DP — Minimum Path Sum

```cpp
int minPathSum(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();

    vector<vector<int>> dp(n, vector<int>(m, 0));

    dp[0][0] = grid[0][0];

    for (int i = 1; i < n; i++)
        dp[i][0] = dp[i - 1][0] + grid[i][0];

    for (int j = 1; j < m; j++)
        dp[0][j] = dp[0][j - 1] + grid[0][j];

    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    return dp[n - 1][m - 1];
}
```

Space optimized:

```cpp
int minPathSum(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();

    vector<int> dp(m, INT_MAX);
    dp[0] = 0;

    for (int i = 0; i < n; i++) {
        dp[0] += grid[i][0];

        for (int j = 1; j < m; j++) {
            dp[j] = grid[i][j] + min(dp[j], dp[j - 1]);
        }
    }

    return dp[m - 1];
}
```

---

# 4. 0/1 Knapsack

```cpp
int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();

    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];

            if (w >= wt[i - 1]) {
                dp[i][w] = max(dp[i][w],
                               val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            }
        }
    }

    return dp[n][W];
}
```

Space optimized:

```cpp
int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }

    return dp[W];
}
```

Important:

```cpp
// 0/1 knapsack => capacity loop backward
```

---

# 5. Unbounded Knapsack

```cpp
int unboundedKnapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; i++) {
        for (int w = wt[i]; w <= W; w++) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }

    return dp[W];
}
```

Important:

```cpp
// unbounded knapsack => capacity loop forward
```

---

# 6. Coin Change — Minimum coins

```cpp
int coinChange(vector<int>& coins, int amount) {
    const int INF = 1e9;

    vector<int> dp(amount + 1, INF);
    dp[0] = 0;

    for (int x = 1; x <= amount; x++) {
        for (int coin : coins) {
            if (x >= coin) {
                dp[x] = min(dp[x], 1 + dp[x - coin]);
            }
        }
    }

    return dp[amount] == INF ? -1 : dp[amount];
}
```

---

# 7. Coin Change II — Number of combinations

```cpp
int change(int amount, vector<int>& coins) {
    vector<long long> dp(amount + 1, 0);
    dp[0] = 1;

    for (int coin : coins) {
        for (int x = coin; x <= amount; x++) {
            dp[x] += dp[x - coin];
        }
    }

    return dp[amount];
}
```

Important:

```cpp
// coin outer, amount inner => combinations
// amount outer, coin inner => permutations
```

---

# 8. Subset Sum

```cpp
bool subsetSum(vector<int>& nums, int target) {
    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int x : nums) {
        for (int s = target; s >= x; s--) {
            dp[s] = dp[s] || dp[s - x];
        }
    }

    return dp[target];
}
```

---

# 9. Target Sum

```cpp
int findTargetSumWays(vector<int>& nums, int target) {
    int sum = accumulate(nums.begin(), nums.end(), 0);

    if (sum < abs(target)) return 0;
    if ((sum + target) % 2 != 0) return 0;

    int S = (sum + target) / 2;

    vector<int> dp(S + 1, 0);
    dp[0] = 1;

    for (int x : nums) {
        for (int s = S; s >= x; s--) {
            dp[s] += dp[s - x];
        }
    }

    return dp[S];
}
```

Idea:

```cpp
positiveSum - negativeSum = target
positiveSum + negativeSum = total
positiveSum = (total + target) / 2
```

---

# 10. LCS — Longest Common Subsequence

```cpp
int longestCommonSubsequence(string a, string b) {
    int n = a.size(), m = b.size();

    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[n][m];
}
```

Space optimized:

```cpp
int longestCommonSubsequence(string a, string b) {
    int n = a.size(), m = b.size();

    vector<int> prev(m + 1, 0), curr(m + 1, 0);

    for (int i = 1; i <= n; i++) {
        fill(curr.begin(), curr.end(), 0);

        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1])
                curr[j] = 1 + prev[j - 1];
            else
                curr[j] = max(prev[j], curr[j - 1]);
        }

        prev = curr;
    }

    return prev[m];
}
```

---

# 11. Longest Common Substring

```cpp
int longestCommonSubstring(string a, string b) {
    int n = a.size(), m = b.size();

    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    int ans = 0;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
                ans = max(ans, dp[i][j]);
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return ans;
}
```

Important:

```cpp
// subsequence: max(top, left)
// substring: reset to 0 on mismatch
```

---

# 12. Edit Distance

```cpp
int minDistance(string a, string b) {
    int n = a.size(), m = b.size();

    vector<vector<int>> dp(n + 1, vector<int>(m + 1));

    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                int insertOp = dp[i][j - 1];
                int deleteOp = dp[i - 1][j];
                int replaceOp = dp[i - 1][j - 1];

                dp[i][j] = 1 + min({insertOp, deleteOp, replaceOp});
            }
        }
    }

    return dp[n][m];
}
```

---

# 13. LIS — O(n²)

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();

    vector<int> dp(n, 1);
    int ans = 1;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], 1 + dp[j]);
            }
        }

        ans = max(ans, dp[i]);
    }

    return ans;
}
```

---

# 14. LIS — O(n log n)

```cpp
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;

    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);

        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }

    return tails.size();
}
```

For non-decreasing LIS:

```cpp
auto it = upper_bound(tails.begin(), tails.end(), x);
```

---

# 15. Interval DP — Matrix Chain style

```cpp
int intervalDP(vector<int>& arr) {
    int n = arr.size();

    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = 2; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;

            dp[l][r] = INT_MAX;

            for (int k = l; k < r; k++) {
                dp[l][r] = min(dp[l][r],
                               dp[l][k] + dp[k + 1][r] + /* cost(l,k,r) */ 0);
            }
        }
    }

    return dp[0][n - 1];
}
```

---

# 16. Burst Balloons

```cpp
int maxCoins(vector<int>& nums) {
    vector<int> a;
    a.push_back(1);

    for (int x : nums) a.push_back(x);

    a.push_back(1);

    int n = a.size();

    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = 2; len < n; len++) {
        for (int l = 0; l + len < n; l++) {
            int r = l + len;

            for (int k = l + 1; k < r; k++) {
                dp[l][r] = max(dp[l][r],
                               dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]);
            }
        }
    }

    return dp[0][n - 1];
}
```

Idea:

```cpp
// k is the last balloon burst between l and r
```

---

# 17. Palindrome Partitioning II

```cpp
int minCut(string s) {
    int n = s.size();

    vector<vector<bool>> pal(n, vector<bool>(n, false));

    for (int len = 1; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;

            if (s[l] == s[r]) {
                pal[l][r] = len <= 2 || pal[l + 1][r - 1];
            }
        }
    }

    vector<int> dp(n, INT_MAX);

    for (int i = 0; i < n; i++) {
        if (pal[0][i]) {
            dp[i] = 0;
        } else {
            for (int j = 1; j <= i; j++) {
                if (pal[j][i]) {
                    dp[i] = min(dp[i], 1 + dp[j - 1]);
                }
            }
        }
    }

    return dp[n - 1];
}
```

---

# 18. Tree DP — House Robber III

```cpp
pair<int, int> dfs(TreeNode* root) {
    if (!root) return {0, 0};

    auto left = dfs(root->left);
    auto right = dfs(root->right);

    int take = root->val + left.second + right.second;

    int skip = max(left.first, left.second) +
               max(right.first, right.second);

    return {take, skip};
}

int rob(TreeNode* root) {
    auto [take, skip] = dfs(root);
    return max(take, skip);
}
```

Meaning:

```cpp
first  = take current node
second = skip current node
```

---

# 19. Tree DP — Diameter style

```cpp
int ans = 0;

int height(TreeNode* root) {
    if (!root) return 0;

    int left = height(root->left);
    int right = height(root->right);

    ans = max(ans, left + right);

    return 1 + max(left, right);
}
```

---

# 20. DP on DAG

```cpp
int dfs(int u, vector<vector<int>>& graph, vector<int>& dp) {
    if (dp[u] != -1) return dp[u];

    int best = 1;

    for (int v : graph[u]) {
        best = max(best, 1 + dfs(v, graph, dp));
    }

    return dp[u] = best;
}

// usage:
// vector<int> dp(n, -1);
// int ans = max over dfs(i)
```

---

# 21. Longest Increasing Path in Matrix

```cpp
int dirs[5] = {0, 1, 0, -1, 0};

int dfs(int i, int j, vector<vector<int>>& mat, vector<vector<int>>& dp) {
    if (dp[i][j] != -1) return dp[i][j];

    int n = mat.size(), m = mat[0].size();

    int best = 1;

    for (int d = 0; d < 4; d++) {
        int ni = i + dirs[d];
        int nj = j + dirs[d + 1];

        if (ni >= 0 && nj >= 0 && ni < n && nj < m &&
            mat[ni][nj] > mat[i][j]) {
            best = max(best, 1 + dfs(ni, nj, mat, dp));
        }
    }

    return dp[i][j] = best;
}

int longestIncreasingPath(vector<vector<int>>& mat) {
    int n = mat.size(), m = mat[0].size();

    vector<vector<int>> dp(n, vector<int>(m, -1));

    int ans = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            ans = max(ans, dfs(i, j, mat, dp));
        }
    }

    return ans;
}
```

---

# 22. Bitmask DP — TSP style

```cpp
int tsp(vector<vector<int>>& cost) {
    int n = cost.size();
    int N = 1 << n;

    const int INF = 1e9;

    vector<vector<int>> dp(N, vector<int>(n, INF));

    dp[1][0] = 0;

    for (int mask = 0; mask < N; mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue;
            if (dp[mask][u] == INF) continue;

            for (int v = 0; v < n; v++) {
                if (mask & (1 << v)) continue;

                int newMask = mask | (1 << v);

                dp[newMask][v] = min(dp[newMask][v],
                                     dp[mask][u] + cost[u][v]);
            }
        }
    }

    int full = N - 1;
    int ans = INF;

    for (int u = 0; u < n; u++) {
        ans = min(ans, dp[full][u] + cost[u][0]);
    }

    return ans;
}
```

---

# 23. Bitmask DP — Assignment problem

```cpp
int minCostAssignment(vector<vector<int>>& cost) {
    int n = cost.size();
    int N = 1 << n;

    const int INF = 1e9;

    vector<int> dp(N, INF);
    dp[0] = 0;

    for (int mask = 0; mask < N; mask++) {
        int worker = __builtin_popcount(mask);

        if (worker >= n) continue;

        for (int job = 0; job < n; job++) {
            if (!(mask & (1 << job))) {
                int newMask = mask | (1 << job);
                dp[newMask] = min(dp[newMask],
                                  dp[mask] + cost[worker][job]);
            }
        }
    }

    return dp[N - 1];
}
```

---

# 24. Digit DP template

```cpp
string num;
long long dp[20][2][2][1024];

long long dfs(int pos, bool tight, bool started, int mask) {
    if (pos == num.size()) {
        return started ? 1 : 0;
    }

    long long &res = dp[pos][tight][started][mask];

    if (res != -1) return res;

    res = 0;

    int limit = tight ? num[pos] - '0' : 9;

    for (int d = 0; d <= limit; d++) {
        bool newTight = tight && (d == limit);
        bool newStarted = started || (d != 0);

        int newMask = mask;

        if (newStarted) {
            if (mask & (1 << d)) continue;
            newMask |= (1 << d);
        }

        res += dfs(pos + 1, newTight, newStarted, newMask);
    }

    return res;
}

long long countSpecialNumbers(long long n) {
    num = to_string(n);
    memset(dp, -1, sizeof(dp));
    return dfs(0, true, false, 0);
}
```

---

# 25. DP + BFS state — Shortest Path Visiting All Nodes

```cpp
int shortestPathLength(vector<vector<int>>& graph) {
    int n = graph.size();
    int full = (1 << n) - 1;

    queue<pair<int, int>> q;
    vector<vector<int>> dist(1 << n, vector<int>(n, -1));

    for (int i = 0; i < n; i++) {
        int mask = 1 << i;
        q.push({mask, i});
        dist[mask][i] = 0;
    }

    while (!q.empty()) {
        auto [mask, u] = q.front();
        q.pop();

        if (mask == full) return dist[mask][u];

        for (int v : graph[u]) {
            int newMask = mask | (1 << v);

            if (dist[newMask][v] == -1) {
                dist[newMask][v] = dist[mask][u] + 1;
                q.push({newMask, v});
            }
        }
    }

    return -1;
}
```

---

# 26. DP with monotonic deque

Example:

```cpp
dp[i] = nums[i] + max(dp[j]) where i - k <= j < i
```

```cpp
int constrainedSubsetSum(vector<int>& nums, int k) {
    int n = nums.size();

    vector<int> dp(n);
    deque<int> dq;

    int ans = nums[0];

    for (int i = 0; i < n; i++) {
        dp[i] = nums[i];

        if (!dq.empty()) {
            dp[i] += max(0, dp[dq.front()]);
        }

        while (!dq.empty() && dp[dq.back()] <= dp[i]) {
            dq.pop_back();
        }

        dq.push_back(i);

        if (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        ans = max(ans, dp[i]);
    }

    return ans;
}
```

---

# 27. Partition DP

Example:

```cpp
dp[i] = best answer for first i elements
```

```cpp
int partitionDP(vector<int>& arr, int k) {
    int n = arr.size();

    vector<int> dp(n + 1, 0);

    for (int i = 1; i <= n; i++) {
        int mx = 0;

        for (int len = 1; len <= k && i - len >= 0; len++) {
            mx = max(mx, arr[i - len]);

            dp[i] = max(dp[i],
                        dp[i - len] + mx * len);
        }
    }

    return dp[n];
}
```

Used in:

```cpp
Partition Array for Maximum Sum
Minimum Difficulty of Job Schedule
Word Break variants
```

---

# 28. Stock DP — State machine

```cpp
int maxProfit(vector<int>& prices) {
    int hold = -1e9;
    int sold = 0;
    int rest = 0;

    for (int price : prices) {
        int prevHold = hold;
        int prevSold = sold;
        int prevRest = rest;

        hold = max(prevHold, prevRest - price);
        sold = prevHold + price;
        rest = max(prevRest, prevSold);
    }

    return max(sold, rest);
}
```

For cooldown problem.

States:

```cpp
hold = currently holding stock
sold = sold today
rest = doing nothing
```

---

# 29. Regex Matching DP

```cpp
bool isMatch(string s, string p) {
    int n = s.size(), m = p.size();

    vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));

    dp[0][0] = true;

    for (int j = 2; j <= m; j++) {
        if (p[j - 1] == '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p[j - 1] == s[i - 1] || p[j - 1] == '.') {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (p[j - 1] == '*') {
                dp[i][j] = dp[i][j - 2];

                if (p[j - 2] == s[i - 1] || p[j - 2] == '.') {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            }
        }
    }

    return dp[n][m];
}
```

---

# 30. Wildcard Matching DP

```cpp
bool isMatch(string s, string p) {
    int n = s.size(), m = p.size();

    vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));

    dp[0][0] = true;

    for (int j = 1; j <= m; j++) {
        if (p[j - 1] == '*') {
            dp[0][j] = dp[0][j - 1];
        }
    }

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p[j - 1] == s[i - 1] || p[j - 1] == '?') {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (p[j - 1] == '*') {
                dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            }
        }
    }

    return dp[n][m];
}
```

---

# 31. DP with prefix sum optimization

```cpp
vector<int> prefix(n + 1, 0);

for (int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
}

auto rangeSum = [&](int l, int r) {
    return prefix[r + 1] - prefix[l];
};
```

Use inside interval/partition DP:

```cpp
dp[l][r] = min(dp[l][r],
               dp[l][k] + dp[k + 1][r] + rangeSum(l, r));
```

---

# 32. DP reconstruction — print chosen items

```cpp
vector<int> reconstructKnapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();

    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];

            if (w >= wt[i - 1]) {
                dp[i][w] = max(dp[i][w],
                               val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            }
        }
    }

    vector<int> chosen;
    int w = W;

    for (int i = n; i >= 1; i--) {
        if (dp[i][w] != dp[i - 1][w]) {
            chosen.push_back(i - 1);
            w -= wt[i - 1];
        }
    }

    reverse(chosen.begin(), chosen.end());
    return chosen;
}
```

---

# 33. Most useful DP constants

```cpp
const int INF = 1e9;
const long long LINF = 4e18;
const int MOD = 1e9 + 7;
```

Modulo DP:

```cpp
dp[i] = (dp[i] + dp[j]) % MOD;
```

Min DP initialization:

```cpp
vector<int> dp(n, INF);
dp[0] = 0;
```

Max DP initialization:

```cpp
vector<int> dp(n, -INF);
dp[0] = 0;
```

---

# 34. Quick pattern reminder

```cpp
// 0/1 knapsack
for item:
    for capacity backward:

// unbounded knapsack
for item:
    for capacity forward:

// combinations
for coin:
    for amount:

// permutations
for amount:
    for coin:

// interval DP
for length:
    for left:
        right = left + length - 1
        for split:

// subsequence DP
for i:
    for j:

// bitmask DP
for mask:
    for last/choice:

// tree DP
postorder DFS

// digit DP
dfs(pos, tight, started, state)
```
