const vscode = require("vscode");

const MAX_SEARCH_LENGTH = 524288;

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("multilineFind.open", async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                await vscode.commands.executeCommand("actions.find");
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                await vscode.commands.executeCommand("actions.find");
                return;
            }

            const searchString = editor.document.getText(selection);
            if (!searchString || searchString.length >= MAX_SEARCH_LENGTH) {
                await vscode.commands.executeCommand("actions.find");
                return;
            }

            // Collapse selection before opening find so search is not scoped to it.
            const anchor = selection.active;
            editor.selection = new vscode.Selection(anchor, anchor);

            await vscode.commands.executeCommand("editor.actions.findWithArgs", {
                searchString,
                isRegex: false,
                findInSelection: false,
            });
        }),
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
