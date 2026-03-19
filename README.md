# flow-editor

This project is a re-usable flow chart and process diagram editor for web applications.

To use:

The nodes on the screen are a representation of two properties supplied to the component, nodes and node-types.

nodes are an array of flowchart nodes, they have the following structure:

```typescript
export interface Node {
	nodeId: number; // This property must be unique to the node for FlowEditor to work properly
	name: string; // Display name of the node in the diagram
	type: string; // Reference to the type of node this is, should match an entry in node-types
	x: number; // The x position in the diagram
	y: number; // The y position in the diagram
	outputs: Output[]; // A list of output nodes. These can be connected to other nodes in the diagram
	meta?: Record<string, unknown> | null; // Key value pair for any extra data that can be attached to the node.
};

export interface Output {
	name: string; // The display name of this output
	value: string|number|boolean; // Unused by default in the editor, this can be used to store some external value tied to this output. Can be string|number|boolean
	meta?: Record<string, unknown> | null; // Key value pair for any extra data that can be attached to the output.
}
```

Node types follow this structure, and define what kinds of nodes are available, how they look in the diagram, and any restrictions on their use. Note that there is one reserved node type named 'start' which denotes the beginning of the process diagram. This node
cannot be edited or moved and has one single output.

```typescript
export interface NodeType {
	// Display name of type. If not supplied, uses type
	name?: string;
	// The identifying value of the type
	type: string;
	// SVG Path data to use as an icon on the node
	svgIcon?: string;
	// The width of the node in the editor. Default of 200. You may need to increase this if the titles or outputs are long
	width?: number;
	// List of outputs that are added to the node when it is created.
	outputs: {
		name: string;
		value: string | number | boolean;
		// Extra data to add onto an output
		meta?: Record<string, unknown>;
	}[];
	// Change the fill color of this block
	fill?: string;
	// If true, outputs are not editable
	lockedOutputs?: boolean;
	// Custom editor for an output. For editing metadata or values
	outputEditComponent?: Component;
	// Custom creator for an output. Replaces the "Add Output" button
	outputCreateComponent?: Component;
	meta?: Record<string, unknown>;
	// Custom editor for the component. Use this to create editors for metadata
	nodeEditComponent?: Component;
};
```

All edits to nodes are done via three events on the FlowEditor component:
- create:node
- update:node
- delete:node

You will need to implement these and update your node array yourself, as FlowEditor does not do any actual data editing, just gives these events when things are changed. The create:node event creates nodes with a nodeId of -1, you are expected to assign a unique id yourself before adding the node back to your list. All three events have one parameter of the Node type, being the node created, updated, or deleted.


There is an example usage in the /src directory. This shows how you can have custom editors for outputs.


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
