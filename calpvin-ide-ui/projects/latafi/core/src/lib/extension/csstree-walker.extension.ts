import * as csstree from 'css-tree';
import { CssNode, Rule, StyleSheet } from 'css-tree';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

export function tryGetNode(cssNode: CssNode, byClassSelector: string, forceCreate = true): CssNode | undefined {
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

  if (!findNode && forceCreate) {

    const preludeList = new csstree.List();
    preludeList.append(preludeList.createItem({
      type: 'ClassSelector',
      name: byClassSelector
    } as csstree.ClassSelector));

    const newRule = {
      type: 'Rule',
      loc: {
        start: {
          column: 0,
          line: cssNode.loc.end.line + 2,
          offset: cssNode.loc.end.offset + 2
        },
        end: {
          column: byClassSelector.length + 2,
          line: cssNode.loc.end.line + 2,
          offset: cssNode.loc.end.offset + 2 + byClassSelector.length + 2
        }
      },
      prelude: {
        type: "SelectorList",
        children: preludeList
      },
      block: {
        type: 'Block',
        loc: {
          start: {
            column: byClassSelector.length + 2,
            line: cssNode.loc.end.line + 2,
            offset: cssNode.loc.end.offset + 2 + byClassSelector.length + 2
          },
          end: {
            column: byClassSelector.length + 2,
            line: cssNode.loc.end.line + 2,
            offset: cssNode.loc.end.offset + 2 + byClassSelector.length + 2
          }
        },
        children: new csstree.List()
      }
    } as csstree.Rule;

    (cssNode as StyleSheet).children.appendData(newRule);
    findNode = newRule;
  }

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
