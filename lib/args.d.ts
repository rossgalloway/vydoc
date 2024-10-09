/// <reference types="yargs" />
export declare const options: import("yargs").Argv<{
    input: string;
} & {
    output: string;
} & {
    vyperCompiler: string;
} & {
    solidityCompiler: string;
} & {
    format: "markdown";
} & {
    template: string;
}>;
export declare const printCliArguments: (x: unknown) => void;
