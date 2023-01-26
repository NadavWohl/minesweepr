'use strict'

const MINE = '💣'
const EMPTY = ' '
const MARKED = '🚩'

// const PLAYGAME = '<img src="img/smilyhappy.png>'
var gBoard
// var gScoure

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isClicked: false,
    lives: 3
}

var elLives = document.querySelector('.lives')
var elsmilyhappyBtn = document.querySelector('.smilyhappy-btn')

function onInit() {
    gGame.isOn = true
    gGame.isClicked = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.lives = 3
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    elsmilyhappyBtn = '😃'
    elLives.innerText = gGame.lives
    placeMines(gBoard)
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
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>"
        for (var j = 0; j < board[0].length; j++) {
        var mine = board[i][j].isMine && board[i][j].isShown || board[i][j].isMine && !gGame.isOn ? MINE : EMPTY
        var negMinecountShows = board[i][j].isShown && !gBoard[i][j].isMine ? board[i][j].minesAroundCount : EMPTY
        var mark = board[i][j].isMarked ? MARKED : EMPTY
        strHTML += `<td onClick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j});return false;">${mine}${negMinecountShows}${mark}</td>`
      }
      strHTML += "</tr>"
    }
    var gameBoard = document.querySelector('tbody')
    gameBoard.innerHTML = strHTML
    checkGameOver()
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    var cellNegCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            cellNegCount = countNegs(board, i, j)
            board[i][j].minesAroundCount = cellNegCount
        }
    }
}

//sets each cells mine count by checking around it
function countNegs(board, rowIdx, colIdx) {
    var negCount = 0
    for(var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for(var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (j === colIdx && i === rowIdx) continue
            if (board[i][j].isMine) negCount++
        }
    }
    return negCount
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isClicked) {
        placeMines(gBoard, i, j)
        // console.log(gGame.isClicked)
        gGame.isClicked = true
    }
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    // console.log('No boom here' + gBoard[i][j].minesAroundCount + 'mines around.')
    if (gBoard[i][j].isMine) {gGame.lives--}
    // console.log('Boom! You have ' + --lives + 'lives left.') 
    if (gBoard[i][j].isMine) {gGame.lives === 0}
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
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    } else { gBoard[i][j].isMarked = false
        gGame.markedCount--
    }
    renderBoard(gBoard)
}

// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    if (gGame.markedCount === gLevel.mines 
        && gGame.shownCount === (gBoard.length ** 2 - gLevel.mines)) {
            console.log('You Win!')
    } else {
        revealBombs()
    }
}

// When user clicks a cell with no 
// mines around, it open not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
function expandShown(board, elCell, i, j) {
    for(var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue
        for(var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= board[0].length) continue
            board[k][l].isShown = true
            countShownCells(board)
        }
    }
    renderBoard(gBoard)
}

function setLevel(elBtn) {
    if (elBtn.innerText === 'You New It 😰') {
        gLevel.size = 4
        gLevel.mines = 2
        onInit()
    }
    if (elBtn.innerText === 'You Know It 😉') {
        gLevel.size = 10
        gLevel.mines = 20
        onInit()
    }
    if (elBtn.innerText === 'You Own It 😎') {
        gLevel.size = 15
        gLevel.mines = 30
        onInit()
    }
}

function placeMines(board, rowIdx, colIdx) {
    // console.log(rowIdx, colIdx)
    var mineCount = 0
    var randI = 0
    var randJ= 0
    while (mineCount < gLevel.mines) {
        randI = getRandomIntInclusive(0, board.length - 1)
        randJ = getRandomIntInclusive(0, board[0].length - 1)
        if (randI === rowIdx && randJ === colIdx) continue
        if (board[randI][randJ].isMine) mineCount--
        board[randI][randJ].isMine = true
        mineCount++
    }
    setMinesNegsCount(board)
    // renderBoard(board)
}

function countShownCells(board) {
    var count = 0
    for(var i = 0; i< board.length; i++) {
        for(var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) count++
        }
    }
    gGame.shownCount = count
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandNum(arr) {
    var randNum = getRandomIntInclusive(0, arr.length - 1)
    var numArr = arr.splice(randNum, 1)
    return numArr[0]
}

function revealBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                currCell.isShown = true
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                revealCell(elCell, i, j)

            }
        }
    }
}