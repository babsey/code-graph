// createInterface.ts

import {
  CheckboxInterface,
  IntegerInterface,
  ListInputInterface,
  NumberInterface,
  SelectInterface,
  TextInputInterface,
  TupleInputInterface,
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

export const createInterface = (name: string, interfaceProps: IInterfaceProps) => {
  switch (name) {
    case "CheckBoxInterface":
      return new CheckboxInterface(interfaceProps.id, Boolean(interfaceProps.value));
    case "IntegerInterface":
      return new IntegerInterface(
        interfaceProps.id,
        Number(interfaceProps.value),
        interfaceProps.min,
        interfaceProps.max,
      );
    case "ListInputInterface":
      return new ListInputInterface(interfaceProps.id, String(interfaceProps.value));
    case "NumberInterface":
      return new NumberInterface(
        interfaceProps.id,
        Number(interfaceProps.value),
        interfaceProps.min,
        interfaceProps.max,
      );
    case "SelectInterface":
      return new SelectInterface(interfaceProps.id, Number(interfaceProps.value), interfaceProps.items as string[]);
    case "TupleInputInterface":
      return new TupleInputInterface(interfaceProps.id, String(interfaceProps.value));
    default:
      return new TextInputInterface(interfaceProps.id, String(interfaceProps.value));
  }
};
