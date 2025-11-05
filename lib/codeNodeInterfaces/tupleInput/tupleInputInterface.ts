// tupleInputInterface.ts

import { TextInputInterfaceComponent } from "@baklavajs/renderer-vue";
import { setType } from "@baklavajs/interface-types";
import { markRaw } from "vue";

import { CodeNodeInputInterface, tupleType } from "@/main";

export class TupleInputInterface extends CodeNodeInputInterface {
  constructor(name: string = "", value: string = "") {
    super(name, value);
    this.setComponent(markRaw(TextInputInterfaceComponent));

    this.use(setType, tupleType);
  }

  override getValue = (): string => `(${this.value})`;
}
