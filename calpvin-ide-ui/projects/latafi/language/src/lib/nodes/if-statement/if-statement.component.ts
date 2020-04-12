import { Component, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { NodeComponent } from '../node.component';
import { IfStatementNode } from './if-statement.node';

@Component({
  selector: 'ltfy-if-statement',
  template: `
    <div class='node' style="" [ngStyle]="setNodeStyle(node)">
      <span>Если</span> <span><ng-template #nodePlace1></ng-template></span> <span>Тогда</span>
      <div><ng-template #nodePlace2></ng-template>БлокКода</div>
    </div>
  `,
  styles: []
})
export class IfStatementComponent extends NodeComponent implements OnInit, AfterViewChecked {
  node: IfStatementNode;

  @ViewChild('nodePlace1', { read: ViewContainerRef }) nodePlace1Ref: ViewContainerRef;
  @ViewChild('nodePlace2', { read: ViewContainerRef }) nodePlace2Ref: ViewContainerRef;

  constructor(private cdRef: ChangeDetectorRef) {
    super();

    this.cdRef.detach();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    this.cdRef.reattach();
    this.nodePLaces.push(this.nodePlace1Ref);
    this.nodePLaces.push(this.nodePlace2Ref);

    this.afterViewInitLont.emit();
  }

  ngOnInit(): void {
  }
}
