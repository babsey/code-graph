// tuple.ts

import { setType } from "baklavajs";

import { CodeNodeOutputInterface, TupleInputInterface, defineCodeNode, tupleType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "tuple",
  inputs: {
    items: () => new TupleInputInterface("tuple", 0).use(setType, tupleType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, tupleType),
  },
  codeTemplate: () => "{{ inputs.items }}",
});
