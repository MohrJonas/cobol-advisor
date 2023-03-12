import { TextDocument } from "vscode";

export default class Line {

	/**
     * @param text the raw text string of the line
     * @param lineNumber the linenumber of the line in the document
     * @param document the document the line is a part of
     */
	constructor(public text: string, public lineNumber: number, public document: TextDocument) {}

}