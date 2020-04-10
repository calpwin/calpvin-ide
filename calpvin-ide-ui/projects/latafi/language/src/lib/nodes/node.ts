import { NodeComponent } from './node.component';
import { Type } from '@angular/core';
import { NodePlace } from './node-place';
import { NodeKind } from './node-kind';

export abstract class Node {
  constructor() {
  }

  abstract readonly NodeComponentType: Type<NodeComponent>;

  abstract readonly kind: NodeKind;

  abstract readonly nodePlaces: NodePlace[];
}
