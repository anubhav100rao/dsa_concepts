## 1. Graph representation

**Use when:** Every graph problem starts here: pick an adjacency list, weighted or not, or move on a grid with direction arrays.

### Adjacency list — unweighted

```cpp
int n;
vector<vector<int>> g(n);

g[u].push_back(v);
g[v].push_back(u); // remove for directed graph
```

### Weighted graph

```cpp
int n;
vector<vector<pair<int,int>>> g(n); // {neighbor, weight}

g[u].push_back({v, w});
g[v].push_back({u, w}); // remove for directed
```

### Grid directions

```cpp
vector<int> dx = {-1, 0, 1, 0};
vector<int> dy = {0, 1, 0, -1};

bool valid(int x, int y, int n, int m) {
    return x >= 0 && y >= 0 && x < n && y < m;
}
```

**Complexity:** The adjacency list takes O(V + E) space, and adding an edge is O(1). `valid` is O(1).

**Example:** With n = 3 and edges 0-1, 1-2, you get `g = [[1], [0, 2], [1]]`. On a 2 x 2 grid, `valid(1, 1, 2, 2)` is true and `valid(0, 2, 2, 2)` is false.

**Pitfalls:**

- Forgetting the reverse edge for undirected input, or adding one for directed input.
- 1-indexed input needs `g(n + 1)`.
- On a grid, `n` is rows and `m` is columns. Swapping them only shows up on non-square grids.

**Used in:** LC 200, LC 207, LC 743, LC 1091

---

## 2. DFS — connected components

**Use when:** "Count connected components / provinces" or "can every room be reached?"

```cpp
vector<int> vis(n, 0);

void dfs(int u) {
    vis[u] = 1;

    for (int v : g[u]) {
        if (!vis[v]) {
            dfs(v);
        }
    }
}

int components = 0;

for (int i = 0; i < n; i++) {
    if (!vis[i]) {
        components++;
        dfs(i);
    }
}
```

**Complexity:** O(V + E) time, and O(V) space for `vis` and the recursion.

**Example:** With n = 5 and edges 0-1, 1-2, 3-4, the result is `components = 2`.

**Pitfalls:**

- Deep recursion on a long chain can overflow the stack. Use an explicit stack when V is about 10^5.
- Visited nodes are never unmarked, so this only covers nodes. It doesn't list paths.

**Used in:** LC 323, LC 547, LC 841, LC 200

---

## 3. BFS — unweighted shortest path

**Use when:** "Minimum number of moves / steps" when every edge costs the same.

```cpp
vector<int> dist(n, -1);
queue<int> q;

dist[src] = 0;
q.push(src);

while (!q.empty()) {
    int u = q.front();
    q.pop();

    for (int v : g[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With n = 4 and edges 0-1, 1-2, 0-3 from src = 0, you get `dist = [0, 1, 2, 1]`.

**Pitfalls:**

- Set dist when pushing, not when popping, or a node gets queued many times.
- `dist == -1` means unreachable. Don't take max(dist) without handling it.

**Used in:** LC 433, LC 752, LC 815, LC 1306

---

## 4. Multi-source BFS

**Use when:** "Distance to the nearest X" for every cell, or "everything spreads at the same time each minute".

```cpp
queue<pair<int,int>> q;
vector<vector<int>> dist(n, vector<int>(m, -1));

for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        if (grid[i][j] == SOURCE) {
            dist[i][j] = 0;
            q.push({i, j});
        }
    }
}

while (!q.empty()) {
    auto [x, y] = q.front();
    q.pop();

    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];

        if (valid(nx, ny, n, m) && dist[nx][ny] == -1 && grid[nx][ny] != BLOCKED) {
            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
}
```

**Complexity:** O(n x m) time and space, however many sources there are.

**Example:** With grid `[[S, ., #], [., ., S]]`, you get `dist = [[0, 1, -1], [1, 1, 0]]`.

**Pitfalls:**

- Running one BFS per source is O(k x n x m), but seeding all of them at once gives the same nearest distances.
- Blocked cells keep -1, so tell "wall" apart from "unreachable" if the answer needs it.
- LC 994: also check that no fresh orange is left at the end.

**Used in:** LC 542, LC 994, LC 286, LC 1162, LC 1765

---

## 5. Cycle detection — undirected graph DFS

**Use when:** "Does this undirected graph contain a cycle?" or "is it a valid tree?"

```cpp
vector<int> vis(n, 0);

bool dfs(int u, int parent) {
    vis[u] = 1;

    for (int v : g[u]) {
        if (!vis[v]) {
            if (dfs(v, u)) return true;
        } else if (v != parent) {
            return true;
        }
    }

    return false;
}

bool hasCycle = false;

for (int i = 0; i < n; i++) {
    if (!vis[i] && dfs(i, -1)) {
        hasCycle = true;
        break;
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** The triangle 0-1-2 gives `hasCycle = true`. The path 0-1-2 gives `false`.

**Pitfalls:**

- Parallel edges: `v != parent` skips both copies of u-v and misses the 2-cycle. Track the edge id instead.
- Don't use this on directed graphs: a visited node there isn't always on the current path.

**Used in:** LC 261, LC 684

---

## 6. Cycle detection — directed graph DFS

**Use when:** "Can all courses be finished?" or "which nodes are eventually safe?" on a directed graph.

```cpp
vector<int> color(n, 0);
// 0 = unvisited, 1 = visiting, 2 = done

bool dfs(int u) {
    color[u] = 1;

    for (int v : g[u]) {
        if (color[v] == 1) return true;
        if (color[v] == 0 && dfs(v)) return true;
    }

    color[u] = 2;
    return false;
}

bool hasCycle = false;

for (int i = 0; i < n; i++) {
    if (color[i] == 0 && dfs(i)) {
        hasCycle = true;
        break;
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** 0→1→2→0 gives `hasCycle = true`. The diamond 0→1, 0→2, 1→2 gives `false`, because 2 is already done (color 2) when it is reached a second time.

**Pitfalls:**

- A two-state visited array reports false cycles on diamonds. You need the "visiting" color.
- For LC 802, the nodes that end with color 2 are the safe ones, so keep going rather than stopping at the first cycle.

**Used in:** LC 207, LC 802, LC 210

---

## 7. Topological sort — Kahn’s algorithm

**Use when:** "Prerequisites" or "must come before": return an order, or report that none exists.

```cpp
vector<int> indegree(n, 0);

for (int u = 0; u < n; u++) {
    for (int v : g[u]) {
        indegree[v]++;
    }
}

queue<int> q;

for (int i = 0; i < n; i++) {
    if (indegree[i] == 0) q.push(i);
}

vector<int> topo;

while (!q.empty()) {
    int u = q.front();
    q.pop();

    topo.push_back(u);

    for (int v : g[u]) {
        indegree[v]--;

        if (indegree[v] == 0) {
            q.push(v);
        }
    }
}

bool hasCycle = topo.size() != n;
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With edges 0→1, 0→2, 1→3, 2→3, you get `topo = [0, 1, 2, 3]` and `hasCycle = false`.

**Pitfalls:**

- Reversed edges: in LC 207, [a, b] means b → a.
- Compare `topo.size()` with n. A cycle leaves some nodes with in-degree above 0.
- Use a min-heap instead of the queue when the smallest order in lexical terms is needed.

**Used in:** LC 207, LC 210, LC 2115, LC 1136, LC 269

---

## 8. Topological sort — DFS

**Use when:** A topological order when you already have a DFS and know the graph is a DAG.

```cpp
vector<int> vis(n, 0);
vector<int> topo;

void dfs(int u) {
    vis[u] = 1;

    for (int v : g[u]) {
        if (!vis[v]) dfs(v);
    }

    topo.push_back(u);
}

for (int i = 0; i < n; i++) {
    if (!vis[i]) dfs(i);
}

reverse(topo.begin(), topo.end());
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With edges 0→1, 0→2, 1→3, 2→3, you get `topo = [0, 2, 1, 3]`. That is a different valid order than Kahn's.

**Pitfalls:**

- It doesn't detect cycles: on a cyclic graph it still returns an order. Add the 3-color check if cycles are possible.
- Forgetting the final reverse gives the order backwards.

**Used in:** LC 207, LC 210

---

## 9. Bipartite graph check

**Use when:** "Split into two groups so that no conflicting pair is together", or "is there an odd cycle?"

```cpp
vector<int> color(n, -1);

bool bfs(int src) {
    queue<int> q;
    q.push(src);
    color[src] = 0;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : g[u]) {
            if (color[v] == -1) {
                color[v] = color[u] ^ 1;
                q.push(v);
            } else if (color[v] == color[u]) {
                return false;
            }
        }
    }

    return true;
}

bool isBipartite = true;

for (int i = 0; i < n; i++) {
    if (color[i] == -1 && !bfs(i)) {
        isBipartite = false;
        break;
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** The square 0-1-2-3-0 gives `isBipartite = true`. The triangle 0-1-2 gives `false`.

**Pitfalls:**

- The outer loop is needed because the graph can be disconnected.
- LC 886 is 1-indexed and gives edge pairs, so build `g` of size n + 1 in both directions first.

**Used in:** LC 785, LC 886, LC 2493

---

## 10. Dijkstra — shortest path

**Use when:** "Minimum cost / time from a source" with non-negative edge weights.

```cpp
const long long INF = 1e18;

vector<long long> dist(n, INF);
priority_queue<pair<long long,int>,
               vector<pair<long long,int>>,
               greater<pair<long long,int>>> pq;

dist[src] = 0;
pq.push({0, src});

while (!pq.empty()) {
    auto [d, u] = pq.top();
    pq.pop();

    if (d != dist[u]) continue;

    for (auto [v, w] : g[u]) {
        if (dist[v] > dist[u] + w) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
    }
}
```

**Complexity:** O(E log V) time and O(V + E) space.

**Example:** With edges 0→1 (4), 0→2 (1), 2→1 (2) from src = 0, you get `dist = [0, 3, 1]`. The heap entry (4, 1) is popped later and skipped as stale.

**Pitfalls:**

- Without `if (d != dist[u]) continue`, stale entries re-relax their edges.
- Negative edges break the method, so use Bellman-Ford.
- Use `long long` because sums of large weights overflow `int`.

**Used in:** LC 743, LC 1514, LC 1631, LC 1976, LC 2642

---

## 11. Dijkstra with path reconstruction

**Use when:** Shortest path when you must output the route itself, not just its length.

```cpp
vector<long long> dist(n, INF);
vector<int> parent(n, -1);

priority_queue<pair<long long,int>,
               vector<pair<long long,int>>,
               greater<pair<long long,int>>> pq;

dist[src] = 0;
parent[src] = src;
pq.push({0, src});

while (!pq.empty()) {
    auto [d, u] = pq.top();
    pq.pop();

    if (d != dist[u]) continue;

    for (auto [v, w] : g[u]) {
        if (dist[v] > d + w) {
            dist[v] = d + w;
            parent[v] = u;
            pq.push({dist[v], v});
        }
    }
}

vector<int> path;

if (dist[target] != INF) {
    int cur = target;

    while (cur != parent[cur]) {
        path.push_back(cur);
        cur = parent[cur];
    }

    path.push_back(src);
    reverse(path.begin(), path.end());
}
```

**Complexity:** O(E log V) time and O(V + E) space, plus O(V) to rebuild the path.

**Example:** Same graph as above with target = 1: parent[1] = 2 and parent[2] = 0, so `path = [0, 2, 1]`.

**Pitfalls:**

- `parent[src] = src` is what stops the rebuild loop, so don't leave it at -1.
- Check `dist[target] != INF` before rebuilding, as an unreachable target has no parent chain.

**Used in:** LC 743 and LC 1976 when the route itself is needed

---

## 12. 0-1 BFS

**Use when:** Every edge costs 0 or 1, as in "fewest walls to remove" or "fewest arrows to flip".

```cpp
vector<int> dist(n, INT_MAX);
deque<int> dq;

dist[src] = 0;
dq.push_front(src);

while (!dq.empty()) {
    int u = dq.front();
    dq.pop_front();

    for (auto [v, w] : g[u]) {
        if (dist[v] > dist[u] + w) {
            dist[v] = dist[u] + w;

            if (w == 0) {
                dq.push_front(v);
            } else {
                dq.push_back(v);
            }
        }
    }
}
```

**Complexity:** O(V + E) time and O(V) space, with no log factor.

**Example:** With edges 0→1 (1), 0→2 (0), 2→1 (0), you get `dist = [0, 0, 0]`. Node 1 first gets 1, then improves to 0 through node 2.

**Pitfalls:**

- Pushing 0-edges to the back breaks the sorted order.
- A node can improve after being pushed, so compare dist values instead of using a visited flag.

**Used in:** LC 2290, LC 1368, LC 959

---

## 13. Bellman-Ford

**Use when:** Edge weights can be negative, or the path may use at most a fixed number of edges.

```cpp
struct Edge {
    int u, v, w;
};

vector<long long> dist(n, INF);
dist[src] = 0;

for (int i = 0; i < n - 1; i++) {
    for (auto &e : edges) {
        if (dist[e.u] != INF && dist[e.v] > dist[e.u] + e.w) {
            dist[e.v] = dist[e.u] + e.w;
        }
    }
}
```

**Complexity:** O(V x E) time and O(V) space.

**Example:** With edges 0→1 (4), 0→2 (5), 2→1 (-3) from src = 0, you get `dist = [0, 2, 5]`.

**Pitfalls:**

- Skip unreached nodes with `dist[e.u] != INF`, or INF plus a negative weight looks like a real distance.
- In-place updates can chain several edges in one round. That is fine here, but wrong for "at most k edges" (see section 15).
- Stop early if a whole round changes nothing.

**Used in:** LC 787, LC 743

---

## 14. Negative cycle detection

**Use when:** Run after Bellman-Ford when the problem asks "is there a negative cycle?" or "can the cost drop forever?"

```cpp
bool hasNegativeCycle = false;

for (auto &e : edges) {
    if (dist[e.u] != INF && dist[e.v] > dist[e.u] + e.w) {
        hasNegativeCycle = true;
        break;
    }
}
```

**Complexity:** O(E) time on top of Bellman-Ford, with O(1) extra space.

**Example:** With edges 0→1 (1), 1→2 (-2), 2→1 (1), the loop 1→2→1 sums to -1. After the n - 1 rounds an edge can still relax, so `hasNegativeCycle = true`.

**Pitfalls:**

- This only finds cycles reachable from src. To check the whole graph, start every dist at 0, which acts like a virtual source.
- Run it after the n - 1 rounds, not inside them.

**Used in:** The classic "Negative weight cycle detection" in section 5 (no LC number in the bank)

---

## 15. Cheapest path with at most K stops

**Use when:** "Cheapest price with at most k stops", or any shortest path limited to k + 1 edges.

```cpp
vector<int> dist(n, 1e9);
dist[src] = 0;

for (int i = 0; i <= k; i++) {
    vector<int> temp = dist;

    for (auto &e : edges) {
        int u = e[0], v = e[1], w = e[2];

        if (dist[u] != 1e9 && temp[v] > dist[u] + w) {
            temp[v] = dist[u] + w;
        }
    }

    dist = temp;
}

return dist[dst] == 1e9 ? -1 : dist[dst];
```

**Complexity:** O(k x E) time and O(V) space.

**Example:** With flights 0→1 (100), 1→2 (100), 0→2 (500) from 0 to 2, k = 0 returns 500 and k = 1 returns 200.

**Pitfalls:**

- Reading from `dist` while writing to `temp` is the whole trick. Updating in place lets one round chain several flights.
- k stops means k + 1 flights, so the loop runs `i <= k`.

**Used in:** LC 787

---

## 16. Floyd-Warshall — all pairs shortest path

**Use when:** All-pairs distances on a small graph (n up to about 400), or many "is a reachable from b?" queries.

```cpp
const long long INF = 1e18;

vector<vector<long long>> dist(n, vector<long long>(n, INF));

for (int i = 0; i < n; i++) {
    dist[i][i] = 0;
}

for (auto &[u, v, w] : edges) {
    dist[u][v] = min(dist[u][v], 1LL * w);
}

for (int via = 0; via < n; via++) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (dist[i][via] == INF || dist[via][j] == INF) continue;

            dist[i][j] = min(dist[i][j], dist[i][via] + dist[via][j]);
        }
    }
}
```

**Complexity:** O(n³) time and O(n²) space.

**Example:** With edges 0→1 (3), 1→2 (1), 0→2 (7), you get `dist[0][2] = 4` after `via = 1`.

**Pitfalls:**

- `via` must be the outer loop.
- Undirected input needs both `dist[u][v]` and `dist[v][u]` set.
- The INF guard stops INF + INF from overflowing, so keep it.

**Used in:** LC 1334, LC 1462, LC 2976, LC 399

---

## 17. DSU / Union Find

**Use when:** "Are a and b in the same group?" while edges keep arriving, or Kruskal's MST.

```cpp
class DSU {
public:
    vector<int> parent, size;

    DSU(int n) {
        parent.resize(n);
        size.assign(n, 1);

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        int ra = find(a);
        int rb = find(b);

        if (ra == rb) return false;

        if (size[ra] < size[rb]) swap(ra, rb);

        parent[rb] = ra;
        size[ra] += size[rb];

        return true;
    }
};
```

**Complexity:** O(α(n)) amortized per `find` or `unite` with path compression and union by size. O(n) space.

**Example:** With `DSU d(3)`, `d.unite(0, 1)` returns true and `d.unite(1, 0)` returns false. `find(2)` stays 2.

**Pitfalls:**

- Compare `find(a) == find(b)`, never `parent[a] == parent[b]`.
- The recursive `find` can go deep before compression kicks in. That is rare with union by size, but an iterative version is safer.
- 1-indexed input needs `DSU dsu(n + 1)`.

**Used in:** LC 684, LC 721, LC 990, LC 1319, LC 1202

---

## 18. Number of connected components using DSU

**Use when:** Count components from an edge list without building an adjacency list.

```cpp
DSU dsu(n);
int components = n;

for (auto &[u, v] : edges) {
    if (dsu.unite(u, v)) {
        components--;
    }
}
```

**Complexity:** O(n + E α(n)) time and O(n) space.

**Example:** With n = 5 and edges (0,1), (1,2), (3,4), you get `components = 2`.

**Pitfalls:**

- Decrement only when `unite` returns true. An edge inside one group changes nothing.
- Isolated nodes still count, which is why the count starts at n.

**Used in:** LC 323, LC 1319, LC 2316, LC 200

---

## 19. Kruskal MST

**Use when:** "Minimum cost to connect all nodes" given an edge list.

```cpp
struct Edge {
    int u, v, w;
};

sort(edges.begin(), edges.end(), [](Edge &a, Edge &b) {
    return a.w < b.w;
});

DSU dsu(n);

long long mstCost = 0;
int used = 0;

for (auto &e : edges) {
    if (dsu.unite(e.u, e.v)) {
        mstCost += e.w;
        used++;
    }
}

bool connected = used == n - 1;
```

**Complexity:** O(E log E) time for the sort and O(n + E) space.

**Example:** With edges (0,1,1), (1,2,2), (0,2,3), (2,3,4), it takes 1, 2 and 4 and skips (0,2,3). So `mstCost = 7` and `connected = true`.

**Pitfalls:**

- If `used < n - 1`, the graph is disconnected and has no spanning tree. LC 1135 wants -1 then.
- Use `long long` for mstCost when weights are large.

**Used in:** LC 1584, LC 1135, LC 1489, LC 1168

---

## 20. Prim MST

**Use when:** MST on a dense graph, or one given as an adjacency list, as in LC 1584 where every pair is an edge.

```cpp
vector<int> vis(n, 0);

priority_queue<pair<int,int>,
               vector<pair<int,int>>,
               greater<pair<int,int>>> pq;

pq.push({0, 0});

long long mstCost = 0;

while (!pq.empty()) {
    auto [w, u] = pq.top();
    pq.pop();

    if (vis[u]) continue;

    vis[u] = 1;
    mstCost += w;

    for (auto [v, wt] : g[u]) {
        if (!vis[v]) {
            pq.push({wt, v});
        }
    }
}
```

**Complexity:** O(E log E) time with this lazy heap, and O(V + E) space.

**Example:** Same graph as Kruskal's above, starting at 0: it takes 0-1 (1), 1-2 (2) and 2-3 (4), so `mstCost = 7`.

**Pitfalls:**

- Mark the node when it is popped, not when it is pushed, or a cheaper edge seen later is lost.
- For a disconnected graph, `mstCost` covers only the start component. Count the visited nodes to detect this.

**Used in:** LC 1584, LC 1135

---

## 21. Bridges in graph — Tarjan

**Use when:** "Critical connections": edges whose removal disconnects the graph.

```cpp
vector<int> tin(n, -1), low(n, -1), vis(n, 0);
vector<pair<int,int>> bridges;
int timer = 0;

void dfs(int u, int parent) {
    vis[u] = 1;
    tin[u] = low[u] = timer++;

    for (int v : g[u]) {
        if (v == parent) continue;

        if (vis[v]) {
            low[u] = min(low[u], tin[v]);
        } else {
            dfs(v, u);
            low[u] = min(low[u], low[v]);

            if (low[v] > tin[u]) {
                bridges.push_back({u, v});
            }
        }
    }
}

for (int i = 0; i < n; i++) {
    if (!vis[i]) dfs(i, -1);
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With the triangle 0-1-2 plus edge 1-3, `bridges = [(1, 3)]`.

**Pitfalls:**

- The comparison is strict, `low[v] > tin[u]`. Using `>=` gives articulation points instead.
- `v == parent` skips every parallel copy. With multi-edges, skip by edge id, since a doubled edge is never a bridge.

**Used in:** LC 1192

---

## 22. Articulation points

**Use when:** "Single point of failure": nodes whose removal disconnects the graph.

```cpp
vector<int> tin(n, -1), low(n, -1), vis(n, 0), isArt(n, 0);
int timer = 0;

void dfs(int u, int parent) {
    vis[u] = 1;
    tin[u] = low[u] = timer++;

    int children = 0;

    for (int v : g[u]) {
        if (v == parent) continue;

        if (vis[v]) {
            low[u] = min(low[u], tin[v]);
        } else {
            dfs(v, u);
            low[u] = min(low[u], low[v]);

            if (parent != -1 && low[v] >= tin[u]) {
                isArt[u] = 1;
            }

            children++;
        }
    }

    if (parent == -1 && children > 1) {
        isArt[u] = 1;
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With the triangle 0-1-2 plus edge 1-3, calling `dfs(0, -1)` gives `isArt = [0, 1, 0, 0]`. Only node 1 is a cut point.

**Pitfalls:**

- The root is special: it is a cut point only with 2 or more DFS children.
- The snippet has no driver. Call `dfs(i, -1)` for every unvisited i.

**Used in:** LC 1568

---

## 23. Kosaraju SCC

**Use when:** Group a directed graph into strongly connected components using two simple DFS passes.

```cpp
vector<int> vis(n, 0), order;
vector<vector<int>> rg(n);

for (int u = 0; u < n; u++) {
    for (int v : g[u]) {
        rg[v].push_back(u);
    }
}

void dfs1(int u) {
    vis[u] = 1;

    for (int v : g[u]) {
        if (!vis[v]) dfs1(v);
    }

    order.push_back(u);
}

void dfs2(int u, vector<int>& comp) {
    vis[u] = 1;
    comp.push_back(u);

    for (int v : rg[u]) {
        if (!vis[v]) dfs2(v, comp);
    }
}

for (int i = 0; i < n; i++) {
    if (!vis[i]) dfs1(i);
}

fill(vis.begin(), vis.end(), 0);
reverse(order.begin(), order.end());

vector<vector<int>> sccs;

for (int u : order) {
    if (!vis[u]) {
        vector<int> comp;
        dfs2(u, comp);
        sccs.push_back(comp);
    }
}
```

**Complexity:** O(V + E) time, and O(V + E) space for the reversed graph.

**Example:** With edges 0→1, 1→2, 2→0, 2→3, you get `sccs = {0, 1, 2}` and `{3}`.

**Pitfalls:**

- The second pass must use the reversed graph `rg` in reverse finishing order.
- Reset `vis` between the passes.
- The function definitions sit between statements here, so move them to file scope when you paste this.

**Used in:** LC 802, LC 2360, and the classic SCC condensation and 2-SAT rows in section 11

---

## 24. Tarjan SCC

**Use when:** Strongly connected components in one DFS pass, with SCCs coming out in reverse topological order.

```cpp
vector<int> disc(n, -1), low(n, 0), inStack(n, 0);
stack<int> st;
vector<vector<int>> sccs;
int timer = 0;

void dfs(int u) {
    disc[u] = low[u] = timer++;
    st.push(u);
    inStack[u] = 1;

    for (int v : g[u]) {
        if (disc[v] == -1) {
            dfs(v);
            low[u] = min(low[u], low[v]);
        } else if (inStack[v]) {
            low[u] = min(low[u], disc[v]);
        }
    }

    if (low[u] == disc[u]) {
        vector<int> comp;

        while (true) {
            int x = st.top();
            st.pop();
            inStack[x] = 0;

            comp.push_back(x);

            if (x == u) break;
        }

        sccs.push_back(comp);
    }
}
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With edges 0→1, 1→2, 2→0, 2→3, calling dfs on each node with `disc == -1` gives `sccs = [[3], [2, 1, 0]]`. The sink SCC comes first.

**Pitfalls:**

- Only update low from nodes still `inStack`. A finished SCC must not pull low down.
- The snippet has no driver, so loop over every node with `disc == -1`.

**Used in:** LC 802, LC 2360, LC 1192 (the same disc/low idea)

---

## 25. Longest path in DAG

**Use when:** "Minimum semesters / time to finish all tasks", or the longest chain in a DAG.

```cpp
vector<int> indegree(n, 0);

for (int u = 0; u < n; u++) {
    for (int v : g[u]) {
        indegree[v]++;
    }
}

queue<int> q;

for (int i = 0; i < n; i++) {
    if (indegree[i] == 0) q.push(i);
}

vector<int> dp(n, 0);

while (!q.empty()) {
    int u = q.front();
    q.pop();

    for (int v : g[u]) {
        dp[v] = max(dp[v], dp[u] + 1);

        indegree[v]--;

        if (indegree[v] == 0) {
            q.push(v);
        }
    }
}

int ans = *max_element(dp.begin(), dp.end());
```

**Complexity:** O(V + E) time and O(V) space.

**Example:** With edges 0→1, 1→2, 0→2, you get `dp = [0, 1, 2]` and `ans = 2` edges.

**Pitfalls:**

- dp counts edges. Add 1 if the problem counts nodes or semesters, as LC 1136 does.
- For weighted tasks like LC 2050, use `dp[v] = max(dp[v], dp[u] + time[u])` and add each node's own time.
- On a graph with a cycle, some nodes never reach in-degree 0, so check the count.

**Used in:** LC 2050, LC 1136, LC 329

---

## 26. Shortest path in DAG

**Use when:** Single-source shortest path on a DAG, even with negative weights, in linear time.

```cpp
vector<int> topo; // assume already computed

vector<int> dist(n, 1e9);
dist[src] = 0;

for (int u : topo) {
    if (dist[u] == 1e9) continue;

    for (auto [v, w] : g[u]) {
        dist[v] = min(dist[v], dist[u] + w);
    }
}
```

**Complexity:** O(V + E) time after the topological order, and O(V) space.

**Example:** With topo = [0, 1, 2] and edges 0→1 (1), 1→2 (1), 0→2 (5), you get `dist = [0, 1, 2]`.

**Pitfalls:**

- Skip nodes with `dist == 1e9`, or they relax with a fake distance.
- The graph must really be acyclic, because a cycle makes the order meaningless.

**Used in:** A classic technique with no LC row in the bank. It relaxes in the same order as LC 2050

---

## 27. Grid DFS — number of islands

```cpp
void dfs(int x, int y) {
    grid[x][y] = '0';

    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];

        if (valid(nx, ny, n, m) && grid[nx][ny] == '1') {
            dfs(nx, ny);
        }
    }
}

int islands = 0;

for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        if (grid[i][j] == '1') {
            islands++;
            dfs(i, j);
        }
    }
}
```

---

## 28. Shortest path in binary matrix

```cpp
queue<pair<int,int>> q;
vector<vector<int>> dist(n, vector<int>(m, -1));

if (grid[0][0] == 0) {
    dist[0][0] = 1;
    q.push({0, 0});
}

vector<int> dx8 = {-1,-1,-1,0,0,1,1,1};
vector<int> dy8 = {-1,0,1,-1,1,-1,0,1};

while (!q.empty()) {
    auto [x, y] = q.front();
    q.pop();

    for (int d = 0; d < 8; d++) {
        int nx = x + dx8[d];
        int ny = y + dy8[d];

        if (valid(nx, ny, n, m) && grid[nx][ny] == 0 && dist[nx][ny] == -1) {
            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
}
```

---

## 29. BFS with extra state

Example: shortest path with obstacle elimination.

```cpp
vector<vector<vector<int>>> dist(
    n, vector<vector<int>>(m, vector<int>(k + 1, -1))
);

queue<tuple<int,int,int>> q;
// x, y, obstacles_used

dist[0][0][0] = 0;
q.push({0, 0, 0});

while (!q.empty()) {
    auto [x, y, used] = q.front();
    q.pop();

    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];

        if (!valid(nx, ny, n, m)) continue;

        int newUsed = used + grid[nx][ny];

        if (newUsed <= k && dist[nx][ny][newUsed] == -1) {
            dist[nx][ny][newUsed] = dist[x][y][used] + 1;
            q.push({nx, ny, newUsed});
        }
    }
}
```

---

## 30. Word ladder BFS

```cpp
unordered_set<string> st(wordList.begin(), wordList.end());
queue<pair<string,int>> q;

q.push({beginWord, 1});
st.erase(beginWord);

while (!q.empty()) {
    auto [word, steps] = q.front();
    q.pop();

    if (word == endWord) return steps;

    for (int i = 0; i < word.size(); i++) {
        string temp = word;

        for (char c = 'a'; c <= 'z'; c++) {
            temp[i] = c;

            if (st.count(temp)) {
                st.erase(temp);
                q.push({temp, steps + 1});
            }
        }
    }
}

return 0;
```

---

## 31. Alien Dictionary

```cpp
vector<vector<int>> g(26);
vector<int> indegree(26, 0), exists(26, 0);

for (string &w : words) {
    for (char c : w) exists[c - 'a'] = 1;
}

for (int i = 0; i + 1 < words.size(); i++) {
    string a = words[i], b = words[i + 1];

    int len = min(a.size(), b.size());
    int j = 0;

    while (j < len && a[j] == b[j]) j++;

    if (j == len) {
        if (a.size() > b.size()) return "";
        continue;
    }

    int u = a[j] - 'a';
    int v = b[j] - 'a';

    g[u].push_back(v);
    indegree[v]++;
}

queue<int> q;

for (int i = 0; i < 26; i++) {
    if (exists[i] && indegree[i] == 0) {
        q.push(i);
    }
}

string order;

while (!q.empty()) {
    int u = q.front();
    q.pop();

    order += char('a' + u);

    for (int v : g[u]) {
        indegree[v]--;

        if (indegree[v] == 0) {
            q.push(v);
        }
    }
}

int total = accumulate(exists.begin(), exists.end(), 0);

return order.size() == total ? order : "";
```

---

## 32. Euler path / itinerary style

```cpp
unordered_map<string, priority_queue<string, vector<string>, greater<string>>> g;
vector<string> route;

for (auto &ticket : tickets) {
    g[ticket[0]].push(ticket[1]);
}

void dfs(string u) {
    auto &pq = g[u];

    while (!pq.empty()) {
        string v = pq.top();
        pq.pop();

        dfs(v);
    }

    route.push_back(u);
}

dfs("JFK");
reverse(route.begin(), route.end());
```

---

## 33. Bipartite matching — DFS augmenting path

```cpp
vector<vector<int>> g(n); // left side nodes: 0 to n-1
vector<int> matchR(m, -1);

bool tryMatch(int u, vector<int>& seen) {
    for (int v : g[u]) {
        if (seen[v]) continue;

        seen[v] = 1;

        if (matchR[v] == -1 || tryMatch(matchR[v], seen)) {
            matchR[v] = u;
            return true;
        }
    }

    return false;
}

int matching = 0;

for (int u = 0; u < n; u++) {
    vector<int> seen(m, 0);

    if (tryMatch(u, seen)) {
        matching++;
    }
}
```

---

## 34. Detect redundant connection

```cpp
DSU dsu(n + 1);

for (auto &e : edges) {
    int u = e[0], v = e[1];

    if (!dsu.unite(u, v)) {
        return e;
    }
}
```

---

## 35. Number of islands II — dynamic DSU

```cpp
DSU dsu(n * m);
vector<vector<int>> active(n, vector<int>(m, 0));
vector<int> ans;

int count = 0;

auto id = [&](int x, int y) {
    return x * m + y;
};

for (auto &pos : positions) {
    int x = pos[0], y = pos[1];

    if (active[x][y]) {
        ans.push_back(count);
        continue;
    }

    active[x][y] = 1;
    count++;

    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];

        if (valid(nx, ny, n, m) && active[nx][ny]) {
            if (dsu.unite(id(x, y), id(nx, ny))) {
                count--;
            }
        }
    }

    ans.push_back(count);
}
```

---

## 36. Clone graph

```cpp
unordered_map<Node*, Node*> mp;

Node* cloneGraph(Node* node) {
    if (!node) return nullptr;

    if (mp.count(node)) return mp[node];

    Node* copy = new Node(node->val);
    mp[node] = copy;

    for (Node* nei : node->neighbors) {
        copy->neighbors.push_back(cloneGraph(nei));
    }

    return copy;
}
```

---

## 37. Evaluate division — weighted graph DFS

```cpp
unordered_map<string, vector<pair<string,double>>> g;

for (int i = 0; i < equations.size(); i++) {
    string a = equations[i][0];
    string b = equations[i][1];
    double val = values[i];

    g[a].push_back({b, val});
    g[b].push_back({a, 1.0 / val});
}

double dfs(string u, string target, unordered_set<string>& vis) {
    if (u == target) return 1.0;

    vis.insert(u);

    for (auto &[v, w] : g[u]) {
        if (!vis.count(v)) {
            double res = dfs(v, target, vis);

            if (res != -1.0) {
                return w * res;
            }
        }
    }

    return -1.0;
}
```

---

## 38. A\* search skeleton

Useful for shortest path on map/grid with heuristic.

```cpp
auto heuristic = [&](int x, int y) {
    return abs(x - targetX) + abs(y - targetY);
};

priority_queue<tuple<int,int,int>,
               vector<tuple<int,int,int>>,
               greater<tuple<int,int,int>>> pq;
// {f = g + h, x, y}

vector<vector<int>> dist(n, vector<int>(m, INT_MAX));

dist[srcX][srcY] = 0;
pq.push({heuristic(srcX, srcY), srcX, srcY});

while (!pq.empty()) {
    auto [f, x, y] = pq.top();
    pq.pop();

    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];

        if (!valid(nx, ny, n, m) || grid[nx][ny] == BLOCKED) continue;

        int newDist = dist[x][y] + 1;

        if (newDist < dist[nx][ny]) {
            dist[nx][ny] = newDist;
            pq.push({newDist + heuristic(nx, ny), nx, ny});
        }
    }
}
```

---

## 39. Common graph pattern selection

```cpp
// unweighted shortest path        -> BFS
// weighted non-negative shortest  -> Dijkstra
// 0/1 edge weights                -> 0-1 BFS
// negative edge shortest path     -> Bellman-Ford
// all-pairs shortest path         -> Floyd-Warshall
// dependency ordering             -> Topological sort
// dynamic connectivity            -> DSU
// minimum connection cost         -> MST
// critical roads                  -> Bridges
// critical nodes                  -> Articulation points
// directed mutual reachability    -> SCC
// two-set conflict                -> Bipartite
// assignment rider-order          -> Bipartite matching
// graph with extra condition      -> BFS/Dijkstra with expanded state
```

---

For Zomato SDE-2, especially revise these snippets:

```cpp
// 1. Multi-source BFS
// 2. Dijkstra
// 3. 0-1 BFS
// 4. DSU
// 5. Topological sort
// 6. BFS with extra state
// 7. Bridges
// 8. MST
// 9. Bipartite matching
```
