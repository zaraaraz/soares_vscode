// Helpers sem dependência do vscode, para se poderem testar só com node.

// String.raw com a primeira e a última linha vazias → lista de linhas
const art = s => s.split('\n').slice(1, -1);

const JOKES = [
  'Há 10 tipos de pessoas: as que percebem binário e as que não percebem.',
  'Porque é que os programadores confundem o Halloween com o Natal? Porque OCT 31 == DEC 25.',
  'Pediram a um programador: traz um pão e, se houver ovos, traz 6. Voltou com 6 pães.',
  'Funciona na minha máquina. Ótimo, então vamos pôr a tua máquina em produção.',
  '99 bugs no código. Corriges um. 127 bugs no código.',
  'O que grita um programador a afogar-se? F1! F1!',
  'Há 2 coisas difíceis em programação: invalidar cache, dar nomes às coisas e erros off-by-one.',
  'O melhor colega de equipa é o pato de borracha. Ouve tudo e nunca faz code review.',
  'Um SQL entra num bar, aproxima-se de duas mesas e pergunta: posso fazer JOIN?',
  'Porque é que os programadores preferem o modo escuro? Porque a luz atrai bugs.',
  'git commit -m "arranjei tudo". Spoiler: não arranjou.',
  'Programar é 10% escrever código e 90% perceber porque é que não funciona.',
  'Quando escrevi isto, só eu e Deus sabíamos o que fazia. Agora só Deus sabe.',
  'Quantos programadores são precisos para mudar uma lâmpada? Nenhum, é um problema de hardware.',
  'Um programador otimista diz que o copo está meio cheio. Um pessimista diz que está meio vazio. O programador diz que o copo tem o dobro do tamanho necessário.',
  'Não é um bug, é uma funcionalidade não documentada.',
];

const EXCUSES = [
  'na minha máquina funciona.',
  'deve ser cache.',
  'ontem funcionava.',
  'foi o estagiário.',
  'é um problema do browser do cliente.',
  'é DNS. É sempre DNS.',
  'alguém mexeu no meu código.',
  'os testes passavam localmente.',
  'é uma limitação da framework.',
  'isso não é um bug, é uma feature.',
];

const EIGHT_BALL = [
  'Sim, faz deploy.',
  'Nem pensar.',
  'Pergunta ao estagiário.',
  'Talvez, se rezares.',
  'Os sinais apontam para um rollback.',
  'Tenta outra vez depois do café.',
  'Sem dúvida. (Mas faz backup.)',
  'Não contes com isso.',
];

const FORTUNES = [
  'o código mais rápido é o que não escreves.',
  'se funciona, não lhe toques.',
  'um bug corrigido hoje são dois amanhã.',
  'comenta o porquê, não o quê.',
  'nunca confies num commit chamado "pequena alteração".',
  'o teu eu do futuro vai ler isto. Sê simpático.',
  'não há nada mais permanente do que uma solução temporária.',
];

const MOTIVATION = [
  'Acredita em ti. O compilador não acredita.',
  'Cada erro é uma oportunidade de visitar o Stack Overflow.',
  'Hoje é um bom dia para não partir produção.',
  'Tu consegues! Provavelmente.',
  'Os grandes programadores também copiam código. Só copiam melhor.',
  'Respira fundo. É só um ponto e vírgula.',
];

const HEART = [
  '  *****     *****',
  ' *******   *******',
  '********* *********',
  '*******************',
  '*** S O A R E S ***',
  ' *****************',
  '   *************',
  '     *********',
  '       *****',
  '         *',
];

const SOARES = [
  ' ████   ███    ███   ████   █████   ████',
  '█      █   █  █   █  █   █  █      █',
  ' ███   █   █  █████  ████   ████    ███',
  '    █  █   █  █   █  █  █   █          █',
  '████    ███   █   █  █   █  █████  ████',
];

const COFFEE = art(String.raw`
    ( (
     ) )
  ........
  |      |]
  \      /
   \____/
SOARES precisa de café.
`);

const DRAGON = art(String.raw`
       _/\_/\_
      /  _    \___
     |  (o)       \____
     |        ________ >
      \      / VVVVVV
       \     \ ^^^^^^
        \_____\______>
Aqui há dragões. Não mexer.
`);

const CAT = art(String.raw`
 /\_/\
( o.o )
 > ^ <
Miau. Este código foi revisto pelo gato.
`);

const ROCKET = art(String.raw`
     /\
    /  \
   |    |
   | () |
   |    |
  /|    |\
 /_|____|_\
    )  (
   (    )
    )  (
Deploy à sexta-feira. Boa sorte.
`);

const TOMB = art(String.raw`
   ______________
  /              \
 /     R.I.P.     \
|                  |
|  Código antigo   |
|    DD/MM/AAAA    |
|                  |
|__________________|
`);

const PIPS = ['       ', ' o     ', '   o   ', '     o ', ' o   o '];
const FACES = [[0, 2, 0], [1, 0, 3], [1, 2, 3], [4, 0, 4], [4, 2, 4], [4, 4, 4]];

const pick = list => list[Math.floor(Math.random() * list.length)];
const today = () => new Date().toLocaleDateString('pt-PT');

function dice() {
  const n = 1 + Math.floor(Math.random() * 6);
  return [' _______', '|       |', ...FACES[n - 1].map(row => `|${PIPS[row]}|`), '|_______|', `Saiu ${n}.`];
}

function help() {
  return [
    'Soares Code Helper: escreve um destes numa linha sozinha e carrega em Enter',
    ...Object.entries(COMMANDS).map(([name, [description]]) => `//${name.padEnd(12)}${description}`),
  ];
}

// nome: [descrição para o //help, desenho]
const COMMANDS = {
  help: ['esta lista', help],
  love: ['um coração a dizer SOARES', () => HEART],
  soares: ['SOARES em letras gigantes', () => SOARES],
  joke: ['uma piada de programador', () => [pick(JOKES)]],
  flip: ['virar a mesa', () => ['(╯°□°)╯︵ ┻━┻']],
  unflip: ['pôr a mesa no sítio', () => ['┬─┬ノ( º _ ºノ)']],
  shrug: ['encolher os ombros', () => ['¯\\_(ツ)_/¯']],
  lenny: ['a cara do Lenny', () => ['( ͡° ͜ʖ ͡°)']],
  coffee: ['uma chávena de café', () => COFFEE],
  dragon: ['aqui há dragões, não mexer', () => DRAGON],
  cat: ['um gato que fez code review', () => CAT],
  rocket: ['deploy à sexta-feira', () => ROCKET],
  rip: ['lápide para o código antigo', () => TOMB.map(l => l.replace('DD/MM/AAAA', today()))],
  dice: ['lança um dado', dice],
  excuse: ['uma desculpa de programador', () => ['Desculpa: ' + pick(EXCUSES)]],
  '8ball': ['a bola mágica responde', () => ['🎱 ' + pick(EIGHT_BALL)]],
  fortune: ['uma frase sábia', () => ['Sabedoria: ' + pick(FORTUNES)]],
  motivation: ['motivação (mais ou menos)', () => [pick(MOTIVATION)]],
  sign: ['assinatura com a data de hoje', () => [`Feito com ❤ e ☕ por SOARES, ${today()}`]],
  hours: ['contador de horas perdidas', () => [`Horas perdidas aqui: ${10 + Math.floor(Math.random() * 90)}. Se tentares otimizar isto e falhares, soma +1.`]],
  magic: ['não sei porque funciona, não mexer', () => ['Não sei porque é que isto funciona. Não mexer. 🪄']],
};

// [abre, fecha, languageIds]; o resto usa //
const COMMENTS = [
  ['# ', '', 'python ruby perl r shellscript yaml dockerfile makefile powershell coffeescript elixir julia toml'],
  ['-- ', '', 'sql lua haskell'],
  ['<!-- ', ' -->', 'html xml markdown'],
  ['/* ', ' */', 'css scss less'],
  ['% ', '', 'latex tex matlab erlang'],
  ["' ", '', 'vb'],
  ['REM ', '', 'bat'],
];

function comment(languageId, text) {
  const [open, close] = COMMENTS.find(c => c[2].split(' ').includes(languageId)) || ['// ', ''];
  return open + text + close;
}

// "//love", "//LOVE"... → as linhas que substituem o comando
function command(line) {
  const name = /^\s*\/\/(\w+)\s*$/.exec(line)?.[1].toLowerCase();
  if (Object.hasOwn(COMMANDS, name)) return COMMANDS[name][1]();
}

module.exports = { COMMANDS, JOKES, HEART, command, comment };
