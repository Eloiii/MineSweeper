const ROW = 10
const COL = ROW
const BOMBS = (10 / 100) * (ROW * COL)

const gridOBJ = document.querySelector(".grid");
let grid = new Array(ROW);


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getBombsLocation() {
    let res = []
    let bombRemaining = BOMBS
    while(bombRemaining > 0) {
        console.log(bombRemaining)
        const row = getRandomInt(ROW)
        const col = getRandomInt(COL)
        console.log({row: row, col: col})
        res.push({row: row, col: col})
        bombRemaining--
    }
    return res
}

function isABombLocation(row, col, bombs) {
    for (let i = 0; i < BOMBS; i++) {
        if(bombs[i].row === row && bombs[i].col === col)
            return true
    }
    return false
}

function initGrid() {
    const bombs = getBombsLocation()
    for (let row = 0; row < ROW; row++) {
        grid[row] = new Array(COL)
        for (let col = 0; col < COL; col++) {
            if (isABombLocation(row,col,bombs))
                grid[row][col] = "BOMB"
            else
                grid[row][col] = "UNKNOWN"
        }
    }
}

initGrid()
console.log(grid)
initCSS()

function initCSS() {
    clearGrid()
    for (let row = 0; row < ROW; row++) {
        let DIVRow = document.createElement("div")
        DIVRow.className = "row" + row
        DIVRow.style.display = "flex";
        for (let col = 0; col < COL; col++) {
            let DIVCell = document.createElement("div")
            // DIVCell.textContent = "💣"
            DIVCell.className = "cell"
            DIVCell.addEventListener("click", cellClick)
            DIVCell.param = {row: row, col: col}
            DIVRow.appendChild(DIVCell)
        }
        gridOBJ.appendChild(DIVRow)
    }
}

function cellClick(evt) {
    console.log(evt.currentTarget.param)
}

function clearGrid() {
    while (gridOBJ.firstChild) {
        gridOBJ.removeChild(gridOBJ.firstChild);
    }
}