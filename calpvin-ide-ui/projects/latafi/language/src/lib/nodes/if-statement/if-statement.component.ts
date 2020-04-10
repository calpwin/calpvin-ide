import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { NodeComponent } from '../node.component';
import { IfStatementNode } from './if-statement.node';

@Component({
  selector: 'ltfy-if-statement',
  template: `
    <div style="">
      <span>Если</span> <span><ng-template #nodePlace1></ng-template></span> <span>Тогда</span>
      <div><ng-template #nodePlace2></ng-template>БлокКода</div>
    </div>
  `,
  styles: []
})
export class IfStatementComponent extends NodeComponent implements OnInit, AfterViewInit {
  node: IfStatementNode;

  @ViewChild('nodePlace1', { read: ViewContainerRef }) nodePlace1Ref: ViewContainerRef;
  @ViewChild('nodePlace2', { read: ViewContainerRef }) nodePlace2Ref: ViewContainerRef;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.nodePLaces.push(this.nodePlace1Ref);
    this.nodePLaces.push(this.nodePlace2Ref);

    this.afterViewInit.emit();
  }

  ngOnInit(): void {
  }

  onClick() {
  }
}
