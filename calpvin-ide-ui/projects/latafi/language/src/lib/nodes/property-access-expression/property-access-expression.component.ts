import { Component, OnInit } from '@angular/core';
import { NodeComponent } from '../node.component';
import { PropertyAccessExpressionNode } from './property-access-expression.node';

@Component({
  selector: 'ltfy-property-access-expression',
  template: `
    <div style="">
      {{node?.state?.expressionText}}
    </div>
  `,
  styles: []
})
export class PropertyAccessExpressionComponent extends NodeComponent implements OnInit {
  node: PropertyAccessExpressionNode;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onClick() {
  }
}
