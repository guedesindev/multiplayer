import eventManager from './eventManager.js'
import { handleClickChute } from './forca.js'

eventManager.subscribe('errou', (erros) => {
  let forcaimg = document.getElementById('forca-img')
  if (forcaimg && erros < 4) {
    forcaimg.setAttribute('src', `./utils/images/forca-${erros + 1}.png`)
  } else if (erros === 4) {
    forcaimg.setAttribute('src', `./utils/images/forca-${erros + 1}.png`)
  }
})

eventManager.subscribe('fim-rodada', (dados) => {
  const forcaModal = document.getElementById('forca')
  const div = document.createElement('div')
  const span = document.createElement('span')

  let text = dados.split('_')
  span.textContent = `${text[0]} ${text[1]}`

  if (text[1] === 'acertou') {
    forcaModal.setAttribute('id', 'win-game')
    div.classList.add('div-win-game')
  } else if (text[1] === 'errou') {
    forcaModal.setAttribute('id', 'game-over')
    div.classList.add('div-game-over')
  }

  div.append(span)
  forcaModal.append(div)

  setTimeout(() => {
    forcaModal.removeChild(div)
    forcaModal.setAttribute('id', 'forca')
    eventManager.publish('iniciar-rodada', null)
  }, 5000)
})

eventManager.subscribe('reset-front', () => {
  let palco = document.getElementById('forca')
  let restartButton = document.getElementById('restart-button')
  let winnerPalco = document.getElementById('winner-palco')
  if (restartButton) palco.removeChild(restartButton)
  if (winnerPalco) palco.removeChild(winnerPalco)
})

eventManager.subscribe('alterar-placar', (jogadores) => {
  const placar = {}
  Object.entries(jogadores).forEach((item, key) => {
    let placarView = document.getElementById(`pontos-player${key + 1}`)
    placar[`${item[1].nome}`] = item[1].pontos
    placarView.textContent = item[1].pontos
  })
})

export function renderizarForca(jogadores) {
  let modalContainer = document.getElementById('modal-container')
  let modalForca = criarModal(jogadores)

  modalContainer.innerHTML = ''
  modalContainer.appendChild(modalForca)

  // Garante que a modal esteja visível
  if (modalContainer && modalContainer.classList.contains('hide')) {
    modalContainer.classList.remove('hide')
  }
  if (modalContainer) modalContainer.classList.add('show')
}

export function criarSpansIniciais(palavraSecreta, letrasChutadas) {
  const palcoPalavraSecreta = document.getElementById('palco-palavra-secreta')
  if (!palcoPalavraSecreta) return

  palcoPalavraSecreta.innerHTML = ''

  for (let i = 0; i < palavraSecreta.length; i++) {
    const span = document.createElement('span')
    span.classList.add('letras')
    const letra = palavraSecreta[i].toUpperCase()
    span.textContent =
      letrasChutadas && letrasChutadas.includes(letra) ? letra : '_'

    palcoPalavraSecreta.appendChild(span)
  }
}

export function atualizarSpansDaForca(palavraSecreta, letrasChutadas) {
  const spans = document.querySelectorAll('#palco-palavra-secreta .letras')
  if (spans.length == 0) {
    criarSpansIniciais(palavraSecreta, letrasChutadas)
    return
  }

  for (let i = 0; i < palavraSecreta.length; i++) {
    if (letrasChutadas.includes(palavraSecreta[i].toUpperCase())) {
      spans[i].textContent = palavraSecreta[i].toUpperCase()
    }
  }
}

export function popularSelectPalavras(dados) {
  const palcoPalavraSecreta = document.getElementById('palco-palavra-secreta')
  palcoPalavraSecreta.innerHTML = ''

  if (!palcoPalavraSecreta) {
    console.error('Elemento "palco-palavra-secreta" não encontrado.')
    return
  }

  palcoPalavraSecreta.innerHTML = `
      <div class="palco-letras-chutadas">
        <div class="palavra-secreta-container" id="palavra-secreta-container">
        </div>
      </div>
    `

  // Verificar dados dos jogadores
  let jogadorVezuid = dados.turno_de_selecao_uid
  const cabecalhoTexto = 'Seleção de palavra secreta'
  const aguardeText = 'Aguarde o adversário selecionar a palavra secreta.'
  const palavraSecretaContainer = document.getElementById(
    'palavra-secreta-container'
  )

  if (dados.dados_jogador_local.uid === jogadorVezuid) {
    // desabilitarHeadPlayerContainer(jogadorVezuid)
    palavraSecretaContainer.innerHTML = `
        <h4 id="cabecalho-palavra-secreta">${cabecalhoTexto}</h4>
        <form id="selecao-palavra-secreta">
          <select id="select-palavras"></select>
          <button id="btn-palavra-secreta">Enviar</button>
        </form>
      `

    // Obtenção do select da DOM
    const selectPalavras = document.getElementById('select-palavras')

    //Populando o select

    if (dados.palavras) {
      Object.values(dados.palavras).forEach((palavra) => {
        palavra.forEach((item) => {
          let option = document.createElement('option')
          option.textContent = item
          option.value = item
          selectPalavras.append(option)
        })
      })
      selectPalavras.style.display = 'block'
    }

    const btnPalavraSecreta = document.getElementById('btn-palavra-secreta')

    function handleClick(e) {
      e.preventDefault()
      const palavraSecreta = selectPalavras.value
      if (!palavraSecreta) {
        alert('Por favor, selecione uma palavra!')
        return
      }
      const eventData = { palavra: palavraSecreta, sala: dados.salaId }
      eventManager.publish('palavra-secreta', eventData)
    }

    if (btnPalavraSecreta) {
      // Remover listeners antigos para evitar duplicação em chamadas futuras
      btnPalavraSecreta.removeEventListener('click', handleClick)
      btnPalavraSecreta.addEventListener('click', handleClick, { once: true })
    }

    if (Object.keys(dados.jogadores).length < 2) {
      palavraSecretaContainer.innerHTML = `<h4>Aguarde adversário conectar à partida...</h4>`
    }
  } else {
    // desabilitarHeadPlayerContainer(jogadorVezuid)
    let containerAguardar = document.createElement('div')
    containerAguardar.style.display = 'flex'
    containerAguardar.style.alignItems = 'center'
    containerAguardar.style.justifyContent = 'center'

    containerAguardar.innerHTML = ``
    palavraSecretaContainer.innerHTML = `<span style="display=flex;align-items:center;justify-content:center">${aguardeText}</span>`
  }
}

export function gerenciarPalavraSecretaUI(dados_do_jogo) {
  const palcoPalavraSecreta = document.getElementById('palco-palavra-secreta')

  if (!palcoPalavraSecreta) {
    console.error('Elemento #palco-palavra-secreta não encontrado!')
    return
  }

  const palavraFoiSelecionada =
    dados_do_jogo.palavra_secreta && dados_do_jogo.palavra_secreta !== ''

  if (!palavraFoiSelecionada) {
    // FASE DE SELEÇÃO DE PALAVRA / AGUARDAR
    const JogadorQueEscolheuid = dados_do_jogo.turno_de_selecao_uid

    //

    if (dados_do_jogo.dados_jogador_local.uid === JogadorQueEscolheuid) {
      popularSelectPalavras(dados_do_jogo)

      const btnPalavraSecreta = document.getElementById('btn-palavra-secreta')
      if (btnPalavraSecreta) {
        btnPalavraSecreta.onclick = null
        btnPalavraSecreta.addEventListener(
          'click',
          (e) => {
            e.preventDefault()
            const palavra = document.getElementById('select-palavras').value
            if (palavra) {
              eventManager.publish('palavra-secreta', {
                sala: dados_do_jogo.salaId,
                palavra: palavra
              })
            } else {
              alert('Por favor, selecione uma palavra!')
            }
          },
          { once: true }
        ) // {once:true} adicionado ao evento para que ele possa ser excluído após sua execução
      }
    } else {
      // Player local aguarda o adversário
      palcoPalavraSecreta.innerHTML = `
      <div class="palco-letras-chutadas">
        <div class="palavra-secreta-container" id="palavra-secreta-container"></div>
      </div>
     `

      const palavraSecretaContainer = document.getElementById(
        'palavra-secreta-container'
      )

      if (!palavraSecretaContainer) {
        console.warn('Palavra secreta container não existe')
      }

      palavraSecretaContainer.innerHTML = `
        <h4>Aguarde o adversário escolher a palavra secreta...</h4>
      `
    }
  } else {
    // FASE DE JOGO EM ANDAMENTO (Palavra secreta já foi selecionada)
    criarSpansIniciais(
      dados_do_jogo.palavra_secreta,
      dados_do_jogo.letras_chutadas || []
    )
    atualizarSpansDaForca(
      dados_do_jogo.palavra_secreta,
      dados_do_jogo.letas_chutadas || []
    )
  }
}

export function gerenciarInterfaceForca(dados_jogo) {
  const inputChutePlayer1 = document.getElementById('chute-player1')
  const buttonChutePlayer1 = document.getElementById('p1-chute-btn')
  const inputChutePlayer2 = document.getElementById('chute-player2')
  const buttonChutePlayer2 = document.getElementById('p2-chute-btn')

  const inputsChute = [inputChutePlayer1, inputChutePlayer2]
  const buttonsChute = [buttonChutePlayer1, buttonChutePlayer2]

  const jogadores = dados_jogo.jogadores

  const palavraFoiSelecionada =
    dados_jogo.palavra_secreta && dados_jogo.palavra_secreta !== ''

  desativarElementos(inputsChute, buttonsChute)

  if (dados_jogo.status && dados_jogo.status.inlcudes('acertou')) {
    desativarElementos(inputsChute, buttonsChute)
    return
  }

  if (!palavraFoiSelecionada) {
    gerenciarPalavraSecretaUI(dados_jogo)
    // popularSelectPalavras(dados_jogo.palavras, dados_jogo, dados_jogo.salaId)
  } else {
    // --- Fase de Jogo (chute) ---
    const palavraSecretaContainer = document.getElementById(
      'palavra-secreta-container'
    )
    if (palavraSecretaContainer) {
      palavraSecretaContainer.style.display = 'none'
    }

    // Criar spans iniciais SE NÃO EXISTIR
    const containerSpans = document.getElementById('container-spans-palavra')
    if (!containerSpans || containerSpans.children.length === 0) {
      criarSpansIniciais(dados_jogo.palavra_secreta)
    }

    //Atualizar os spans com as letras já chutadas (caso já tenha alguma no dado_jogo)
    atualizarSpansDaForca(
      dados_jogo.palavra_secreta,
      dados_jogo.letras_chutadas || []
    )

    //Jogador que deve chutar agora?
    const turnoDeChuteUID = dados_jogo.turno_de_chute_uid

    //Se o UID do jogador local (deste navegador) é o mesmo do turno de chute
    if (dados_jogo.dados_jogador_local.uid === turnoDeChuteUID) {
      //Habilitar os inputs do JOGADOR LOCAL
      const palavra = dados_jogo.palavra_secreta
      if (
        jogadores.player1 &&
        jogadores.player1.uid === dados_jogo.dados_jogador_local.uid
      ) {
        // Vez de chutar do player1
        if (inputChutePlayer1) inputChutePlayer1.removeAttribute('disabled')
        if (buttonChutePlayer1) buttonChutePlayer1.removeAttribute('disabled')
        buttonChutePlayer1.removeEventListener('click', handleClickChute)
        buttonChutePlayer1.addEventListener(
          'click',
          (e) => {
            e.preventDefault()
            handleClickChute(e, inputChutePlayer1, palavra, dados_jogo)
          },
          { once: true }
        )
      } else if (
        jogadores.player2 &&
        jogadores.player2.uid === dados_jogo.dados_jogador_local.uid
      ) {
        //Vez de chutar do Player2
        if (inputChutePlayer2) inputChutePlayer2.removeAttribute('disabled')
        if (buttonChutePlayer2) buttonChutePlayer2.removeAttribute('disabled')

        if (buttonChutePlayer2) {
          buttonChutePlayer2.removeEventListener('click', handleClickChute)
          buttonChutePlayer2.addEventListener(
            'click',
            (e) => {
              handleClickChute(e, inputChutePlayer2, palavra, dados_jogo)
            },
            { once: true }
          )
        }
      }
    }
  }
}

export function criarModal(dadosJogadores) {
  const player1 = dadosJogadores.player1
  const player2 = dadosJogadores.player2
    ? dadosJogadores.player2
    : { nome: 'Aguarde...', pontos: 0, uid: null }

  const nomeJogador1 = player1 ? player1.nome : 'Aguardando...'
  const pontosJogador1 = player1 !== undefined ? player1.pontos : 0
  const uid1 = player1 && player1.uid ? player1.uid : null

  const nomeJogador2 = player2.nome
  const pontosJogador2 = player2.pontos
  const uid2 = player2.uid

  let modalForca = document.createElement('div')
  let palcoForca = document.createElement('div')
  palcoForca.classList.add('palco')
  palcoForca.classList.add('font-play-regular')
  palcoForca.setAttribute('id', 'forca')

  modalForca.innerHTML = `
      <div id="forca-palco-head">
        <div class="head-player-container player1" id="player1">
          <p id="nome-player1">${nomeJogador1}</p>
          <form class="forca-form" id="p1-form">
            <input type="text" class="chute-txt" id="chute-player1" maxlength="1" disabled data-uid="${uid1}"/>
            <button class="material-symbols-outlined chute-btn" id="p1-chute-btn" disabled data-uid="${uid1}">
              arrow_upward</button>
          </form>
        </div>
        <div class="placar">
          <span class="pontuacao" id="pontos-player1">${pontosJogador1}</span>
          <span style="font-size:32px">Placar</span>
          <span class="pontuacao" id="pontos-player2">${pontosJogador2}</span>
        </div>
  
        <div class="head-player-container player2" id="player2">
          <p id="nome-player2">${nomeJogador2}</p>
          <form class="forca-form" id="p2-form">
            <input type="text" class="chute-txt" id="chute-player2" maxlength="1" disabled  data-uid="${uid2}"/>
            <button class="material-symbols-outlined chute-btn" id="p2-chute-btn" disabled data-uid="${uid2}">
              arrow_upward</button>
          </form>
        </div>
      </div>
      <div class="palco-forca-image">
        <image class="forca-img" id="forca-img" src="./utils/images/forca-1.png" width=250 />
      </div>
      <div class="palco-palavra-secreta" id="palco-palavra-secreta"></div>
    `
  palcoForca.appendChild(modalForca)
  return palcoForca
}

function desativarElementos(ipts, btns) {
  ipts.forEach((ipt) => {
    ipt.setAttribute('disabled', '')
  })

  btns.forEach((btn) => {
    btn.setAttribute('disabled', '')
  })
}
