import { Component, OnInit } from '@angular/core';
import { NodeComponent } from './node.component';

@Component({
  selector: 'ltfy-node-place',
  template: `
  `,
  styles: []
})
export class NodePlaceComponent extends NodeComponent implements OnInit {
  node: import('./node').Node = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onClick() {
  }
}
