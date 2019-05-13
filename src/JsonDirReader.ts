export interface JsonDirReader {
    loadJsonFile(filename: string): any;
    load(...dirnames: string[]): any;
}
