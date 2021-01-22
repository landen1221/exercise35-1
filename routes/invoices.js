const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const { request } = require("../app");

function getDate() {

}

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({invoices: results.rows})
    } catch (err) {
        return next(err)
    }
})

// convert add_date to Now
// make paid_date nullable
// make paid optional
router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt, paid, add_date, paid_date])

        return res.status(201).json({ invoice: results.rows[0]})

    } catch (err) {
        return next (err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice with id (${id}) not found`)
        }
        return res.json({invoice: results.rows[0]})

    } catch (err) {
        return next (err)
    }
})




// router.get('/:id', async (req, res, next) => {
//     try {

//     } catch (err) {
//         return next (err)
//     }
// })

// router.get('/:id', async (req, res, next) => {
//     try {

//     } catch (err) {
//         return next (err)
//     }
// })


module.exports = router;