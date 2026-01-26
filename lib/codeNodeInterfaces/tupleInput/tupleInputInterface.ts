// tupleInputInterface.ts

import { setType } from "@baklavajs/interface-types";
import { markRaw, type ComponentOptions } from "vue";

import { tupleType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";
import { TextInputInterface as TextInputInterfaceComponent } from "../components";

export class TupleInputInterface extends CodeNodeInputInterface {
  public component: ComponentOptions = markRaw(TextInputInterfaceComponent) as ComponentOptions;
  public componentName: string = "TupleInputInterface";

  constructor(name: string, value: string = "") {
    super(name, value);
    this.use(setType, tupleType);
  }

  override getValue = (): string => `(${this.value})`;
}
