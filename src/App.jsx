import React, { useState, useEffect, useRef } from "react";
import Board from "./components/Board";

const emojiCategories = {
  Animals: ["🐶", "🐱", "🐭", "🐰"],
  Food: ["🍕", "🍔", "🍩", "🍟"],
  Sports: ["⚽️", "🏀", "🏈", "🎾"],
};

const initialBoard = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerOne, setIsPlayerOne] = useState(true);
  const [playerCategories, setPlayerCategories] = useState({
    player1: null,
    player2: null,
  });
  const [playerMoves, setPlayerMoves] = useState({ player1: [], player2: [] });
  const [gameStarted, setGameStarted] = useState(false);
  const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [disappearingCells, setDisappearingCells] = useState([]);

  const winSoundRef = useRef(null);

  useEffect(() => {
    if (winner && winSoundRef.current) {
      winSoundRef.current.play();
    }
  }, [winner]);

  const handleCategorySelect = (player, category) => {
    setPlayerCategories((prev) => ({
      ...prev,
      [player]: emojiCategories[category],
    }));
  };

  const startGame = () => {
    if (playerCategories.player1 && playerCategories.player2) {
      setGameStarted(true);
    }
  };

  const checkWinner = (newBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const emojis = [newBoard[a], newBoard[b], newBoard[c]];
      if (emojis.every(Boolean)) {
        const currentPlayer = isPlayerOne ? "player2" : "player1";
        const category = playerCategories[currentPlayer];
        if (emojis.every((e) => category.includes(e))) {
          setWinner(currentPlayer);
          setWinningCells(combo);
          return true;
        }
      }
    }
    return false;
  };

  const handleCellClick = (index) => {
    if (winner || board[index] || index === lastRemovedIndex) return;

    const currentPlayer = isPlayerOne ? "player1" : "player2";
    const emojiList = playerCategories[currentPlayer];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    let newBoard = [...board];
    let newMoves = { ...playerMoves };
    let newDisappearing = [...disappearingCells];

    if (newMoves[currentPlayer].length === 3) {
      const oldIndex = newMoves[currentPlayer][0];
      newBoard[oldIndex] = null;
      newMoves[currentPlayer] = newMoves[currentPlayer].slice(1);
      setLastRemovedIndex(oldIndex);

      newDisappearing.push(oldIndex);
      setDisappearingCells(newDisappearing);

      setTimeout(() => {
        setDisappearingCells((cells) => cells.filter((i) => i !== oldIndex));
      }, 500);
    } else {
      setLastRemovedIndex(null);
    }

    newBoard[index] = emoji;
    newMoves[currentPlayer].push(index);

    setBoard(newBoard);
    setPlayerMoves(newMoves);

    if (!checkWinner(newBoard)) {
      setIsPlayerOne(!isPlayerOne);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setPlayerMoves({ player1: [], player2: [] });
    setIsPlayerOne(true);
    setWinner(null);
    setLastRemovedIndex(null);
    setWinningCells([]);
    setGameStarted(false);
    setDisappearingCells([]);
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "40px auto",
          padding: 30,
          border: "2px solid #4caf50",
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#2e7d32" }}>
          Select Emoji Categories
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10, color: "#388e3c" }}>Player 1</h3>
          {Object.keys(emojiCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect("player1", cat)}
              style={{
                margin: 6,
                padding: "10px 18px",
                borderRadius: 6,
                border: "1.5px solid #4caf50",
                backgroundColor:
                  playerCategories.player1 === emojiCategories[cat]
                    ? "#4caf50"
                    : "white",
                color:
                  playerCategories.player1 === emojiCategories[cat]
                    ? "white"
                    : "#4caf50",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 16,
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 10, color: "#388e3c" }}>Player 2</h3>
          {Object.keys(emojiCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect("player2", cat)}
              style={{
                margin: 6,
                padding: "10px 18px",
                borderRadius: 6,
                border: "1.5px solid #4caf50",
                backgroundColor:
                  playerCategories.player2 === emojiCategories[cat]
                    ? "#4caf50"
                    : "white",
                color:
                  playerCategories.player2 === emojiCategories[cat]
                    ? "white"
                    : "#4caf50",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 16,
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          disabled={!(playerCategories.player1 && playerCategories.player2)}
          style={{
            padding: "12px 40px",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 8,
            border: "none",
            backgroundColor:
              playerCategories.player1 && playerCategories.player2
                ? "#388e3c"
                : "#a5d6a7",
            color: "white",
            cursor:
              playerCategories.player1 && playerCategories.player2
                ? "pointer"
                : "not-allowed",
            boxShadow: "0 3px 6px rgba(56, 142, 60, 0.5)",
            transition: "background-color 0.3s ease",
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Emoji Tic Tac Toe</h1>
      {!winner && <p>Turn: {isPlayerOne ? "Player 1" : "Player 2"}</p>}
      <Board
        board={board}
        onCellClick={handleCellClick}
        winningCells={winningCells}
        disappearingCells={disappearingCells}
      />
      {winner && (
        <div style={{ marginTop: 20 }}>
          <h2>{winner === "player1" ? "Player 1" : "Player 2"} Wins! 🎉</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <audio
        ref={winSoundRef}
        src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
        preload="auto"
      />
    </div>
  );
}

export default App;
