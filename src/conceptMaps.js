import { greedy } from './concepts_maps/greedy.js';
import { dynamicProgramming } from './concepts_maps/dynamicProgramming.js';
import { stackQueue } from './concepts_maps/stackQueue.js';
import { graphs } from './concepts_maps/graphs.js';

// Concept maps for each sub-section, keyed by topicId then by section heading
// (without the leading "## "). Each entry can have: crux, concepts[],
// pointsToPonder[], code (string, language defaults to Python-ish pseudocode).


const conceptMaps = {
  greedy,
  'dynamic-programming': dynamicProgramming,
  'stack-queue': stackQueue,
  graphs,
}

export default conceptMaps
