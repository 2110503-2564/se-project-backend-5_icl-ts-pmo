import { readPagination, validateRegex } from "../src/controllers/utils";

describe('test validateRegex function', () => {
  test('TC1: valid regex', () => {
    expect(validateRegex("^abc$")).toBe("^abc$");
  });
  test('TC2: invalid regex', () => {
    expect(validateRegex("[a-z")).toBe("^$.");
  })
});

describe('test readPagination function', () => {
  test('TC1: no query', () => {
    const req = {
      body: {},
      query: {},
      params: {},
      headers: {},
    }
    expect(readPagination(req as Request)).toEqual(({ page: 0, limit: 25 }))
  })

  test('TC2: page query', () => {
    const req = {
      body: {},
      query: {page: 1},
      params: {},
      headers: {},
    }
    expect(readPagination(req as Request)).toEqual(({ page: 1, limit: 25 }))
  })

  test('TC3: limit query', () => {
    const req = {
      body: {},
      query: {limit: 10},
      params: {},
      headers: {},
    }
    expect(readPagination(req as Request)).toEqual(({ page: 0, limit: 10 }))
  })

  test('TC4: change default limit', () => {
    const req = {
      body: {},
      query: {},
      params: {},
      headers: {},
    }
    expect(readPagination(req as Request, 20)).toEqual(({ page: 0, limit: 20 }))
  })
});