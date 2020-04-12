import { Node } from './node';
import { Type } from '@angular/core';
import { NodeComponent } from './node.component';
import { NodeKind } from './node-kind';
import { NodePlaceComponent } from './node-place.component';

export class NodePlace extends Node {
  NodeComponentType = NodePlaceComponent;
  kind = NodeKind.NodePLace;
  nodePlaces: NodePlace[] = [];
  independent = false;

  constructor(readonly availableNodeTypes: string[]) {
    super();
  }

  currentNode: Node;
}
