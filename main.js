const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const resolution = 10
const rows = canvas.height / resolution
const cols = canvas.width / resolution

// Probabilidades
// Adicionar uma função onde os valores de span ao iniciar a página são os valores de initialValues
const initialValues = [0.5, 0.5, 0.5, 0.5, 0.1]
let hx = 0.5 // Probabilidade de colonização da espécie nativa
let hy = 0.5 // Probabilidade de colonização da espécie invasora
let dx = 0.5 // Probabilidade de morte da célula nativa
let dy = 0.5 // Probabilidade de morte da célula invasora
let iy = 0.1 // Probabilidade de invasão

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

const buttonStart = document.getElementById('start')
buttonStart.addEventListener('click', e => {
  buttonStart.disabled = true
  animate()
})

function updateValues(element) {
  console.log(element.value)
  if (element.id === 'hy') {
    hy = Number(element.value)
    spanHY.innerText = element.value
  }

  if (element.id === 'hx') {
    hx = Number(element.value)
    spanHX.innerText = element.value
  }

  if (element.id === 'dy') {
    dy = Number(element.value)
    spanDY.innerText = element.value
  }

  if (element.id === 'dx') {
    dx = Number(element.value)
    spanDX.innerText = element.value
  }

  if (element.id === 'iy') {
    iy = Number(element.value)
    spanIY.innerText = element.value
  }
}

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
        ctx.fillStyle = '#00f' // Azul para célula nativa
      } else if (cell === 'invasive') {
        ctx.fillStyle = '#f00' // Vermelho para célula invasora
      } else {
        ctx.fillStyle = '#fff' // Branco para célula vazia
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
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const currentCell = grid[i][j]
      const rand = Math.random()

      if (currentCell == 'empty') {
        if (rand < iy) {
          grid[i][j] = 'invasive'
        }
      }
    }
  }
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
  finalGrid = randomInvasion(newGrid)
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

function animate() {
  drawGrid(grid)
  grid = updateGrid(grid)
  setTimeout(animate, 1000 / 1)
  console.log(`hy:${hy} -- hx:${hx} -- dy:${dy} -- dx:${dx} -- iy:${iy}`)
  //requestAnimationFrame(animate);
}

const inputs = [...document.getElementsByTagName('input')]
inputs.forEach(element => {
  updateValues(element)
})

const labels = [...document.getElementsByTagName('label')]
labels.forEach(element => {
  if (element.htmlFor[1] == 'y') {
    element.style = 'color: red;'
  } else {
    element.style = 'color: blue;'
  }
})
//animate()
