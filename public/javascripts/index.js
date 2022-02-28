const ROW = 10
const COL = ROW
const BOMBS = (10 / 100) * (ROW * COL)
const BOMB = "BOMB"
const UNKNOWN = "UNKNOWN"
let gameOver = false

const gridOBJ = document.querySelector(".grid");
let grid = new Array(ROW);


initGrid()
console.log(grid)
initCSS()

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getBombsLocation() {
    let res = []
    let bombRemaining = BOMBS
    while(bombRemaining > 0) {
        let row, col
        do {
            row = getRandomInt(ROW)
            col = getRandomInt(COL)
        } while(isABomb(row, col, res))
        res.push({row: row, col: col})
        bombRemaining--
    }
    return res
}

function isABomb(row, col, bombs) {
    for (let i = 0; i < bombs.length; i++) {
        if(bombs[i].row === row && bombs[i].col === col)
            return true
    }
    return false
}

function setBombs(bombs) {
    for (let row = 0; row < ROW; row++) {
        grid[row] = new Array(COL)
        for (let col = 0; col < COL; col++) {
            if (isABomb(row, col, bombs))
                grid[row][col] = BOMB
            else
                grid[row][col] = UNKNOWN
        }
    }
}

function getDistance(row, col, rowBomb, colBomb) {
    const dx = Math.abs(rowBomb - row);
    const dy = Math.abs(colBomb - col);

    const min = Math.min(dx, dy);
    const max = Math.max(dx, dy);

    const diagonalSteps = min;
    const straightSteps = max - min;

    return Math.round(Math.sqrt(2) * diagonalSteps + straightSteps)
}

function getDistanceFromClosestBomb(row, col, bombs) {
    let closest = Number.MAX_SAFE_INTEGER
    for (const bomb of bombs) {
        let distance = getDistance(row, col, bomb.row, bomb.col)
        if(distance < closest)
            closest = distance
    }
    return closest
}

function setNumbers(bombs) {
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < COL; col++) {
            if(grid[row][col] !== BOMB) {
                grid[row][col] = getDistanceFromClosestBomb(row, col, bombs)
            }
        }
    }
}

function initGrid() {
    const bombs = getBombsLocation()
    setBombs(bombs)
    setNumbers(bombs)
}

function initCSS() {
    clearGrid()
    for (let row = 0; row < ROW; row++) {
        let DIVRow = document.createElement("div")
        DIVRow.className = "row" + row
        DIVRow.style.display = "flex";
        for (let col = 0; col < COL; col++) {
            let DIVCell = document.createElement("div")
            // DIVCell.textContent = grid[row][col] === BOMB ? "💣" : grid[row][col]
            DIVCell.className = "cell"
            DIVCell.addEventListener("click", revealCell)
            DIVCell.param = {row: row, col: col}
            DIVRow.appendChild(DIVCell)
        }
        gridOBJ.appendChild(DIVRow)
    }
}


function clearGrid() {
    while (gridOBJ.firstChild) {
        gridOBJ.removeChild(gridOBJ.firstChild);
    }
}

function revealCell(evt) {
    const row = evt.currentTarget.param.row
    const col = evt.currentTarget.param.col
    if(grid[row][col] === BOMB) {
        evt.currentTarget.textContent = "💣"
    } else {
        evt.currentTarget.textContent = grid[row][col]
    }
}