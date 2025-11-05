// listInputInterface.ts

import { markRaw } from "vue";
import { TextInputInterfaceComponent } from "@baklavajs/renderer-vue";
import { setType } from "@baklavajs/interface-types";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";
import { listType } from "@/interfaceTypes";

export class ListInputInterface extends CodeNodeInputInterface {
  constructor(name: string = "", value: string = "") {
    super(name, value);
    this.setComponent(markRaw(TextInputInterfaceComponent));

    this.use(setType, listType);
  }

  override getValue = (): string => `[${this.value}]`;
}
