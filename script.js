const hexadecimalCharacters = ['A', 'B', 'C', 'D', 'E', 'F'];
for (let i = 0; i < 10; i += 1) {
  hexadecimalCharacters.push(`${i}`);
}

function generateRandomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * 17);
    color += hexadecimalCharacters[index];
  }
  return color;
}

function createElement(tagName, className, style) {
  const newElement = document.createElement(tagName);
  newElement.className = className;
  Object.assign(newElement.style, style);
  return newElement;
}

const colors = ['#D00000', '#FFBA08', '#3F88C5', '#136F63'];

const { body } = document;
body.innerText = '';

const header = createElement('header', '', {});
body.appendChild(header);

const pixelBoard = createElement('ul', '', {});
pixelBoard.id = 'pixel-board';
body.appendChild(pixelBoard);

const title = createElement('h1', '', {});
title.id = 'title';
title.innerText = 'Paleta de Cores';
header.appendChild(title);

const colorPalette = createElement('ul', '', {});
colorPalette.id = 'color-palette';
header.appendChild(colorPalette);

const boardSizeLayout = createElement('div', 'board-size-container', {});

const boardSizeInput = createElement('input', '', {});
boardSizeInput.id = 'board-size';
boardSizeInput.type = 'number';
boardSizeInput.placeholder = 'Tamanho do quadro';
boardSizeInput.max = '50';
boardSizeInput.min = '1';
boardSizeInput.pattern = '[5-50]';
boardSizeLayout.appendChild(boardSizeInput);

const boardSizeButton = createElement('button', '', {});
boardSizeButton.id = 'generate-board';
boardSizeButton.innerText = 'VQV';
boardSizeLayout.appendChild(boardSizeButton);

header.appendChild(boardSizeLayout);

function handleBoardSize() {
  const savedSize = localStorage.getItem('boardSize');
  const boardSize = savedSize ? JSON.parse(savedSize) : 5;
  if (boardSize < 5) {
    return 5;
  }
  if (boardSize > 50) {
    return 50;
  }
  return boardSize;
}

function createGrid() {
  pixelBoard.innerHTML = '';
  const boardSize = handleBoardSize();
  for (let line = 0; line < boardSize; line += 1) {
    const lineElement = createElement('ul', '', {});
    for (let column = 0; column < boardSize; column += 1) {
      const pixel = createElement('li', 'pixel', { backgroundColor: 'white' });
      lineElement.appendChild(pixel);
    }
    pixelBoard.appendChild(lineElement);
  }
}

function changeBoardSize(event) {
  const inputValue = event.target.previousSibling.value;
  if (!inputValue) {
    alert('Board inválido!');
  } else {
    localStorage.setItem('boardSize', inputValue);
    createGrid();
  }
}

boardSizeButton.addEventListener('click', changeBoardSize);

for (let i = 0; i < colors.length; i += 1) {
  const colorElement = createElement('li', 'color', { backgroundColor: colors[i] });
  colorPalette.appendChild(colorElement);
}

createGrid();

function selectColor(event) {
  const selectedColor = document.querySelector('.selected');
  if (!selectedColor || selectedColor === event.target) {
    event.target.classList.toggle('selected');
  } else {
    selectedColor.classList.toggle('selected');
    event.target.classList.toggle('selected');
  }
}

const colorsArray = Array.from(document.querySelectorAll('.color'));
colorsArray.forEach((element) => {
  element.addEventListener('click', selectColor);
});

function saveBoardStatus() {
  const boardSave = [];
  const boardStatus = document.querySelectorAll('#pixel-board ul');
  for (let i = 0; i < boardStatus.length; i += 1) {
    boardSave[i] = [];
    for (let j = 0; j < boardStatus[i].childNodes.length; j += 1) {
      const styleObject = boardStatus[i].childNodes[j].style;
      boardSave[i].push(styleObject.backgroundColor);
    }
  }
  localStorage.setItem('pixelBoard', JSON.stringify(boardSave));
}

function paintPixel(event) {
  const selectedColor = document.querySelector('.selected');
  const pixelStyle = event.target.style;
  if (selectedColor) {
    pixelStyle.backgroundColor = selectedColor.style.backgroundColor;
    saveBoardStatus();
  }
}

const pixels = Array.from(document.getElementsByClassName('pixel'));
pixels.forEach((element) => {
  element.addEventListener('click', paintPixel);
});

const btnClearBoard = createElement('button', '', {});
btnClearBoard.id = 'clear-board';
btnClearBoard.innerText = 'Limpar';
header.appendChild(btnClearBoard);

function clearBoard() {
  pixels.forEach((element) => {
    const elStyle = element.style;
    elStyle.backgroundColor = 'white';
  });
}

btnClearBoard.addEventListener('click', clearBoard);

const btnRandomColor = createElement('button', '', {});
btnRandomColor.id = 'button-random-color';
btnRandomColor.innerText = 'Cores aleatórias';
header.appendChild(btnRandomColor);

function changeToRandomColors() {
  const colorsElements = Array.from(document.querySelectorAll('.color'));
  colorsElements.forEach((element) => {
    const elStyle = element.style;
    elStyle.backgroundColor = generateRandomColor();
  });
}

btnRandomColor.addEventListener('click', changeToRandomColors);

function paintLoadedBoard(lineIndex, loadedBoard) {
  for (let i = 0; i < loadedBoard.length; i += 1) {
    const pixelStyle = pixelBoard.childNodes[lineIndex].childNodes[i].style;
    pixelStyle.backgroundColor = loadedBoard[lineIndex][i];
  }
}

function loadBoardStatus() {
  const boardSave = JSON.parse(localStorage.getItem('pixelBoard'));
  if (boardSave) {
    for (let i = 0; i < boardSave.length; i += 1) {
      paintLoadedBoard(i, boardSave);
    }
  }
}

loadBoardStatus();
