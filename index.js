
// also you can rework logic of randomization, increasing\decreasing grid size to not recreate actual grid each time

// ability to interactivly set custom colors selector for dead\alive cells
// copy and paste btns: copy btn allows you to copy grid(2d array on current iteration)
// past btn allows you to past 2d array



let gridSize = 10;
let grid = [];
let playbackTimeout = null;
let isStarted = false;

function checkAliveConditionForCell(row, col, grid){
    let aliveNeighborsCounter = 0;
    for (let colIndex = -1; colIndex < 2; colIndex++) {
        for (let rowIndex = -1; rowIndex < 2; rowIndex++) {
            if (rowIndex === 0 && colIndex === 0) {
                continue;
            }
            if ((row + rowIndex < 0) || (row + rowIndex > grid.length - 1)) {
                continue;
            }
            if ((col + colIndex < 0) || (col + colIndex > grid.length - 1)) {
                continue;
            }
            if (grid[row + rowIndex][col + colIndex] === true) {
                aliveNeighborsCounter++;
            }
        }
    }

    if (grid[row][col] === false) {
        if (aliveNeighborsCounter === 3) {
            return true;
        }

        return false;
    }
    else {
        if (aliveNeighborsCounter < 2) {
            return false;
        }
        if (aliveNeighborsCounter > 3) {
            return false;
        }
        return true;
    }
}

function iterateGridAndCheckConditionForCells(){
    const copyGrid = structuredClone(grid);
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
        for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
            copyGrid[rowIndex][colIndex] = checkAliveConditionForCell(rowIndex, colIndex, grid);
        }
    }
    grid = copyGrid;
}

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    addListenersToCells();
    increaseGridSize();
    decreaseGridSize();
    resetCells();
    randomizeGrid();
    listenStartButton();
    listenStopButton();
    changeSizeWithField();
})

function listenStartButton() {
    let button = document.querySelector('#start');
    button.addEventListener('click', () => {
        clearInterval(playbackTimeout);
        isStarted = true;
        changeButtonIfActive();
        const allCells = document.querySelectorAll('.cell');
        playbackTimeout = setInterval(() => {
            iterateGridAndCheckConditionForCells();
            allCells.forEach((cell) => {
                const rowIndex = cell.id.split(' - ')[0];
                const colIndex = cell.id.split(' - ')[1];
                if (cell.classList.contains('alive') && !grid[rowIndex][colIndex]) {
                    cell.classList.remove('alive');
                    cell.classList.add('dead');
                }
                else if (cell.classList.contains('dead') && grid[rowIndex][colIndex]) {
                    cell.classList.remove('dead');
                    cell.classList.add('alive');
                }
            })
            //clearWrapper();
            //createGrid(0, true);
            //addListenersToCells();
        }, 300)
    })
}

function listenStopButton() {
    let button = document.querySelector('#stop');
    button.addEventListener('click', () => {
        clearInterval(playbackTimeout);
        isStarted = false;
        changeButtonIfActive();
    })
}

function changeButtonIfActive() {
    let startButton = document.querySelector('#start');
    let stopButton = document.querySelector('#stop');
    let startIcon = document.querySelector('#startIcon');
    let stopIcon = document.querySelector('#stopIcon');
    if (!isStarted) {
        startButton.classList.remove('active');
        stopButton.classList.add('active');
        startIcon.classList.remove('active-icon');
        stopIcon.classList.add('active-icon');
    }
    else {
        startButton.classList.add('active');
        stopButton.classList.remove('active');
        startIcon.classList.add('active-icon');
        stopIcon.classList.remove('active-icon');
    }
}

function resetCells() {
    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
        clearWrapper();
        createGrid();
        addListenersToCells();
        initializeGrid();
        isStarted = false;
        clearInterval(playbackTimeout);
        changeButtonIfActive();
    })
}

function clearWrapper() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML = '';
}

function increaseGridSize() {
    const button = document.querySelector('#increase');
    const field = document.querySelector('#field');
    button.addEventListener('click', () => {
        if (gridSize >= 50) return;
        gridSize++;
        disableSizeButtons();
        field.value = gridSize;
        clearWrapper();
        createGrid();
        addListenersToCells();
    })
}

function decreaseGridSize() {
    const button = document.querySelector('#decrease');
    const field = document.querySelector('#field');
    button.addEventListener('click', () => {
        if (gridSize <= 2) return;
        gridSize--;
        disableSizeButtons();
        field.value = gridSize;
        clearWrapper();
        createGrid();
        addListenersToCells();
    })
}

function disableSizeButtons() {
    const increaseBtn = document.querySelector('#increase');
    const decreaseBtn = document.querySelector('#decrease');
    if (gridSize < 3) {
        decreaseBtn.disabled = true;
    }
    else
        decreaseBtn.disabled = false;
    if (gridSize > 50) {
        increaseBtn.disabled = true;
    }
    else {
        increaseBtn.disabled = false;
    }
}

function validateGridSize() {
    const field = document.querySelector('#field');
    const fieldValue = Number(field.value);

    if (fieldValue < 2 || fieldValue > 50 || !Number.isInteger(fieldValue)) {
        alert('Incorrect grid size!');
        field.value = gridSize;
        return false;
    }
    return true;
}

function changeSizeWithField() {
    const field = document.querySelector('#field');
    field.value = gridSize;
    field.addEventListener('change', () => {
        if (!validateGridSize()) {
            return;
        }
        gridSize = field.value;
        clearWrapper();
        createGrid();
        addListenersToCells();
    })
}

function randomizeGrid() {
    const button = document.querySelector('#random');
    button.addEventListener('click', () => {
        clearWrapper();
        createGrid(0.35);
        addListenersToCells();
    })
}

function initializeGrid(randomizeCoef) {
    grid = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            if (randomizeCoef && randomizeCoef > Math.random()) {
                row.push(true);
            }
            else {
                row.push(false);
            }
        }
        grid.push(row);
    }
}
function createGrid(randomizeCoef, skipInitialization) {
    if(!skipInitialization){
        initializeGrid(randomizeCoef)
    }

    const wrapper = document.querySelector('.wrapper');
    for (let i = 0; i < gridSize; i++) {
        const newRow = document.createElement('div')
        newRow.classList.add('row')
        for (let j = 0; j < gridSize; j++) {
            const newCell = document.createElement('div')
            newCell.classList.add('cell')
            newCell.id = i + ' - ' + j;
            if (grid[i][j]) {
                newCell.classList.add('alive')
            }
            else {
                newCell.classList.add('dead');
            }
            newRow.appendChild(newCell)
        }
        wrapper.appendChild(newRow);
    }
}

function addListenersToCells() {
    const cellsElements = document.getElementsByClassName('cell');
    const cells = Array.from(cellsElements);

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            let rowId = cell.id.split(' - ')[0];
            let colId = cell.id.split(' - ')[1];
            if (cell.classList.value.includes('dead')) {
                grid[rowId][colId] = true;
                cell.classList.remove('dead');
                cell.classList.add('alive');
            }
            else if (cell.classList.value.includes('alive')) {
                grid[rowId][colId] = false;
                cell.classList.remove('alive');
                cell.classList.add('dead');
            }
        })
    })
}








