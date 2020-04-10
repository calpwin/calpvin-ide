import * as ts from 'typescript';
import { Node } from '../node';
import { Type } from '@angular/core';
import { NodeComponent } from '../node.component';
import { NodePlace } from '../node-place';
import { NodeKind } from '../node-kind';
import { BlockComponent } from './block.component';

export class BlockNode extends Node {
  kind = NodeKind.Block;

  nodePlaces: NodePlace[] = [];

  NodeComponentType: Type<NodeComponent> = BlockComponent;

  constructor(
    public node: ts.Block) {
    super();

    this.nodePlaces.push();
  }
}
