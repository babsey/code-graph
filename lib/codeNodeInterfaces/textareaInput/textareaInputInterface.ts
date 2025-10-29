// textareaInputInteface.ts

import { markRaw, type ComponentOptions } from "vue";
import { TextareaInputInterfaceComponent } from "baklavajs";

import { BaseStringInterface } from "../baseStringInterface";

export class TextareaInputInterface extends BaseStringInterface {
  component = markRaw(TextareaInputInterfaceComponent) as ComponentOptions;
}
