// number.ts

import { setType } from 'baklavajs';

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode, numberType } from '@babsey/code-graph';

export default defineCodeNode({
  type: 'integer',
  inputs: {
    number: () => new IntegerInterface('number', 0),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => '{{ inputs.number }}',
});
