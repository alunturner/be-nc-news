const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an array", () => {
    expect(formatDates([])).to.be.an("array");
  });
  it("returns a new array", () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
  });
  it("when passed a single object list, returns a single object list, key of created_at, which is a Date", () => {
    const inputObj = { created_at: 0 };
    const inputArr = [inputObj];
    const actual = formatDates(inputArr);
    actual.forEach((object) => {
      expect(object).to.have.all.keys("created_at");
      expect(object.created_at).to.be.an.instanceOf(Date);
    });
  });
  it("does not mutate the input", () => {
    const inputObj = { created_at: 0 };
    const inputArr = [inputObj];
    const controlObj = { ...inputObj };
    const controlArr = [...inputArr];
    formatDates(inputArr);
    expect(inputObj).to.deep.equal(controlObj);
    expect(inputArr).to.deep.equal(controlArr);
  });
  it("returns a single article with correctly formatted created_at", () => {
    const inputObj = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1542284514171,
      votes: 100,
    };
    const inputArr = [inputObj];
    const actual = formatDates(inputArr);
    // unix timestamps only accurate to nearest second
    const roundedOutput = Math.floor(Date.parse(actual[0].created_at) / 1000);
    const roundedInput = Math.floor(inputArr[0].created_at / 1000);
    expect(roundedOutput).to.equal(roundedInput);
  });
  it("returns correctly for multiple article objects", () => {
    const inputArr = [
      {
        title: "Living in the shadow of a great man",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        created_at: 1416140514171,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        created_at: 1289996514171,
      },
    ];
    const controlArr = [...inputArr];
    const actual = formatDates(inputArr);
    actual.forEach((article, index) => {
      const roundedOutput = Math.floor(Date.parse(article.created_at) / 1000);
      const roundedInput = Math.floor(inputArr[index].created_at / 1000);
      expect(roundedOutput).to.equal(roundedInput);
    });
  });
});

describe("makeRefObj", () => {
  it("returns an object", () => {
    expect(makeRefObj([])).to.be.an("object");
  });
  it("returned object has string keys and number values", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    for (let key in actual) {
      expect(key).to.be.a("string");
      expect(actual[key]).to.be.a("number");
    }
  });
  it("returned object has correct keys: values for a single object input array", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    expect(actual).to.deep.equal({ A: 1 });
  });
  it("returned object has correct keys: values for a multi object input array", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 3, title: "B" },
      { article_id: 2, title: "FZ" },
    ];
    const actual = makeRefObj(input);
    expect(actual).to.deep.equal({ A: 1, B: 3, FZ: 2 });
  });
  it("does not mutate input", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 3, title: "B" },
      { article_id: 2, title: "FZ" },
    ];
    const control = [...input];
    control.forEach((controlObj, index) => {
      expect(controlObj).to.deep.equal(input[index]);
    });
  });
});

describe("formatComments", () => {});
