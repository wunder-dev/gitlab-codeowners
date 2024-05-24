/**
 * @module 
 * 
 * This module contains functions to parse CODEOWNERS files.
 * 
 * @example
 * ```typescript
 * import {parseCodeowners} from 'https://deno.land/x/codeowners/mod.ts'
 * const [defaultSection] = parseCodeowners('* @owner1 @owner2')
 * console.log(defaultSection.rules) // [{glob: '*', owners: ['@owner1', '@owner2']}]
 * ```
 */
export {parseCodeowners} from './main.ts'
export type {Codeowners, CodeownersSection, CodeownersRule, CodeownersOwner, CodeownersFile, CodeownersName, CodeownersSubgroup, CodeownersEmail, CodeownersSectionLabel, CodeownersSectionApprovals, CodeownersOptional, CodeownersComment} from './types.ts'
