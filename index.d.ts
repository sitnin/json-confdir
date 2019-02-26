declare module "json-confdir";

export class ConfDirReader {
    public constructor();
    public load(...dirnames: string[]): Promise<any>;
}

export default ConfDirReader;
