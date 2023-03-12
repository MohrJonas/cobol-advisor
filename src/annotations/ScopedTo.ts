import { every, some } from "lodash";
import { Diagnostic, Position, Range } from "vscode";
import AnnotatedLine from "../AnnotatedLine";
import Annotation from "../Annotation";
import Line from "../Line";

export default class ScopedTo extends Annotation {

	//private static readonly annotationRegex = /@ScopedTo ([a-zA-Z0-9-]+ (?:section|division).)/gi;
	private static readonly annotationRegex = /@ScopedTo (.*)/gi;
	private static readonly variableRegex = /\W*\d{2}\W+([a-zA-Z0-9-]+).+\./gi;

	checkDocument(line: Line, lines: AnnotatedLine[]): Diagnostic[] {
		const variableName = this.parseVariableName(line.text);
		const sectionNames = this.parseSectionNames(this.text);
		if (!variableName || !sectionNames) return [];
		const usages = this.getAllUsagesOf(variableName, lines);
		const invalidUsages = usages.filter((usage) => {
			const foundSectionName = this.getSectionName(usage, lines);
			return foundSectionName && 
				every(sectionNames, (sectionName) => { return !foundSectionName?.includes(sectionName); });
		});
		return invalidUsages.map((usage) => {
			return new Diagnostic(
				new Range(
					new Position(usage.line.lineNumber, 0),
					new Position(usage.line.lineNumber, usage.line.text.length - 1)
				),
				`"${variableName}" is scoped to "${sectionNames}" (line ${line.lineNumber + 1})`
			);
		});
	}

	private parseVariableName(text: string): string | undefined {
		return Array.from(text.matchAll(ScopedTo.variableRegex))[0][1];
	}

	private parseSectionNames(text: string): Array<string> | undefined {
		const unparsedParameters = Array.from(text.matchAll(ScopedTo.annotationRegex))[0][1];
		return unparsedParameters.split(",").map((part) => { return part.trim(); });

	}

	private getAllUsagesOf(text: string, lines: Array<AnnotatedLine>): Array<AnnotatedLine> {
		return lines.filter((line) => { return line.line.text.includes(text) && !/pic/gmi.test(line.line.text); });
	}

	private getSectionName(line: AnnotatedLine, lines: Array<AnnotatedLine>): string | undefined {
		for (let i = line.line.lineNumber; i >= 0; i--) {
			if (this.isSectionHeading(lines[i])) {
				return lines[i].line.text;
			}
		}
		return undefined;
	}

	private isSectionHeading(line: AnnotatedLine): boolean {
		return line.line.text.includes("section.");
	}
}