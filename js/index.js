import eventManager from './eventManager.js'
// Dados do formulário inicial
const gameName = document.querySelectorAll('input[type="radio"][name="jogo"]')
const userName = document.getElementById('name')
const btnLogin = document.getElementById('button-login')

// Modal Container
const modalContainer = document.getElementById('modal-container')
const closeModal = document.getElementById('close_modal')
const title = document.getElementById('title')

userName.addEventListener('input', (e) => {
  if (e.target.value.length > 2) {
    btnLogin.removeAttribute('disabled')
  } else {
    btnLogin.setAttribute('disabled', true)
  }
})

gameName.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    const allDivRadios = document.querySelectorAll('.div-radio')
    allDivRadios.forEach((divRadio) => {
      divRadio.classList.remove('light')
    })

    radio.parentNode.classList.add('light')
  })
})

btnLogin.addEventListener('click', (e) => {
  e.preventDefault()

  let playerName = userName.value
  let game
  for (const radio of gameName) {
    if (radio.checked) {
      game = radio.value
    }
  }

  const data = {
    usuario: playerName,
    jogo: game
  }
  document.getElementById('form').style.display = 'none'

  eventManager.publish('player-game', data)
})

closeModal.addEventListener('click', (e) => {
  e.preventDefault()
  modalContainer.classList.add('hide')
  modalContainer.classList.remove('show')
})

eventManager.subscribe('atualizar-titulo', async (titulo) => {
  title.textContent = `${titulo}`
})
