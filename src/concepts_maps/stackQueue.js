export const stackQueue = {
  '1. Basic Stack Operations / Simulation': {
    crux: 'Use a stack as a LIFO scratch pad: push on event, pop to undo / pair / commit.',
    signals: [
      '"Backspace", "delete the character before it", "remove adjacent pairs": each new character acts on the newest survivor.',
      '"Return the final string after all operations": the output can be built as a stack.',
      '"Record a score, or cancel the previous score" (Baseball Game): an operation refers to the most recent entry.',
      '"Implement a queue using only stacks" or "a stack using only queues": a design drill on LIFO and FIFO order.',
    ],
    notThis: [
      'You pop because a smaller value arrives and want the lexicographically best result, as in Remove K Digits (LC 402): that is a monotonic stack with a budget, section 7.',
      'Only the depth matters, as in Crawler Log Folder (LC 1598): an integer counter does the job with no stack.',
      'Backspace String Compare (LC 844) with an O(1) space follow-up: scan both strings from the end with two pointers and a skip count.',
    ],
    concepts: [
      'A stack is the right tool whenever the most recent unmatched thing is the one that matters next (matching, undo, last-seen).',
      'Many "string cleanup" problems become trivial when you treat the output as a stack you append to and occasionally pop from.',
      'Two stacks can simulate a queue (and vice versa) — useful design template (LC 225, 232).',
    ],
    example: {
      problem: 'Backspace String Compare with s = "ab#c", t = "ad#c"',
      lc: 844,
      walkthrough: [
        'build(s): a gives [a], b gives [a, b], # pops b to give [a], c gives [a, c].',
        'build(t): a gives [a], d gives [a, d], # pops d to give [a], c gives [a, c].',
        'Both results are [a, c], so the answer is true.',
      ],
    },
    complexity: 'O(n) time, because each character is pushed and popped at most once. O(n) space for the stack.',
    pitfalls: [
      'Popping on an empty stack: "#a" starts with a backspace that has nothing to delete, so guard the pop.',
      'Comparing the strings while scanning forward: a later # can delete a character you already matched.',
      'Building the result with string += in a loop: the copying can turn O(n) into O(n²), so append to a list and join.',
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
    practice: [682, 844, 1047, 155, 1209],
    snippet: '1-basic-stack-array-backed',
  },

  '2. Parentheses / Bracket Matching': {
    crux: 'Push openers; on a closer, the top of the stack MUST be the matching opener — else invalid.',
    signals: [
      '"Valid", "balanced" or "well-formed" over a string of ( [ {.',
      '"Minimum number of insertions or removals to make the string valid": count the openers and closers left unmatched.',
      '"Longest valid substring": push indices, not characters, so you can measure lengths.',
      '"Score" or "maximum nesting depth" of a parentheses string.',
    ],
    notThis: [
      '"Generate all valid combinations" (LC 22): that is backtracking; a counter only prunes the choices.',
      '"Different ways to add parentheses" (LC 241): the parentheses are yours to place, so split at each operator with divide and conquer.',
      'There is one bracket type and you only need a count (LC 921, LC 1614): an open counter is enough, with O(1) space.',
    ],
    concepts: [
      'Map closers → openers once; the loop becomes a single push/pop dance.',
      'For "longest valid" / "min add to make valid", track indices on the stack (not characters) so you can compute lengths or counts.',
      'Wildcard variants (LC 678) use either two stacks (one for `(`, one for `*`) or a low/high counter range.',
    ],
    example: {
      problem: 'Valid Parentheses with s = "([)]"',
      lc: 20,
      walkthrough: [
        '( is an opener: push it. Stack is [(].',
        '[ is an opener: push it. Stack is [(, [].',
        ') is a closer: pop [, but pair[)] is (. They differ, so return false.',
        'The counts balance, yet the order is wrong. That is why several bracket types need a stack and not counters.',
      ],
    },
    complexity: 'O(n) time and O(n) space for the stack. Counter-only variants use O(1) space.',
    pitfalls: [
      'Popping on a closer without checking for an empty stack: ")" must return false, not crash.',
      'Returning true after the loop without checking the stack is empty: "((" has no mismatch but is invalid.',
      'In Longest Valid Parentheses (LC 32), forgetting to push the current index as the new base when a closer empties the stack: later lengths then measure from the wrong place.',
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
    practice: [20, 1614, 921, 1249, 32],
    snippet: '2-parentheses-bracket-matching',
  },

  '3. Monotonic Stack — Next Greater / Smaller Element': {
    crux: 'Maintain a stack of INDICES with monotone values; pop while incoming violates the order — each popped index gets its answer.',
    signals: [
      '"Next greater element", "next warmer day", "how many days until a higher value".',
      '"The first element to the right that is smaller or equal" (Final Prices With a Special Discount).',
      '"How many people can each person see in the queue": nearer tall people block the view.',
      '"The array is circular" or "search wraps around": the same stack over two passes.',
    ],
    notThis: [
      'Next Greater Element III (LC 556) rearranges the digits of one number: use the next permutation method, despite the name.',
      'You want the closest value anywhere in the array, ignoring position: sort it or use an ordered set.',
      'The search is limited to a window of size k: use a monotonic deque, section 11.',
    ],
    concepts: [
      'Decreasing stack ⇒ next greater element (on pop, the incoming is the NGE).',
      'Increasing stack ⇒ next smaller element. Iterate left-to-right or right-to-left to pick which side you compute.',
      'Each index is pushed and popped at most once ⇒ amortized O(n) total.',
    ],
    example: {
      problem: 'Daily Temperatures with T = [73, 74, 72, 71, 75]',
      lc: 739,
      walkthrough: [
        'i=0, t=73: the stack is empty, so push. Stack holds indices [0].',
        'i=1, t=74: 73 < 74, so pop 0 and set ans[0] = 1 - 0 = 1. Push 1. Stack is [1].',
        'i=2, t=72: 74 is not below 72, so push. Stack is [1, 2].',
        'i=3, t=71: 72 is not below 71, so push. Stack is [1, 2, 3].',
        'i=4, t=75: pop 3 (ans[3] = 1), pop 2 (ans[2] = 2), pop 1 (ans[1] = 3). Push 4.',
        'Index 4 never pops, so it keeps its default of 0. The answer is [1, 3, 2, 1, 0].',
      ],
    },
    complexity: 'O(n) time, because each index is pushed and popped at most once. O(n) space for the stack.',
    pitfalls: [
      'Storing values instead of indices: Daily Temperatures needs the distance, and you can always look a value up from its index.',
      'Using the wrong strictness: `<` leaves equal values waiting for something strictly greater, and `<=` lets an equal value answer them.',
      'Forgetting the default answer for indices still on the stack at the end: it is 0 or -1 depending on the problem.',
      'In circular LC 503, pushing indices on both passes: read nums[i % n] for 2n steps, but push only while i < n.',
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
    practice: [496, 1475, 739, 503, 1944],
    snippet: '3-monotonic-stack-next-greater-element-to-the-right',
  },

  '4. Monotonic Stack — Histogram / Rectangle Problems': {
    crux: 'For each bar, find the nearest smaller bar on the left and right — width = R - L - 1, area = bar * width.',
    signals: [
      '"Largest rectangle", "bars of width 1" or "histogram".',
      '"Largest rectangle containing only 1s" in a binary matrix: build per-row heights.',
      '"How much water can it trap" with bars of varying height.',
      '"Count submatrices with all ones": per-row heights again, counting instead of maximizing.',
    ],
    notThis: [
      'Container With Most Water (LC 11): only two lines matter and the bars between them don\'t block, so use two pointers.',
      'Largest square of 1s (LC 221): the DP on min(left, up, diagonal) + 1 is simpler than a histogram.',
      'Trapping Rain Water (LC 42) with an O(1) space requirement: use two pointers rather than the stack.',
    ],
    concepts: [
      'Largest Rectangle in Histogram (LC 84) is the foundational template — Maximal Rectangle, Trapping Rain Water reduce to it.',
      'Sentinel value 0 at the end forces the stack to drain in one pass.',
      'Maximal Rectangle (LC 85) = per-row histogram heights, then LC 84 on each row.',
    ],
    example: {
      problem: 'Largest Rectangle in Histogram with heights = [2, 1, 5, 6, 2, 3]',
      lc: 84,
      walkthrough: [
        'Append the sentinel 0, so heights = [2, 1, 5, 6, 2, 3, 0].',
        'i=0: push. i=1, h=1: pop bar 0 (height 2), L=-1, width 1, area 2. Push 1. Stack holds indices [1].',
        'i=2 and i=3: heights rise, so push both. Stack is [1, 2, 3].',
        'i=4, h=2: pop 3 (height 6), L=2, width 1, area 6. Pop 2 (height 5), L=1, width 2, area 10. Push 4. Stack is [1, 4].',
        'i=5: push. Stack is [1, 4, 5].',
        'i=6, h=0: pop 5, area 3. Pop 4 (height 2), L=1, width 4, area 8. Pop 1 (height 1), L=-1, width 6, area 6.',
        'The best area seen is 10, from height 5 across indices 2 and 3.',
      ],
    },
    complexity: 'O(n) time and O(n) space. Maximal Rectangle (LC 85) runs this once per row, so O(R × C) time and O(C) space.',
    pitfalls: [
      'Leaving out the sentinel: on rising input like [1, 2, 3], no bar ever pops and the answer stays 0.',
      'Measuring width from the popped index: use the new top after the pop, i - L - 1, with L = -1 when the stack is empty.',
      'In C++, multiplying height and width as int on large inputs: cast to long long first.',
      'In Maximal Rectangle, forgetting to reset a column\'s height to 0 on a 0 cell.',
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
    practice: [581, 962, 84, 42, 85],
    snippet: '4-monotonic-stack-largest-rectangle-in-histogram',
  },

  '5. Monotonic Stack — Stock Span / Price Problems': {
    crux: 'For each new price, pop all PRIOR prices it dominates, then carry their cumulative span — a stack of (value, span) pairs.',
    signals: [
      '"How many consecutive days up to today had a price less than or equal to today\'s."',
      'Values arrive one at a time through next(), and each call asks about the past.',
      '"Find i < j < k with nums[i] < nums[k] < nums[j]" (132 Pattern).',
      '"Maximum width ramp": the widest i < j with nums[i] <= nums[j].',
    ],
    notThis: [
      'Stock Price Fluctuation (LC 2034) lets old prices be corrected: a stack can\'t edit its history, so use a heap with lazy deletion or a sorted map.',
      'Best Time to Buy and Sell Stock (LC 121) needs only the minimum so far: a single variable replaces the stack.',
      'The answer is about future days, not past ones, and the whole array is known: use the next-greater scan in section 3.',
    ],
    concepts: [
      'Online Stock Span (LC 901): pop while top.price <= today; new span = 1 + sum of popped spans.',
      '132 Pattern (LC 456): scan right-to-left maintaining a max "third" seen so far; stack holds candidate "twos" greater than third.',
      'Maximum Width Ramp (LC 962): build a strictly decreasing stack from the left, then scan right-to-left popping while index satisfies the ramp.',
    ],
    example: {
      problem: 'Online Stock Span with prices 100, 80, 60, 70, 60, 75, 85',
      lc: 901,
      walkthrough: [
        '100, 80, 60: each is smaller than the top, so span = 1 each. Stack is (100,1), (80,1), (60,1).',
        '70: pop (60,1), so span = 2. Stack is (100,1), (80,1), (70,2).',
        '60: nothing to pop, so span = 1. Stack gains (60,1).',
        '75: pop (60,1) and (70,2), so span = 1 + 1 + 2 = 4. Stack is (100,1), (80,1), (75,4).',
        '85: pop (75,4) and (80,1), so span = 1 + 4 + 1 = 6. Stack is (100,1), (85,6).',
        'The spans are 1, 1, 1, 2, 1, 4, 6.',
      ],
    },
    complexity: 'Amortized O(1) per next(), so O(n) over n prices, since each price is pushed and popped once. O(n) space.',
    pitfalls: [
      'Popping on `<` instead of `<=`: an equal earlier price belongs in the span, so it must be absorbed.',
      'Starting span at 0: today always counts, so it starts at 1.',
      'Discarding the popped span: the popped entry stands for several days, so add its span and not just 1.',
      'In LC 962, popping while building the left stack: build a decreasing stack first, then pop only during the right-to-left scan.',
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
    practice: [901, 739, 456, 962, 1944],
    snippet: '5-monotonic-stack-stock-span',
  },

  '6. Monotonic Stack — Subarray Contribution / Sum Problems': {
    crux: 'For each element, count how many subarrays it is the min/max of using left/right "smaller/greater" boundaries; sum its contribution.',
    signals: [
      '"Sum of the minimum (or maximum) of every subarray", usually with "modulo 1e9+7".',
      '"Sum of (max - min) over all subarrays": sum of maxes minus sum of mins.',
      '"Maximize min(subarray) × sum(subarray)": each element is tried as the minimum.',
      'n is up to 1e5, so listing subarrays is out, yet the answer ranges over all of them.',
    ],
    notThis: [
      'The sum of all subarray sums: element i appears in (i+1)(n-i) subarrays regardless of its neighbors, so no stack is needed.',
      'The window has a fixed size k: use a monotonic deque, section 11.',
      'Maximum Score of a Good Subarray (LC 1793) must contain index k: expanding two pointers outward from k is simpler.',
    ],
    concepts: [
      'contribution(arr[i]) = arr[i] * left_count * right_count, where left/right counts come from nearest-smaller/greater indices.',
      'Duplicate handling: use STRICT on one side and NON-STRICT on the other to avoid double-counting (e.g., < left, ≤ right).',
      'Sum of Subarray Ranges (LC 2104) = sum-of-max minus sum-of-min — apply the technique twice.',
    ],
    example: {
      problem: 'Sum of Subarray Minimums with arr = [3, 1, 2, 4]',
      lc: 907,
      walkthrough: [
        'Left pass, popping on >: L = [1, 2, 1, 1]. For example, 1 pops 3, the stack empties, and L[1] = 2.',
        'Right pass, popping on >=: R = [1, 3, 2, 1]. For example, 1 pops 2, the stack empties, and R[1] = 4 - 1 = 3.',
        'Contributions, arr[i] × L[i] × R[i]: 3×1×1 = 3, 1×2×3 = 6, 2×1×2 = 4, 4×1×1 = 4.',
        'The total is 3 + 6 + 4 + 4 = 17.',
      ],
    },
    complexity: 'O(n) time for two passes, with each index pushed and popped at most once per pass. O(n) space.',
    pitfalls: [
      'Using the same strictness on both sides: with [2, 2], subarray [2, 2] gets counted once per element. Make one side strict.',
      'Switching from minimums to maximums without flipping both comparisons: the two passes must change together.',
      'In C++, letting the total grow unreduced: multiply in long long and take the modulo as each term is added.',
      'Treating L and R as boundary indices when they are counts: the answer multiplies counts of choices.',
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
    practice: [907, 2104, 1856, 1793, 2281],
    snippet: '6-monotonic-stack-sum-of-subarray-minimums',
  },

  '7. Monotonic Stack — Lexicographic / Greedy Removal': {
    crux: 'Build the answer onto a stack; pop the top whenever it is "worse" than the incoming AND you still have budget / future occurrences.',
    signals: [
      '"Lexicographically smallest" or "smallest possible number" after removing characters.',
      '"Remove k digits", with the remaining digits keeping their order.',
      '"Most competitive subsequence of size k".',
      '"Each letter appears exactly once in the result", with the smallest order possible.',
    ],
    notThis: [
      'You may reorder the characters freely: sort or count, no stack needed.',
      'The result must be a contiguous substring: use a sliding window or suffix comparison, since a stack produces subsequences.',
      'Maximum Binary String After Change (LC 1702) uses operations that move zeros: a counting argument solves it, not removal.',
    ],
    concepts: [
      'Remove K Digits (LC 402): increasing stack; pop while top > current and k > 0.',
      'Remove Duplicate Letters (LC 316): also forbid popping the LAST occurrence of a character; maintain an in_stack set.',
      'Create Maximum Number (LC 321): pick best k1 from nums1, k2 from nums2 (k1 + k2 = k), then merge greedily — two layers of greedy.',
    ],
    example: {
      problem: 'Remove K Digits with num = "1432219", k = 3',
      lc: 402,
      walkthrough: [
        '1: push. Stack is 1.',
        '4: push. Stack is 14.',
        '3: 4 > 3, so pop (k = 2) and push. Stack is 13.',
        '2: 3 > 2, so pop (k = 1) and push. Stack is 12.',
        '2: equal, so push. Stack is 122.',
        '1: 2 > 1, so pop (k = 0). The budget is gone, so push. Stack is 121.',
        '9: push. Stack is 1219. With k = 0, the slice keeps everything, so the answer is "1219".',
      ],
    },
    complexity: 'O(n) time and O(n) space, with each character pushed and popped at most once. Create Maximum Number (LC 321) repeats this for every split of k between the two arrays.',
    pitfalls: [
      'Ignoring leftover budget: "1234" with k = 2 never pops, so trim k characters from the end, giving "12".',
      'Forgetting leading zeros and the empty result: "100" with k = 1 leaves "00", and "10" with k = 2 leaves "". Both must become "0".',
      'In LC 316, popping a letter that never appears again: check its last index first, and skip letters already on the stack.',
      'In LC 1673, popping too far: pop only while the stack size plus the remaining elements still reaches k.',
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
    practice: [402, 1673, 316, 321],
    snippet: '7-monotonic-stack-lexicographic-greedy-removal',
  },

  '8. Expression Evaluation / Calculator': {
    crux: 'Walk left-to-right with an operand stack and a current sign / pending operator; parentheses save/restore the current context.',
    signals: [
      '"Evaluate the expression" or "implement a basic calculator" over a string.',
      'The input mixes + - * / with spaces and asks for precedence to be respected.',
      '"Given an arithmetic expression in Reverse Polish Notation."',
      '"Parentheses may be nested" with unary minus allowed, so a stack saves context at each (.',
    ],
    notThis: [
      'Different Ways to Add Parentheses (LC 241) asks for all groupings: split at each operator with divide and conquer.',
      'The nesting builds strings or counts rather than numbers, as in Decode String (LC 394): see section 10.',
      'A long grammar with many operators, as in Parse Lisp Expression (LC 736): recursive descent stays cleaner than one flat loop.',
    ],
    concepts: [
      'Basic Calculator I (LC 224): only `+ -` and parentheses → stack of (result, sign) pushed at `(`, popped at `)`.',
      'Basic Calculator II (LC 227): add `* /` → keep the LAST number separate; apply * / immediately, defer + - to the final sum.',
      'Basic Calculator III (LC 772) = I + II — recurse into parentheses or use a single stack with sign tracking.',
      'Reverse Polish (LC 150): pure operand stack — pop two on operator, push result.',
    ],
    example: {
      problem: 'Basic Calculator II with s = "3+2*2"',
      lc: 227,
      walkthrough: [
        'Append a guard, so s = "3+2*2+". Start with num = 0, sign = +, stack [].',
        '3 then +: the pending sign is +, so push 3. Now sign = + and num = 0. Stack is [3].',
        '2 then *: the pending sign is +, so push 2. Now sign = * and num = 0. Stack is [3, 2].',
        '2 then the guard +: the pending sign is *, so pop 2 and push 2 × 2 = 4. Stack is [3, 4].',
        'The sum of the stack is 7.',
      ],
    },
    complexity: 'O(n) time and O(n) space. LC 227 can drop to O(1) space by keeping only the running total and the last term.',
    pitfalls: [
      'Not flushing the final number: the code appends a guard + so the last operand gets applied.',
      'Using Python // for division: it floors, so -3 // 2 is -2, while the problem truncates toward zero to get -1.',
      'Reading one digit at a time as a full number: "42" must build num = num × 10 + digit.',
      'Treating a space as an operator: it should neither flush nor reset num.',
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
    practice: [150, 227, 224, 772],
    snippet: '8-expression-evaluation-basic-calculator',
  },

  '9. Stack for DFS / Iterative Traversal': {
    crux: 'Replace recursion with an explicit stack of (node, state) — state encodes which children have been visited.',
    signals: [
      '"Iteratively" or "without recursion" appears in the statement or the follow-up.',
      '"next() and hasNext() in average O(1) time and O(h) memory" (BST Iterator).',
      'Depth can reach 1e5, so a recursive solution risks overflowing the call stack.',
      '"Verify this preorder sequence or serialization" without building the tree.',
    ],
    notThis: [
      'The problem talks about levels or nearest distance: use a queue, section 12.',
      'A follow-up demands O(1) extra space: Morris traversal threads the tree instead of using a stack.',
      'The depth is small and no iterator is needed: recursion is clearer than an explicit stack.',
    ],
    concepts: [
      'Iterative inorder: push lefts until null, then visit + go right.',
      'Iterative postorder: either reverse-modified-preorder (root, right, left → reverse) OR a marker / two-stack approach.',
      'BST Iterator (LC 173): the inorder stack template, exposed as a class with next() / hasNext().',
    ],
    example: {
      problem: 'Binary Tree Inorder Traversal with root 1, right child 2, and 3 as the left child of 2',
      lc: 94,
      walkthrough: [
        'cur = 1: push 1, and cur moves to its null left child.',
        'Pop 1 and output it. Move cur to its right child, 2. Output is [1].',
        'cur = 2: push 2, move left to 3, push 3, and cur becomes null. Stack is [2, 3].',
        'Pop 3 and output it. Its right child is null. Output is [1, 3].',
        'Pop 2 and output it. Its right child is null and the stack is empty, so stop.',
        'The answer is [1, 3, 2].',
      ],
    },
    complexity: 'O(n) time, since each node is pushed and popped once. O(h) space, where h is the tree height.',
    pitfalls: [
      'Writing the outer loop as `while stk`: after popping the root, the stack can be empty while cur still has a right subtree. Use `while cur or stk`.',
      'For iterative preorder, pushing left before right: the stack reverses them, so push right first.',
      'Using reversed root-right-left output for postorder when the work needs child results: it only reverses the output order, so a parent still runs before its children.',
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
    practice: [94, 144, 145, 173, 105],
    snippet: '9-stack-for-iterative-dfs',
  },

  '10. Decode / Nested Structure with Stack': {
    crux: 'Push current context on `[` / `(` / open-token; pop and combine on the matching close-token.',
    signals: [
      '"k[encoded_string]": repeat a bracketed part k times, possibly with nesting.',
      '"Chemical formula with parentheses and counts", such as Mg(OH)2.',
      '"Each element is either an integer or a list": a nested list given as a string or an iterator.',
      '"Reverse the strings in each pair of parentheses, starting from the innermost."',
    ],
    notThis: [
      'The nesting holds only numbers and arithmetic operators: use the calculator in section 8.',
      'A token cancels the previous token with no nesting, as in Simplify Path (LC 71): use the flat stack in section 16.',
      'You only need the nesting depth (LC 1614): a counter is enough.',
    ],
    concepts: [
      'Decode String (LC 394): stack of (prev_string, repeat_count); on `]`, prev + curr * count.',
      'Number of Atoms (LC 726): stack of dicts; on `)` multiply the popped dict and merge into parent.',
      'Nested List / Mini Parser (LC 385): stack of NestedInteger lists; build from inside out.',
    ],
    example: {
      problem: 'Decode String with s = "3[a2[c]]"',
      lc: 394,
      walkthrough: [
        '3 sets k = 3. Then [ pushes ("", 3) and resets cur = "" and k = 0.',
        'a sets cur = "a". Then 2 sets k = 2.',
        '[ pushes ("a", 2) and resets cur = "" and k = 0.',
        'c sets cur = "c".',
        '] pops ("a", 2), so cur = "a" + "c" × 2 = "acc".',
        '] pops ("", 3), so cur = "" + "acc" × 3 = "accaccacc".',
      ],
    },
    complexity: 'Roughly O(L) time and space, where L is the decoded length. The stack depth equals the nesting depth.',
    pitfalls: [
      'Reading one digit as the whole count: "12[a]" needs k = k × 10 + digit.',
      'Forgetting to reset cur and k after a push: the inner text would then include the outer prefix.',
      'In Number of Atoms (LC 726), the multiplier comes after ): parse the count before merging the popped map into its parent.',
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
    practice: [394, 1190, 341, 726, 1096],
    snippet: '10-decode-nested-string',
  },

  '11. Monotonic Deque (Sliding Window Min/Max)': {
    crux: 'A deque of indices with monotone values; pop from BACK on violations, pop from FRONT when out of window — front is the answer.',
    signals: [
      '"Sliding window maximum" or "the maximum of each window of size k".',
      '"You can jump at most k steps", which gives dp[i] = nums[i] + max(dp[i-k..i-1]).',
      '"Longest subarray where max - min <= limit": two deques.',
      '"Shortest subarray with sum at least k" where numbers can be negative.',
    ],
    notThis: [
      'All numbers are positive, as in Minimum Size Subarray Sum (LC 209): a plain sliding window with a running sum is enough.',
      'The window asks for a median or k-th value (LC 480): use two heaps or a multiset, since a deque tracks only the extreme.',
      'There is no window, only the nearest greater element: use the stack in section 3.',
    ],
    concepts: [
      'Sliding Window Maximum (LC 239): decreasing deque; front = current window max.',
      'Use the SAME pattern to optimize DPs where dp[i] = f(max/min over dp[i-k..i-1]) (LC 1425, 1696).',
      'For Shortest Subarray with Sum at Least K (LC 862), build prefix sums and run a monotonic-increasing deque on prefixes.',
    ],
    example: {
      problem: 'Sliding Window Maximum with nums = [1, 3, -1, -3, 5], k = 3',
      lc: 239,
      walkthrough: [
        'i=0, x=1: push. Deque holds indices [0].',
        'i=1, x=3: 1 <= 3, so pop 0 from the back and push 1. Deque is [1].',
        'i=2, x=-1: push. Deque is [1, 2]. The first window is full, so output nums[1] = 3.',
        'i=3, x=-3: index 1 is still inside (1 > 0). Push. Deque is [1, 2, 3]. Output 3.',
        'i=4, x=5: index 1 <= 1 has expired, so pop it from the front. 5 beats -3 and -1, so pop both from the back. Deque is [4]. Output 5.',
        'The answer is [3, 3, 5].',
      ],
    },
    complexity: 'O(n) time, since each index enters and leaves the deque once. O(k) space for the deque.',
    pitfalls: [
      'Storing values instead of indices: you then can\'t tell when the front has left the window.',
      'Getting the expiry off by one: the window is i-k+1..i, so drop the front when dq[0] <= i - k.',
      'Appending output before the first window is full: only output once i >= k - 1.',
      'Mixing up the ends: expired indices leave from the front, and dominated values leave from the back.',
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
    practice: [1696, 1438, 239, 1425, 862],
    snippet: '11-monotonic-deque-sliding-window-maximum',
  },

  '12. BFS Queue / Level-Order Traversal': {
    crux: 'Process the tree level by level: capture the queue size at the start of the loop = number of nodes in the current level.',
    signals: [
      '"Level by level", "level order" or "zigzag".',
      '"The rightmost node at each level" or "the average of each level".',
      '"Minimum depth": BFS can stop at the first leaf it reaches.',
      '"Connect each node to its next right node."',
    ],
    notThis: [
      'The answer comes from root-to-leaf paths or subtree totals, like tree diameter or path sum: DFS is more direct.',
      'The input is a graph or grid that can contain cycles: add a visited set, section 13.',
      'You need the order of a BST or the k-th smallest value: an inorder stack gives sorted order, section 9.',
    ],
    concepts: [
      'Snapshot len(queue) before the inner loop to bound this level exactly.',
      'Zigzag (LC 103): toggle a direction flag; either reverse the level list or use a deque appending front/back.',
      'Right Side View (LC 199): take the LAST node enqueued at each level (or first if traversing right-first).',
    ],
    example: {
      problem: 'Binary Tree Level Order Traversal with root = [3, 9, 20, null, null, 15, 7]',
      lc: 102,
      walkthrough: [
        'The queue starts as [3]. Its size is 1, so this level takes one node: 3. Enqueue 9 and 20. Output is [[3]].',
        'The size is 2: take 9 (no children), then 20, enqueuing 15 and 7. Output adds [9, 20].',
        'The size is 2: take 15 and 7, neither with children. Output adds [15, 7].',
        'The queue is empty. The answer is [[3], [9, 20], [15, 7]].',
      ],
    },
    complexity: 'O(n) time, visiting each node once. O(w) space, where w is the maximum level width, up to about n/2.',
    pitfalls: [
      'Re-reading the queue size while children are being added, as in C++ `for (i = 0; i < q.size(); i++)`: snapshot it before the inner loop.',
      'Not handling an empty tree: enqueuing a null root crashes on node.val.',
      'In Minimum Depth (LC 111), stopping at a node with one child: only a node with no children is a leaf.',
      'In Maximum Width (LC 662), positions double at each level and overflow on deep trees: subtract the level\'s first position.',
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
    practice: [637, 111, 102, 199, 103],
    snippet: '12-bfs-queue-level-order-traversal',
  },

  '13. Queue for BFS on Graphs / Grids': {
    crux: 'Plain BFS from a source (or MULTI-SOURCE — seed all starts at once) gives shortest-path-by-edges in O(V + E).',
    signals: [
      '"Fewest moves", "shortest path" or "minimum number of steps", where every move costs the same.',
      '"Minutes until every orange rots" or "distance to the nearest 0": many sources spread at once.',
      '"Shortest transformation" or "turn the wheel one slot": states are the vertices, and neighbors are computed.',
      '"Nearest exit" in a maze: the first time BFS reaches a goal is the shortest way there.',
    ],
    notThis: [
      'Edges have different weights: use Dijkstra, since BFS order no longer matches distance.',
      'Moves cost only 0 or 1, as in LC 2290: use the 0-1 BFS deque, section 14.',
      'You only ask whether cells connect, as in Number of Islands (LC 200): DFS or union-find work just as well.',
    ],
    concepts: [
      'Mark visited BEFORE enqueue (not on dequeue) to avoid duplicate work on dense graphs.',
      'Multi-source BFS: enqueue all sources with distance 0 — solves Rotting Oranges (LC 994), Walls and Gates (LC 286), 01 Matrix (LC 542) in one pass.',
      'For state-as-vertex problems (Word Ladder, Open the Lock, Sliding Puzzle), the "neighbors" are computed lazily — define them once cleanly.',
    ],
    example: {
      problem: 'Rotting Oranges with grid = [[2,1,1],[0,1,1]]',
      lc: 994,
      walkthrough: [
        'Scan the grid: the queue starts with (0,0,t=0), and fresh = 4.',
        'Pop (0,0,0): (1,0) is empty and (0,1) is fresh, so rot it and enqueue (0,1,1). fresh = 3.',
        'Pop (0,1,1): rot (1,1) and (0,2), enqueuing both at t=2. fresh = 1.',
        'Pop (1,1,2): rot (1,2) and enqueue it at t=3. fresh = 0.',
        'Pop (0,2,2) and then (1,2,3): no fresh neighbors remain, and last = 3.',
        'fresh is 0, so the answer is 3.',
      ],
    },
    complexity: 'O(V + E) time, which is O(R × C) on a grid. O(V) space for the queue and visited marks.',
    pitfalls: [
      'Marking a cell visited when it is dequeued: the same cell can be enqueued many times first. Mark it when you enqueue.',
      'Starting BFS from one rotten orange and then another: seed every source before the loop, or the times come out too large.',
      'Forgetting the unreachable case: if fresh > 0 after the loop, the answer is -1.',
      'Leaving part of the state out of the visited key: in LC 864, the same cell with different keys is a different state.',
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
    practice: [200, 994, 542, 1091, 127],
    snippet: '13-bfs-on-grid-shortest-path-in-unweighted-grid',
  },

  '14. Deque / 0-1 BFS': {
    crux: 'Edges have weight 0 or 1: push 0-edges to the FRONT of the deque, 1-edges to the BACK — Dijkstra without a heap, O(V + E).',
    signals: [
      '"Minimum number of obstacles to remove" while moving through a grid: entering a wall costs 1 and open floor costs 0.',
      '"Minimum number of signs to change": following an arrow is free, and any other move costs 1.',
      'Any "minimum cost" problem where each move is either free or costs exactly one.',
    ],
    notThis: [
      'Weights go beyond 0 and 1: use Dijkstra with a heap, or Dial\'s buckets for small integer weights.',
      'Every move costs the same: plain BFS from section 13 is simpler.',
      'Shortest Path with Obstacles Elimination (LC 1293) minimizes steps under a removal budget: use plain BFS over (row, column, removals left).',
    ],
    concepts: [
      'Same correctness as Dijkstra: deque invariant = "front has the smallest known distance".',
      'Minimum Cost to Make Valid Path (LC 1368): moving in arrow direction = 0, other = 1.',
      'When weights are 0/1, 0-1 BFS strictly dominates Dijkstra (no log factor, simpler code).',
    ],
    example: {
      problem: 'Minimum Cost to Make at Least One Valid Path with grid = [[1,2],[1,1]]',
      lc: 1368,
      walkthrough: [
        'Start with dist[0][0] = 0 and deque [(0,0)]. In this grid, 1 points right and 2 points left.',
        'Pop (0,0), arrow right: (0,1) costs 0, so dist = 0 and it goes to the front. (1,0) costs 1, so dist = 1 and it goes to the back. Deque is [(0,1), (1,0)].',
        'Pop (0,1), arrow left: moving down to (1,1) costs 1, so dist = 1 and it goes to the back. Moving left would not improve (0,0). Deque is [(1,0), (1,1)].',
        'Pop (1,0), arrow right: (1,1) costs 0, but 1 + 0 is not below its current dist of 1. Nothing changes.',
        'Pop (1,1): no neighbor improves, and the deque is empty.',
        'dist[1][1] = 1, so the answer is 1.',
      ],
    },
    complexity: 'O(V + E) time, which is O(R × C) on a grid, with no log factor from a heap. O(V) space.',
    pitfalls: [
      'Appending 0-cost moves to the back: the deque stops being sorted by distance, so cells are processed too early and repeatedly.',
      'Marking cells visited on first push as in plain BFS: a later 0-cost move can still improve them, so relax with dist instead.',
      'Reading the arrow of the neighbor: the move is free only when the current cell points in that direction.',
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
    practice: [2290, 1368, 1293],
    snippet: '14-deque-0-1-bfs',
  },

  '15. Circular Queue / Deque Design': {
    crux: 'Maintain head/tail pointers in a fixed-size array, advanced modulo capacity — O(1) per op, no shifting.',
    signals: [
      '"Design a circular queue" or "a deque with a maximum size k".',
      '"Count the hits in the past 300 seconds" or "calls in the last 3000 ms": old entries expire from the front.',
      '"Moving average of the last size values."',
      '"pushFront, pushMiddle and pushBack": two deques, kept balanced.',
    ],
    notThis: [
      'Items leave by priority rather than arrival order: use a heap.',
      'Maximum Frequency Stack (LC 895) pops by frequency: use stacks grouped by frequency, section 19.',
      'The statement doesn\'t restrict you to a fixed array and you only need FIFO: the language\'s built-in queue is enough.',
    ],
    concepts: [
      'Track size explicitly to disambiguate full vs empty (when head == tail).',
      'Front Middle Back Queue (LC 1670): two deques, rebalance so |left| ≤ |right| ≤ |left| + 1.',
      'Max Frequency Stack (LC 895): map freq → stack of values pushed at that frequency.',
    ],
    example: {
      problem: 'Design Circular Queue with k = 2',
      lc: 622,
      walkthrough: [
        'enQueue(1) writes buf[0], and enQueue(2) writes buf[1]. Now head = 0 and size = 2.',
        'enQueue(3): size equals cap, so it returns false.',
        'Rear(): buf[(0 + 2 - 1) % 2] = buf[1] = 2.',
        'deQueue(): head = 1 and size = 1. Nothing is erased, because the slot is simply out of range now.',
        'enQueue(3): it writes buf[(1 + 1) % 2] = buf[0], wrapping around. Now size = 2.',
        'Front() = buf[1] = 2, and Rear() = buf[(1 + 2 - 1) % 2] = buf[0] = 3.',
      ],
    },
    complexity: 'O(1) time per operation and O(k) space for the fixed buffer.',
    pitfalls: [
      'Deciding full or empty from head == tail: both states look the same, so track size or leave one slot unused.',
      'Computing the rear as head + size without the -1: that is the next free slot, not the last item.',
      'In a deque, moving head back with (head - 1) % cap: in C++ and Java this can be negative, so use (head - 1 + cap) % cap.',
      'Reading Front or Rear on an empty queue: return -1 as the problem specifies.',
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
    practice: [933, 346, 622, 641, 1670],
    snippet: '15-circular-queue-fixed-capacity-design',
  },

  '16. Stack for Path / Directory / String Simplification': {
    crux: 'Treat the output as a stack — push on normal token, pop on cancel token (`..`, backspace, adjacent duplicate).',
    signals: [
      '"Simplify this Unix-style path", where ".." goes up a directory and "." stays put.',
      '"Remove the star and the closest non-star character to its left" or "clear each digit and the letter before it".',
      '"Repeatedly remove adjacent duplicates" or k equal adjacent letters.',
      '"Repeatedly remove the substring AB or CD": a removal can make new neighbors match.',
    ],
    notThis: [
      'The nesting has to be rebuilt with counts or context, as in Decode String (LC 394): use section 10.',
      'You choose what to remove to get the smallest result: use the greedy stack in section 7.',
      'Only the final depth matters, as in Crawler Log Folder (LC 1598): a counter is enough.',
    ],
    concepts: [
      'Simplify Path (LC 71): split by `/`, push real names, pop on `..`, ignore `.` and empty.',
      'Remove Adjacent Duplicates II (LC 1209): stack of (char, count); pop or merge when count hits k.',
      'Removing Stars (LC 2390): push letters, pop on `*` — single pass, no regex.',
    ],
    example: {
      problem: 'Simplify Path with path = "/a/./b/../../c/"',
      lc: 71,
      walkthrough: [
        'Splitting on / gives "", a, ., b, .., .., c, "".',
        '"" is skipped. a is pushed. . is skipped. b is pushed. Stack is [a, b].',
        'The first .. pops b, and the second .. pops a. Stack is [].',
        'c is pushed, and the final "" is skipped. Stack is [c].',
        'Joining gives "/c".',
      ],
    },
    complexity: 'O(n) time and O(n) space, since each token is pushed and popped at most once.',
    pitfalls: [
      'Popping on ".." at the root: "/../" must stay at "/", so guard the pop.',
      'Treating empty tokens as names: "//" and a trailing / split into empty strings, which must be skipped.',
      'Treating "..." as special: only "." and ".." are; "..." is an ordinary directory name.',
      'In LC 1209, comparing only the top character after a removal: keep (char, count) pairs so the count survives the removal.',
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
    practice: [844, 1047, 2390, 71, 1209],
    snippet: '16-stack-for-path-simplification',
  },

  '17. Stack-Based Greedy / Construction': {
    crux: 'Push candidates; pop whenever the top is dominated by the incoming under the problem-specific "worse" predicate.',
    signals: [
      '"Moving in opposite directions, the smaller one explodes."',
      '"Could this have been the result of push and pop operations on an empty stack?"',
      '"A car catching up forms a fleet": the car in front limits those behind it.',
      '"Smallest possible sum of non-leaf nodes" (LC 1130) or "maximum sum of a mountain array" (LC 2866): each new value invalidates earlier, dominated ones.',
    ],
    notThis: [
      'The result is lexicographically ordered, with a removal budget: section 7 has the focused template.',
      'You can pick any remaining item next rather than the adjacent one: use a heap or sorting.',
      'Each value\'s contribution over many subarrays is what matters: use the contribution method in section 6.',
    ],
    concepts: [
      'Asteroid Collision (LC 735): right-mover on top + incoming left-mover → resolve by size; loop until stable.',
      'Validate Stack Sequences (LC 946): simulate — push pushed[i], then pop greedily while top == popped[j].',
      'Car Fleet (LC 853): sort by start position desc; pop the fleet ahead if current catches up (time ≤ top.time).',
    ],
    example: {
      problem: 'Asteroid Collision with asteroids = [10, 2, -5]',
      lc: 735,
      walkthrough: [
        '10 moves right and nothing blocks it, so push. Stack is [10].',
        '2 also moves right, so push. Stack is [10, 2].',
        '-5 moves left and the top moves right, so they collide. 2 < 5, so pop 2 and -5 keeps going.',
        'Next collision: 10 > 5, so -5 explodes and alive becomes false. It isn\'t pushed.',
        'The answer is [10].',
      ],
    },
    complexity: 'O(n) time, since each asteroid is pushed and popped at most once. O(n) space. Car Fleet adds an O(n log n) sort.',
    pitfalls: [
      'Using `if` where a `while` is needed: one incoming asteroid can destroy several on the stack.',
      'Colliding whenever the signs differ: [-2, 1] moves apart, so a collision needs top > 0 and incoming < 0.',
      'Forgetting the tie: with equal sizes, both are destroyed, so pop and also drop the incoming one.',
      'In Car Fleet, comparing positions rather than arrival times: a car joins the fleet ahead if its time to the target is less than or equal to the fleet\'s.',
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
    practice: [735, 946, 853, 402, 1776],
    snippet: '18-asteroid-collision',
  },

  '18. Stack for Undo / History / Browser': {
    crux: 'Two stacks (or one stack + an index) — one for the past, one for the future; an action moves between them.',
    signals: [
      '"Retrieve the minimum element in constant time."',
      '"back(steps) and forward(steps)", where "visiting a page clears the forward history".',
      '"Undo and redo", or a text cursor that moves left and right.',
      '"snap() and get(index, snap_id)": read any past version.',
    ],
    notThis: [
      'Items also leave from the other end, as in a sliding window minimum: use a monotonic deque, section 11.',
      'Max Stack (LC 716) removes the maximum from the middle: a plain stack can\'t, so add a heap or sorted map with lazy deletion.',
      'Snapshot Array (LC 1146) is about looking up versions: per-index history lists with binary search beat a stack.',
    ],
    concepts: [
      'Browser History (LC 1472): forward stack + history list with index, or back/forward dual stacks.',
      'Min/Max Stack (LC 155 / 716): augment each entry with min/max so far → O(1) min/max alongside push/pop.',
      'Text Editor (LC 2296): two stacks split at the cursor — type/delete/move become symmetric.',
    ],
    example: {
      problem: 'Min Stack with push -2, push 0, push -3, getMin, pop, top, getMin',
      lc: 155,
      walkthrough: [
        'push(-2) stores (-2, -2), since it is the first entry.',
        'push(0) stores (0, -2), since min(0, -2) = -2.',
        'push(-3) stores (-3, -3).',
        'getMin() reads the top pair and returns -3.',
        'pop() removes (-3, -3). The older minimum returns by itself.',
        'top() returns 0, and getMin() returns -2.',
      ],
    },
    complexity: 'O(1) time per operation and O(n) space, since each entry also stores its minimum.',
    pitfalls: [
      'Keeping one global minimum: after popping it, you have no way to recover the previous one.',
      'With a separate min stack, pushing only on x < min: use x <= min, or popping a duplicate minimum loses it.',
      'In Browser History, not clearing the forward entries on visit: forward() would then reach stale pages.',
      'Moving more steps than exist: clamp the index to the available history.',
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
    practice: [155, 1472, 1381, 1146, 2296],
    snippet: '20-min-stack-o-1-minimum',
  },

  '19. Multi-Stack / Stack of Stacks': {
    crux: 'When a single stack would violate a constraint (capacity, frequency tiers), maintain a list/heap of stacks indexed by that constraint.',
    signals: [
      '"Pop the most frequent element; if there is a tie, pop the most recently pushed."',
      '"Stacks of the same capacity: push to the leftmost non-full one, pop from the rightmost non-empty one."',
      '"Increment the bottom k elements" on a stack that has a maximum size.',
      '"Implement N stacks in one array."',
    ],
    notThis: [
      'Only the minimum or maximum is needed: one augmented stack is enough, section 18.',
      'Frequency matters but recency doesn\'t: a heap or counting is simpler than grouped stacks.',
      'Every operation is ordinary LIFO with no capacity or tier rule: a single stack is enough.',
    ],
    concepts: [
      'Dinner Plate Stacks (LC 1172): list of stacks, capacity cap; min-heap of indices that still have room.',
      'Maximum Frequency Stack (LC 895): map freq → stack-of-values; pushing increments freq, popping returns from the top freq-stack.',
      'Stack With Increment (LC 1381): lazy increment — store delta at the bottom of an affected range; apply on pop.',
    ],
    example: {
      problem: 'Maximum Frequency Stack with push 5, 7, 5, 7, 4, 5, then 4 pops',
      lc: 895,
      walkthrough: [
        'After the pushes: group[1] = [5, 7, 4], group[2] = [5, 7], group[3] = [5], and maxf = 3.',
        'pop: group[3] gives 5. That group is now empty, so maxf = 2.',
        'pop: group[2] gives 7, the most recent at frequency 2.',
        'pop: group[2] gives 5. That group is now empty, so maxf = 1.',
        'pop: group[1] gives 4, the most recent at frequency 1.',
        'The pops return 5, 7, 5, 4.',
      ],
    },
    complexity: 'Maximum Frequency Stack is O(1) per operation and O(n) space. Dinner Plate Stacks (LC 1172) adds O(log n) per push for its heap.',
    pitfalls: [
      'Removing a value from its lower-frequency groups when its count rises: leave those copies, since they are what later pops return.',
      'Lowering maxf on every pop: lower it only when that group becomes empty.',
      'In Dinner Plate Stacks, trusting the heap blindly: a popAtStack can make entries stale or duplicated, so clean them when you read them.',
      'In LC 1381, forgetting to pass a stored increment down to the next element on pop.',
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
    practice: [1381, 895, 1172],
  },

  '20. Asteroid / Collision Simulation': {
    crux: 'Process events in some order; the stack tracks "survivors so far" — pop on each collision until stable.',
    signals: [
      '"Moving left or right": "when two collide, the smaller one is destroyed".',
      '"Health decreases by one" for the survivor of a collision.',
      '"Return the survivors in the original order": sort by position, then restore.',
      '"Forms a fleet" or "collision time": the object ahead sets the outcome for the one behind it.',
    ],
    notThis: [
      'Identical objects that swap direction on contact, as in Last Moment Before All Ants Fall Out of a Plank (LC 1503): treat them as passing through, and no stack is needed.',
      'Objects move freely in 2D or any pair can meet: use an event queue, since only line order gives a single next neighbor.',
      'Removing Stars (LC 2390) has no sizes to compare: it uses the plain output stack from section 16.',
    ],
    concepts: [
      'The stack always holds the same-direction (or compatible) survivors; the incoming event collides only with the top.',
      'Car Fleet (LC 853, 1776): sort by start position; survivors are fleets, collision predicate is "catch up time".',
      'Robot Collisions (LC 2751): identical to Asteroid but with healths and indices — bookkeeping is the only added complexity.',
    ],
    example: {
      problem: 'Robot Collisions with positions = [3,5,2,6], healths = [10,10,15,12], directions = "RLRL"',
      lc: 2751,
      walkthrough: [
        'Sort by position: robots 2, 0, 1, 3, at positions 2, 3, 5, 6.',
        'Robot 2 (health 15, R) is pushed. Robot 0 (health 10, R) is pushed.',
        'Robot 1 (health 10, L) meets robot 0: the healths are equal, so both are removed. Stack is [robot 2].',
        'Robot 3 (health 12, L) meets robot 2: 15 > 12, so robot 2 drops to 14 and robot 3 is destroyed.',
        'The stack holds only robot 2 with health 14, so the answer is [14].',
      ],
    },
    complexity: 'O(n log n) time when the input must be sorted by position, then O(n) for the stack pass. O(n) space.',
    pitfalls: [
      'Assuming the input is in position order: Robot Collisions gives it unsorted, so sort indices first.',
      'Returning the stack as is: the answer must follow the original robot order, so sort survivors by index. The sketch stops before this step.',
      'Stopping after one collision: a robot that wins keeps moving and loses 1 health each time.',
      'Colliding any two robots with different directions: an L followed by an R moves apart, so only a left-mover meeting a right-mover on the stack collides.',
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
    practice: [2390, 735, 853, 2751, 1776],
    snippet: '18-asteroid-collision',
  },

  '21. Intervals / Merging with Stack': {
    crux: 'Sort intervals by start; maintain a stack of merged intervals — extend the top if the next overlaps, else push.',
    signals: [
      '"Function start and end logs" with "exclusive time": nested calls form a call stack.',
      '"Remove intervals covered by another interval."',
      '"Merge" or "insert" into a list of intervals, once sorted by start.',
      '"On a single-threaded CPU", where a function pauses while another runs.',
    ],
    notThis: [
      '"Maximum non-overlapping" (LC 435) needs only the last end time: a greedy pass sorted by end needs no stack.',
      '"Minimum meeting rooms": count overlap with a sweep line or a heap of end times.',
      'Bookings arrive online, as in My Calendar (LC 729): keep a sorted map.',
    ],
    concepts: [
      'Merge Intervals: sort by start; if next.start ≤ top.end, top.end = max(top.end, next.end); else push.',
      'Remove Covered Intervals (LC 1288): sort by (start asc, end desc); pop if top covers current OR current covers top.',
      'Exclusive Time of Functions (LC 636): stack of active function ids; "start" pushes, "end" pops and credits time to the new top.',
    ],
    example: {
      problem: 'Exclusive Time of Functions with n = 2, logs = ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]',
      lc: 636,
      walkthrough: [
        '0:start:0: the stack is empty, so push [0, 0].',
        '1:start:2: function 0 pauses, so out[0] += 2 - 0 = 2. Push [1, 2].',
        '1:end:5: pop, and out[1] += 5 - 2 + 1 = 4. Function 0 resumes at time 6, so its entry becomes [0, 6].',
        '0:end:6: pop, and out[0] += 6 - 6 + 1 = 1, making 3.',
        'The answer is [3, 4].',
      ],
    },
    complexity: 'O(m) time over m logs and O(m) space in the worst nesting. The sort-based interval problems take O(n log n).',
    pitfalls: [
      'Forgetting the +1 on an end event: end timestamps include that whole time unit.',
      'Setting the resume time to t instead of t + 1 after a nested call ends.',
      'Crediting the running function only when it ends: credit it each time another function pauses it.',
      'In LC 1288, sorting ties by end ascending: sort by start ascending and end descending, so a covering interval comes first.',
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
    practice: [636, 1288, 435, 57, 1526],
  },

  '22. Queue-Based Simulation / Round-Robin': {
    crux: 'Model "first-come-first-served" steps with a queue; rotate or dequeue elements as the simulation progresses.',
    signals: [
      '"Takes turns", "in the next round" or "goes to the back of the line".',
      '"Each senator can ban one opponent": each actor returns for another round if not banned.',
      '"Reveal the top card, then move the next card to the bottom."',
      '"How many requests in the last 3000 milliseconds": a queue of times.',
    ],
    notThis: [
      'Task Scheduler (LC 621) has a cooldown: use a counting formula, or a heap to pick the most frequent task.',
      'Who runs next depends on a priority, as in Single-Threaded CPU (LC 1834): use a heap.',
      'Only a total is needed, as in Time Needed to Buy Tickets (LC 2073): summing min(tickets[i], tickets[k]), with tickets[k] - 1 after position k, is one pass with no simulation.',
    ],
    concepts: [
      'Dota2 Senate (LC 649): two queues (R, D); compare front indices, ban the other, re-enqueue at index + n.',
      'Reveal Cards In Increasing Order (LC 950): simulate the reveal process with a deque of positions, then place sorted cards.',
      'Number of Recent Calls (LC 933): sliding-window queue — pop while front < t - 3000.',
    ],
    example: {
      problem: 'Dota2 Senate with senate = "RDD"',
      lc: 649,
      walkthrough: [
        'Set up R = [0], D = [1, 2], and n = 3.',
        'Fronts are r = 0 and d = 1. r is earlier, so it bans d and returns at 0 + 3 = 3. Now R = [3] and D = [2].',
        'Fronts are r = 3 and d = 2. d is earlier, so it bans r and returns at 2 + 3 = 5. Now R = [] and D = [5].',
        'R is empty, so the answer is "Dire".',
      ],
    },
    complexity: 'Dota2 Senate is O(n) time and space, since each comparison removes one senator. In general, cost is the number of simulated steps, so check how large that can get.',
    pitfalls: [
      'Re-enqueuing the winner at its old index: it must act after everyone left in this round, so use i + n.',
      'Simulating a huge number of rounds when a formula exists: Josephus with large n calls for the recurrence.',
      'Using an array with shift or pop(0): each one costs O(n), so use a deque.',
      'In LC 933, dropping the boundary: a call at exactly t - 3000 still counts, so pop only while front < t - 3000.',
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
    practice: [933, 2073, 1700, 649, 950],
    snippet: '22-round-robin-queue-simulation',
  },

  '23. Bidirectional BFS (Queue-Based)': {
    crux: 'Run BFS from BOTH ends; alternate expanding the smaller frontier; meet in the middle ⇒ O(b^(d/2)) instead of O(b^d).',
    signals: [
      '"Shortest transformation sequence", changing "one letter at a time".',
      '"Minimum moves" from one known start state to one known target state.',
      'Each state has many neighbors (26 letters per position, or 8 wheel turns), and plain BFS runs out of memory or time.',
    ],
    notThis: [
      'The target is any of several unknown states, like "reach any exit": you can\'t start from the far end, so use plain BFS.',
      'Moves can\'t be run backward, or they have different costs: use one-way BFS or Dijkstra.',
      'Word Ladder II (LC 126) wants every shortest path: record parents during BFS, then rebuild the paths with DFS.',
    ],
    concepts: [
      'Use two sets (or two queues) — expand the smaller set each iteration to keep the branching factor low.',
      'Word Ladder (LC 127): the classic application — frontier sizes are critical.',
      'Open the Lock (LC 752), Minimum Genetic Mutation (LC 433), Sliding Puzzle (LC 773) — same template.',
    ],
    example: {
      problem: 'Word Ladder with begin = "hit", end = "cog", words = [hot, dot, dog, lot, log, cog]',
      lc: 127,
      walkthrough: [
        'Start with front = {hit}, back = {cog}, steps = 1. Expand hit: only hot is in words. Now front = {hot} and steps = 2.',
        'Sizes tie, so expand hot: dot and lot. Now front = {dot, lot} and steps = 3.',
        'front is larger, so swap: front = {cog} and back = {dot, lot}. Expand cog: dog and log. Now front = {dog, log} and steps = 4.',
        'Sizes tie, so expand this frontier: dog changes one letter to dot (and log to lot), which is in back. The two searches meet.',
        'Return steps + 1 = 5, which counts the words in hit, hot, dot, dog, cog.',
      ],
    },
    complexity: 'About O(b^(d/2)) states instead of O(b^d), for branching factor b and distance d. Word Ladder costs O(26 × L²) per word of length L, and O(N) space for N words.',
    pitfalls: [
      'Forgetting to check that the end word is in the list: if it isn\'t, the answer is 0, however connected the rest is.',
      'Counting edges when the problem counts words: Word Ladder returns the number of words, so steps starts at 1.',
      'Checking the visited filter before the meet test: words in the other frontier are already removed from words, so test `cand in back` first.',
      'Expanding one fixed side every time: always expand the smaller frontier, or most of the speedup is lost.',
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
    practice: [433, 752, 127, 773, 126],
    snippet: '21-bidirectional-bfs',
  },

  '24. Monotonic Stack + Prefix Sum / DP Optimization': {
    crux: 'When the DP/aggregation needs the min/max (or sum) over a left/right boundary, a monotonic stack finds those boundaries in O(n).',
    signals: [
      '"min(subarray) × sum(subarray)", "maximize the min-product" or "total strength".',
      '"Number of subarrays whose maximum lies in [left, right]."',
      '"Jump to the smallest larger value, or the largest smaller value": the next index comes from sorted order or a stack, and a DP runs from the right.',
      'The expression combines an extreme value with a range sum, and n is too large for O(n²).',
    ],
    notThis: [
      'The formula uses only the minimum or maximum, with no range sum: use the contribution method in section 6.',
      'A DP takes the best over the last k positions, as in Jump Game VI (LC 1696): use a monotonic deque, section 11.',
      'Number of Subarrays with Bounded Maximum (LC 795) also has a one-pass counting solution that needs no stack.',
    ],
    concepts: [
      'Sum of Total Strength of Wizards (LC 2281): boundary indices from monotonic stack + prefix-of-prefix sums → O(n) total.',
      'Maximum Subarray Min-Product (LC 1856): like LC 84 — for each min, find its range, multiply by range sum (prefix sums).',
      'Odd Even Jump (LC 975): monotonic stack on sorted indices to precompute next-larger-or-equal / next-smaller for each i → DP from right.',
    ],
    example: {
      problem: 'Maximum Subarray Min-Product with nums = [1, 2, 3, 2]',
      lc: 1856,
      walkthrough: [
        'Prefix sums: P = [0, 1, 3, 6, 8].',
        'Nearest strictly smaller on the left: L = [-1, 0, 1, 0]. On the right: R = [4, 4, 3, 4].',
        'i=0: 1 × (P[4] - P[0]) = 8.',
        'i=1: 2 × (P[4] - P[1]) = 14.',
        'i=2: 3 × (P[3] - P[2]) = 9.',
        'i=3: 2 × (P[4] - P[1]) = 14, the same window as i=1.',
        'The maximum is 14, from subarray [2, 3, 2]. It is below the modulus, so the answer is 14.',
      ],
    },
    complexity: 'O(n) time for the prefix sums and two stack passes. O(n) space.',
    pitfalls: [
      'Taking the modulo before comparing: the problem maximizes the true value, so take max first and reduce at the end.',
      'Getting the sum range off by one: boundaries L and R are exclusive, so the sum is P[R[i]] - P[L[i] + 1].',
      'Reusing this code\'s same-strictness boundaries for a sum over subarrays: in LC 2281, one side must be strict or duplicates are counted twice.',
      'In C++, keeping the prefix sum or product in int: sums reach 1e12, so use long long.',
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
    practice: [795, 1856, 962, 84, 2281],
    snippet: '23-monotonic-stack-dp-sum-of-subarray-ranges',
  },

  '25. Advanced / Contest-Level Stack & Queue': {
    crux: 'Most "hard" problems are a COMPOSITION: monotonic stack + prefix sums, BFS + state encoding, deque + DP, or a custom stack-of-stacks design.',
    signals: [
      '"Shortest subarray with sum at least k", with negative numbers allowed.',
      '"How many steps until the array is non-decreasing", where removals happen in rounds.',
      '"Design" a structure with several operations that must all be fast, such as a text cursor or frequency pops.',
      '"Parse" a grammar such as Lisp expressions or tags, where nesting and scope combine.',
    ],
    notThis: [
      'One pattern fits by itself: use its own section, since this one is for combinations.',
      'All numbers are positive in a sum-at-least-k problem: a plain sliding window is enough (LC 209).',
      'n is around 1000: an O(n²) solution may pass, and it is much safer to write under pressure.',
    ],
    concepts: [
      'When stuck, ask: which canonical pattern (NGE? histogram? contribution? deque-DP?) fits — and what extra dimension is the problem adding?',
      'For design problems, decompose into independent invariants and pick a structure per invariant (heap + map + stack is common).',
      'Brace Expansion II / Parse Lisp / Tag Validator: hand-rolled recursive-descent over a stack of contexts beats regex hacks every time.',
    ],
    example: {
      problem: 'Shortest Subarray with Sum at Least K with nums = [2, -1, 2], k = 3',
      lc: 862,
      walkthrough: [
        'Prefix sums: P = [0, 2, 1, 3].',
        'i=0, p=0: the deque is empty, so push. Deque holds indices [0].',
        'i=1, p=2: 2 - 0 is below 3, and P[0] is below 2. Push. Deque is [0, 1].',
        'i=2, p=1: 1 - 0 is below 3. P[1] = 2 >= 1, so pop index 1 from the back, then push. Deque is [0, 2].',
        'i=3, p=3: 3 - P[0] = 3 >= 3, so best = 3 - 0 = 3 and index 0 leaves the front. 3 - P[2] = 2 is too small. Push.',
        'The answer is 3, which is the whole array.',
      ],
    },
    complexity: 'O(n) time, since each prefix index enters and leaves the deque once. O(n) space.',
    pitfalls: [
      'Using a plain sliding window with negatives: the sum doesn\'t grow as the window grows, so the shrink step is wrong.',
      'Building the deque over nums: it must run over the n + 1 prefix sums, starting with P[0] = 0.',
      'Not popping back entries with P >= p: a later, smaller prefix is better in both value and length.',
      'Forgetting the -1 return when no subarray qualifies.',
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
    practice: [2289, 862, 1944, 895, 2281],
    snippet: '11-monotonic-deque-sliding-window-maximum',
  },
}
