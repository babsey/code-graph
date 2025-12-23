// state.ts

import { PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "./codeNodeTypes";

export const viewModel = useCodeGraph({ code: new PythonCode() });
registerNodeTypes(viewModel);

viewModel.onMounted = () => {
  if (viewModel.subscribe) viewModel.subscribe();
  viewModel.engine?.start();
  viewModel.engine?.runOnce(null);
};

viewModel.onBeforeUnmount = () => {
  if (viewModel.unsubscribe) viewModel.unsubscribe();
  viewModel.engine?.stop();
};
