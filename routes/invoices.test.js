process.env.NODE_ENV = "test";

const request = require("supertest")
const app = require("../app");
const db = require("../db");

let testInvoice;

beforeEach(async () => {
    await db.query("INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple Computers', 'Creators of cutting edge tech') RETURNING *")
    const result = await db.query("INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ('apple', '100', 'f', CURRENT_DATE, NULL) RETURNING *")
    testInvoice = result.rows[0]
    testInvoice.add_date = testInvoice.add_date.toISOString()
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

        expect(res.body).toEqual({invoices: [testInvoice]})
    })
})

describe("Get /invoices/:id", () => {
    test("Get a single invoice", async () => {
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({invoice: testInvoice})
    })
    test("ID not found", async () => {
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404)
    })
})

describe("Patch /invoices/:id", () => {
    test("Get a list of all invoices", async () => {
        const res = await request(app).patch(`/invoices/${testInvoice.id}`).send({"amt": 500, "paid": true});

        expect(res.statusCode).toBe(200);

    })
})

describe("Delete /invoices/:id", () => {
    test("Get a list of all invoices", async () => {
        const res = await request(app).delete(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg: `Invoice w/ id (${testInvoice.id}) successfully removed!`})

    })
    test("ID not found", async () => {
        const res = await request(app).delete(`/invoices/0`);
        expect(res.statusCode).toBe(404)
    })
})