// code.ts

import { PythonCode } from "@babsey/code-graph";

export class MyPythonCode extends PythonCode {
  public readonly name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }
}
