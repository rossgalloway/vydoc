import { Contract, Format } from './types';
export declare const generateDocs: (format: Format, output: string, contracts: {
    fileName: string;
    data: Contract;
}[], templatePath: string) => Promise<any>;
