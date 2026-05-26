## 1. Basic string traversal

```cpp
for (char c : s) {
    // use c
}

for (int i = 0; i < s.size(); i++) {
    // use s[i]
}
```

---

## 2. Frequency count

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

---

## 3. Check anagram

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

---

## 4. Reverse string

```cpp
reverse(s.begin(), s.end());
```

### Reverse substring

```cpp
reverse(s.begin() + l, s.begin() + r + 1);
```

---

## 5. Palindrome check

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

---

## 6. Two-pointer valid palindrome ignoring non-alphanumeric

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

---

## 7. Remove spaces

```cpp
string res;

for (char c : s) {
    if (c != ' ') res += c;
}
```

---

## 8. Split string by space

```cpp
stringstream ss(s);
string word;
vector<string> words;

while (ss >> word) {
    words.push_back(word);
}
```

---

## 9. Split by custom delimiter

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

---

## 10. Join strings

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

---

## 11. Substring

```cpp
string sub = s.substr(start, length);
```

Example:

```cpp
string sub = s.substr(i, j - i + 1);
```

---

## 12. Find substring

```cpp
int pos = s.find(pattern);

if (pos != string::npos) {
    // found at pos
}
```

---

## 13. Count vowels

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

---

## 14. Sliding window — longest substring without repeating chars

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

---

## 15. Sliding window — minimum window substring

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

---

## 16. Expand around center — longest palindromic substring

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

---

## 17. KMP prefix function / LPS array

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

---

## 18. KMP string matching

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

---

## 19. Rabin-Karp rolling hash

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

---

## 20. Z-function

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

---

## 21. Pattern matching using Z-function

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

---

## 22. Manacher’s algorithm — longest palindrome in O(n)

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

---

## 23. Trie

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

---

## 24. Sort characters in string

```cpp
sort(s.begin(), s.end());
```

---

## 25. Sort strings by length

```cpp
sort(words.begin(), words.end(), [](string& a, string& b) {
    return a.size() < b.size();
});
```

---

## 26. Custom lexicographic compare

```cpp
sort(words.begin(), words.end(), [](string& a, string& b) {
    if (a.size() == b.size()) return a < b;
    return a.size() < b.size();
});
```

---

## 27. Remove duplicate characters

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

---

## 28. Remove adjacent duplicates

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

---

## 29. String to int

```cpp
int x = stoi(s);
long long y = stoll(s);
```

---

## 30. Int to string

```cpp
string s = to_string(num);
```

---

## 31. Manual atoi

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

---

## 32. Generate all subsequences

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

---

## 33. Generate all permutations

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

---

## 34. Next permutation of string

```cpp
next_permutation(s.begin(), s.end());
```

---

## 35. Check rotation

```cpp
bool isRotation(string a, string b) {
    if (a.size() != b.size()) return false;

    string doubled = a + a;
    return doubled.find(b) != string::npos;
}
```

---

## 36. Longest common prefix

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

---

## 37. Group anagrams

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

---

## 38. Decode string — stack pattern

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

---

## 39. Longest common subsequence

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

---

## 40. Edit distance

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

---

## 41. Longest palindromic subsequence

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

---

## 42. Rolling hash with prefix hashes

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

---

## 43. Compare two substrings using hash

```cpp
StringHash h(s);

if (h.getHash(l1, r1) == h.getHash(l2, r2)) {
    // substrings are probably equal
}
```

---

## 44. Remove occurrences of substring

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

---

## 45. Character helpers

```cpp
isdigit(c);
isalpha(c);
isalnum(c);
islower(c);
isupper(c);

tolower(c);
toupper(c);
```

---

## 46. Case conversion

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

---

## 47. Erase from string

```cpp
s.erase(pos, len);
```

```cpp
s.erase(s.begin() + i);
```

---

## 48. Insert into string

```cpp
s.insert(pos, "abc");
```

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
