## 1. Memoization template

**Use when:** A recurrence is easy to write top-down ("take or skip at index i") and you want to add a cache rather than work out a fill order.

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

**Complexity:** O(n) time for n states with O(1) work each. O(n) space for the cache plus the recursion stack.

**Example:** `nums = [2,7,9,3,1]` returns `12` (take 2, 9 and 1).

**Pitfalls:** Using -1 as "not computed" breaks if -1 can be a real answer, so use a separate visited array or another sentinel. Pass `dp` by reference, because a copy throws away the cache.

**Used in:** LC 198, LC 91, LC 139, LC 2140.

---

## 2. 1D DP — House Robber

**Use when:** "You cannot pick two adjacent elements" and you want the best total.

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

**Complexity:** O(n) time. O(n) space for the table, or O(1) with two variables.

**Example:** `nums = [2,7,9,3,1]` returns `12`, and `nums = [1,2,3,1]` returns `4`.

**Pitfalls:** The table version reads `dp[1]`, so it needs the checks for n = 0 and n = 1. For LC 213 (circular), run this twice, once without the first house and once without the last.

**Used in:** LC 198, LC 213, LC 740.

---

## 3. Grid DP — Minimum Path Sum

**Use when:** "You can only move down or right" and you want the cheapest route through a grid.

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

**Complexity:** O(n * m) time. O(n * m) space for the table, or O(m) with one row.

**Example:** `grid = [[1,3,1],[1,5,1],[4,2,1]]` returns `7` (path 1, 3, 1, 1, 1).

**Pitfalls:** The first row and column have only one predecessor, so fill them separately. In the one-row version, `dp[0] = 0` and the INT_MAX fill are what make row 0 work, and min() must pick the other side before anything is added to INT_MAX.

**Used in:** LC 62, LC 63, LC 64, LC 120, LC 931.

---

## 4. 0/1 Knapsack

**Use when:** "Each item can be used at most once" with a capacity or target budget.

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

**Complexity:** O(n * W) time. O(n * W) space for the table, or O(W) with one array.

**Example:** `wt = [1,3,4]`, `val = [15,20,30]`, `W = 4` returns `35` (items of weight 1 and 3).

**Pitfalls:** In the one-array version, a forward capacity loop reuses the same item, which turns this into unbounded knapsack. Loop W downwards and stop at `wt[i]`.

**Used in:** LC 416, LC 494, LC 1049, LC 474, LC 879.

---

## 5. Unbounded Knapsack

**Use when:** "You may use an unlimited number of each item" and you want the best value within a capacity.

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

**Complexity:** O(n * W) time and O(W) space.

**Example:** `wt = [2,3]`, `val = [3,5]`, `W = 7` returns `11` (weights 2, 2 and 3).

**Pitfalls:** Start the capacity loop at `wt[i]`, because starting at 0 reads a negative index. If the knapsack must be filled exactly, start with -INF everywhere except `dp[0] = 0`.

**Used in:** LC 322, LC 518, LC 279.

---

## 6. Coin Change — Minimum coins

**Use when:** "The fewest coins that make up the amount", with unlimited coins of each kind.

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

**Complexity:** O(amount * coins) time and O(amount) space.

**Example:** `coins = [1,2,5]`, `amount = 11` returns `3` (5 + 5 + 1), and `coins = [2]`, `amount = 3` returns `-1`.

**Pitfalls:** INF has to be small enough that `1 + INF` doesn't overflow, so don't use INT_MAX. `amount = 0` must return 0, which `dp[0] = 0` handles.

**Used in:** LC 322, LC 279.

---

## 7. Coin Change II — Number of combinations

**Use when:** "The number of combinations that make up the amount", where 1+2 and 2+1 are the same combination.

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

**Complexity:** O(amount * coins) time and O(amount) space.

**Example:** `amount = 5`, `coins = [1,2,5]` returns `4` (5, 2+2+1, 2+1+1+1, 1+1+1+1+1).

**Pitfalls:** Swapping the two loops counts orderings instead, which is LC 377. `dp[0] = 1` is required, because choosing nothing is the one way to make 0.

**Used in:** LC 518, LC 377.

---

## 8. Subset Sum

**Use when:** "Is there a subset that sums to exactly target?", with non-negative numbers.

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

**Complexity:** O(n * target) time and O(target) space.

**Example:** `nums = [3,34,4,12,5,2]`, `target = 9` returns `true` (4 + 5).

**Pitfalls:** The sum loop must go downwards, or one number gets used twice. For LC 416, return false on an odd total before calling this with `total / 2`.

**Used in:** LC 416, LC 1049.

---

## 9. Target Sum

**Use when:** "Add + or - before each number and count the ways to reach target."

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

**Complexity:** O(n * S) time and O(S) space, where S = (sum + target) / 2.

**Example:** `nums = [1,1,1,1,1]`, `target = 3` returns `5`.

**Pitfalls:** Both guards are needed: `sum < abs(target)` and an odd `sum + target` each mean 0 ways. Zeros in `nums` need no special case, because the loop reaches `s = 0` and doubles the count, which is right since +0 and -0 are different.

**Used in:** LC 494.

---

## 10. LCS — Longest Common Subsequence

**Use when:** "Longest common subsequence", or anything that keeps characters in order across two strings without needing them adjacent.

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

**Complexity:** O(n * m) time. O(n * m) space for the table, or O(m) with two rows.

**Example:** `a = "abcde"`, `b = "ace"` returns `3` ("ace").

**Pitfalls:** dp is 1-indexed and the strings are 0-indexed, so compare `a[i - 1]` with `b[j - 1]`. To print the subsequence you need the full table, not the two-row version.

**Used in:** LC 1143, LC 583, LC 712, LC 1092, LC 516, LC 1312.

---

## 11. Longest Common Substring

**Use when:** "Longest common substring" or "maximum length of repeated subarray": the match must be contiguous.

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

**Complexity:** O(n * m) time and O(n * m) space.

**Example:** `a = "abcdxyz"`, `b = "xyzabcd"` returns `4` ("abcd").

**Pitfalls:** The answer is the largest cell anywhere, not `dp[n][m]`, because a run can end before the end of either string.

**Used in:** LC 718.

---

## 12. Edit Distance

**Use when:** "Minimum operations (insert, delete, replace) to turn one string into another."

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

**Complexity:** O(n * m) time and O(n * m) space.

**Example:** `a = "horse"`, `b = "ros"` returns `3`.

**Pitfalls:** The borders aren't 0: `dp[i][0] = i` and `dp[0][j] = j`, since an empty string needs that many inserts or deletes. On a match, copy the diagonal with no `+ 1`.

**Used in:** LC 72, LC 583, LC 712.

---

## 13. LIS — O(n²)

**Use when:** "Longest increasing subsequence" with n up to a few thousand, or when each pair needs a custom check (chains, divisibility).

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

**Complexity:** O(n^2) time and O(n) space.

**Example:** `nums = [10,9,2,5,3,7,101,18]` returns `4` (for example 2, 3, 7, 18).

**Pitfalls:** The answer is the max over all of `dp`, not `dp[n - 1]`, since the best run may end earlier. Use `<` for strictly increasing and `<=` for non-decreasing.

**Used in:** LC 300, LC 673, LC 1048, LC 368, LC 646.

---

## 14. LIS — O(n log n)

**Use when:** "Longest increasing subsequence" with n up to 10^5, when only the length is needed.

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

**Complexity:** O(n log n) time and O(n) space.

**Example:** `nums = [10,9,2,5,3,7,101,18]` returns `4`, with `tails` ending as [2,3,7,18].

**Pitfalls:** `tails` usually isn't a real subsequence, so only its size counts. For example, [2,3,1] ends as [1,3]. Use lower_bound for strictly increasing and upper_bound for non-decreasing.

**Used in:** LC 300, LC 354.

---

## 15. Interval DP — Matrix Chain style

**Use when:** "Merge adjacent groups" or "best way to parenthesize": the last step splits [l, r] at some k, and the cost depends on the range.

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

**Complexity:** O(n^3) time and O(n^2) space, assuming cost(l, k, r) is O(1).

**Example:** Merging adjacent piles `arr = [1,2,3]` with cost(l, k, r) set to the sum of `arr[l..r]` returns `9` (merge 1+2 for 3, then 3+3 for 6). As written, the cost placeholder is 0, so fill it in first.

**Pitfalls:** Loop by length so smaller intervals are done first. `dp[l][r]` starts at INT_MAX only for len >= 2, and `dp[l][k] + dp[k + 1][r]` never adds to INT_MAX because both are already finished. A max version must start at 0 or -INF instead.

**Used in:** LC 1039, LC 1547, LC 1000, LC 1130.

---

## 16. Burst Balloons

**Use when:** "Burst or remove elements, and what you earn depends on the current neighbors."

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

**Complexity:** O(n^3) time and O(n^2) space.

**Example:** `nums = [3,1,5,8]` returns `167`.

**Pitfalls:** Pad with 1 on both ends, and read the answer at `dp[0][n - 1]` of the padded array. `l` and `r` are exclusive here, so `len` starts at 2 and `k` runs strictly between them.

**Used in:** LC 312, LC 1039, LC 1547.

---

## 17. Palindrome Partitioning II

**Use when:** "The minimum cuts so that every piece is a palindrome."

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

**Complexity:** O(n^2) time and O(n^2) space.

**Example:** `s = "aab"` returns `1` ("aa" | "b").

**Pitfalls:** `dp[i]` counts cuts, not pieces, so a palindromic prefix costs 0. `pal` must fill by length, because `pal[l][r]` reads the shorter `pal[l + 1][r - 1]`.

**Used in:** LC 132, LC 5, LC 1278.

---

## 18. Tree DP — House Robber III

**Use when:** A tree where choosing a node limits its children, such as "no two directly-linked nodes".

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

**Complexity:** O(n) time and O(h) stack space, where h is the height of the tree.

**Example:** Tree `[3,2,3,null,3,null,1]` returns `7` (3 + 3 + 1).

**Pitfalls:** `skip` takes the better of each child's two values, while `take` must use each child's `second`. A null node returns {0, 0}.

**Used in:** LC 337, LC 968.

---

## 19. Tree DP — Diameter style

**Use when:** "The longest path between any two nodes, which may not pass through the root."

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

**Complexity:** O(n) time and O(h) stack space.

**Example:** Tree `[1,2,3,4,5]` leaves `ans = 3` (path 4, 2, 1, 3).

**Pitfalls:** The function returns height, but the answer is the global `ans`, so reset it between test cases. `ans` counts edges here, so a problem that counts nodes needs `+ 1`. For LC 124, clamp negative arms to 0.

**Used in:** LC 543, LC 124, LC 687, LC 2246.

---

## 20. DP on DAG

**Use when:** "Longest path" or "number of paths" when edges only go forward, so there's no cycle.

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

**Complexity:** O(V + E) time and O(V) space for the memo and the stack.

**Example:** `graph = [[1,2],[2],[]]` gives `dfs(0) = 3` (path 0, 1, 2, counted in nodes).

**Pitfalls:** A cycle causes infinite recursion, because the memo isn't set until the call returns. `best = 1` counts nodes, so subtract 1 for edges. Take the max over every start, not only node 0.

**Used in:** LC 329, LC 2050, LC 1786.

---

## 21. Longest Increasing Path in Matrix

**Use when:** "The longest strictly increasing path in a grid", moving in four directions.

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

**Complexity:** O(n * m) time and O(n * m) space.

**Example:** `mat = [[9,9,4],[6,6,8],[2,1,1]]` returns `4` (1, 2, 6, 9).

**Pitfalls:** No visited array is needed, since strictly increasing moves can't form a cycle. That breaks with `>=`, where equal neighbors would loop forever. `dirs` has 5 entries so that `dirs[d + 1]` stays in range.

**Used in:** LC 329.

---

## 22. Bitmask DP — TSP style

**Use when:** "Visit every city exactly once and return to the start", with n up to about 20.

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

**Complexity:** O(2^n * n^2) time and O(2^n * n) space.

**Example:** `cost = [[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]` returns `80` (0, 1, 3, 2, 0).

**Pitfalls:** `dp[1][0] = 0` fixes node 0 as the start, and the final loop adds the trip back. With n = 1 the answer becomes `cost[0][0]`, so check that case. Remove `cost[u][0]` if the path doesn't need to return.

**Used in:** LC 943, LC 847.

---

## 23. Bitmask DP — Assignment problem

**Use when:** "Assign each worker to exactly one job at minimum cost", with n up to about 20.

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

**Complexity:** O(2^n * n) time and O(2^n) space.

**Example:** `cost = [[9,2,7],[6,4,3],[5,8,1]]` returns `9` (2 + 6 + 1).

**Pitfalls:** The worker is implied by `popcount(mask)`, so don't store it. `__builtin_popcount` needs GCC or Clang, and `1 << n` overflows past n = 30.

**Used in:** LC 1879, LC 2172, LC 1434.

---

## 24. Digit DP template

**Use when:** "Count the integers up to n whose digits have some property", with n too big to loop over. This template counts distinct digits.

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

**Complexity:** O(digits * 2 * 2 * 1024 * 10) time and O(digits * 2 * 2 * 1024) space.

**Example:** `n = 20` returns `19` (every number from 1 to 20 except 11).

**Pitfalls:** Leading zeros don't count as digits, which is why `newMask` only changes once the number has started. `started` also excludes 0 from the count. Refill the memo with -1 for each new bound, as this code does.

**Used in:** LC 2376, LC 1012, LC 357.

---

## 25. DP + BFS state — Shortest Path Visiting All Nodes

**Use when:** "The shortest walk that visits every node", where revisiting is allowed and every edge costs the same.

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

**Complexity:** O(2^n * E) time and O(2^n * n) space.

**Example:** `graph = [[1,2,3],[0],[0],[0]]` returns `4` (1, 0, 2, 0, 3).

**Pitfalls:** Start from every node, not only node 0, because the best walk can begin anywhere. A visited check on the node alone is wrong: mark the pair (mask, node), since coming back with more nodes covered is progress.

**Used in:** LC 847.

---

## 26. DP with monotonic deque

**Use when:** "dp[i] depends on the best of the last k values" and n is too large for O(n * k).

Recurrence:

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

**Complexity:** O(n) time and O(n) space, since each index enters and leaves the deque once.

**Example:** `nums = [10,2,-10,5,20]`, `k = 2` returns `37` (10, 2, 5, 20).

**Pitfalls:** This code removes the expired index after pushing, with `dq.front() <= i - k`, which leaves exactly the window i+1-k to i for the next step. If you move that check to the top of the loop, change it to `dq.front() < i - k`.

**Used in:** LC 1425, LC 1696, LC 1499.

---

## 27. Partition DP

**Use when:** "Split the array into contiguous parts" with `dp[i]` trying every length for the last part.

State:

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

**Complexity:** O(n * k) time and O(n) space.

**Example:** `arr = [1,15,7,9,2,5,10]`, `k = 3` returns `84`. As written, this code solves Partition Array for Maximum Sum (LC 1043), which isn't in this topic's question list.

**Pitfalls:** dp is indexed by prefix length, so the last part is `arr[i - len..i - 1]`. Check `i - len >= 0` before reading it. Problems that fix the number of parts, such as LC 1335, need a second dimension.

**Used in:** LC 139, LC 1105, LC 813, LC 1335.

---

## 28. Stock DP — State machine

**Use when:** "Buy and sell with a cooldown", or any problem with a few modes per day and rules between them.

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

**Complexity:** O(n) time and O(1) space.

**Example:** `prices = [1,2,3,0,2]` returns `3` (buy 1, sell 2, cool down, buy 0, sell 2).

**Pitfalls:** Save the previous values first, since all three states must read yesterday's numbers. `hold` must start very low, because starting at 0 gives a free stock. For LC 714, subtract the fee once per transaction.

**Used in:** LC 309, LC 714, LC 122.

---

## 29. Regex Matching DP

**Use when:** "Pattern with `.` and `*` that must match the entire string", where `*` repeats the previous character.

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

**Complexity:** O(n * m) time and O(n * m) space.

**Example:** `s = "aab"`, `p = "c*a*b"` returns `true`.

**Pitfalls:** Zero copies is `dp[i][j - 2]`, not `dp[i][j - 1]`. The empty-string row must be seeded, because `a*` can match nothing. This relies on `*` never being the first pattern character, which LC 10 guarantees.

**Used in:** LC 10.

---

## 30. Wildcard Matching DP

**Use when:** "Pattern with `?` and `*` that must match the entire string", where `*` matches any sequence on its own.

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

**Complexity:** O(n * m) time and O(n * m) space.

**Example:** `s = "adceb"`, `p = "*a*b"` returns `true`.

**Pitfalls:** `dp[i][j - 1]` means `*` matches nothing and `dp[i - 1][j]` means it takes one more character. Only leading `*` can match the empty string, so the seed loop copies from the left and stays false after the first other character.

**Used in:** LC 44.

---

## 31. DP with prefix sum optimization

**Use when:** A transition needs the sum of a range, and recomputing it would add an O(n) loop.

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

**Complexity:** O(n) to build, O(1) per query and O(n) space.

**Example:** `arr = [1,2,3,4]` gives `rangeSum(1, 3) = 9` and `rangeSum(0, 0) = 1`.

**Pitfalls:** `prefix` has size n + 1, so the sum of `arr[l..r]` is `prefix[r + 1] - prefix[l]`. Use long long if values and n are large, because the running sum can overflow int.

**Used in:** LC 1000, LC 1563, LC 1140, LC 1406.

---

## 32. DP reconstruction — print chosen items

**Use when:** "Return the chosen items, not just the best value."

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

**Complexity:** O(n * W) time and O(n * W) space, because walking back needs the whole table.

**Example:** `wt = [1,3,4]`, `val = [15,20,30]`, `W = 4` returns indices `[0,1]`.

**Pitfalls:** The rolled one-array version can't do this, since earlier rows are gone. Walk from `dp[n][W]` to row 1, subtract the weight only when the value changed, and reverse the list at the end.

**Used in:** LC 1092, LC 368.

---

## 33. Most useful DP constants

**Use when:** You're setting up a new DP table and need a safe "impossible" value or the usual modulus.

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

**Complexity:** O(1) for the constants. Filling a table with them is O(n).

**Example:** With `coins = [2]`, `dp[3]` stays `INF` for amount 3, which means impossible. `(1000000006 + 1) % MOD` returns `0`.

**Pitfalls:** INT_MAX + 1 overflows, while `INF = 1e9` keeps INF + INF within int. A product of two residues overflows int, so multiply as long long before taking `% MOD`. Check for `== INF` before using a value.

**Used in:** LC 322, LC 1155.

---

## 34. Quick pattern reminder

**Use when:** You've spotted the pattern and need the right loop order fast.

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

**Complexity:** Knapsack is O(n * W). Interval is O(n^3). Two-sequence is O(n * m). Bitmask is O(2^n * n) or more. Tree is O(n). Digit is O(digits * states * 10).

**Example:** `coins = [1,2]`, `amount = 3` gives 2 with coin outside (1+1+1, 1+2) and 3 with amount outside (1+1+1, 1+2, 2+1).

**Pitfalls:** `right = left + length - 1` assumes inclusive ends. Burst Balloons (section 16) uses exclusive ends, where `r = l + len`. Treat the backward and forward capacity loops as different problems, not as style.

**Used in:** LC 416, LC 322, LC 518, LC 377, LC 312, LC 1143, LC 847, LC 337, LC 2376.
