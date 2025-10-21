// numpyRandomSeed.ts

import { IntegerInterface, defineCodeNode, setOptional } from '@babsey/code-graph'

export default defineCodeNode({
  name: 'np.random.seed',
  type: 'numpy.random.seed',
  title: 'random seed',
  inputs: {
    seed: () => new IntegerInterface('seed', 0).use(setOptional, true),
  },
})
