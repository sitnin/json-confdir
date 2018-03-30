"use strict";

import fs from "fs";
import path from "path";
import json5 from "json5";
import lodash from "lodash";
import util from "util";

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default class ConfDirReader {
    async loadJsonFile (filename) {
        let result = {};

        try {
            const contents = await readFile(filename, "utf-8");
            result = json5.parse(contents);
        } catch (err) {
            result = null;
        }

        return result;
    }

    async directoryFilenames (dirname) {
        let result = [];

        try {
            const dir_stats = await stat(dirname);
            if (dir_stats.isDirectory()) {
                const raw = await readdir(dirname);
                for (let filename of raw) {
                    const fullpath = path.join(dirname, filename);
                    const file_stats = await stat(fullpath);
                    if (file_stats.isFile()) {
                        //console.log(`Found config ${fullpath}`);
                        result.push(fullpath);
                    }
                }
            } else {
                console.error(`Cannot read directory ${dirname}. Ignoring`);
            }
        } catch (err) {
            result = [];
            throw err;
        }

        return result;
    }

    async load (...dirnames) {
        let result = {};

        try {
            let filenames = [];
            for (let dirname of lodash.flatten(dirnames)) {
                const real_dirname = path.resolve(dirname);
                const one_dir_filenames = await this.directoryFilenames(real_dirname);
                filenames = lodash.concat(filenames, one_dir_filenames);
            }
            for (let filename of filenames) {
                const obj = await this.loadJsonFile(filename);
                if (obj && lodash.isPlainObject(obj)) {
                    result = lodash.merge(result, obj);
                }
            }
        } catch (err) {
            result = null;
            throw err;
        }

        if (Object.keys(result).length === 0) {
            result = null;
        }
        return result;
    }
};
