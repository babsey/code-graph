// slider.ts

import { CodeNodeOutputInterface, SliderInterface, defineCodeNode } from '@babsey/code-graph';

export default defineCodeNode({
  type: 'slider',
  inputs: {
    slider: () => new SliderInterface('slider', 0.5, 0, 1),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  codeTemplate: () => '{{ inputs.slider }}',
});
