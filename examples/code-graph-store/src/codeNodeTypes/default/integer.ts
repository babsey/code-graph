// number.ts

import { setType } from "baklavajs";

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode, numberType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "integer",
  inputs: {
    number: () => new IntegerInterface("number", 0).use(setType, numberType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => "{{ inputs.number }}",
});
