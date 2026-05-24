const vscode = require("vscode");

const MAX_SEARCH_LENGTH = 524288;

/** VS Code multiline find runs on LF-joined text; CRLF in the query breaks matches on Windows. */
function normalizeLineEndings(text) {
    if (!text.includes("\r")) {
        return text;
    }
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

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

            const searchString = normalizeLineEndings(editor.document.getText(selection));
            if (!searchString || searchString.length >= MAX_SEARCH_LENGTH) {
                await vscode.commands.executeCommand("actions.find");
                return;
            }

            // Collapse to the *start* of the selection (not active/end). VS Code searches
            // forward from the cursor; with active at the bottom, a unique block (e.g. a
            // Python docstring) shows 0 matches even though the find box has the right text.
            const findStart = selection.start;
            editor.selection = new vscode.Selection(findStart, findStart);

            await vscode.commands.executeCommand("editor.actions.findWithArgs", {
                searchString,
                isRegex: false,
                matchWholeWord: false,
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
