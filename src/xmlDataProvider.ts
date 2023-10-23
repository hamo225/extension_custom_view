import * as vscode from "vscode";

interface XmlDataItem {
    label: string;
    line: number;
    column: number;
}

class DataProvider {
    private xmlData: XmlDataItem[];
    private _onDidChangeTreeData: vscode.EventEmitter<void>;

    public onDidChangeTreeData: vscode.Event<void>;

    constructor(xmlData: XmlDataItem[]) {
        this.xmlData = xmlData;
        this._onDidChangeTreeData = new vscode.EventEmitter<void>();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element: XmlDataItem): vscode.TreeItem {
        console.log("Getting tree item for:", element);
        const treeItem = new vscode.TreeItem(element.label);
        treeItem.command = {
            command: "nichtamtlichesInhaltsverzeichnis.navigateToLine",
            title: "Navigate to Line",
            arguments: [element.line, element.column],
        };

        return treeItem;
    }

    getChildren(element?: XmlDataItem): XmlDataItem[] {
        if (!element) {
            console.log("Getting root children:", this.xmlData);
            return this.xmlData;
        }
        console.log("Getting children for:", element);
        return [];
    }

    updateData(newData: XmlDataItem[]): void {
        this.xmlData = newData;
        this._onDidChangeTreeData.fire();
    }
}

export { DataProvider };
