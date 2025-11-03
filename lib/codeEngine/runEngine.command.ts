// runEngine.command.ts

import type { ICommandHandler } from "baklavajs";

import type { CodeGraph } from "@/codeGraph";
import { RUN_ENGINE_COMMAND } from "@/settings";
import type { CodeEngine } from "./codeEngine";

/**
 * Reister run engine commands.
 * @param viewModel view model instance
 */
export const registerRunEngineCommands = (engine: CodeEngine, handler: ICommandHandler) => {
  // Toggle minimap
  handler.registerCommand(RUN_ENGINE_COMMAND, {
    execute: () => engine.runOnce(null),
    canExecute: () => true,
  });
};
