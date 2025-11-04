// numpyArgwhere.ts

import { setType } from "baklavajs";

import { CodeNodeInputInterface, CodeNodeOutputInterface, defineCodeNode } from "@babsey/code-graph";

import { arrayType } from "./interfaceTypes";

export default defineCodeNode({
  name: "np.argwhere",
  type: "numpy.argwhere",
  title: "argwhere",
  inputs: {
    a: () => new CodeNodeInputInterface("a").use(setType, arrayType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
});
