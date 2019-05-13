# JSON Configuration Directory reader

This library is intended to assemble a configuration object from multiple directories and chunks.

Written in TypeScript 3 and compatible with any Node.js version starting from 8.x (generated with "ES6" TS compile target).

## Installation

    $ yarn add json-confdir

or

    $ npm install --save json-confdir

## Async Usage

Library exports a class ConfDirReader which is pretty simple to use. It exposes `load()` method which returns Promise.

```javascript
// import a class from library
const ConfDirReader = require("json-confdir");

// create reader instance
const reader = new ConfDirReader(false); // First argument is the `throwOnError` flag which is set to `false` by default

// ask reader to load JSON-files from a directory
// Method signature is: `ConfDirReader.load(String | [String]): Promise<any>`
reader.load("/path/to/config/dir").then(cfg => {
    // You configuration object is in cfg variable.
    // Do whatever your want...
}).catch(err => {
    console.error(`Cannot load config ${err.stack || err.message}`);
});
```

## Sync Usage (new in 2.1.x)

```javascript
// import a class from library
const SyncDirReader = require("json-confdir").SyncDirReader;

// create reader instance
const reader = new SyncDirReader(true); // First argument is the `throwOnError` flag which is set to `false` by default

try {
    // ask reader to load JSON-files from a directory
    // Method signature is: `SyncDirReader.load(String | [String]): any`
    const cfg = reader.load("/path/to/config/dir");
    // You configuration object is in cfg variable.
    // Do whatever your want...
} catch (err) {
    console.error(`Cannot load config ${err.stack || err.message}`);
}
```


## Confuguration files

Library loads all files in the directories in the order supplied be the `fs.readdir()`.

Every latter file contents overrides (but NOT replaces) previously loaded JSON-files.
It is a good practice to prefix configuration filenames with zero-padded number like `00-default.json` or `999-local_dev.overrides.json`.

JSON-files are parsed with the `json5` library. So your configuration files could have keys without quotes (`"`), comments (`//`) and trailing commas.

### Some examples

Contents of `test/1/00-test.json`:

```json5
{
    "option1": "blablabla",
    "option2": 123
}
```

Contents of `test/1/10-test.json`:

```json5
{
    option3: {
        key: "value",
        second: [],
    },
    option2: 321
}
```

Contents of `test/2/another.json`:

```json5
{
    "option4": [1,2,3],
    // option5: "showld be commented out =)"
    "option1": "foorbarbaz",
    option3: {
        second: "replaced",
        addition: 1000
    }
}
```

These are perfectly correct configuration files which used for this library testing.

## TODO

* Add tests for `throwOnError` mode
* Generalize lib with a superclass to avoid ambiguity
* Add more complex tests
* Add schema validation for loaded data (via joi or something like it)

## Contacts

Feel free to file [issues on Github](https://github.com/sitnin/json-confdir/issues).

Friend me on Facebook: [https://fb.com/sitnin](https://fb.com/sitnin)

Contact via Telegram: [https://t.me/sitnin](https://t.me/sitnin)

## License

MIT
