process.env.NODE_ENV = "test";

const request = require("supertest")
const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async () => {
    const result = await db.query("INSERT INTO companies (code, name, description) VALUES ('tesla', 'Tesla Motors', 'Seller of Electric Cars') RETURNING code, name, description")
    testCompany = result.rows[0]
});

afterEach (async () => {
    await db.query("DELETE FROM companies");
});

afterAll(async () => {
    await db.end();
})

describe("Get /companies", () => {
    test("Get a list of all companies", async () => {
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]})
    })
})

describe("Get /companies/:code", () => {
    test("Get a single company", async () => {
        const res = await request(app).get("/companies/tesla")
        expect(res.statusCode).toBe(200)
    })
    test("Bad request", async() => {
        const res = await request(app).get("/companies/undefined")
        expect(res.statusCode).toBe(404)
    })
})

describe("Post /companies", () => {
    test("Add a company", async () => {
        const res = await request(app).post("/companies").send({"code": "apple", "name": "Apple Computers", "description": "Creators of cutting edge tech"})
        expect(res.statusCode).toBe(201)
    })
})

describe("Patch /companies/:code", () => {
    test("Edit a company", async () => {
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({"name": "Tesla Energy", "description": "Makers of Solar Panels"})
        expect(res.statusCode).toBe(200)
    })
    test("Bad Request", async () => {
        const res = await request(app).patch(`/companies/badname`).send({"name": "Tesla Energy", "description": "Makers of Solar Panels"})
        expect(res.statusCode).toBe(404)
    })
})

describe("Delete /companies/:code", () => {
    test("Add a company", async () => {
        const res = await request(app).delete("/companies/tesla")
        expect(res.statusCode).toBe(200)
    })
    test("Bad Request", async () => {
        const res = await request(app).delete("/companies/UNKNOWN")
        expect(res.statusCode).toBe(404)
    })
})