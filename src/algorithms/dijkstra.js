export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    if (closestNode.isWall) continue;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode.row === finishNode.row && closestNode.col === finishNode.col) {
      return visitedNodesInOrder;
    }

    const { row, col } = closestNode;
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const newDistance = closestNode.distance + 1;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = closestNode;
        }
      }
    }
  }
  return visitedNodesInOrder;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) nodes.push(node);
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}