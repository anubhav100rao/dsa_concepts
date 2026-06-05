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

---

## 2. DFS Traversals — Iterative

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

---

## 3. BFS — Level Order

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

---

## 4. Serialize / Deserialize (preorder + null markers)

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

---

## 5. Build Tree from Preorder + Inorder

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

---

## 6. BST — Search / Insert / Validate

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

---

## 7. BST — Delete Node

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

---

## 8. Lowest Common Ancestor — Binary Tree

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

---

## 9. Height, Diameter

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

---

## 10. Path Problems — Max Path Sum (any node to any node)

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

---

## 11. Symmetry / Same Tree

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

---

## 12. Invert / Flatten

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

---

## 13. Vertical Order Traversal

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

---

## 14. Tree DP — House Robber III (rob / not-rob states)

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

---

## 15. DFS with State — Count Good Nodes

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

---

## 16. Tree + Prefix Sum / Hash Map — Path Sum III

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

---

## 17. BST Iterator (controlled inorder)

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

---

## 18. N-ary Tree Traversal

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

---

## 19. Unrooted Tree on Graph — DFS from root

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

---

## 20. Euler Tour — Flatten Subtree to a Range

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

---

## 21. Binary Lifting — LCA in O(log n)

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

---

## 22. Rerooting DP — Sum of Distances to All Nodes

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

---

## 23. Morris Inorder — O(1) space

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

---

# Common Choose-What Pattern

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
