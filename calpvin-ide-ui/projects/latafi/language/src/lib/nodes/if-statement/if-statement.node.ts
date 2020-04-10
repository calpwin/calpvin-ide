import * as ts from 'typescript';
import { Node } from '../node';
import { Type } from '@angular/core';
import { NodeComponent } from '../node.component';
import { IfStatementComponent } from './if-statement.component';
import { NodePlace } from '../node-place';
import { NodeKind } from '../node-kind';

export class IfStatementNode extends Node {
  kind = NodeKind.IfStatement;

  nodePlaces: NodePlace[] = [];

  NodeComponentType: Type<NodeComponent> = IfStatementComponent;

  constructor(
    public node: ts.IfStatement) {
    super();

    this.nodePlaces.push(new NodePlace(['expression']));
    this.nodePlaces.push(new NodePlace(['block']));
  }
}
