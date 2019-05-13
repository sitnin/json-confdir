declare module "json-confdir" {
    export class ConfDirReader {
        public constructor(throwOnError: boolean);
        public loadJsonFile(filename: string): Promise<any>;
        public load(...dirnames: string[]): any;
    }

    export class SyncDirReader {
        public constructor(throwOnError: boolean);
        public loadJsonFile(filename: string): any;
        public load(...dirnames: string[]): any;
    }
}
