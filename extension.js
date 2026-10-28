const vscode = require('vscode');
const { command, comment } = require('./lib');

function activate(context) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(e => {
      const editor = vscode.window.activeTextEditor;
      // e.reason = undo/redo: sem isto, desfazer um desenho voltava a desenhá-lo
      if (!editor || e.document !== editor.document || e.reason) return;

      for (const c of e.contentChanges) {
        if (!c.text.includes('\n') || c.range.start.line >= e.document.lineCount) continue;
        const line = e.document.lineAt(c.range.start.line);
        const lines = command(line.text);
        if (!lines) continue;

        const indent = line.text.slice(0, line.firstNonWhitespaceCharacterIndex);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(e.document.uri, line.range, lines.map(l => indent + comment(e.document.languageId, l)).join('\n'));
        vscode.workspace.applyEdit(edit);
      }
    }),
  );
}

module.exports = { activate };
