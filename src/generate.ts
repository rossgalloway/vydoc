import ejs from 'ejs'
import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cond, equals, pipe, T, tap } from 'ramda'
import { makeProgressBar } from './progress'
import { Contract, Format } from './types'
import path from 'path'

export const generateDocs = async (
  format: Format,
  output: string,
  contracts: { fileName: string; data: Contract }[],
  templatePath: string
) =>
  cond<Format, any>([
    [
      equals('markdown'),
      () => generateMarkDown(contracts, output, templatePath),
    ],
    [
      T,
      () => {
        throw new Error('invalid format')
      },
    ],
  ])(format)

const generateMarkDown = async (
  contracts: { fileName: string; data: Contract }[],
  output: string,
  templatePath: string
) =>
  pipe(
    readFileSync,
    (buffer) => buffer.toString(),
    ejs.compile,
    (template) =>
      pipe((handler: () => void) =>
        contracts
          .map(
            tap((contract) =>
              mkdirSync(join(output, contract.fileName, '..'), {
                recursive: true,
              })
            )
          )
          .map(
            tap((contract) =>
              writeFileSync(
                join(output, contract.fileName).replace(/\.[^.]+$/, '.md'),
                // commented the below as it breaks any .vy files not in kebab-case
                // .replace(/([a-z])([A-Z])/g, '$1-$2')
                // .toLowerCase(),
                template(contract).toString()
              )
            )
          )
          .map(tap(handler))
      )(makeProgressBar(contracts.length))
  )(templatePath)
