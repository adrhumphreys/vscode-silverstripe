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
    console.log(workspace, root, document, position);

    // const includePath = this.sanchez.getIncludePath(root, document.getText(), position); // @todo Get sanchez to index all .ss files and find the best match.
    const includePath = false

    if (!includePath) {
      return null;
    }

    return new vscode.Location(
      root.with({
          path: path.join(root.path, includePath)
      }),
      new vscode.Position(0, 0)
    );
  };
}
