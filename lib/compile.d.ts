import { Contract } from './types';
export declare const compileContract: (dirPath: string, fileName: string, vyperCompilerPath: string, solidityCompilerPath: string) => Promise<string>;
export declare const compileContracts: (dirPath: string, fileNames: string[], vyperCompilerPath: string, solidityCompilerPath: string) => Promise<{
    fileName: string;
    data: Contract;
}[]>;
