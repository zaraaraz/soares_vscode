const vscode = require('vscode');
const { JOKES, BLAME, pick, isJoke, comment, trigger } = require('./lib');

const MIN = 60_000;
const BOOM = ['💥', '🔥', '✨', '💢'];
const FN_KINDS = [vscode.SymbolKind.Function, vscode.SymbolKind.Method, vscode.SymbolKind.Constructor];

const CONFETTI_HTML = `<!DOCTYPE html>
<body style="margin:0;overflow:hidden">
<h1 style="position:absolute;top:40%;width:100%;text-align:center;font-family:sans-serif;color:var(--vscode-foreground)">🎉 0 erros. Milagre! 🎉</h1>
<canvas id="c"></canvas>
<script>
  const c = document.getElementById('c'), ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#f44', '#4c4', '#48f', '#fd3', '#f4f', '#4ff'];
  const bits = Array.from({ length: 200 }, () => ({
    x: Math.random() * c.width, y: -Math.random() * c.height,
    vx: Math.random() * 4 - 2, vy: Math.random() * 3 + 2, a: Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  (function frame() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.a += 0.1;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
      ctx.fillStyle = b.color; ctx.fillRect(-5, -2, 10, 4);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })();
</script>`;

const say = msg => vscode.window.showInformationMessage(msg);
const warn = msg => vscode.window.showWarningMessage(msg);
const errors = uri => vscode.languages.getDiagnostics(uri).filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
const flatten = symbols => symbols.flatMap(s => [s, ...flatten(s.children || [])]);

function replace(uri, range, text) {
  const edit = new vscode.WorkspaceEdit();
  edit.replace(uri, range, text);
  vscode.workspace.applyEdit(edit);
}

function confetti() {
  const panel = vscode.window.createWebviewPanel('soares-code-helper.confetti', '🎉', { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true }, { enableScripts: true });
  panel.webview.html = CONFETTI_HTML;
  setTimeout(() => panel.dispose(), 4000);
}

function activate(context) {
  const boomType = vscode.window.createTextEditorDecorationType({});
  const lastErrors = new Map();
  let booms = [], undos = 0, lastKey = 0, streakStart = 0, lastConfetti = 0, fridayWarned = '';

  function explode(editor, pos) {
    // textDecoration com "position:absolute" é o truque do Power Mode para o emoji não empurrar o texto
    const boom = { range: new vscode.Range(pos, pos), renderOptions: { after: { contentText: pick(BOOM), textDecoration: 'none; position: absolute; top: -1em; pointer-events: none' } } };
    booms.push(boom);
    editor.setDecorations(boomType, booms);
    setTimeout(() => {
      booms = booms.filter(b => b !== boom);
      editor.setDecorations(boomType, booms);
    }, 500);
  }

  function typing() {
    const now = Date.now();
    if (now - lastKey > 10 * MIN) streakStart = now;
    lastKey = now;
    if (now - streakStart >= 120 * MIN) {
      streakStart = now;
      say('Estás há 2h a escrever sem parar. Vai beber água, humano.');
    }
  }

  function friday() {
    const d = new Date();
    if (d.getDay() === 5 && d.getHours() >= 16 && fridayWarned !== d.toDateString()) {
      fridayWarned = d.toDateString();
      warn('É sexta-feira depois das 16h. Não faças deploy. A sério.');
    }
  }

  context.subscriptions.push(
    boomType,

    vscode.workspace.onDidChangeTextDocument(e => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || e.document !== editor.document || !e.contentChanges.length) return;
      if (e.reason === vscode.TextDocumentChangeReason.Undo) {
        if (++undos === 10) {
          undos = 0;
          say('10 Ctrl+Z seguidos. Arrependido outra vez?');
        }
        return;
      }
      undos = 0;
      if (e.reason) return; // redo

      for (const c of e.contentChanges) {
        if (c.range.start.line >= e.document.lineCount) continue; // edições múltiplas que apagam linhas
        const line = e.document.lineAt(c.range.start.line);
        if (c.text.includes('\n')) {
          if (isJoke(line.text)) replace(e.document.uri, line.range, line.text.slice(0, line.firstNonWhitespaceCharacterIndex) + comment(e.document.languageId, pick(JOKES)));
          continue;
        }
        if (!c.text) continue;
        const end = c.range.start.character + c.text.length;
        const msg = trigger(line.text.slice(0, end));
        if (msg) say(msg);
        if (c.text.length !== 1) continue;

        explode(editor, new vscode.Position(line.lineNumber, end));
        typing();
      }
    }),

    // só gravações à mão, senão o auto-save avisava a cada segundo
    vscode.workspace.onWillSaveTextDocument(e => {
      if (e.reason !== vscode.TextDocumentSaveReason.Manual) return;
      const n = errors(e.document.uri);
      if (n) warn(`Gravaste com ${n} ${n === 1 ? 'erro' : 'erros'}. Corajoso.`);
    }),

    vscode.languages.onDidChangeDiagnostics(e => {
      const active = vscode.window.activeTextEditor?.document.uri.toString();
      for (const uri of e.uris) {
        const key = uri.toString(), n = errors(uri), before = lastErrors.get(key);
        lastErrors.set(key, n);
        // os erros piscam enquanto escreves; sem o intervalo mínimo havia confetti a cada linha
        if (before > 0 && n === 0 && key === active && Date.now() - lastConfetti > MIN) {
          lastConfetti = Date.now();
          confetti();
        }
      }
    }),

    vscode.window.onDidChangeActiveTextEditor(editor => editor && friday()),

    vscode.languages.registerHoverProvider([{ scheme: 'file' }, { scheme: 'untitled' }], {
      async provideHover(doc, pos) {
        const lines = [`👤 **Autor:** ${pick(BLAME)}`];
        const symbols = (await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri)) || [];
        // SymbolInformation não tem selectionRange; esses providers ficam sem a piada das funções longas
        const fn = flatten(symbols).find(s => FN_KINDS.includes(s.kind) && s.selectionRange?.contains(pos));
        const size = fn ? fn.range.end.line - fn.range.start.line + 1 : 0;
        if (size > 50) lines.push(`📜 Isto não é uma função, é um romance. (${size} linhas)`);
        return new vscode.Hover(lines.join('\n\n'));
      },
    }),
  );

  friday();
}

module.exports = { activate };
