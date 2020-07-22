import * as vscode from 'vscode';
import { silverstripeCompletionProvider } from './silverstripeCompletionProvider';
import { silverstripeDefinitionProvider } from './silverstripeDefinitionProvider';

const Enginez = require('silverstripe-sanchez');
let sanchez = null;

export function activate(context: vscode.ExtensionContext) {
  let paths = []
  if (vscode.workspace.workspaceFolders) {
    paths = vscode.workspace.workspaceFolders.map(workspace => {
      if ('uri' in workspace) {
        return workspace.uri.path;
      }
    })
  }

  const config = vscode.workspace.getConfiguration('SilverStripe');

  let vsconfig = {
    comments: config.get('comments'),
    useItems: config.get('useItems')
  };

  // if null use `.silverstripe_sanchez` file config if available either in
  // the home directory or active project
  if (vsconfig.comments === 'null') {
    delete vsconfig.comments
  };

  // if null use `.silverstripe_sanchez` file config if available either in
  // the home directory or active project
  if (vsconfig.useItems === 'null') {
    delete vsconfig.useItems
  };

  sanchez = new Enginez({
    // .silverstripe_sanchez
    configPaths: paths,
    // composer.lock
    composerPaths: paths,
    // package-lock.json
    nodePaths: paths,
    // VsCode settings override .silverstripe_sanchez
    config: vsconfig
  });

  // Output snippet count incase of future issues,
  // may remove in future if happy we don't have
  // more issues.
  const foundSnippets = sanchez.snippets({
    prefix: true,
    scope: true,
    language: true
  }).length
  const totalSnippets = sanchez.allSnippets.length

  vscode.window.showInformationMessage(
    `${foundSnippets} Silverstripe snippets available from a total of ${totalSnippets} found.`,
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: 'file', language: 'php' },
        { scheme: 'untitled', language: 'php' },
        { scheme: 'file', language: 'yaml',  },
        { scheme: 'file', language: 'silverstripe' }
      ],
      new silverstripeCompletionProvider(sanchez),
      '.'
    )
  )
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'silverstripe.injectUseItems',
      (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, useItems: []) => {
        // Get a list of locations to safely apply use items from sanchez.
        // Then insert in the given locations.
        sanchez.getUseItemLoc({
          // Pass through the current editor view contents.
          text: textEditor.document.getText(),
          // Pass the useItems set specified in the suggestion.
          useItems: useItems
        }).forEach(useItem => {
          edit.insert(
            new vscode.Position(useItem.line, 0),
            useItem.body
          )
        })
      }
    )
  )
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { scheme: "file", language: "silverstripe" },
      new silverstripeDefinitionProvider(sanchez)
    )
  )
}

export function deactivate() {
  sanchez = null;
}
