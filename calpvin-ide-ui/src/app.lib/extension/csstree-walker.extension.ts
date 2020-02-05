import * as csstree from 'css-tree';
import { CssNode, Rule } from 'css-tree';

export function tryGetNode(cssNode: CssNode, byClassSelector: string): CssNode | undefined {
  let findNode;

  csstree.walk(cssNode, node => {
    if (node.type === 'Rule' && (node as Rule).prelude.type === 'SelectorList') {
      csstree.walk(node, (_node) => {
        if (_node.type === 'ClassSelector' && _node.name === byClassSelector) {
          findNode = node;
        }
      });
    }
  });

  return findNode;
}

export function trySetCssValue(node: Rule, declaration: string, value: string): boolean {
  let result = false;

  csstree.walk(node, (_blockNode) => {
    if (_blockNode.type === 'Declaration' && _blockNode.property === 'height') {
      _blockNode.value = { type: 'Raw', value };
      result = true;
    }
  });

  return result;
}
