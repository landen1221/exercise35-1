process.env.NODE_ENV = "test";

const request = require("supertest")
const app = require("../app");
const db = require("../db");

let testInvoice;

beforeEach(async () => {
    await db.query("INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple Computers', 'Creators of cutting edge tech') RETURNING *")
    const result = await db.query("INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ('apple', '100', 'f', CURRENT_DATE, NULL) RETURNING *")
    testInvoice = result.rows[0]
});

afterEach (async () => {
    await db.query("DELETE FROM companies")
    await db.query("DELETE FROM invoices");
});

afterAll(async () => {
    await db.end();
})

describe("Get /invoices", () => {
    test("Get a list of all invoices", async () => {
        const res = await request(app).get("/invoices");
        expect(res.statusCode).toBe(200);
        console.log(res.body)
        console.log({invoices: [testInvoice]})
        expect(res.body).toEqual({invoices: [testInvoice]})
    })
})