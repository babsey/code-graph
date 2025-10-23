// listInputInterface.ts

import { markRaw } from 'vue';
import { setType, TextInputInterfaceComponent } from 'baklavajs';

import { CodeNodeInputInterface, listType } from '@/main';

export class ListInputInterface extends CodeNodeInputInterface {
  constructor(name: string = '', value: string = '') {
    super(name, value);
    this.setComponent(markRaw(TextInputInterfaceComponent));

    this.use(setType, listType);
  }

  override getValue = (): string => `[${this.value}]`;
}
