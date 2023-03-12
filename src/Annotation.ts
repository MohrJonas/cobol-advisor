import Line from "./Line";
import AnnotatedLine from "./AnnotatedLine";
import { Diagnostic } from "vscode";

abstract class Annotation {

	constructor(protected text: string) {}

    /**
     * Check the document for diagnostic errors / warnings
     * @param line The line directory below the annotation
     * @param lines All lines of the document
     */
    abstract checkDocument(line: Line, lines: Array<AnnotatedLine>): Diagnostic[];

}

export default Annotation;
