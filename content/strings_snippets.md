## 1. Basic string traversal

**Use when:** You must look at every character once, in order, as in "count", "convert" or "check each character".

**Complexity:** O(n) time and O(1) extra space.

```cpp
for (char c : s) {
    // use c
}

for (int i = 0; i < s.size(); i++) {
    // use s[i]
}
```

**Example:** `s = "abc"` visits `a`, `b`, `c` in that order.

**Pitfalls:** `s.size()` is unsigned, so `i <= s.size() - 1` wraps around on an empty string. Use `i < s.size()`. Write `char& c` if the loop needs to change the string.

**Used in:** LC 58, LC 657, LC 709

---

## 2. Frequency count

**Use when:** The problem says "how many times", "first unique" or "most common", and the order of characters doesn't matter.

**Complexity:** O(n) time and O(alphabet) space, which is effectively O(1).

### Lowercase letters

```cpp
vector<int> freq(26, 0);

for (char c : s) {
    freq[c - 'a']++;
}
```

### All ASCII chars

```cpp
vector<int> freq(256, 0);

for (char c : s) {
    freq[c]++;
}
```

**Example:** `s = "aab"` gives `freq['a' - 'a'] = 2` and `freq['b' - 'a'] = 1`.

**Pitfalls:** `c - 'a'` is out of bounds on uppercase letters, digits or spaces, so read the constraints. `char` can be signed, so a non-ASCII byte makes `freq[c]` a negative index.

**Used in:** LC 242, LC 383, LC 387, LC 451, LC 1207

---

## 3. Check anagram

**Use when:** Two strings must contain the same letters the same number of times, as in "rearrange" or "using all the letters".

**Complexity:** O(n) time and O(1) space for the 26 counters.

```cpp
bool isAnagram(string a, string b) {
    if (a.size() != b.size()) return false;

    vector<int> freq(26, 0);

    for (char c : a) freq[c - 'a']++;
    for (char c : b) freq[c - 'a']--;

    for (int x : freq) {
        if (x != 0) return false;
    }

    return true;
}
```

**Example:** `a = "listen", b = "silent"` returns `true`; `a = "rat", b = "car"` returns `false`.

**Pitfalls:** This version assumes lowercase letters, so uppercase or Unicode input indexes outside the array; switch to a map for those. The size check is only an early exit, because the final loop would catch the difference anyway.

**Used in:** LC 242, LC 438, LC 567

---

## 4. Reverse string

**Use when:** The problem asks to reverse the whole string or one known range in place.

**Complexity:** O(n) time for n reversed characters, and O(1) extra space.

```cpp
reverse(s.begin(), s.end());
```

### Reverse substring

```cpp
reverse(s.begin() + l, s.begin() + r + 1);
```

**Example:** `s = "hello"` becomes `"olleh"`; with `l = 1, r = 3` it becomes `"hlleo"`.

**Pitfalls:** The end iterator is exclusive, so reversing the inclusive range `[l, r]` needs `s.begin() + r + 1`. Forgetting the `+ 1` leaves the last character in place.

**Used in:** LC 344, LC 541, LC 557

---

## 5. Palindrome check

**Use when:** You must check whether one given string reads the same in both directions.

**Complexity:** O(n) time and O(1) space, though the by-value parameter copies the string.

```cpp
bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;

    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }

    return true;
}
```

**Example:** `"racecar"` returns `true`; `"abca"` returns `false`.

**Pitfalls:** Empty and single-character strings are palindromes, and `l < r` handles both. Keep `r` as a signed `int`: as `size_t`, `s.size() - 1` wraps on an empty string and `l < r` reads out of bounds.

**Used in:** LC 680, LC 2108

---

## 6. Two-pointer valid palindrome ignoring non-alphanumeric

**Use when:** A palindrome check must ignore case, spaces and punctuation.

**Complexity:** O(n) time, since each pointer only moves inward. O(1) extra space.

```cpp
bool isValidPalindrome(string s) {
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

**Example:** `"A man, a plan, a canal: Panama"` returns `true`; `"race a car"` returns `false`.

**Pitfalls:** The inner loops need `l < r` too, or `",,,"` runs out of bounds. Compare with `tolower` on both sides, so `A` matches `a`.

**Used in:** LC 125

---

## 7. Remove spaces

**Use when:** Spaces carry no meaning and should go before further processing, as in an expression parser.

**Complexity:** O(n) time and O(n) space for the new string.

```cpp
string res;

for (char c : s) {
    if (c != ' ') res += c;
}
```

**Example:** `s = "a b  c"` gives `res = "abc"`.

**Pitfalls:** Only `' '` is removed, so tabs and newlines stay; use `isspace` for those. Erasing in place inside a loop is O(n^2), which this approach avoids.

**Used in:** LC 224, LC 227

---

## 8. Split string by space

**Use when:** Input is words separated by any number of spaces, and you need the words themselves.

**Complexity:** O(n) time and O(n) space.

```cpp
stringstream ss(s);
string word;
vector<string> words;

while (ss >> word) {
    words.push_back(word);
}
```

**Example:** `s = "  the sky  "` gives `{"the", "sky"}`.

**Pitfalls:** `>>` skips all runs of whitespace, so empty fields disappear. That helps LC 151, but it is wrong when empty fields matter; use a custom split then. Requires `<sstream>`.

**Used in:** LC 58, LC 151, LC 290, LC 557, LC 648

---

## 9. Split by custom delimiter

**Use when:** Fields are separated by one specific character, such as `.` in versions or `/` in paths.

**Complexity:** O(n) time and O(n) space.

```cpp
vector<string> split(string s, char delimiter) {
    vector<string> parts;
    string cur;

    for (char c : s) {
        if (c == delimiter) {
            parts.push_back(cur);
            cur.clear();
        } else {
            cur += c;
        }
    }

    parts.push_back(cur);
    return parts;
}
```

**Example:** `split("a/b//c", '/')` gives `{"a", "b", "", "c"}`.

**Pitfalls:** It keeps empty fields, so `"/a"` starts with `""` and `""` gives `{""}`. Skip empties if the caller wants them gone, as LC 71 does. The final `push_back` after the loop is what catches the last field.

**Used in:** LC 71, LC 165

---

## 10. Join strings

**Use when:** Parts must be glued back together with a separator between them, but not after the last one.

**Complexity:** O(total length) time and space, as `+=` is amortized O(1) per character.

```cpp
string join(vector<string>& words, string sep) {
    string res;

    for (int i = 0; i < words.size(); i++) {
        if (i > 0) res += sep;
        res += words[i];
    }

    return res;
}
```

**Example:** `join({"a", "b", "c"}, ", ")` returns `"a, b, c"`.

**Pitfalls:** The `i > 0` check avoids a trailing separator. An empty list returns `""`. `res = res + x` in a loop would copy the string every time, so stay with `+=`.

**Used in:** LC 71, LC 151, LC 557, LC 648

---

## 11. Substring

**Use when:** You need a real copy of a range, typically for a hash key, a comparison or an answer.

**Complexity:** O(length) time and space per call, which is easy to miss inside a loop.

```cpp
string sub = s.substr(start, length);
```

Example:

```cpp
string sub = s.substr(i, j - i + 1);
```

**Example:** `s = "abcdef"`: `s.substr(1, 3)` is `"bcd"`; with `i = 1, j = 3`, `s.substr(i, j - i + 1)` is also `"bcd"`.

**Pitfalls:** The second argument is a length, not an end index, unlike Java and Python. `start > s.size()` throws `out_of_range`, and calling it in a nested loop adds a factor of n. `string_view` avoids the copy.

**Used in:** LC 93, LC 459, LC 1316

---

## 12. Find substring

**Use when:** You need a quick "is this piece in there, and where?" and the inputs are small.

**Complexity:** Usually fast in practice, but O(n * m) in the worst case, with O(1) space. Use KMP when the worst case matters.

```cpp
int pos = s.find(pattern);

if (pos != string::npos) {
    // found at pos
}
```

**Example:** `s = "hello", pattern = "ll"` gives `pos = 2`; `pattern = "xy"` gives `string::npos`.

**Pitfalls:** `find` returns `size_t`. Storing it in `int` only works because `-1` converts back to `npos`, so prefer `size_t` or `auto`. Pass a start position, as in `s.find(pattern, pos + 1)`, to find later matches.

**Used in:** LC 28, LC 459, LC 1408

---

## 13. Count vowels

**Use when:** The problem tests membership in a small fixed set of characters, such as vowels.

**Complexity:** O(n) time and O(1) space.

```cpp
bool isVowel(char c) {
    c = tolower(c);
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int count = 0;

for (char c : s) {
    if (isVowel(c)) count++;
}
```

**Example:** `s = "Education"` gives `count = 5`.

**Pitfalls:** Lowercase first, or capital vowels are missed. Check whether the problem counts `y` and whether it wants a total or a per-window count (LC 1456 keeps a running count instead of recounting).

**Used in:** LC 345, LC 1456

---

## 14. Sliding window — longest substring without repeating chars

**Use when:** The problem asks for the "longest substring without repeating characters", or any window that must stay duplicate-free.

**Complexity:** O(n) time, with O(1) space for the 256 slots.

```cpp
int longestUniqueSubstring(string s) {
    vector<int> last(256, -1);
    int left = 0, ans = 0;

    for (int right = 0; right < s.size(); right++) {
        if (last[s[right]] >= left) {
            left = last[s[right]] + 1;
        }

        last[s[right]] = right;
        ans = max(ans, right - left + 1);
    }

    return ans;
}
```

**Example:** `"abcabcbb"` returns `3`; `"abba"` returns `2`.

**Pitfalls:** The `last[s[right]] >= left` check is the classic bug: without it, the last `a` in `"abba"` moves `left` backward. Use `right - left + 1` for the length, with the `+ 1`.

**Used in:** LC 3, LC 1695

---

## 15. Sliding window — minimum window substring

**Use when:** The problem asks for the "smallest substring containing all characters of t", including duplicates.

**Complexity:** O(n + m) time, as each index enters and leaves the window once. O(1) space for the 128 counters.

```cpp
string minWindow(string s, string t) {
    vector<int> need(128, 0);

    for (char c : t) need[c]++;

    int required = t.size();
    int left = 0;
    int bestLen = INT_MAX;
    int bestStart = 0;

    for (int right = 0; right < s.size(); right++) {
        if (need[s[right]] > 0) required--;
        need[s[right]]--;

        while (required == 0) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestStart = left;
            }

            need[s[left]]++;

            if (need[s[left]] > 0) required++;

            left++;
        }
    }

    return bestLen == INT_MAX ? "" : s.substr(bestStart, bestLen);
}
```

**Example:** `s = "ADOBECODEBANC", t = "ABC"` returns `"BANC"`; `s = "a", t = "aa"` returns `""`.

**Pitfalls:** Record the best window inside the `while` loop, before shrinking. Negative `need` values mean surplus copies, so `required` changes only when a count crosses zero. Return `""` when `bestLen` was never updated.

**Used in:** LC 76

---

## 16. Expand around center — longest palindromic substring

**Use when:** The problem asks for the "longest palindromic substring" and n is at most a few thousand.

**Complexity:** O(n^2) time and O(1) extra space.

```cpp
string longestPalindrome(string s) {
    int start = 0, bestLen = 1;

    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.size() && s[l] == s[r]) {
            l--;
            r++;
        }

        int len = r - l - 1;

        if (len > bestLen) {
            bestLen = len;
            start = l + 1;
        }
    };

    for (int i = 0; i < s.size(); i++) {
        expand(i, i);       // odd length
        expand(i, i + 1);   // even length
    }

    return s.substr(start, bestLen);
}
```

**Example:** `"babad"` returns `"bab"`; `"cbbd"` returns `"bb"`.

**Pitfalls:** Run both `expand(i, i)` and `expand(i, i + 1)`, or even lengths are missed. The loop ends one step past the palindrome on each side, so the length is `r - l - 1` and the start is `l + 1`.

**Used in:** LC 5, LC 647

---

## 17. KMP prefix function / LPS array

**Use when:** You need the "longest prefix that is also a suffix", a string's period, or the failure table for KMP.

**Complexity:** O(m) time and O(m) space.

```cpp
vector<int> computeLPS(string pattern) {
    int n = pattern.size();
    vector<int> lps(n, 0);

    int len = 0;
    int i = 1;

    while (i < n) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}
```

**Example:** `"aabaaab"` gives `[0, 1, 0, 1, 2, 2, 3]`.

**Pitfalls:** Don't advance `i` when falling back to `len = lps[len - 1]`, because the same character must be tried against the shorter border. The prefix must be proper, so `i` starts at 1 and `lps[0]` stays 0.

**Used in:** LC 28, LC 214, LC 459, LC 1392

---

## 18. KMP string matching

**Use when:** You need every occurrence of one pattern in a text with a guaranteed linear time, as in "all indices where a occurs".

**Complexity:** O(n + m) time and O(m) space.

```cpp
vector<int> kmpSearch(string text, string pattern) {
    vector<int> lps = computeLPS(pattern);
    vector<int> positions;

    int i = 0, j = 0;

    while (i < text.size()) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }

        if (j == pattern.size()) {
            positions.push_back(i - j);
            j = lps[j - 1];
        } else if (i < text.size() && text[i] != pattern[j]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return positions;
}
```

**Example:** `text = "ababa", pattern = "aba"` returns `[0, 2]`, including the overlap.

**Pitfalls:** An empty pattern reads `lps[-1]`, so guard against it first. After a match, set `j = lps[j - 1]` rather than `0`, or overlapping matches are lost. Needs `computeLPS` from the previous section.

**Used in:** LC 28, LC 3006, LC 3008

---

## 19. Rabin-Karp rolling hash

**Use when:** You compare one window against a pattern while sliding, or need many same-length comparisons at low cost.

**Complexity:** O(n + m) expected time, and O(n * m) if most positions need a verification. O(1) extra space, excluding the answer.

```cpp
vector<int> rabinKarp(string text, string pattern) {
    const long long mod = 1e9 + 7;
    const long long base = 31;

    int n = text.size(), m = pattern.size();
    vector<int> ans;

    if (m > n) return ans;

    long long patternHash = 0;
    long long textHash = 0;
    long long power = 1;

    for (int i = 0; i < m; i++) {
        patternHash = (patternHash * base + pattern[i]) % mod;
        textHash = (textHash * base + text[i]) % mod;

        if (i > 0) power = (power * base) % mod;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patternHash == textHash) {
            if (text.substr(i, m) == pattern) {
                ans.push_back(i);
            }
        }

        if (i < n - m) {
            textHash = (textHash - text[i] * power % mod + mod) % mod;
            textHash = (textHash * base + text[i + m]) % mod;
        }
    }

    return ans;
}
```

**Example:** `text = "abcabc", pattern = "bc"` returns `[1, 4]`.

**Pitfalls:** Equal hashes are only probable, so keep the `substr` check. Add `mod` after subtracting, or the hash goes negative. `power` must be `base^(m - 1)`, which is why it skips the first iteration.

**Used in:** LC 28, LC 1316

---

## 20. Z-function

**Use when:** You need the longest match between each suffix and the whole string, as in "longest common prefix of each suffix with s".

**Complexity:** O(n) time and O(n) space.

Useful for pattern matching and string borders.

```cpp
vector<int> zFunction(string s) {
    int n = s.size();
    vector<int> z(n, 0);

    int l = 0, r = 0;

    for (int i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = min(r - i + 1, z[i - l]);
        }

        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }

        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }

    return z;
}
```

**Example:** `"aabxaab"` gives `[0, 1, 0, 0, 3, 1, 0]`.

**Pitfalls:** `z[0]` is left at 0 here, though some problems define it as n, as LC 2223 does when summing scores. The box `[l, r]` is inclusive, so the reuse bound is `r - i + 1`.

**Used in:** LC 214, LC 2223

---

## 21. Pattern matching using Z-function

**Use when:** You want pattern search with a single array and no separate failure table, or Z-values are already in play.

**Complexity:** O(n + m) time and O(n + m) space.

```cpp
vector<int> zSearch(string text, string pattern) {
    string combined = pattern + "$" + text;
    vector<int> z = zFunction(combined);

    vector<int> ans;
    int m = pattern.size();

    for (int i = m + 1; i < combined.size(); i++) {
        if (z[i] == m) {
            ans.push_back(i - m - 1);
        }
    }

    return ans;
}
```

**Example:** `text = "abcabc", pattern = "abc"` returns `[0, 3]`.

**Pitfalls:** The `$` must not occur in either string, or `z` can exceed `m` and matches get missed by the `== m` test. Subtract `m + 1` to convert back to a text index. Needs `zFunction` from the previous section.

**Used in:** LC 28, LC 3008

---

## 22. Manacher’s algorithm — longest palindrome in O(n)

**Use when:** The problem needs palindrome radii for all centers at n around 10^5, where O(n^2) expansion is too slow.

**Complexity:** O(n) time and O(n) space.

```cpp
string manacher(string s) {
    string t = "#";

    for (char c : s) {
        t += c;
        t += "#";
    }

    int n = t.size();
    vector<int> p(n, 0);

    int center = 0, right = 0;
    int bestCenter = 0, bestLen = 0;

    for (int i = 0; i < n; i++) {
        int mirror = 2 * center - i;

        if (i < right) {
            p[i] = min(right - i, p[mirror]);
        }

        int a = i + p[i] + 1;
        int b = i - p[i] - 1;

        while (a < n && b >= 0 && t[a] == t[b]) {
            p[i]++;
            a++;
            b--;
        }

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }

        if (p[i] > bestLen) {
            bestLen = p[i];
            bestCenter = i;
        }
    }

    int start = (bestCenter - bestLen) / 2;
    return s.substr(start, bestLen);
}
```

**Example:** `"babad"` returns `"bab"`; `"cbbd"` returns `"bb"`.

**Pitfalls:** The `#` padding makes all palindromes odd in `t`, and then `p[i]` equals the palindrome's length in `s`. The original start is `(bestCenter - bestLen) / 2`. Ties keep the first center, since `p[i] > bestLen` is strict.

**Used in:** LC 5, LC 647, LC 1960

---

## 23. Trie

**Use when:** The problem has many words and asks about prefixes, as in "starts with" or "suggest words as the user types".

**Complexity:** O(L) time per operation, for a word of length L. O(total characters * 26) space.

```cpp
struct TrieNode {
    TrieNode* child[26];
    bool isEnd;

    TrieNode() {
        isEnd = false;
        for (int i = 0; i < 26; i++) {
            child[i] = nullptr;
        }
    }
};

class Trie {
public:
    TrieNode* root;

    Trie() {
        root = new TrieNode();
    }

    void insert(string word) {
        TrieNode* node = root;

        for (char c : word) {
            int idx = c - 'a';

            if (!node->child[idx]) {
                node->child[idx] = new TrieNode();
            }

            node = node->child[idx];
        }

        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = root;

        for (char c : word) {
            int idx = c - 'a';

            if (!node->child[idx]) return false;

            node = node->child[idx];
        }

        return node->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;

        for (char c : prefix) {
            int idx = c - 'a';

            if (!node->child[idx]) return false;

            node = node->child[idx];
        }

        return true;
    }
};
```

**Example:** After `insert("apple")`: `search("app")` is `false`, `startsWith("app")` is `true`, and `search("apple")` is `true`.

**Pitfalls:** `search` must return `node->isEnd`, or every prefix counts as a word. Nodes are never freed, which is fine for interviews but a leak in production. `c - 'a'` assumes lowercase input.

**Used in:** LC 208, LC 211, LC 212, LC 648, LC 720, LC 1268

---

## 24. Sort characters in string

**Use when:** You need a canonical form of a string, such as an anagram key, or need the letters in order.

**Complexity:** O(n log n) time and O(log n) stack space. A counting sort over 26 letters is O(n).

```cpp
sort(s.begin(), s.end());
```

**Example:** `s = "dcba"` becomes `"abcd"`.

**Pitfalls:** It sorts by byte value, so all uppercase letters come before all lowercase ones. It also changes `s` in place, so copy first if you still need the original.

**Used in:** LC 49, LC 242

---

## 25. Sort strings by length

**Use when:** Shorter words must be handled first, because longer ones are built from them.

**Complexity:** O(n log n) comparisons. Each compares sizes in O(1), so the sort itself does no character work.

```cpp
sort(words.begin(), words.end(), [](string& a, string& b) {
    return a.size() < b.size();
});
```

**Example:** `{"ccc", "a", "bb"}` becomes `{"a", "bb", "ccc"}`.

**Pitfalls:** Words of equal length end up in an unspecified order, so use `stable_sort` or a tie-break if that order matters. The comparator must return `false` for equal items, so never write `<=`. Prefer `const string&` parameters.

**Used in:** LC 472, LC 1408

---

## 26. Custom lexicographic compare

**Use when:** The answer has a two-level rule, as in "longest, and the lexicographically smallest on a tie".

**Complexity:** O(n log n) comparisons, each costing up to O(L) for strings of length L.

```cpp
sort(words.begin(), words.end(), [](string& a, string& b) {
    if (a.size() == b.size()) return a < b;
    return a.size() < b.size();
});
```

**Example:** `{"bb", "a", "ab"}` becomes `{"a", "ab", "bb"}`.

**Pitfalls:** Plain `a < b` already gives pure dictionary order, where `"ab"` comes before `"b"`; this version orders by length first. When the answer wants the longest first, flip only the size comparison, not the tie-break.

**Used in:** LC 720

---

## 27. Remove duplicate characters

**Use when:** You must keep only the first copy of each character, in the original order.

**Complexity:** O(n) time and O(1) space for the seen table, plus the output.

```cpp
string removeDuplicates(string s) {
    vector<bool> seen(256, false);
    string res;

    for (char c : s) {
        if (!seen[c]) {
            seen[c] = true;
            res += c;
        }
    }

    return res;
}
```

**Example:** `"banana"` returns `"ban"`.

**Pitfalls:** This isn't LC 316, which also wants the lexicographically smallest result and needs section 57. A negative `char` from non-ASCII input is an invalid index, so cast to `unsigned char` there.

**Used in:** No problem in this topic's list.

---

## 28. Remove adjacent duplicates

**Use when:** A pair of equal neighbors disappears, and removals can create new pairs, as in "repeatedly remove adjacent duplicates".

**Complexity:** O(n) time and O(n) space.

```cpp
string removeAdjacentDuplicates(string s) {
    string st;

    for (char c : s) {
        if (!st.empty() && st.back() == c) {
            st.pop_back();
        } else {
            st.push_back(c);
        }
    }

    return st;
}
```

**Example:** `"abbaca"` returns `"ca"`.

**Pitfalls:** A single left-to-right pass without a stack misses the new pairs that a removal creates. After a pop, the character is dropped rather than pushed. LC 1209 needs a stored run count for each character.

**Used in:** LC 1047, LC 1209

---

## 29. String to int

**Use when:** The token is already known to be a valid number, such as a part of a split string.

**Complexity:** O(d) time for d digits and O(1) space.

```cpp
int x = stoi(s);
long long y = stoll(s);
```

**Example:** `stoi("42")` returns `42`; `stoi("42abc")` also returns `42`.

**Pitfalls:** `stoi` throws `invalid_argument` on `"abc"` and `out_of_range` on overflow. It also stops silently at the first bad character, so it can't validate input. Use the manual loop for LC 8.

**Used in:** LC 93, LC 150, LC 165

---

## 30. Int to string

**Use when:** You need a number's digits as text, for example to append a count.

**Complexity:** O(d) time and space for d digits.

```cpp
string s = to_string(num);
```

**Example:** `to_string(42)` returns `"42"`.

**Pitfalls:** On a `double` it prints a fixed six decimals, so `to_string(1.5)` is `"1.500000"`. A negative number keeps its `-`, so digit loops must skip it. Prefer a `char` append for a single digit: `'0' + d`.

**Used in:** LC 38, LC 443

---

## 31. Manual atoi

**Use when:** You must parse a number by hand under rules: leading spaces, an optional sign, junk at the end, clamped overflow.

**Complexity:** O(n) time and O(1) space.

```cpp
int myAtoi(string s) {
    int i = 0, n = s.size();

    while (i < n && s[i] == ' ') i++;

    int sign = 1;

    if (i < n && (s[i] == '+' || s[i] == '-')) {
        if (s[i] == '-') sign = -1;
        i++;
    }

    long long ans = 0;

    while (i < n && isdigit(s[i])) {
        ans = ans * 10 + (s[i] - '0');

        if (sign * ans > INT_MAX) return INT_MAX;
        if (sign * ans < INT_MIN) return INT_MIN;

        i++;
    }

    return sign * ans;
}
```

**Example:** `"  -42a"` returns `-42`; `"91283472332"` returns `2147483647`.

**Pitfalls:** The clamp must run inside the loop, or a long enough digit string overflows even `long long`. Check `i < n` before every `s[i]`, which matters on `""` and `"+"`. A sign with no digits returns 0.

**Used in:** LC 8

---

## 32. Generate all subsequences

**Use when:** n is at most about 20 and the problem asks for "all subsequences" or "all subsets" of the characters.

**Complexity:** O(2^n * n) time and O(2^n * n) space to store them. Recursion depth is n.

```cpp
void generateSubsequences(int idx, string& s, string cur, vector<string>& ans) {
    if (idx == s.size()) {
        ans.push_back(cur);
        return;
    }

    generateSubsequences(idx + 1, s, cur, ans);
    generateSubsequences(idx + 1, s, cur + s[idx], ans);
}
```

**Example:** `s = "ab"` gives `{"", "b", "a", "ab"}`.

**Pitfalls:** The empty subsequence is included, so filter it if the problem excludes it. Repeated letters produce repeated results, so `"aa"` gives `"a"` twice. Passing `cur` by value is simple but costs a copy per call.

**Used in:** LC 78

---

## 33. Generate all permutations

**Use when:** n is at most about 8 to 10 and the problem asks for every ordering of the characters.

**Complexity:** O(n! * n) time, and O(n) recursion depth plus the stored output.

```cpp
void generatePermutations(string& s, int idx, vector<string>& ans) {
    if (idx == s.size()) {
        ans.push_back(s);
        return;
    }

    for (int i = idx; i < s.size(); i++) {
        swap(s[idx], s[i]);
        generatePermutations(s, idx + 1, ans);
        swap(s[idx], s[i]);
    }
}
```

**Example:** `s = "abc"` gives `{"abc", "acb", "bac", "bca", "cba", "cab"}`.

**Pitfalls:** Undo the swap after the recursive call, or later branches start from the wrong arrangement. Repeated letters produce duplicates, so skip a letter already tried at this `idx`. The output isn't in sorted order.

**Used in:** No problem in this topic's list.

---

## 34. Next permutation of string

**Use when:** You need the next ordering in dictionary order, or want to walk all orderings in sorted order.

**Complexity:** O(n) time per call and O(1) space.

```cpp
next_permutation(s.begin(), s.end());
```

**Example:** `"abc"` becomes `"acb"` and the call returns `true`; `"cba"` becomes `"abc"` and returns `false`.

**Pitfalls:** Sort first if you want to enumerate all orderings, or you only see those after the starting string. On the last permutation it wraps around to the first and returns `false`, so check the return value.

**Used in:** No problem in this topic's list.

---

## 35. Check rotation

**Use when:** The problem asks whether one string is a shift or rotation of another.

**Complexity:** O(n) space, and `find` is usually fast but O(n^2) in the worst case. KMP makes it O(n).

```cpp
bool isRotation(string a, string b) {
    if (a.size() != b.size()) return false;

    string doubled = a + a;
    return doubled.find(b) != string::npos;
}
```

**Example:** `a = "abcde", b = "cdeab"` returns `true`; `b = "abced"` returns `false`.

**Pitfalls:** Keep the length check, or any substring of `a + a` passes: `b = "bc"` would return `true`. LC 459 uses the same doubling idea, but it must also exclude the trivial match at index 0.

**Used in:** LC 459

---

## 36. Longest common prefix

**Use when:** The problem asks for the longest prefix shared by every string in a list.

**Complexity:** O(S * L) worst case for S total characters and prefix length L, because `find` scans each whole string. O(L) space.

```cpp
string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";

    string prefix = strs[0];

    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix.pop_back();

            if (prefix.empty()) return "";
        }
    }

    return prefix;
}
```

**Example:** `{"flower", "flow", "flight"}` returns `"fl"`.

**Pitfalls:** `find(prefix) != 0` searches past the start even when the prefix is absent there, so use `rfind(prefix, 0)` or `compare` for a faster check. An empty list or any empty string returns `""`.

**Used in:** LC 14

---

## 37. Group anagrams

**Use when:** Words with the same letters must land in the same bucket, as in "group the anagrams together".

**Complexity:** O(n * k log k) time for n words of length k, and O(n * k) space.

```cpp
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;

    for (string s : strs) {
        string key = s;
        sort(key.begin(), key.end());

        mp[key].push_back(s);
    }

    vector<vector<string>> ans;

    for (auto& [key, group] : mp) {
        ans.push_back(group);
    }

    return ans;
}
```

**Example:** `{"eat", "tea", "tan"}` gives the groups `{"eat", "tea"}` and `{"tan"}`, in any order.

**Pitfalls:** Results come out in an unspecified order, so don't compare them directly in a test. A count-based key drops the `log k`, but it needs separators between the counts. `string s` copies each word, so `const string&` is cheaper.

**Used in:** LC 49

---

## 38. Decode string — stack pattern

**Use when:** The input nests repeat counts in brackets, as in `k[encoded]`, and inner levels must expand first.

**Complexity:** O(output length) time and space, which can be much larger than the input.

For problems like `"3[a2[c]]"`.

```cpp
string decodeString(string s) {
    stack<int> counts;
    stack<string> resultStack;

    string cur = "";
    int num = 0;

    for (char c : s) {
        if (isdigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '[') {
            counts.push(num);
            resultStack.push(cur);

            num = 0;
            cur = "";
        } else if (c == ']') {
            int repeat = counts.top();
            counts.pop();

            string prev = resultStack.top();
            resultStack.pop();

            while (repeat--) {
                prev += cur;
            }

            cur = prev;
        } else {
            cur += c;
        }
    }

    return cur;
}
```

**Example:** `"3[a2[c]]"` returns `"accaccacc"`.

**Pitfalls:** Counts can have several digits, as in `"12[a]"`, so build `num` with `num * 10 + digit`. Reset both `num` and `cur` after pushing them on `[`. A letter outside any bracket is still appended, as in `"2[a]b"`.

**Used in:** LC 394

---

## 39. Longest common subsequence

**Use when:** The problem compares two strings and may skip characters, as in "longest common subsequence" or "fewest deletions to match".

**Complexity:** O(n * m) time and O(n * m) space, or O(min(n, m)) space with one rolling row.

```cpp
int lcs(string a, string b) {
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

**Example:** `a = "abcde", b = "ace"` returns `3`.

**Pitfalls:** `dp[i][j]` looks at `a[i - 1]` and `b[j - 1]`, because row 0 means an empty prefix. On a match, take the diagonal plus 1 rather than the maximum of its neighbors. Subsequence isn't substring: for substrings, a mismatch resets to 0.

**Used in:** LC 516, LC 583, LC 1092, LC 1143, LC 1312

---

## 40. Edit distance

**Use when:** The problem asks for the "minimum number of operations" to turn one string into another, using insert, delete and replace.

**Complexity:** O(n * m) time and O(n * m) space, or O(min(n, m)) space with rolling rows.

```cpp
int editDistance(string a, string b) {
    int n = a.size(), m = b.size();

    vector<vector<int>> dp(n + 1, vector<int>(m + 1));

    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({
                    dp[i - 1][j],     // delete
                    dp[i][j - 1],     // insert
                    dp[i - 1][j - 1]  // replace
                });
            }
        }
    }

    return dp[n][m];
}
```

**Example:** `a = "horse", b = "ros"` returns `3`.

**Pitfalls:** Don't skip the base cases: `dp[i][0] = i` and `dp[0][j] = j` cost real operations. With a rolling row, save the old diagonal before overwriting it. On a match, no `1 +` is needed.

**Used in:** LC 72

---

## 41. Longest palindromic subsequence

**Use when:** The problem asks for the longest palindrome you can get by skipping characters, or for the fewest insertions or deletions to make a palindrome.

**Complexity:** O(n^2) time and O(n^2) space, or O(n) space with a rolling row.

```cpp
int longestPalindromicSubsequence(string s) {
    int n = s.size();

    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;

        for (int j = i + 1; j < n; j++) {
            if (s[i] == s[j]) {
                dp[i][j] = 2 + dp[i + 1][j - 1];
            } else {
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][n - 1];
}
```

**Example:** `"bbbab"` returns `4`, for `"bbbb"`.

**Pitfalls:** `i` must run from `n - 1` down, because `dp[i][j]` reads row `i + 1`. An empty string makes `dp[0][n - 1]` an invalid read, so guard if the input can be empty. Minimum insertions is `n` minus this value.

**Used in:** LC 516, LC 1216, LC 1312

---

## 42. Rolling hash with prefix hashes

**Use when:** You need many substring comparisons, each in O(1), usually with binary search on a length.

**Complexity:** O(n) preprocessing time and space, then O(1) per query.

```cpp
struct StringHash {
    const long long mod = 1e9 + 7;
    const long long base = 31;

    vector<long long> hash;
    vector<long long> power;

    StringHash(string s) {
        int n = s.size();
        hash.resize(n + 1, 0);
        power.resize(n + 1, 1);

        for (int i = 0; i < n; i++) {
            hash[i + 1] = (hash[i] * base + s[i]) % mod;
            power[i + 1] = (power[i] * base) % mod;
        }
    }

    long long getHash(int l, int r) {
        long long val = hash[r + 1] - (hash[l] * power[r - l + 1]) % mod;

        if (val < 0) val += mod;

        return val;
    }
};
```

**Example:** For `StringHash h("abab")`, `h.getHash(0, 1) == h.getHash(2, 3)`, since both are `"ab"`.

**Pitfalls:** With base 31 and raw `char` values, mixed-case input can collide: `"az"` and `"b["` share a hash. For safety use a base above 256 and two moduli. Multiply before subtracting, and take `% mod` before the subtraction to stay in range.

**Used in:** LC 1316, LC 1392, LC 2223

---

## 43. Compare two substrings using hash

**Use when:** You need to test whether two ranges hold the same text, and `substr` comparison would be too slow.

**Complexity:** O(1) time per comparison after O(n) preprocessing.

```cpp
StringHash h(s);

if (h.getHash(l1, r1) == h.getHash(l2, r2)) {
    // substrings are probably equal
}
```

**Example:** For `s = "abab"`: `(0, 1)` and `(2, 3)` are equal, while `(0, 1)` and `(1, 2)` are not.

**Pitfalls:** Equal hashes mean "probably equal", so verify any answer that matters, or use a second modulus. Compare ranges of equal length only. `r` is inclusive here, so a substring of length `L` ends at `l + L - 1`.

**Used in:** LC 1316, LC 1392

---

## 44. Remove occurrences of substring

**Use when:** A substring must be deleted repeatedly, and each deletion can join text into a new match.

**Complexity:** O(n * m) time for pattern length m, and O(n) space.

```cpp
string removeOccurrences(string s, string part) {
    string res;
    int m = part.size();

    for (char c : s) {
        res += c;

        if (res.size() >= m && res.substr(res.size() - m) == part) {
            res.erase(res.size() - m);
        }
    }

    return res;
}
```

**Example:** `s = "daabcbaabcbc", part = "abc"` returns `"dab"`.

**Pitfalls:** Calling `find` and `erase` from the start on each loop is O(n^2) or worse, while this version only checks the tail. `res.substr` copies, so `res.compare(res.size() - m, m, part) == 0` is cheaper. An empty `part` would loop on nothing useful, so guard it.

**Used in:** No problem in this topic's list.

---

## 45. Character helpers

**Use when:** You parse or filter mixed input, such as "alphanumeric characters only".

**Complexity:** O(1) time and space per call.

```cpp
isdigit(c);
isalpha(c);
isalnum(c);
islower(c);
isupper(c);

tolower(c);
toupper(c);
```

**Example:** `isdigit('7')` is non-zero, `isalpha('7')` is `0`, and `tolower('A')` is `'a'`.

**Pitfalls:** These return an `int`, and a true result can be any non-zero value, so never compare with `== 1`. Passing a negative `char` is undefined, so cast to `unsigned char` on non-ASCII input. `tolower` returns `int`, so `cout` prints a number unless you cast it.

**Used in:** LC 8, LC 65, LC 125, LC 784

---

## 46. Case conversion

**Use when:** The comparison must ignore case, or the problem asks you to convert the case.

**Complexity:** O(n) time and O(1) extra space.

```cpp
for (char& c : s) {
    c = tolower(c);
}
```

```cpp
for (char& c : s) {
    c = toupper(c);
}
```

**Example:** `s = "aBc"` becomes `"abc"` with `tolower`, and `"ABC"` with `toupper`.

**Pitfalls:** Write `char& c`, because `char c` changes only a copy and leaves `s` as it was. Non-letters pass through unchanged, and locale-specific letters may not convert correctly.

**Used in:** LC 125, LC 709, LC 784

---

## 47. Erase from string

**Use when:** You must remove one known range or character from a string, once or a few times.

**Complexity:** O(n) time per call, because the tail shifts left. O(1) extra space.

```cpp
s.erase(pos, len);
```

```cpp
s.erase(s.begin() + i);
```

**Example:** `s = "hello"`: `s.erase(1, 3)` gives `"ho"`, and `s.erase(s.begin() + 1)` gives `"hllo"`.

**Pitfalls:** The two forms differ: `erase(pos)` with an integer removes everything from `pos` on, while `erase(iterator)` removes one character. Erasing inside a scan is O(n^2), and the indexes shift, so build a new string instead.

**Used in:** No problem in this topic's list.

---

## 48. Insert into string

**Use when:** You need to place text at one known position, once or a few times.

**Complexity:** O(n + k) time for k inserted characters, as the tail must shift. O(k) extra space.

```cpp
s.insert(pos, "abc");
```

**Example:** `s = "xy"`: `s.insert(1, "abc")` gives `"xabcy"`.

**Pitfalls:** `pos` greater than `s.size()` throws `out_of_range`, though `pos == s.size()` appends. Inserting repeatedly at the front is O(n^2), so build the string reversed or use a new buffer, as for the dashes in LC 482.

**Used in:** LC 482

---

## 49. Replace substring

```cpp
s.replace(pos, len, "new");
```

---

## 50. String stack pattern

Useful for removals, decoding, balancing.

```cpp
string st;

for (char c : s) {
    if (!st.empty() && shouldRemove(st.back(), c)) {
        st.pop_back();
    } else {
        st.push_back(c);
    }
}
```

---

## 51. Balanced parentheses

```cpp
bool isValid(string s) {
    stack<char> st;

    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;

            char top = st.top();
            st.pop();

            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }

    return st.empty();
}
```

---

## 52. Reverse words in a string

```cpp
string reverseWords(string s) {
    stringstream ss(s);
    string word;
    vector<string> words;

    while (ss >> word) {
        words.push_back(word);
    }

    reverse(words.begin(), words.end());

    string res;

    for (int i = 0; i < words.size(); i++) {
        if (i > 0) res += " ";
        res += words[i];
    }

    return res;
}
```

---

## 53. Check subsequence

```cpp
bool isSubsequence(string small, string big) {
    int i = 0;

    for (char c : big) {
        if (i < small.size() && small[i] == c) {
            i++;
        }
    }

    return i == small.size();
}
```

---

## 54. Count substrings with all unique chars

```cpp
int countUniqueSubstrings(string s) {
    vector<int> freq(256, 0);
    int left = 0;
    int ans = 0;

    for (int right = 0; right < s.size(); right++) {
        freq[s[right]]++;

        while (freq[s[right]] > 1) {
            freq[s[left]]--;
            left++;
        }

        ans += right - left + 1;
    }

    return ans;
}
```

---

## 55. Longest substring with at most K distinct chars

```cpp
int longestAtMostKDistinct(string s, int k) {
    unordered_map<char, int> freq;

    int left = 0;
    int ans = 0;

    for (int right = 0; right < s.size(); right++) {
        freq[s[right]]++;

        while (freq.size() > k) {
            freq[s[left]]--;

            if (freq[s[left]] == 0) {
                freq.erase(s[left]);
            }

            left++;
        }

        ans = max(ans, right - left + 1);
    }

    return ans;
}
```

---

## 56. Longest repeating character replacement

```cpp
int characterReplacement(string s, int k) {
    vector<int> freq(26, 0);

    int left = 0;
    int maxFreq = 0;
    int ans = 0;

    for (int right = 0; right < s.size(); right++) {
        freq[s[right] - 'A']++;
        maxFreq = max(maxFreq, freq[s[right] - 'A']);

        while ((right - left + 1) - maxFreq > k) {
            freq[s[left] - 'A']--;
            left++;
        }

        ans = max(ans, right - left + 1);
    }

    return ans;
}
```

---

## 57. Lexicographically smallest subsequence of distinct chars

```cpp
string smallestSubsequence(string s) {
    vector<int> last(26);
    vector<bool> used(26, false);

    for (int i = 0; i < s.size(); i++) {
        last[s[i] - 'a'] = i;
    }

    string st;

    for (int i = 0; i < s.size(); i++) {
        int idx = s[i] - 'a';

        if (used[idx]) continue;

        while (!st.empty() && st.back() > s[i] && last[st.back() - 'a'] > i) {
            used[st.back() - 'a'] = false;
            st.pop_back();
        }

        st.push_back(s[i]);
        used[idx] = true;
    }

    return st;
}
```

---

## 58. String compression

```cpp
string compress(string s) {
    string res;

    for (int i = 0; i < s.size(); i++) {
        int j = i;

        while (j < s.size() && s[j] == s[i]) {
            j++;
        }

        res += s[i];
        res += to_string(j - i);

        i = j - 1;
    }

    return res;
}
```

---

## 59. In-place compression style

```cpp
int compress(vector<char>& chars) {
    int write = 0;
    int i = 0;

    while (i < chars.size()) {
        char c = chars[i];
        int count = 0;

        while (i < chars.size() && chars[i] == c) {
            i++;
            count++;
        }

        chars[write++] = c;

        if (count > 1) {
            string cnt = to_string(count);

            for (char digit : cnt) {
                chars[write++] = digit;
            }
        }
    }

    return write;
}
```

---

## 60. Useful string constants

```cpp
string alphabet = "abcdefghijklmnopqrstuvwxyz";
string digits = "0123456789";
```

---

## High-yield interview patterns

```cpp
// Frequency
vector<int> freq(26);

// Sliding window
int left = 0;
for (int right = 0; right < n; right++) {
    // add s[right]

    while (badCondition) {
        // remove s[left]
        left++;
    }

    // update answer
}

// Prefix hash
hash[i + 1] = hash[i] * base + s[i];

// Palindrome center expansion
expand(i, i);
expand(i, i + 1);

// Stack string
string st;
for (char c : s) {
    // push/pop based on condition
}
```
