import React from 'react';

const Board = ({ board, onCellClick, winningCells = [], disappearingCells = [] }) => {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 80px)',
          gridTemplateRows: 'repeat(3, 80px)',
          gap: '10px',
          justifyContent: 'center',
          margin: '20px auto',
        }}
      >
        {board.map((emoji, idx) => {
          const isWinningCell = winningCells.includes(idx);
          const isDisappearing = disappearingCells.includes(idx);

          return (
            <div
              key={idx}
              onClick={() => onCellClick(idx)}
              style={{
                width: 80,
                height: 80,
                fontSize: 40,
                lineHeight: '80px',
                textAlign: 'center',
                cursor: emoji || isWinningCell ? 'default' : 'pointer',
                border: isWinningCell ? '4px solid #4CAF50' : '2px solid #999',
                borderRadius: 10,
                backgroundColor: isWinningCell ? '#d4edda' : '#f9f9f9',
                opacity: isDisappearing ? 0 : 1,
                animation: emoji ? 'fadeIn 0.3s ease forwards' : 'none',
                transition: 'opacity 0.5s ease, border-color 0.3s ease, background-color 0.3s ease',
                userSelect: 'none',
                userDrag: 'none',
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Board;
