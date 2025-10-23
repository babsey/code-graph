// textInputInterface.ts

import { markRaw, type ComponentOptions } from 'vue';

import TextInputInterfaceComponent from './TextInputInterface.vue';
import { BaseStringInterface } from '../baseStringInterface';

export class TextInputInterface extends BaseStringInterface {
  component = markRaw(TextInputInterfaceComponent) as ComponentOptions;
}

export { TextInputInterfaceComponent };
