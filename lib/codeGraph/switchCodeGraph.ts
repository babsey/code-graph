// switchCodeGraph.ts

import { type Ref } from "vue";

import type { CodeEditor } from "@/codeEditor";
import { CodeGraph } from "./codeGraph";
import type { CodeGraphTemplate } from "./codeGraphTemplate";

export type SwitchCodeGraph = (newGraph: CodeGraph | CodeGraphTemplate) => void;

const isTemplate = (g: CodeGraph | CodeGraphTemplate): g is CodeGraphTemplate => !(g instanceof CodeGraph);

export function useSwitchCodeGraph(editor: Ref<CodeEditor>, displayedGraph: Ref<CodeGraph>) {
  const switchGraph: SwitchCodeGraph = (newGraph: CodeGraph | CodeGraphTemplate) => {
    console.log("switch graph");
    let newGraphInstance: CodeGraph;
    if (!isTemplate(newGraph)) {
      if (newGraph !== editor.value.graph) {
        throw new Error(
          "Can only switch using 'Graph' instance when it is the root graph. " +
            "Otherwise a 'GraphTemplate' must be used.",
        );
      }
      newGraphInstance = newGraph;
    } else {
      newGraphInstance = new CodeGraph(editor.value);
      newGraph.createGraph(newGraphInstance);
    }

    if (displayedGraph.value && displayedGraph.value !== editor.value.graph) {
      displayedGraph.value.destroy();
    }

    newGraphInstance.panning = newGraphInstance.panning ?? newGraph.panning ?? { x: 0, y: 0 };
    newGraphInstance.scaling = newGraphInstance.scaling ?? newGraph.scaling ?? 1;
    newGraphInstance.selectedNodes = newGraphInstance.selectedNodes ?? [];
    newGraphInstance.sidebar = newGraphInstance.sidebar ?? { visible: false, nodeId: "", optionName: "" };

    displayedGraph.value = newGraphInstance;

    newGraphInstance.code.registerGraph(newGraphInstance);
    newGraphInstance.code.engine?.runOnce(null);
  };

  return { switchGraph };
}
