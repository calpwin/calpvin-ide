import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import * as ts from 'typescript';
import { IfStatementNode } from './nodes/if-statement/if-statement.node';
import { Node } from './nodes/node';
import { NodePlace } from './nodes/node-place';
import { PropertyAccessExpressionNode } from './nodes/property-access-expression/property-access-expression.node';
import { BlockNode } from './nodes/block/block.node';
import { NodeKind } from './nodes/node-kind';
import { NodePlaceComponent } from './nodes/node-place.component';

const tsCode = `
{
  A.LogUser;

  if () {
    A.Call();
  }

  if (A.B) {
    A.B();

    B.C();

    if () {
      k.c();
    }
  }
}
`;

@Component({
  selector: 'ltfy-language',
  template: `
    <ng-template #dynamicNodes></ng-template>
  `,
  styleUrls: ['language.component.scss']
})
export class LanguageComponent implements AfterViewInit, OnInit {

  constructor(
    private vf: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild('dynamicNodes', { read: ViewContainerRef }) dynamicNodesRef: ViewContainerRef;

  private nodeTree: NodePlace;

  ngAfterViewInit(): void {
    this.renderNodes();
  }

  ngOnInit(): void {
    const sourceFile = ts.createSourceFile('example', tsCode, ts.ScriptTarget.ES2015, true);

    this.nodeTree = new NodePlace(['any']);

    // Sad but need
    this.matchNode(sourceFile, null);
  }

  private matchNode(fromParentNode: ts.Node, toParentNode: Node) {
    let nodePLacePosition = 0;

    const visit = (node: ts.Node) => {
      switch (node.kind) {
        case ts.SyntaxKind.Block:
          const blockNode = new BlockNode(node as ts.Block);

          if (toParentNode == null) {
            this.nodeTree.currentNode = blockNode;
            toParentNode = blockNode;
          } else {
            this.addNode(blockNode, toParentNode, nodePLacePosition);
            nodePLacePosition++;
          }

          this.matchNode(node, blockNode);
          break;
        case ts.SyntaxKind.IfStatement:
          const ifNode = new IfStatementNode(node as ts.IfStatement);

          this.addNode(ifNode, toParentNode, nodePLacePosition);
          nodePLacePosition++;

          this.matchNode(node, ifNode);
          break;
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.ExpressionStatement:
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.CallExpression:
          if (toParentNode.kind !== NodeKind.Block && toParentNode.nodePlaces.length === 0) { break; }

          if (ts.isIdentifier(node) && node.getText() === '') { nodePLacePosition++; return; }

          // const propAccessPlace = this.currentPlace.currentNode.nodePlaces[0];
          const propAccessNode = new PropertyAccessExpressionNode(
            node as ts.PropertyAccessExpression | ts.Identifier | ts.ExpressionStatement | ts.CallExpression);
          propAccessNode.independent = toParentNode.kind === NodeKind.Block ? true : false;
          // this.currentPlace = propAccessPlace;

          this.addNode(propAccessNode, toParentNode, nodePLacePosition);
          nodePLacePosition++;

          this.matchNode(node, propAccessNode);
          break;
      }
    };

    ts.forEachChild(fromParentNode, visit);
  }

  private addNode(node: Node, toNode: Node, nodePLacePosition: number) {
    if (toNode.kind === NodeKind.Block && toNode.nodePlaces.length - 1 < nodePLacePosition) {
      const _nodePlace = new NodePlace(['any']);
      _nodePlace.currentNode = node;
      toNode.nodePlaces.push(_nodePlace);
    } else {
      toNode.nodePlaces[nodePLacePosition].currentNode = node;
    }
  }

  private timeoutExeced = false;

  private renderNodePlace(nodePlace: NodePlace, viewContainer: ViewContainerRef) {
    const currentNode = nodePlace.currentNode ?? nodePlace;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(currentNode.NodeComponentType);
    const viewCompRef = viewContainer.createComponent(componentFactory);
    viewCompRef.instance.node = currentNode;

    // const subscription = viewCompRef.instance.afterViewInitLont.subscribe(() => {
    //   for (let index = 0; index < nodePlace.currentNode.nodePlaces.length; index++) {
    //     const np = nodePlace.currentNode.nodePlaces[index];

    //     this.renderNodePlace(np, viewCompRef.instance.nodePLaces[index]);
    //   }

    //   subscription.unsubscribe();
    // });

    setTimeout(() => {
      for (let index = 0; index < currentNode.nodePlaces.length; index++) {
        const np = currentNode.nodePlaces[index];

        this.renderNodePlace(np, viewCompRef.instance.nodePLaces[index]);
      }

      this.timeoutExeced = true;
      // subscription.unsubscribe();
    }, 0.01);
  }

  renderNodes() {
    this.vf.clear();
    this.nodeTree.currentNode.nodePlaces.forEach(n => this.renderNodePlace(n, this.dynamicNodesRef));
  }
}
