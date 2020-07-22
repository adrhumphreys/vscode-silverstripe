import * as vscode from 'vscode';

export class silverstripeCompletionProvider implements vscode.CompletionItemProvider {
  private sanchez;

  public constructor(sanchez) {
    this.sanchez = sanchez;
  }

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]>{
    return this.sanchez.snippets({
      scope: true,
      language: document.languageId,
      prefix: true
    }).map(snippet => {
      let suggestion = new vscode.CompletionItem(
        snippet.suggestion.name,
        vscode.CompletionItemKind.Snippet
      )

      suggestion.filterText = snippet.conditions.prefix;
      suggestion.sortText = snippet.conditions.prefix;

      suggestion.insertText = new vscode.SnippetString(
        this.sanchez.data.comments ? snippet.suggestion.comment + snippet.suggestion.body : snippet.suggestion.body
      );

      suggestion.detail = snippet.suggestion.information;

      suggestion.documentation = [
        snippet.suggestion.information,
        snippet.suggestion.description,
        snippet.suggestion.url
      ].join('\n\n');

      suggestion.command = {
        command: 'silverstripe.injectUseItems',
        title: 'Inject use items',
        arguments: [
          snippet.suggestion.useItems
        ]
      };

      return suggestion;
    })
  };
}
