// number.ts

import { setType } from 'baklavajs';

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode, numberType } from '@babsey/code-graph';

export default defineCodeNode({
  type: 'number',
  inputs: {
    number: () => new NumberInterface('number', 0),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => '{{ inputs.number }}',
});
