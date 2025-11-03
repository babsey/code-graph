// textareaInputInteface.ts

import { TextareaInputInterfaceComponent } from "baklavajs";
import { markRaw, type ComponentOptions } from "vue";

import { BaseStringInterface } from "../baseStringInterface";

export class TextareaInputInterface extends BaseStringInterface {
  component = markRaw(TextareaInputInterfaceComponent) as ComponentOptions;
}
