// text.ts

import { setType } from "baklavajs";

import { CodeNodeOutputInterface, TextInputInterface, defineCodeNode, stringType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "text",
  inputs: {
    text: () => new TextInputInterface("text", ""),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, stringType),
  },
  codeTemplate: () => "{{ inputs.text }}",
});
