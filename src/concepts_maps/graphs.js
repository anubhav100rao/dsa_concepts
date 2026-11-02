export const graphs = {
  '1. BFS / Level-Order Traversal': {
    crux: 'Layer-by-layer expansion from one (or many) sources gives shortest-path-by-edges in O(V + E) for unweighted graphs.',
    signals: [
      '"Minimum number of steps / moves / mutations to reach..." where every move costs the same: BFS finds it the first time it arrives.',
      '"Shortest clear path" through a binary matrix, or "nearest exit" from a position in a maze.',
      '"In one move you can..." with a start and a goal: the states are nodes, even with no graph in the input (LC 752, LC 433).',
      'The answer depends on distance in layers, like "after each minute" or "level by level".',
    ],
    notThis: [
      'Edges have different costs, as in Network Delay Time (LC 743): the fewest edges may not be the cheapest route, so use Dijkstra.',
      'You need every path or the best path by a non-distance score, as in Path with Maximum Gold (LC 1219): use DFS with backtracking.',
      'Many starting points spread at once, as in Rotting Oranges (LC 994): seed them all together, as in Multi-Source BFS.',
    ],
    concepts: [
      'Mark visited BEFORE enqueue (not on dequeue) — otherwise the same node lands in the queue multiple times and the work blows up.',
      'Use a "(node, dist)" tuple or snapshot len(queue) at level boundary — both work, pick what reads cleaner per problem.',
      'Multi-source BFS = enqueue every source with distance 0 → equivalent to BFS from a virtual super-source.',
    ],
    example: {
      problem: 'Shortest Path in Binary Matrix with [[0,0,0],[1,1,0],[1,1,0]]',
      lc: 1091,
      walkthrough: [
        'Start with q = [(0,0,1)] and mark (0,0). The third number counts cells on the path, so the start already counts as 1.',
        'Pop (0,0,1). The only free neighbor is (0,1), so push (0,1,2) and mark it.',
        'Pop (0,1,2). Free neighbors are (0,2) and (1,2), so push (0,2,3) and (1,2,3). (1,2) is a diagonal move.',
        'Pop (0,2,3). Its neighbors are all marked or walls, so nothing is pushed.',
        'Pop (1,2,3). (2,2) is free, so push (2,2,4).',
        'Pop (2,2,4). This is the bottom-right cell, so return 4.',
      ],
    },
    complexity: 'O(V + E) time and O(V) space. On an R x C grid that is O(R x C), since each cell has a fixed number of neighbors.',
    pitfalls: [
      'Marking on pop instead of push: several parents push the same cell, and on a large open grid the queue can blow up.',
      'Checking only the start cell: LC 1091 also returns -1 when the bottom-right cell is blocked.',
      'Counting edges when the problem counts cells: LC 1091 and LC 127 count the start, so they start at 1, while LC 752 counts moves from 0.',
      'Using 4 directions when the problem allows 8: LC 1091 moves diagonally.',
    ],
    pointsToPonder: [
      'Why is "mark on enqueue" correct even when multiple parents discover the same child in the same layer?',
      'When does the answer require LAYER count vs INDIVIDUAL distances — does that change the queue shape?',
      'For state-as-vertex problems (locks, puzzles), how big can the implicit graph get — and when does that force bidirectional BFS / A*?',
    ],
    code: `# Shortest Path in Binary Matrix (LC 1091)
from collections import deque
if grid[0][0] or grid[-1][-1]: return -1
n = len(grid); q = deque([(0, 0, 1)])
grid[0][0] = 1  # mark visited
dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
while q:
    r, c, d = q.popleft()
    if r == n-1 and c == n-1: return d
    for dr, dc in dirs:
        nr, nc = r+dr, c+dc
        if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
            grid[nr][nc] = 1
            q.append((nr, nc, d+1))
return -1`,
    practice: [1926, 1091, 994, 752, 127],
    snippet: '3-bfs-unweighted-shortest-path',
  },

  '2. DFS / Backtracking on Graphs': {
    crux: 'Recurse into unvisited neighbors; the call stack IS the path — backtrack by un-marking on the way out (only for path-enumeration problems).',
    signals: [
      '"Number of islands / provinces / connected components": each new unvisited cell starts one group.',
      '"All paths from source to target" or "return all possible...": the current path matters, so unmark on the way back.',
      '"Maximum area" or "total time" where a whole region or subtree adds up into one number (LC 695, LC 1376).',
      '"Surrounded regions" or "cells that can\'t reach the border": start DFS from the border and flip what is left.',
      '"Clone" or "deep copy" a graph, where you must follow every edge once and handle cycles.',
    ],
    notThis: [
      'The problem asks for the shortest route in an unweighted graph, as in LC 1091: DFS finds a path, not the shortest one, so use BFS.',
      'Edges keep arriving and you only ask about connectivity, as in Number of Islands II (LC 305): use Union-Find.',
      'The grid is big and paths are long: recursion can overflow the stack, so use an explicit stack or BFS.',
    ],
    concepts: [
      'For "count components / flood fill", a single visited set used across all roots suffices (no backtrack).',
      'For "all paths from S to T", you need to UNMARK on return to allow other branches to revisit — backtracking-style.',
      'Recursion depth = longest path; on big graphs convert to iterative DFS (explicit stack) to avoid stack overflow.',
    ],
    example: {
      problem: 'Number of Islands with [["1","1","0"],["0","0","1"],["0","1","1"]]',
      lc: 200,
      walkthrough: [
        'Scan from the top-left. (0,0) is "1", so count = 1 and dfs(0,0) starts.',
        'dfs sets (0,0) to "0", then spreads right to (0,1) and sets that to "0". Every other neighbor is water or off the grid, so this island is finished.',
        'The scan passes (0,1), (0,2), (1,0) and (1,1), which are all "0" now.',
        '(1,2) is "1", so count = 2 and dfs(1,2) starts. It clears (1,2), then (2,2), then (2,1).',
        'The rest of the scan finds only "0", so the answer is 2.',
      ],
    },
    complexity: 'O(V + E) time, or O(R x C) on a grid. Recursion uses O(V) stack in the worst case, for example a snake-shaped island.',
    pitfalls: [
      'Marking the cell after recursing instead of before: two neighbors can then re-enter each other forever.',
      'Unmarking when you only need coverage: backtracking on a flood fill turns O(R x C) into exponential work.',
      'Keeping visited marks when enumerating paths: LC 797 and LC 1219 need the mark removed on return, or other paths get blocked.',
      'Flood Fill (LC 733) with the new color equal to the old color: the "same color" check never stops unless you return early.',
    ],
    pointsToPonder: [
      'Does THIS problem need backtracking (enumerate) or just visited-tracking (cover-once)?',
      'For grid flood fill, is in-place marking (mutate grid) cleaner than a separate visited set — and when is mutation forbidden?',
      'When does DFS produce WRONG answers (shortest unweighted path) — and what is the correct alternative?',
    ],
    code: `# Number of Islands (LC 200) — DFS flood fill
def dfs(r, c):
    if not (0 <= r < R and 0 <= c < C) or grid[r][c] != '1': return
    grid[r][c] = '0'
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

R, C, count = len(grid), len(grid[0]), 0
for r in range(R):
    for c in range(C):
        if grid[r][c] == '1':
            count += 1; dfs(r, c)
return count`,
    practice: [733, 200, 695, 133, 797],
    snippet: '27-grid-dfs-number-of-islands',
  },

  '3. Topological Sort': {
    crux: 'Linearize a DAG so every edge u→v has u before v: either Kahn (BFS on zero-in-degree) or DFS-postorder reversed.',
    signals: [
      '"Prerequisites", "dependencies" or "must come before": a pair [a, b] is a directed edge.',
      '"Return an order in which you can finish all tasks", or an empty result if it can\'t be done.',
      '"Minimum time / semesters to finish all courses": count Kahn layers, or take the longest path through the DAG (LC 1136, LC 2050).',
      '"Words are sorted in an unknown alphabet": each adjacent pair gives one ordering rule (LC 269).',
      '"Recipes that need ingredients", or anything that becomes available once all its inputs are ready (LC 2115).',
    ],
    notThis: [
      'The graph is undirected, as in Graph Valid Tree (LC 261): direction has no meaning there, so use Union-Find or DFS.',
      'You only need to know whether a cycle exists and the order doesn\'t matter: 3-color DFS also works, and it\'s shorter to write (see Cycle Detection).',
      'You must order things by a cost rather than by a dependency: sort or use a heap.',
    ],
    concepts: [
      'Kahn detects cycles for free: if fewer than n nodes get processed, there is a cycle.',
      'Toposort + DP is the canonical way to do longest path / aggregate over a DAG in O(V + E).',
      'Lexicographic toposort needs a MIN-HEAP of zero-in-degree nodes (Alien Dictionary, Sequence Reconstruction).',
    ],
    example: {
      problem: 'Course Schedule II with numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      lc: 210,
      walkthrough: [
        'Each pair [a, b] adds b → a. So g[0] = [1,2], g[1] = [3], g[2] = [3], and indeg = [0,1,1,2].',
        'Only course 0 has in-degree 0, so q = [0].',
        'Pop 0, so out = [0]. indeg[1] and indeg[2] both drop to 0, so q = [1,2].',
        'Pop 1, so out = [0,1]. indeg[3] drops to 1, which isn\'t 0 yet.',
        'Pop 2, so out = [0,1,2]. indeg[3] drops to 0, so q = [3].',
        'Pop 3, so out = [0,1,2,3]. All 4 courses were processed, so this order is the answer.',
      ],
    },
    complexity: 'O(V + E) time and O(V + E) space for the adjacency list and in-degrees. A heap for the smallest-first order adds a log V factor.',
    pitfalls: [
      'Reversing the edge: in LC 207 and LC 210, [a, b] means b comes first, so the edge is b → a.',
      'Skipping the final check: if len(out) < n, a cycle stopped some nodes from ever reaching in-degree 0.',
      'Alien Dictionary (LC 269): if a longer word comes before its own prefix, like "abc" before "ab", the answer is invalid. Handle that case explicitly.',
      'Alien Dictionary (LC 269): each letter that appears needs a node, even if no ordering rule mentions it.',
    ],
    pointsToPonder: [
      'For Alien Dictionary, what edges does each adjacent pair of words contribute — and which prefix case is invalid?',
      'When you need MULTIPLE valid toposorts (counting / enumeration), what changes vs returning one?',
      'For "longest path in DAG", why is toposort + relaxation strictly better than DFS memoization?',
    ],
    code: `# Course Schedule II (LC 210) — Kahn
from collections import deque
indeg = [0]*n; g = [[] for _ in range(n)]
for a, b in prereq:
    g[b].append(a); indeg[a] += 1
q = deque(i for i in range(n) if indeg[i] == 0)
out = []
while q:
    u = q.popleft(); out.append(u)
    for v in g[u]:
        indeg[v] -= 1
        if indeg[v] == 0: q.append(v)
return out if len(out) == n else []`,
    practice: [207, 210, 802, 2115, 269],
    snippet: '7-topological-sort-kahn-s-algorithm',
  },

  '4. Shortest Path — Dijkstra': {
    crux: 'Min-heap of (dist, node); pop smallest, relax neighbors, skip if already finalized. Non-negative weights only.',
    signals: [
      '"Minimum time / cost / effort to get from A to B" with different non-negative costs on the edges.',
      '"How long until all nodes receive the signal": that is the largest shortest distance from the source (LC 743).',
      '"Minimize the maximum" along a path: same template, but a path is scored by its largest edge (LC 1631, LC 778).',
      '"Maximum probability" of a path: multiply along edges and take the largest with a max-heap (LC 1514).',
      '"Number of shortest paths": keep a counter beside dist while relaxing (LC 1976).',
    ],
    notThis: [
      'Edges can be negative: a popped node may not be final, so use Bellman-Ford.',
      'Every edge costs 1 (use BFS) or every edge costs 0 or 1 (use 0-1 BFS): both drop the log factor.',
      'You need the distance between every pair on a small graph, as in LC 1334: Floyd-Warshall is shorter to write.',
    ],
    concepts: [
      'Each node may be pushed multiple times; the FIRST pop with finalized dist is correct — guard with `if d > dist[u]: continue`.',
      'Augment the state with extra dimensions (stops left, obstacles eliminated, time budget) when constraints leak out of edge weights.',
      'Path with Maximum Probability / Minimum Effort: same template, swap min/max and the relaxation operator (× for prob, max-of for effort).',
    ],
    example: {
      problem: 'Network Delay Time with times = [[1,2,4],[1,3,1],[3,2,2]], n = 3, k = 1',
      lc: 743,
      walkthrough: [
        'Start with dist[1] = 0 and pq = [(0,1)].',
        'Pop (0,1). Relax 1 → 2 to get dist[2] = 4, and 1 → 3 to get dist[3] = 1. Now pq = [(1,3),(4,2)].',
        'Pop (1,3). Relax 3 → 2: 1 + 2 = 3 beats 4, so dist[2] = 3. Now pq = [(3,2),(4,2)].',
        'Pop (3,2). Node 2 has no outgoing edges.',
        'Pop (4,2). 4 > dist[2] = 3, so this entry is stale and gets skipped.',
        'dist[1:] = [0,3,1], so the largest is 3. The answer is 3.',
      ],
    },
    complexity: 'O(E log E) time, which is the same as O(E log V), because the heap holds up to E entries. O(V + E) space.',
    pitfalls: [
      'Leaving out the stale check `if d > dist[u]: continue`: old entries re-relax their edges and waste time.',
      'Using one dist per node when a limit also matters: in LC 787, a pricier route with fewer stops can still be the only valid one, so make the state (node, stops).',
      'Taking the maximum over dist on 1-indexed input without slicing off index 0: LC 743 would always report inf and return -1.',
      'Stopping when the target is pushed rather than when it is popped: a shorter route may still be waiting in the heap.',
      'Overflow on long paths in C++: LC 1976 needs 64-bit distances.',
    ],
    pointsToPonder: [
      'Why does Dijkstra fail on negative edges — what specific invariant breaks?',
      'When does adding a state dimension (LC 787 stops, LC 1293 obstacles) preserve Dijkstra correctness — and when does it not?',
      'Is your priority a SUM (classic), a MAX (effort), or a PRODUCT (probability) — and does that change relaxation?',
    ],
    code: `# Network Delay Time (LC 743) — Dijkstra
import heapq
g = [[] for _ in range(n+1)]
for u, v, w in times: g[u].append((v, w))
dist = [float('inf')] * (n+1); dist[k] = 0
pq = [(0, k)]
while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue
    for v, w in g[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(pq, (dist[v], v))
ans = max(dist[1:])
return ans if ans < float('inf') else -1`,
    practice: [743, 1631, 1514, 787, 778],
    snippet: '10-dijkstra-shortest-path',
  },

  '5. Shortest Path — Bellman-Ford / SPFA': {
    crux: 'Relax every edge V-1 times. Handles negative weights; detects negative cycles in the V-th pass.',
    signals: [
      '"At most k stops" or "using at most k edges": each round allows one more edge (LC 787).',
      '"Edge weights may be negative": the classic case Dijkstra can\'t handle.',
      '"Detect a negative cycle", or "can you make infinite profit" around a loop.',
      'The input is a plain list of edges and n is small enough for O(V x E).',
    ],
    notThis: [
      'All weights are non-negative with no hop limit: Dijkstra is much faster on the same input.',
      'A limit is on a resource other than hops, as in Minimum Cost to Reach Destination in Time (LC 1928): use Dijkstra or DP over (node, time).',
      'The graph is a DAG with negative edges: relax in topological order for O(V + E).',
    ],
    concepts: [
      'Standard Bellman-Ford is O(V·E); SPFA is the queue-optimized variant — fast in practice, same worst case.',
      'Cheapest Flights with K Stops (LC 787) = K+1 RELAXATION ROUNDS on a fresh copy each round (so paths use at most K+1 edges).',
      'Negative cycle: any edge still relaxable after V-1 passes proves one exists.',
    ],
    example: {
      problem: 'Cheapest Flights Within K Stops with n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2',
      lc: 787,
      walkthrough: [
        'Start with dist = [0, inf, inf]. With K stops we run K + 1 rounds, each allowing one more flight.',
        'K = 0, so one round. 0 → 1 gives nxt[1] = 100. 1 → 2 reads dist[1] = inf from the old array, so nothing happens. 0 → 2 gives nxt[2] = 500.',
        'dist = [0, 100, 500], so with K = 0 the answer is 500.',
        'K = 1 adds a second round. 1 → 2 now reads dist[1] = 100, so 200 < 500 and nxt[2] = 200.',
        'dist = [0, 100, 200], so with K = 1 the answer is 200.',
        'Without the copy, round 1 would use the fresh dist[1] = 100 in the same pass and report 200 for K = 0, which needs two flights.',
      ],
    },
    complexity: 'O(K x E) time here, or O(V x E) for the full algorithm. O(V) space. SPFA is usually faster but has the same worst case.',
    pitfalls: [
      'Updating dist in place in a hop-limited problem: one round can chain several edges and break the limit.',
      'K stops means K + 1 edges: looping K times returns the wrong answer for LC 787.',
      'Relaxing from unreached nodes in C++: inf + negative w looks like a real distance, so check dist[u] != INF first.',
      'A check after V - 1 rounds finds only negative cycles reachable from the source. Add a virtual source to cover the whole graph.',
    ],
    pointsToPonder: [
      'For LC 787, why is "copy dist before each round" essential — what bug appears if you mutate in place?',
      'Why is Dijkstra wrong on negative edges but Bellman-Ford correct — what does the relaxation order assume?',
      'When can SPFA degrade to O(V·E) — and what input patterns trigger it?',
    ],
    code: `# Cheapest Flights Within K Stops (LC 787) — Bellman-Ford
dist = [float('inf')] * n; dist[src] = 0
for _ in range(K + 1):
    nxt = dist[:]
    for u, v, w in flights:
        if dist[u] + w < nxt[v]:
            nxt[v] = dist[u] + w
    dist = nxt
return dist[dst] if dist[dst] < float('inf') else -1`,
    practice: [743, 787, 1928],
    snippet: '13-bellman-ford',
  },

  '6. Shortest Path — Floyd-Warshall (All-Pairs)': {
    crux: 'Triple loop with K as the OUTER loop: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). O(V³).',
    signals: [
      '"For every city, count the cities reachable within a distance threshold": you need all pairs (LC 1334).',
      '"Answer many queries asking whether a is a prerequisite of b": this is transitive closure (LC 1462).',
      '"Convert character x to y at a given cost", where conversions can chain (LC 2976).',
      'n is around 100 to 400 and the input is an edge list or a matrix.',
      'A later step needs distances between chosen nodes, as in bitmask TSP.',
    ],
    notThis: [
      'There is one source, or V is in the thousands: run Dijkstra or BFS from what you actually need.',
      'The graph is an unweighted tree: all-pairs is BFS from each node in O(V²), which beats O(V³).',
      'Queries only ask whether two nodes connect: Union-Find answers that in near O(1).',
    ],
    concepts: [
      'K-outer is critical: it asks "using only nodes {0..k} as intermediates, what is the best i→j?" — the recurrence depends on it.',
      'Works with negative edges (no negative cycles); a negative diagonal entry after the algorithm signals a negative cycle.',
      'Transitive closure (LC 1462): replace min with logical OR — same triple loop.',
    ],
    example: {
      problem: 'All-pairs distances with n = 3 and directed edges 0→1 (3), 1→2 (1), 0→2 (7), 2→0 (2)',
      walkthrough: [
        'Start with dist = [[0,3,7],[inf,0,1],[2,inf,0]].',
        'k = 0: 2→0→1 costs 2 + 3 = 5, so dist[2][1] = 5. Nothing else improves.',
        'k = 1: 0→1→2 costs 3 + 1 = 4, which beats 7, so dist[0][2] = 4.',
        'k = 2: 1→2→0 costs 1 + 2 = 3, so dist[1][0] = 3.',
        'Final dist = [[0,3,4],[3,0,1],[2,5,0]]. Every diagonal entry is still 0, so there is no negative cycle.',
      ],
    },
    complexity: 'O(V³) time and O(V²) space.',
    pitfalls: [
      'Putting k in an inner loop: the recurrence relies on all paths through 0..k-1 being final before k is used, and the answers come out wrong.',
      'Forgetting dist[i][i] = 0: paths through the start node then look unreachable.',
      'Adding two INF values in C++: guard the sum or use a smaller INF, or it can overflow and look negative.',
      'Overwriting parallel edges: keep the smallest with min(dist[u][v], w), as LC 2976 can list the same conversion several times.',
      'Adding only one direction for an undirected edge, as in LC 1334.',
    ],
    pointsToPonder: [
      'Why MUST k be the OUTER loop and not the inner — what wrong answer does the wrong order give?',
      'When is V³ acceptable (small V ≤ ~400) and when do you fall back to V Dijkstras instead?',
      'Can you reconstruct paths (next[i][j]) cheaply during the same triple loop?',
    ],
    code: `# Floyd-Warshall
INF = float('inf')
dist = [[INF]*n for _ in range(n)]
for i in range(n): dist[i][i] = 0
for u, v, w in edges:
    dist[u][v] = min(dist[u][v], w)
for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]`,
    practice: [1334, 1462, 399, 2976, 847],
    snippet: '16-floyd-warshall-all-pairs-shortest-path',
  },

  '7. Union-Find (Disjoint Set Union)': {
    crux: 'Two ops on a forest of parent pointers: find(x) with path compression, union(x,y) by rank/size → near O(1) per op.',
    signals: [
      '"Are these two in the same group?" with connections arriving over time.',
      '"Which edge can be removed so that the graph becomes a tree?": the first edge joining two already connected nodes (LC 684).',
      '"Accounts / friends / equations that are transitively the same": a == b and b == c means one group (LC 721, LC 990).',
      '"Queries with a limit": sort queries and edges, then add edges as the limit grows (LC 1697).',
      '"Swap any number of times": everything linked ends up in one group, which you can then rearrange (LC 1202).',
    ],
    notThis: [
      'You need the actual path or a distance: Union-Find knows only whether two nodes are connected, so use BFS or Dijkstra.',
      'Edges get deleted while you answer online: Union-Find can\'t split a group. Process offline in reverse, or use BFS.',
      'The graph is directed, as in LC 685: Union-Find ignores direction, so extra case analysis is required.',
    ],
    concepts: [
      'Path compression + union by rank/size gives O(α(n)) amortized — effectively constant.',
      'Use DSU for OFFLINE connectivity: sort queries by some threshold, add edges progressively, answer when ready (LC 1697).',
      'Components with extra info (size, min, sum) — store the info AT THE ROOT and update on union.',
    ],
    example: {
      problem: 'Redundant Connection with edges = [[1,2],[1,3],[2,3]]',
      lc: 684,
      walkthrough: [
        'Nodes are 1-indexed, so n = 4 and parent = [0,1,2,3], rank = [0,0,0,0].',
        'union(1,2): the roots differ and ranks tie. So parent[2] = 1 and rank[1] = 1.',
        'union(1,3): the roots are 1 and 3, and rank[1] is larger. So parent[3] = 1.',
        'union(2,3): find(2) = 1 and find(3) = 1. They already share a root, so union returns False.',
        'This edge closes the cycle, so the answer is [2,3].',
      ],
    },
    complexity: 'O(α(n)) amortized per operation with path compression and union by rank or size, which is effectively constant. O(n) space.',
    pitfalls: [
      'Comparing parent[a] == parent[b] instead of find(a) == find(b): parent pointers can be out of date until compressed.',
      'Linking the nodes instead of their roots: parent[a] = b loses a\'s old group.',
      'Sizing the array as n on 1-indexed input: LC 684 needs n + 1.',
      'Decrementing the component count on every union rather than only when it joins two different groups.',
      'LC 947 uses rows and columns as nodes in one array: offset the columns so that row 1 and column 1 stay separate.',
    ],
    pointsToPonder: [
      'When does DSU beat BFS/DFS for connectivity — typically streaming edges OR offline-sortable queries.',
      'For Redundant Connection II (directed, LC 685), why does plain UF not work — and what 3 cases must you handle?',
      'How do you add "rollback" support (offline dynamic connectivity) — and why does path compression conflict with it?',
    ],
    code: `# Union-Find with path compression + union by rank
parent = list(range(n)); rank = [0]*n
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]  # path compression
        x = parent[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb: return False
    if rank[ra] < rank[rb]: ra, rb = rb, ra
    parent[rb] = ra
    if rank[ra] == rank[rb]: rank[ra] += 1
    return True`,
    practice: [323, 684, 990, 1319, 721],
    snippet: '17-dsu-union-find',
  },

  '8. Minimum Spanning Tree (Kruskal / Prim)': {
    crux: 'Pick the lightest "safe" edge until n-1 edges chosen. Kruskal: sort edges + DSU. Prim: grow tree via min-heap.',
    signals: [
      '"Minimum cost to connect all points / cities" so that everything is reachable.',
      '"Connect with the fewest total wire or pipe" and no requirement on the route between any one pair.',
      '"Build a well here or lay a pipe there": a well is an edge from one virtual node (LC 1168).',
      '"Which edges appear in every minimum spanning tree?" (LC 1489).',
    ],
    notThis: [
      'The problem asks for the cheapest route between two nodes: an MST minimizes the total and can make one pair\'s route long, so use Dijkstra.',
      'Edges are directed: neither Kruskal nor Prim applies, as this needs a minimum arborescence.',
      'You only have to count how many new edges connect everything, as in LC 1319: count components, without any weights.',
    ],
    concepts: [
      'MST cut property: for any cut, the lightest crossing edge belongs to SOME MST — justifies both algorithms.',
      'Kruskal is best for sparse graphs (E log E); Prim is best when the graph is given as an adjacency list / dense.',
      'Critical edges (LC 1489): an edge is critical iff removing it increases MST weight; pseudo-critical iff it appears in SOME MST.',
    ],
    example: {
      problem: 'Min Cost to Connect All Points with points = [[0,0],[1,0],[0,1],[5,5]]',
      lc: 1584,
      walkthrough: [
        'Sorted edges (w, u, v): (1,0,1), (1,0,2), (2,1,2), (9,1,3), (9,2,3), (10,0,3).',
        '(1,0,1): 0 and 1 are in different groups, so take it. total = 1, picked = 1.',
        '(1,0,2): 0 and 2 are in different groups, so take it. total = 2, picked = 2.',
        '(2,1,2): 1 and 2 already share a group, so taking it would form a cycle. Skip it.',
        '(9,1,3): 3 is still separate, so take it. total = 11, picked = 3 = n - 1, so stop.',
        'The answer is 11.',
      ],
    },
    complexity: 'Kruskal is O(E log E) for the sort. On LC 1584, E is about n²/2, so O(n² log n) time and O(n²) space. Array-based Prim is O(n²) time and O(n) space for that dense case.',
    pitfalls: [
      'Assuming the graph is connected: LC 1135 returns -1 when picked < n - 1 at the end.',
      'Prim: marking a node when pushing instead of when popping, which locks in an edge before a cheaper one is seen.',
      'Building all n² edges for LC 1584 when n is large: Prim on an implicit graph saves the memory.',
      'LC 1168: wells are easy to miss as edges. Add a virtual node 0 with an edge of cost wells[i] to each house.',
    ],
    pointsToPonder: [
      'Why does Kruskal NEVER need to undo a union — what guarantees correctness across ties?',
      'For Prim with a min-heap, why "lazy" deletion (skip stale entries on pop) is fine — and when is the indexed-heap variant worth it?',
      'For "Min Cost to Connect All Points" (LC 1584), is the implicit complete graph (n² edges) cheap enough — or do you need Prim?',
    ],
    code: `# Min Cost to Connect All Points (LC 1584) — Kruskal
edges = []
for i in range(n):
    for j in range(i+1, n):
        edges.append((abs(pts[i][0]-pts[j][0]) + abs(pts[i][1]-pts[j][1]), i, j))
edges.sort()
parent = list(range(n))
def find(x):
    while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
    return x
total = picked = 0
for w, u, v in edges:
    ru, rv = find(u), find(v)
    if ru != rv:
        parent[ru] = rv; total += w; picked += 1
        if picked == n - 1: break
return total`,
    practice: [1584, 1135, 1168, 1489],
    snippet: '19-kruskal-mst',
  },

  '9. Cycle Detection': {
    crux: 'Directed: DFS with 3-color (white/gray/black) — gray-on-gray = back edge = cycle. Undirected: DFS with parent / DSU.',
    signals: [
      '"Can you finish all courses?": a yes means the prerequisite graph has no cycle (LC 207).',
      '"Eventually safe" nodes: those from which every path avoids a cycle (LC 802).',
      '"Is this graph a valid tree?": connected and without a cycle, so exactly n - 1 edges (LC 261).',
      '"Find the edge that, when removed, leaves a tree" (LC 684).',
      '"Longest cycle", or "a cycle of the same value in a grid" (LC 2360, LC 1559).',
    ],
    notThis: [
      'You also need the order: Kahn gives you the order and the cycle check at once.',
      'Each node has at most one outgoing edge, as in LC 2360: walk the chain with timestamps (see Functional Graph).',
      'You need to know whether the cycle has odd length: use 2-coloring (see Bipartite).',
    ],
    concepts: [
      'Directed cycle = back edge to an ancestor on the current DFS stack (gray node).',
      'Undirected cycle (DFS): if a neighbor is visited AND not parent, you have a cycle.',
      'Undirected cycle (DSU): when union(u,v) finds them already connected, edge (u,v) closes a cycle.',
    ],
    example: {
      problem: 'Directed cycle check on the diamond 0→1, 0→2, 1→3, 2→3, then again with 3→1 added',
      walkthrough: [
        'Diamond: dfs(0) makes 0 gray, then dfs(1) makes 1 gray, then dfs(3) makes 3 gray.',
        '3 has no edges, so it turns black, and so does 1.',
        'Back at 0, dfs(2) makes 2 gray. Its neighbor 3 is black, so this is not a back edge and there is no cycle.',
        '2 and 0 turn black, so the answer is False. A plain visited set would have wrongly reported a cycle at 2 → 3.',
        'With 3→1 added: 0, 1 and 3 are gray when 3 looks at 1. 1 is gray, so this is a back edge and the answer is True.',
      ],
    },
    complexity: 'O(V + E) time and O(V) space for colors and recursion. Union-Find for the undirected case is O(E α(V)).',
    pitfalls: [
      'Using a single visited flag on a directed graph: reaching a finished node through a second route isn\'t a cycle.',
      'Forgetting to set the node black on the way out: later searches then report false cycles.',
      'Undirected DFS: without skipping the parent, every edge looks like a cycle. With parallel edges, skip by edge id and not by parent node.',
      'Starting DFS from node 0 only: the cycle may be in another component.',
    ],
    pointsToPonder: [
      'Why does "visited" alone fail for directed graphs — what does the gray/black distinction capture?',
      'For undirected via DFS, what subtle bug arises with parallel edges (or self-loops) — how to guard?',
      'When is DSU strictly better for undirected cycle detection (streaming edges, offline queries)?',
    ],
    code: `# Detect cycle in directed graph (3-color DFS)
WHITE, GRAY, BLACK = 0, 1, 2
color = [WHITE] * n
def dfs(u):
    color[u] = GRAY
    for v in g[u]:
        if color[v] == GRAY: return True   # back edge
        if color[v] == WHITE and dfs(v): return True
    color[u] = BLACK
    return False
return any(color[u] == WHITE and dfs(u) for u in range(n))`,
    practice: [141, 207, 261, 802, 2360],
    snippet: '6-cycle-detection-directed-graph-dfs',
  },

  '10. Bipartite Graph / Graph Coloring': {
    crux: 'Try to 2-color: BFS/DFS, assign opposite color to each neighbor; conflict ⇒ not bipartite ⇔ odd cycle exists.',
    signals: [
      '"Split everyone into two groups so that no pair who dislike each other are together" (LC 886).',
      '"Every edge connects a node in set A to a node in set B" (LC 785).',
      '"No two adjacent nodes share a color": with two colors it is BFS, and with more it depends on the graph.',
      '"Does the graph contain an odd cycle?"',
    ],
    notThis: [
      'There are more than 2 colors and n is large: k-coloring is NP-hard in general. Flower Planting (LC 1042) is the exception, because each garden has at most 3 paths and greedy works.',
      'You need pairs and not just two sides: use bipartite matching.',
      'Conflicts go only one way, like "a must come before b": that is an ordering problem, so use topological sort.',
    ],
    concepts: [
      'A graph is bipartite ⇔ contains no odd cycle ⇔ 2-colorable.',
      'Run BFS/DFS per component (graphs may be disconnected).',
      'For "Possible Bipartition" (LC 886), the "dislike" pairs form edges; bipartite check tells you if assignment exists.',
    ],
    example: {
      problem: 'Is Graph Bipartite? with graph = [[1,2,3],[0,2],[0,1,3],[0,2]]',
      lc: 785,
      walkthrough: [
        'color = [0,0,0,0], where 0 means uncolored. Set color[0] = 1, so q = [0].',
        'Pop 0. Neighbors 1, 2 and 3 are uncolored, so each gets -1. Now q = [1,2,3].',
        'Pop 1. Neighbor 0 has color 1, which is the opposite, so that\'s fine.',
        'Neighbor 2 has color -1, the same as node 1. That is a conflict, so return False.',
        'The conflict comes from the odd cycle 0-1-2 of length 3.',
      ],
    },
    complexity: 'O(V + E) time and O(V) space.',
    pitfalls: [
      'Starting from node 0 only: LC 785 can be disconnected, so start from every uncolored node.',
      'Using colors 0 and 1 together with 0 for "uncolored": the check gets confused, so use -1 or 1 and -1.',
      'LC 886 is 1-indexed and gives a pair list, so build a both-way adjacency list of size n + 1 first.',
      'LC 2493: a bipartite check isn\'t enough. BFS from every node in each component and sum the deepest layers.',
    ],
    pointsToPonder: [
      'For DISCONNECTED graphs, why must you restart BFS from every uncolored node?',
      'BFS vs DFS for coloring — which is cleaner, and does the choice ever change the answer?',
      'How does k-coloring generalize (NP-hard for k ≥ 3) — and why is k=2 the friendly case?',
    ],
    code: `# Is Graph Bipartite? (LC 785)
from collections import deque
color = [0] * n   # 0 = uncolored, 1 / -1 = two sides
for s in range(n):
    if color[s]: continue
    color[s] = 1; q = deque([s])
    while q:
        u = q.popleft()
        for v in g[u]:
            if not color[v]:
                color[v] = -color[u]; q.append(v)
            elif color[v] == color[u]:
                return False
return True`,
    practice: [785, 886, 1042, 2493],
    snippet: '9-bipartite-graph-check',
  },

  '11. Strongly Connected Components (Tarjan / Kosaraju)': {
    crux: 'Tarjan: one DFS, track disc/low + a stack of current SCC. Kosaraju: 2 DFS passes (original + reversed graph).',
    signals: [
      '"Every city can reach every other" along directed roads, or "mutually reachable".',
      '"Group nodes so that any two in a group reach each other": each group is one SCC.',
      '"Treat each cycle as one node", then solve on what remains, which is a DAG.',
      'Clauses like "if a then b" or "a or b must hold": 2-SAT builds an implication graph.',
    ],
    notThis: [
      'The graph is undirected: reachability is symmetric, so components from DFS or Union-Find are enough.',
      'You need edges or nodes whose removal disconnects the graph, as in LC 1192: that is the bridge variant of low-link (next section).',
      'You only need to know whether any cycle exists: 3-color DFS or Kahn is simpler.',
    ],
    concepts: [
      'SCCs partition a directed graph; the condensation (one node per SCC) is a DAG — solve harder problems on the DAG.',
      'Tarjan: SCC closes when node\'s low == disc; pop stack until the node itself.',
      'Kosaraju: postorder on G; reverse edges; DFS in reverse postorder — each tree = one SCC.',
    ],
    example: {
      problem: 'Tarjan on directed edges 0→1, 1→2, 2→0, 2→3',
      walkthrough: [
        'dfs(0), dfs(1) and dfs(2) give disc = 0, 1, 2, with all three on the stack.',
        'At 2, neighbor 0 is on the stack, so low[2] = min(2, disc[0]) = 0.',
        'At 2, neighbor 3 is new. dfs(3) gives disc[3] = 3. It has no edges, so low[3] == disc[3] and it pops as the SCC [3].',
        'Back at 2, low[2] stays 0, because low[3] = 3. low[2] != disc[2], so no SCC closes here.',
        'Back at 1, low[1] = 0, so no SCC closes. Back at 0, low[0] = 0 == disc[0], so pop until 0 to get the SCC [2,1,0].',
        'The result is [[3],[2,1,0]].',
      ],
    },
    complexity: 'O(V + E) time and O(V) space, for both Tarjan and Kosaraju. Kosaraju also needs O(V + E) for the reversed graph.',
    pitfalls: [
      'Dropping the `on_stk` check: a neighbor in an already finished SCC would wrongly pull low[u] down.',
      'Calling dfs from one node only: the entry code shows the visit, and you must loop over all nodes with disc == -1.',
      'Kosaraju: running the second pass in plain order instead of reverse finishing order merges components wrongly.',
      'Deep recursion on a long chain: use an iterative version, or raise the recursion limit.',
    ],
    pointsToPonder: [
      'What does low[u] mean intuitively — "earliest disc reachable via this subtree"?',
      'Why does Kosaraju\'s second pass work — what graph property does the edge-reversal exploit?',
      'For 2-SAT, why does building the implication graph and computing SCCs solve satisfiability?',
    ],
    code: `# Tarjan's SCC
disc, low = [-1]*n, [0]*n
on_stk, stk, sccs = [False]*n, [], []
t = 0
def dfs(u):
    nonlocal t
    disc[u] = low[u] = t; t += 1
    stk.append(u); on_stk[u] = True
    for v in g[u]:
        if disc[v] == -1:
            dfs(v); low[u] = min(low[u], low[v])
        elif on_stk[v]:
            low[u] = min(low[u], disc[v])
    if low[u] == disc[u]:
        scc = []
        while True:
            x = stk.pop(); on_stk[x] = False; scc.append(x)
            if x == u: break
        sccs.append(scc)`,
    practice: [802, 2360, 1192],
    snippet: '24-tarjan-scc',
  },

  '12. Articulation Points & Bridges': {
    crux: 'DFS with disc/low timestamps. Bridge: low[v] > disc[u]. Articulation point: root with ≥2 children OR non-root with a child v where low[v] ≥ disc[u].',
    signals: [
      '"Critical connection": an edge whose removal leaves some server unable to reach another (LC 1192).',
      '"Single point of failure" in a network, as either a node or a link.',
      '"Minimum number of days to disconnect" a grid island: an articulation cell means the answer is 1 (LC 1568).',
      '"Must pass through" queries on an undirected graph.',
    ],
    notThis: [
      'The graph is directed: low-link here assumes undirected edges, so think in terms of SCCs instead.',
      'The graph is tiny, as in LC 1568 with at most 30 x 30 cells: trying each removal with a flood fill is simpler. The answer is never above 2.',
      'You must disconnect specific nodes at minimum total cost: that is a min-cut (see Network Flow).',
    ],
    concepts: [
      'Bridge = edge whose removal disconnects the graph; articulation point = vertex whose removal does.',
      'Block-cut tree compresses biconnected components into a tree — solves "must-pass" queries elegantly.',
      'Critical Connections (LC 1192) is the textbook bridge-finding problem.',
    ],
    example: {
      problem: 'Critical Connections with n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]',
      lc: 1192,
      walkthrough: [
        'g[0] = [1,2], g[1] = [0,2,3], g[2] = [1,0], g[3] = [1]. dfs(0,-1) gives disc[0] = 0.',
        'dfs(1,0) gives disc[1] = 1. Neighbor 0 is the parent, so skip it. Then dfs(2,1) gives disc[2] = 2.',
        'At 2, neighbor 1 is the parent. Neighbor 0 is already visited, so low[2] = disc[0] = 0.',
        'Back at 1, low[1] = 0. Check low[2] > disc[1]: 0 > 1 is false, so 1-2 isn\'t a bridge.',
        'dfs(3,1) gives disc[3] = 3 and low[3] = 3. Back at 1, low[3] > disc[1] is 3 > 1, so [1,3] is a bridge.',
        'Back at 0, low[1] > disc[0] is 0 > 0, which is false. The answer is [[1,3]].',
      ],
    },
    complexity: 'O(V + E) time and O(V + E) space.',
    pitfalls: [
      'Mixing up the two conditions: a bridge needs low[v] > disc[u], while an articulation point needs low[v] >= disc[u].',
      'Treating the root like any other node: the root is an articulation point only with 2 or more DFS children.',
      'Skipping by parent node when parallel edges exist: a second copy of an edge means it isn\'t a bridge, so track the edge id.',
      'Starting from node 0 only when the graph can be disconnected.',
    ],
    pointsToPonder: [
      'Why is the root case (≥2 DFS children ⇒ articulation point) different from non-root nodes?',
      'For bridges, why does the comparison use STRICT inequality (low[v] > disc[u])?',
      'Do parallel edges break the algorithm — and how do you adapt by tracking edge-id, not parent-node?',
    ],
    code: `# Critical Connections (LC 1192) — Tarjan's bridges
disc, low = [-1]*n, [0]*n; bridges = []
t = 0
def dfs(u, parent):
    nonlocal t
    disc[u] = low[u] = t; t += 1
    for v in g[u]:
        if disc[v] == -1:
            dfs(v, u); low[u] = min(low[u], low[v])
            if low[v] > disc[u]:
                bridges.append([u, v])
        elif v != parent:
            low[u] = min(low[u], disc[v])
dfs(0, -1)
return bridges`,
    practice: [1192, 1568],
    snippet: '21-bridges-in-graph-tarjan',
  },

  '13. Euler Path / Circuit': {
    crux: 'Hierholzer: DFS that consumes edges and APPENDS to the path on the way out — reverse final list.',
    concepts: [
      'Euler circuit exists ⇔ connected + all vertices have even degree (undirected) / in-deg == out-deg (directed).',
      'Euler path exists ⇔ exactly 0 or 2 odd-degree vertices (undirected) / one vertex with out-in = +1, one with -1 (directed).',
      'Reconstruct Itinerary (LC 332): visit edges in lexicographic order via a min-heap per node.',
    ],
    pointsToPonder: [
      'Why does the "append on the way out" trick give the correct order (when reversed)?',
      'How do you handle multi-edges efficiently (multiset of neighbors, or pop from a sorted list)?',
      'For de Bruijn sequences (LC 753), why does an Eulerian circuit on the (n-1)-mer graph produce the answer?',
    ],
    code: `# Reconstruct Itinerary (LC 332) — Hierholzer with min-heap
import heapq
from collections import defaultdict
g = defaultdict(list)
for u, v in sorted(tickets): heapq.heappush(g[u], v)
path = []
def dfs(u):
    while g[u]: dfs(heapq.heappop(g[u]))
    path.append(u)
dfs('JFK')
return path[::-1]`,
  },

  '14. Hamiltonian Path / TSP': {
    crux: 'Bitmask DP: dp[mask][i] = best cost to visit exactly the nodes in mask, ending at i.',
    concepts: [
      'Held-Karp TSP: O(2^n · n²) — feasible up to ~n ≤ 20.',
      'Shortest Path Visiting All Nodes (LC 847): BFS on (mask, node) states; first time mask == full ⇒ shortest.',
      'Hamiltonian path/cycle existence is NP-complete in general; bitmask DP is the standard "small-n" tractable variant.',
    ],
    pointsToPonder: [
      'Why does the state need BOTH mask and current node (not just mask)?',
      'For LC 847, why does BFS (rather than DP) work — what does each edge add (always cost 1)?',
      'When does the problem allow start/end anywhere — does that change the answer formula?',
    ],
    code: `# Shortest Path Visiting All Nodes (LC 847) — bitmask BFS
from collections import deque
n = len(g); full = (1 << n) - 1
q = deque((i, 1 << i, 0) for i in range(n))
seen = {(i, 1 << i) for i in range(n)}
while q:
    u, mask, d = q.popleft()
    if mask == full: return d
    for v in g[u]:
        nmask = mask | (1 << v)
        if (v, nmask) not in seen:
            seen.add((v, nmask))
            q.append((v, nmask, d + 1))`,
  },

  '15. Network Flow / Matching': {
    crux: 'Max-flow = min-cut. Build residual graph; augment via BFS (Edmonds-Karp) or layered DFS (Dinic\'s).',
    concepts: [
      'Bipartite matching ⇔ max-flow on a unit-capacity bipartite graph (Hopcroft-Karp is O(E√V)).',
      'Many problems reduce to flow by clever modeling: project selection, image segmentation, assignment.',
      'For interview-scale problems, bitmask DP or Hungarian usually beats raw flow code.',
    ],
    pointsToPonder: [
      'How do you MODEL the problem as a flow network — what are sources, sinks, capacities?',
      'Why does the residual graph give correctness via "augmenting paths until none exist"?',
      'When does the problem admit a simpler combinatorial algorithm (greedy, matching, DP) that avoids flow entirely?',
    ],
    code: `# Bipartite matching (Kuhn's / Hungarian) — finds max matching
match = [-1] * n_right
def try_match(u, visited):
    for v in g[u]:
        if visited[v]: continue
        visited[v] = True
        if match[v] == -1 or try_match(match[v], visited):
            match[v] = u; return True
    return False
result = 0
for u in range(n_left):
    if try_match(u, [False] * n_right): result += 1
return result`,
  },

  '16. Graph on Grid (Matrix as Graph)': {
    crux: 'Each cell is a node; neighbors = 4 (or 8) adjacent cells satisfying the problem constraint. BFS/DFS/Dijkstra as appropriate.',
    concepts: [
      'Cells become "implicit" graph nodes — no need to materialize an edge list.',
      'For "shortest path with obstacles / cost", use Dijkstra or 0-1 BFS; for plain reachability, BFS/DFS.',
      'Mutate the grid in place (mark with sentinel) when allowed — saves a visited set.',
    ],
    pointsToPonder: [
      'Is the problem direction-agnostic (4 vs 8) — and does diagonal movement change the BFS/Dijkstra setup?',
      'When does "modify in place" backfire (the input must stay clean, or you need restore-on-backtrack)?',
      'For LIP (LC 329), why is the answer computed via DP-memoization rather than BFS layers?',
    ],
    code: `# Pacific Atlantic Water Flow (LC 417) — reverse BFS from each ocean
from collections import deque
def bfs(starts):
    seen = set(starts); q = deque(starts)
    while q:
        r, c = q.popleft()
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr,nc) not in seen and h[nr][nc] >= h[r][c]:
                seen.add((nr,nc)); q.append((nr,nc))
    return seen
pac = bfs([(0,c) for c in range(C)] + [(r,0) for r in range(R)])
atl = bfs([(R-1,c) for c in range(C)] + [(r,C-1) for r in range(R)])
return list(pac & atl)`,
  },

  '17. Multi-Source BFS': {
    crux: 'Enqueue ALL sources with distance 0; one BFS computes the nearest source for every cell in O(N).',
    concepts: [
      'Equivalent to BFS from a virtual super-source connected to every real source by zero-cost edges.',
      'Walls and Gates / 01 Matrix / Rotting Oranges / As Far From Land — all the SAME multi-source template.',
      'In-place marking with the actual distance (instead of a separate `dist` array) is a common trick.',
    ],
    pointsToPonder: [
      'Why does multi-source BFS give per-cell NEAREST source (not all-source distances)?',
      'When should the sources be processed in some priority order (Dijkstra-style) instead of plain BFS?',
      'How does "land is the source" vs "water is the source" flip in As Far From Land (LC 1162)?',
    ],
    code: `# 01 Matrix (LC 542) — multi-source BFS from all 0s
from collections import deque
R, C = len(mat), len(mat[0])
INF = float('inf')
dist = [[INF]*C for _ in range(R)]
q = deque()
for r in range(R):
    for c in range(C):
        if mat[r][c] == 0: dist[r][c] = 0; q.append((r, c))
while q:
    r, c = q.popleft()
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] > dist[r][c] + 1:
            dist[nr][nc] = dist[r][c] + 1
            q.append((nr, nc))
return dist`,
  },

  '18. 0-1 BFS (Deque BFS)': {
    crux: 'Edges have weight 0 or 1: appendLEFT for 0-edges, append for 1-edges → Dijkstra in O(V+E) without a heap.',
    concepts: [
      'Invariant: deque front always has the smallest known distance — same as Dijkstra without log factor.',
      'Minimum Cost to Make Valid Path (LC 1368): moving with the arrow = 0, against = 1.',
      'Generalizes to bucket-BFS for weights in {0..k}; beyond that, use Dijkstra.',
    ],
    pointsToPonder: [
      'Why is appendleft (front) for 0-edges essential — what breaks if you append both kinds to the back?',
      'Do you still need the "skip stale" check on pop? Why or why not?',
      'How does 0-1 BFS compare to plain BFS when ALL weights are 1 (special case)?',
    ],
    code: `# Minimum Obstacle Removal to Reach Corner (LC 2290)
from collections import deque
R, C = len(grid), len(grid[0])
INF = float('inf')
dist = [[INF]*C for _ in range(R)]; dist[0][0] = 0
dq = deque([(0, 0)])
while dq:
    r, c = dq.popleft()
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C:
            w = grid[nr][nc]
            if dist[r][c] + w < dist[nr][nc]:
                dist[nr][nc] = dist[r][c] + w
                if w == 0: dq.appendleft((nr, nc))
                else:      dq.append((nr, nc))
return dist[R-1][C-1]`,
  },

  '19. Bidirectional BFS': {
    crux: 'Expand from both source AND target, always growing the smaller frontier; meet in the middle ⇒ O(b^(d/2)) vs O(b^d).',
    concepts: [
      'Use two sets (or two queues) — expand the SMALLER set each iteration.',
      'Word Ladder (LC 127) is the canonical use; transformations are the implicit edges.',
      'Detect "meet" via set intersection: any neighbor of front that lies in back ⇒ done.',
    ],
    pointsToPonder: [
      'Why is expanding the smaller frontier always correct (not just heuristic)?',
      'Can you reconstruct an actual path (not just length) with bidirectional BFS — what do you need to track?',
      'When does bidirectional BFS NOT help (target unknown, asymmetric edges, etc.)?',
    ],
    code: `# Word Ladder (LC 127) — bidirectional BFS
words = set(wordList)
if endWord not in words: return 0
front, back = {beginWord}, {endWord}
steps = 1
while front and back:
    if len(front) > len(back): front, back = back, front
    nxt = set()
    for w in front:
        for i in range(len(w)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                cand = w[:i] + c + w[i+1:]
                if cand in back: return steps + 1
                if cand in words:
                    nxt.add(cand); words.discard(cand)
    front = nxt; steps += 1
return 0`,
  },

  '20. A* / Heuristic Search': {
    crux: 'Priority queue keyed on f(n) = g(n) + h(n); admissible h (never overestimates) guarantees optimality.',
    concepts: [
      'A* = Dijkstra + a goal-directed heuristic that prunes the search frontier.',
      'For grid-with-diagonal-moves, Chebyshev distance is admissible; for 4-direction, Manhattan.',
      'For Sliding Puzzle (LC 773), sum of Manhattan distances of each tile to its goal is admissible.',
    ],
    pointsToPonder: [
      'Admissibility (never overestimate) vs consistency (triangle inequality) — which matters when, and why?',
      'Does A* always beat Dijkstra in PRACTICE — what about worst-case?',
      'When is the heuristic so weak (≈0) that A* degenerates to plain Dijkstra?',
    ],
    code: `# A* template (grid, Manhattan heuristic)
import heapq
def h(r, c): return abs(r - tr) + abs(c - tc)
pq = [(h(sr, sc), 0, sr, sc)]   # (f, g, r, c)
seen = {(sr, sc): 0}
while pq:
    f, g, r, c = heapq.heappop(pq)
    if (r, c) == (tr, tc): return g
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0:
            ng = g + 1
            if ng < seen.get((nr, nc), float('inf')):
                seen[(nr, nc)] = ng
                heapq.heappush(pq, (ng + h(nr, nc), ng, nr, nc))
return -1`,
  },

  '21. Graph Construction / Implicit Graphs': {
    crux: 'Define nodes and edges by the problem RULES (not by an adjacency list); explore on demand via BFS/DFS/Dijkstra.',
    concepts: [
      'States = nodes (lock combos, board configs, word strings, bus stops); transitions = edges produced on the fly.',
      'Evaluate Division (LC 399): weighted graph of variable equalities; DFS multiplies edge weights along the path.',
      'For Word Ladder, the adjacency-via-wildcard-pattern trick avoids the O(V²) naive edge list.',
    ],
    pointsToPonder: [
      'What is a node — a string, a tuple, a state, a position? Will it hash properly for the visited set?',
      'How big can the implicit graph blow up — and when does that force bidirectional BFS or A*?',
      'For wildcard-pattern indexing (Word Ladder), why is building the pattern → words map a strict speedup?',
    ],
    code: `# Evaluate Division (LC 399) — implicit weighted DFS
from collections import defaultdict
g = defaultdict(dict)
for (a, b), v in zip(equations, values):
    g[a][b] = v; g[b][a] = 1 / v
def query(s, t):
    if s not in g or t not in g: return -1.0
    seen, stk = {s}, [(s, 1.0)]
    while stk:
        u, acc = stk.pop()
        if u == t: return acc
        for v, w in g[u].items():
            if v not in seen:
                seen.add(v); stk.append((v, acc * w))
    return -1.0
return [query(a, b) for a, b in queries]`,
  },

  '22. Tree-Specific Graph Problems': {
    crux: 'Trees have no cycles ⇒ DFS without visited-tracking (just avoid the parent edge) and unique paths between pairs.',
    concepts: [
      'Diameter: 2 BFS / DFS — pick any node, find farthest u; from u, find farthest v; dist(u,v) = diameter.',
      'Minimum Height Trees (LC 310): peel leaves layer by layer until 1 or 2 centers remain.',
      'Rerooting (Sum of Distances, LC 834): one DFS for subtree info, one for transferring "up" info → answer for every root.',
    ],
    pointsToPonder: [
      'Why does the 2-BFS diameter algorithm work — what tree property guarantees correctness?',
      'For LCA, when is binary lifting (O(log n) per query) the right tool vs Tarjan offline LCA?',
      'For rerooting, what aggregation operations are "rerootable" (sum, max) vs not (median)?',
    ],
    code: `# Tree diameter (2 BFS)
from collections import deque
def far(src):
    dist = {src: 0}; q = deque([src]); best = src
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in dist:
                dist[v] = dist[u] + 1; q.append(v)
                if dist[v] > dist[best]: best = v
    return best, dist[best]
u, _ = far(0)
v, d = far(u)
return d`,
  },

  '23. Graph + DP (DP on Graphs / DAGs)': {
    crux: 'Toposort the DAG, then a linear DP fills answers in dependency order. Memoized DFS gives the same thing implicitly.',
    concepts: [
      'For longest path in a DAG, DP wins — BFS finds shortest, not longest.',
      'Cheapest Flights with K Stops (LC 787): DP with state (node, edges_used) — Bellman-Ford-style.',
      'Knight Probability / Frog Jump: state = (position, time-step or other resource).',
    ],
    pointsToPonder: [
      'Is the graph really a DAG — if cycles exist with non-negative weights, you need Dijkstra instead.',
      'When does memoized DFS blow the recursion limit (deep DAGs) — and when do you switch to iterative toposort + DP?',
      'How many extra state dimensions are required (stops, time, fuel) — and does the product fit in memory?',
    ],
    code: `# Longest Increasing Path in a Matrix (LC 329) — memo DFS on DAG
from functools import lru_cache
@lru_cache(None)
def dfs(r, c):
    best = 1
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] > grid[r][c]:
            best = max(best, 1 + dfs(nr, nc))
    return best
return max(dfs(r, c) for r in range(R) for c in range(C))`,
  },

  '24. Graph + Greedy': {
    crux: 'Reduce the problem to "pick the locally-cheapest edge / vertex" and prove no later choice changes the optimum.',
    concepts: [
      'Min Vertices to Reach All Nodes (LC 1557) = all nodes with in-degree 0 (in a DAG) — pure degree-based greedy.',
      'Min Ops to Make Network Connected (LC 1319): if #edges < n-1, impossible; else answer = components - 1.',
      'Reorder Routes (LC 1466): BFS/DFS from 0; count edges that POINT AWAY from 0 — they must be flipped.',
    ],
    pointsToPonder: [
      'What is the exchange argument for the greedy choice — can you swap a "wrong" choice for the greedy one without worsening?',
      'When does the greedy depend on a global property (component count, in-degree distribution)?',
      'For Detonate Maximum Bombs (LC 2101), is greedy (start at max-coverage bomb) actually optimal — or do you need to try all starts?',
    ],
    code: `# Min Vertices to Reach All Nodes (LC 1557)
indeg = [0] * n
for _, v in edges: indeg[v] += 1
return [i for i in range(n) if indeg[i] == 0]`,
  },

  '25. LCA / Ancestor Queries': {
    crux: 'LCA = deepest node that is an ancestor of both u and v. Compute via parent pointers + depth, binary lifting, or Euler tour + RMQ.',
    concepts: [
      'Naive LCA: walk both up to the same depth, then walk together until they meet — O(h) per query.',
      'Binary lifting: precompute up[v][k] = 2^k-th ancestor in O(n log n); LCA in O(log n) per query.',
      'Tarjan offline LCA: process all queries in a single DFS with DSU — O((n + q) α).',
    ],
    pointsToPonder: [
      'When is binary lifting worth the preprocessing — typically many queries on a static tree.',
      'Euler tour + sparse table gives O(1) LCA — when is the implementation effort justified?',
      'How does LCA help compute path distance: dist(u,v) = depth[u] + depth[v] - 2 * depth[lca(u,v)].',
    ],
    code: `# LCA of a Binary Tree (LC 236) — recursive
def lca(root, p, q):
    if not root or root == p or root == q: return root
    L = lca(root.left, p, q)
    R = lca(root.right, p, q)
    return root if L and R else (L or R)
return lca(root, p, q)`,
  },

  '26. Centroid Decomposition / Heavy-Light Decomposition': {
    crux: 'Decompose a tree into O(log n) layers so path / subtree queries become O(log² n).',
    concepts: [
      'Centroid decomposition: recursively pick the centroid (max-subtree-size minimized); good for "all paths" / distance problems.',
      'HLD: split tree into heavy chains; map each chain to a segment tree segment; path queries traverse O(log n) chains.',
      'Both give a clean way to answer "sum/max on path u→v" or "all paths of length k" in polylog per query.',
    ],
    pointsToPonder: [
      'Centroid decomposition vs HLD — when is each natural (centroid for path-counting, HLD for path-aggregation with updates)?',
      'Why does the centroid layer give O(log n) depth (not O(√n))?',
      'For HLD, why does choosing the HEAVY child (largest subtree) bound the number of chain hops by O(log n)?',
    ],
    code: `# Centroid decomposition — finding a centroid
size = [0] * n
def calc(u, p):
    size[u] = 1
    for v in g[u]:
        if v != p and not removed[v]:
            calc(v, u); size[u] += size[v]
def centroid(u, p, tree_size):
    for v in g[u]:
        if v != p and not removed[v] and size[v] > tree_size // 2:
            return centroid(v, u, tree_size)
    return u`,
  },

  '27. Functional Graph (Successor Graph)': {
    crux: 'Every node has exactly one outgoing edge (next[u]); the graph is a forest of "rho-shaped" components — a tree feeding into a cycle.',
    concepts: [
      'Floyd\'s tortoise-and-hare finds the cycle in O(n) time, O(1) space (Linked List Cycle II, Find Duplicate).',
      'Binary lifting on next[] gives O(log n) k-th-ancestor / k-th-successor queries.',
      'Maximum Employees Invited (LC 2127): each employee → favorite forms a functional graph; sum of biggest 2-cycles + tail handling.',
    ],
    pointsToPonder: [
      'Why does every functional graph component have EXACTLY ONE cycle (with trees hanging off)?',
      'Floyd\'s vs Brent\'s cycle-finding — when is the constant-factor speedup of Brent\'s worth it?',
      'For Find the Duplicate Number (LC 287), why does the array index → value mapping form a functional graph with a cycle?',
    ],
    code: `# Floyd's cycle detection (Linked List Cycle II / LC 142)
slow = fast = head
while fast and fast.next:
    slow = slow.next; fast = fast.next.next
    if slow == fast: break
else:
    return None
slow = head
while slow != fast:
    slow = slow.next; fast = fast.next
return slow`,
  },

  '28. Graph Simulation / Degree-Based': {
    crux: 'Many problems collapse to counting in/out degrees and applying a small algebraic rule — no traversal needed.',
    concepts: [
      'Find the Town Judge (LC 997): the judge has in-degree n-1 and out-degree 0.',
      'Maximal Network Rank (LC 1615): for each pair (u,v), rank = deg[u] + deg[v] - (1 if edge u-v else 0).',
      'Min Degree of a Connected Trio (LC 1761): enumerate triangles, sum (deg-2) for each vertex.',
    ],
    pointsToPonder: [
      'When does the problem ONLY need degrees — and what info would you lose by traversing instead?',
      'For Find the Celebrity (LC 277), why does the 2-pointer elimination give O(n) calls to knows()?',
      'How does parity / sum of degrees (handshake lemma) constrain feasibility?',
    ],
    code: `# Find the Town Judge (LC 997)
indeg = [0] * (n + 1); outdeg = [0] * (n + 1)
for a, b in trust:
    outdeg[a] += 1; indeg[b] += 1
for i in range(1, n + 1):
    if indeg[i] == n - 1 and outdeg[i] == 0: return i
return -1`,
  },

  '29. Advanced — Complement Graph / Virtual Graph': {
    crux: 'When the real graph is dense / huge, work on its complement (or via virtual super-nodes) to keep BFS/DFS cheap.',
    concepts: [
      'Complement-graph BFS: keep a "not visited" set; for each popped node, iterate the unvisited set and remove neighbors in the original graph from it.',
      'Virtual node merge (LC 827 Making A Large Island): treat each island as a virtual super-node so merging is O(1) per land cell.',
      'Coordinate compression (Escape a Large Maze, LC 1036): the meaningful grid is bounded by O(blocked²), not 10^6 × 10^6.',
    ],
    pointsToPonder: [
      'Why does the complement-graph BFS achieve O(V + E) amortized (each node removed from the "unvisited" set at most once)?',
      'For Making A Large Island, why is mapping each island to an id (with size) the key trick?',
      'When does coordinate compression preserve correctness — and when does it lose information?',
    ],
    code: `# Complement-graph BFS template (e.g., LC 1697 variant)
from collections import deque
unvisited = set(range(n))
def bfs(src):
    q = deque([src]); unvisited.discard(src)
    while q:
        u = q.popleft()
        nxt = []
        for v in list(unvisited):
            if v not in g[u]:    # edge exists in complement
                nxt.append(v); unvisited.discard(v)
        q.extend(nxt)`,
  },

  '30. Design / Online Graph Problems': {
    crux: 'Maintain an evolving graph; pick a structure (DSU for connectivity, adj-list + Dijkstra for distances) that updates cheaply.',
    concepts: [
      'Number of Islands II (LC 305): online DSU — for each addLand, union with 4 neighbors and update component count.',
      'Design Graph with SPC (LC 2642): rebuild adjacency on addEdge; Dijkstra per shortestPath query (or maintain APSP if queries dominate).',
      'Earliest Moment Everyone Becomes Friends (LC 1101): sort logs by time, DSU union, return time when components == 1.',
    ],
    pointsToPonder: [
      'Is the workload READ-heavy or WRITE-heavy — and does that change which structure dominates?',
      'For DSU with rollback (offline only), why does path compression conflict with undo — and what is the workaround?',
      'For online APSP, is incremental Floyd-Warshall feasible (O(n²) per added edge) or must you fall back to per-query Dijkstra?',
    ],
    code: `# Number of Islands II (LC 305) — online DSU
parent = {}; count = 0
def find(x):
    while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
    return x
def union(a, b):
    nonlocal count
    ra, rb = find(a), find(b)
    if ra != rb: parent[ra] = rb; count -= 1
out = []
for r, c in positions:
    if (r, c) in parent: out.append(count); continue
    parent[(r, c)] = (r, c); count += 1
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nb = (r+dr, c+dc)
        if nb in parent: union((r, c), nb)
    out.append(count)
return out`,
  },
}

