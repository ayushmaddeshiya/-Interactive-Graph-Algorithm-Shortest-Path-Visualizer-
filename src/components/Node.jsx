import React from 'react';
import '../styles/Node.css';

export default function Node({ row, col, isStart, isFinish, isWall, onMouseDown, onMouseEnter, onMouseUp }) {
  const extraClass = isFinish 
    ? 'node-finish' 
    : isStart 
    ? 'node-start' 
    : isWall 
    ? 'node-wall' 
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClass}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    />
  );
}