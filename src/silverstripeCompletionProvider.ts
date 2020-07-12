import * as vscode from 'vscode';

export class silverstripeCompletionProvider implements vscode.CompletionItemProvider {
  private sanchez;

  public constructor(sanchez) {
    this.sanchez = sanchez;
  }

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]>{
    return this.sanchez.snippets({
      language: document.languageId
    }).map(snippet => {
      let suggestion = new vscode.CompletionItem(
        snippet.suggestion.name,
        vscode.CompletionItemKind.Snippet
      )

      suggestion.insertText = new vscode.SnippetString(
        this.sanchez.data.comments ? snippet.suggestion.comment + snippet.suggestion.body : snippet.suggestion.body
      );

      suggestion.detail = [
        snippet.suggestion.information,
        snippet.suggestion.description,
        snippet.suggestion.url
      ].join('\n\n');

      // Get a list of locations to safely apply use items from sanchez.
      // Then insert in the given locations.
      suggestion.additionalTextEdits = this.sanchez.getUseItemLoc({
        // Pass through the current editor view contents.
        text: document.getText(),
        // Pass the useItems set specified in the suggestion.
        useItems: snippet.suggestion.useItems
      }).map(useItem => {
        return new vscode.TextEdit(
          new vscode.Range(
            new vscode.Position(useItem.line, 0),
            new vscode.Position(useItem.line, 0)
          ),
          useItem.body
        )
      })

      return suggestion
    })
  };
}
