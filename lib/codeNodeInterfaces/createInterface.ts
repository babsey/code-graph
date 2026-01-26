// createInterface.ts

import type { SelectInterfaceItem } from "@baklavajs/renderer-vue";

import {
  CheckboxInterface,
  IntegerInterface,
  ListInputInterface,
  NumberInterface,
  SelectInterface,
  SliderInterface,
  TextInputInterface,
  TupleInputInterface,
} from ".";

export interface IInterfaceProps {
  forceUpdate?: boolean;
  hidden?: boolean;
  id: string;
  items?: SelectInterfaceItem<unknown>[];
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
      return new SelectInterface(interfaceProps.id, interfaceProps.value, interfaceProps.items);

    case "SliderInterface":
      return new SliderInterface(
        interfaceProps.id,
        Number(interfaceProps.value),
        interfaceProps.min,
        interfaceProps.max,
      );

    case "TupleInputInterface":
      return new TupleInputInterface(interfaceProps.id, String(interfaceProps.value));

    default:
      return new TextInputInterface(interfaceProps.id, String(interfaceProps.value));
  }
};
