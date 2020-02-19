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

export function setCssValue(node: Rule, property: string, value: string) {
  let result = false;

  csstree.walk(node, {
    visit: 'Declaration',
    enter: (_blockNode) => {
      if (_blockNode.property === property) {
        _blockNode.value = { type: 'Raw', value };
        result = true;
      }
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

export function removeCssProperty(node: Rule, property: string) {
  csstree.walk(node, {
    visit: 'Declaration',
    enter: (_blockNode, _item, _list) => {
      if (_blockNode.property === property)
        _list.remove(_item);
    }
  });
}
