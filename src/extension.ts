import * as vscode from "vscode";
import { parsedXml, extractDocTitle } from "./xmlParser";
import { DataProvider } from "./xmlDataProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("extension working");
  const xmlDataProviderInstance = new DataProvider([]);
  vscode.window.registerTreeDataProvider(
    "nichtamtlichesInhaltsverzeichnis",
    xmlDataProviderInstance
  );

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === "xml") {
      updateCustomView();
    } else {
      // Clear the tree view if the active file isn't an XML
      xmlDataProviderInstance.updateData([]);
    }
  });

  function updateCustomView() {
    if (
      vscode.window.activeTextEditor &&
      vscode.window.activeTextEditor.document.languageId === "xml"
    ) {
      const xmlContent = vscode.window.activeTextEditor.document.getText();
      parsedXml(xmlContent)
        .then((parsedXml: any) => {
          const docTitle = extractDocTitle(parsedXml);
          if (docTitle) {
            xmlDataProviderInstance.updateData([docTitle]);
          } else {
            xmlDataProviderInstance.updateData([]); // Clear the tree view
          }
        })
        .catch((error: any) => {
          console.error("Error parsing XML:", error);
        });
    }
  }

  updateCustomView();

  // navigation command
  let navigateToLineCommand = vscode.commands.registerCommand(
    "nichtamtlichesInhaltsverzeichnis.navigateToLine",
    (line, column) => {
      if (vscode.window.activeTextEditor) {
        let editor = vscode.window.activeTextEditor;
        let range = editor.document.lineAt(line).range;

        editor.selection = new vscode.Selection(range.start, range.end);
        editor.revealRange(range);
      }
    }
  );

  context.subscriptions.push(navigateToLineCommand);

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === "xml") {
      updateCustomView();
    }
  });
}

export function deactivate() {
  // add comment so no warning
}
