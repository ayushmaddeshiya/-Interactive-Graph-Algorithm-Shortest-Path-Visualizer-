// Helper to get 4 adjacent orthogonally connected neighbors
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
}

// BREADTH-FIRST SEARCH (Queue - FIFO)
// Guarantees shortest path on unweighted graphs in O(V + E)
export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
      return visitedNodesInOrder;
    }

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

// DEPTH-FIRST SEARCH (Stack - LIFO)
// Does NOT guarantee the shortest path; explores deep along a single branch
export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode.isWall) continue;
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
        return visitedNodesInOrder;
      }

      const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of unvisitedNeighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}