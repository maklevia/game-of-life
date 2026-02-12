
// copy and paste btns: copy btn allows you to copy grid(2d array on current iteration)
// past btn allows you to past 2d array


let gridSize = 10;
let grid = [];
let playbackTimeout = null;
let isStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    addListenersToAllCells();
    increaseGridSizeByButton();
    decreaseGridSizeByButton();
    resetCells();
    randomizeGrid();
    listenStartButton();
    listenStopButton();
    changeSizeWithField();
    changeColorOfCells();
})

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

function listenStartButton() {
    let button = document.querySelector('#start');
    button.addEventListener('click', () => {
        console.log('efqwe');
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
            console.log(grid);
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
        initializeGrid();
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            if (cell.classList.contains('alive')) {
                cell.classList.remove('alive');
                cell.classList.add('dead');
            }
        })
        isStarted = false;
        clearInterval(playbackTimeout);
        changeButtonIfActive();
    })
}

function increaseGridSizeByButton() {
    const button = document.querySelector('#increase');
    const field = document.querySelector('#field');
    button.addEventListener('click', () => {
        if (gridSize >= 50) return;

        increaseGridSize(1);

        disableSizeButtons();
        field.value = gridSize;
    })
}

function increaseGridSize(sizeToAdd) {
    for (let i = 0; i < sizeToAdd; i++) {
        const wrapper = document.querySelector('.wrapper');
        const existingRows = wrapper.querySelectorAll('.row');
        if (isStarted) {
            clearInterval(playbackTimeout);
            isStarted = false;
            changeButtonIfActive();
        }
        existingRows.forEach((existingRow, rowIndex) => {
            grid[rowIndex].push(false);
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('dead');
            cell.id = rowIndex + ' - ' + gridSize
            addListenerToOneCell(cell);
            existingRow.appendChild(cell);
        })

        const newRow = document.createElement('div');
        newRow.classList.add('row');
        const newArrayRow = [];
        for (let i = 0; i <= gridSize; i++) {
            newArrayRow.push(false);
            const cell = document.createElement('div');
            cell.id = gridSize + ' - ' + i;
            cell.classList.add('cell');
            cell.classList.add('dead');
            addListenerToOneCell(cell);
            newRow.appendChild(cell);
        }
        wrapper.appendChild(newRow);
        grid.push(newArrayRow);
        gridSize++;
    }
}

function decreaseGridSizeByButton() {
    const button = document.querySelector('#decrease');
    const field = document.querySelector('#field');
    button.addEventListener('click', () => {
        if (gridSize <= 2) return;

        decreaseGridSize(1);

        disableSizeButtons();
        field.value = gridSize;
    })
}

function decreaseGridSize(sizeToRemove) {
    if (isStarted) {
        clearInterval(playbackTimeout);
        isStarted = false;
        changeButtonIfActive();
    }
    for (let i = 0; i < sizeToRemove; i++) {
        const rows = document.querySelectorAll('.row');
        const rowToRemove = rows[rows.length - 1];
        rowToRemove.remove();
        grid.pop();
        rows.forEach((row) => {
            row.removeChild(row.lastElementChild);
        })
        for (let i = 0; i < gridSize - 1; i++) {
            grid[i].pop();
        }
        gridSize--;
    }
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

        if (field.value > gridSize) {
            const sizeToIncrease = field.value - gridSize;
            increaseGridSize(sizeToIncrease);
        }

        else if (field.value < gridSize) {
            const sizeToRemove = gridSize - field.value;
            decreaseGridSize(sizeToRemove);
        }
    })
}

function randomizeGrid() {
    const button = document.querySelector('#random');
    button.addEventListener('click', () => {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++ ) {
                const cell = document.getElementById(row + ' - ' + col);
                if (Math.random() < 0.35) {
                    grid[row][col] = true;
                    cell.classList.add('alive');
                    cell.classList.remove('dead');
                }
                else {
                    grid[row][col] = false;
                    cell.classList.add('dead');
                    cell.classList.remove('alive');
                }
            }
        }
    })
}

function initializeGrid() {
    grid = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
                row.push(false);
        }
        grid.push(row);
    }
}
function createGrid() {
    initializeGrid();
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

function addListenersToAllCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        addListenerToOneCell(cell);
    })
}

function addListenerToOneCell(cell) {
    cell.addEventListener('click', () => {
        let rowId = cell.id.split(' - ')[0];
        let colId = cell.id.split(' - ')[1];
        if (cell.classList.value.includes('dead')) {
            grid[rowId][colId] = true;
            cell.classList.remove('dead');
            cell.classList.add('alive');
        } else if (cell.classList.value.includes('alive')) {
            grid[rowId][colId] = false;
            cell.classList.remove('alive');
            cell.classList.add('dead');
        }
    })
}

function changeColorOfCells () {
    const button = document.querySelector('#color-button');
    const newAliveField = document.querySelector('#color-alive');
    const newDeadField = document.querySelector('#color-dead');
    button.addEventListener('click', () => {

        const newAliveColor = newAliveField.value;
        const newDeadColor = newDeadField.value;
        document.documentElement.style.setProperty('--aliveColor', newAliveColor);
        document.documentElement.style.setProperty('--deadColor', newDeadColor);
    })

}







