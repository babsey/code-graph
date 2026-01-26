// sliderInterface.ts

import { markRaw, type ComponentOptions } from "vue";
import { SliderInterfaceComponent } from "@baklavajs/renderer-vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class SliderInterface extends BaseNumericInterface {
  public component: ComponentOptions = markRaw(SliderInterfaceComponent) as ComponentOptions;
  public componentName: string = "SliderInterface";
  public min: number = 0;
  public max: number = 1;

  override getValue = (): string => `${Math.round(this.value * 1000) / 1000}`;
}
