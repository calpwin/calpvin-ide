import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { NodeComponent } from '../node.component';
import { BlockNode } from './block.node';

@Component({
  selector: 'ltfy-block',
  template: `
    <div style="">
      <ng-template #nodePlace1></ng-template>
    </div>
  `,
  styles: []
})
export class BlockComponent extends NodeComponent implements OnInit, AfterViewInit {
  node: BlockNode;

  @ViewChild('nodePlace1', { read: ViewContainerRef }) nodePlace1Ref: ViewContainerRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.nodePLaces.push(this.nodePlace1Ref);

    this.afterViewInit.emit();
  }

  onClick() {
  }
}
