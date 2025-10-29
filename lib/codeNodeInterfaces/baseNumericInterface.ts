// baseNumericInterface.ts

import { computed, nextTick, ref, watch, type Ref } from "vue";
import { NodeInterface, setType } from "baklavajs";

import { CodeNodeInputInterface } from "./codeNodeInput/codeNodeInputInterface";
import { numberType } from "@/interfaceTypes";

const MAX_STRING_LENGTH = 9;

export interface IValidator {
  validate: (v: number) => boolean;
}

function isValidator(intf): intf is IValidator {
  return "validate" in intf;
}

export class BaseNumericInterface extends CodeNodeInputInterface<number> implements IValidator {
  public min?: number;
  public max?: number;

  constructor(name: string, value: number, min?: number, max?: number) {
    super(name, value);
    this.min = min;
    this.max = max;

    this.use(setType, numberType);
  }

  public validate(v: number) {
    return (this.min === undefined || v >= this.min) && (this.max === undefined || v <= this.max);
  }
}

export const useBaseNumericInterface = (intf: Ref<NodeInterface<number>>, precision = 3) => {
  const inputEl = ref<HTMLInputElement | null>(null);
  const editMode = ref(false);
  const invalid = ref(false);
  const tempValue = ref("0");

  const stringRepresentation = computed(() => {
    const s = intf.value.value.toFixed(precision);
    return s.length > MAX_STRING_LENGTH ? intf.value.value.toExponential(MAX_STRING_LENGTH - 5) : s;
  });

  const validate = (v: number) => {
    if (Number.isNaN(v)) {
      return false;
    } else if (isValidator(intf.value)) {
      return intf.value.validate(v);
    } else {
      return true;
    }
  };

  const setValue = (newValue: number) => {
    if (validate(newValue)) {
      intf.value.value = newValue;
    }
  };

  watch(tempValue, () => {
    invalid.value = false;
  });

  const enterEditMode = async () => {
    tempValue.value = intf.value.value.toFixed(precision);
    editMode.value = true;
    await nextTick();
    if (inputEl.value) {
      inputEl.value.focus();
    }
  };

  const leaveEditMode = () => {
    const v = parseFloat(tempValue.value);
    if (!validate(v)) {
      invalid.value = true;
    } else {
      setValue(v);
      editMode.value = false;
    }
  };

  return {
    editMode,
    invalid,
    tempValue,
    inputEl,
    stringRepresentation,
    validate,
    setValue,
    enterEditMode,
    leaveEditMode,
  };
};
