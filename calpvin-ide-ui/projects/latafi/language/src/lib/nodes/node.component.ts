import { Node } from './node';
import { ViewContainerRef, EventEmitter } from '@angular/core';

export abstract class NodeComponent {
  abstract node: Node;
  readonly nodePLaces: ViewContainerRef[] = [];

  afterViewInitLont = new EventEmitter();

  public setNodeStyle(node: Node): {} {
    if (node?.independent === true) {
      return {
        margin: '20px'
      };
    } else {
      return {};
    }
  }
}
