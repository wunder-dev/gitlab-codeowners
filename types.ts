import type { IToken } from "npm:ebnf@1.9.1";

export type Codeowners = IToken & {
  type: 'codeowners'
  children: CodeownersLine[]
}

export type CodeownersLine = IToken & {
  type: 'line'
  children: (CodeownersSection | CodeownersRule | CodeownersComment)[]
}

export type CodeownersRule = IToken & {
  type: 'rule'
  children: [CodeownersFile] | [CodeownersFile, CodeownersOwners]
}

export type CodeownersFile = IToken & {
  type: 'file'
  children: []
}

export type CodeownersOwners = Omit<IToken, "type"> & {
  type: 'owners'
  children: CodeownersOwner[]
}

export type CodeownersOwner = IToken & {
  type: 'owner'
  children: (CodeownersName | CodeownersSubgroup | CodeownersEmail)[]
}

export type CodeownersName = Omit<IToken, "type"> & {
  type: 'name'
  children: []
}

export type CodeownersSubgroup = IToken & {
  type: 'subgroup'
  children: []
}

export type CodeownersEmail = IToken & {
  type: 'email'
  children: []
}

export type CodeownersSection = Omit<IToken, "children"> & {
  type: 'section'
  children: (CodeownersOptional | CodeownersName | CodeownersSectionLabel | CodeownersSectionApprovals | CodeownersOwners)[]
}

export type CodeownersSectionLabel = Omit<IToken, "type"> & {
  type: 'label'
  children: []
}

export type CodeownersSectionApprovals = Omit<IToken, "type"> & {
  type: 'approvals'
  children: []
}

export type CodeownersOptional = Omit<IToken, "type"> & {
  type: 'optional'
  children: []
}

export type CodeownersComment = Omit<IToken, "type"> & {
  type: 'comment'
  children: CodeownersText[]
}

export type CodeownersText = Omit<IToken, "type"> & {
  type: 'text'
}
