// listInputInterface.ts

import { markRaw } from "vue";
import { setType } from "@baklavajs/interface-types";

import { listType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";
import { TextInputInterface as TextInputInterfaceComponent } from "../components";

export class ListInputInterface extends CodeNodeInputInterface {
  constructor(name: string, value: string = "") {
    super(name, value);
    this.componentName = "ListInputInterface";
    this.setComponent(markRaw(TextInputInterfaceComponent));

    this.use(setType, listType);
  }

  override getValue = (): string => `[${this.value}]`;
}
