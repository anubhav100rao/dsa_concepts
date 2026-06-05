## 1. Opposite Direction — Pair Sum in Sorted Array

```cpp
// returns indices of a pair summing to target, or {-1, -1}
pair<int,int> twoSumSorted(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;

    while (l < r) {
        int sum = a[l] + a[r];

        if (sum == target) return {l, r};
        else if (sum < target) l++;
        else r--;
    }

    return {-1, -1};
}
```

---

## 2. Opposite Direction — Container With Most Water

```cpp
int maxArea(vector<int>& h) {
    int l = 0, r = h.size() - 1;
    int best = 0;

    while (l < r) {
        int area = min(h[l], h[r]) * (r - l);
        best = max(best, area);

        if (h[l] < h[r]) l++;
        else r--;
    }

    return best;
}
```

---

## 3. Opposite Direction — Trapping Rain Water

```cpp
int trap(vector<int>& h) {
    int l = 0, r = h.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;

    while (l < r) {
        if (h[l] < h[r]) {
            leftMax = max(leftMax, h[l]);
            water += leftMax - h[l];
            l++;
        } else {
            rightMax = max(rightMax, h[r]);
            water += rightMax - h[r];
            r--;
        }
    }

    return water;
}
```

---

## 4. Opposite Direction — Palindrome Check

```cpp
bool isPalindrome(const string& s) {
    int l = 0, r = s.size() - 1;

    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }

    return true;
}
```

Skipping non-alphanumerics:

```cpp
bool isPalindromeAlnum(const string& s) {
    int l = 0, r = s.size() - 1;

    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++;
        r--;
    }

    return true;
}
```

---

## 5. Same Direction — Read/Write In-Place Filter

Remove duplicates from a sorted array; returns new length.

```cpp
int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;

    int write = 1; // next slot to write

    for (int read = 1; read < (int)a.size(); read++) {
        if (a[read] != a[write - 1]) {
            a[write++] = a[read];
        }
    }

    return write;
}
```

Move all zeros to the end, keep order:

```cpp
void moveZeroes(vector<int>& a) {
    int write = 0;

    for (int read = 0; read < (int)a.size(); read++) {
        if (a[read] != 0) swap(a[write++], a[read]);
    }
}
```

---

## 6. Same Direction — Merge Two Sorted Arrays

In-place merge from the back (LeetCode style: `a` has trailing space).

```cpp
void merge(vector<int>& a, int m, vector<int>& b, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;

    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
        else a[k--] = b[j--];
    }
}
```

---

## 7. Fast-Slow Pointers — Cycle Detection (Floyd)

```cpp
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }

    return false;
}
```

Find the cycle start node:

```cpp
ListNode* cycleStart(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* p = head;
            while (p != slow) { p = p->next; slow = slow->next; }
            return p;
        }
    }

    return nullptr;
}
```

---

## 8. Fixed-Size Sliding Window — Max Sum of Window k

```cpp
long long maxSumWindow(vector<int>& a, int k) {
    long long sum = 0;

    for (int i = 0; i < k; i++) sum += a[i];

    long long best = sum;

    for (int i = k; i < (int)a.size(); i++) {
        sum += a[i] - a[i - k]; // slide: add new, drop old
        best = max(best, sum);
    }

    return best;
}
```

---

## 9. Variable Window — Longest (Non-Shrinkable Template)

Longest substring with at most `k` distinct characters.

```cpp
int longestKDistinct(const string& s, int k) {
    unordered_map<char, int> cnt;
    int left = 0, best = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        cnt[s[right]]++;

        while ((int)cnt.size() > k) {
            if (--cnt[s[left]] == 0) cnt.erase(s[left]);
            left++;
        }

        best = max(best, right - left + 1);
    }

    return best;
}
```

---

## 10. Variable Window — Shortest (Shrinkable Template)

Minimum-length subarray with sum `>= target` (positive numbers).

```cpp
int minSubArrayLen(int target, vector<int>& a) {
    int left = 0, best = INT_MAX;
    long long sum = 0;

    for (int right = 0; right < (int)a.size(); right++) {
        sum += a[right];

        while (sum >= target) {
            best = min(best, right - left + 1);
            sum -= a[left++];
        }
    }

    return best == INT_MAX ? 0 : best;
}
```

---

## 11. Sliding Window — Exactly K via atMost

```cpp
// subarrays with exactly K distinct = atMost(K) - atMost(K-1)
int atMost(vector<int>& a, int k) {
    unordered_map<int,int> cnt;
    int left = 0, res = 0;

    for (int right = 0; right < (int)a.size(); right++) {
        if (cnt[a[right]]++ == 0) k--;

        while (k < 0) {
            if (--cnt[a[left]] == 0) k++;
            left++;
        }

        res += right - left + 1; // windows ending at right
    }

    return res;
}

int subarraysWithKDistinct(vector<int>& a, int k) {
    return atMost(a, k) - atMost(a, k - 1);
}
```

---

## 12. Sliding Window — Minimum Window Substring

Smallest window of `s` containing all chars of `t`.

```cpp
string minWindow(const string& s, const string& t) {
    unordered_map<char,int> need;
    for (char c : t) need[c]++;

    int required = need.size();
    int formed = 0;
    int left = 0, bestLen = INT_MAX, bestL = 0;
    unordered_map<char,int> window;

    for (int right = 0; right < (int)s.size(); right++) {
        char c = s[right];
        window[c]++;
        if (need.count(c) && window[c] == need[c]) formed++;

        while (formed == required) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestL = left;
            }
            char lc = s[left++];
            window[lc]--;
            if (need.count(lc) && window[lc] < need[lc]) formed--;
        }
    }

    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}
```

---

## 13. Sliding Window — Find All Anagrams

```cpp
vector<int> findAnagrams(const string& s, const string& p) {
    vector<int> res;
    if (s.size() < p.size()) return res;

    array<int, 26> need{}, window{};
    for (char c : p) need[c - 'a']++;

    int k = p.size();

    for (int i = 0; i < (int)s.size(); i++) {
        window[s[i] - 'a']++;
        if (i >= k) window[s[i - k] - 'a']--;
        if (i >= k - 1 && window == need) res.push_back(i - k + 1);
    }

    return res;
}
```

---

## 14. Sliding Window + Monotonic Deque

Longest subarray where `max - min <= limit`.

```cpp
int longestSubarray(vector<int>& a, int limit) {
    deque<int> mx, mn; // decreasing maxes, increasing mins (indices)
    int left = 0, best = 0;

    for (int right = 0; right < (int)a.size(); right++) {
        while (!mx.empty() && a[mx.back()] <= a[right]) mx.pop_back();
        while (!mn.empty() && a[mn.back()] >= a[right]) mn.pop_back();
        mx.push_back(right);
        mn.push_back(right);

        while (a[mx.front()] - a[mn.front()] > limit) {
            if (mx.front() == left) mx.pop_front();
            if (mn.front() == left) mn.pop_front();
            left++;
        }

        best = max(best, right - left + 1);
    }

    return best;
}
```

---

## 15. Sliding Window + Multiset

Window median / kth via ordered multiset (slide by erase one occurrence).

```cpp
multiset<int> win;

for (int right = 0; right < (int)a.size(); right++) {
    win.insert(a[right]);

    if (right >= k) {
        win.erase(win.find(a[right - k])); // erase by iterator, not value
    }

    if (right >= k - 1) {
        auto it = win.begin();
        advance(it, k / 2);
        // *it is a window order-statistic
    }
}
```

---

## 16. Sliding Window on Circular Array

Max subarray-sum-style scan by doubling indices `i % n`.

```cpp
// max sum of window k on a circular array
long long maxCircularWindow(vector<int>& a, int k) {
    int n = a.size();
    long long sum = 0, best = LLONG_MIN;

    for (int i = 0; i < n + k - 1; i++) {
        sum += a[i % n];
        if (i >= k) sum -= a[(i - k) % n];
        if (i >= k - 1) best = max(best, sum);
    }

    return best;
}
```

---

## 17. Multi-Pointer — 3Sum

```cpp
vector<vector<int>> threeSum(vector<int>& a) {
    sort(a.begin(), a.end());
    int n = a.size();
    vector<vector<int>> res;

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] == a[i - 1]) continue;       // skip dup anchor

        int l = i + 1, r = n - 1;

        while (l < r) {
            int sum = a[i] + a[l] + a[r];

            if (sum == 0) {
                res.push_back({a[i], a[l], a[r]});
                while (l < r && a[l] == a[l + 1]) l++;  // skip dup
                while (l < r && a[r] == a[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) {
                l++;
            } else {
                r--;
            }
        }
    }

    return res;
}
```

---

## 18. Two Pointers on Strings — Backspace Compare

Compare two strings with `#` as backspace, `O(1)` space.

```cpp
bool backspaceCompare(const string& s, const string& t) {
    int i = s.size() - 1, j = t.size() - 1;

    auto next = [](const string& str, int idx) {
        int skip = 0;
        while (idx >= 0) {
            if (str[idx] == '#') { skip++; idx--; }
            else if (skip > 0)   { skip--; idx--; }
            else break;
        }
        return idx;
    };

    while (i >= 0 || j >= 0) {
        i = next(s, i);
        j = next(t, j);
        if (i >= 0 && j >= 0) {
            if (s[i] != t[j]) return false;
        } else if (i >= 0 || j >= 0) {
            return false;
        }
        i--; j--;
    }

    return true;
}
```

---

## 19. Two Pointers on Linked Lists — Nth From End

```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* fast = &dummy;
    ListNode* slow = &dummy;

    for (int i = 0; i < n; i++) fast = fast->next; // gap of n

    while (fast->next) { fast = fast->next; slow = slow->next; }

    slow->next = slow->next->next;
    return dummy.next;
}
```

---

## 20. Two Pointers + Binary Search

For each `i`, binary-search the farthest `j` keeping a condition.

```cpp
// longest subarray (sorted) where a[j] - a[i] <= d
int longestWithinDiff(vector<int>& a, int d) {
    sort(a.begin(), a.end());
    int best = 0;

    for (int i = 0; i < (int)a.size(); i++) {
        int j = upper_bound(a.begin(), a.end(), a[i] + d) - a.begin();
        best = max(best, j - i);
    }

    return best;
}
```

---

## 21. Two Pointers + Greedy — Boats to Save People

```cpp
int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int l = 0, r = people.size() - 1;
    int boats = 0;

    while (l <= r) {
        if (people[l] + people[r] <= limit) l++; // lightest rides along
        r--;
        boats++;
    }

    return boats;
}
```

---

## 22. Sliding Window + Prefix Sum — Subarray Sum Equals K

Handles negatives (window won't work, use hashed prefix sums).

```cpp
int subarraySum(vector<int>& a, int k) {
    unordered_map<long long,int> seen{{0, 1}};
    long long pref = 0;
    int count = 0;

    for (int x : a) {
        pref += x;
        count += seen[pref - k];
        seen[pref]++;
    }

    return count;
}
```

---

## 23. Sliding Window on Matrix — Best Row Band + 1D Window

Reduce 2D to 1D by fixing a row band, then slide over columns.

```cpp
// max sum submatrix region using fixed top..bottom rows
long long bestColumnWindow(vector<long long>& colSum, int k) {
    long long sum = 0, best = LLONG_MIN;

    for (int c = 0; c < (int)colSum.size(); c++) {
        sum += colSum[c];
        if (c >= k) sum -= colSum[c - k];
        if (c >= k - 1) best = max(best, sum);
    }

    return best;
}
// caller fixes top/bottom, accumulates colSum[c] += a[row][c], then calls above
```

---

## 24. Shrinkable vs Non-Shrinkable Templates

```cpp
// ---- SHRINKABLE: find the MINIMUM valid window ----
int left = 0;
for (int right = 0; right < n; right++) {
    add(a[right]);
    while (windowValid()) {        // shrink while still valid
        best = min(best, right - left + 1);
        remove(a[left++]);
    }
}

// ---- NON-SHRINKABLE: find the MAXIMUM valid window ----
left = 0;
for (int right = 0; right < n; right++) {
    add(a[right]);
    while (windowInvalid()) {       // shrink only to restore validity
        remove(a[left++]);
    }
    best = max(best, right - left + 1);
}
```

---

# Common Choose-What Pattern

```cpp
// Sorted array + pair/triple sum     -> opposite-direction two pointers
// Container/area/trapping water      -> opposite-direction two pointers
// In-place filter / partition        -> same-direction read/write
// Cycle detect / middle / nth-end    -> fast-slow pointers
// Fixed window aggregate             -> fixed-size sliding window
// Longest valid window               -> non-shrinkable window
// Shortest valid window              -> shrinkable window
// Exactly K of something             -> atMost(K) - atMost(K-1)
// Window max/min                     -> monotonic deque
// Window order-statistic / median    -> multiset
// Subarray sum with negatives        -> prefix sum + hash map
// Anagram / substring match          -> fixed window + freq array
```
