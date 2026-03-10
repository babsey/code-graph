# Code node type

Code node types are essential elements of the graph. We prepared some default and sample node types. They are listed in
the palette that user can add them to the graph.

The user is able to create own node types but they need to be defined and registered.

::: info
You can also read the detailed documentation of node definition and registration here:

- https://baklava.tech/nodes/nodes.html
- https://baklava.tech/editor/registering-nodes.html
  :::

## Node definition

The `defineCodeNode` function allows you to create own code node type. It is easy to understand.
It is similar to `defineComponent` expecting a single argument:

```
const codeNode = defineCodeNode({
    type: 'some type',
    name: 'name name',
    title: 'some title',
    variableName: 'some variableName',
    inputs: {
        in1: () => new CodeNodeInputInteface('in1'),
        in2: () => new CodeNodeInputInteface('in2'),
    },
    outputs: {
        out: () => new CodeNodeOutputInterface()
    }
})
```

Available properties:

- `type` The only required property to save/load node in the graph. Thus, it is important that it has to be unique.
- `name` (optional) the name is for the function name in code script.
- `title` (optional) the title shows in the palette and in the node header.
- `variableName` (optional) the variable name is addressed to the output.
- `inputs` (optional) Specifications for the node input interface.
- `outputs` (optional) Specifications for the node output interface.
- `codeTemplate` (optional): By default, it contains a function to generate code with code node inputs.

  ```
  codeTemplate() {
    return `${this.name}(${formatInputs(this.codeNodeInputs).join(", ")})`;
  };
  ```

- `calculate` (optional): It renders code using mustache package with inputs values and the render outcome will update
  node output values.

  ```
  calculate(inputs, globalValues) {
    const outputs: CalculateFunctionReturnType<unknown> = {};
    if (!this.lockCode) outputs._code = this.renderCode({ inputs, ...globalValues });
    this.updateOutputValues(outputs);
    return outputs;
  };
  ```

### Node events

Additional to the node type properties, you can add node event handlers:

::: info
  The inherited node events is explained in BaklavaJS documentation.
  - https://baklava.tech/nodes/lifecycle.html
:::

When the `defineDynamicCodeNode` function is applied, you can use these properties:

- `onUpdate`

Among the inherited events the function `defineCodeNode` provides users to use these node events:

| Event | Description |
| ----- | ----------- |
| `beforeRun` | Call the event before running the code generation engine. |
| `onConnected` | Call the event on node connection. |
| `onUnconnected` | Call the event on node disconnection. |

## Node registration

When the node type is created, it needs to be registered in the view model. The step is required for the view and 
saving/loading nodes.

To register node type, call the `registerNodeType` of the editor instance:

```
const codeNode = defineCodeNode({
    type: 'sample'
    # more properties
})
editor.registerNodeType(codeNode);
```

