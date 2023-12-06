const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const resolution = 10
const rows = canvas.height / resolution
const cols = canvas.width / resolution

// Probabilidades
let hx = 0.2 // Probabilidade de colonização da espécie nativa
let hy = 0.1 // Probabilidade de colonização da espécie invasora
let dx = 0.2 // Probabilidade de morte da célula nativa
let dy = 0.2 // Probabilidade de morte da célula invasora
let iy = 0.1 // Probabilidade de invasão

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
  setTimeout(animate, 1000/2)
  //requestAnimationFrame(animate);
}

animate()
