export const stackQueue = {
  '1. Basic Stack Operations / Simulation': {
    crux: 'Use a stack as a LIFO scratch pad: push on event, pop to undo / pair / commit.',
    concepts: [
      'A stack is the right tool whenever the most recent unmatched thing is the one that matters next (matching, undo, last-seen).',
      'Many "string cleanup" problems become trivial when you treat the output as a stack you append to and occasionally pop from.',
      'Two stacks can simulate a queue (and vice versa) — useful design template (LC 225, 232).',
    ],
    pointsToPonder: [
      'Could you replace the explicit stack with the call stack (recursion) — and would that hurt clarity / blow the stack frame limit?',
      'When the input is small and reversible (e.g., Baseball Game), is a list/array used as a stack clearer than a deque?',
      'Why is amortized O(1) per element the right complexity bound even when individual ops do work proportional to the stack size?',
    ],
    code: `# Backspace String Compare (LC 844)
def build(s):
    out = []
    for c in s:
        if c == '#':
            if out: out.pop()
        else:
            out.append(c)
    return out
return build(s) == build(t)`,
  },

  '2. Parentheses / Bracket Matching': {
    crux: 'Push openers; on a closer, the top of the stack MUST be the matching opener — else invalid.',
    concepts: [
      'Map closers → openers once; the loop becomes a single push/pop dance.',
      'For "longest valid" / "min add to make valid", track indices on the stack (not characters) so you can compute lengths or counts.',
      'Wildcard variants (LC 678) use either two stacks (one for `(`, one for `*`) or a low/high counter range.',
    ],
    pointsToPonder: [
      'When does counting (open - close) suffice and when do you NEED a stack (multiple bracket types)?',
      'For Longest Valid Parentheses, why is the sentinel -1 at the bottom of the stack the cleanest formulation?',
      'For the wildcard `*`, why does the low/high range approach work — what invariant does it preserve?',
    ],
    code: `# Valid Parentheses (LC 20)
pair = {')': '(', ']': '[', '}': '{'}
stk = []
for c in s:
    if c in pair:
        if not stk or stk.pop() != pair[c]: return False
    else:
        stk.append(c)
return not stk`,
  },

  '3. Monotonic Stack — Next Greater / Smaller Element': {
    crux: 'Maintain a stack of INDICES with monotone values; pop while incoming violates the order — each popped index gets its answer.',
    concepts: [
      'Decreasing stack ⇒ next greater element (on pop, the incoming is the NGE).',
      'Increasing stack ⇒ next smaller element. Iterate left-to-right or right-to-left to pick which side you compute.',
      'Each index is pushed and popped at most once ⇒ amortized O(n) total.',
    ],
    pointsToPonder: [
      'Strict vs non-strict comparison (`>` vs `>=`) — which one you need depends on how duplicates should be treated.',
      'For circular variants (LC 503), why does iterating 2n (or doubling the array conceptually) capture all wraparound answers?',
      'When indices are not enough (you need values), do you really need a second stack — or can you index back into the array?',
    ],
    code: `# Daily Temperatures (LC 739)
ans = [0] * len(T)
stk = []  # indices, decreasing temperatures
for i, t in enumerate(T):
    while stk and T[stk[-1]] < t:
        j = stk.pop()
        ans[j] = i - j
    stk.append(i)
return ans`,
  },

  '4. Monotonic Stack — Histogram / Rectangle Problems': {
    crux: 'For each bar, find the nearest smaller bar on the left and right — width = R - L - 1, area = bar * width.',
    concepts: [
      'Largest Rectangle in Histogram (LC 84) is the foundational template — Maximal Rectangle, Trapping Rain Water reduce to it.',
      'Sentinel value 0 at the end forces the stack to drain in one pass.',
      'Maximal Rectangle (LC 85) = per-row histogram heights, then LC 84 on each row.',
    ],
    pointsToPonder: [
      'Why does the moment of POP give you exactly the right boundary for the popped bar (and not the bar still in the stack)?',
      'For Trapping Rain Water with a stack, what does the "trapped water on pop" formula look like — and why does it differ from the two-pointer version?',
      'How do you avoid the off-by-one error when computing width on an empty stack after the pop?',
    ],
    code: `# Largest Rectangle in Histogram (LC 84)
heights.append(0)
stk, best = [], 0
for i, h in enumerate(heights):
    while stk and heights[stk[-1]] > h:
        top = stk.pop()
        L = stk[-1] if stk else -1
        best = max(best, heights[top] * (i - L - 1))
    stk.append(i)
return best`,
  },

  '5. Monotonic Stack — Stock Span / Price Problems': {
    crux: 'For each new price, pop all PRIOR prices it dominates, then carry their cumulative span — a stack of (value, span) pairs.',
    concepts: [
      'Online Stock Span (LC 901): pop while top.price <= today; new span = 1 + sum of popped spans.',
      '132 Pattern (LC 456): scan right-to-left maintaining a max "third" seen so far; stack holds candidate "twos" greater than third.',
      'Maximum Width Ramp (LC 962): build a strictly decreasing stack from the left, then scan right-to-left popping while index satisfies the ramp.',
    ],
    pointsToPonder: [
      'For Stock Span, why does carrying the popped spans give the correct count without re-scanning?',
      'For 132 Pattern, why must the scan go right-to-left — and what role does the "max popped" play as the "2"?',
      'For Max Width Ramp, why does only the leftmost occurrence of each "low" need to be on the stack?',
    ],
    code: `# Online Stock Span (LC 901)
class StockSpanner:
    def __init__(self): self.stk = []  # (price, span)
    def next(self, price):
        span = 1
        while self.stk and self.stk[-1][0] <= price:
            span += self.stk.pop()[1]
        self.stk.append((price, span))
        return span`,
  },

  '6. Monotonic Stack — Subarray Contribution / Sum Problems': {
    crux: 'For each element, count how many subarrays it is the min/max of using left/right "smaller/greater" boundaries; sum its contribution.',
    concepts: [
      'contribution(arr[i]) = arr[i] * left_count * right_count, where left/right counts come from nearest-smaller/greater indices.',
      'Duplicate handling: use STRICT on one side and NON-STRICT on the other to avoid double-counting (e.g., < left, ≤ right).',
      'Sum of Subarray Ranges (LC 2104) = sum-of-max minus sum-of-min — apply the technique twice.',
    ],
    pointsToPonder: [
      'Why is the asymmetric strict/non-strict comparison the canonical fix for duplicates — what would symmetric give?',
      'How does the contribution technique generalize from sum-of-mins to median, k-th order, or product?',
      'For Sum of Total Strength of Wizards (LC 2281), why does the inner formula need prefix-of-prefix sums?',
    ],
    code: `# Sum of Subarray Minimums (LC 907) — contribution
MOD = 10**9 + 7
n = len(arr)
L, R = [0]*n, [0]*n
stk = []
for i, x in enumerate(arr):
    while stk and arr[stk[-1]] > x: stk.pop()
    L[i] = i - stk[-1] if stk else i + 1
    stk.append(i)
stk.clear()
for i in range(n-1, -1, -1):
    while stk and arr[stk[-1]] >= arr[i]: stk.pop()
    R[i] = stk[-1] - i if stk else n - i
    stk.append(i)
return sum(arr[i]*L[i]*R[i] for i in range(n)) % MOD`,
  },

  '7. Monotonic Stack — Lexicographic / Greedy Removal': {
    crux: 'Build the answer onto a stack; pop the top whenever it is "worse" than the incoming AND you still have budget / future occurrences.',
    concepts: [
      'Remove K Digits (LC 402): increasing stack; pop while top > current and k > 0.',
      'Remove Duplicate Letters (LC 316): also forbid popping the LAST occurrence of a character; maintain an in_stack set.',
      'Create Maximum Number (LC 321): pick best k1 from nums1, k2 from nums2 (k1 + k2 = k), then merge greedily — two layers of greedy.',
    ],
    pointsToPonder: [
      'For Remove Duplicate Letters, why is "last occurrence" the exact invariant that makes the greedy safe?',
      'For Create Maximum Number, why does the merge step compare suffixes (not just current chars) when ties occur?',
      'After the main loop, why do you slice off the trailing k unused budget rather than popping during the loop?',
    ],
    code: `# Remove K Digits (LC 402)
stk = []
for c in num:
    while stk and stk[-1] > c and k > 0:
        stk.pop(); k -= 1
    stk.append(c)
res = ''.join(stk[:len(stk)-k]).lstrip('0')
return res or '0'`,
  },

  '8. Expression Evaluation / Calculator': {
    crux: 'Walk left-to-right with an operand stack and a current sign / pending operator; parentheses save/restore the current context.',
    concepts: [
      'Basic Calculator I (LC 224): only `+ -` and parentheses → stack of (result, sign) pushed at `(`, popped at `)`.',
      'Basic Calculator II (LC 227): add `* /` → keep the LAST number separate; apply * / immediately, defer + - to the final sum.',
      'Basic Calculator III (LC 772) = I + II — recurse into parentheses or use a single stack with sign tracking.',
      'Reverse Polish (LC 150): pure operand stack — pop two on operator, push result.',
    ],
    pointsToPonder: [
      'Why does treating `-` as `+ (-num)` simplify the sign logic — and where can it bite you (unary minus, leading minus)?',
      'For * and /, why do you apply them eagerly (against the last number) instead of pushing onto the stack?',
      'Integer division semantics: truncate toward zero vs floor — they differ for negative results; which does Python `//` give vs C++ `/`?',
    ],
    code: `# Basic Calculator II (LC 227)
num, sign, stk = 0, '+', []
s += '+'
for c in s:
    if c.isdigit(): num = num*10 + int(c)
    elif c in '+-*/':
        if   sign == '+': stk.append(num)
        elif sign == '-': stk.append(-num)
        elif sign == '*': stk.append(stk.pop() * num)
        else:             stk.append(int(stk.pop() / num))
        sign, num = c, 0
return sum(stk)`,
  },

  '9. Stack for DFS / Iterative Traversal': {
    crux: 'Replace recursion with an explicit stack of (node, state) — state encodes which children have been visited.',
    concepts: [
      'Iterative inorder: push lefts until null, then visit + go right.',
      'Iterative postorder: either reverse-modified-preorder (root, right, left → reverse) OR a marker / two-stack approach.',
      'BST Iterator (LC 173): the inorder stack template, exposed as a class with next() / hasNext().',
    ],
    pointsToPonder: [
      'For postorder, why is the naive "push left then right" insufficient — and what state lets you know children are done?',
      'When does iterative traversal actually matter (deep trees risking stack overflow) vs is recursion fine?',
      'For Construct Binary Tree from Preorder + Inorder, can you avoid O(n) lookup with a hashmap of value → inorder index?',
    ],
    code: `# Iterative Inorder Traversal (LC 94)
stk, cur, out = [], root, []
while cur or stk:
    while cur:
        stk.append(cur); cur = cur.left
    cur = stk.pop()
    out.append(cur.val)
    cur = cur.right
return out`,
  },

  '10. Decode / Nested Structure with Stack': {
    crux: 'Push current context on `[` / `(` / open-token; pop and combine on the matching close-token.',
    concepts: [
      'Decode String (LC 394): stack of (prev_string, repeat_count); on `]`, prev + curr * count.',
      'Number of Atoms (LC 726): stack of dicts; on `)` multiply the popped dict and merge into parent.',
      'Nested List / Mini Parser (LC 385): stack of NestedInteger lists; build from inside out.',
    ],
    pointsToPonder: [
      'What two pieces of state must you push on `[` so that the close action can rebuild correctly?',
      'For multi-digit repeat counts, why does parsing the full number BEFORE the `[` matter?',
      'When is recursion (single function call per nesting level) cleaner than an explicit stack — and when does it crash on deep nesting?',
    ],
    code: `# Decode String (LC 394)
stk, cur, k = [], '', 0
for c in s:
    if c.isdigit(): k = k*10 + int(c)
    elif c == '[':
        stk.append((cur, k)); cur, k = '', 0
    elif c == ']':
        prev, rep = stk.pop()
        cur = prev + cur * rep
    else: cur += c
return cur`,
  },

  '11. Monotonic Deque (Sliding Window Min/Max)': {
    crux: 'A deque of indices with monotone values; pop from BACK on violations, pop from FRONT when out of window — front is the answer.',
    concepts: [
      'Sliding Window Maximum (LC 239): decreasing deque; front = current window max.',
      'Use the SAME pattern to optimize DPs where dp[i] = f(max/min over dp[i-k..i-1]) (LC 1425, 1696).',
      'For Shortest Subarray with Sum at Least K (LC 862), build prefix sums and run a monotonic-increasing deque on prefixes.',
    ],
    pointsToPonder: [
      'Why does the deque store INDICES, not values — what would break if you stored only values?',
      'Front pop (out-of-window) vs back pop (dominated value) — which side is for which condition?',
      'For LC 862, why does the deque on prefix sums need to be INCREASING (not decreasing as in LC 239)?',
    ],
    code: `# Sliding Window Maximum (LC 239)
from collections import deque
dq, out = deque(), []
for i, x in enumerate(nums):
    while dq and dq[0] <= i - k: dq.popleft()
    while dq and nums[dq[-1]] <= x: dq.pop()
    dq.append(i)
    if i >= k - 1: out.append(nums[dq[0]])
return out`,
  },

  '12. BFS Queue / Level-Order Traversal': {
    crux: 'Process the tree level by level: capture the queue size at the start of the loop = number of nodes in the current level.',
    concepts: [
      'Snapshot len(queue) before the inner loop to bound this level exactly.',
      'Zigzag (LC 103): toggle a direction flag; either reverse the level list or use a deque appending front/back.',
      'Right Side View (LC 199): take the LAST node enqueued at each level (or first if traversing right-first).',
    ],
    pointsToPonder: [
      'Why is "snapshot the size at start" the cleanest level-separator — vs sentinel nulls or per-level queues?',
      'For "average of levels" / "deepest leaves sum", which is cleaner: BFS by level or DFS with depth tracking?',
      'For Maximum Width (LC 662), why must you carry POSITION INDICES (not just nodes) in the queue?',
    ],
    code: `# Binary Tree Level Order Traversal (LC 102)
from collections import deque
q, out = deque([root] if root else []), []
while q:
    level = []
    for _ in range(len(q)):
        node = q.popleft()
        level.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    out.append(level)
return out`,
  },

  '13. Queue for BFS on Graphs / Grids': {
    crux: 'Plain BFS from a source (or MULTI-SOURCE — seed all starts at once) gives shortest-path-by-edges in O(V + E).',
    concepts: [
      'Mark visited BEFORE enqueue (not on dequeue) to avoid duplicate work on dense graphs.',
      'Multi-source BFS: enqueue all sources with distance 0 — solves Rotting Oranges (LC 994), Walls and Gates (LC 286), 01 Matrix (LC 542) in one pass.',
      'For state-as-vertex problems (Word Ladder, Open the Lock, Sliding Puzzle), the "neighbors" are computed lazily — define them once cleanly.',
    ],
    pointsToPonder: [
      'Why is multi-source BFS equivalent to BFS from a virtual super-source — and when is that mental model useful?',
      'Why does marking on enqueue (not dequeue) matter for correctness AND efficiency?',
      'When does BFS become a poor choice (weighted edges → Dijkstra; cycles + cost → Bellman-Ford)?',
    ],
    code: `# Rotting Oranges (LC 994) — multi-source BFS
from collections import deque
q, fresh = deque(), 0
for r in range(R):
    for c in range(C):
        if grid[r][c] == 2: q.append((r, c, 0))
        elif grid[r][c] == 1: fresh += 1
last = 0
while q:
    r, c, t = q.popleft(); last = t
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
            grid[nr][nc] = 2; fresh -= 1
            q.append((nr, nc, t+1))
return last if fresh == 0 else -1`,
  },

  '14. Deque / 0-1 BFS': {
    crux: 'Edges have weight 0 or 1: push 0-edges to the FRONT of the deque, 1-edges to the BACK — Dijkstra without a heap, O(V + E).',
    concepts: [
      'Same correctness as Dijkstra: deque invariant = "front has the smallest known distance".',
      'Minimum Cost to Make Valid Path (LC 1368): moving in arrow direction = 0, other = 1.',
      'When weights are 0/1, 0-1 BFS strictly dominates Dijkstra (no log factor, simpler code).',
    ],
    pointsToPonder: [
      'Why is appendleft (not append) the key step — what would happen if you appended both kinds to the back?',
      'When does popping a vertex that has already been processed need to be skipped (relaxation check)?',
      'How does this extend to weights {0, 1, ..., k}? (Hint: it does not directly — you need k-bucket BFS / Dijkstra.)',
    ],
    code: `# Minimum Cost Path (LC 1368) — 0-1 BFS skeleton
from collections import deque
INF = float('inf')
dist = [[INF]*C for _ in range(R)]
dist[0][0] = 0
dq = deque([(0, 0)])
arrow = {1:(0,1), 2:(0,-1), 3:(1,0), 4:(-1,0)}
while dq:
    r, c = dq.popleft()
    for d, (dr, dc) in arrow.items():
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C:
            w = 0 if grid[r][c] == d else 1
            if dist[r][c] + w < dist[nr][nc]:
                dist[nr][nc] = dist[r][c] + w
                if w == 0: dq.appendleft((nr, nc))
                else:      dq.append((nr, nc))
return dist[R-1][C-1]`,
  },

  '15. Circular Queue / Deque Design': {
    crux: 'Maintain head/tail pointers in a fixed-size array, advanced modulo capacity — O(1) per op, no shifting.',
    concepts: [
      'Track size explicitly to disambiguate full vs empty (when head == tail).',
      'Front Middle Back Queue (LC 1670): two deques, rebalance so |left| ≤ |right| ≤ |left| + 1.',
      'Max Frequency Stack (LC 895): map freq → stack of values pushed at that frequency.',
    ],
    pointsToPonder: [
      'Why is "size variable" cleaner than the "leave one slot empty" trick — and when does each matter (memory vs speed)?',
      'For Front Middle Back, why does the rebalance need to happen at the END of every modifying op?',
      'For Max Freq Stack, why does mapping freq → stack-of-values give O(1) pop without any heap?',
    ],
    code: `# Design Circular Queue (LC 622)
class MyCircularQueue:
    def __init__(self, k):
        self.buf, self.head, self.size, self.cap = [0]*k, 0, 0, k
    def enQueue(self, v):
        if self.size == self.cap: return False
        self.buf[(self.head + self.size) % self.cap] = v
        self.size += 1; return True
    def deQueue(self):
        if not self.size: return False
        self.head = (self.head + 1) % self.cap
        self.size -= 1; return True
    def Front(self): return -1 if not self.size else self.buf[self.head]
    def Rear(self):  return -1 if not self.size else self.buf[(self.head + self.size - 1) % self.cap]`,
  },

  '16. Stack for Path / Directory / String Simplification': {
    crux: 'Treat the output as a stack — push on normal token, pop on cancel token (`..`, backspace, adjacent duplicate).',
    concepts: [
      'Simplify Path (LC 71): split by `/`, push real names, pop on `..`, ignore `.` and empty.',
      'Remove Adjacent Duplicates II (LC 1209): stack of (char, count); pop or merge when count hits k.',
      'Removing Stars (LC 2390): push letters, pop on `*` — single pass, no regex.',
    ],
    pointsToPonder: [
      'Why is "stack as output" the same conceptual move as "stack as undo" — what makes the LIFO order natural here?',
      'For Adjacent Duplicates II, why is storing (char, count) pairs strictly better than storing repeated chars?',
      'For Simplify Path, why must you ignore empty tokens that come from repeated `/`?',
    ],
    code: `# Simplify Path (LC 71)
stk = []
for part in path.split('/'):
    if part in ('', '.'): continue
    if part == '..':
        if stk: stk.pop()
    else:
        stk.append(part)
return '/' + '/'.join(stk)`,
  },

  '17. Stack-Based Greedy / Construction': {
    crux: 'Push candidates; pop whenever the top is dominated by the incoming under the problem-specific "worse" predicate.',
    concepts: [
      'Asteroid Collision (LC 735): right-mover on top + incoming left-mover → resolve by size; loop until stable.',
      'Validate Stack Sequences (LC 946): simulate — push pushed[i], then pop greedily while top == popped[j].',
      'Car Fleet (LC 853): sort by start position desc; pop the fleet ahead if current catches up (time ≤ top.time).',
    ],
    pointsToPonder: [
      'For Asteroid, why is the WHILE loop (not IF) essential for correctness on cascading collisions?',
      'For Validate Stack Sequences, why does greedy popping after every push give the correct decision?',
      'For Car Fleet, why does sorting by position descending make the stack logic cleaner than ascending?',
    ],
    code: `# Asteroid Collision (LC 735)
stk = []
for a in asteroids:
    alive = True
    while alive and a < 0 and stk and stk[-1] > 0:
        if stk[-1] < -a:    stk.pop()
        elif stk[-1] == -a: stk.pop(); alive = False
        else:                          alive = False
    if alive: stk.append(a)
return stk`,
  },

  '18. Stack for Undo / History / Browser': {
    crux: 'Two stacks (or one stack + an index) — one for the past, one for the future; an action moves between them.',
    concepts: [
      'Browser History (LC 1472): forward stack + history list with index, or back/forward dual stacks.',
      'Min/Max Stack (LC 155 / 716): augment each entry with min/max so far → O(1) min/max alongside push/pop.',
      'Text Editor (LC 2296): two stacks split at the cursor — type/delete/move become symmetric.',
    ],
    pointsToPonder: [
      'For Min Stack, why does storing (value, min_so_far) per entry beat keeping a parallel min-stack with conditional pushes (or does it)?',
      'For a text editor, why is the "two stacks split at cursor" representation strictly better than an array + index?',
      'Snapshot Array (LC 1146): why does binary search on per-index version lists outperform a literal copy-on-snapshot?',
    ],
    code: `# Min Stack (LC 155)
class MinStack:
    def __init__(self): self.stk = []   # (val, cur_min)
    def push(self, x):
        cur = x if not self.stk else min(x, self.stk[-1][1])
        self.stk.append((x, cur))
    def pop(self): self.stk.pop()
    def top(self): return self.stk[-1][0]
    def getMin(self): return self.stk[-1][1]`,
  },

  '19. Multi-Stack / Stack of Stacks': {
    crux: 'When a single stack would violate a constraint (capacity, frequency tiers), maintain a list/heap of stacks indexed by that constraint.',
    concepts: [
      'Dinner Plate Stacks (LC 1172): list of stacks, capacity cap; min-heap of indices that still have room.',
      'Maximum Frequency Stack (LC 895): map freq → stack-of-values; pushing increments freq, popping returns from the top freq-stack.',
      'Stack With Increment (LC 1381): lazy increment — store delta at the bottom of an affected range; apply on pop.',
    ],
    pointsToPonder: [
      'For Dinner Plates, why is a HEAP of "available-to-push" indices the right structure — and why must you lazy-clean it?',
      'For Max Freq Stack, what makes the "stack-per-frequency" mapping naturally handle ties (most recent wins)?',
      'For Increment Stack, why is the lazy-delta approach O(1) amortized vs O(k) naive?',
    ],
    code: `# Max Frequency Stack (LC 895)
from collections import defaultdict
class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)
        self.group = defaultdict(list)
        self.maxf = 0
    def push(self, x):
        self.freq[x] += 1
        f = self.freq[x]
        self.maxf = max(self.maxf, f)
        self.group[f].append(x)
    def pop(self):
        x = self.group[self.maxf].pop()
        self.freq[x] -= 1
        if not self.group[self.maxf]: self.maxf -= 1
        return x`,
  },

  '20. Asteroid / Collision Simulation': {
    crux: 'Process events in some order; the stack tracks "survivors so far" — pop on each collision until stable.',
    concepts: [
      'The stack always holds the same-direction (or compatible) survivors; the incoming event collides only with the top.',
      'Car Fleet (LC 853, 1776): sort by start position; survivors are fleets, collision predicate is "catch up time".',
      'Robot Collisions (LC 2751): identical to Asteroid but with healths and indices — bookkeeping is the only added complexity.',
    ],
    pointsToPonder: [
      'Why is the collision rule always "incoming vs top of stack" — what guarantees no further collisions deeper in?',
      'When does collision processing need a WHILE loop vs a single IF (cascading vs single-event)?',
      'For Robot Collisions, why must you restore original order at the end — and what data structure makes that easy?',
    ],
    code: `# Robot Collisions (LC 2751) — sketch
order = sorted(range(n), key=lambda i: positions[i])
stk = []  # (idx, health, dir)
for i in order:
    cur = [i, healths[i], directions[i]]
    while stk and cur[2] == 'L' and stk[-1][2] == 'R':
        top = stk[-1]
        if top[1] > cur[1]: top[1] -= 1; cur = None; break
        elif top[1] < cur[1]: cur[1] -= 1; stk.pop()
        else: stk.pop(); cur = None; break
    if cur: stk.append(cur)`,
  },

  '21. Intervals / Merging with Stack': {
    crux: 'Sort intervals by start; maintain a stack of merged intervals — extend the top if the next overlaps, else push.',
    concepts: [
      'Merge Intervals: sort by start; if next.start ≤ top.end, top.end = max(top.end, next.end); else push.',
      'Remove Covered Intervals (LC 1288): sort by (start asc, end desc); pop if top covers current OR current covers top.',
      'Exclusive Time of Functions (LC 636): stack of active function ids; "start" pushes, "end" pops and credits time to the new top.',
    ],
    pointsToPonder: [
      'Why does sorting by start (vs end) matter for MERGING vs COUNT-OVERLAP problems?',
      'For Exclusive Time, why is the difference between consecutive timestamps the right credit-amount — and which function gets credited when?',
      'When does a sweep-line / +1-/-1 timeline beat the stack approach?',
    ],
    code: `# Exclusive Time of Functions (LC 636)
out = [0] * n
stk = []   # (fn_id, last_resume_time)
for log in logs:
    fn, evt, t = log.split(':'); fn, t = int(fn), int(t)
    if evt == 'start':
        if stk: out[stk[-1][0]] += t - stk[-1][1]
        stk.append([fn, t])
    else:
        f, s = stk.pop()
        out[f] += t - s + 1
        if stk: stk[-1][1] = t + 1
return out`,
  },

  '22. Queue-Based Simulation / Round-Robin': {
    crux: 'Model "first-come-first-served" steps with a queue; rotate or dequeue elements as the simulation progresses.',
    concepts: [
      'Dota2 Senate (LC 649): two queues (R, D); compare front indices, ban the other, re-enqueue at index + n.',
      'Reveal Cards In Increasing Order (LC 950): simulate the reveal process with a deque of positions, then place sorted cards.',
      'Number of Recent Calls (LC 933): sliding-window queue — pop while front < t - 3000.',
    ],
    pointsToPonder: [
      'For Dota2 Senate, why does the "+ n trick" naturally encode "act again next round" without an explicit round counter?',
      'For Reveal Cards, why does running the reveal process IN REVERSE give a direct placement instead of trial-and-error?',
      'For Number of Recent Calls, why is a queue strictly better than a list + index here?',
    ],
    code: `# Dota2 Senate (LC 649)
from collections import deque
R = deque(i for i, c in enumerate(senate) if c == 'R')
D = deque(i for i, c in enumerate(senate) if c == 'D')
n = len(senate)
while R and D:
    r, d = R.popleft(), D.popleft()
    if r < d: R.append(r + n)
    else:     D.append(d + n)
return 'Radiant' if R else 'Dire'`,
  },

  '23. Bidirectional BFS (Queue-Based)': {
    crux: 'Run BFS from BOTH ends; alternate expanding the smaller frontier; meet in the middle ⇒ O(b^(d/2)) instead of O(b^d).',
    concepts: [
      'Use two sets (or two queues) — expand the smaller set each iteration to keep the branching factor low.',
      'Word Ladder (LC 127): the classic application — frontier sizes are critical.',
      'Open the Lock (LC 752), Minimum Genetic Mutation (LC 433), Sliding Puzzle (LC 773) — same template.',
    ],
    pointsToPonder: [
      'Why is expanding the SMALLER frontier always the right heuristic (not strictly smaller, just not-larger)?',
      'How do you detect "meet in the middle" — is intersecting sets the cleanest check?',
      'When does bidirectional BFS NOT help (e.g., reverse moves not defined, or asymmetric edges)?',
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
                if cand in words: nxt.add(cand); words.discard(cand)
    front = nxt; steps += 1
return 0`,
  },

  '24. Monotonic Stack + Prefix Sum / DP Optimization': {
    crux: 'When the DP/aggregation needs the min/max (or sum) over a left/right boundary, a monotonic stack finds those boundaries in O(n).',
    concepts: [
      'Sum of Total Strength of Wizards (LC 2281): boundary indices from monotonic stack + prefix-of-prefix sums → O(n) total.',
      'Maximum Subarray Min-Product (LC 1856): like LC 84 — for each min, find its range, multiply by range sum (prefix sums).',
      'Odd Even Jump (LC 975): monotonic stack on sorted indices to precompute next-larger-or-equal / next-smaller for each i → DP from right.',
    ],
    pointsToPonder: [
      'When is "find left/right boundary with stack, then use prefix sums" the right factoring — what does it save vs naive O(n²)?',
      'For Min-Product, why is the multiplication of (min × range_sum) the right contribution — and how do you handle duplicates?',
      'For Odd Even Jump, why does the DP go RIGHT to LEFT — and how does the "next larger" precomputation enable O(1) transitions?',
    ],
    code: `# Maximum Subarray Min-Product (LC 1856)
MOD = 10**9 + 7
P = [0]
for x in nums: P.append(P[-1] + x)
n = len(nums)
L, R = [-1]*n, [n]*n
stk = []
for i, x in enumerate(nums):
    while stk and nums[stk[-1]] >= x: stk.pop()
    L[i] = stk[-1] if stk else -1
    stk.append(i)
stk.clear()
for i in range(n-1, -1, -1):
    while stk and nums[stk[-1]] >= nums[i]: stk.pop()
    R[i] = stk[-1] if stk else n
    stk.append(i)
return max(nums[i] * (P[R[i]] - P[L[i]+1]) for i in range(n)) % MOD`,
  },

  '25. Advanced / Contest-Level Stack & Queue': {
    crux: 'Most "hard" problems are a COMPOSITION: monotonic stack + prefix sums, BFS + state encoding, deque + DP, or a custom stack-of-stacks design.',
    concepts: [
      'When stuck, ask: which canonical pattern (NGE? histogram? contribution? deque-DP?) fits — and what extra dimension is the problem adding?',
      'For design problems, decompose into independent invariants and pick a structure per invariant (heap + map + stack is common).',
      'Brace Expansion II / Parse Lisp / Tag Validator: hand-rolled recursive-descent over a stack of contexts beats regex hacks every time.',
    ],
    pointsToPonder: [
      'Can you reduce THIS problem to a known one (histogram, NGE, deque-DP, multi-source BFS)?',
      'What is the smallest counterexample that would break the obvious greedy / single-pass approach — is that signaling DP?',
      'For design problems, what is the dominant cost op — and is each invariant maintained in O(log n) or O(1) amortized?',
    ],
    code: `# Shortest Subarray with Sum at Least K (LC 862) — deque on prefix sums
from collections import deque
P = [0]
for x in nums: P.append(P[-1] + x)
dq, best = deque(), float('inf')
for i, p in enumerate(P):
    while dq and p - P[dq[0]] >= k:
        best = min(best, i - dq.popleft())
    while dq and P[dq[-1]] >= p: dq.pop()
    dq.append(i)
return best if best < float('inf') else -1`,
  },
}
