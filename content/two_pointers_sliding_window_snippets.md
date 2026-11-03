## 1. Opposite Direction — Pair Sum in Sorted Array

**Use when:** The array is sorted and the problem says "two numbers add up to target".

**Complexity:** O(n) time and O(1) space, or O(n log n) if you have to sort first.

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

**Example:** `a = [2,3,4,8,11], target = 12` returns `{2, 3}`, because `a[2] + a[3] = 12`.

**Pitfalls:** Use `l < r`, because `l <= r` pairs an element with itself. The result is 0-indexed, but LC 167 wants 1-indexed. Sum into `long long` if values can reach the `int` limit.

**Used in:** LC 167, LC 15, LC 16, LC 1099

---

## 2. Opposite Direction — Container With Most Water

**Use when:** The problem says "two lines form a container", so the area depends only on the two chosen ends.

**Complexity:** O(n) time and O(1) space.

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

**Example:** `h = [1,8,6,2,5]` returns `15`, from the walls at indices 1 and 4.

**Pitfalls:** Move the shorter wall, because moving the taller one can't increase the area. If heights are equal, moving either is safe. The product can exceed `int` when values are very large.

**Used in:** LC 11

---

## 3. Opposite Direction — Trapping Rain Water

**Use when:** The problem says "how much water can it trap", which is the trapped amount across all bars of a 1D height map.

**Complexity:** O(n) time and O(1) space.

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

**Example:** `h = [4,2,0,3,2,5]` returns `9`.

**Pitfalls:** Update the running max before adding water, or `leftMax - h[l]` can go negative. Start with `l < r`, since the final bar is the tallest and holds nothing. For a 2D grid (LC 407) you need a heap instead.

**Used in:** LC 42

---

## 4. Opposite Direction — Palindrome Check

**Use when:** The problem says "reads the same forward and backward", or asks you to compare mirrored positions in place.

**Complexity:** O(n) time and O(1) space.

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

**Example:** `isPalindrome("abcba")` returns `true`, and `isPalindromeAlnum("A man, a plan, a canal: Panama")` returns `true`.

**Pitfalls:** Keep the `l < r` check inside the skip loops, or a string of only punctuation runs off the end. Cast to `unsigned char` before `isalnum` and `tolower` if the input can hold non-ASCII bytes.

**Used in:** LC 125, LC 680, LC 234

---

## 5. Same Direction — Read/Write In-Place Filter

**Use when:** The problem says "in-place", "return the new length" or "maintain relative order".

**Complexity:** O(n) time and O(1) space.

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

**Example:** `removeDuplicates` on `[0,0,1,1,2]` returns `3`, leaving `[0,1,2]` in front. `moveZeroes` on `[0,1,0,3,12]` gives `[1,3,12,0,0]`.

**Pitfalls:** Compare against `a[write - 1]`, the last kept value, not `a[read - 1]`. The early return handles an empty array, where `write = 1` would otherwise be wrong. Only the first `write` slots are meaningful afterwards.

**Used in:** LC 26, LC 27, LC 80, LC 283, LC 2460

---

## 6. Same Direction — Merge Two Sorted Arrays

**Use when:** You have two sorted sequences to combine, and the problem says "merge" or leaves spare space at the end of one array.

**Complexity:** O(m + n) time and O(1) extra space.

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

**Example:** `a = [1,2,3,0,0,0], m = 3, b = [2,5,6], n = 3` turns `a` into `[1,2,2,3,5,6]`.

**Pitfalls:** Loop on `j >= 0` alone, because any leftovers from `a` are already in place. Check `i >= 0` before reading `a[i]`, since `m` can be 0. Filling from the front would overwrite values you haven't read yet.

**Used in:** LC 88, LC 21, LC 977

---

## 7. Fast-Slow Pointers — Cycle Detection (Floyd)

**Use when:** The problem mentions a "cycle", or asks for "where the cycle begins" with O(1) memory.

**Complexity:** O(n) time and O(1) space.

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

**Example:** For `3 → 2 → 0 → -4` with `-4` linking back to `2`, `hasCycle` returns `true` and `cycleStart` returns node `2`.

**Pitfalls:** Check `fast && fast->next` before the double step, or a list without a cycle crashes. Compare node pointers, not values, since values can repeat. In phase 2 both pointers move one step at a time.

**Used in:** LC 141, LC 142, LC 202, LC 287

---

## 8. Fixed-Size Sliding Window — Max Sum of Window k

**Use when:** The problem gives the size: "of length k", "size k" or "k consecutive".

**Complexity:** O(n) time and O(1) space.

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

**Example:** `a = [2,1,5,1,3,2], k = 3` returns `9`, from `[5,1,3]`.

**Pitfalls:** This assumes `k <= a.size()`, and the first loop reads out of bounds otherwise. Start `best` from the first full window, not 0, because window sums can be negative. A running sum can't give you the window's max or min.

**Used in:** LC 643, LC 1052, LC 1456, LC 2090

---

## 9. Variable Window — Longest (Non-Shrinkable Template)

**Use when:** The problem says "longest" with a limit, such as "at most k distinct", and you only need the length.

**Complexity:** O(n) time and O(k) space for the map.

Longest substring with at most `k` distinct characters.

```cpp
int longestKDistinct(const string& s, int k) {
    unordered_map<char, int> cnt;
    int left = 0, best = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        cnt[s[right]]++;

        if ((int)cnt.size() > k) { // slide: the window never gets smaller
            if (--cnt[s[left]] == 0) cnt.erase(s[left]);
            left++;
        }

        best = max(best, right - left + 1);
    }

    return best;
}
```

**Example:** `s = "eceba", k = 2` returns `3`, from `"ece"`.

**Pitfalls:** Using `if`, the window slides without shrinking, so it may hold too many distinct characters. Its size is still the answer, but its contents aren't. Use `while` when you need a valid window at every step. Erase keys at zero, or `cnt.size()` overcounts.

**Used in:** LC 159, LC 340, LC 424, LC 904, LC 1004

---

## 10. Variable Window — Shortest (Shrinkable Template)

**Use when:** The problem says "minimum length" or "smallest subarray", and values are positive.

**Complexity:** O(n) time and O(1) space.

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

**Example:** `target = 7, a = [2,3,1,2,4,3]` returns `2`, from `[4,3]`.

**Pitfalls:** Record the answer inside the `while`, before removing the left element. Return 0 when `best` is still `INT_MAX`. Negative values break the shrink rule, so LC 862 needs a deque over prefix sums.

**Used in:** LC 209, LC 1234, LC 2260

---

## 11. Sliding Window — Exactly K via atMost

**Use when:** The problem says "exactly k" and asks how many subarrays qualify.

**Complexity:** O(n) time for two passes and O(k) space.

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

**Example:** `a = [1,2,1,2,3], k = 2` returns `7`, which is `atMost(2) = 12` minus `atMost(1) = 5`.

**Pitfalls:** Add `right - left + 1`, the count of subarrays ending at `right`, and not 1. Use `long long` for the result on long arrays. `atMost` changes its own copy of `k`, so it must take it by value.

**Used in:** LC 930, LC 992, LC 1248

---

## 12. Sliding Window — Minimum Window Substring

**Use when:** The problem says "smallest window containing all characters of t", including duplicates.

**Complexity:** O(|s| + |t|) expected time and O(alphabet) space.

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

**Example:** `s = "ADOBECODEBANC", t = "ABC"` returns `"BANC"`.

**Pitfalls:** Change `formed` only when a count crosses the required amount exactly, using `==` on the way up and `<` on the way down. Count with a map or a 128-slot array, because `t` can have uppercase and lowercase. Return `""` when no window qualifies.

**Used in:** LC 76, LC 1234

---

## 13. Sliding Window — Find All Anagrams

**Use when:** The problem says "anagram" or "permutation of p", so the window size is fixed and only letter counts matter.

**Complexity:** O(26 · n) time, which is O(n), and O(1) space for the two arrays.

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

**Example:** `s = "cbaebabacd", p = "abc"` returns `[0, 6]`.

**Pitfalls:** Drop `s[i - k]` only once `i >= k`, and record only once `i >= k - 1`. The 26-slot array assumes lowercase letters. Return early when `s` is shorter than `p`.

**Used in:** LC 438, LC 567

---

## 14. Sliding Window + Monotonic Deque

**Use when:** The problem needs the window's max or min at each step, as in "absolute difference at most limit" or "maximum of each window".

**Complexity:** O(n) time, since each index enters and leaves a deque at most once, and O(n) space in the worst case.

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

**Example:** `a = [8,2,4,7], limit = 4` returns `2`, from `[2,4]` or `[4,7]`.

**Pitfalls:** Store indices, so you can tell when the front has left the window. Compare `front()` to `left` before moving `left`. Popping equal values (`<=`, `>=`) is safe here, because the newer index stays in the window longer.

**Used in:** LC 239, LC 1425, LC 1438, LC 1696

---

## 15. Sliding Window + Multiset

**Use when:** The problem asks for the median or k-th value of each window, which a deque can't give you.

**Complexity:** O(n log k) for the inserts and erases, plus O(k) per `advance`, so O(nk) as written. Moving a saved iterator one step at a time brings it down to O(n log k). Space is O(k).

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

**Example:** `a = [1,3,-1,-3,5], k = 3` gives `*it` values `1, -1, -1`.

**Pitfalls:** `win.erase(value)` removes every copy, so use `erase(find(value))`. For an even `k`, `k / 2` gives the upper median, and the true median averages two middle values. Average in `double` or `long long` to avoid overflow.

**Used in:** LC 480, LC 1438

---

## 16. Sliding Window on Circular Array

**Use when:** The problem says "circular", or that the first and last elements are adjacent, and the window has a set size.

**Complexity:** O(n + k) time and O(1) space, because `% n` avoids doubling the array.

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

**Example:** `a = [5,1,2,6], k = 2` returns `11`, from the wrapped window `[6,5]`.

**Pitfalls:** Assumes `k <= n`, since a larger window would count elements twice. Start `best` at `LLONG_MIN` because sums can be negative. The loop ends at `n + k - 2`, which gives exactly `n` windows.

**Used in:** LC 1652, LC 2134

---

## 17. Multi-Pointer — 3Sum

**Use when:** The problem says "all triplets" or "unique" combinations that sum to a target.

**Complexity:** O(n²) time. Extra space is O(1) beyond the output and the sort.

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

**Example:** `a = [-1,0,1,2,-1,-4]` returns `[[-1,-1,2],[-1,0,1]]`.

**Pitfalls:** Compare the anchor with `a[i - 1]`, not `a[i + 1]`, or you lose answers like `[-1,-1,2]`. Skip inner duplicates only after recording a match. For 4Sum, sum into `long long`.

**Used in:** LC 15, LC 16, LC 18, LC 259

---

## 18. Two Pointers on Strings — Backspace Compare

**Use when:** The problem says "# means a backspace", or asks for O(1) space where later characters change earlier ones.

**Complexity:** O(n + m) time and O(1) space.

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

**Example:** `s = "ab#c", t = "ad#c"` returns `true`, and `s = "a#c", t = "b"` returns `false`.

**Pitfalls:** Scan from the right, because a `#` affects what comes before it. Keep looping while either index is valid, since the other string may have only erased characters left. Both indices must run out together for a match.

**Used in:** LC 844

---

## 19. Two Pointers on Linked Lists — Nth From End

**Use when:** The problem says "n-th node from the end", and you don't know the list's length.

**Complexity:** O(L) time for a list of length L, and O(1) space.

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

**Example:** `1 → 2 → 3 → 4 → 5, n = 2` returns `1 → 2 → 3 → 5`.

**Pitfalls:** Use the dummy so that removing the head needs no special case. Loop on `fast->next` so that `slow` stops just before the target. This doesn't `delete` the removed node, which real code may need to do.

**Used in:** LC 19, LC 61

---

## 20. Two Pointers + Binary Search

**Use when:** The data can be sorted and, for each element, you need the farthest partner that meets a condition.

**Complexity:** O(n log n) time and O(1) extra space.

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

**Example:** `a = [1,5,2,8,3], d = 2` returns `3`, from `[1,2,3]` after sorting.

**Pitfalls:** `upper_bound` returns one past the last match, so the count is `j - i` without a `+ 1`. The sort changes `a`, so copy it first if the caller needs the original order. Since `j` only grows with `i`, a second pointer would also work in O(n) after the sort.

**Used in:** LC 1498, LC 1818, LC 2300

---

## 21. Two Pointers + Greedy — Boats to Save People

**Use when:** The problem says "at most two per boat", or asks you to pair the extremes under a limit.

**Complexity:** O(n log n) time for the sort, plus O(n) for the pass. O(1) extra space.

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

**Example:** `people = [3,2,2,1], limit = 3` returns `3`.

**Pitfalls:** Use `l <= r`, or the last person never gets a boat. When `l == r`, the check adds one person to themselves, but `r--` still runs, so the count stays right. This greedy works only because a boat holds at most two people.

**Used in:** LC 881, LC 1877

---

## 22. Sliding Window + Prefix Sum — Subarray Sum Equals K

**Use when:** The problem says "subarray sum equals k" and values can be negative.

**Complexity:** O(n) expected time and O(n) space.

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

**Example:** `a = [1,-1,1,1], k = 1` returns `5`.

**Pitfalls:** Seed the map with `{0, 1}`, or you miss subarrays that start at index 0. Look up before inserting the current prefix, or `k = 0` counts empty subarrays. `seen[pref - k]` inserts missing keys, so use `find` if memory is tight.

**Used in:** LC 325, LC 560, LC 930, LC 1248

---

## 23. Sliding Window on Matrix — Best Row Band + 1D Window

**Use when:** The problem asks about rectangles in a grid, and fixing two rows turns each one into a 1D range.

**Complexity:** O(C) per band with this window, and O(R²C) overall when you try every row pair. Space is O(C).

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

**Example:** `colSum = [3,-1,4,2], k = 2` returns `6`, from `[4,2]`.

**Pitfalls:** Reset `colSum` for each new top row, and keep adding to it as the bottom row grows. Start `best` at `LLONG_MIN`. Check that `k` fits the width, because `best` stays at `LLONG_MIN` if `k > colSum.size()`. Loop the bands over the smaller dimension.

**Used in:** LC 363, LC 1074

---

## 24. Shrinkable vs Non-Shrinkable Templates

**Use when:** The problem says "shortest" or asks for a count, which needs the shrinkable form, or says "longest" and needs only the length, which allows the non-shrinkable form.

**Complexity:** Both are O(n) time, since `left` only moves forward. Space depends on the window state.

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
    if (windowInvalid()) {          // slide once: size never decreases
        remove(a[left++]);
    }
    best = max(best, right - left + 1);
}
```

**Example:** Shrinkable with `sum >= 7` on `[2,3,1,2,4,3]` gives `2`. Non-shrinkable with "at most one zero" on `[1,0,1,0,0,1,1]` gives `3`.

**Pitfalls:** Non-shrinkable windows can be invalid, so only their size is meaningful. They can't be used for counting subarrays. Using `if` on a shortest-window problem misses answers, because `left` must move as far as possible.

**Used in:** LC 3, LC 76, LC 209, LC 424, LC 1004

---

## Common Choose-What Pattern

**Use when:** You have just read a problem and need to decide on a pattern, before you pick a template.

**Complexity:** Most rows are O(n) after any sorting. The multiset row is O(n log k), and prefix sum plus hash map is O(n) with O(n) space.

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

**Example:** "Sorted array, two numbers add up to 9" matches the first row, so use opposite-direction pointers. "Longest substring with at most 2 distinct" matches the longest-window row.

**Pitfalls:** Check whether values can be negative before choosing a window, because negatives break it. "Exactly k" isn't directly slidable, so rewrite it first. Sliding Window Maximum belongs to the deque row, not the multiset row, even though both work.

**Used in:** LC 167, LC 11, LC 26, LC 141, LC 643, LC 3, LC 76, LC 992, LC 239, LC 480, LC 560, LC 438
