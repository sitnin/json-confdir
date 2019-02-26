const ConfDirReader = require("./lib");

describe("Works", () => {
    it("instantiates correctly", () => {
        const reader = new ConfDirReader();
        expect(reader).toBeInstanceOf(ConfDirReader);
    });

    it("reads one directory", (done) => {
        const reader = new ConfDirReader();
        reader.load("./test/1").then(cfg => {
            expect(cfg).toBeTruthy();
            expect(cfg.option1).toBe("blablabla");
            expect(cfg.option2).toBe(321);
            expect(cfg.option3).toMatchObject({
                key: "value",
                second: [],
            });
            expect(cfg.option4).toBeUndefined();
            done();
        }).catch(err => {
            done(err);
        });
    });

    it("reads multiple directories", (done) => {
        const reader = new ConfDirReader();
        reader.load(["./test/1", "./test/2"]).then(cfg => {
            expect(cfg).toBeTruthy();
            expect(cfg.option1).toBe("foorbarbaz");
            expect(cfg.option2).toBe(321);
            expect(cfg.option3).toMatchObject({
                key: "value",
                second: "replaced",
                addition: 1000,
            });
            expect(cfg.option4).toEqual([1, 2, 3]);
            done();
        }).catch(err => {
            done(err);
        });
    });
});
