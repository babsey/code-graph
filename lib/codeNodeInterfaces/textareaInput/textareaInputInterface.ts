// textareaInputInteface.ts

import { markRaw, type ComponentOptions } from "vue";

import { BaseStringInterface } from "../baseStringInterface";
import { TextareaInputInterface as TextareaInputInterfaceComponent } from "../components";

export class TextareaInputInterface extends BaseStringInterface {
  public component: ComponentOptions = markRaw(TextareaInputInterfaceComponent) as ComponentOptions;
}
