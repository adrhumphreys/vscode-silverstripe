"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.silverstripeCompletionProvider = void 0;
const vscode = require("vscode");
class silverstripeCompletionProvider {
    constructor(sanchez) {
        this.sanchez = sanchez;
    }
    provideCompletionItems(document, position, token) {
        return this.sanchez.snippets({
            language: document.languageId
        }).map(snippet => {
            let suggestion = new vscode.CompletionItem(snippet.suggestion.name, vscode.CompletionItemKind.Snippet);
            suggestion.insertText = new vscode.SnippetString(this.sanchez.data.comments ? snippet.suggestion.comment + snippet.suggestion.body : snippet.suggestion.body);
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
                return new vscode.TextEdit(new vscode.Range(new vscode.Position(useItem.line, 0), new vscode.Position(useItem.line, 0)), useItem.body);
            });
            return suggestion;
        });
    }
    ;
}
exports.silverstripeCompletionProvider = silverstripeCompletionProvider;
//# sourceMappingURL=silverstripeCompletionProvider.js.map