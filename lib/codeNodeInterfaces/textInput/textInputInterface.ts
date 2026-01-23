// textInputInterface.ts

import { markRaw, type ComponentOptions } from "vue";

import { TextInputInterface as TextInputInterfaceComponent } from "../components";
import { BaseStringInterface } from "../baseStringInterface";

export class TextInputInterface extends BaseStringInterface {
  component = markRaw(TextInputInterfaceComponent) as ComponentOptions;
}
