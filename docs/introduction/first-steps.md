# First steps

This guide shows first steps in Code Graph interface. For this part, you need to start the 
[development server](http://localhost:5173/introduction/getting-started.html#_3-start-the-development-server) or run the 
docker container.

The main page of Code Graph is composed of toolbar (top), list of node types (left), graph workspace (center) and code 
editor (right).

![Main page](/images/code-graph-main.png)

## Create node

To create node, you can drag a node from the list (left) into graph workspace. 

![Create node](/images/create-node.png)

Or clicking the right mouse button in graph workspace open the context menu of node types to add.

![Context menu](/images/graph-context-menu.png)

## Connect nodes

To connect nodes, first click a right port, then move towards to another node and then click on a left port.

![Connecting nodes](/images/connecting-nodes.png)

## Code editor

On user action code generation engine runs and the results can be viewed and edited in code editor (left).
Once the user modified the code script, it shows the lock icon indicating that the code script is locked from 
being overwritten. Clicking on lock icon restores the code script to the generative mode.

<div style="display: flex">
  <img src="/images/code-editor.png" alt="Code editor" style="width: 260px; margin: auto;">
  <img src="/images/code-editor-locked.png" alt="Locked code editor" style="width: 260px; margin: auto;">
</div>