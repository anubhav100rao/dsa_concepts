import { greedy } from './concepts_maps/greedy.js';
import { dynamicProgramming } from './concepts_maps/dynamicProgramming.js';
import { stackQueue } from './concepts_maps/stackQueue.js';
import { graphs } from './concepts_maps/graphs.js';
import { tries } from './concepts_maps/tries.js';
import { arrays } from './concepts_maps/arrays.js';
import { binarySearch } from './concepts_maps/binarySearch.js';
import { priorityQueue } from './concepts_maps/priorityQueue.js';
import { rangeQueries } from './concepts_maps/rangeQueries.js';
import { strings } from './concepts_maps/strings.js';
import { trees } from './concepts_maps/trees.js';
import { twoPointers } from './concepts_maps/twoPointers.js';

// Concept maps for each sub-section, keyed by topicId then by section heading
// (without the leading "## "). Every field is optional: crux, signals[],
// notThis[], concepts[], example { problem, lc, walkthrough[] }, code (Python-ish
// pseudocode), complexity, pitfalls[], pointsToPonder[], practice[] (LC numbers
// from this section), snippet (section slug in the snippets tab). Run
// `npm run validate:content` after editing.


const conceptMaps = {
  greedy,
  'dynamic-programming': dynamicProgramming,
  'stack-queue': stackQueue,
  graphs,
  tries,
  arrays,
  'binary-search': binarySearch,
  'priority-queue': priorityQueue,
  'range-queries': rangeQueries,
  strings,
  trees,
  'two-pointers': twoPointers,
}

export default conceptMaps
