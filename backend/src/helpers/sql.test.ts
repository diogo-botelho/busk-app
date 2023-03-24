import { sqlForPartialUpdate } from "./sql";

describe("sqlForPartialUpdate", function () {
  test("works: 1 event item", function () {
    const result = sqlForPartialUpdate(
      { buskerId: "1" },
      { buskerId: "busker_id" }
    );
    expect(result).toEqual({
      setCols: '"busker_id"=$1',
      values: ["1"],
    });
  });

  test("works: 2 events", function () {
    const result = sqlForPartialUpdate(
      { buskerId: "1", title: "newTitle" },
      { buskerId: "busker_id" }
    );
    expect(result).toEqual({
      setCols: '"busker_id"=$1, "title"=$2',
      values: ["1", "newTitle"],
    });
  });

  test("works: 1 user item", function () {
    const result = sqlForPartialUpdate(
      { firstName: "newF" },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["newF"],
    });
  });

  test("works: 3 user item", function () {
    const result = sqlForPartialUpdate(
      { firstName: "newF", lastName: "newL", phone: "111" },
      { firstName: "first_name", lastName: "last_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "phone"=$3',
      values: ["newF", "newL", "111"],
    });
  });
});
