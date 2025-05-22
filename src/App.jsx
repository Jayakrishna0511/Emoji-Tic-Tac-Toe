import  { useState, useEffect, useRef } from "react";

const emojiCategories = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"],
  food: ["🍎", "🍔", "🍕", "🍩", "🍪", "🍇"],
  faces: ["😀", "😂", "😍", "😎", "😡", "😭"],
  sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐"],
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


const Board = ({ board, onCellClick, winningCells, disappearingCells }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-80 h-80 mx-auto mb-8 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
      {board.map((cell, index) => (
        <div
          key={index}
          onClick={() => onCellClick(index)}
          className={`
            relative flex items-center justify-center text-4xl cursor-pointer 
            rounded-xl transition-all duration-300 transform hover:scale-105
            ${winningCells.includes(index) 
              ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg animate-pulse' 
              : 'bg-white/80 hover:bg-white/90 shadow-md hover:shadow-lg'
            }
            ${disappearingCells.includes(index) ? 'animate-bounce' : ''}
            border-2 border-white/30 backdrop-blur-sm
          `}
        >
          <span className={`
            transition-all duration-300 
            ${cell ? 'animate-in zoom-in-50 duration-500' : ''}
            ${disappearingCells.includes(index) ? 'animate-out fade-out duration-500' : ''}
          `}>
            {cell}
          </span>
          {!cell && !winningCells.length && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>
      ))}
    </div>
  );
};

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
    const otherPlayer = player === "player1" ? "player2" : "player1";
    if (playerCategories[otherPlayer] === emojiCategories[category]) {
      alert("This category is already selected by the other player!");
      return;
    }

    setPlayerCategories((prev) => ({
      ...prev,
      [player]: emojiCategories[category],
    }));
  };

  const startGame = () => {
    if (
      playerCategories.player1 &&
      playerCategories.player2 &&
      playerCategories.player1 !== playerCategories.player2
    ) {
      setGameStarted(true);
    } else {
      alert("Both players must select different emoji categories.");
    }
  };

  const checkWinner = (newBoard, currentPlayer) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const emojis = [newBoard[a], newBoard[b], newBoard[c]];
      if (emojis.every(Boolean)) {
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

    const didWin = checkWinner(newBoard, currentPlayer);
    if (!didWin) {
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
    setDisappearingCells([]);
  };

  const exitToStart = () => {
    resetGame();
    setPlayerCategories({ player1: null, player2: null });
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
              🎮 Emoji Tic Tac Toe
            </h1>
            <p className="text-xl text-white/90 font-medium">
              Select an emoji category for each player
            </p>
          </div>

          <div className="flex justify-center gap-8 flex-wrap mb-8">
            {["player1", "player2"].map((player, idx) => {
              const otherPlayer = player === "player1" ? "player2" : "player1";
              return (
                <div
                  key={player}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-6 w-80 shadow-2xl border border-white/30 transform hover:scale-105 transition-all duration-300"
                >
                  <h3 className={`text-2xl font-bold mb-4 text-center ${
                    idx === 0 ? 'text-blue-300' : 'text-pink-300'
                  }`}>
                    Player {idx + 1}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.keys(emojiCategories).map((category) => {
                      const isTaken = playerCategories[otherPlayer] === emojiCategories[category];
                      const isSelected = playerCategories[player] === emojiCategories[category];
                      
                      return (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(player, category)}
                          disabled={isTaken}
                          className={`
                            p-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                            ${isSelected 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                              : isTaken
                              ? 'bg-gray-400/50 text-gray-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 shadow-md hover:shadow-lg'
                            }
                            border border-white/20 backdrop-blur-sm
                          `}
                          title={isTaken ? "Already selected by the other player" : "Click to select"}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="text-center p-4 bg-white/10 rounded-xl border border-white/20 min-h-16 flex items-center justify-center">
                    <div className="text-3xl">
                      {playerCategories[player]?.join(" ") || "Choose category"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={startGame}
              className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 text-white rounded-2xl shadow-2xl hover:from-emerald-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 border border-white/30"
            >
               Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Emoji Tic Tac Toe
          </h1>
          
          {!winner && (
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isPlayerOne 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white/20 text-white/70'
              }`}>
                Player 1
              </div>
              <div className="text-white text-2xl animate-bounce">⚔️</div>
              <div className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${
                !isPlayerOne 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white/20 text-white/70'
              }`}>
                Player 2
              </div>
            </div>
          )}
        </div>

        <Board
          board={board}
          onCellClick={handleCellClick}
          winningCells={winningCells}
          disappearingCells={disappearingCells}
        />

        {winner && (
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2 animate-bounce">
              🎉 {winner === "player1" ? "Player 1" : "Player 2"} Wins! 🎉
            </h2>
            <div className="text-6xl animate-pulse">🏆</div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl shadow-lg hover:from-blue-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 border border-white/30"
          >
             Play Again
          </button>
          <button
            onClick={exitToStart}
            className="px-6 py-3 font-bold bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow-lg hover:from-red-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 border border-white/30"
          >
             Exit to Start
          </button>
        </div>
      <audio
        ref={winSoundRef}
        src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
        preload="auto"
      />
      </div>
    </div>
  );
}

export default App;













