const ROW = 10
const COL = ROW
const BOMBS = (10 / 100) * (ROW * COL)
const BOMB = "BOMB"
let gameOver = false

const gridOBJ = document.querySelector(".grid");
let grid = new Array(ROW);


initGrid()
console.log(grid)
drawCSS()

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
                grid[row][col] = {val: BOMB, revealed: false}
            else
                grid[row][col] = {val: 0, revealed: false}
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

function getDistanceFromBomb(row, col, bomb) {
    return getDistance(row, col, bomb.row, bomb.col)
}

function setNumbers(bombs) {
    let distance;
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < COL; col++) {
            if(!isBomb(row,col)) {
                for (let bomb of bombs) {
                    distance = getDistanceFromBomb(row, col, bomb)
                    if(distance === 1) {
                        grid[row][col].val += 1
                    }
                }
            }
        }
    }
}

function initGrid() {
    const bombs = getBombsLocation()
    setBombs(bombs)
    setNumbers(bombs)
}

function isRevealed(row, col) {
    return grid[row][col].revealed
}

function drawCSS() {
    clearGrid()
    for (let row = 0; row < ROW; row++) {
        let DIVRow = document.createElement("div")
        DIVRow.className = "row" + row
        DIVRow.style.display = "flex";
        for (let col = 0; col < COL; col++) {
            let DIVCell = document.createElement("div")
            if(isRevealed(row, col)) {
                DIVCell.textContent = grid[row][col].val === BOMB ? "💣" : (grid[row][col].val === 0 ? "" : grid[row][col].val)
                DIVCell.classList.add("revealed")
            }
            DIVCell.classList.add("cell")
            DIVCell.addEventListener("click", clickEVT)
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

function getNeighbours(row, col) {
    let res = []
    if(row !== 0)
        res.push({row:row - 1, col: col})
    if(row !== ROW - 1)
        res.push({row:row + 1, col: col})
    if(col !== 0)
        res.push({row:row, col: col - 1})
    if(col !== COL - 1)
        res.push({row:row, col: col + 1})
    return res
}

function isBomb(row, col) {
    return grid[row][col].val === BOMB
}

function revealCell(row, col) {
    grid[row][col].revealed = true
    if(isBomb(row, col)) {
        alert("perdu connard")
    } else if(grid[row][col].val === 0) {
        const neighbours = getNeighbours(row, col)
        for (let neighbour of neighbours) {
            if (!isBomb(neighbour.row, neighbour.col) && !isRevealed(neighbour.row, neighbour.col))
                revealCell(neighbour.row, neighbour.col)
        }
    }
    drawCSS()
}

function clickEVT(evt) {
    const row = evt.currentTarget.param.row
    const col = evt.currentTarget.param.col
    revealCell(row, col)
}
