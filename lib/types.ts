import type { Component } from 'vue';

export interface Output {
	name: string;
	value: string | number | boolean;
	to?: number;
	meta?: Record<string, unknown> | null;
}
export interface Node {
	nodeId: number;
	name: string;
	type: string;
	x: number;
	y: number;
	outputs: Output[];
	meta?: Record<string, unknown> | null;
}

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
	// Short description of what this node type does, displayed in the editor
	description?: string;
};
