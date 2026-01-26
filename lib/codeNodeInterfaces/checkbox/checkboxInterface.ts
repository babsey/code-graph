// checkboxInterface.ts

import { CheckboxInterfaceComponent } from "@baklavajs/renderer-vue";
import { setType } from "@baklavajs/interface-types";
import { markRaw, type ComponentOptions } from "vue";

import { booleanType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";

export class CheckboxInterface extends CodeNodeInputInterface<boolean> {
  public component: ComponentOptions = markRaw(CheckboxInterfaceComponent) as ComponentOptions;
  public componentName: string = "CheckboxInterface";

  public constructor(name: string, value: boolean) {
    super(name, value);
    this.use(setType, booleanType);
  }

  override getValue = (): string => (this.value ? "True" : "False");
}
