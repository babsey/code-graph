// listInputInterface.ts

import { markRaw, type ComponentOptions } from "vue";
import { setType } from "@baklavajs/interface-types";

import { listType } from "@/interfaceTypes";

import { CodeNodeInputInterface } from "../codeNodeInput/codeNodeInputInterface";
import { TextInputInterface as TextInputInterfaceComponent } from "../components";

export class ListInputInterface extends CodeNodeInputInterface {
  public component: ComponentOptions = markRaw(TextInputInterfaceComponent) as ComponentOptions;
  public componentName: string = "ListInputInterface";

  constructor(name: string, value: string = "") {
    super(name, value);
    this.use(setType, listType);
  }

  override getValue = (): string => `[${this.value}]`;
}
