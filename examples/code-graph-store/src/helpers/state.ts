// state.ts

import { PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "../codeNodeTypes/register";
import { saveEditor } from "./editor";

export const viewModel = useCodeGraph({ code: new PythonCode() });
registerNodeTypes(viewModel, ["default", "norse", "torch"]);

const token = Symbol("CodeGraphState");

viewModel.onMounted = () => {
  if (viewModel.subscribe) viewModel.subscribe();
  viewModel.engine?.events.afterRun.subscribe(token, saveEditor);
  viewModel.engine?.start();
  viewModel.engine?.runOnce(null);
};

viewModel.onBeforeUnmount = () => {
  viewModel.engine?.stop();
  viewModel.engine?.events.afterRun.unsubscribe(token);
  if (viewModel.unsubscribe) viewModel.unsubscribe();
};
