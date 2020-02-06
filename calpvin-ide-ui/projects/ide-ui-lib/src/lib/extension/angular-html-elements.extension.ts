import { Element } from '@angular/compiler';

export function findElement(els: Element[], byClass: string): Element {
  let node: Element = null;

  const _getFunc = (_findClass: string, nodes: Element[]): Element | undefined => {
    if (nodes.length === 0) { return; }

    node = nodes.find(n => n.attrs && n.attrs.find(atr => atr.name === 'class' && atr.value.includes(_findClass)));

    if (node) { return node; }

    nodes.forEach(n => {
      if (n.children && n.children.length !== 0) {
        node = _getFunc(_findClass, n.children.map(x => x as Element));
      }
    });

    return node;
  };

  return _getFunc(byClass, els);
}
