No worries. Here are **C++ graph snippets** for common intermediate/advanced variations. No `main`, only important parts.

---

# 1. Graph representation

## Adjacency list — unweighted

```cpp
int n;
vector<vector<int>> g(n);

g[u].push_back(v);
g[v].push_back(u); // remove for directed graph
```

## Weighted graph

```cpp
int n;
vector<vector<pair<int,int>>> g(n); // {neighbor, weight}

g[u].push_back({v, w});
g[v].push_back({u, w}); // remove for directed
```

## Grid directions

```cpp
vector<int> dx = {-1, 0, 1, 0};
vector<int> dy = {0, 1, 0, -1};

bool valid(int x, int y, int n, int m) {
    return x >= 0 && y >= 0 && x < n && y < m;
}
```

---

# 2. DFS — connected components

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

---

# 3. BFS — unweighted shortest path

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

---

# 4. Multi-source BFS

Use for nearest hospital/restaurant/zero/rotten orange.

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

---

# 5. Cycle detection — undirected graph DFS

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

---

# 6. Cycle detection — directed graph DFS

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

---

# 7. Topological sort — Kahn’s algorithm

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

---

# 8. Topological sort — DFS

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

---

# 9. Bipartite graph check

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

---

# 10. Dijkstra — shortest path

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

---

# 11. Dijkstra with path reconstruction

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

---

# 12. 0-1 BFS

Use when edge weights are only `0` or `1`.

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

---

# 13. Bellman-Ford

Use for negative edges.

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

---

# 14. Negative cycle detection

```cpp
bool hasNegativeCycle = false;

for (auto &e : edges) {
    if (dist[e.u] != INF && dist[e.v] > dist[e.u] + e.w) {
        hasNegativeCycle = true;
        break;
    }
}
```

---

# 15. Cheapest path with at most K stops

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

---

# 16. Floyd-Warshall — all pairs shortest path

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

---

# 17. DSU / Union Find

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

---

# 18. Number of connected components using DSU

```cpp
DSU dsu(n);
int components = n;

for (auto &[u, v] : edges) {
    if (dsu.unite(u, v)) {
        components--;
    }
}
```

---

# 19. Kruskal MST

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

---

# 20. Prim MST

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

---

# 21. Bridges in graph — Tarjan

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

---

# 22. Articulation points

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

---

# 23. Kosaraju SCC

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

---

# 24. Tarjan SCC

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

---

# 25. Longest path in DAG

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

---

# 26. Shortest path in DAG

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

---

# 27. Grid DFS — number of islands

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

# 28. Shortest path in binary matrix

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

# 29. BFS with extra state

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

# 30. Word ladder BFS

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

# 31. Alien Dictionary

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

# 32. Euler path / itinerary style

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

# 33. Bipartite matching — DFS augmenting path

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

# 34. Detect redundant connection

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

# 35. Number of islands II — dynamic DSU

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

# 36. Clone graph

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

# 37. Evaluate division — weighted graph DFS

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

# 38. A\* search skeleton

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

# 39. Common graph pattern selection

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
