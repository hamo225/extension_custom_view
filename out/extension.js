"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const { parsedXml, extractDocTitle } = require("./xmlParser");
const { dataProvider } = require("./xmlDataProvider");
function activate(context) {
    console.log("extension working");
    const xmlDataProviderInstance = new dataProvider([]);
    vscode.window.registerTreeDataProvider("nichtamtlichesInhaltsverzeichnis", xmlDataProviderInstance);
    function updateCustomView() {
        if (vscode.window.activeTextEditor &&
            vscode.window.activeTextEditor.document.languageId === "xml") {
            const xmlContent = vscode.window.activeTextEditor.document.getText();
            parsedXml(xmlContent)
                .then((parsedXml) => {
                const docTitle = extractDocTitle(parsedXml);
                xmlDataProviderInstance.updateData([docTitle]);
            })
                .catch((error) => {
                console.error("Error parsing XML:", error);
            });
        }
    }
    updateCustomView();
    let disposable = vscode.commands.registerCommand("customView.helloWorld", () => {
        vscode.window.showInformationMessage("Hello World from CustomView!");
    });
    // NEW: Register the navigation command
    let navigateToLineCommand = vscode.commands.registerCommand("nichtamtlichesInhaltsverzeichnis.navigateToLine", (line, column) => {
        if (vscode.window.activeTextEditor) {
            let editor = vscode.window.activeTextEditor;
            let range = editor.document.lineAt(line).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range);
        }
    });
    context.subscriptions.push(disposable, navigateToLineCommand);
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "xml") {
            updateCustomView();
        }
    });
}
exports.activate = activate;
function deactivate() {
    // This function is intentionally left empty
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map