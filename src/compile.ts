import { join } from 'path'
import { exec } from 'child_process'
import { mergeWith, tap, head } from 'ramda'
import { pipeAsync } from 'ramda-async'
import { makeProgressBar } from './progress'
import { AbiElement, Contract, RawContract } from './types'

const customExec = async (cmd: string): Promise<string> =>
  new Promise((resolve, reject) =>
    exec(cmd, (error, stdout) => (error ? reject(error) : resolve(stdout)))
  )

export const compileContract = async (
  dirPath: string,
  fileName: string,
  compilerPath: string
) =>
  await customExec(
    `cd ${dirPath} && cd .. && ${compilerPath} -f combined_json ${join(
      dirPath,
      fileName
    )}`
  )

const transformContract = (data: any, name: string): Contract => {
  const contract = head(Object.values(data)) as RawContract
  const abiMethods: { [key: string]: AbiElement } = contract.abi
    .filter((e) => e.type === 'function' || e.type === 'constructor')
    .map((e) => ({
      ...e,
      name: e.type === 'constructor' ? '__init__' : e.name.replace(/\(.*/, ''),
    }))
    .reduce((acc, e) => ({ ...acc, [`${e.name}`]: e }), {})

  const methods: { [key: string]: any } = mergeWith(
    (a, b) => ({ ...a, ...b }),
    contract.devdoc.methods,
    contract.userdoc.methods
  )

  const methodsWithAbi = Object.keys(methods).reduce((acc, methodSignature) => {
    const methodName = methodSignature.replace(/\(.*/, '')
    const abiMethod = abiMethods[methodName]

    const method = {
      ...methods[methodSignature],
      ...(abiMethod ? abiMethod : {}),
    }

    // Include return types from the ABI
    if (abiMethod && abiMethod.outputs && abiMethod.outputs.length > 0) {
      method.returns = abiMethod.outputs.map((output, index) => {
        const name = output.name || `_output${index}`
        const type = output.type
        let description = ''

        // Retrieve descriptions from devdoc/userdoc if available
        if (method.returns) {
          if (method.returns[name]) {
            description = method.returns[name]
          } else if (method.returns[`_${index}`]) {
            description = method.returns[`_${index}`]
          } else if (method.returns['']) {
            description = method.returns['']
          }
        }

        return {
          name,
          type,
          description,
        }
      })
    }

    return {
      ...acc,
      [methodSignature]: method,
    }
  }, {})

  const r = {
    compilerVersion: data.version,
    abi: JSON.stringify(contract.abi, null, 2),
    bytecode: contract.bytecode,
    author: contract.devdoc.author,
    license: contract.devdoc.license,
    title: contract.devdoc.title,
    notice: contract.userdoc.notice,
    details: contract.devdoc.details,
    methods: methodsWithAbi,
    events: contract.abi.filter((e) => e.type === 'event'),
  }

  return r
}

export const compileContracts = async (
  dirPath: string,
  fileNames: string[],
  compilerPath: string
): Promise<{ fileName: string; data: Contract }[]> =>
  pipeAsync(
    makeProgressBar,
    async (handler) =>
      await Promise.all(
        fileNames.map(async (fileName) => ({
          fileName,
          data: await compileContract(dirPath, fileName, compilerPath)
            .then(JSON.parse)
            .then((r) => transformContract(r, fileName))
            .then(tap(handler)),
        }))
      )
  )(fileNames.length)
