import express from 'express'
import { questDbClient } from '../app.js'

const router = express.Router()

router.get('/surge', async (req, res) => {
    const data = await questDbClient.query('SELECT avg(surgePrice) AS price, timestamp FROM surge_price SAMPLE BY 1d ALIGN TO CALENDAR')
    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

router.get('/surgeusd', async (req, res) => {
    const data = await questDbClient.query('SELECT avg(surgeusdPrice) FROM surgeusd_price SAMPLE BY 1d ALIGN TO CALENDAR')
    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

export default router