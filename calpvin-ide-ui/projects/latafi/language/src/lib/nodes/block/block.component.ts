import { Component, OnInit, ViewContainerRef, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { NodeComponent } from '../node.component';
import { BlockNode } from './block.node';

@Component({
  selector: 'ltfy-block',
  template: `
    <div class='node' style="" [ngStyle]="setNodeStyle(node)">
      <ng-template #nodePlace1></ng-template>
    </div>
  `,
  styles: [``]
})
export class BlockComponent extends NodeComponent implements OnInit, AfterViewChecked {
  node: BlockNode;

  @ViewChild('nodePlace1', { read: ViewContainerRef }) nodePlace1Ref: ViewContainerRef;

  constructor(private cdRef: ChangeDetectorRef) {
    super();

    this.cdRef.detach();
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    this.cdRef.reattach();

    this.nodePLaces.push(this.nodePlace1Ref);

    this.afterViewInitLont.emit();
  }
}
