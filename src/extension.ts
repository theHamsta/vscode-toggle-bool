import * as vscode from 'vscode';

const hasActiveSelections = (editor: vscode.TextEditor): boolean => {
  if (editor.selections.length > 1) {
    return true;
  }
  return !editor.selection.isEmpty;
};

const swapText = (textBlob: string) : string => {
  const findAndReplace = (textBlob, mapObj) => {
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    const textBlobWithReplacements = textBlob.replace(
      re,
      matched => mapObj[matched],
    );
    return textBlobWithReplacements;
  };
  const boolish = {
    true: false,
    false: true,
    0: 1,
    1: 0,
    yes: 'no',
    no: 'yes',
    on: 'off',
    off: 'on',
  };
  return findAndReplace(textBlob, boolish);
};

const swapBoolFromSelection = (editor: vscode.TextEditor) : void => {
  const selectedText = editor.document.getText(editor.selection);
  const newText = swapText(selectedText);
  editor.edit(e => {
    editor.selections.forEach(selection => e.replace(selection, newText));
  });
};

const swapBoolFromCursor = (editor: vscode.TextEditor) : void => {
  const { end } = editor.selection;
  const wordRange = editor.document.getWordRangeAtPosition(end);
  const wordUnderCursor = editor.document.getText(wordRange);
  const newWordUnderCursor = swapText(wordUnderCursor);
  editor.edit(e => {
    e.replace(wordRange, newWordUnderCursor);
  });
};

export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  let disposable = vscode.commands.registerCommand(
    'extension.toggleBool',
    () => {
      //  executed every time the command is executed
      if (!editor) return;
      if (hasActiveSelections(editor)) {
        swapBoolFromSelection(editor);
      } else {
        swapBoolFromCursor(editor);
      }
    },
  );
  context.subscriptions.push(disposable);
}

// method called when extension is deactivated
export function deactivate() {}
