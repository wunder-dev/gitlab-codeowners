import { Grammars, Parser } from "npm:ebnf@1.9.1";
import type { Codeowners, CodeownersOwner } from "./types.ts";

const decoder = new TextDecoder("utf-8");
const grammar = decoder.decode(Deno.readFileSync("./codeowners.bnf"));

const RULES = Grammars.W3C.getRules(grammar);
const codeownersParser = new Parser(RULES, { debug: false });

/**
 * Represents a single rule in a CODEOWNERS file
 * @property glob - The glob pattern to match files
 * @property owners - The owners of the files
 */
type CodeownersRule = {
  glob: string;
  owners: string[];
};

/**
 * Represents a single section in a CODEOWNERS file
 * @property name - The name of the section
 * @property label - The label of the section
 * @property optional - Whether the section is optional
 * @property approvers - The number of approvers required
 * @property owners - The owners of the section
 * @property rules - The rules of the section
 */
type CodeownersSection = {
  name: string;
  label?: string;
  optional: boolean;
  approvers: number;
  owners: string[];
  rules: CodeownersRule[];
};

const newDefaultSection = () => ({
  name: "default",
  approvers: 1,
  optional: false,
  owners: [],
  rules: [],
} as CodeownersSection);

const processOwner = (owner: CodeownersOwner): string | null => {
  if (owner.children.length === 0) return null;
  return `${owner.text}`;
};

const processOwners = (owners: CodeownersOwner[]): string[] => {
  return owners.map(processOwner).filter(Boolean) as string[];
};

/**
 * Parses GitLab CODEOWNERS file into a list of sections with rules
 * @param codeownersString
 * @returns CodeownersSection[]
 */
export const parseCodeowners = (
  codeownersString: string,
): CodeownersSection[] => {
  const ast = codeownersParser.getAST(codeownersString) as Codeowners;
  const sections: CodeownersSection[] = [];

  for (const line of ast.children) {
    if (line.type !== "line") throw new Error(`Expected line got ${line.type}`);
    for (const item of line.children) {
      switch (item.type) {
        case "comment":
          break;
        case "rule": {
          const [glob, owners] = item.children;
          const rule: CodeownersRule = {
            // Replace escaped characters
            glob: glob.text.replace(/\\#/g, "#").replace(/\\\s/g, " "),
            owners: owners ? processOwners(owners.children) : [],
          };
          if (sections.length === 0) {
            sections.push(newDefaultSection());
          }
          sections.at(-1)?.rules.push(rule);

          break;
        }
        case "section": {
          const newSection = newDefaultSection();
          for (const sectionItem of item.children) {
            switch (sectionItem.type) {
              case "optional":
                newSection.optional = true;
                break;
              case "label":
                newSection.label = sectionItem.text;
                break;
              case "approvals":
                newSection.approvers = Number.parseInt(sectionItem.text);
                break;
              case "owners":
                newSection.owners = processOwners(sectionItem.children);
                break;
              case "name":
                newSection.name = sectionItem.text.toLowerCase();
                break;
            }
          }
          sections.push(newSection);
          break;
        }

        default:
          throw new Error(`Unexpected type ${item}`);
      }
    }
  }
  return sections;
};

if (import.meta.main) {
  const testFile = Deno.readFileSync("./samples/codeowners");
  const sections = parseCodeowners(decoder.decode(testFile));
  console.log(sections);
}
