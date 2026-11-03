Assumes the standard node:

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

---

## 1. DFS Traversals — Recursive

**Use when:** The problem names a traversal order, or a node's work depends on whether it happens before, between or after its children.

```cpp
void preorder(TreeNode* root, vector<int>& out) {
    if (!root) return;
    out.push_back(root->val);   // visit
    preorder(root->left, out);
    preorder(root->right, out);
}

void inorder(TreeNode* root, vector<int>& out) {
    if (!root) return;
    inorder(root->left, out);
    out.push_back(root->val);   // visit between children
    inorder(root->right, out);
}

void postorder(TreeNode* root, vector<int>& out) {
    if (!root) return;
    postorder(root->left, out);
    postorder(root->right, out);
    out.push_back(root->val);   // visit after children
}
```

**Complexity:** `O(n)` time, `O(h)` recursion stack (`O(n)` on a skewed tree).

**Example:** Tree `[1,2,3,4,5]`: preorder `[1,2,4,5,3]`, inorder `[4,2,5,1,3]`, postorder `[4,5,2,3,1]`.

**Pitfalls:** The `if (!root) return;` base case is required at every level. A skewed tree with 10^5 nodes can overflow the call stack, so switch to the iterative version.

**Used in:** LC 94, LC 144, LC 145, LC 257, LC 112

---

## 2. DFS Traversals — Iterative

**Use when:** Recursion depth could overflow, or you need to pause and resume the traversal.

Inorder with an explicit stack:

```cpp
vector<int> inorderIter(TreeNode* root) {
    vector<int> out;
    stack<TreeNode*> st;
    TreeNode* cur = root;

    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        out.push_back(cur->val);
        cur = cur->right;
    }

    return out;
}
```

Preorder iterative:

```cpp
vector<int> preorderIter(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        out.push_back(node->val);
        if (node->right) st.push(node->right); // right first
        if (node->left)  st.push(node->left);
    }

    return out;
}
```

**Complexity:** `O(n)` time, `O(h)` stack space.

**Example:** Tree `[1,2,3,4,5]`: `inorderIter` -> `[4,2,5,1,3]`, `preorderIter` -> `[1,2,4,5,3]`.

**Pitfalls:** Preorder must push the right child before the left, because the stack pops in reverse. Inorder's outer loop needs both `cur` and `!st.empty()`, or the last right subtree is skipped.

**Used in:** LC 94, LC 144, LC 173, LC 230

---

## 3. BFS — Level Order

**Use when:** The answer is grouped by depth: "level by level", "each row", "right side view", or "minimum depth".

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;

        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }

        res.push_back(level);
    }

    return res;
}
```

Zigzag — reverse alternate levels before pushing.

**Complexity:** `O(n)` time, `O(w)` space where `w` is the widest level.

**Example:** `[3,9,20,null,null,15,7]` -> `[[3],[9,20],[15,7]]`.

**Pitfalls:** Read `q.size()` into `sz` before the inner loop. The queue grows while you pop, so re-reading it merges levels.

**Used in:** LC 102, LC 107, LC 103, LC 199, LC 637, LC 515

---

## 4. Serialize / Deserialize (preorder + null markers)

**Use when:** You must turn a tree into a string and back, and you choose the format.

```cpp
string serialize(TreeNode* root) {
    string s;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) { s += "#,"; return; }
        s += to_string(node->val) + ",";
        dfs(node->left);
        dfs(node->right);
    };
    dfs(root);
    return s;
}

TreeNode* deserialize(string data) {
    stringstream ss(data);
    string tok;
    function<TreeNode*()> build = [&]() -> TreeNode* {
        getline(ss, tok, ',');
        if (tok == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(tok));
        node->left = build();
        node->right = build();
        return node;
    };
    return build();
}
```

**Complexity:** `O(n)` time and `O(n)` space for both directions.

**Example:** `[1,2,3,null,null,4,5]` -> `"1,2,#,#,3,4,#,#,5,#,#,"`, and `deserialize` rebuilds the same tree. The empty tree is `"#,"`.

**Pitfalls:** Without the `#` markers a preorder is ambiguous, and without the `,` delimiter `"1,2"` and `"12"` collide. The reader must use the same delimiter as the writer.

**Used in:** LC 297, LC 449, LC 331

---

## 5. Build Tree from Preorder + Inorder

**Use when:** You are given preorder and inorder sequences with unique values and must rebuild the tree.

```cpp
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int,int> pos;
    for (int i = 0; i < (int)inorder.size(); i++) pos[inorder[i]] = i;

    int pre = 0;
    function<TreeNode*(int,int)> build = [&](int l, int r) -> TreeNode* {
        if (l > r) return nullptr;
        int val = preorder[pre++];
        TreeNode* node = new TreeNode(val);
        int mid = pos[val];
        node->left  = build(l, mid - 1);
        node->right = build(mid + 1, r);
        return node;
    };

    return build(0, inorder.size() - 1);
}
```

**Complexity:** `O(n)` time with the index map, `O(n)` space.

**Example:** preorder `[3,9,20,15,7]`, inorder `[9,3,15,20,7]` -> `[3,9,20,null,null,15,7]`.

**Pitfalls:** Build the left subtree before the right, because `pre` advances in preorder. The map breaks if values repeat. For inorder plus postorder (LC 106), read postorder from the back and build right first.

**Used in:** LC 105, LC 106, LC 1008

---

## 6. BST — Search / Insert / Validate

**Use when:** The tree is a BST and you need a lookup, an insert, or a validity check.

```cpp
TreeNode* search(TreeNode* root, int key) {
    while (root && root->val != key) {
        root = key < root->val ? root->left : root->right;
    }
    return root;
}

TreeNode* insert(TreeNode* root, int key) {
    if (!root) return new TreeNode(key);
    if (key < root->val) root->left  = insert(root->left, key);
    else                 root->right = insert(root->right, key);
    return root;
}

bool isValidBST(TreeNode* root, long lo = LONG_MIN, long hi = LONG_MAX) {
    if (!root) return true;
    if (root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left, lo, root->val) &&
           isValidBST(root->right, root->val, hi);
}
```

**Complexity:** Search and insert take `O(h)` time. Validate takes `O(n)` time and `O(h)` stack space.

**Example:** BST `[4,2,7,1,3]`: `search(root, 2)` returns the node 2, and `insert(root, 5)` gives `[4,2,7,1,3,5]`. `isValidBST` returns true here and false for `[5,4,6,null,null,3,7]`.

**Pitfalls:** Validate with bounds passed down, not just parent-child comparisons. The bounds are `long` so a node equal to `INT_MIN` or `INT_MAX` is still accepted. This `insert` sends duplicates right.

**Used in:** LC 700, LC 701, LC 98

---

## 7. BST — Delete Node

**Use when:** A BST key must be removed and the result must stay a valid BST.

```cpp
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;

    if (key < root->val)      root->left  = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left)  return root->right;
        if (!root->right) return root->left;

        TreeNode* succ = root->right;       // inorder successor
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }

    return root;
}
```

**Complexity:** `O(h)` time, `O(h)` stack space.

**Example:** `[5,3,6,2,4,null,7]`, key `3` -> `[5,4,6,2,null,null,7]`. Node 3 takes its successor's value, 4, and the old 4 is removed.

**Pitfalls:** With two children, copy the successor's value and then delete that value from the right subtree, not the original key. The removed node is not freed, which is fine on LeetCode but leaks in real code.

**Used in:** LC 450

---

## 8. Lowest Common Ancestor — Binary Tree

**Use when:** You need the lowest node that has both `p` and `q` in its subtree.

```cpp
TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;

    TreeNode* L = lca(root->left, p, q);
    TreeNode* R = lca(root->right, p, q);

    if (L && R) return root;   // split point
    return L ? L : R;
}
```

LCA in a BST (use ordering):

```cpp
TreeNode* lcaBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    }
    return nullptr;
}
```

**Complexity:** `O(n)` time and `O(h)` space for `lca`. `O(h)` time and `O(1)` space for `lcaBST`.

**Example:** `[3,5,1,6,2,0,8,null,null,7,4]`: `lca(5, 1)` -> `3`, and `lca(5, 4)` -> `5`.

**Pitfalls:** `lca` assumes both nodes exist, because it returns early at the first one it finds. If one may be missing (LC 1644), finish the traversal and count the targets found.

**Used in:** LC 236, LC 235, LC 2096

---

## 9. Height, Diameter

**Use when:** The answer depends on subtree heights: depth, balance, or the longest path between two nodes.

```cpp
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}

// diameter = longest path (in edges) between any two nodes
int diameter(TreeNode* root) {
    int best = 0;

    function<int(TreeNode*)> depth = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int l = depth(node->left);
        int r = depth(node->right);
        best = max(best, l + r);   // path through this node
        return 1 + max(l, r);
    };

    depth(root);
    return best;
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `[1,2,3,4,5]`: `height` -> `3` nodes, `diameter` -> `3` edges, on the path 4 -> 2 -> 1 -> 3.

**Pitfalls:** `height` counts nodes while `diameter` counts edges, which is why the code uses `l + r` with no `+1`. The longest path may skip the root, so keep the global `best`.

**Used in:** LC 104, LC 543, LC 110, LC 687

---

## 10. Path Problems — Max Path Sum (any node to any node)

**Use when:** A path can start and end at any node, or it must run from the root to a leaf with a target sum.

```cpp
int maxPathSum(TreeNode* root) {
    int best = INT_MIN;

    function<int(TreeNode*)> gain = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int l = max(0, gain(node->left));   // drop negative branches
        int r = max(0, gain(node->right));
        best = max(best, node->val + l + r);
        return node->val + max(l, r);
    };

    gain(root);
    return best;
}
```

Root-to-leaf path sum equals target:

```cpp
bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    if (!root->left && !root->right) return target == root->val;
    return hasPathSum(root->left,  target - root->val) ||
           hasPathSum(root->right, target - root->val);
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `maxPathSum([-10,9,20,null,null,15,7])` -> `42`. `hasPathSum([5,4,8,11,null,13,4,7,2,null,null,null,1], 22)` -> `true`.

**Pitfalls:** Start `best` at `INT_MIN`, not 0, so an all-negative tree like `[-3]` returns `-3`. In `hasPathSum`, check for a leaf before recursing, or a node with one child counts its null side as a finished path.

**Used in:** LC 124, LC 112, LC 113

---

## 11. Symmetry / Same Tree

**Use when:** You compare two trees, or a tree with its mirror image, node by node.

```cpp
bool isSameTree(TreeNode* a, TreeNode* b) {
    if (!a || !b) return a == b;
    return a->val == b->val &&
           isSameTree(a->left, b->left) &&
           isSameTree(a->right, b->right);
}

bool isSymmetric(TreeNode* root) {
    function<bool(TreeNode*, TreeNode*)> mirror =
        [&](TreeNode* a, TreeNode* b) {
            if (!a || !b) return a == b;
            return a->val == b->val &&
                   mirror(a->left, b->right) &&
                   mirror(a->right, b->left);
        };
    return !root || mirror(root->left, root->right);
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `isSameTree([1,2,3], [1,2,3])` -> `true`. `isSymmetric([1,2,2,3,4,4,3])` -> `true`, and `isSymmetric([1,2,2,null,3,null,3])` -> `false`.

**Pitfalls:** `if (!a || !b) return a == b;` handles both-null (equal) and one-null (not equal) in one line. For a mirror, pair outer with outer and inner with inner.

**Used in:** LC 100, LC 101, LC 572, LC 951

---

## 12. Invert / Flatten

**Use when:** You must restructure a tree in place: mirror it, or turn it into a linked list in preorder.

```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    return root;
}

// flatten to a right-skewed linked list, preorder
void flatten(TreeNode* root) {
    TreeNode* cur = root;
    while (cur) {
        if (cur->left) {
            TreeNode* pred = cur->left;
            while (pred->right) pred = pred->right;
            pred->right = cur->right;
            cur->right = cur->left;
            cur->left = nullptr;
        }
        cur = cur->right;
    }
}
```

**Complexity:** Both take `O(n)` time. `invertTree` uses `O(h)` stack space, and `flatten` uses `O(1)` extra space.

**Example:** `invertTree([4,2,7,1,3,6,9])` -> `[4,7,2,9,6,3,1]`. `flatten([1,2,5,3,4,null,6])` gives the right-only chain 1 -> 2 -> 3 -> 4 -> 5 -> 6.

**Pitfalls:** In `flatten`, set `cur->left = nullptr` after moving the left subtree, or the result still has left links. Attach the old right subtree to the rightmost node of the left subtree before overwriting `cur->right`.

**Used in:** LC 226, LC 114

---

## 13. Vertical Order Traversal

**Use when:** The output is grouped by column, from left to right and top to bottom.

```cpp
vector<vector<int>> verticalOrder(TreeNode* root) {
    map<int, vector<int>> cols; // column -> values top to bottom
    queue<pair<TreeNode*,int>> q;
    if (root) q.push({root, 0});

    while (!q.empty()) {
        auto [node, c] = q.front(); q.pop();
        cols[c].push_back(node->val);
        if (node->left)  q.push({node->left,  c - 1});
        if (node->right) q.push({node->right, c + 1});
    }

    vector<vector<int>> res;
    for (auto& [c, v] : cols) res.push_back(v);
    return res;
}
```

**Complexity:** `O(n log n)` time for the ordered map, `O(n)` space.

**Example:** `[3,9,20,null,null,15,7]` -> `[[9],[3,15],[20],[7]]`.

**Pitfalls:** This is LC 314's order, where ties keep BFS order. LC 987 also sorts nodes sharing a row and column by value, so store `(row, val)` pairs and sort each column.

**Used in:** LC 314, LC 987

---

## 14. Tree DP — House Robber III (rob / not-rob states)

**Use when:** Picking a node forbids its direct neighbors, so each node returns a "take" value and a "skip" value.

```cpp
// returns {rob this node, skip this node}
pair<int,int> robDFS(TreeNode* node) {
    if (!node) return {0, 0};

    auto [robL, skipL] = robDFS(node->left);
    auto [robR, skipR] = robDFS(node->right);

    int rob  = node->val + skipL + skipR;
    int skip = max(robL, skipL) + max(robR, skipR);

    return {rob, skip};
}

int rob(TreeNode* root) {
    auto [r, s] = robDFS(root);
    return max(r, s);
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `[3,2,3,null,3,null,1]` -> `7` (3 + 3 + 1). `[3,4,5,1,3,null,1]` -> `9` (4 + 5).

**Pitfalls:** The `skip` value takes `max(rob, skip)` from each child, not just the child's `rob`. Returning both values together avoids the exponential plain recursion.

**Used in:** LC 337

---

## 15. DFS with State — Count Good Nodes

**Use when:** Each node needs something about its ancestors (max so far, min so far, or a mask), so you pass it down as an argument.

A node is "good" if no node on the root path has a greater value.

```cpp
int goodNodes(TreeNode* root) {
    int count = 0;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int mx) {
        if (!node) return;
        if (node->val >= mx) count++;
        int nmx = max(mx, node->val);
        dfs(node->left, nmx);
        dfs(node->right, nmx);
    };
    dfs(root, INT_MIN);
    return count;
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `[3,1,4,3,null,1,5]` -> `4` good nodes: 3, 4, the lower 3, and 5.

**Pitfalls:** Use `>=`, because a node equal to the path maximum is still good. Starting `mx` at `INT_MIN` makes the root count. Pass `nmx` by value so sibling branches don't share it.

**Used in:** LC 1448, LC 1026, LC 1457

---

## 16. Tree + Prefix Sum / Hash Map — Path Sum III

**Use when:** You must count downward paths with a given sum that can start below the root.

Count downward paths summing to target.

```cpp
int pathSum(TreeNode* root, int target) {
    unordered_map<long,int> prefix{{0, 1}};
    int count = 0;

    function<void(TreeNode*, long)> dfs = [&](TreeNode* node, long sum) {
        if (!node) return;
        sum += node->val;
        count += prefix[sum - target];
        prefix[sum]++;
        dfs(node->left, sum);
        dfs(node->right, sum);
        prefix[sum]--;            // backtrack
    };

    dfs(root, 0);
    return count;
}
```

**Complexity:** `O(n)` average time, `O(h)` live map entries.

**Example:** `[10,5,-3,3,2,null,11,3,-2,null,1]`, target `8` -> `3`.

**Pitfalls:** Seed the map with `{0, 1}` so paths starting at the root count. Look up before incrementing, so a target of 0 doesn't match the empty path. Undo `prefix[sum]--` on the way out, or sibling branches pair up. Keep sums in `long`.

**Used in:** LC 437

---

## 17. BST Iterator (controlled inorder)

**Use when:** You need `next()` and `hasNext()` over a BST in sorted order using `O(h)` memory.

```cpp
struct BSTIterator {
    stack<TreeNode*> st;

    BSTIterator(TreeNode* root) { pushLeft(root); }

    void pushLeft(TreeNode* node) {
        while (node) { st.push(node); node = node->left; }
    }

    int next() {
        TreeNode* node = st.top(); st.pop();
        pushLeft(node->right);
        return node->val;
    }

    bool hasNext() { return !st.empty(); }
};
```

**Complexity:** `next()` is amortized `O(1)` and `O(h)` in the worst case. `hasNext()` is `O(1)`. Space is `O(h)`.

**Example:** `[7,3,15,null,null,9,20]`: repeated `next()` calls return 3, 7, 9, 15, 20, then `hasNext()` is `false`.

**Pitfalls:** `next()` must push the left spine of the popped node's right child, or the right subtree is skipped. Flattening the whole tree in the constructor breaks the `O(h)` memory requirement.

**Used in:** LC 173, LC 1214, LC 272

---

## 18. N-ary Tree Traversal

**Use when:** Each node has a list of children instead of `left` and `right`.

```cpp
struct Node {
    int val;
    vector<Node*> children;
};

vector<int> preorderNary(Node* root) {
    vector<int> out;
    function<void(Node*)> dfs = [&](Node* node) {
        if (!node) return;
        out.push_back(node->val);
        for (Node* c : node->children) dfs(c);
    };
    dfs(root);
    return out;
}
```

**Complexity:** `O(n)` time, `O(h)` space.

**Example:** `[1,null,3,2,4,null,5,6]` -> `[1,3,5,6,2,4]`.

**Pitfalls:** LeetCode's N-ary input uses `null` to separate each node's children, so don't read it as a binary level-order list. For a deep tree, use an explicit stack.

**Used in:** LC 589, LC 590, LC 559

---

## 19. Unrooted Tree on Graph — DFS from root

**Use when:** The tree arrives as `n - 1` undirected edges and you need parents, depths or subtree sizes.

```cpp
// tree given as adjacency list; root it at 0
vector<vector<int>> g(n);
vector<int> parent(n, -1), depth(n, 0), subtree(n, 1);

function<void(int,int)> dfs = [&](int u, int p) {
    parent[u] = p;
    for (int v : g[u]) {
        if (v == p) continue;
        depth[v] = depth[u] + 1;
        dfs(v, u);
        subtree[u] += subtree[v];
    }
};

dfs(0, -1);
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `n = 4`, edges `0-1, 0-2, 1-3`: `parent = [-1,0,0,1]`, `depth = [0,1,1,2]`, `subtree = [4,2,1,1]`.

**Pitfalls:** Add each edge in both directions, and skip `v == p` so the DFS doesn't walk back to the parent. Add `subtree[v]` after the recursive call returns. A path of 10^5 nodes can overflow the stack.

**Used in:** LC 834, LC 2049, LC 1466, LC 1443

---

## 20. Euler Tour — Flatten Subtree to a Range

**Use when:** You have many queries or updates on whole subtrees, which become ranges over the DFS order.

Lets subtree queries become range queries `[tin[u], tout[u]]`.

```cpp
vector<int> tin(n), tout(n);
int timer = 0;

function<void(int,int)> euler = [&](int u, int p) {
    tin[u] = timer++;
    for (int v : g[u]) if (v != p) euler(v, u);
    tout[u] = timer - 1;
};

euler(0, -1);
// v is in subtree of u  <=>  tin[u] <= tin[v] && tin[v] <= tout[u]
```

**Complexity:** `O(n)` time and space to flatten. Each later range query costs `O(log n)` with a Fenwick or segment tree.

**Example:** Edges `0-1, 0-2, 1-3` (with 1 listed before 2): `tin = [0,1,3,2]`, `tout = [3,2,3,2]`. The subtree of 1 is the range `[1,2]`.

**Pitfalls:** Index the range structure by `tin[u]`, not by `u`. `tout` here is inclusive (`timer - 1`). Mixing it with an exclusive end is an off-by-one.

**Used in:** LC 1938

---

## 21. Binary Lifting — LCA in O(log n)

**Use when:** You have many k-th ancestor or LCA queries on a tree that never changes.

```cpp
int LOG = 20;
vector<vector<int>> up(LOG, vector<int>(n));
vector<int> depth(n, 0);

// after a DFS that fills up[0][v] = parent and depth[v]:
void buildLifting() {
    for (int k = 1; k < LOG; k++)
        for (int v = 0; v < n; v++)
            up[k][v] = up[k - 1][ up[k - 1][v] ];
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);

    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; k++)
        if (diff & (1 << k)) u = up[k][u];

    if (u == v) return u;

    for (int k = LOG - 1; k >= 0; k--)
        if (up[k][u] != up[k][v]) { u = up[k][u]; v = up[k][v]; }

    return up[0][u];
}
```

**Complexity:** `O(n log n)` time and space to build, `O(log n)` per query.

**Example:** Root 0 with children 1 and 2, and node 1 with children 3 and 4: `lca(3, 4) = 1`, `lca(3, 2) = 0`.

**Pitfalls:** Set `up[0][root] = root`, not `-1`, because `-1` would be used as an array index. `LOG` must satisfy `2^LOG > n`. Lift both nodes from the high bit down, then return `up[0][u]`.

**Used in:** LC 1483, LC 2846

---

## 22. Rerooting DP — Sum of Distances to All Nodes

**Use when:** You need an answer for every node as if it were the root, and running a DFS from each node would be `O(n^2)`.

```cpp
vector<long long> ans(n, 0);
vector<int> cnt(n, 1); // subtree sizes rooted at 0

function<void(int,int)> down = [&](int u, int p) {
    for (int v : g[u]) if (v != p) {
        down(v, u);
        cnt[u] += cnt[v];
        ans[u] += ans[v] + cnt[v];
    }
};

function<void(int,int)> reroot = [&](int u, int p) {
    for (int v : g[u]) if (v != p) {
        ans[v] = ans[u] - cnt[v] + (n - cnt[v]); // move root u -> v
        reroot(v, u);
    }
};

down(0, -1);
reroot(0, -1);
```

**Complexity:** `O(n)` time, `O(n)` space.

**Example:** `n = 6`, edges `[[0,1],[0,2],[2,3],[2,4],[2,5]]` -> `ans = [8,12,6,10,10,10]`.

**Pitfalls:** `reroot` must set `ans[v]` before recursing into `v`, going top-down. `cnt` stays relative to root 0, which is what the formula expects. Use `long long` for large trees.

**Used in:** LC 834, LC 2581

---

## 23. Morris Inorder — O(1) space

**Use when:** The problem asks for an inorder walk with `O(1)` extra space and no recursion.

```cpp
vector<int> morrisInorder(TreeNode* root) {
    vector<int> out;
    TreeNode* cur = root;

    while (cur) {
        if (!cur->left) {
            out.push_back(cur->val);
            cur = cur->right;
        } else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur) pred = pred->right;

            if (!pred->right) {
                pred->right = cur;       // thread
                cur = cur->left;
            } else {
                pred->right = nullptr;   // unthread
                out.push_back(cur->val);
                cur = cur->right;
            }
        }
    }

    return out;
}
```

**Complexity:** `O(n)` time, `O(1)` extra space.

**Example:** `[1,null,2,3]` -> `[1,3,2]`, and the tree's pointers are restored afterwards.

**Pitfalls:** The predecessor loop needs `pred->right != cur`, or it follows the thread and loops forever. Don't `break` out early, because that leaves threads in the tree.

**Used in:** LC 94, LC 99, LC 230, LC 538, LC 897

---

## Common Choose-What Pattern

**Use when:** You have read the problem and are not sure which template above applies.

```cpp
// Sorted output from BST            -> inorder traversal
// Level-by-level / shortest depth   -> BFS level order
// Build from traversals             -> preorder index + inorder map
// Subtree aggregate (size/sum)      -> postorder DFS, collect up
// Pass constraint down a path       -> DFS with state argument
// Path count with sum               -> DFS + prefix-sum hash map
// LCA on a static tree              -> binary lifting / Euler + sparse table
// Subtree query as range query      -> Euler tour flatten
// Answer for every root             -> rerooting DP (down then reroot)
// O(1)-space inorder                -> Morris traversal
// Controlled / lazy traversal       -> stack-based iterator
```

**Complexity:** Not a template: each line points to a section whose cost is listed there.

**Example:** "Kth smallest in a BST" -> inorder. "Sum of distances from every node" -> rerooting DP. "Count downward paths with sum k" -> DFS plus a prefix-sum map.

**Pitfalls:** These cues are a first guess. A single LCA query doesn't need binary lifting, and a subtree query without updates doesn't need an Euler tour.

**Used in:** LC 230, LC 102, LC 105, LC 1448, LC 437, LC 236, LC 834, LC 99, LC 173
