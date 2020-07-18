import * as vscode from 'vscode';
import { silverstripeCompletionProvider } from './silverstripeCompletionProvider';

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
  vscode.window.showInformationMessage([
    sanchez.snippets({
      prefix: true,
      scope: true,
      language: true
    }).length,
    'Silverstripe snippets available from a total of ',
    sanchez.allSnippets.length,
    'found.'
  ].join(' '));

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: "file", language: "php" },
        { scheme: "untitled", language: "php" },
        { scheme: "file", language: "yaml",  },
        { scheme: "file", language: "silverstripe" }
      ],
      new silverstripeCompletionProvider(sanchez),
      '.'
    )
  )
}

export function deactivate() {
  sanchez = null;
}
