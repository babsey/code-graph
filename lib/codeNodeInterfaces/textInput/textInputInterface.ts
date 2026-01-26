// textInputInterface.ts

import { markRaw, type ComponentOptions } from "vue";

import { TextInputInterface as TextInputInterfaceComponent } from "../components";
import { BaseStringInterface } from "../baseStringInterface";

export class TextInputInterface extends BaseStringInterface {
  public component: ComponentOptions = markRaw(TextInputInterfaceComponent) as ComponentOptions;
}
