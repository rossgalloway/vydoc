import { cliArgumentsDefault } from './types'
import { pipe, concat, toPairs, pick } from 'ramda'
import { option } from 'yargs'
import { blue } from 'chalk'
import { makeTable } from './table'

export const options = option('input', {
  alias: 'i',
  type: 'string',
  description: 'contracts dir',
  default: cliArgumentsDefault.input,
})
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'docs output dir',
    default: cliArgumentsDefault.output,
  })
  .option('vyperCompiler', {
    alias: 'vc',
    type: 'string',
    description: 'Vyper compiler path',
    default: cliArgumentsDefault.vyperCompiler,
  })
  .option('solidityCompiler', {
    alias: 'sc',
    type: 'string',
    description: 'Solidity compiler path',
    default: cliArgumentsDefault.solidityCompiler,
  })
  .option('format', {
    alias: 'f',
    type: 'string',
    description: 'ddocs format',
    default: cliArgumentsDefault.format,
  })
  .option('template', {
    alias: 't',
    type: 'string',
    description: 'template to use',
    default: cliArgumentsDefault.template,
  })
  .help()
  .alias('help', 'h')

/*
  const logo = `
███████████████████████████
█─█─█──█──█────██────█────█
█─█─██───██─██──█─██─█─██─█
█─█─███─███─██──█─██─█─████
█───███─███─██──█─██─█─██─█
██─████─███────██────█────█
███████─███████████████████
`
*/

const logo = `
███████████████████████████
█─█─█──█──█────██────█────█
█─█─██───██─██──█─██─█─██─█
      edited by Yearn
█───███─███─██──█─██─█─██─█
██─████─███────██────█────█
███████─███████████████████
`

export const printCliArguments = pipe(
  pick(Object.keys(cliArgumentsDefault)),
  toPairs,
  makeTable({ head: ['VARIABLE', 'VALUE'], colWidths: [15, 75] }),
  blue,
  concat(`${blue(logo)}\n\n`),
  console.log
)
