// numpy/register.ts

import { addDefaultInterfaceTypes, type ICodeGraphViewModel } from "@babsey/code-graph";

import { addNumpyInterfaceTypes } from "./interfaceTypes";

import numpyArange from "./numpyArange";
import numpyArgwhere from "./numpyArgwhere";
import numpyConcatenate from "./numpyConcatenate";
import numpyConvolve from "./numpyConvolve";
import numpyCorrCoef from "./numpyCorrCoef";
import numpyCorrelate from "./numpyCorrelate";
import numpyFull from "./numpyFull";
import numpyHistogram from "./numpyHistogram";
import numpyLinspace from "./numpyLinspace";
import numpyRandomNormal from "./numpyRandomNormal";
import numpyRandomRandint from "./numpyRandomRandint";
import numpyRandomSeed from "./numpyRandomSeed";
import numpyRandomUniform from "./numpyRandomUniform";

export const registerNumpyNodeTypes = (viewModel: ICodeGraphViewModel) => {
  let category: string;

  addDefaultInterfaceTypes(viewModel);
  addNumpyInterfaceTypes(viewModel);

  const editor = viewModel.editor;

  category = "numpy";
  editor.registerCategoryModule(category, "import numpy as np");
  editor.registerNodeType(numpyArange, { category });
  editor.registerNodeType(numpyArgwhere, { category });
  editor.registerNodeType(numpyConcatenate, { category });
  editor.registerNodeType(numpyConvolve, { category });
  editor.registerNodeType(numpyCorrCoef, { category });
  editor.registerNodeType(numpyCorrelate, { category });
  editor.registerNodeType(numpyFull, { category });
  editor.registerNodeType(numpyHistogram, { category });
  editor.registerNodeType(numpyLinspace, { category });

  category = "numpy.random";
  editor.registerCategoryModule(category, "import numpy as np");
  editor.registerNodeType(numpyRandomNormal, { category });
  editor.registerNodeType(numpyRandomRandint, { category });
  editor.registerNodeType(numpyRandomSeed, { category });
  editor.registerNodeType(numpyRandomUniform, { category });
};
