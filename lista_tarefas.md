Estrutura HTML

1. Estrutura Modal Genérica

**Objetivo**: Criar uma estrutura HTML básica da modal que será usada para exibir o conteúdo de cada jogo.

*Elementos*:<br>
  [X] Um *div* container principal para a modal `modal-container`<br>
  [X] Um *div* interno para o conteúdo do jogo `modal-content`<br>
  [X] Um local para exibir o nome dos jogadores (um `h3`ou `span`)<br>
  [X] Um local para exibir o placar (um `div`ou `p`)<br>
  [X] O botão para fechar a modal `close-modal`
***

2. Estrutura específica para o Tabuleiro `Forca`:

**Objetivo**: Definir o layout HTML dentro da `modal-content` para o jogo da Forca.

*Elementos*:<br>
  [X] Um div para exibir a palavra secreta (com underscores para letras não descobertas).<br>
  [X] Um local para as letras chutadas (incorretas)<br>
  [X] Um local para exibir o desenho da forca (pode ser texto, SVG ou imagem, atualizando conforme erros).<br>
  [X] Um input de texto para o jogador digitar um palpite de letra.<br>
  [X] Um botão para enviar o palpite.<br>
  [X] Um input e um botão para enviar palavra secreta, no caso de o jogo ser com palavras dos usuários
***

3. Estrutura específica para o Tabuleiro `Jokenpo`

  **Objetivo**: Definir o layout HTML dentro da `modal-content` para o jogo Jokenpo.

  *Elementos*:<br>
  [ ] Um local para exibir o nome de cada jogador.<br>
  [ ] Um local para cada jogador escolher sua jogada (botões para `Pedra`, `Papel` e `Tesoura`).<br>
  [ ] Um local para exibir a escolha de cada jogador na rodada atual.<br>
  [ ] Um local para exibir o resultado da rodada (quem venceu ou empate).<br>
***

4. Estrutura específica para o Tabuleiro Tit-Tac_Toe

**Objetivo**: Definir o layout HTML dentro da `modal-content` para o jogo Tic-Tac-Toe

*Elementos*:<br>
  [ ] Um div representando o tabuleiro (uma grade 3x3).<br>
  [ ] Nove elementos (podem ser `divs` ou `botões`) dentro do tabuleiro, representando cada célula.<br>
  [ ] Um local para indicar de quem é a vez de jogar.<br>
  [ ] Um local para exibir o vencedor (se houver).<br>
***

5. Funções JavaScript para Manipular Interface da `Forca`:

**Objetivos**: Criar as funções para atualizar dinamicamente o tabuleiro da Forca com os dados do `Firebase`

*Funções*:<br>
  [X] Função para exibir a palavra secreta (um card com borda).<br>
  [ ] Função para exibir as letras chutadas.
Função para atualizar o desenho da forca com base no número de erros.<br>
  [ ] Função para capturar o palpite do jogador e enviar para o Firebase.<br>
  [ ] Função para receber atualizações do Firebase (palavra revelada, erro, fim de jogo) e atualizar a tela<br>
***

6. Funções JavaScript para Manipular a Interface do Jokenpo:

**Objetivo**: Criar as funções para atualizar dinamicamente o tabuleiro do Jokenpo.

*Funções*:<br>
  [ ] Função para permitir que o jogador faça sua escolha e envie para o Firebase.<br>
  [ ] Função para exibir a escolha de ambos os jogadores.<br>
  [ ] Função para exibir o resultado da rodada.<br>
  [ ] Função para atualizar o placar.<br>
  [ ] Função para receber atualizações do Firebase (jogadas, resultado da rodada, fim de jogo) e atualizar a tela.<br>
***

7. Funções JavaScript para Manipular a Interface do Tic-Tac-Toe:

**Objetivo**: Criar as funções para atualizar dinamicamente o tabuleiro do Tic-Tac-Toe.

*Funções*:
  [ ] Função para permitir que o jogador clique em uma célula para fazer sua jogada e envie para o Firebase.<br>
  [ ] Função para atualizar o tabuleiro na tela com as jogadas de ambos os jogadores.<br>
  [ ] Função para indicar de quem é a vez.<br>
  [ ] Função para exibir o vencedor (ou empate).<br>
  [ ] Função para receber atualizações do Firebase (jogada, vencedor, fim de jogo) e atualizar a tela.<br>
