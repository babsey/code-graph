// numpyRandomNormal.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode } from "@babsey/code-graph";

import { arrayType } from "./interfaceTypes";

export default defineCodeNode({
  name: "np.random.normal",
  type: "numpy.random.normal",
  title: "random normal distribution",
  variableName: "r",
  inputs: {
    loc: () => new IntegerInterface("loc", 0).setOptional(true),
    scale: () => new IntegerInterface("scale", 1).setOptional(true),
    size: () => new IntegerInterface("size", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
});
