let boardSize = 8;
let queens = [];
let undoStack = [];
let redoStack = [];
let allSolutions = [];
let boardEl = null;

function createBoard(size) {
  boardSize = size;
  const container = document.getElementById('boardContainer');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'board';
  for (let r = 0; r < size; r++) {
    const row = document.createElement('tr');
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('td');
      cell.className = (r + c) % 2 === 0 ? 'light' : 'dark';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', onCellClick);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.appendChild(table);
  boardEl = table;
  queens = [];
  undoStack = [];
  redoStack = [];
  renderBoard();
}

function isSafe(row, col) {
  for (const [r, c] of queens) {
    if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
      return false;
    }
  }
  return true;
}

function onCellClick(e) {
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  if (!isSafe(r, c)) {
    alert('Invalid Move! Cannot place queen here.');
    return;
  }
  queens.push([r, c]);
  undoStack.push([r, c]);
  redoStack = [];
  renderBoard();
  if (queens.length === boardSize) {
    alert(`All ${boardSize} queens placed successfully!`);
  }
}

function renderBoard() {
  if (!boardEl) return;
  for (const cell of boardEl.getElementsByTagName('td')) {
    cell.textContent = '';
    cell.classList.remove('highlight');
  }
  for (const [r, c] of queens) {
    const cell = boardEl.rows[r].cells[c];
    cell.textContent = '♛';
  }
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (isSafe(r, c) && !queens.some(([qr, qc]) => qr === r && qc === c)) {
        boardEl.rows[r].cells[c].classList.add('highlight');
      }
    }
  }
}

function undo() {
  if (queens.length > 0) {
    const last = queens.pop();
    redoStack.push(last);
    renderBoard();
  }
}

function redo() {
  if (redoStack.length > 0) {
    const move = redoStack.pop();
    if (isSafe(move[0], move[1])) {
      queens.push(move);
      renderBoard();
    } else {
      alert('Redo Failed: unsafe position!');
    }
  }
}

function resetBoard() {
  queens = [];
  undoStack = [];
  redoStack = [];
  renderBoard();
}

function findAllSolutions() {
  allSolutions = [];
  queens = [];
  function backtrack(row=0) {
    if (row === boardSize) {
      allSolutions.push([...queens]);
      return;
    }
    for (let col = 0; col < boardSize; col++) {
      if (isSafe(row, col)) {
        queens.push([row, col]);
        backtrack(row+1);
        queens.pop();
      }
    }
  }
  backtrack();
  showSolutions();
  alert(`Found ${allSolutions.length} possible solutions for ${boardSize}-Queens!`);
}

function showSolutions() {
  const list = document.getElementById('solutionList');
  list.innerHTML = '';
  allSolutions.forEach((sol, idx) => {
    const div = document.createElement('div');
    div.style.margin = '4px';
    div.style.padding = '6px';
    div.style.background = 'rgba(255,255,255,0.3)';
    div.style.borderRadius = '8px';
    div.style.cursor = 'pointer';
    div.textContent = `Solution ${idx + 1}`;
    div.onclick = () => {
      queens = [...sol];
      renderBoard();
    };
    list.appendChild(div);
  });
}

document.getElementById('boardSize').addEventListener('change', e => {
  createBoard(parseInt(e.target.value));
});

document.getElementById('undoBtn').onclick = undo;
document.getElementById('redoBtn').onclick = redo;
document.getElementById('resetBtn').onclick = resetBoard;
document.getElementById('solveBtn').onclick = findAllSolutions;

// Auto create board after DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  createBoard(boardSize);
});
