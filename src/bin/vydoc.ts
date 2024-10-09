#!/usr/bin/env node

import { pipe, tap } from 'ramda'
import { CliArguments } from '../types'
import { options, printCliArguments } from '../args'
import { getRecursiveFilesByExtensions } from '../utils'
import { blue } from 'chalk'
import { compileContracts } from '../compile'
import { generateDocs } from '../generate'

const contractFileExtentions = ['vy', 'sol']

;(async (argv: CliArguments) =>
  pipe(
    tap(printCliArguments),
    () => getRecursiveFilesByExtensions(argv.input, contractFileExtentions),
    tap(() => console.log(blue('\nCompiling contracts...'))),
    async (filePaths) =>
      await compileContracts(
        argv.input,
        filePaths,
        argv.vyperCompiler,
        argv.solidityCompiler
      )
        .then(tap(() => console.log(blue('\nGenerate docs...'))))
        .then((contracts) =>
          generateDocs(argv.format, argv.output, contracts, argv.template)
        )
  )(argv))(options.argv)
