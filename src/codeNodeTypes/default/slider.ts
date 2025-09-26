// slider.ts

import { CodeNodeOutputInterface, SliderInterface, defineCodeNode } from '@babsey/code-graph'

export default defineCodeNode({
  type: 'slider',
  inputs: {
    slider: () => new SliderInterface('slider', 0.5, 0, 1).setPort(false),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface(),
  },
  codeTemplate: () => '{{ inputs.slider }}',
})
