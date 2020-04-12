import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { NodeComponent } from '../node.component';
import { PropertyAccessExpressionNode } from './property-access-expression.node';

@Component({
  selector: 'ltfy-property-access-expression',
  template: `
    <span class='node' style="" [ngStyle]="setNodeStyle(node)">
      {{node?.state?.expressionText}}
    </span>
  `,
  styles: []
})
export class PropertyAccessExpressionComponent extends NodeComponent implements OnInit, AfterViewChecked {
  node: PropertyAccessExpressionNode;

  constructor(private cdRef: ChangeDetectorRef) {
    super();

    this.cdRef.detach();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    this.cdRef.reattach();
    this.afterViewInitLont.emit();
  }

  ngOnInit(): void {
  }
}
