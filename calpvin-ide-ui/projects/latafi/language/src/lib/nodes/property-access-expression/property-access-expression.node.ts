import * as ts from 'typescript';
import { Node } from '../node';
import { Type } from '@angular/core';
import { NodeComponent } from '../node.component';
import { NodePlace } from '../node-place';
import { PropertyAccessExpressionComponent } from './property-access-expression.component';
import { NodeKind } from '../node-kind';

export class PropertyAccessExpressionNode extends Node {
  kind = NodeKind.PropertyAccessExpression;

  nodePlaces: NodePlace[] = [];

  NodeComponentType: Type<NodeComponent> = PropertyAccessExpressionComponent;

  constructor(
    public node: ts.PropertyAccessExpression | ts.Identifier) {
    super();

    if (ts.isIdentifier(node)) {
      this.state.expressionText = node.text;
    } else if (ts.isPropertyAccessExpression(node)) {
      this.state.expressionText = node.getFullText();
    }
  }

  state = {
    expressionText: ''
  };
}
