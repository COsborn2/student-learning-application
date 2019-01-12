var pool = require('./poolSetup').sqlPool

var getAllData = (req, res) => {
    try {
        pool.query('SELECT * FROM temp_words', (err, rows) => {
        if (err) {
            console.error(err)
        } else {
            res.json(rows.rows)
        }
    })
    } catch (err) {
        console.error(err)
        res.json([{
            error: 'Database connection failure'
        }])
    }
}

module.exports = { getAllData }