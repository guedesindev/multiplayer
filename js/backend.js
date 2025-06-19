import '../utils/firebaseConfig.js'
import { getAuth, signInAnonymously } from '../utils/firebaseConfig.js'
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  get,
  set,
  push,
  update,
  child,
  onValue
} from '../utils/firebaseConfig.js'
import eventManager from './eventManager.js'

const db = getDatabase()
const auth = getAuth()
const salasRef = ref(db, 'salas')

const salaId = { id: null }

eventManager.subscribe('player-game', async (data) => {
  //data = {usuario:playerName, jogo:game }
  if (data) {
    const user = await signIn()
    user.displayName = data.usuario
    const jogoSelecionado = data.jogo

    // Evento para passar ao frontend os dados do usuário local.
    const eventData = { uid: user.uid, nome: user.displayName }
    eventManager.publish('jogador-local', eventData)

    try {
      const SalaEcnontradaId = await buscarSalaDisponivel(jogoSelecionado)
      let salaIdAtual
      salaId.id = SalaEcnontradaId

      if (SalaEcnontradaId) {
        let sala = await entrarNaSala(SalaEcnontradaId, user)
        salaIdAtual = sala
        //Listener para a sala
        setupSalaListener(salaIdAtual, jogoSelecionado)
      } else {
        // Jogador 1 criando uma nova sala
        let novaSalaId = await criarNovaSala(jogoSelecionado, user)
        salaIdAtual = novaSalaId

        // Listener para a sala
        setupSalaListener(salaIdAtual, jogoSelecionado)
      }
    } catch (error) {
      console.error('Erro no processamento da sala no backend:', error)
    }
  }
})

eventManager.subscribe('palavra-secreta', async (data) => {
  await salvarPalavra(data)
})

eventManager.subscribe('chute', async (dataChute) => {
  //dataChute = {sala: dados_jogo.salaId, erros:novosErros, letrasChutadas:novasLetrasChutadas, jogadorLocalUid: eventData.jogadorLocalUid}
  const jogoDataRef = ref(db, `salas/${dataChute.sala}/jogoData`)

  // Salvar Chute e erros
  const dataSet = {
    erros: dataChute.erros,
    letras_chutadas: dataChute.letrasChutadas
  }

  await update(jogoDataRef, dataSet)
})

eventManager.subscribe('acertou', async (dados) => {
  const jogoDataRef = ref(db, `salas/${dados.salaId}`)

  await update(jogoDataRef, dados.dados)
})

eventManager.subscribe('perdeu', async (estado) => {
  const jogoDataref = ref(db, `salas/${estado.salaId}/jogoData`)

  await update(jogoDataref, { jogo_estado: estado.jogo_estado })
})

eventManager.subscribe('nova-rodada', async (turnos) => {
  const jogoDataRef = ref(db, `salas/${turnos.salaId}`)
  await update(jogoDataRef, {
    jogoData: turnos.jogoData,
    jogo_estado: 'conectar_jogadores'
  })
})

function setupSalaListener(salaId, jogoSelecionado) {
  const salaRef = ref(db, `salas/${salaId}`)

  onValue(salaRef, async (snapshot) => {
    if (snapshot) {
      const salaData = snapshot.val()
      salaData.salaId = salaId

      if (salaData) {
        // Jogo Forca
        if (jogoSelecionado === 'forca') {
          if (salaData.estado_sala === 'aguardando_jogadores') {
            let palavras = await listarPalavras()
            salaData.palavras = palavras

            eventManager.publish(`${jogoSelecionado}`, salaData)
          }

          if (salaData.estado_sala === 'conectar_jogadores') {
            const jogoPalavras = await listarPalavras()
            salaData.palavras = jogoPalavras

            eventManager.publish('jogadores-na-sala', salaData)
          }

          if (salaData.jogoData.erros) {
            eventManager.publish('errou', salaData.jogoData.erros)
          }

          if (
            salaData.jogo_estado &&
            salaData.jogo_estado.includes('acertou')
          ) {
            eventManager.publish('fim-rodada', salaData.jogo_estado)
          }

          if (salaData.placar && salaData.jogo_estado.includes('acertou')) {
            eventManager.publish('alterar-placar', salaData.jogadores)
          }

          if (salaData.jogo_estado) {
            if (salaData.jogoData.status === '') {
              eventManager.publish('reset-front', null)
            }
          }

          if (salaData.jogo_estado && salaData.jogo_estado.includes('errou')) {
            eventManager.publish('fim-rodada', salaData.jogo_estado)
          }
        }

        if (jogoSelecionado === 'jokenpo') {
          console.log('Criar a lógica para Jokenpo')
        }

        if (jogoSelecionado === 'tictactoe') {
          console.log('Criar lógica para TicTacToe')
        }
        //Evento Genérico
      }
    }
  })
}

// Funções Firebase
async function signIn() {
  let data = await signInAnonymously(auth)
  if (data) {
    return data.user
  }
}

async function criarNovaSala(jogo, user) {
  const novaSalaRef = await push(ref(db, 'salas')) // Gera um ID único para a nova sala
  const novaSalaId = novaSalaRef.key
  const novoJogadorNome = user.displayName
  const novoJogadorId = user.uid
  const estadoInicial = 'aguardando_jogadores'
  const jogoEstadoCombinado = `${jogo}_${estadoInicial}`

  const jogadores = {}
  jogadores['player1'] =
    jogo !== 'TicTacToe'
      ? { uid: novoJogadorId, nome: novoJogadorNome, pontos: 0 }
      : { uid: novoJogadorId, nome: novoJogadorNome, pontos: 0, value: 'X' }

  const jogoData = {
    turno_de_selecao_uid: novoJogadorId
  }
  if (jogo === 'Forca') {
    jogoData.palavra_secreta = ''
    jogoData.erros = 0
  } else if (jogo === 'Jokenpo') {
  } else if (jogo === 'TicTacToe') {
  }

  const novaSalaData = {
    jogo: jogo,
    estado_sala: estadoInicial,
    jogo_estado: jogoEstadoCombinado,
    jogadores: jogadores,
    jogoData: jogoData,
    placar: { [novoJogadorNome]: 0 },
    created_at: Date.now()
  }

  try {
    await set(novaSalaRef, novaSalaData)
    // await atualizarEstrutura(novaSalaRef.key, jogo)
    return novaSalaId
  } catch (error) {
    console.error('Erro ao criar nova sala:', error)
    return null
  }
}

async function buscarSalaDisponivel(jogo) {
  const estadoProcurado = `${jogo}_aguardando_jogadores`
  const queryRef = query(
    salasRef,
    orderByChild('jogo_estado'),
    equalTo(estadoProcurado),
    limitToFirst(1)
  )

  try {
    let snapshot = await get(queryRef)

    if (snapshot.exists()) {
      return Object.keys(snapshot.val())[0]
    }
  } catch (error) {
    console.error('Erro ao buscar sala:', error)
  }
}

async function entrarNaSala(salaId, user) {
  const salaJogadoresRef = ref(db, `salas/${salaId}/jogadores`)
  const jogoRef = ref(db, `salas/${salaId}/jogo`)
  const novoJogadorId = user.uid // Gerar um ID único para o jogador
  const novoJogadorNome = user.displayName

  const dados_jogador_novo = {}
  dados_jogador_novo[`player2`] =
    jogoRef.key !== 'tictactoe'
      ? { uid: novoJogadorId, nome: novoJogadorNome, pontos: 0 }
      : { uid: novoJogadorId, nome: novoJogadorNome, value: 'O', pontos: 0 }

  try {
    await update(salaJogadoresRef, dados_jogador_novo)
    // Agora que atualizou é necessário verificar se a sala está cheia
    // caso esteja cheia atualizar o estado para 'em_andamento'

    const salaRef = ref(db, `salas/${salaId}/jogadores`)
    const snapshot = await get(salaRef)
    if (snapshot.exists() && Object.keys(snapshot.val()).length == 2) {
      const salaEstadoRef = ref(db, `salas/${salaId}`)
      let jogo = await get(ref(db, `salas/${salaId}/jogo`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val()
          }
        })
        .catch((error) => console.error('Erro ao obter estado do jogo:', error))

      const jogoData = {}
      jogoData['turno_de_chute_uid'] = novoJogadorId
      jogoData['erros'] = 0
      jogoData['letras_chutadas'] = []

      await update(child(salaEstadoRef, 'jogoData'), jogoData)
      await update(salaEstadoRef, {
        jogo_estado: `${jogo}_conectando_jogadores`,
        estado_sala: 'conectar_jogadores'
      })

      // Atualizar o placar
      // const placarRef = ref(db, `salas/${salaId}/placar`)
      const updatesPlacar = { [novoJogadorNome]: 0 }
      await update(child(salaEstadoRef, 'placar'), updatesPlacar)
    }
    return salaId
  } catch (error) {
    console.error('Erro ao entrar na sala:', error)
    return null
  }
}

// Lógicas para forca
async function listarPalavras() {
  let db = getDatabase()
  let palavrasRef = ref(db, 'plavras')
  let snapshot = await get(palavrasRef)
  if (snapshot.exists()) {
    let palavras = []
    Object.values(snapshot.val()).forEach((palavra) => {
      palavras.push(palavra)
    })
    return palavras
  }
  return null
}

async function salvarPalavra(dados) {
  //dados = { palavra: palavraSecreta, sala: salaId }
  let sala = dados.sala
  let palavra = dados.palavra
  let palavraRef = ref(db, `salas/${sala}/jogoData/palavra_secreta`)
  await set(palavraRef, palavra)
}
//Fim Lógicas para forca
