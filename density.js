import { invasivePercent, iterations, nativePercent } from './simulation.js'
import { intervalID } from './main.js'

const ctx = document.getElementById('myChart').getContext('2d')

const data = {
  labels: [],
  datasets: [
    {
      label: 'Invasora - Y',
      borderColor: '#01B3ED',
      data: [],
      fill: false
    },
    {
      label: 'Nativa - X',
      borderColor: '#B34E7E',
      data: [],
      fill: false
    }
  ]
}

const config = {
  type: 'line',
  data: data,
  options: {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Geração'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Densidade'
        }
      }
    }
  }
}

const myChart = new Chart(ctx, config)

export function adicionarPonto() {
  const newData =
    data.labels.length === 0
      ? 0
      : parseFloat(data.labels[data.labels.length - 1])

  if (newData >= 6000) {
    clearInterval(intervalID)
    return
  }

  data.datasets[0].data = [...invasivePercent]
  data.datasets[1].data = [...nativePercent]
  data.labels = [...iterations]

  myChart.update()
}
