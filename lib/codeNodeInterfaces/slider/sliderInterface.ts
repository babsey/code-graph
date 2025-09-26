// sliderInterface.ts

import { markRaw, type ComponentOptions } from 'vue'
import { SliderInterfaceComponent } from 'baklavajs'

import { BaseNumericInterface } from '../baseNumericInterface'

export class SliderInterface extends BaseNumericInterface {
  component = markRaw(SliderInterfaceComponent) as ComponentOptions
  min: number
  max: number

  constructor(name: string, value: number, min: number, max: number) {
    super(name, value, min, max)
    this.min = min
    this.max = max
  }

  override getValue = (): string => `${Math.round(this.value * 1000) / 1000}`
}
