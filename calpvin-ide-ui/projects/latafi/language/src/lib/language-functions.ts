import { Node } from './nodes/node';

export function setNodeStyle(node: Node): {} {
  if (node.independent) {
    return {
      margin: '20px'
    };
  } else {
    return {};
  }
}
