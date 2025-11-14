// createInterface.ts

import {
  CheckboxInterface,
  CodeNodeInputInterface,
  IntegerInterface,
  NumberInterface,
  SelectInterface,
  TextInputInterface,
} from ".";

export interface IInterfaceProps {
  forceUpdate?: boolean;
  hidden?: boolean;
  id: string;
  items?: string[];
  max?: number;
  min?: number;
  name?: string;
  value: unknown;
}

export const createInterface = (name: string, interfaceProps: IInterfaceProps): CodeNodeInputInterface => {
  switch (name) {
    case "CheckBoxInterface":
      return new CheckboxInterface(interfaceProps.id, interfaceProps.value as boolean);
    case "IntegerInterface":
      return new IntegerInterface(
        interfaceProps.id,
        interfaceProps.value as number,
        interfaceProps.min,
        interfaceProps.max,
      );
    case "NumberInterface":
      return new NumberInterface(
        interfaceProps.id,
        interfaceProps.value as number,
        interfaceProps.min,
        interfaceProps.max,
      );
    case "SelectInterface":
      return new SelectInterface(interfaceProps.id, interfaceProps.value as number, interfaceProps.items as string[]);
    default:
      return new TextInputInterface(interfaceProps.id, interfaceProps.value as string);
  }
};
