import { find } from "lodash";
import { EOL } from "os";
import { TextDocument } from "vscode";
import AnnotatedLine from "./AnnotatedLine";
import Annotation from "./Annotation";
import Line from "./Line";

export class Tuple<A, B> {

	constructor(public a: A, public b: B) { }

}

export default class AnnotationProcessor {

	constructor(private readonly document: TextDocument, private readonly annotations: Array<Tuple<RegExp, { new(text: string): Annotation }>>) { }

	processDocument(): AnnotatedLine[] {
		const lines = this.document
			.getText(undefined)
			.split(EOL);
		return this.processLines(lines);
	}

	processLines(lines: Array<string>): AnnotatedLine[] {
		const annotatedLines: Array<AnnotatedLine> = [];
		this.processLine(0, lines, annotatedLines);
		return annotatedLines;
	}

	processLine(index: number, lines: Array<string>, annotatedLines: AnnotatedLine[]) {
		let lineAnnotations: Array<Annotation> = [];
		if (this.isAnnotated(lines[index])) {
			const annotationText = lines[index].split("*>")[1];
			const annotationClass = find(this.annotations, (annotation) => { return annotation.a.test(annotationText); });
			if (annotationClass) {
				lineAnnotations = [new annotationClass.b(annotationText)];
			}
		}
		annotatedLines.push(new AnnotatedLine(new Line(lines[index].split("*>")[0], index, this.document), lineAnnotations));
		if (index + 1 < lines.length) {
			this.processLine(index + 1, lines, annotatedLines);
		}
	}

	private isAnnotated(line: string): boolean {
		return line.includes("*> @");
	}
}