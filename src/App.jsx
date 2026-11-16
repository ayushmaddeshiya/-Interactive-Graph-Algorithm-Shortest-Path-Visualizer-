import React, { useState, useEffect, useRef } from 'react';
import Node from './components/Node';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { bfs, dfs } from './algorithms/traversals';

const START_ROW = 8, START_COL = 6;
const FINISH_ROW = 8, FINISH_COL = 32;
const ROWS = 18, COLS = 40;

const ALGO_METRICS = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    time: "O((V + E) log V)",
    space: "O(V)",
    paradigm: "Greedy",
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    time: "O(V + E)",
    space: "O(V)",
    paradigm: "Queue Traversal",
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    time: "O(V + E)",
    space: "O(V)",
    paradigm: "Stack / Recursive",
  },
};

export default function App() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra');
  const [speed, setSpeed] = useState(15);
  const [statusMessage, setStatusMessage] = useState(null);

  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  const timeoutsRef = useRef([]);

  useEffect(() => {
    resetGrid();
    return () => clearAllTimeouts();
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const resetStats = () => {
    setVisitedCount(0);
    setPathLength(0);
    setStatusMessage(null);
  };

  const resetGrid = () => {
    clearAllTimeouts();
    setIsVisualizing(false);
    resetStats();

    const initialGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const currentRow = [];
      for (let c = 0; c < COLS; c++) {
        currentRow.push({
          row: r,
          col: c,
          isStart: r === START_ROW && c === START_COL,
          isFinish: r === FINISH_ROW && c === FINISH_COL,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });

        const element = document.getElementById(`node-${r}-${c}`);
        if (element) {
          element.className = 'node';
          if (r === START_ROW && c === START_COL) element.className = 'node node-start';
          if (r === FINISH_ROW && c === FINISH_COL) element.className = 'node node-finish';
        }
      }
      initialGrid.push(currentRow);
    }
    setGrid(initialGrid);
  };

  const clearPathOnly = () => {
    clearAllTimeouts();
    setIsVisualizing(false);
    resetStats();

    const newGrid = grid.map((row) =>
      row.map((node) => {
        const resetNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        };
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isWall) {
          element.className = 'node';
          if (node.isStart) element.className = 'node node-start';
          if (node.isFinish) element.className = 'node node-finish';
        }
        return resetNode;
      })
    );
    setGrid(newGrid);
  };

  const toggleWall = (row, col) => {
    if ((row === START_ROW && col === START_COL) || (row === FINISH_ROW && col === FINISH_COL)) return;
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    newGrid[row][col] = { ...node, isWall: !node.isWall };
    setGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    toggleWall(row, col);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    if ((row === START_ROW && col === START_COL) || (row === FINISH_ROW && col === FINISH_COL)) return;
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (!node.isWall) {
      newGrid[row][col] = { ...node, isWall: true };
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const runVisualization = () => {
    if (isVisualizing) return;
    clearPathOnly();
    setIsVisualizing(true);
    resetStats();

    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];

    let visitedNodesInOrder = [];
    if (selectedAlgo === 'dijkstra') {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    } else if (selectedAlgo === 'bfs') {
      visitedNodesInOrder = bfs(grid, startNode, finishNode);
    } else if (selectedAlgo === 'dfs') {
      visitedNodesInOrder = dfs(grid, startNode, finishNode);
    }

    const targetFound = visitedNodesInOrder.some(
      (node) => node.row === finishNode.row && node.col === finishNode.col
    );

    const nodesInShortestPathOrder = targetFound ? getNodesInShortestPathOrder(finishNode) : [];

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        const timeout = setTimeout(() => {
          if (targetFound) {
            animateShortestPath(nodesInShortestPathOrder);
          } else {
            setIsVisualizing(false);
            setStatusMessage('No Path Found: Target is unreachable or blocked by walls.');
          }
        }, speed * i);
        timeoutsRef.current.push(timeout);
        return;
      }

      const timeout = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setVisitedCount(i + 1);
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, speed * i);
      timeoutsRef.current.push(timeout);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    const pathSpeed = Math.max(speed * 1.5, 20);

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const timeout = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        setPathLength(i + 1);
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsVisualizing(false);
          setStatusMessage('Path Found successfully!');
        }
      }, pathSpeed * i);
      timeoutsRef.current.push(timeout);
    }
  };

  const currentMetrics = ALGO_METRICS[selectedAlgo];

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px',
        fontFamily: 'sans-serif',
        userSelect: 'none',
      }}
      onMouseUp={handleMouseUp}
    >
      <h1 style={{ color: '#0f172a', marginBottom: '6px' }}>Graph Algorithm Visualizer</h1>

      {statusMessage && (
        <div
          style={{
            margin: '0 auto 14px',
            padding: '8px 16px',
            maxWidth: '550px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '13px',
            backgroundColor: statusMessage.includes('No Path') ? '#fee2e2' : '#dcfce7',
            color: statusMessage.includes('No Path') ? '#991b1b' : '#166534',
            border: `1px solid ${statusMessage.includes('No Path') ? '#fca5a5' : '#86efac'}`,
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <select
          disabled={isVisualizing}
          value={selectedAlgo}
          onChange={(e) => {
            setSelectedAlgo(e.target.value);
            resetStats();
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #94a3b8',
            backgroundColor: '#fff',
            fontWeight: '600',
            cursor: isVisualizing ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Speed:</span>
          <select
            disabled={isVisualizing}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              cursor: isVisualizing ? 'not-allowed' : 'pointer',
            }}
          >
            <option value={8}>Fast</option>
            <option value={20}>Medium</option>
            <option value={50}>Slow</option>
          </select>
        </div>

        <button
          disabled={isVisualizing}
          onClick={runVisualization}
          style={{
            padding: '8px 18px',
            background: isVisualizing ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: isVisualizing ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {isVisualizing ? 'Running...' : `Visualize ${selectedAlgo.toUpperCase()}`}
        </button>

        <button
          disabled={isVisualizing}
          onClick={clearPathOnly}
          style={{
            padding: '8px 14px',
            background: '#f1f5f9',
            color: '#334155',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            cursor: isVisualizing ? 'not-allowed' : 'pointer',
            fontWeight: '500',
          }}
        >
          Clear Path Only
        </button>

        <button
          onClick={resetGrid}
          style={{
            padding: '8px 14px',
            background: '#e2e8f0',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Reset All
        </button>
      </div>

      {/* STATISTICS HUD BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          margin: '0 auto 12px',
          padding: '10px 24px',
          maxWidth: '820px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Visited Nodes</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#0284c7' }}>{visitedCount}</span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Path Length</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#16a34a' }}>{pathLength}</span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Time Complexity</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>{currentMetrics.time}</span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Space Complexity</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#8b5cf6' }}>{currentMetrics.space}</span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Paradigm</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>{currentMetrics.paradigm}</span>
        </div>
      </div>

      {/* COLOR LEGEND PANEL */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          margin: '0 auto 16px',
          padding: '8px 20px',
          maxWidth: '820px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '13px',
          fontWeight: '600',
          color: '#334155',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', backgroundColor: '#facc15', borderRadius: '3px', border: '1px solid #ca8a04', display: 'inline-block' }} />
          <span>Start Node</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', backgroundColor: '#ef4444', borderRadius: '3px', display: 'inline-block' }} />
          <span>Target Node</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', backgroundColor: '#1e293b', borderRadius: '3px', display: 'inline-block' }} />
          <span>Wall / Obstacle</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', backgroundColor: '#93c5fd', borderRadius: '3px', display: 'inline-block' }} />
          <span>Visited Node</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', backgroundColor: '#22c55e', borderRadius: '3px', display: 'inline-block' }} />
          <span>Shortest Path</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div
        style={{
          display: 'inline-block',
          border: '2px solid #94a3b8',
          lineHeight: '0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          userSelect: 'none',
          backgroundColor: '#ffffff',
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} style={{ whiteSpace: 'nowrap' }}>
            {row.map((node, nodeIdx) => (
              <Node
                key={nodeIdx}
                {...node}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}