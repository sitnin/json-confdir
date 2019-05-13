"use strict";

import * as fs from "fs";
import * as path from "path";
import * as json5 from "json5";
import * as lodash from "lodash";
import { JsonDirReader } from "./JsonDirReader";

export default class SyncDirReader implements JsonDirReader {
    private readonly throwOnError: boolean;

    public constructor(throwOnError: boolean = false) {
        this.throwOnError = throwOnError;
    }

    public loadJsonFile(filename: string): any {
        let result = {};

        try {
            const contents = fs.readFileSync(filename, "utf-8");
            result = json5.parse(contents);
        } catch (err) {
            if (this.throwOnError) {
                throw err;
            }

            result = {};
        }

        return result;
    }

    public load(...dirnames: string[]): any {
        let result = {};
        let filenames: string[] = [];

        try {
            for (const dirname of lodash.flatten(dirnames)) {
                const realDirname: string = path.resolve(dirname);
                const oneDirFilenames: string[] = this.directoryFilenames(realDirname);
                filenames = lodash.concat(filenames, oneDirFilenames);
            }

            for (const filename of filenames) {
                const obj = this.loadJsonFile(filename);
                if (obj && lodash.isPlainObject(obj)) {
                    result = lodash.merge(result, obj);
                }
            }
        } catch (err) {
            if (this.throwOnError) {
                throw err;
            }

            result = {};
        }

        return result;
    }

    private directoryFilenames(dirname: string): string[] {
        let result = [];

        try {
            const dirStats = fs.statSync(dirname);
            if (dirStats.isDirectory()) {
                const raw = fs.readdirSync(dirname);
                for (const filename of raw) {
                    const fullpath = path.join(dirname, filename);
                    const fileStats = fs.statSync(fullpath);
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
