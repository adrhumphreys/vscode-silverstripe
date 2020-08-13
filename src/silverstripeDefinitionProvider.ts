import * as vscode from 'vscode';
import * as path from 'path';

export class silverstripeDefinitionProvider implements vscode.DefinitionProvider {
  private sanchez;

  public constructor(sanchez) {
    this.sanchez = sanchez;
  }

  public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
    const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
    const root = workspace ? workspace.uri : document.uri;
    const range = document.getWordRangeAtPosition(position, /include \S*|themed(?:CSS|Javascript)\(["']+\S*["']+\)/);
    const text = document.getText(range);
    let parts = [];

    if (text.startsWith('include')) {
      parts = text.split(' ')
    }

    if (text.startsWith('themedCSS')) {
      parts = text.match(/\(["']+(.*)["']+\)/)
      parts[0] = 'themedCSS'
    }

    if (text.startsWith('themedJavascript')) {
      parts = text.match(/\(["']+(.*)["']+\)/)
      parts[0] = 'themedJavascript'
    }

    const definitionPath = this.sanchez.getDefinitionPath({
      type: parts[0],
      definition: parts[1]
    });

    if (!definitionPath) {
      return null;
    }

    return new vscode.Location(
      root.with({
          path: path.join(definitionPath)
      }),
      new vscode.Position(0, 0)
    );
  };
}
