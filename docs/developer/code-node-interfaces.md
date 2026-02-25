# Code node interface

Code node interfaces are input and output instances of the code node. Output interfaces are visualised as ports only 
whereas input interfaces can display various interfaces which can be modified by user.

![Code node interfaces](/public/images/code-node-interfaces.png)

::: info
  You can read detailed guide of node interface:
  - https://baklava.tech/nodes/interfaces.html
:::

The Code Graph provides build-in code node interfaces:

| Interface | Description | Python code |
| --------- | ----------- | ----------- |
| `CheckboxInterface(name, value)` | Checkbox for boolean value | `True` or `False` |
| `IntegerInterface(name, value)` | Interger value | `1` |
| `NumberInterface(name, value)` | Number value | `1.0` |
| `ListInputInterface(name, value)` | Input for list | `[1, 2]` |
| `SelectInterface(name, value, items)` | Select a value out of items | `"item"` |
| `SliderInterface(name, value, min, max)` | Slider for a number value | `1` |
| `TextareaInputInterface(name, value)` | Textarea input for string value | `"text"` |
| `TextInputInterface(name, value)` | Text input for string value | `"text"` |
| `TupleInputInterface(name, value)` | Input for tuple | `(1, 2)` |

See an example of code node definition (Taken from `/src/codeNodeTypes/example/myFunction.ts`):

```typescript
defineCodeNode({
  type: "myFunction",
  title: "my function",
  variableName: "f",
  inputs: {
    optional: () => new CodeNodeInputInterface("optional").setOptional(true),
    checkbox: () => new CheckboxInterface("checkbox", true),
    integer: () => new IntegerInterface("integer", 1),
    number: () => new NumberInterface("number", 1),
    select: () => new SelectInterface("select", "a", ["a", "b", "c"]),
    slider: () => new SliderInterface("slider", 0.5, 0, 1),
    text_input: () => new TextInputInterface("text input", "a"),
    textarea_input: () => new TextareaInputInterface("textarea input", "a"),
    list: () => new ListInputInterface("list"),
    multiple: () => new CodeNodeInputInterface<string[]>("multiple", []).use(allowMultipleConnections),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
    custom: () => new CodeNodeOutputInterface(".custom", ".custom"),
  },
});
```
