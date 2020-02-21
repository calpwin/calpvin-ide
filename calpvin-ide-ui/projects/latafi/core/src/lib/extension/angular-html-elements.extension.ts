import { Element } from '@angular/compiler';

export function findElement(els: Element[], byClass: string): { findNode: Element, parentNode: Element | undefined } | undefined {
  let findNode: Element = undefined;
  let parentNode: Element = undefined;

  const _getFunc = (_findClass: string, nodes: Element[]): { findNode: Element, parentNode: Element | undefined } | undefined => {
    if (nodes.length === 0) { return; }

    nodes.forEach(n => {
      if (n.attrs && n.attrs.find(atr => atr.name === 'class' && atr.value.includes(_findClass))) {
        findNode = n;
        return;
      }
    });

    if (findNode) { return { findNode, parentNode } }

    nodes.forEach(n => {
      if (n.children && n.children.length !== 0) {
        parentNode = n;
        const findResult = _getFunc(_findClass, n.children.map(x => x as Element));

        if (findResult) {
          findNode = findResult.findNode;
          return;
        }
      }
    });

    return { findNode, parentNode };
  };

  return _getFunc(byClass, els);
}
