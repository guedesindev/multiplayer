import eventManager from './eventManager.js'

let salaId, nomeJogador

eventManager.subscribe('jokenpo', (data) => {
  salaId = data.salaId
  nomeJogador = data.nome
})

function criarPalco() {
  let palco = document.createElement('div')
  palco.setAttribute('id', 'jokenpo')
  palco.classList.add('palco')

  return palco
}

export function renderizarJokenpo() {
  const modalContainer = document.getElementById('modal-container')
  let palco = criarPalco()
  modalContainer.append(palco)
  if (modalContainer.classList.contains('hide')) {
    modalContainer.classList.remove('hide')
  }
  modalContainer.classList.add('show')
  console.log(modalContainer)
}

export function iniciarJokenpo(data) {
  console.log(
    `Inicializando Jokenpo na sala: ${data.salaId}, logado pelo jogador: ${data.nome}.`
  )
}
