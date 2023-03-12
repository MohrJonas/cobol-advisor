import AnnotationProcessor, { Tuple } from "./AnnotationProcessor";
import { Diagnostic, ExtensionContext, languages, TextDocument, window, workspace } from "vscode";
import ScopedTo from "./annotations/ScopedTo";

export function activate(context: ExtensionContext) {

	const diagnosticsCollection = languages.createDiagnosticCollection("Cobol advisor");

	context.subscriptions.push(window.onDidChangeActiveTextEditor((editor) => {
		if (!editor || editor.document.languageId !== "COBOL") {
			return;
		}
		diagnosticsCollection.set(editor.document.uri, checkFile(editor.document));
	}));

	context.subscriptions.push(workspace.onDidChangeTextDocument((event) => {
		if (window.activeTextEditor?.document.uri !== event.document.uri) {
			return;
		}
		diagnosticsCollection.set(event.document.uri, checkFile(event.document));
	}));

	context.subscriptions.push(workspace.onDidOpenTextDocument((document) => {
		if (document.languageId !== "COBOL") {
			return;
		}
		diagnosticsCollection.set(document.uri, checkFile(document));
	}));

	context.subscriptions.push(workspace.onDidCloseTextDocument((document) => {
		diagnosticsCollection.set(document.uri, undefined);
	}));

	const document = window.activeTextEditor?.document;
	if(document) {
		checkFile(document);
	}
}

function checkFile(document: TextDocument): Diagnostic[] {
	const processor = new AnnotationProcessor(document, [
		new Tuple(/@ScopedTo [a-zA-Z0-9-]+ (?:section|division)./i, ScopedTo)
	]);
	const annotatedLines = processor.processDocument();
	const diagnostics = annotatedLines.map((line) => {
		return line.annotations.map(
			(annotation) => { return annotation.checkDocument(line.line, annotatedLines); }
		).flat();
	}).flat();
	return diagnostics;
}