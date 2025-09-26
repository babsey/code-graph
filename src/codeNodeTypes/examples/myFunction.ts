// text.ts

import {
  CheckboxInterface,
  CodeNodeOutputInterface,
  CodeNodeInputInterface,
  IntegerInterface,
  ListInputInterface,
  NumberInterface,
  SelectInterface,
  SliderInterface,
  TextInputInterface,
  TextareaInputInterface,
  defineCodeNode,
  setOptional,
  formatInputs,
} from '@babsey/code-graph'

export default defineCodeNode({
  type: 'myFunction',
  title: 'my function',
  inputs: {
    checkbox: () => new CheckboxInterface('checkbox', true).use(setOptional, true),
    integer: () => new IntegerInterface('integer', 1).use(setOptional, true),
    list: () => new ListInputInterface('list', ''),
    number: () => new NumberInterface('number', 1).use(setOptional, true),
    select: () => new SelectInterface('select', 'a', ['a', 'b', 'c']).use(setOptional, true),
    slider: () => new SliderInterface('slider', 0.5, 0, 1).use(setOptional, false),
    text_input: () => new TextInputInterface('text input', 'a').use(setOptional, true),
    textarea_input: () => new TextareaInputInterface('textarea input', 'a').use(setOptional, true),
    code_node_input: () => new CodeNodeInputInterface('code node input').use(setOptional, true),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface(),
    custom: () => new CodeNodeOutputInterface('.custom', '.custom').use(setOptional, true),
  },
  codeTemplate() {
    return `${this.name}(\n\t${formatInputs(this.codeNodeInputs).join(',\n\t')}\n)`
  },
  variableName: 'a',
})
