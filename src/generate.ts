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
) => {
  console.log('generateDocs called with:', {
    format,
    output,
    contracts,
    templatePath,
  }) // Added logging

  return cond<Format, any>([
    [
      equals('markdown'),
      () => {
        console.log('Generating markdown...') // Added logging
        return generateMarkDown(contracts, output, templatePath)
      },
    ],
    [
      T,
      () => {
        console.error('Invalid format:', format) // Added logging
        throw new Error('invalid format')
      },
    ],
  ])(format)
}

const generateMarkDown = async (
  contracts: { fileName: string; data: Contract }[],
  output: string,
  templatePath: string
) => {
  console.log('generateMarkDown called with:', {
    contracts,
    output,
    templatePath,
  }) // Added logging

  return pipe(
    (path: string) => {
      console.log('Reading template from:', path) // Added logging
      return readFileSync(path)
    },
    (buffer) => {
      console.log('Template read successfully') // Added logging
      return buffer.toString()
    },
    (templateString) => {
      console.log('Compiling template') // Added logging
      return ejs.compile(templateString)
    },
    (template) => {
      console.log('Generating markdown for contracts') // Added logging
      return pipe((handler: () => void) =>
        contracts
          .map(
            tap((contract) => {
              const dir = join(output, contract.fileName, '..')
              console.log('Creating directory:', dir) // Added logging
              mkdirSync(dir, { recursive: true })
            })
          )
          .map(
            tap((contract) => {
              const filePath = join(output, contract.fileName)
                .replace(/\.[^.]+$/, '.md')
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase()
              console.log('Writing markdown to:', filePath) // Added logging
              writeFileSync(filePath, template(contract).toString())
            })
          )
          .map(tap(handler))
      )(makeProgressBar(contracts.length))
    }
  )(templatePath)
}
