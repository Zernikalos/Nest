/** File system access for reading/writing project or export files. Optional; not used by default runtime. */
export interface FileSystemPort {
    readFile(path: string): Promise<Uint8Array>;
    writeFile(path: string, data: Uint8Array): Promise<void>;
    exists(path: string): Promise<boolean>;
}
