'use strict'

const FLAG = '🚩'
const MINE = '💣'
const EMPTY = ' '
const MARKED = '#'
// const ONENEG = '1️⃣'
// const TWONEG = '2️⃣'
// const THERENEG = '3️⃣'

// const PLAYGAME = '<img src="img/smilyhappy.png>'

var gBoard
// var gBoomAmount = 2
// var gScoure
var gLives

var gLevel = {
    size: 4,
    mine: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isClicked: false,
    lives: 3
}

function onInit() {
    gGame.isOn = true
    gGame.isClicked = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.size; i++) {
        var row = []
        for (var j = 0; j < gLevel.size; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        }
        board.push(row)
    }
    // board[1][1].isMine = true
    // board[2][2].isMine = true
    // console.table(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>"
        for (var j = 0; j < board[0].length; j++) {
            var mine = board[i][j].isMine && board[i][j].isShown || board[i][j].isMine && !gGame.isOn ? MINE : EMPTY

            var mineShows = board[i][j].isShown && !gBoard[i][j].isMine ? board[i][j].minesAroundCount : EMPTY

            var mark = board[i][j].isMarked ? MARKED : EMPTY
            strHTML += `<td onclick="onclicked(this, ${i}, ${j})" 
            oncontextmenu="onCellMarked(this, ${i}, ${j});return false;">${mine}${mineShows}${mark}</td>`
        }
        strHTML += "</tr>"
    }
    var gameBoard = document.querySelector('tbody')
    gameBoard.innerHTML = strHTML
    checkGameOver()
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    var minesAroundCount = 0
    for (var i = board.i - 1; i <= board.i + 1; i++) {
        if (i < 0 || i >= board.length) minesAroundCount++;
        for (var j = board.j - 1; j <= board.j + 1; j++) {
            if (j < 0 || j >= board[i].length) minesAroundCount++;
            if (i === board.i && j === board.j) minesAroundCount++;
            var currCell = board[i][j]
            if (currCell.CELL === isMine) minesAroundCount++;
        }
    }
    // var elNgsCount = document.querySelector('.mines-count span')
    // elNgsCount.innerText = minesAroundCount
}

function onCellClicked(elCell, i, j) {

    if (!gGame.isON) return
    if (!gGame.isClicked) {
        placeMines(gBoard, i, j)
        gGame.isClicked = true
    }
    if (gBoard[i][j].isMarked) return
    // console.log('No boom here' + gBoard[i][j].minesAroundCount + 'mines around.')
    if (gBoard[i][j].isMine) gLives--
    // console.log('Boom! You have ' + --lives + 'lives left.') 
    if (gBoard[i][j].isMine) gLives === 0 
        gGame.isOn = false
    
    // console.log('Game Over!') 
    var negCount = countNegs(gBoard, i, j)
    if (negCount !== 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        renderBoard(gBoard)
    } else {
        expandShown(gBoard, elCell, i, j)
    }
}
 
// Called when a cell is right clicked See how you can hide the context menu on right click
function onCellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return


}

// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver(){
    if (gGame.markedCount === gLevel.mines 
        && gGame.shownCount === (gBoard.length ** 2 - gLevel.mines)) {
            console.log('you win')
    } else {
        return
    }
}

// When user clicks a cell with no 
// mines around, we need to open not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
// function expandShown(board, elCell, i, j) {

// }

function setLevel(elBtn) {
        if (elBtn.innerText === 'You New It') {
            gLevel.size = 4
            gLevel.mines = 2
            onInit()
        }
        if (elBtn.innerText === 'You Know It') {
            gLevel.size = 10
            gLevel.mines = 20
            onInit()
        }
        if (elBtn.innerText === 'You Own It') {
            gLevel.size = 15
            gLevel.mines = 30
            onInit()
        }
}

function placeMines(board, rowIdx, colIdx) {
        var mineCount = 0
        var randI = 0
        var randJ = 0

        while (mineCount < gLevel.mines) {
            randI = getRandomIntInclusive(0, board.length - 1)
            randJ = getRandomIntInclusive(0, board[0].length - 1)
            if (randI === rowIdx && randJ === colIdx) continue
            if (board[randI][randJ].isMine) mineCount--
            board[randI][randJ].isMine = true
            mineCount++
        }
        setMinesNegsCount(board)
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandNum(arr) {
    var randNum = getRandomIntInclusive(0, arr.length - 1)
    var numArr = arr.splice(randNum, 1)
    return numArr[0]
}