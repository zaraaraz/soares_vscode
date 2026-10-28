// Helpers sem dependência do vscode, para se poderem testar só com node.

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

const BLAME = [
  'o teu eu do passado, que te odeia',
  'tu, às 3h da manhã',
  'o Stack Overflow (copiado sem ler)',
  'o estagiário que já se foi embora',
  'ninguém sabe, e o git blame recusa-se a dizer',
];

const TRIGGERS = {
  TODO: 'Ambos sabemos que nunca vais fazer isto.',
  'console.log': 'Debugger? Nunca ouvi falar.',
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

const pick = list => list[Math.floor(Math.random() * list.length)];

const isJoke = line => /^\s*(\/\/?|#)\s*joke\s*$/i.test(line);

function comment(languageId, text) {
  const [open, close] = COMMENTS.find(c => c[2].split(' ').includes(languageId)) || ['// ', ''];
  return open + text + close;
}

// Só dispara quando a palavra acabou de ser escrita, senão cada tecla numa linha com TODO dava spam.
function trigger(textBeforeCursor) {
  for (const word in TRIGGERS) if (textBeforeCursor.endsWith(word)) return TRIGGERS[word];
}

module.exports = { JOKES, BLAME, pick, isJoke, comment, trigger };
