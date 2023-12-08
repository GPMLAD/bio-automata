const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const resolution = 10
const rows = canvas.height / resolution
const cols = canvas.width / resolution

// Probabilidades
// Botão pra resetar a simulação
// Botão gravar a simulação como GIF
// Botão de gravar dados e baixar como .dat ou .csv

let speed = 1
let hx = 0.5 // Probabilidade de colonização da espécie nativa
let hy = 0.5 // Probabilidade de colonização da espécie invasora
let dx = 0.5 // Probabilidade de morte da célula nativa
let dy = 0.5 // Probabilidade de morte da célula invasora
let iy = 0.1 // Probabilidade de invasão

export let nativePercent = []
export let invasivePercent = []
export let iterations = []

export const initialValues = [0.8, 0.3, 0.5, 0.5, 0.1, 1]

const spanHY = document.getElementById('spanHY')
const spanHX = document.getElementById('spanHX')
const spanDY = document.getElementById('spanDY')
const spanDX = document.getElementById('spanDX')
const spanIY = document.getElementById('spanIY')

const hySlider = document.getElementById('hy')
hySlider.setAttribute('min', '0')
hySlider.setAttribute('max', '1')
hySlider.setAttribute('step', '0.1')

const hxSlider = document.getElementById('hx')
hxSlider.setAttribute('min', '0')
hxSlider.setAttribute('max', '1')
hxSlider.setAttribute('step', '0.1')

const dySlider = document.getElementById('dy')
dySlider.setAttribute('min', '0')
dySlider.setAttribute('max', '1')
dySlider.setAttribute('step', '0.1')

const dxSlider = document.getElementById('dx')
dxSlider.setAttribute('min', '0')
dxSlider.setAttribute('max', '1')
dxSlider.setAttribute('step', '0.1')

const iySlider = document.getElementById('iy')
iySlider.setAttribute('min', '0')
iySlider.setAttribute('max', '1')
iySlider.setAttribute('step', '0.1')

const speedSlider = document.getElementById('speed')
speedSlider.setAttribute('min', '1')
speedSlider.setAttribute('max', '10')
speedSlider.setAttribute('step', '1')

export function updateValues(element) {
  console.log(element.value)
  if (element.id === 'hy') {
    hy = Number(element.value)
    spanHY.innerText = parseFloat(element.value).toFixed(1)
  }

  if (element.id === 'hx') {
    hx = Number(element.value)
    spanHX.innerText = parseFloat(element.value).toFixed(1)
  }

  if (element.id === 'dy') {
    dy = Number(element.value)
    spanDY.innerText = parseFloat(element.value).toFixed(1)
  }

  if (element.id === 'dx') {
    dx = Number(element.value)
    spanDX.innerText = parseFloat(element.value).toFixed(1)
  }

  if (element.id === 'iy') {
    iy = Number(element.value)
    spanIY.innerText = parseFloat(element.value).toFixed(1)
  }

  if (element.id === 'speed') {
    speed = Number(element.value)
    spanSPEED.innerText = parseFloat(element.value).toFixed(1)
  }
}
window.updateValues = updateValues
function createGrid() {
  return new Array(cols).fill(null).map(() => new Array(rows).fill('empty'))
}

function randomizeGrid(grid) {
  return grid.map(column =>
    column.map(() => {
      const rand = Math.random()
      if (rand < 0.2) {
        return 'native'
      } else if (rand < 0.4) {
        return 'invasive'
      } else {
        return 'empty'
      }
    })
  )
}

function drawGrid(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  grid.forEach((column, i) => {
    column.forEach((cell, j) => {
      if (cell === 'native') {
        ctx.fillStyle = '#B34E7E'
      } else if (cell === 'invasive') {
        ctx.fillStyle = '#01B3ED'
      } else {
        ctx.fillStyle = '#FFF8B8'
      }
      ctx.fillRect(i * resolution, j * resolution, resolution, resolution)
      ctx.strokeRect(i * resolution, j * resolution, resolution, resolution)
    })
  })
}

function shuffle(originalArray) {
  const copy = [...originalArray]

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

function randomInvasion(grid) {
  let natives = 0
  let invasives = 0
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const currentCell = grid[i][j]
      const rand = Math.random()
      if (currentCell == 'invasive') {
        invasives = invasives + 1
      }

      if (currentCell == 'native') {
        natives = natives + 1
      }

      if (currentCell == 'empty') {
        if (rand < iy) {
          grid[i][j] = 'invasive'
        }
      }
    }
  }
  nativePercent.push(natives / (rows * cols))
  invasivePercent.push(invasives / (rows * cols))
  iterations.push(iterations.length + 1)
  return grid
}

function updateGrid(grid) {
  const newGrid = createGrid()
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const neighbors = countNeighbors(grid, i, j)
      const currentCell = grid[i][j]
      const rand = Math.random()

      if (currentCell === 'native') {
        // Regras para célula nativa
        if (rand < dx) {
          // Mortalidade
          newGrid[i][j] = 'empty'
        } else {
          // Colonização
          newGrid[i][j] = 'native'
        }
      } else if (currentCell === 'invasive') {
        // Regras para célula invasora
        if (rand < dy) {
          // Mortalidade
          newGrid[i][j] = 'empty'
        } else {
          // Colonização
          newGrid[i][j] = 'invasive'
        }
      } else {
        const shuffledNeighbors = shuffle(neighbors)
        shuffledNeighbors.forEach(element => {
          const localProbality = Math.random()
          if (localProbality < hy && element == 'invasive') {
            newGrid[i][j] = 'invasive'
          }
          if (localProbality < hx && element == 'native') {
            newGrid[i][j] = 'native'
          }
        })
      }
    }
  }
  const finalGrid = randomInvasion(newGrid)
  return finalGrid
}

function countNeighbors(grid, x, y) {
  const neighborsOffsets = [
    { x: 0, y: -1 }, // acima
    { x: 0, y: 1 }, // abaixo
    { x: -1, y: 0 }, // esquerda
    { x: 1, y: 0 } // direita
  ]

  const neighbors = []

  for (const offset of neighborsOffsets) {
    const col = (x + offset.x + cols) % cols
    const row = (y + offset.y + rows) % rows
    neighbors.push(grid[col][row])
  }

  return neighbors
}

let grid = createGrid()
grid = randomizeGrid(grid)

export function animate() {
  drawGrid(grid)
  grid = updateGrid(grid)
  setTimeout(animate, 1000 / speed)
  //requestAnimationFrame(animate);
}

export const inputs = [...document.getElementsByTagName('input')]

const labels = [...document.getElementsByTagName('label')]
labels.forEach(element => {
  if (element.htmlFor[1] == 'y') {
    element.style = 'color: black;'
  } else {
    element.style = 'color: white;'
  }
})
