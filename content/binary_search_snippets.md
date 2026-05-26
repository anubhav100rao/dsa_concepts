## 1. Classic binary search: exact target

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

---

## 2. Lower bound: first index `>= target`

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

Example:

```cpp
// a = [1, 2, 4, 4, 5], target = 4
// returns 2
```

---

## 3. Upper bound: first index `> target`

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

Example:

```cpp
// a = [1, 2, 4, 4, 5], target = 4
// returns 4
```

---

## 4. Last index `< target`

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

---

## 5. Last index `<= target`

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

---

## 6. First true in monotonic predicate

Use when pattern is:

```cpp
false false false true true true
```

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

---

## 7. Last true in monotonic predicate

Pattern:

```cpp
true true true false false false
```

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

---

## 8. Binary search on answer: minimum feasible answer

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

---

## 9. Binary search on answer: maximum feasible answer

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

Example:

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

---

## 10. Search in rotated sorted array

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

---

## 11. Find minimum in rotated sorted array

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

---

## 12. Peak element

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

---

## 13. Square root using binary search

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

---

## 14. Floating point binary search

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

---

## 15. Binary search in 2D matrix

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

---

## 16. First and last occurrence

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

---

## 17. Count occurrences

```cpp
int countOccurrences(vector<int>& a, int target) {
    int left = lowerBound(a, target);
    int right = upperBound(a, target);

    return right - left;
}
```

---

## 18. STL equivalent

```cpp
int lb = lower_bound(a.begin(), a.end(), target) - a.begin();
int ub = upper_bound(a.begin(), a.end(), target) - a.begin();

bool exists = binary_search(a.begin(), a.end(), target);

auto it = lower_bound(a.begin(), a.end(), target);
```

---

## Mental template

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
