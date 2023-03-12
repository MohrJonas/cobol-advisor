import Annotation from "./Annotation";
import Line from "./Line";

export default class AnnotatedLine {

	/**
     * @param line the line
     * @param originalLineNumber the line number in the original document, useful for displaying diagnostics in the right line 
     * @param annotations the list of annotations of the line
     */
	constructor(public line: Line, public annotations: Annotation[]) {}

}