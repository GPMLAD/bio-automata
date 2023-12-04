const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const resolution = 10
const rows = canvas.height / resolution
const cols = canvas.width / resolution

// Probabilidades
let hx = 0.5 // Probabilidade de colonização da espécie nativa
let hy = 0.5 // Probabilidade de colonização da espécie invasora
let dx = 0.1 // Probabilidade de morte da célula nativa
let dy = 0.1 // Probabilidade de morte da célula invasora
let iy = 0.0 // Probabilidade de invasão

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
        // Regras para célula vazia
        // Preciso fazer um array com a ordem dos vizinhos, sortear a ordem e depois passar cada uma das propabilidades individualmente
        // Preciso fazer isso para cada vizinho que seja nativo
        if (rand < hy && neighbors.includes('invasive')) {
          // Preciso fazer isso para cada vizinho que seja invasivo
          // Colonização por célula invasora
          newGrid[i][j] = 'invasive'
        }
        if (rand < hx && neighbors.includes('native')) {
          // Colonização por célula nativa
          newGrid[i][j] = 'native'
        }
      }
      /*
    // Depois que todas as interações terminarem, eu devo ver a matriz novamente e rodar a chance de surgir do nada uma nova invasora.
    if(rand < iy){
        newGrid[i][j] = 'invasive'
    }
    */
    }
  }
  return newGrid
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
  //requestAnimationFrame(animate);
}

animate() // Inicia a animação por padrão

/*
0 1 0
2 X 2
0 1 0
 */

/*
1 1 0
2 0 0
0 0 0
 */
