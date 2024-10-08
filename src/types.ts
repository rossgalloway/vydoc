export type CliArguments = {
  input: string
  output: string
  compiler: string
  format: Format
  template: string
}

export type Format = 'markdown'

export const cliArgumentsDefault = {
  input: './contracts',
  output: './docs',
  compiler: 'vyper',
  format: 'markdown',
  template: '../src/templates/markdown.ejs',
} as CliArguments

export type Contract = {
  compilerVersion: number
  abi: string
  bytecode: string
  author?: string
  license?: string
  title?: string
  notice?: string
  details?: string
  methods: {
    [methodSignature: string]: {
      name: string
      type: string
      inputs: {
        name: string
        type: string
        indexed?: boolean
      }[]
      outputs?: {
        name: string
        type: string
        description?: string
      }[]
      stateMutability?: string
      notice?: string
      details?: string
      params?: {
        [paramName: string]: string
      }
      returns?: {
        name: string
        type: string
        description?: string
      }[]
    }
  }
  events: AbiElement[]
}

export type RawContract = {
  abi: AbiElement[]
  bytecode: string
  devdoc: {
    author: string
    license: string
    title: string
    notice: string
    details: string
    methods: {
      [key: string]: {
        details: string
      }
    }
  }
  userdoc: {
    notice: string
    methods: {
      [key: string]: {
        notice: string
      }
    }
  }
}

export type AbiElement = {
  name: string
  type: 'event' | 'function' | 'constructor'
  inputs: {
    name: string
    type: string
    indexed?: boolean
  }[]
  outputs?: {
    name: string
    type: string
  }[]
  stateMutability?: string
}
