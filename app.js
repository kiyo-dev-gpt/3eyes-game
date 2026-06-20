// ==========================================
// 1. 状態管理（State）の定義
// ==========================================
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '○';
let isGameActive = true;

// 勝利条件のパターン（インデックスの組み合わせ）
const winningConditions = [
  [0, 1, 2], // 上の横一列
  [3, 4, 5], // 中の横一列
  [6, 7, 8], // 下の横一列
  [0, 3, 6], // 左の縦一列
  [1, 4, 7], // 中の縦一列
  [2, 5, 8], // 右の縦一列
  [0, 4, 8], // 斜め（左上から右下）
  [2, 4, 6]  // 斜め（右上から左下）
];

// ==========================================
// 2. DOM要素の取得
// ==========================================
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn'); // リセットボタンを取得

// ==========================================
// 3. 処理（関数）の実装
// ==========================================

// マスがクリックされたときの処理
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index') || '-1');

  if (boardState[clickedCellIndex] !== '' || !isGameActive) {
    return;
  }

  updateCell(clickedCell, clickedCellIndex);
  
  // 💡 変更点：交代する前に、勝敗が決まったかチェックする
  handleResultValidation();
}

// マスの状態を更新する
function updateCell(cell, index) {
  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

// 勝敗または引き分けの判定
function handleResultValidation() {
  let roundWon = false;

  // 8つの勝利パターンを順番にチェック
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = boardState[winCondition[0]];
    let b = boardState[winCondition[1]];
    let c = boardState[winCondition[2]];

    // 3つのマスのうち、1つでも空文字があればそのパターンは未達成
    if (a === '' || b === '' || c === '') {
      continue;
    }
    
    // 3つのマスがすべて同じマークなら勝利！
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  // 勝者が決まった場合
  if (roundWon) {
    statusDisplay.textContent = `プレイヤー ${currentPlayer} の勝利です！ 🎉`;
    isGameActive = false; // ゲーム終了（クリックできなくする）
    return;
  }

  // 引き分けの判定（盤面に空文字文字がもう無い場合）
  let roundDraw = !boardState.includes('');
  if (roundDraw) {
    statusDisplay.textContent = '引き分けです！ 🤝';
    isGameActive = false;
    return;
  }

  // どちらでもなければプレイヤーを交代
  changePlayer();
}

// プレイヤーを交代する
function changePlayer() {
  currentPlayer = currentPlayer === '○' ? '×' : '○';
  statusDisplay.textContent = `${currentPlayer}の番です`;
}

// ゲームを初期状態にリセットする
function handleResetGame() {
  // 1. 状態（データ）を初期化
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = '○';
  isGameActive = true;
  
  // 2. 画面（見た目）を初期化
  statusDisplay.textContent = `${currentPlayer}の番です`;
  cells.forEach(cell => cell.textContent = '');
}

// ==========================================
// 4. イベントリスナーの登録
// ==========================================
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

// リセットボタンにクリックイベントを設定
resetBtn.addEventListener('click', handleResetGame);