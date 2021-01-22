const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies WHERE code=$1`, [
      req.params.code,
    ]);
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't find user with id of ${code}`, 404);
    }
    return res.send({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const results = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:code", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const results = await db.query(
      "UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING *",
      [req.params.code, name, description]
    );

    if (results.rows.length === 0) {
      throw new ExpressError(`Can't update user with id of ${id}`, 404);
    }

    return res.send({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const results = await db.query("DELETE FROM companies WHERE code=$1 RETURNING name", [
      code]);

    if (results.rows.length === 0) {
        throw new ExpressError(`Company code (${code}) not found`, 404);
    }

    return res.send({ msg: `${code} successfully removed!` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
