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

  '13. Tree + DFS with State (Pass Down / Collect Up)': {
    crux: 'Ask where the information lives. If it comes from ancestors, pass it as an argument; if it comes from descendants, return it. Harder problems need both.',
    signals: [
      '"No nodes with a value greater than X on the path from the root": carry the maximum down.',
      '"Maximum |a.val - b.val| where a is an ancestor of b": carry the min and max down.',
      '"At least one permutation of the node values in the path is a palindrome": carry a parity mask down.',
      '"Minimum number of moves" to balance coins across edges: return each subtree\'s surplus up.',
      '"Time needed to inform all employees": the time accumulates down the chain of managers.',
    ],
    notThis: [
      'The path can start at any ancestor and you need to count sums, as in Path Sum III (LC 437): a single value isn\'t enough, so keep a prefix map (section 15).',
      'A node\'s answer depends on nodes outside its own root path and subtree, as in Sum of Distances (LC 834): use rerooting (section 12).',
    ],
    concepts: [
      'Pass-down state is a function argument, so each branch gets its own copy and sibling paths can\'t interfere.',
      'Collect-up state is a return value, so a parent sees its children\'s finished results.',
      'A value larger than one int, such as a list, must be undone on the way back unless you copy it.',
      'Two-pass problems (LC 1339) compute a total first, then use it while walking a second time.',
    ],
    example: {
      problem: 'Maximum Difference Between Node and Ancestor with [8,3,10,1]',
      lc: 1026,
      walkthrough: [
        'dfs(8) starts with lo = 8 and hi = 8.',
        'dfs(3): lo = 3 and hi = 8. dfs(1): lo = 1 and hi = 8, and both null children return 8 - 1 = 7.',
        'Back at 3: the left side gives 7, and the null right side gives 8 - 3 = 5. Return 7.',
        'dfs(10): lo = 8 and hi = 10, and both null children return 2. Return 2.',
        'Back at 8: max(7, 2) = 7. The pair is 8 and its descendant 1.',
      ],
    },
    code: `def max_ancestor_diff(root):
    def dfs(node, lo, hi):
        if not node:
            return hi - lo
        lo, hi = min(lo, node.val), max(hi, node.val)
        return max(dfs(node.left, lo, hi), dfs(node.right, lo, hi))
    return dfs(root, root.val, root.val)`,
    complexity: 'O(n) time and O(h) space, since each node does constant work with the state it receives.',
    pitfalls: [
      'Keeping min and max in a global without restoring them: values from one branch leak into its sibling.',
      'LC 1448 counts a node equal to the path maximum as good, so compare with >=, not >.',
      'LC 979: moves are abs(surplus) on each edge, while the value returned up keeps its sign.',
      'LC 1080: a node is removed based on the result from its children, so decide after recursing, not before.',
    ],
    pointsToPonder: [
      'Why is passing an int by value a form of backtracking you get for free?',
      'Could LC 1026 be solved by returning min and max up instead? What changes?',
      'In LC 979, why does adding up the flow over each edge give the exact number of moves?',
    ],
    practice: [1448, 1026, 1376, 979, 968],
    snippet: '15-dfs-with-state-count-good-nodes',
  },

  '14. Tree + BFS / Distance Problems': {
    crux: 'Tree links only go down. Add parent links, or build an adjacency list, and the tree becomes an undirected graph where BFS measures distance from any start node.',
    signals: [
      '"All nodes that have a distance k from the target node": BFS outward from target, for k rounds.',
      '"Infection starts from a node... each minute it spreads to adjacent nodes": the answer is the BFS depth from the start.',
      '"Nearest leaf to the target k": BFS from k and stop at the first leaf.',
      '"The frog jumps to an unvisited vertex with equal probability... after t seconds": BFS rounds that carry a probability.',
    ],
    notThis: [
      'Distances from every node, as in Sum of Distances (LC 834): one BFS per node is O(n²), so reroot instead (section 12).',
      'Minimum Time to Collect All Apples (LC 1443): no distance layers are needed, because a postorder pass decides which edges to walk twice.',
      'Find Distance in a Binary Tree (LC 1740) can use BFS, but LCA and depths answer it directly (section 5).',
    ],
    concepts: [
      'Parent map: one DFS stores parent[node], and each node then has up to three neighbors.',
      'Use a seen set, because the graph is now undirected and BFS would otherwise walk straight back.',
      'In a generic tree, passing the parent is enough for DFS, but BFS rounds still need a parent or seen check.',
      'Tree diameter by two BFS runs: the farthest node from anywhere is one end of a diameter.',
    ],
    example: {
      problem: 'All Nodes Distance K with [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2',
      lc: 863,
      walkthrough: [
        'Build the parent map, so parent[5] = 3, parent[6] = 5 and so on. Start with q = [5] and seen = {5}.',
        'Round 1: pop 5. Its neighbors 6, 2 and 3 are all new, so q = [6,2,3].',
        'Round 2: pop 6, and it adds nothing new. Pop 2, adding 7 and 4.',
        'Still in round 2: pop 3. Its child 5 is seen and it has no parent, so it adds only 1.',
        'k rounds are done, so the queue holds the answer: [7,4,1].',
      ],
    },
    code: `def distance_k(root, target, k):
    parent = {}
    def link(node, par):
        if node:
            parent[node] = par
            link(node.left, node)
            link(node.right, node)
    link(root, None)
    q, seen = deque([target]), {target}
    for _ in range(k):
        for _ in range(len(q)):
            node = q.popleft()
            for nb in (node.left, node.right, parent[node]):
                if nb and nb not in seen:
                    seen.add(nb)
                    q.append(nb)
    return [n.val for n in q]`,
    complexity: 'O(n) time and O(n) space for the parent map, seen set and queue.',
    pitfalls: [
      'Forgetting the seen set: after moving to a parent, BFS walks straight back to the child.',
      'LC 2385: time is the farthest distance from the start, so the starting node counts as minute 0, not 1.',
      'LC 1377: a frog with unvisited neighbors must jump, so it can stay at the target only if it arrives exactly on time or has nowhere left to go.',
      'Keying the parent map by value breaks when values repeat, so key by node unless values are unique.',
    ],
    pointsToPonder: [
      'Why does running BFS twice find a diameter on a tree, but not on a general graph?',
      'When is LCA arithmetic better than BFS for the distance between two nodes?',
      'Could you solve LC 863 without a parent map, by returning distances from recursion?',
    ],
    practice: [863, 2385, 1443, 742, 1377],
    snippet: '19-unrooted-tree-on-graph-dfs-from-root',
  },

  '15. Tree + Prefix Sum / Hash Map': {
    crux: 'A downward path from an ancestor to a node is the difference of two root prefixes. Keep a map of the prefixes on the current root path, and undo each entry on the way back.',
    signals: [
      '"The number of paths where the sum equals targetSum... must go downwards" but can start anywhere: prefix map.',
      '"The path values can be rearranged to form a palindrome": XOR masks are prefix sums for parity.',
      '"Return all duplicate subtrees": a map from serialized subtree to count.',
      '"Split into two trees with equal sums by removing one edge": a collection of subtree sums.',
    ],
    notThis: [
      'Paths always start at the root, as in Path Sum (LC 112): a running sum is enough.',
      'The path may bend at a node, as in Maximum Path Sum (LC 124): a root prefix can\'t describe a bent path, so return arms instead (section 6).',
      'Count Good Nodes (LC 1448) and Longest Univalue Path (LC 687) are listed here but need no map: simple state is enough (section 13).',
    ],
    concepts: [
      'This is Subarray Sum Equals K on the array formed by the current root path.',
      'Seeding the map with {0: 1} counts paths that begin at the root.',
      'Add the prefix on entry and remove it on exit, so the map holds only ancestors of the current node.',
      'Subtree maps work in postorder: compute a key or sum for each subtree, then count how often it appears.',
    ],
    example: {
      problem: 'Path Sum III with [1,2,5,4], target = 6',
      lc: 437,
      walkthrough: [
        'Start with prefix = {0:1}. At node 1, s = 1. Look up 1 - 6 = -5, which gives 0. Add 1 to the map.',
        'At node 2, s = 3. Look up -3, which gives 0. Add 3 to the map.',
        'At node 4, s = 7. Look up 1, which gives 1, for the path 2 -> 4. Add 7, return, then remove 7.',
        'Back at node 2, remove 3. The map is now {0:1, 1:1}.',
        'At node 5, s = 6. Look up 0, which gives 1, for the path 1 -> 5.',
        'The total is 2. Removing 3 mattered: node 5 must not see a prefix from its sibling branch.',
      ],
    },
    code: `def path_sum(root, target):
    prefix = defaultdict(int)
    prefix[0] = 1
    def dfs(node, s):
        if not node:
            return 0
        s += node.val
        count = prefix[s - target]
        prefix[s] += 1
        count += dfs(node.left, s) + dfs(node.right, s)
        prefix[s] -= 1
        return count
    return dfs(root, 0)`,
    complexity: 'O(n) time on average and O(h) live map entries, or O(n) if zero entries stay in the map. The double-recursion version without a map is O(n·h).',
    pitfalls: [
      'Forgetting prefix[0] = 1: every path starting at the root is missed.',
      'Adding the current prefix before the lookup: with target 0, a node would match itself as an empty path.',
      'Leaving out the undo step: the count then includes pairs from different branches, which aren\'t paths.',
      'Sums can overflow 32 bits (LC 437 has large values), so use long in C++ and Java.',
    ],
    pointsToPonder: [
      'Why does this work with negative values, while a sliding window would not?',
      'What is the XOR analogue of "s - target" when counting palindromic paths in LC 2791?',
      'In LC 663, why must you leave out the whole-tree sum before searching for half of it?',
    ],
    practice: [1448, 437, 1457, 652, 663],
    snippet: '16-tree-prefix-sum-hash-map-path-sum-iii',
  },

  '16. Tree Iterator / Traversal Design': {
    crux: 'An iterator is a paused traversal. The stack holds exactly what the recursion would be waiting on, and each call does just enough work to reach the next value.',
    signals: [
      '"Implement the BSTIterator class" with next() and hasNext(): pause an inorder traversal.',
      '"Average O(1) time and use O(h) memory": this rules out flattening the whole tree into an array.',
      '"Flatten a nested list" lazily with next() and hasNext(): keep a stack of unfinished lists.',
      '"Peek at the next element without moving": cache one value ahead.',
      '"Two BSTs... a pair summing to target": walk two iterators like two pointers on sorted arrays.',
    ],
    notThis: [
      'Inorder Successor in BST (LC 285) asks once and keeps no state: a single descent is enough, with no stack.',
      'Binary Tree Upside Down (LC 156) and CBT Inserter (LC 919) are listed here but don\'t iterate: one rewires pointers and the other keeps a queue of open parents.',
    ],
    concepts: [
      'Stack invariant: the top is the next value, and each entry\'s left side is finished.',
      'Each node is pushed and popped once, so n calls cost O(n) in total even if a single call costs O(h).',
      'A reverse iterator pushes right spines and yields values from largest to smallest.',
      'Closest Values II (LC 272) walks a forward and a backward iterator from the target outward.',
    ],
    example: {
      problem: 'Binary Search Tree Iterator with [7,3,15,null,null,9,20]',
      lc: 173,
      walkthrough: [
        'Constructor: push 7 and 3 down the left spine. The stack is [7,3].',
        'next() pops 3 and returns it. It has no right child. The stack is [7].',
        'next() pops 7 and returns it, then pushes 15 and 9, so the stack is [15,9].',
        'next() returns 9. hasNext() is True, because the stack is [15].',
        'next() pops 15 and pushes 20. next() pops 20 and returns it.',
        'The stack is empty, so hasNext() is False. The values came out as 3, 7, 9, 15, 20.',
      ],
    },
    code: `class BSTIterator:
    def __init__(self, root):
        self.st = []
        self._push_left(root)
    def _push_left(self, node):
        while node:
            self.st.append(node)
            node = node.left
    def next(self):
        node = self.st.pop()
        self._push_left(node.right)
        return node.val
    def hasNext(self):
        return bool(self.st)`,
    complexity: 'next() is O(1) amortized and O(h) in the worst case. hasNext() is O(1). Space is O(h).',
    pitfalls: [
      'Flattening everything in the constructor works, but breaks the O(h) memory requirement.',
      'Forgetting to process the popped node\'s right spine: its whole right subtree gets skipped.',
      'LC 341: hasNext() must do the unpacking, because [[]] contains no integers at all.',
      'LC 284: once peek() has advanced the wrapped iterator, next() and hasNext() must check the cached value first.',
    ],
    pointsToPonder: [
      'Why is next() amortized O(1) even though one call can push a long spine?',
      'How would you make an iterator for preorder or postorder?',
      'If the tree changes between calls, what could go wrong with the saved stack?',
    ],
    practice: [173, 284, 285, 341, 272],
    snippet: '17-bst-iterator-controlled-inorder',
  },

  '17. Trie as Tree (Prefix Tree)': {
    crux: 'Words that share a prefix share a path, so a lookup costs O(word length), no matter how many words are stored.',
    signals: [
      '"startsWith" or "any previously inserted word with this prefix": the walk ends at a node, whether or not a word ends there.',
      '"\'.\' can match any letter": try every child at a wildcard.',
      '"Find all words on the board": walk the grid and trie together, so dead prefixes stop early.',
      '"Replace each word with its shortest root": stop at the first end-of-word on the walk.',
      '"Do the last characters of the stream form a word?": store the words reversed.',
    ],
    notThis: [
      'Only exact membership matters: a hash set is simpler and faster.',
      'Maximum XOR (LC 421): the alphabet is bits, so use the binary trie version (section 28).',
    ],
    concepts: [
      'A node holds a map of children and an end-of-word flag. The flag can also be a count or a value.',
      'A word ending at a node and a path passing through a node are different facts, so store them separately.',
      'Word Search II (LC 212) shares one DFS across all words, and it prunes finished branches for speed.',
      'The Tries topic covers this structure in much more depth.',
    ],
    example: {
      problem: 'Implement Trie with insert("app"), insert("apple"), search("app"), search("ap"), startsWith("ap")',
      lc: 208,
      walkthrough: [
        'insert("app") creates the path a -> p -> p and marks the last node with $.',
        'insert("apple") reuses a -> p -> p, adds l -> e, and marks e with $.',
        'search("app"): the walk succeeds and the node has $, so the result is True.',
        'search("ap"): the walk succeeds, but the node has no $, so the result is False.',
        'startsWith("ap"): the walk succeeds, which is all it needs, so the result is True.',
      ],
    },
    code: `class Trie:
    def __init__(self):
        self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True
    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node
    def search(self, word):
        node = self._walk(word)
        return node is not None and '$' in node
    def startsWith(self, prefix):
        return self._walk(prefix) is not None`,
    complexity: 'O(L) time per operation for a word of length L. O(total characters) nodes, each with up to alphabet-size children if you use arrays.',
    pitfalls: [
      'Treating a finished walk as a match: "ap" is a prefix of "app", but it was never inserted.',
      'LC 211: at a wildcard you must try all children, and a hit in any branch counts.',
      'LC 212: mark grid cells during DFS, and clear a found word so it isn\'t reported twice.',
      'LC 1032: insert the words reversed, then walk the stream backward from its newest letter.',
    ],
    pointsToPonder: [
      'When does a trie beat a sorted array with binary search?',
      'How does removing finished words speed up Word Search II?',
      'What would you store at each node to support top-3 autocomplete quickly (LC 642)?',
    ],
    practice: [208, 677, 648, 211, 212],
  },

  '18. Segment Tree': {
    crux: 'Store an aggregate for each segment of a balanced tree over the array. Any range splits into O(log n) stored pieces, and an update touches only O(log n) ancestors.',
    signals: [
      '"Update the value at an index" mixed with "sum of elements between left and right": queries and updates interleave.',
      '"Longest increasing subsequence with difference at most k": a range maximum over values, updated as you scan.',
      '"Book an event" or "falling squares": updates cover ranges of coordinates, so you need lazy propagation.',
      '"Frequency of value in the subarray" or "majority in a subarray", with many queries: an aggregate per segment.',
    ],
    notThis: [
      'No updates between queries: prefix sums answer sums in O(1) (see the Range Queries topic).',
      'Point updates with prefix sums only: a Fenwick tree is shorter (section 19).',
      'My Calendar I (LC 729) only needs its neighbors: an ordered map is simpler (section 26).',
    ],
    concepts: [
      'An iterative tree stores leaves at t[n..2n-1], and t[i] combines t[2i] and t[2i+1].',
      'The merge must be associative: sum, min, max, gcd and "best subarray" records all qualify.',
      'Lazy propagation stores a pending range update at a node and pushes it down only when needed.',
      'Coordinate compression or a dynamic tree handles value ranges up to 10^9.',
    ],
    example: {
      problem: 'Range Sum Query - Mutable with nums = [1,3,5]: sumRange(0,2), update(1,2), sumRange(0,2)',
      lc: 307,
      walkthrough: [
        'Build: n = 3, so t = [0,0,0,1,3,5]. Then t[2] = 3 + 5 = 8 and t[1] = 8 + 1 = 9.',
        'sumRange(0,2): l = 3 and r = 6. l is odd, so add t[3] = 1 and set l = 4. Halving gives l = 2 and r = 3.',
        'r is odd, so set r = 2 and add t[2] = 8, for a total of 9. Halving gives l = 1 and r = 1, so stop.',
        'update(1,2): i = 4, so t[4] = 2. Then t[2] = 2 + 5 = 7 and t[1] = 7 + 1 = 8.',
        'sumRange(0,2) now adds t[3] = 1 and t[2] = 7, which gives 8.',
      ],
    },
    code: `class NumArray:
    def __init__(self, nums):
        self.n = len(nums)
        self.t = [0] * self.n + nums
        for i in range(self.n - 1, 0, -1):
            self.t[i] = self.t[2 * i] + self.t[2 * i + 1]
    def update(self, i, val):
        i += self.n
        self.t[i] = val
        while i > 1:
            i //= 2
            self.t[i] = self.t[2 * i] + self.t[2 * i + 1]
    def sumRange(self, left, right):
        l, r = left + self.n, right + self.n + 1  # half-open
        total = 0
        while l < r:
            if l & 1:
                total += self.t[l]
                l += 1
            if r & 1:
                r -= 1
                total += self.t[r]
            l //= 2
            r //= 2
        return total`,
    complexity: 'O(n) to build, then O(log n) per query and update. O(n) space, or 4n for the recursive array layout.',
    pitfalls: [
      'Mixing inclusive and half-open ranges: this iterative form needs r + 1 on entry.',
      'The bottom-up query above can visit pieces out of order, which breaks non-commutative merges unless you keep left and right results apart.',
      'A recursive tree stored in an array needs 4n slots. Using 2n can run out of bounds.',
      'With lazy propagation, push the pending update down before you recurse into children.',
    ],
    pointsToPonder: [
      'What must be true of an operation for a segment tree to work on it?',
      'Why does any range split into only O(log n) nodes?',
      'When would you choose a dynamic tree over coordinate compression?',
    ],
    practice: [307, 729, 2080, 315, 699],
  },

  '19. Binary Indexed Tree (Fenwick Tree)': {
    crux: 'For point updates and prefix queries, index i stores the total of the lowbit(i) values ending at i. Both operations hop through O(log n) indices.',
    signals: [
      '"Number of smaller elements to the right of nums[i]": scan and count what has already been seen.',
      '"Reverse pairs" or "global inversions": counts of earlier elements in some value range.',
      '"The cost is the minimum of the number of elements strictly less than and strictly greater than": two prefix counts per insert.',
      '"Choose 3 soldiers with increasing rating": smaller on the left times larger on the right, for each middle soldier.',
    ],
    notThis: [
      'Range minimum or maximum under arbitrary updates: a Fenwick tree can\'t undo those, so use a segment tree (section 18).',
      'No updates at all: use plain prefix sums.',
      'Global and Local Inversions (LC 775) has an O(n) check: every element must be within one of its index.',
    ],
    concepts: [
      'lowbit(i) = i & -i is the lowest set bit, and it gives the size of the range index i covers.',
      'A query strips low bits on the way to 0. An update adds low bits on the way past n.',
      'A range sum is query(r) - query(l - 1).',
      'For counting by value, compress values to ranks 1..m and store counts instead of array values.',
    ],
    example: {
      problem: 'Count of Smaller Numbers After Self with [5,2,6,1]',
      lc: 315,
      walkthrough: [
        'Ranks are 1 -> 1, 2 -> 2, 5 -> 3 and 6 -> 4. Scan from the right.',
        'x = 1: query(0) = 0, then add rank 1.',
        'x = 6: query(3) = 1, because only 1 has been seen. Add rank 4.',
        'x = 2: query(1) = 1. Add rank 2.',
        'x = 5: query(2) = 2, for values 1 and 2. Add rank 3.',
        'out = [0,1,1,2], which reversed gives [2,1,1,0].',
      ],
    },
    code: `def count_smaller(nums):
    rank = {v: i + 1 for i, v in enumerate(sorted(set(nums)))}
    bit = [0] * (len(rank) + 1)
    def add(i):
        while i < len(bit):
            bit[i] += 1
            i += i & -i
    def query(i):
        total = 0
        while i > 0:
            total += bit[i]
            i -= i & -i
        return total
    out = []
    for x in reversed(nums):
        out.append(query(rank[x] - 1))
        add(rank[x])
    return out[::-1]`,
    complexity: 'O(n log n) time for sorting and n pairs of O(log n) operations. O(n) space.',
    pitfalls: [
      'Using index 0: lowbit(0) = 0, so add(0) loops forever. Keep the tree 1-indexed.',
      'Querying rank[x] instead of rank[x] - 1 counts equal values as smaller.',
      'Adding before querying makes the current element count itself.',
      'LC 493 compares against 2 * x: compress the doubled values too, and watch for 32-bit overflow.',
    ],
    pointsToPonder: [
      'Why does adding the lowbit reach exactly the indices whose ranges contain i?',
      'How can a Fenwick tree support range updates with point queries?',
      'Why does merge sort also solve LC 315 and LC 493, and how do the two approaches compare?',
    ],
    practice: [307, 1395, 775, 315, 493],
  },

  '20. N-ary / Generic Tree': {
    crux: 'The DFS and BFS are the same as for binary trees, with a loop replacing left and right. When combining results, keep the best two children.',
    signals: [
      '"Each node has a list of children": the same traversal templates apply.',
      '"manager[i] is the direct manager of employee i": a parent array, so build a children list first.',
      '"parent[i]... s[i] is the character assigned to node i": a generic tree given by parents.',
      '"Length of the longest path between any two nodes" with many children: top two heights at each node.',
    ],
    notThis: [
      'Edges are undirected, with no root given: root it yourself, and pass the parent (section 21).',
      'A problem depends on left versus right order, such as inorder: that has no general meaning here, so it probably needs a binary tree.',
    ],
    concepts: [
      'The children loop replaces the two recursive calls. A leaf simply has an empty loop.',
      'Postorder for N-ary trees can be done by reversing a modified preorder (root, then children right to left).',
      'Encoding N-ary as binary (LC 431): first child goes left, next sibling goes right.',
      'Tree of Coprimes (LC 1766) keeps, for each value, a stack of its ancestors on the current path.',
    ],
    example: {
      problem: 'Diameter of N-ary Tree with [1,null,3,2,4,null,5,6]',
      lc: 1522,
      walkthrough: [
        'Leaves 5 and 6 return height 0.',
        'Node 3: child 5 gives h = 1, so top1 = 1. Child 6 gives h = 1, so top2 = 1. best = 2. Return 1.',
        'Node 1: child 3 gives h = 2, so top1 = 2. Child 2 gives h = 1, so top2 = 1.',
        'Child 4 gives h = 1, which beats neither. best = 2 + 1 = 3.',
        'The answer is 3 edges, for example 5 -> 3 -> 1 -> 2.',
      ],
    },
    code: `def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        top1 = top2 = 0
        for c in node.children:
            h = height(c) + 1
            if h > top1:
                top1, top2 = h, top1
            elif h > top2:
                top2 = h
        best = max(best, top1 + top2)
        return top1
    height(root)
    return best`,
    complexity: 'O(n) time, since each edge is used once across all the loops. O(h) space.',
    pitfalls: [
      'Forgetting to move the old top1 into top2 when a new maximum appears.',
      'Sorting children at every node to find the top two: this adds a log factor for no benefit.',
      'LC 2246: a child can extend the path only if its character differs, but you must still recurse into it.',
      'LC 1376: the answer is the slowest chain, so take the max across children, not the sum.',
    ],
    pointsToPonder: [
      'Why are two values enough to compute a diameter at a node?',
      'How does the first-child, next-sibling encoding preserve the tree?',
      'Which binary-tree patterns have no N-ary counterpart, and why?',
    ],
    practice: [559, 589, 590, 429, 1522],
    snippet: '18-n-ary-tree-traversal',
  },

  '21. Tree on Graph (Unrooted Tree / Forest)': {
    crux: 'An unrooted tree is a connected graph with n - 1 edges. Root it anywhere, pass the parent so you never walk back, and all the rooted tools apply.',
    signals: [
      '"n nodes labeled 0 to n - 1 and n - 1 edges": a tree given as an edge list.',
      '"Determine if these edges make up a valid tree": exactly n - 1 edges, and connected.',
      '"A tree with one additional edge added... return the edge": union-find spots the first edge that closes a cycle.',
      '"Choose any node as the root... minimum height": peel leaves toward the center.',
      '"Reorient the roads so each city can reach city 0": root at 0 and count edges that point the wrong way.',
    ],
    notThis: [
      'Critical Edges in an MST (LC 1489) and Max Star Sum (LC 2497) are graph problems: the first needs Kruskal, and the second is a per-node sort.',
      'The graph can contain real cycles: use general BFS, DFS or union-find (see the Graphs topic).',
    ],
    concepts: [
      'Any tree has one or two centers, the midpoints of a diameter, and those are the minimum-height roots.',
      'Removing a node splits the tree into its child subtrees plus the rest, of size n - subtree size.',
      'In LC 685 the extra edge is directed, which can create a node with two parents, a cycle, or both.',
      'A forest has more than one component, so count them or loop over every unvisited node.',
    ],
    example: {
      problem: 'Minimum Height Trees with n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]',
      lc: 310,
      walkthrough: [
        'Degrees: node 3 has 4, node 4 has 2, the rest have 1. Leaves = [0,1,2,5], and remaining = 6.',
        'Peel: remaining becomes 2. Removing 0, 1 and 2 reduces g[3] to {4}, so 3 is a new leaf.',
        'Removing 5 reduces g[4] to {3}, so 4 is a new leaf too. Now leaves = [3,4].',
        'remaining = 2, so stop. The answer is [3,4].',
      ],
    },
    code: `def find_min_height_trees(n, edges):
    if n == 1:
        return [0]
    g = [set() for _ in range(n)]
    for a, b in edges:
        g[a].add(b)
        g[b].add(a)
    leaves = [i for i in range(n) if len(g[i]) == 1]
    remaining = n
    while remaining > 2:
        remaining -= len(leaves)
        next_leaves = []
        for leaf in leaves:
            nb = g[leaf].pop()
            g[nb].remove(leaf)
            if len(g[nb]) == 1:
                next_leaves.append(nb)
        leaves = next_leaves
    return leaves`,
    complexity: 'O(n) time and O(n) space, because each leaf is removed once and there are n - 1 edges.',
    pitfalls: [
      'n = 1 has no edges and so no leaves: return [0] explicitly.',
      'Stopping when one node remains: two centers are possible, so stop at remaining <= 2.',
      'LC 261: n - 1 edges alone isn\'t enough, because a cycle plus a disconnected node has the same count.',
      'LC 2049: removing the root or a leaf leaves a part of size 0, so multiply only non-empty parts, using 64-bit values.',
    ],
    pointsToPonder: [
      'Why can there never be more than two minimum-height roots?',
      'Why does a BFS peel by layers instead of removing leaves in any order?',
      'For LC 684, could DFS replace union-find, and at what cost?',
    ],
    practice: [323, 261, 684, 1466, 310],
    snippet: '19-unrooted-tree-on-graph-dfs-from-root',
  },

  '22. Euler Tour / Flattening Tree to Array': {
    crux: 'DFS entry order numbers every subtree as one contiguous range, so a subtree query becomes an array range query.',
    signals: [
      '"Add to a node, then report the sum of the subtree of u", many times: a range structure over the tour.',
      '"Is u an ancestor of v?" asked many times: compare entry and exit times.',
      '"For each query (node, val), consider all ancestors": answer offline during one DFS, adding on entry and removing on exit.',
      'n and q both around 10^5, with queries about whole subtrees.',
    ],
    notThis: [
      'Queries on a path from u to v: a path isn\'t a contiguous range in this order, so use LCA or HLD (sections 23 and 24).',
      'Just one subtree question: a plain DFS answers it in O(n).',
      'LC 1483 and LC 2791 are listed here, but they\'re solved by binary lifting and by path masks.',
    ],
    concepts: [
      'tin[u] is when DFS enters u, and tout[u] is the last time used inside u\'s subtree.',
      'v is in u\'s subtree exactly when tin[u] <= tin[v] <= tout[u].',
      'Place values at flat[tin[u]], then use a Fenwick or segment tree over flat.',
      'Doing the work on entry and undoing it on exit restricts a structure to the current root path, as in LC 1938.',
    ],
    example: {
      problem: 'Flatten the tree with edges 0-1, 0-2, 1-3 and values [1,2,3,4], then sum the subtree of node 1',
      walkthrough: [
        'dfs(0): tin[0] = 0. Go to node 1: tin[1] = 1. Go to node 3: tin[3] = 2 and tout[3] = 2.',
        'Back at node 1: tout[1] = 2.',
        'Go to node 2: tin[2] = 3 and tout[2] = 3. Back at node 0: tout[0] = 3.',
        'flat[tin[u]] = value[u] gives flat = [1,2,4,3].',
        'The subtree of node 1 is the range [tin[1], tout[1]] = [1,2], and its sum is 2 + 4 = 6.',
      ],
    },
    code: `def euler_tour(n, g, root=0):
    tin, tout = [0] * n, [0] * n
    timer = 0
    def dfs(u, p):
        nonlocal timer
        tin[u] = timer
        timer += 1
        for v in g[u]:
            if v != p:
                dfs(v, u)
        tout[u] = timer - 1
    dfs(root, -1)
    return tin, tout`,
    complexity: 'O(n) time and space to flatten. Each later query or update costs O(log n) with a Fenwick or segment tree.',
    pitfalls: [
      'Indexing the range structure by node id instead of tin[u]: the ranges only exist in tour order.',
      'Mixing up an inclusive tout (timer - 1, as here) with an exclusive one (timer).',
      'The recursive DFS can overflow on a path of 10^5 nodes, so use an explicit stack.',
      'The version that records a node on both entry and exit has size 2n, so ranges and arrays differ from this one.',
    ],
    pointsToPonder: [
      'Why does a subtree form one contiguous block, while a path generally does not?',
      'How would "add x to all nodes in a subtree, read one node" be done with this and a Fenwick tree?',
      'How does the entry-and-exit add/remove trick compare with a persistent structure?',
    ],
    practice: [1483, 1938, 2791],
    snippet: '20-euler-tour-flatten-subtree-to-a-range',
  },

  '23. Binary Lifting / Sparse Table on Trees': {
    crux: 'Store each node\'s 2^k-th ancestor. Any jump is a sum of powers of two, so k-th ancestor and LCA queries take O(log n).',
    signals: [
      '"Find the kth ancestor of a given node", with up to 5 * 10^4 queries: walking up one step at a time is too slow.',
      '"Distance between two nodes" for many pairs: depth arithmetic on top of LCA.',
      '"Maximum edge weight on the path from u to v": store an aggregate alongside each jump.',
      '"Jump to the k-th node on the path": split the jump at the LCA.',
    ],
    notThis: [
      'Only one LCA query: the O(n) DFS from section 5 is shorter.',
      'Subtree queries: an Euler tour is simpler (section 22).',
      'Values on the tree change between path queries: stored aggregates go stale, so use HLD (section 24).',
    ],
    concepts: [
      'up[k][v] = up[k-1][up[k-1][v]]: two jumps of 2^(k-1) make one jump of 2^k.',
      'LCA: lift the deeper node to the same depth, then lift both while their ancestors differ.',
      'After that loop, the parent of either node is the LCA.',
      'Table size is n * LOG, where 2^LOG must be larger than the maximum depth.',
    ],
    example: {
      problem: 'Kth Ancestor of a Tree Node with parent = [-1,0,0,1,1,2,2]',
      lc: 1483,
      walkthrough: [
        'up[0] = [-1,0,0,1,1,2,2]. up[1] takes the parent of the parent: [-1,-1,-1,0,0,0,0]. All later levels are -1.',
        'getKthAncestor(3,1): k = 1 in binary has bit 0 set, so node = up[0][3] = 1.',
        'getKthAncestor(5,2): k = 10 in binary has bit 1 set, so node = up[1][5] = 0.',
        'getKthAncestor(6,3): bit 0 gives up[0][6] = 2, and bit 1 gives up[1][2] = -1. The loop stops and returns -1.',
      ],
    },
    code: `class TreeAncestor:
    def __init__(self, n, parent):
        self.LOG = 16  # 2^16 > 5 * 10^4
        self.up = [parent[:]]
        for _ in range(1, self.LOG):
            prev = self.up[-1]
            self.up.append([prev[prev[v]] if prev[v] != -1 else -1
                            for v in range(n)])
    def getKthAncestor(self, node, k):
        for j in range(self.LOG):
            if node == -1:
                break
            if k >> j & 1:
                node = self.up[j][node]
        return node`,
    complexity: 'O(n log n) time and space to preprocess. O(log n) per query.',
    pitfalls: [
      'In Python, up[j][-1] silently reads the last element, so guard against -1 before indexing.',
      'In the LCA version, set the root\'s parent to itself, or use a guard. Otherwise the table holds invalid indices.',
      'LOG too small: 2^LOG must exceed the deepest possible jump.',
      'LCA descent must go from the high bit to the low bit. Going low to high overshoots.',
    ],
    pointsToPonder: [
      'Why must the shared LCA descent stop just below the LCA instead of on it?',
      'What else could you store next to up[k][v] to answer path maximums?',
      'How does the Euler tour plus sparse table approach get O(1) LCA queries?',
    ],
    practice: [1483],
    snippet: '21-binary-lifting-lca-in-o-log-n',
  },

  '24. Centroid Decomposition / Heavy-Light Decomposition': {
    crux: 'HLD cuts any path into O(log n) array segments, for updates and queries along paths. Centroid decomposition splits the tree at a balancing node, for counting over all paths.',
    signals: [
      '"Update a node, then find the maximum on the path from u to v": changing values on paths point to HLD.',
      '"Count pairs of nodes at distance exactly k": every path passes through some centroid.',
      '"Nearest marked node", with marks being added over time: store the best distance at each centroid ancestor.',
      'n and q around 10^5 where a simple per-query walk could be O(n): the tree may be a long chain.',
    ],
    notThis: [
      'Queries cover whole subtrees: an Euler tour is much shorter (section 22).',
      'Values never change and you only need path sums: root prefixes with LCA are enough (section 23).',
      'Count Paths That Can Form Palindrome (LC 2791) is listed here, but counting root masks in a hash map solves it in O(26n) (section 28).',
    ],
    concepts: [
      'HLD: the edge to the child with the largest subtree is heavy. Any root path crosses O(log n) light edges.',
      'Number nodes so each heavy chain is contiguous, then run a segment tree over those numbers.',
      'A centroid is a node whose removal leaves parts of size at most n/2, so recursion depth is O(log n).',
      'To find one, walk from any root toward a child whose subtree exceeds n/2, until no such child exists.',
    ],
    example: {
      problem: 'Find the centroid of the path 0-1-2-3-4',
      walkthrough: [
        'Rooted at 0, the subtree sizes are size[4] = 1, size[3] = 2, size[2] = 3, size[1] = 4 and size[0] = 5. n // 2 = 2.',
        'At u = 0, child 1 has size 4, above 2, so move to 1.',
        'At u = 1, child 2 has size 3, above 2, so move to 2.',
        'At u = 2, child 3 has size 2, not above 2, so return 2.',
        'Removing node 2 leaves {0,1} and {3,4}, both of size 2, which is at most n/2.',
      ],
    },
    code: `def find_centroid(n, g):
    size = [1] * n
    def dfs(u, p):
        for v in g[u]:
            if v != p:
                dfs(v, u)
                size[u] += size[v]
    dfs(0, -1)
    u, p = 0, -1
    while True:
        heavy = next((v for v in g[u]
                      if v != p and size[v] > n // 2), None)
        if heavy is None:
            return u
        u, p = heavy, u`,
    complexity: 'Finding a centroid takes O(n). Centroid decomposition does O(n log n) work overall. HLD takes O(n) to build and O(log² n) per path query with a segment tree.',
    pitfalls: [
      'HLD: on each step, jump from whichever chain head is deeper, not whichever node is deeper.',
      'HLD with edge weights: store each weight on the child, and exclude the LCA\'s own position in the last segment.',
      'Centroid: recompute sizes for each component and skip removed nodes.',
      'Centroid counting: pairs inside the same child part don\'t pass through the centroid, so subtract them.',
    ],
    pointsToPonder: [
      'Why does a light edge at least double the subtree size as you move up?',
      'Why does every path pass through exactly one centroid at the highest level that separates its ends?',
      'For a real interview, how would you check that a simpler technique isn\'t enough first?',
    ],
    practice: [2791],
  },
}
