import { Component, OnInit } from '@angular/core';
import { NodeComponent } from './node.component';
import { NodePlace } from './node-place';
import { Node } from './node';

@Component({
  selector: 'ltfy-node-place',
  template: `
   <span class="node node-place" [ngStyle]="setNodeStyle(node)"><input value="Заполните" /></span>
  `
})
export class NodePlaceComponent extends NodeComponent implements OnInit {
  node: NodePlace;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onClick() {
  }

  setNodeStyle(node: Node) {
    const style = super.setNodeStyle(node);

    return {
      ...style,
      padding: '20px'
    };
  }
}
