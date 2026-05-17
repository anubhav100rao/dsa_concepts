export const graphs = {
  '1. BFS / Level-Order Traversal': {
    crux: 'Layer-by-layer expansion from one (or many) sources gives shortest-path-by-edges in O(V + E) for unweighted graphs.',
    concepts: [
      'Mark visited BEFORE enqueue (not on dequeue) — otherwise the same node lands in the queue multiple times and the work blows up.',
      'Use a "(node, dist)" tuple or snapshot len(queue) at level boundary — both work, pick what reads cleaner per problem.',
      'Multi-source BFS = enqueue every source with distance 0 → equivalent to BFS from a virtual super-source.',
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
  },

  '2. DFS / Backtracking on Graphs': {
    crux: 'Recurse into unvisited neighbors; the call stack IS the path — backtrack by un-marking on the way out (only for path-enumeration problems).',
    concepts: [
      'For "count components / flood fill", a single visited set used across all roots suffices (no backtrack).',
      'For "all paths from S to T", you need to UNMARK on return to allow other branches to revisit — backtracking-style.',
      'Recursion depth = longest path; on big graphs convert to iterative DFS (explicit stack) to avoid stack overflow.',
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
  },

  '3. Topological Sort': {
    crux: 'Linearize a DAG so every edge u→v has u before v: either Kahn (BFS on zero-in-degree) or DFS-postorder reversed.',
    concepts: [
      'Kahn detects cycles for free: if fewer than n nodes get processed, there is a cycle.',
      'Toposort + DP is the canonical way to do longest path / aggregate over a DAG in O(V + E).',
      'Lexicographic toposort needs a MIN-HEAP of zero-in-degree nodes (Alien Dictionary, Sequence Reconstruction).',
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
  },

  '4. Shortest Path — Dijkstra': {
    crux: 'Min-heap of (dist, node); pop smallest, relax neighbors, skip if already finalized. Non-negative weights only.',
    concepts: [
      'Each node may be pushed multiple times; the FIRST pop with finalized dist is correct — guard with `if d > dist[u]: continue`.',
      'Augment the state with extra dimensions (stops left, obstacles eliminated, time budget) when constraints leak out of edge weights.',
      'Path with Maximum Probability / Minimum Effort: same template, swap min/max and the relaxation operator (× for prob, max-of for effort).',
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
  },

  '5. Shortest Path — Bellman-Ford / SPFA': {
    crux: 'Relax every edge V-1 times. Handles negative weights; detects negative cycles in the V-th pass.',
    concepts: [
      'Standard Bellman-Ford is O(V·E); SPFA is the queue-optimized variant — fast in practice, same worst case.',
      'Cheapest Flights with K Stops (LC 787) = K+1 RELAXATION ROUNDS on a fresh copy each round (so paths use at most K+1 edges).',
      'Negative cycle: any edge still relaxable after V-1 passes proves one exists.',
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
  },

  '6. Shortest Path — Floyd-Warshall (All-Pairs)': {
    crux: 'Triple loop with K as the OUTER loop: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). O(V³).',
    concepts: [
      'K-outer is critical: it asks "using only nodes {0..k} as intermediates, what is the best i→j?" — the recurrence depends on it.',
      'Works with negative edges (no negative cycles); a negative diagonal entry after the algorithm signals a negative cycle.',
      'Transitive closure (LC 1462): replace min with logical OR — same triple loop.',
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
  },

  '7. Union-Find (Disjoint Set Union)': {
    crux: 'Two ops on a forest of parent pointers: find(x) with path compression, union(x,y) by rank/size → near O(1) per op.',
    concepts: [
      'Path compression + union by rank/size gives O(α(n)) amortized — effectively constant.',
      'Use DSU for OFFLINE connectivity: sort queries by some threshold, add edges progressively, answer when ready (LC 1697).',
      'Components with extra info (size, min, sum) — store the info AT THE ROOT and update on union.',
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
  },

  '8. Minimum Spanning Tree (Kruskal / Prim)': {
    crux: 'Pick the lightest "safe" edge until n-1 edges chosen. Kruskal: sort edges + DSU. Prim: grow tree via min-heap.',
    concepts: [
      'MST cut property: for any cut, the lightest crossing edge belongs to SOME MST — justifies both algorithms.',
      'Kruskal is best for sparse graphs (E log E); Prim is best when the graph is given as an adjacency list / dense.',
      'Critical edges (LC 1489): an edge is critical iff removing it increases MST weight; pseudo-critical iff it appears in SOME MST.',
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
  },

  '9. Cycle Detection': {
    crux: 'Directed: DFS with 3-color (white/gray/black) — gray-on-gray = back edge = cycle. Undirected: DFS with parent / DSU.',
    concepts: [
      'Directed cycle = back edge to an ancestor on the current DFS stack (gray node).',
      'Undirected cycle (DFS): if a neighbor is visited AND not parent, you have a cycle.',
      'Undirected cycle (DSU): when union(u,v) finds them already connected, edge (u,v) closes a cycle.',
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
  },

  '10. Bipartite Graph / Graph Coloring': {
    crux: 'Try to 2-color: BFS/DFS, assign opposite color to each neighbor; conflict ⇒ not bipartite ⇔ odd cycle exists.',
    concepts: [
      'A graph is bipartite ⇔ contains no odd cycle ⇔ 2-colorable.',
      'Run BFS/DFS per component (graphs may be disconnected).',
      'For "Possible Bipartition" (LC 886), the "dislike" pairs form edges; bipartite check tells you if assignment exists.',
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
  },

  '11. Strongly Connected Components (Tarjan / Kosaraju)': {
    crux: 'Tarjan: one DFS, track disc/low + a stack of current SCC. Kosaraju: 2 DFS passes (original + reversed graph).',
    concepts: [
      'SCCs partition a directed graph; the condensation (one node per SCC) is a DAG — solve harder problems on the DAG.',
      'Tarjan: SCC closes when node\'s low == disc; pop stack until the node itself.',
      'Kosaraju: postorder on G; reverse edges; DFS in reverse postorder — each tree = one SCC.',
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
  },

  '12. Articulation Points & Bridges': {
    crux: 'DFS with disc/low timestamps. Bridge: low[v] > disc[u]. Articulation point: root with ≥2 children OR non-root with a child v where low[v] ≥ disc[u].',
    concepts: [
      'Bridge = edge whose removal disconnects the graph; articulation point = vertex whose removal does.',
      'Block-cut tree compresses biconnected components into a tree — solves "must-pass" queries elegantly.',
      'Critical Connections (LC 1192) is the textbook bridge-finding problem.',
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

