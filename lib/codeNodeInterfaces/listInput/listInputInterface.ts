// listInputInterface.ts

import { markRaw } from "vue";
import { setType, TextInputInterfaceComponent } from "baklavajs";

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
