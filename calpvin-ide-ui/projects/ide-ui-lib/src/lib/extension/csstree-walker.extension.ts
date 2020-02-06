import * as csstree from 'css-tree';
import { CssNode, Rule, List } from 'css-tree';

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

export function setCssValue(node: Rule, property: string, value: string) {
  let result = false;

  csstree.walk(node, (_blockNode) => {
    if (_blockNode.type === 'Declaration' && _blockNode.property === property) {
      _blockNode.value = { type: 'Raw', value };
      result = true;
    }
  });

  if (!result) {
    node.block.children.appendData({
      type: 'Declaration',
      property,
      value: { type: 'Raw', value },
      important: false,
      loc: null
    } as csstree.Declaration);
  }
}
