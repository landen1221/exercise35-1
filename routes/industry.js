const express = require("express");
const ExpressError = require("../expressError");
const slugify = require("slugify");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query(`SELECT * FROM industry`);

        return res.json(rows)

    } catch(e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {code, industry} = req.body;
        const slugCode = slugify(code, {
            replacement: "-",
            lower: true,
            strict: true,
          });

        const { rows } = await db.query(`INSERT INTO industry (code, industry) VALUES ($1, $2) RETURNING *`, [slugCode, industry])

        return res.status(201).json({industry: rows ? rows[0] : []})

    } catch(e) {
        return next(e)
    }
})

router.post('/:indCode/:compCode', async (req, res, next) => {
    try {
        const {indCode, compCode} = req.params;

        const { rows } = await db.query(`INSERT INTO company_industry (ind_code, comp_code) VALUES ($1, $2) RETURNING *`, [indCode, compCode])

        return res.status(201).json({Connected: rows})

    } catch(e) {
        return next(e)
    }
})


module.exports = router;