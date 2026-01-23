// checkboxInterface.ts

import { CheckboxInterfaceComponent } from "@baklavajs/renderer-vue";
import { setType } from "@baklavajs/interface-types";
import { markRaw } from "vue";

import { booleanType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";

export class CheckboxInterface extends CodeNodeInputInterface<boolean> {
  public constructor(name: string, value: boolean) {
    super(name, value);
    this.componentName = "CheckboxInterface";
    this.setComponent(markRaw(CheckboxInterfaceComponent));

    this.use(setType, booleanType);
  }

  override getValue = (): string => (this.value ? "True" : "False");
}
