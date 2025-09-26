// baseStringInterface.ts

import { setType } from 'baklavajs'

import { CodeNodeInputInterface } from './codeNodeInput/codeNodeInputInterface'
import { stringType } from '@/interfaceTypes'

export class BaseStringInterface extends CodeNodeInputInterface<string> {
  constructor(name: string, value: string) {
    super(name, value)

    this.use(setType, stringType)
  }

  override getValue = (): string => `'${this.value}'`
}
