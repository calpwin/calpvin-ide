import { Node } from './node';
import { ViewContainerRef, EventEmitter } from '@angular/core';

export abstract class NodeComponent {
  abstract node: Node;
  readonly nodePLaces: ViewContainerRef[] = [];

  afterViewInit = new EventEmitter();
}
