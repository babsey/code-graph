// list.ts

import { setType } from "baklavajs";

import { CodeNodeOutputInterface, ListInputInterface, defineCodeNode, listType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "list",
  inputs: {
    items: () => new ListInputInterface("list", ""),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, listType),
  },
  codeTemplate: () => "{{ inputs.items }}",
});
