## 1. Classic binary search: exact target

**Use when:** The array is sorted and you need the position of one exact value, with any match accepted.

**Complexity:** O(log n) time, O(1) space.

```cpp
int binarySearch(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (a[mid] == target) return mid;
        else if (a[mid] < target) l = mid + 1;
        else r = mid - 1;
    }

    return -1;
}
```

**Example:** `a = [-1, 0, 3, 5, 9, 12]`: `target = 9` returns `4`, and `target = 2` returns `-1`.

**Pitfalls:** With `l <= r`, both moves must step past `mid`, or the loop can run forever. On a miss, `l` ends at the insertion point. With duplicates, the index you get can be any of the matches.

**Used in:** LC 704, LC 374, LC 702, LC 1064

---

## 2. Lower bound: first index `>= target`

**Use when:** You need the first position of a value in sorted data, the insert position, or the count of values below it.

**Complexity:** O(log n) time, O(1) space.

```cpp
int lowerBound(vector<int>& a, int target) {
    int l = 0, r = a.size(); // [l, r)

    while (l < r) {
        int mid = l + (r - l) / 2;

        if (a[mid] >= target) r = mid;
        else l = mid + 1;
    }

    return l;
}
```

**Example:**

```cpp
// a = [1, 2, 4, 4, 5], target = 4
// returns 2
```

**Pitfalls:** The result can be `a.size()`, so check it before reading `a[l]`. The result doesn't prove the target exists: compare `a[l]` with it. `r` must start at `a.size()`, not `a.size() - 1`.

**Used in:** LC 35, LC 34, LC 528, LC 2300, LC 300, LC 1818

---

## 3. Upper bound: first index `> target`

**Use when:** You need the first value strictly above x, the count of values `<= x`, or one past the last copy of x.

**Complexity:** O(log n) time, O(1) space.

```cpp
int upperBound(vector<int>& a, int target) {
    int l = 0, r = a.size(); // [l, r)

    while (l < r) {
        int mid = l + (r - l) / 2;

        if (a[mid] > target) r = mid;
        else l = mid + 1;
    }

    return l;
}
```

**Example:**

```cpp
// a = [1, 2, 4, 4, 5], target = 4
// returns 4
```

**Pitfalls:** The only change from lower bound is `>` instead of `>=`, and swapping them shifts the result by the whole run of duplicates. The result can be `a.size()`.

**Used in:** LC 744, LC 34, LC 2389, LC 981, LC 1964

---

## 4. Last index `< target`

**Use when:** You need the nearest element strictly below x, such as the left neighbor of an insert position.

**Complexity:** O(log n) time, O(1) space.

```cpp
int lastLessThan(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    int ans = -1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (a[mid] < target) {
            ans = mid;
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return ans;
}
```

**Example:** `a = [1, 2, 4, 4, 5]`: `target = 4` returns `1`, and `target = 1` returns `-1`.

**Pitfalls:** `-1` means every element is `>= target`, so check it before indexing. This equals `lowerBound(a, target) - 1`.

**Used in:** LC 1818, LC 1539, LC 1060

---

## 5. Last index `<= target`

**Use when:** You need the latest entry at or before x, such as the value at the largest timestamp `<= t`.

**Complexity:** O(log n) time, O(1) space.

```cpp
int lastLessOrEqual(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    int ans = -1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (a[mid] <= target) {
            ans = mid;
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return ans;
}
```

**Example:** `a = [1, 2, 4, 4, 5]`: `target = 4` returns `3`, and `target = 0` returns `-1`.

**Pitfalls:** `-1` means every element is above the target, which must become an "empty" answer. With duplicates, this returns the last copy. This equals `upperBound(a, target) - 1`.

**Used in:** LC 981, LC 1146, LC 911, LC 1235, LC 2055, LC 2389

---

## 6. First true in monotonic predicate

**Use when:** the answer is where a yes/no `check` flips from false to true, in this shape:

```cpp
false false false true true true
```

**Complexity:** O(log n) calls to `check`, so O(C log n) time for a check that costs C. O(1) space.

```cpp
int firstTrue(int n) {
    int l = 0, r = n - 1;
    int ans = n;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (check(mid)) {
            ans = mid;
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }

    return ans;
}
```

Example usage:

```cpp
bool check(int x) {
    return x * x >= 30;
}
```

**Example:** With the `check` below and `n = 10`, the result is `6`, since `5 * 5 = 25 < 30` and `6 * 6 = 36 >= 30`.

**Pitfalls:** `n` means no index passed, so test for it. `check` must flip exactly once, or the answer is meaningless. `x * x` overflows `int` for large x.

**Used in:** LC 278, LC 378, LC 668, LC 719

---

## 7. Last true in monotonic predicate

**Use when:** the answer is the last value where a yes/no `check` still holds, in this shape:

```cpp
true true true false false false
```

**Complexity:** O(log n) calls to `check`, so O(C log n) time for a check that costs C. O(1) space.

```cpp
int lastTrue(int n) {
    int l = 0, r = n - 1;
    int ans = -1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (check(mid)) {
            ans = mid;
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return ans;
}
```

**Example:** With `check(x) = x * x <= 30` and `n = 10`, the result is `5`, since `25 <= 30` and `36 > 30`.

**Pitfalls:** `-1` means no index passed, so test for it. Keep the `ans` variable: without it, the `lo = mid` form needs `mid` rounded up to avoid an infinite loop.

**Used in:** LC 69, LC 441, LC 1898, LC 1044

---

## 8. Binary search on answer: minimum feasible answer

**Use when:** "Minimize the maximum", or "the smallest capacity, speed or day that works", where larger values always work too.

**Complexity:** O(C log R) time, where R is `high - low` and C is the cost of `can`, usually O(n). O(1) space.

Very common in interview problems.

Examples:

- Minimum capacity to ship packages
- Minimum eating speed
- Minimum days to make bouquets
- Allocate books
- Split array largest sum

```cpp
int solve() {
    int l = low, r = high;
    int ans = high;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (can(mid)) {
            ans = mid;
            r = mid - 1; // try smaller answer
        } else {
            l = mid + 1;
        }
    }

    return ans;
}
```

Example `can`:

```cpp
bool can(int capacity) {
    int days = 1;
    int current = 0;

    for (int w : weights) {
        if (w > capacity) return false;

        if (current + w > capacity) {
            days++;
            current = 0;
        }

        current += w;
    }

    return days <= D;
}
```

**Example:** LC 1011 with `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` and `D = 5`: with `low = 10` and `high = 55`, the result is `15`.

**Pitfalls:** `ans = high` assumes `high` always works, so `can` must accept it, or you need a "no answer" check. `low` must be at least the largest single item. Use `long long` if `high` can pass 2^31, as `int` here would overflow.

**Used in:** LC 1011, LC 875, LC 1482, LC 410, LC 2187, LC 1631, LC 778

---

## 9. Binary search on answer: maximum feasible answer

**Use when:** "Maximize the minimum", or "the largest distance, size or time that still works", where smaller values always work too.

**Complexity:** O(C log R) time, where R is `high - low` and C is the cost of `can`, usually O(n). Sorting adds O(n log n). O(1) extra space.

Examples:

- Aggressive cows
- Max minimum distance
- Maximum candies per child
- Rope cutting

```cpp
int solve() {
    int l = low, r = high;
    int ans = low;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (can(mid)) {
            ans = mid;
            l = mid + 1; // try bigger answer
        } else {
            r = mid - 1;
        }
    }

    return ans;
}
```

Example `can`:

```cpp
bool can(int dist) {
    int count = 1;
    int last = positions[0];

    for (int i = 1; i < positions.size(); i++) {
        if (positions[i] - last >= dist) {
            count++;
            last = positions[i];
        }
    }

    return count >= cows;
}
```

**Example:** Aggressive Cows with `positions = [1, 2, 4, 8, 9]` and `cows = 3`: with `low = 1` and `high = 8`, the result is `3`, from cows at 1, 4 and 8.

**Pitfalls:** Sort `positions` before calling `can`, because the greedy scan assumes sorted order. `ans = low` assumes `low` always works.

**Used in:** LC 1552, LC 2226, LC 1891, LC 2517, LC 2141, LC 2528

---

## 10. Search in rotated sorted array

**Use when:** A sorted array was rotated at an unknown pivot, and you need the index of one value.

**Complexity:** O(log n) time, O(1) space. Duplicates make the worst case O(n).

```cpp
int searchRotated(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        if (a[mid] == target) return mid;

        if (a[l] <= a[mid]) {
            // left side sorted
            if (a[l] <= target && target < a[mid]) {
                r = mid - 1;
            } else {
                l = mid + 1;
            }
        } else {
            // right side sorted
            if (a[mid] < target && target <= a[r]) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
    }

    return -1;
}
```

**Example:** `a = [4, 5, 6, 7, 0, 1, 2]`: `target = 0` returns `4`, and `target = 3` returns `-1`.

**Pitfalls:** `a[l] <= a[mid]` must allow equality, for when `l == mid`. This code assumes distinct values: for LC 81, when `a[l] == a[mid] == a[r]`, shrink both ends first.

**Used in:** LC 33, LC 81

---

## 11. Find minimum in rotated sorted array

**Use when:** You need the smallest value or the pivot of a rotated sorted array, or how many times it was rotated.

**Complexity:** O(log n) time, O(1) space. Duplicates make the worst case O(n).

```cpp
int findMin(vector<int>& a) {
    int l = 0, r = a.size() - 1;

    while (l < r) {
        int mid = l + (r - l) / 2;

        if (a[mid] > a[r]) {
            l = mid + 1;
        } else {
            r = mid;
        }
    }

    return a[l];
}
```

**Example:** `a = [3, 4, 5, 1, 2]` returns `1`. The minimum is at index 3, which is also the rotation count.

**Pitfalls:** Compare with `a[r]`, not `a[l]`, because comparing with `a[l]` fails on an unrotated array. For LC 154, `a[mid] == a[r]` says nothing, so `r--` is the safe move there.

**Used in:** LC 153, LC 154

---

## 12. Peak element

**Use when:** "Return any peak", or a mountain array: no global order, but the slope at `mid` shows which side to keep.

**Complexity:** O(log n) time, O(1) space.

```cpp
int findPeakElement(vector<int>& a) {
    int l = 0, r = a.size() - 1;

    while (l < r) {
        int mid = l + (r - l) / 2;

        if (a[mid] < a[mid + 1]) {
            l = mid + 1;
        } else {
            r = mid;
        }
    }

    return l;
}
```

**Example:** `a = [1, 2, 1, 3, 5, 6, 4]` returns `5` (value 6). Index 1 is also a valid peak, but this code ends on 5.

**Pitfalls:** Keep `l < r`, so `a[mid + 1]` stays in range. The logic relies on adjacent elements being different. This finds a peak, not the highest one.

**Used in:** LC 162, LC 852, LC 1095

---

## 13. Square root using binary search

**Use when:** "Integer square root without built-ins", or any "last x with f(x) <= n" over a fast-growing function.

**Complexity:** O(log x) time, O(1) space.

```cpp
int mySqrt(int x) {
    int l = 0, r = x;
    int ans = 0;

    while (l <= r) {
        long long mid = l + (r - l) / 2;

        if (mid * mid <= x) {
            ans = mid;
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return ans;
}
```

**Example:** `x = 8` returns `2`, and `x = 16` returns `4`.

**Pitfalls:** `mid * mid` overflows `int`, which is why `mid` is `long long`. The result rounds down.

**Used in:** LC 69, LC 367, LC 441

---

## 14. Floating point binary search

**Use when:** The answer is a real number accepted within a tolerance, such as "within 10^-5".

**Complexity:** O(C log(R / eps)) time for the `eps` version, and O(100 C) for the fixed-count one, where C is the cost of `check`. O(1) space.

```cpp
double binarySearchDouble(double low, double high) {
    double eps = 1e-7;

    while (high - low > eps) {
        double mid = low + (high - low) / 2.0;

        if (check(mid)) {
            high = mid;
        } else {
            low = mid;
        }
    }

    return high;
}
```

Alternative fixed iterations:

```cpp
double binarySearchDouble(double low, double high) {
    for (int i = 0; i < 100; i++) {
        double mid = low + (high - low) / 2.0;

        if (check(mid)) {
            high = mid;
        } else {
            low = mid;
        }
    }

    return high;
}
```

**Example:** With `check(x) = x * x >= 2`, `low = 0` and `high = 2`, the result is about `1.41421`.

**Pitfalls:** Never loop on `low < high`. An `eps` that is too small for the size of the values can hang, because the doubles stop changing, so the fixed count is safer. Moves are `low = mid` and `high = mid`, never with `+ 1`.

**Used in:** LC 774, LC 644, LC 2137

---

## 15. Binary search in 2D matrix

**Use when:** Each row continues where the last one ended ("the first integer of each row is greater than the last of the previous row").

**Complexity:** O(log(mn)) time, O(1) space.

Matrix sorted row-wise and globally:

```cpp
bool searchMatrix(vector<vector<int>>& mat, int target) {
    int m = mat.size();
    int n = mat[0].size();

    int l = 0, r = m * n - 1;

    while (l <= r) {
        int mid = l + (r - l) / 2;

        int row = mid / n;
        int col = mid % n;

        if (mat[row][col] == target) return true;
        else if (mat[row][col] < target) l = mid + 1;
        else r = mid - 1;
    }

    return false;
}
```

**Example:** `mat = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]`: `target = 3` returns `true`, and `target = 13` returns `false`.

**Pitfalls:** Divide by the column count: `row = mid / n`, with `n` the number of columns. This doesn't work if rows and columns are only sorted separately (LC 240), which needs a staircase walk from a corner. `mat[0]` needs a non-empty matrix.

**Used in:** LC 74

---

## 16. First and last occurrence

**Use when:** "Find the starting and ending position" of a value in a sorted array with duplicates.

**Complexity:** O(log n) time for the two searches, O(1) space.

```cpp
pair<int, int> firstLast(vector<int>& a, int target) {
    int first = lowerBound(a, target);
    int last = upperBound(a, target) - 1;

    if (first == a.size() || a[first] != target) {
        return {-1, -1};
    }

    return {first, last};
}
```

**Example:** `a = [5, 7, 7, 8, 8, 10]`: `target = 8` returns `{3, 4}`, and `target = 6` returns `{-1, -1}`.

**Pitfalls:** Uses `lowerBound` and `upperBound` from sections 2 and 3. Check `first == a.size()` before reading `a[first]`.

**Used in:** LC 34

---

## 17. Count occurrences

**Use when:** "How many times does x appear" in sorted data, including on sorted position lists for range frequency queries.

**Complexity:** O(log n) time, O(1) space.

```cpp
int countOccurrences(vector<int>& a, int target) {
    int left = lowerBound(a, target);
    int right = upperBound(a, target);

    return right - left;
}
```

**Example:** `a = [1, 2, 4, 4, 5]`: `target = 4` returns `2`, and `target = 6` returns `0`.

**Pitfalls:** Uses `lowerBound` and `upperBound` from sections 2 and 3. A missing value gives `0` on its own, with no special case. The array must be sorted.

**Used in:** LC 2080, LC 1157

---

## 18. STL equivalent

**Use when:** The problem is a plain bound lookup and writing the loop by hand would add risk.

**Complexity:** O(log n) time on random-access containers, O(1) space.

```cpp
int lb = lower_bound(a.begin(), a.end(), target) - a.begin();
int ub = upper_bound(a.begin(), a.end(), target) - a.begin();

bool exists = binary_search(a.begin(), a.end(), target);

auto it = lower_bound(a.begin(), a.end(), target);
```

**Example:** `a = [1, 2, 4, 4, 5]`, `target = 4`: `lb = 2`, `ub = 4` and `exists = true`.

**Pitfalls:** On `std::set` or `std::map`, call the member `s.lower_bound(x)`: the free function degrades to O(n) there. Check the iterator against `end()` before reading it.

**Used in:** LC 35, LC 34, LC 2300, LC 2389, LC 300, LC 1268

---

## Mental template

**Use when:** You can state the problem as "find the smallest or largest value for which `can` is true".

**Complexity:** O(C log R) time, where R is the size of the search range and C is the cost of `can`. O(1) space.

```cpp
// Minimum valid answer
if (can(mid)) {
    ans = mid;
    r = mid - 1;
} else {
    l = mid + 1;
}
```

```cpp
// Maximum valid answer
if (can(mid)) {
    ans = mid;
    l = mid + 1;
} else {
    r = mid - 1;
}
```

Most interview binary search problems are just:

```cpp
find first true
```

or

```cpp
find last true
```

**Example:** Minimum form on LC 875 with `piles = [3, 6, 7, 11]` and `h = 8` gives `4`. Maximum form on LC 1552 with `position = [1, 2, 3, 4, 7]` and `m = 3` gives `3`.

**Pitfalls:** Both forms use `l <= r` and save the answer in `ans`, so `mid` never needs rounding up. They only apply if `can` flips once, so check that first.

**Used in:** LC 410, LC 875, LC 1011, LC 1552, LC 2226
