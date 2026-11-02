// Keyed by section heading (without the leading "## "). See src/conceptMaps.js.
export const trees = {
  '1. Tree Traversal — DFS (Preorder / Inorder / Postorder)': {
    crux: 'Every DFS visits the same nodes. The only choice is when you handle a node: before its children (pre), between them (in), or after them (post).',
    signals: [
      '"Return the inorder traversal of its nodes\' values": the order is named for you.',
      '"Recursive solution is trivial, could you do it iteratively?": use an explicit stack.',
      '"All root-to-leaf paths" or "root-to-leaf path with the given sum": preorder, pushing and popping one shared path.',
      '"Flatten the tree... in the same order as a pre-order traversal": the required output order picks the traversal.',
    ],
    notThis: [
      'The answer is grouped by depth, as in Level Order Traversal (LC 102): use BFS, because DFS needs extra bookkeeping to keep levels together.',
      'A node\'s answer depends on values from its children, as in Diameter (LC 543): the visiting order is only a detail, so design the return value (sections 7 and 11).',
    ],
    concepts: [
      'Preorder sees a node before its subtree, so it suits copying a tree or carrying state down.',
      'Inorder on a BST yields sorted values. On a plain binary tree it has no special meaning.',
      'Postorder sees children first, so it suits anything computed from subtrees, such as deletion or height.',
      'The iterative inorder stack holds exactly the ancestors whose left side is still being processed.',
    ],
    example: {
      problem: 'Binary Tree Inorder Traversal with [1,2,3,4,5]',
      lc: 94,
      walkthrough: [
        'Start with cur = 1 and an empty stack. Walk left, pushing 1, 2, 4. Now cur is null.',
        'Pop 4 and output it. It has no right child, so cur stays null. out = [4].',
        'Pop 2 and output it, then set cur = 5. out = [4,2].',
        'Push 5, then pop and output it. out = [4,2,5].',
        'Pop 1 and output it, then set cur = 3. out = [4,2,5,1].',
        'Push 3, then pop and output it. The stack and cur are both empty, so the answer is [4,2,5,1,3].',
      ],
    },
    code: `def inorder(root):
    out, st, cur = [], [], root
    while cur or st:
        while cur:
            st.append(cur)
            cur = cur.left
        cur = st.pop()
        out.append(cur.val)
        cur = cur.right
    return out`,
    complexity: 'O(n) time. O(h) space for the stack, which is O(n) on a skewed tree. Morris traversal (section 25) gets this to O(1) extra space.',
    pitfalls: [
      'Iterative preorder must push the right child before the left, because the stack pops in reverse.',
      'Writing the loop as `while st` skips the right subtree of the last popped node. The condition needs `cur or st`.',
      'Saving a shared path list at a leaf without copying it (LC 113): every saved answer ends up as the same list.',
      'Recursion can overflow on a skewed tree of 10^5 nodes, so use a stack when depth is unbounded.',
    ],
    pointsToPonder: [
      'Why can a preorder and an inorder rebuild a unique tree, while a preorder and a postorder may not?',
      'What exactly is on the iterative stack at any moment, compared with the recursive call stack?',
      'Which traversal lets you delete a tree safely, and why?',
    ],
    practice: [94, 144, 112, 113, 114],
    snippet: '1-dfs-traversals-recursive',
  },

  '2. Tree Traversal — BFS (Level Order)': {
    crux: 'Snapshot the queue size at the start of each round. Those nodes are exactly one level, so anything per-level becomes a simple loop.',
    signals: [
      '"Level by level, from left to right": the statement describes the queue order.',
      '"The values of the nodes you can see ordered from top to bottom": the last node of each level.',
      '"Largest value in each tree row" or "average value of the nodes on each level": one aggregate per level.',
      '"Minimum depth... nearest leaf node": BFS can stop at the first leaf, without visiting the whole tree.',
      '"Same depth but different parents": compare nodes within a level.',
    ],
    notThis: [
      'You need something about whole paths, as in Path Sum (LC 112): DFS holds one path at a time, while a queue mixes them.',
      'Output is grouped by column, as in Vertical Order (LC 314): you still use BFS, but the grouping key is a coordinate (section 10).',
    ],
    concepts: [
      'Level loop: read size = len(q), then pop exactly size nodes before starting the next level.',
      'The queue holds at most one level plus part of the next, so space is O(width), not O(height).',
      'Maximum Width (LC 662) needs position indices: left = 2*i, right = 2*i + 1, re-based on each level to avoid overflow.',
      'Completeness (LC 958): once BFS has seen a null, any later non-null node means the tree is not complete.',
    ],
    example: {
      problem: 'Binary Tree Right Side View with [1,2,3,4]',
      lc: 199,
      walkthrough: [
        'q = [1]. Size is 1. Pop 1, which is last in its level, so out = [1]. Enqueue 2 and 3.',
        'q = [2,3]. Size is 2. Pop 2 and enqueue its child 4.',
        'Pop 3, which is last in its level, so out = [1,3].',
        'q = [4]. Size is 1. Pop 4, which is last in its level, so out = [1,3,4].',
        'The answer is [1,3,4]. Node 4 sits in the left subtree, so "always walk right" would have missed it.',
      ],
    },
    code: `def right_side_view(root):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        size = len(q)
        for i in range(size):
            node = q.popleft()
            if i == size - 1:
                out.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return out`,
    complexity: 'O(n) time. O(w) space, where w is the widest level, up to about n/2 in a balanced tree.',
    pitfalls: [
      'Calling len(q) in the loop condition in languages where it re-evaluates: the queue grows while you iterate, so levels blend together.',
      'Minimum depth is measured to a leaf: a node with one child is not a leaf, so [1,2] has minimum depth 2.',
      'Zigzag should reverse the collected level, or fill it from both ends, instead of changing the order children are enqueued.',
      'Width indices overflow on deep skewed trees unless you subtract the leftmost index on each level.',
    ],
    pointsToPonder: [
      'Why can BFS stop early for minimum depth, and when does it still use more memory than DFS?',
      'Can you do Right Side View with DFS? What would you visit first, and what would you track?',
      'What does a null in the BFS order tell you about completeness?',
    ],
    practice: [111, 637, 102, 199, 662],
    snippet: '3-bfs-level-order',
  },

  '3. Tree Construction / Serialization': {
    crux: 'Preorder or postorder tells you the root; inorder tells you which values fall left and right of it. Add null markers and a single traversal is enough on its own.',
    signals: [
      '"Given two integer arrays preorder and inorder... construct and return the binary tree": a root sequence plus a splitting sequence.',
      '"Design an algorithm to serialize and deserialize": you choose the format, and preorder with null markers is the shortest to write.',
      '"Convert a sorted array to a height-balanced BST": pick the middle as root, then recurse on each side.',
      '"descriptions[i] = [parent, child, isLeft]": build nodes with a hash map, then find the one value that is never a child.',
      '"Create a root node whose value is the maximum": the shape comes from the values, so think recursion or a monotonic stack.',
    ],
    notThis: [
      'You only need to check a serialization, as in Verify Preorder Serialization (LC 331): count open slots instead of building nodes.',
      'Preorder and postorder together, as in LC 889: without inorder the tree may not be unique, so the problem accepts any valid answer.',
    ],
    concepts: [
      'A hash map from value to inorder index avoids scanning for the root at every call, which turns O(n²) into O(n).',
      'Consume preorder from the front and build left first. Consume postorder from the back and build right first.',
      'A BST needs only its preorder (LC 1008), because the ordering already separates left from right.',
      'Null markers make a preorder unambiguous, since each token says exactly where a subtree ends.',
    ],
    example: {
      problem: 'Construct Binary Tree from Preorder and Inorder with preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      lc: 105,
      walkthrough: [
        'pos = {9:0, 3:1, 15:2, 20:3, 7:4}. Call build(0,4).',
        'The next preorder value is 3, at inorder index 1. Left range is (0,0) and right range is (2,4).',
        'build(0,0): the next value is 9, at inorder index 0. Both of its ranges are empty, so 9 is a leaf.',
        'build(2,4): the next value is 20, at index 3. Left range is (2,2) and right range is (4,4).',
        'build(2,2) takes 15 and build(4,4) takes 7, and both are leaves.',
        'The result is [3,9,20,null,null,15,7], which matches the expected tree.',
      ],
    },
    code: `def build_tree(preorder, inorder):
    pos = {v: i for i, v in enumerate(inorder)}
    it = iter(preorder)
    def build(lo, hi):
        if lo > hi:
            return None
        node = TreeNode(next(it))
        mid = pos[node.val]
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(inorder) - 1)`,
    complexity: 'O(n) time and O(n) space for the map and recursion. Slicing arrays at each call makes it O(n²).',
    pitfalls: [
      'Building the right subtree first when reading preorder from the front: values get assigned to the wrong nodes.',
      'The value-to-index map assumes unique values, which LC 105 guarantees. With duplicates the split is ambiguous.',
      'Serializing without a delimiter: "1,2" and "12" must stay different, so always separate tokens.',
      'Forgetting the empty tree: serialize should produce a valid token, and deserialize should return null for it.',
    ],
    pointsToPonder: [
      'Why can a BST be rebuilt from its preorder alone, without null markers?',
      'What does "open slots" count in LC 331, and why must it never hit zero before the end?',
      'How would you rebuild from preorder in O(n) without a hash map, using value bounds instead?',
    ],
    practice: [108, 105, 1008, 2196, 297],
    snippet: '5-build-tree-from-preorder-inorder',
  },

  '4. Binary Search Tree (BST) — Search / Validation / Operations': {
    crux: 'Two facts solve almost everything here: inorder is sorted, and each comparison discards a whole subtree. Decide which of the two the problem needs.',
    signals: [
      '"Kth smallest value" or "minimum absolute difference" in a BST: walk inorder, since it visits values in sorted order.',
      '"Determine if it is a valid BST": pass the allowed (low, high) range down.',
      '"The values of exactly two nodes were swapped by mistake": look for out-of-order pairs in the inorder sequence.',
      '"Closest to the target" or "inorder successor of p": descend and keep the best candidate so far.',
      '"Sum of values in the inclusive range [low, high]": prune subtrees that cannot contain the range.',
    ],
    notThis: [
      'The tree has no ordering, as in LCA of a Binary Tree (LC 236): you cannot discard a side, so visit both (section 5).',
      'Unique BSTs (LC 96) counts possible shapes for 1..n: there is no tree to search, so it is a Catalan DP.',
      'Count of Smaller Numbers After Self (LC 315) is listed here, but a hand-rolled BST degrades on sorted input, so prefer a Fenwick tree (section 19).',
    ],
    concepts: [
      'Search, insert and delete are all a single root-to-node descent, costing O(h).',
      'Deleting a node with two children: copy its inorder successor\'s value, then delete that successor from the right subtree.',
      'Reverse inorder visits values from largest to smallest, which is what Convert BST to Greater Tree (LC 538) needs.',
      'LC 1382 rebalances by writing inorder to an array and rebuilding from the middle, with no rotations.',
    ],
    example: {
      problem: 'Validate Binary Search Tree with [5,4,6,null,null,3,7]',
      lc: 98,
      walkthrough: [
        'Check 5 with range (-inf, inf). It fits.',
        'Go left to 4 with range (-inf, 5). It fits, and both of its children are null.',
        'Go right to 6 with range (5, inf). It fits.',
        'Go to 6\'s left child, 3, with range (5, 6). 3 is below 5, so return False.',
        'The answer is False. Each parent-child pair looks fine on its own, but 3 sits in the right subtree of 5.',
      ],
    },
    code: `def is_valid_bst(node, lo=-inf, hi=inf):
    if not node:
        return True
    if not (lo < node.val < hi):
        return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))`,
    complexity: 'Search, insert and delete take O(h) time: O(log n) when balanced and O(n) when skewed. Validation and full inorder walks take O(n) time and O(h) space.',
    pitfalls: [
      'Checking only left.val < node.val < right.val: this misses violations from higher ancestors, as in the example above.',
      'In C++ or Java, using INT_MIN and INT_MAX as the starting bounds rejects a node holding that exact value. Use long or null bounds.',
      'Using <= where the problem requires strict ordering: LC 98 treats a duplicate as invalid.',
      'Recover BST (LC 99): adjacent swapped nodes give one inversion and distant ones give two, so handle both cases.',
    ],
    pointsToPonder: [
      'Why does keeping the inorder predecessor solve validation in O(1) extra state beyond the stack?',
      'If k-th smallest is called often while the tree changes, what would you store in each node?',
      'Why does deleting via the successor keep the BST property for both subtrees?',
    ],
    practice: [700, 938, 98, 230, 450],
    snippet: '6-bst-search-insert-validate',
  },

  '5. LCA (Lowest Common Ancestor)': {
    crux: 'The LCA is the first node, walking up, whose subtree holds both targets. Going top-down, it is the point where the two targets split apart, or the target that sits above the other.',
    signals: [
      '"The lowest node that has both p and q as descendants": the standard wording, where a node counts as its own descendant.',
      '"Shortest path from node s to node t" as directions: go up to the LCA, then down (LC 2096).',
      '"Find the distance between two nodes": depth(p) + depth(q) - 2 * depth(LCA).',
      '"Each node has a reference to its parent" with no root given: the two-pointer list intersection trick (LC 1650).',
      '"If either node does not exist, return null": the short-circuit version is no longer safe, so visit every node (LC 1644).',
    ],
    notThis: [
      'Maximum Difference Between Node and Ancestor (LC 1026) mentions ancestors, but needs no LCA: pass min and max down (section 13).',
      'All Ancestors of a Node in a DAG (LC 2192): there can be many paths, so use a topological sort.',
      'Many LCA queries on one fixed tree: O(n) per query is too slow, so preprocess with binary lifting (section 23).',
    ],
    concepts: [
      'Each call returns a target found in its subtree. If both sides return something, this node is where they split.',
      'In a BST, walk down from the root: the first value between p and q is the LCA, in O(h).',
      'With parent pointers, two walkers that swap starting nodes at the top cover equal distance, so they meet at the LCA.',
      'LC 1123 returns (depth, candidate) from each child, and the deeper side wins or a tie makes this node the answer.',
    ],
    example: {
      problem: 'Lowest Common Ancestor of a Binary Tree with [3,5,1,6,2,0,8], p = 6, q = 2',
      lc: 236,
      walkthrough: [
        'lca(3): neither target, so search both sides. Start with lca(5), also not a target.',
        'lca(6) is p, so return 6. lca(2) is q, so return 2.',
        'At 5, L = 6 and R = 2 are both found, so return 5.',
        'lca(1): its children 0 and 8 each search null subtrees and return null, so node 1 returns null.',
        'At 3, L = 5 and R = null, so return 5. The answer is node 5.',
      ],
    },
    code: `def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    L = lca(root.left, p, q)
    R = lca(root.right, p, q)
    if L and R:
        return root
    return L or R`,
    complexity: 'O(n) time and O(h) space for one query. O(h) on a BST. Binary lifting takes O(n log n) to preprocess, then O(log n) per query.',
    pitfalls: [
      'The early return at a target assumes both targets exist. If q is missing, the function wrongly returns p (LC 1644).',
      'Comparing values instead of node identity when values can repeat.',
      'In a BST, using <= when deciding to descend makes you step past the node where p equals the root.',
      'LC 2096: strip the shared prefix of the two root paths before building the directions, or you go through extra nodes.',
    ],
    pointsToPonder: [
      'What does the return value mean when the subtree contains only one target, and when it contains both?',
      'Why do two parent-pointer walkers meet at the LCA, even at different depths?',
      'How would you extend this to a whole set of target nodes (LC 1676)?',
    ],
    practice: [235, 236, 1650, 1123, 2096],
    snippet: '8-lowest-common-ancestor-binary-tree',
  },

  '6. Path Problems (Root-to-Leaf / Any Path)': {
    crux: 'First work out where the path may start, end and bend. Root-to-leaf paths carry a running value down; any-node paths return one arm up and record the bent path at each node.',
    signals: [
      '"Root-to-leaf path such that adding up all the values equals targetSum": pass the remaining sum down.',
      '"A node can only appear in the sequence at most once... does not need to pass through the root": return an arm and track a global best.',
      '"The path does not need to start at the root or end at a leaf, but it must go downwards": prefix sums (LC 437).',
      '"Longest path where each node has the same value" or "no pair of adjacent nodes share a character": two arms meeting at a node.',
    ],
    notThis: [
      'All Nodes Distance K (LC 863) cares about hops in every direction, including through parents: use BFS (section 14).',
      'Queries on many different paths in a fixed tree: use LCA with prefix values, or HLD if values change (sections 23 and 24).',
    ],
    concepts: [
      'Bent path at a node = left arm + node + right arm. It updates the answer but cannot extend upward.',
      'What you return is a straight arm: node + the better child. A parent can only continue along one side.',
      'Dropping a negative arm is the Kadane step on trees: max(gain, 0).',
      'Backtracking on root-to-leaf paths: append on the way in, pop on the way out, and copy at the leaf.',
    ],
    example: {
      problem: 'Binary Tree Maximum Path Sum with [-10,9,20,null,null,15,7]',
      lc: 124,
      walkthrough: [
        'gain(9): both children are null, so best = 9. Return 9.',
        'gain(15): best = 15, return 15. gain(7): best stays 15, return 7.',
        'gain(20): l = 15 and r = 7. The bent path is 20 + 15 + 7 = 42, so best = 42. Return 20 + 15 = 35.',
        'gain(-10): l = 9 and r = 35. The bent path is -10 + 9 + 35 = 34, below 42. Return 25.',
        'The answer is 42, on the path 15 -> 20 -> 7, which never touches the root.',
      ],
    },
    code: `def max_path_sum(root):
    best = -inf
    def gain(node):
        nonlocal best
        if not node:
            return 0
        l = max(gain(node.left), 0)
        r = max(gain(node.right), 0)
        best = max(best, node.val + l + r)
        return node.val + max(l, r)
    gain(root)
    return best`,
    complexity: 'O(n) time and O(h) space. Collecting all paths (LC 113, LC 257) can take O(n·h) extra time to copy them.',
    pitfalls: [
      'Starting best at 0: on an all-negative tree like [-3] the answer is -3, not 0.',
      'Returning the bent path to the parent: that uses a node on both sides and is not a valid path.',
      'Testing `if not node: return target == 0`: a node with one child would count its null side as a leaf. On [1,2] with target 1 this wrongly returns true.',
      'Mixing up edges and nodes: Diameter (LC 543) and Longest Univalue Path (LC 687) count edges.',
    ],
    pointsToPonder: [
      'Why can a node pass up only one arm, yet still count both arms for its own answer?',
      'When does a path problem need a separate global variable, and when does the return value carry the answer?',
      'How does the max(gain, 0) step relate to Kadane\'s algorithm on arrays?',
    ],
    practice: [112, 257, 543, 113, 124],
    snippet: '10-path-problems-max-path-sum-any-node-to-any-node',
  },

  '7. Tree Depth / Height / Diameter': {
    crux: 'Height is 1 + the taller child, collected bottom-up. Anything that combines two children, such as diameter or balance, is computed at each node in that same pass.',
    signals: [
      '"Number of nodes along the longest path from the root down to the farthest leaf": plain height.',
      '"Height-balanced" or "the depth of the two subtrees never differs by more than one": compare child heights.',
      '"Longest path between any two nodes... may or may not pass through the root": height plus a global best.',
      '"Count nodes in a complete tree in less than O(n)": equal left and right edge heights mean a perfect tree, so use 2^h - 1.',
    ],
    notThis: [
      'Minimum Height Trees (LC 310) has no fixed root: peel leaves of the graph (section 21).',
      'Maximum Width (LC 662) depends on positions within a level: use BFS with indices (section 2).',
    ],
    concepts: [
      'Depth counts from the root and height counts from the leaves, so check whether nodes or edges are being counted.',
      'Diameter through a node = height(left) + height(right), in edges, when height counts nodes.',
      'For balance, return -1 as a failure signal so that one bad subtree stops the rest of the work.',
      'A generic tree (LC 1245) needs the two largest child heights instead of left and right.',
    ],
    example: {
      problem: 'Diameter of Binary Tree with [1,2,3,4,5]',
      lc: 543,
      walkthrough: [
        'depth(4): both children are 0, so best stays 0. Return 1. depth(5) is the same and returns 1.',
        'depth(2): l = 1 and r = 1, so best = 2. Return 2.',
        'depth(3): both children are 0, so best stays 2. Return 1.',
        'depth(1): l = 2 and r = 1, so best = 3. Return 3.',
        'The answer is 3 edges, on the path 4 -> 2 -> 1 -> 3.',
      ],
    },
    code: `def diameter(root):
    best = 0
    def depth(node):
        nonlocal best
        if not node:
            return 0
        l, r = depth(node.left), depth(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)
    depth(root)
    return best`,
    complexity: 'O(n) time and O(h) space. Calling a separate height function from every node makes it O(n²) on a skewed tree.',
    pitfalls: [
      'Minimum depth written as 1 + min(l, r): on [1,2] the missing right child gives 1, but the only leaf is at depth 2.',
      'Returning the diameter instead of the height from the helper: the parent needs a height.',
      'Answering with the diameter through the root only: the longest path can live entirely inside one subtree.',
      'LC 110 is O(n²) if you recompute height at each node, so return it as you check.',
    ],
    pointsToPonder: [
      'Why is the helper\'s return value (height) different from the thing you are solving for (diameter)?',
      'Why does comparing the left and right edge depths let LC 222 skip whole subtrees?',
      'How would you find the diameter of a generic tree with two BFS runs, and why does that work?',
    ],
    practice: [104, 111, 543, 110, 662],
    snippet: '9-height-diameter',
  },

  '8. Tree Symmetry / Comparison / Isomorphism': {
    crux: 'Recurse on a pair of nodes at once. The problems differ only in which child gets paired with which.',
    signals: [
      '"Structurally identical, and the nodes have the same value": pair left with left and right with right.',
      '"A mirror of itself (i.e., symmetric around its center)": pair left with right.',
      '"After some number of flip operations": try both pairings at each node.',
      '"A subtree of root with the same structure and node values": run the same-tree check from each node, or compare serializations.',
      '"Duplicate subtrees... same structure with the same node values": give each subtree a canonical key.',
    ],
    notThis: [
      'Leaf-Similar Trees (LC 872) compares only leaf order, and the shapes can differ: collect the two leaf lists instead.',
      'Invert Binary Tree (LC 226) changes one tree instead of comparing two, so one node at a time is enough (section 9).',
      'Find Duplicate Subtrees (LC 652): comparing all pairs is too slow, so hash each subtree in postorder.',
    ],
    concepts: [
      'The base case handles three outcomes at once: both null is equal, and exactly one null is not.',
      'A symmetry check is a same-tree check between the left subtree and the mirrored right subtree.',
      'Serialization needs null markers, or two different shapes can produce the same string.',
      'Mapping each (val, left id, right id) triple to an integer id gives O(n) subtree comparison.',
    ],
    example: {
      problem: 'Symmetric Tree with [1,2,2,3,4,4,3], then [1,2,2,null,3,null,3]',
      lc: 101,
      walkthrough: [
        'First tree: mirror(2,2) has equal values, so pair the outer children and the inner children.',
        'mirror(3,3) is equal, and its child pairs are all null. mirror(4,4) likewise. The result is True.',
        'Second tree: mirror(2,2) has equal values, so pair a.left = null with b.right = 3.',
        'One side is null and the other is not, so `a is b` is False. The result is False.',
        'Both subtrees have the same left-to-right shape, which is exactly what makes the second tree asymmetric.',
      ],
    },
    code: `def is_symmetric(root):
    def mirror(a, b):
        if not a or not b:
            return a is b
        return (a.val == b.val and
                mirror(a.left, b.right) and
                mirror(a.right, b.left))
    return not root or mirror(root.left, root.right)`,
    complexity: 'Pair recursion takes O(min(n, m)) time and O(h) space. Subtree of Another Tree (LC 572) is O(n·m) naively and O(n + m) with hashing or serialization.',
    pitfalls: [
      'Comparing inorder sequences alone: [2,1] and [1,null,2] have different shapes, yet both read 1, 2.',
      'LC 572 with plain string matching: "12" contains "2", so add a separator at the start of each value.',
      'LC 951: at each node you must try both the unflipped and the flipped pairing.',
      'LC 652 with string keys is O(n²) on deep trees, because each key copies its subtree.',
    ],
    pointsToPonder: [
      'How would you write Symmetric Tree with a queue, and what goes in it?',
      'Why does a preorder with null markers uniquely identify a tree?',
      'What changes in Flip Equivalent if values are not unique?',
    ],
    practice: [100, 101, 226, 572, 951],
    snippet: '11-symmetry-same-tree',
  },

  '9. Tree Modification / Transformation': {
    crux: 'Have each recursive call return the new root of its subtree, and assign it back to the parent. Deleting and restructuring then need no parent pointer.',
    signals: [
      '"Return the root of the trimmed binary search tree": assign node.left = trim(node.left).',
      '"Delete all the leaf nodes with value target... if deleting makes the parent a leaf, it should also be deleted": handle children first.',
      '"Return the roots of the trees in the remaining forest": a deleted node releases its children as new roots.',
      '"Every key is changed to the original key plus the sum of all keys greater": reverse inorder with a running sum.',
      '"Flatten... in place" or "rearrange the tree in in-order": rewire pointers as you walk.',
    ],
    notThis: [
      'Linked List in Binary Tree (LC 1367) changes nothing: it is a matching check with pair recursion.',
      'Complete Binary Tree Inserter (LC 919) repeats an insert: keep a queue of open parents (section 27).',
    ],
    concepts: [
      'Postorder handles cascades, because children are already final when you look at the parent.',
      'Trimming a BST: if a node is below low, its whole left side is gone, so return the trimmed right child.',
      'Flatten in place: attach the right subtree to the rightmost node of the left subtree, then move left to right.',
      'Merge Two Trees (LC 617) can reuse one tree, and null on either side returns the other side.',
    ],
    example: {
      problem: 'Delete Leaves With a Given Value with [1,2,3,2,null,2,4], target = 2',
      lc: 1325,
      walkthrough: [
        'Go to the deepest left node, 2. It is a leaf with the target value, so it returns null.',
        'Its parent, also 2, now has no children, so it is a leaf too, and it returns null. Node 1\'s left is null.',
        'At node 3, the left child 2 is a leaf with the target value and returns null.',
        'The right child 4 is a leaf, but not the target, so it stays. Node 3 keeps a child and stays.',
        'Node 1 has a right child, so it stays. The result is [1,null,3,null,4].',
      ],
    },
    code: `def remove_leaf_nodes(node, target):
    if not node:
        return None
    node.left = remove_leaf_nodes(node.left, target)
    node.right = remove_leaf_nodes(node.right, target)
    if not node.left and not node.right and node.val == target:
        return None
    return node`,
    complexity: 'O(n) time and O(h) space for most of these. Morris-style flatten (LC 114) uses O(1) extra space.',
    pitfalls: [
      'Checking for a leaf before recursing misses cascading deletes: the parent only becomes a leaf after its children are gone.',
      'Calling the recursion without assigning the result, so the parent keeps pointing at the removed node.',
      'LC 114: overwriting node.right before saving it loses the subtree, and leaving node.left set breaks the list.',
      'LC 1110: the root can be deleted, and a kept node is a new root only when its parent was deleted.',
    ],
    pointsToPonder: [
      'Why does postorder suit deletion, while preorder suits copying?',
      'What makes LC 538 easy when you think of the BST as a sorted array?',
      'Which of these problems can run in O(1) extra space, and what does that require?',
    ],
    practice: [226, 617, 1325, 669, 1110],
    snippet: '12-invert-flatten',
  },

  '10. Vertical / Diagonal / Boundary Traversal': {
    crux: 'Give every node a coordinate (row, col) and group by it. Each view is just a different grouping or a different winner within a group.',
    signals: [
      '"Column by column, from top to bottom": BFS with a column number.',
      '"Sort by row, then by value when nodes share the same position": the LC 987 tiebreak.',
      '"Left boundary, then leaves, then the reversed right boundary": three separate walks.',
      '"Collect the leaves, remove them, and repeat until the tree is empty": group by height from the bottom (LC 366).',
      '"Top view" or "bottom view": the first or last node seen in each column.',
    ],
    notThis: [
      'Right Side View (LC 199) needs only depth, with no column: a level loop is enough (section 2).',
      'Print Binary Tree (LC 655) lays out a fixed grid: compute height first, then place each node by halving the offset.',
    ],
    concepts: [
      'Coordinates: the left child is (row + 1, col - 1) and the right child is (row + 1, col + 1).',
      'BFS visits columns top to bottom on its own. DFS needs an explicit row to sort by.',
      'Diagonal traversal groups by the number of left turns taken, with right children staying on the same diagonal.',
      'LC 366 groups by height: a leaf has height 0, and height is 1 + the taller child.',
    ],
    example: {
      problem: 'Binary Tree Vertical Order Traversal with [3,9,20,null,null,15,7]',
      lc: 314,
      walkthrough: [
        'Pop (3, col 0): cols[0] = [3]. Enqueue (9, -1) and (20, 1).',
        'Pop (9, -1): cols[-1] = [9]. It has no children.',
        'Pop (20, 1): cols[1] = [20]. Enqueue (15, 0) and (7, 2).',
        'Pop (15, 0): cols[0] = [3,15]. Pop (7, 2): cols[2] = [7].',
        'Read the columns in sorted order: [[9],[3,15],[20],[7]].',
      ],
    },
    code: `def vertical_order(root):
    if not root:
        return []
    cols, q = defaultdict(list), deque([(root, 0)])
    while q:
        node, c = q.popleft()
        cols[c].append(node.val)
        if node.left:
            q.append((node.left, c - 1))
        if node.right:
            q.append((node.right, c + 1))
    return [cols[c] for c in sorted(cols)]`,
    complexity: 'O(n log c) time to sort c columns, or O(n) if you track the min and max column. O(n) space. LC 987 is O(n log n), because ties need sorting.',
    pitfalls: [
      'Using DFS for LC 314 without a row: a deep left-side node would land above a shallower node in the same column.',
      'LC 987 and LC 314 break ties differently: by value in 987, and left to right in 314.',
      'Boundary of Binary Tree (LC 545): don\'t count the root or a leaf twice, since leaves also lie on the left and right edges.',
      'Bottom view: a later node at the same column overrides an earlier one, so BFS order matters.',
    ],
    pointsToPonder: [
      'Why does BFS give top-to-bottom order within a column automatically?',
      'Can you avoid sorting columns? What must you track while traversing?',
      'How does LC 366 relate to height, and why does it need no real deletion?',
    ],
    practice: [199, 366, 314, 545, 987],
    snippet: '13-vertical-order-traversal',
  },

  '11. Tree DP (DP on Trees)': {
    crux: 'Each subtree is a subproblem. Decide what a node must report to its parent, often more than one value, and combine the children in postorder.',
    signals: [
      '"Two directly-linked houses cannot both be robbed": a take-or-skip state at each node.',
      '"Minimum number of cameras needed to monitor all nodes": several node states, solved bottom-up.',
      '"Minimum number of moves required to make every node have exactly one coin": each subtree reports its surplus.',
      '"Remove one edge... maximize the product of the sums": total sum first, then each subtree sum is a candidate split.',
      '"Maximum sum of any subtree that is also a BST": return a bundle of (isBST, min, max, sum).',
    ],
    notThis: [
      'You need the answer with every node as root, as in Sum of Distances (LC 834): one pass per root is too slow, so use rerooting (section 12).',
      'Unique BSTs (LC 96) has no given tree: it is interval DP over value ranges.',
      'Minimum Cost Tree From Leaf Values (LC 1130) builds the tree from an array: use interval DP or a monotonic stack.',
    ],
    concepts: [
      'State design: list what the parent needs to make its own decision, and return exactly that.',
      'If the answer can be anywhere in the tree, return one value upward and update a global best.',
      'Returning a tuple, instead of calling the child twice, keeps the work O(n) with no memo table.',
      'Greedy works on some trees: Cameras (LC 968) places a camera as late as possible, at a leaf\'s parent.',
    ],
    example: {
      problem: 'House Robber III with [3,2,3,null,3,null,1]',
      lc: 337,
      walkthrough: [
        'The leaf 3 under node 2 returns (take 3, skip 0).',
        'Node 2: take = 2 + 0 + 0 = 2, skip = max(0,0) + max(3,0) = 3. Return (2, 3).',
        'The leaf 1 returns (1, 0).',
        'The right node 3: take = 3 + 0 + 0 = 3, skip = 0 + max(1,0) = 1. Return (3, 1).',
        'Root: take = 3 + 3 + 1 = 7, skip = max(2,3) + max(3,1) = 6. The answer is max(7, 6) = 7.',
      ],
    },
    code: `def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (take, skip)
        lt, ls = dfs(node.left)
        rt, rs = dfs(node.right)
        return (node.val + ls + rs, max(lt, ls) + max(rt, rs))
    return max(dfs(root))`,
    complexity: 'O(n) time and O(h) space, since each node returns a fixed-size state exactly once.',
    pitfalls: [
      'Summing alternate levels fails: on [2,1,3,null,4], levels give 6, but robbing 3 and 4 gives 7.',
      'The skip state must take max(take, skip) from each child, not simply the child\'s take.',
      'LC 968: treat null as covered. Otherwise you will place cameras on leaves, which is wasteful.',
      'LC 1339: pick the maximum product first and apply the modulus only at the end, or comparisons go wrong.',
    ],
    pointsToPonder: [
      'How do you know whether two states are enough, or whether a third is needed, as in LC 968?',
      'Why is the plain recursion without returned tuples exponential on a long chain?',
      'What do you return from a child that failed to be a valid BST in LC 1373?',
    ],
    practice: [543, 337, 979, 1339, 968],
    snippet: '14-tree-dp-house-robber-iii-rob-not-rob-states',
  },

  '12. Rerooting DP (Change Root Technique)': {
    crux: 'Solve for one root, then get each neighbor\'s answer from its parent\'s in O(1), because moving the root across one edge only changes what crosses that edge.',
    signals: [
      '"answer[i] is the sum of the distances between the ith node and all other nodes": one answer per node.',
      '"Return the number of possible nodes that can be the root": check every root against a fixed set of guesses.',
      'An unrooted tree with n up to 10^4 or more, and a value needed for every node: running a DFS from each one, at O(n²), will time out.',
    ],
    notThis: [
      'Only one root matters, as in Maximum Score After Applying Operations (LC 2925): it is rooted at 0, so ordinary tree DP is enough.',
      'Minimum Height Trees (LC 310) has a simpler answer: peel leaves until one or two nodes remain (section 21).',
      'Minimum Edge Weight Equilibrium Queries (LC 2846) asks about specific paths: use LCA with per-root weight counts (section 23).',
    ],
    concepts: [
      'First pass, in postorder: compute subtree sizes and the answer for root 0.',
      'Second pass, in preorder: compute each child\'s answer from its parent\'s, which is already final.',
      'Moving the root from u to v brings cnt[v] nodes one closer and pushes n - cnt[v] nodes one farther.',
      'When the merge can\'t be undone, such as max, keep the top two child values, or prefix and suffix merges.',
    ],
    example: {
      problem: 'Sum of Distances in Tree with n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]',
      lc: 834,
      walkthrough: [
        'down: the leaves 1, 3, 4, 5 have cnt = 1 and ans = 0.',
        'Node 2 has cnt = 4 and ans = 3 (three leaves, each one away). Node 0 has cnt = 6.',
        'ans[0] = (0 + 1) + (3 + 4) = 8.',
        'reroot: ans[1] = 8 - 1 + 5 = 12, and ans[2] = 8 - 4 + 2 = 6.',
        'From node 2: ans[3] = ans[4] = ans[5] = 6 - 1 + 5 = 10.',
        'The answer is [8,12,6,10,10,10].',
      ],
    },
    code: `def sum_of_distances(n, edges):
    g = [[] for _ in range(n)]
    for a, b in edges:
        g[a].append(b)
        g[b].append(a)
    cnt, ans = [1] * n, [0] * n
    def down(u, p):
        for v in g[u]:
            if v != p:
                down(v, u)
                cnt[u] += cnt[v]
                ans[u] += ans[v] + cnt[v]
    def reroot(u, p):
        for v in g[u]:
            if v != p:
                ans[v] = ans[u] - cnt[v] + (n - cnt[v])
                reroot(v, u)
    down(0, -1)
    reroot(0, -1)
    return ans`,
    complexity: 'O(n) time and O(n) space, with two passes over the n - 1 edges.',
    pitfalls: [
      'Rerooting children before their parent\'s answer is final: the second pass must go top-down.',
      'Recomputing cnt during the second pass: cnt stays relative to the original root, and the formula expects that.',
      'Recursion depth on a path-shaped tree: raise the limit or use an explicit stack.',
      'Sums can exceed 32 bits on large trees, so use long long in C++ and Java.',
    ],
    pointsToPonder: [
      'What exactly changes when the root moves across one edge, and why is everything else untouched?',
      'How would you reroot a "max distance to any node" answer, where the merge can\'t be undone?',
      'In LC 2581, why does moving the root only affect guesses about the edge you crossed?',
    ],
    practice: [310, 2925, 834, 2581, 2846],
    snippet: '22-rerooting-dp-sum-of-distances-to-all-nodes',
  },
}
