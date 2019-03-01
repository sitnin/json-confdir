"use strict";

import * as fs from "fs";
import * as path from "path";
import * as json5 from "json5";
import * as lodash from "lodash";
import * as util from "util";

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default class ConfDirReader {
    public async loadJsonFile(filename: string): Promise<object> {
        let result = {};

        try {
            const contents = await readFile(filename, "utf-8");
            result = json5.parse(contents);
        } catch (err) {
            result = {};
        }

        return result;
    }

    public async load(...dirnames: string[]): Promise<object> {
        let result = {};
        let filenames: string[] = [];

        try {
            for (const dirname of lodash.flatten(dirnames)) {
                const realDirname: string = path.resolve(dirname);
                const oneDirFilenames: string[] = await this.directoryFilenames(realDirname);
                filenames = lodash.concat(filenames, oneDirFilenames);
            }

            for (const filename of filenames) {
                const obj = await this.loadJsonFile(filename);
                if (obj && lodash.isPlainObject(obj)) {
                    result = lodash.merge(result, obj);
                }
            }
        } catch (err) {
            result = {};
        }

        return result;
    }

    private async directoryFilenames(dirname: string): Promise<any> {
        let result = [];

        try {
            const dirStats = await stat(dirname);
            if (dirStats.isDirectory()) {
                const raw = await readdir(dirname);
                for (const filename of raw) {
                    const fullpath = path.join(dirname, filename);
                    const fileStats = await stat(fullpath);
                    if (fileStats.isFile()) {
                        result.push(fullpath);
                    }
                }
            }
        } catch (err) {
            result = [];
            throw err;
        }

        return result;
    }

}
