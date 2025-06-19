import eventManager from './eventManager.js'
import { renderizarForca, gerenciarInterfaceForca } from './forcaUI.js'

const dados_jogo = {}
const dados_jogador_local = { uid: null, nome: null }

eventManager.subscribe('jogador-local', (jogadorData) => {
  dados_jogador_local.uid = jogadorData.uid
  dados_jogador_local.nome = jogadorData.nome
  eventManager.publish('atualizar-titulo', 'Forca')
})

eventManager.subscribe('forca', async (salaDataInicial) => {
  dados_jogo.salaId = salaDataInicial.salaId
  dados_jogo.jogadores = salaDataInicial.jogadores
  dados_jogo.palavras = salaDataInicial.palavras
  dados_jogo.palavra_secreta = salaDataInicial.jogoData.palavra_secreta
  dados_jogo.turno_de_selecao_uid =
    salaDataInicial.jogoData.turno_de_selecao_uid
  dados_jogo.dados_jogador_local = dados_jogador_local

  renderizarForca(dados_jogo.jogadores)

  gerenciarInterfaceForca(dados_jogo)
})

eventManager.subscribe('jogadores-na-sala', async (dados) => {
  //1. Atualiza dados globais do jogo
  dados_jogo.salaId = dados.salaId
  dados_jogo.jogadores = dados.jogadores
  dados_jogo.palavras = dados.palavras
  dados_jogo.palavra_secreta = dados.jogoData.palavra_secreta
  dados_jogo.turno_de_selecao_uid = dados.jogoData.turno_de_selecao_uid
  dados_jogo.turno_de_chute_uid = dados.jogoData.turno_de_chute_uid
  dados_jogo.erros = dados.jogoData.erros
  dados_jogo.letras_chutadas = dados.jogoData.letras_chutadas
  dados_jogo.dados_jogador_local = dados_jogador_local

  //2. Re-renderiza o palco da forca com os dados atualizados de jogadores
  if (!document.getElementById('forca')) {
    renderizarForca(dados_jogo.jogadores)
  }

  //3. Atualiza o estado dos inputs de chute
  gerenciarInterfaceForca(dados_jogo)
})

eventManager.subscribe('iniciar-rodada', () => {
  const jogadores = dados_jogo.jogadores
  const turno_atual = {
    turno_chute: dados_jogo.turno_de_chute_uid,
    turno_selecao: dados_jogo.turno_de_selecao_uid
  }

  iniciarNovaRodada(jogadores, turno_atual)
})

export function handleClickChute(e, inputElement, palavra, jogoData) {
  e.preventDefault()
  const chute = inputElement.value.trim()

  if (chute === '') {
    alert('Digite uma letra para enviar o chute.')
    return
  }

  const chuteUpper = chute.toUpperCase()

  chutarLetra(chuteUpper, palavra, jogoData)
  inputElement.value = ''
}

function chutarLetra(chute, palavra, dados) {
  const eventData = {}
  eventData.palavra = palavra
  eventData.erros = dados.erros
  eventData.chutes = dados.letras_chutadas ? [...dados.letras_chutadas] : []
  eventData.jogadorLocalUid = dados_jogador_local.uid
  eventData.jogadores = dados.jogadores

  // Impedir chutes duplicados
  if (eventData.chutes.includes(chute)) {
    alert('Você já chutou com essa letra!')
    return
  }

  // Adicionar novo chute
  eventData.chutes.push(chute)

  //Publicar evento de chute para o backend, incluindo as letras chutadas e erros
  const chuteData = {
    sala: dados_jogo.salaId,
    erros: eventData.erros,
    letrasChutadas: eventData.chutes,
    jogadorLocalUid: eventData.jogadorLocalUid
  }
  eventManager.publish('chute', chuteData)

  const acertou = palavraFoiDescoberta(eventData.palavra, eventData.chutes)
  if (acertou) {
    const placar = atualizarPlacar(dados)
    const data = {
      jogo_estado: `${dados_jogador_local.nome}_acertou`,
      jogadores: eventData.jogadores,
      placar: placar
    }

    eventManager.publish('acertou', {
      dados: data,
      salaId: dados_jogo.salaId
    })
  } else if (!eventData.palavra.includes(chute)) {
    eventData.erros += 1
    eventManager.publish('errou', eventData.erros)
    if (eventData.erros === 4) {
      eventManager.publish('perdeu', {
        salaId: dados_jogo.salaId,
        jogo_estado: `${dados_jogador_local.nome}_errou`
      })
    }
  }
}

function palavraFoiDescoberta(palavra, letrasChutas) {
  return palavra
    .toUpperCase()
    .split('')
    .every((letra) => letrasChutas.includes(letra.toUpperCase()))
}

function atualizarPlacar(dados) {
  const jogadores = dados.jogadores
  const placar = {}

  Object.entries(jogadores).forEach((item, key) => {
    let placarView = document.getElementById(`pontos-player${key + 1}`)
    if (item[1].uid === dados.turno_de_chute_uid) {
      item[1].pontos++
    }
    placar[`${item[1].nome}`] = item[1].pontos
    // placarView.textContent = item[1].pontos
  })
  return placar
}

export function iniciarNovaRodada(jogadores, turnos) {
  //de jogo data só preciso de turno_seleção e turno_chute
  const novoTurno = alternarVez(jogadores, turnos)

  const novoEstadoJogo = {
    palavra_secreta: '',
    letras_chutadas: [],
    erros: 0,
    status: '',
    turno_de_chute_uid: novoTurno.turno_chute,
    turno_de_selecao_uid: novoTurno.turno_selecao
  }

  eventManager.publish('nova-rodada', {
    salaId: dados_jogo.salaId,
    jogoData: novoEstadoJogo
  })
}

function alternarVez(jogadores, turno_atual) {
  const turnos = {}
  Object.entries(jogadores).forEach((item) => {
    if (item[1].uid === turno_atual.turno_selecao) {
      turnos.turno_chute = item[1].uid
    }

    if (item[1].uid === turno_atual.turno_chute) {
      turnos.turno_selecao = item[1].uid
    }
  })
  return turnos
}

export function reiniciarJogo(e, jogadores, jogoData) {
  e.preventDefault()
  iniciarNovaRodada(jogadores, jogoData)
}
