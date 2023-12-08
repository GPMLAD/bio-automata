import { animate, inputs, updateValues, initialValues } from './simulation.js'
import { adicionarPonto } from './density.js'

for (let i = 0; i < inputs.length; i++) {
  inputs[i].value = initialValues[i]
}

inputs.forEach(element => {
  updateValues(element)
})

export let intervalID

const buttonStart = document.getElementById('start')
buttonStart.addEventListener('click', e => {
  buttonStart.disabled = true
  animate()
  intervalID = setInterval(adicionarPonto, 1000)
})
