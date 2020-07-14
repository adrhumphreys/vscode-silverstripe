import * as vscode from 'vscode';
import { silverstripeCompletionProvider } from './silverstripeCompletionProvider';

const Enginez = require('silverstripe-sanchez');
let sanchez = null;

export function activate(context: vscode.ExtensionContext) {
  const paths = vscode.workspace.workspaceFolders.map(workspace => {
    return workspace.uri.path
  })

  const config = vscode.workspace.getConfiguration('SilverStripe')

  let vsconfig = {
    comments: config.get('comments'),
    useItems: config.get('useItems')
  };

  // if null use `.silverstripe_sanchez` file config if availble either in
  // the home directory or acitve project
  if (vsconfig.comments === 'null') {
    delete vsconfig.comments
  };

  // if null use `.silverstripe_sanchez` file config if availble either in
  // the home directory or acitve project
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
