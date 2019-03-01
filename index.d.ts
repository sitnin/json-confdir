declare module "json-confdir" {
    export class ConfDirReader {
        public constructor();
        public loadJsonFile(filename: string): Promise<object>;
        public load(...dirnames: string[]): Promise<object>;
    }
}
