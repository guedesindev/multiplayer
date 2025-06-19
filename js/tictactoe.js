import eventManager from './eventManager.js'

let salaId, nomeJogador

eventManager.subscribe('tictactoe', (data) => {
  salaId = data.salaId
  nomeJogador = data.nome
})

function criarPalco() {
  let palco = document.createElement('div')
  palco.classList.add('palco')
  palco.setAttribute('id', 'tictactoe')

  return palco
}

export function renderizarTicTacToe() {
  const modalContainer = document.getElementById('modal-container')
  let palco = criarPalco()

  modalContainer.append(palco)
  if (modalContainer.classList.contains('hide'))
    modalContainer.classList.remove('hide')
  modalContainer.classList.add('show')
  console.log(modalContainer)
}

export function iniciarTicTacToe(data) {
  console.log(
    `Iniciando o TicTacToe na sala: ${data.salaId} para o jogador: ${data.nome}`
  )
}
