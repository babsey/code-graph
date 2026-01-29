// formatInputs.ts

import type { CodeNodeInputInterface } from "@/main";

/**
 * Format inputs for mustache templates.
 * @param intfs code node input interfaces
 * @returns a list of string
 */
export const formatInputs = (intfs: Record<string, CodeNodeInputInterface>, withKeywords: boolean = true): string[] => {
  const args: string[] = [];

  const inputKeys = Object.keys(intfs);
  inputKeys.forEach((inputKey: string) => {
    const intf = intfs[inputKey];
    if (intf?.hidden) return;

    const keyword = withKeywords && args.length < inputKeys.indexOf(inputKey) ? `${inputKey}=` : "";
    args.push(`${keyword}{{ inputs.${inputKey} }}`);
  });

  return args;
};
