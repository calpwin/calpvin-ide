import { Node } from './node';

export class NodePlace {
  constructor(readonly availableNodeTypes: string[]) {
  }

  currentNode: Node;
}
