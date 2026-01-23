// tupleInputInterface.ts

import { setType } from "@baklavajs/interface-types";
import { markRaw } from "vue";

import { tupleType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";
import { TextInputInterface as TextInputInterfaceComponent } from "../components";

export class TupleInputInterface extends CodeNodeInputInterface {
  constructor(name: string, value: string = "") {
    super(name, value);
    this.componentName = "TupleInputInterface";
    this.setComponent(markRaw(TextInputInterfaceComponent));

    this.use(setType, tupleType);
  }

  override getValue = (): string => `(${this.value})`;
}
