const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

// difference between res.send and res.json
// patch vs put
// handle date in js or sql?

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({invoices: results.rows})
    } catch (err) {
        return next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let results;
        const { comp_code, amt, paid, paid_date } = req.body;

        if (paid_date) {
            results = await db.query(`INSERT INTO invoices (comp_code, amt, paid,  paid_date) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *`, [comp_code, amt, paid])
        }
        
        return res.status(201).json({ invoice: results ? results.rows[0] : [] })

    } catch (err) {
        return next (err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice with id (${id}) not found`, 404)
        }
        return res.json({invoice: results.rows[0]})

    } catch (err) {
        return next (err)
    }
})


router.patch('/:id', async (req, res, next)=> {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let results;

        if (paid) {
            results = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=CURRENT_DATE WHERE id=$3 RETURNING *`, [amt, paid, id])
        } else if (! paid) {
            results = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=NULL WHERE id=$3 RETURNING *`, [amt, paid, id])
        }
        

        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ID (${id}) not found.`, 404);
        }
      
        return res.send({ invoice: results.rows[0] });

    } catch (err) {
        return next (err)
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING amt", [req.params.id]);

        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice w/ ID (${id}) not found.`, 404);
        }

        return res.send({ msg: `Invoice w/ id (${id}) successfully removed!`})

    } catch (err) {
        return next (err)
    }
})


module.exports = router;