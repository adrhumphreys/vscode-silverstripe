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
        this.sanchez.comments ? snippet.suggestion.body + snippet.suggestion.body : snippet.suggestion.body
      );


      suggestion.documentation = snippet.suggestion.documentation;

      // Insert
      suggestion.additionalTextEdits = this.sanchez.getUseItemLoc({
        text: document.getText(),
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
