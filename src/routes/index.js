import express from 'express'
import { questDbClient } from '../app.js'

const router = express.Router()

router.get('/surge', async (req, res) => {
    const interval = parseInterval(req.query.interval)
    const query = `SELECT avg(surgePrice) AS price, timestamp FROM surge_price SAMPLE BY ${interval} ALIGN TO CALENDAR`

    const data = await questDbClient.query(query)
    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

router.get('/surgeusd', async (req, res) => {
    const interval = parseInterval(req.query.interval)
    const query = `SELECT avg(surgeusdPrice) AS price, timestamp FROM surgeusd_price SAMPLE BY ${interval} ALIGN TO CALENDAR`

    const data = await questDbClient.query(query)
    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

function parseInterval(interval) {
    if (!interval || typeof interval !== 'string') return '1d'

    switch (interval.toLowerCase()) {
        case '1m': return '1m';
        case '5m': return '5m';
        case '15m': return '15m';
        case '1h': return '1h';
        case '6h': return '6h';
        case '12h': return '12h';
        case '1d': return '1d';
        case '3d': return '3d';
        case '1w': return '1w';
        case '1mo': return '4w';
        default: return '1d';
    }
}

export default router