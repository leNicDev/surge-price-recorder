import express from 'express'
import { questDbClient } from '../app.js'

const router = express.Router()

router.get('/surge', async (req, res) => {
    const data = await questDbClient.query('SELECT * FROM surge_price')
    res.json(data)
})

router.get('/surgeusd', async (req, res) => {
    const data = await questDbClient.query('SELECT * FROM surgeusd_price')
    res.json(data)
})

export default router