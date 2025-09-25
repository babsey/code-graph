// text.ts

import {
  CheckboxInterface,
  CodeNodeOutputInterface,
  CodeNodeInputInterface,
  IntegerInterface,
  NumberInterface,
  SelectInterface,
  SliderInterface,
  TextInputInterface,
  TextareaInputInterface,
  defineCodeNode,
  formatInputs,
  setOptional,
} from '@babsey/code-graph'

export default defineCodeNode({
  type: 'myFunction',
  title: 'my function',
  inputs: {
    code_node_input: () => new CodeNodeInputInterface('code node input'),
    checkbox: () => new CheckboxInterface('checkbox', true).use(setOptional, true),
    integer: () => new IntegerInterface('integer', 1).use(setOptional, true),
    number: () => new NumberInterface('number', 1).use(setOptional, true),
    select: () => new SelectInterface('select', 'a', ['a', 'b', 'c']).use(setOptional, true),
    slider: () => new SliderInterface('slider', 0.5, 0, 1).use(setOptional, true),
    text_input: () => new TextInputInterface('text input', 'a').use(setOptional, true),
    textarea_input: () => new TextareaInputInterface('textarea input', 'a').use(setOptional, true),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface(),
    custom: () => new CodeNodeOutputInterface('.custom', '.custom'),
  },
  codeTemplate() {
    return `myFunction(${formatInputs(this.codeNodeInputs).join(', ')})`
  },
  variableName: 'a',
})
