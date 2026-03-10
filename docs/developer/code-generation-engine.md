# Code generation engine

The code graph contains engine to generate scripted code. By default the engine is not started. 
Thus it has to be started on app component.

```typescript
// state.ts
...

viewModel.onMounted = () => {
  if (viewModel.subscribe) viewModel.subscribe();
  viewModel.engine?.start();
  viewModel.engine?.runOnce(null);
};

viewModel.onBeforeUnmount = () => {
  if (viewModel.unsubscribe) viewModel.unsubscribe();
  viewModel.engine?.stop();
};
```

These function `onMounted` and `onBeforeUnmount` will be called in built-in `CodeGraphEditor.vue`:


```typescript
// CodeGraphEditor.vue
...

onMounted(viewModelRef.value.onMounted);
onBeforeUnmount(viewModelRef.value.onBeforeUnmount);

watch(viewModelRef, (newValue, oldValue) => {
  if (oldValue) oldValue.onBeforeUnmount();
  if (newValue) newValue.onMounted();
});

...
```