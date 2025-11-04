// numpyRandomSeed.ts

import { IntegerInterface, defineCodeNode } from "@babsey/code-graph";

export default defineCodeNode({
  name: "np.random.seed",
  type: "numpy.random.seed",
  title: "random seed",
  inputs: {
    seed: () => new IntegerInterface("seed", 0).setOptional(true),
  },
});
