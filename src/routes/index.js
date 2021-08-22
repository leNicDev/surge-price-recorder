import express from 'express'
import { questDbClient } from '../app.js'
import {Contracts, getContractByAddress} from "../contracts.js";

const router = express.Router()

router.get('/:contractAddress', async (req, res) => {
    const contract = getContractByAddress(req.params.contractAddress)

    if (!contract) {
        res.status(404).json({ error: 'CONTRACT_NOT_FOUND', message: 'Could not find Surge contract with the specified address' })
        return
    }

    const interval = parseInterval(req.query.interval)
    const query = `SELECT avg(price) AS price, timestamp FROM ${contract.address} SAMPLE BY ${interval} ALIGN TO CALENDAR`

    let data = await questDbClient.query(query)
    data.dataset = data.dataset.map(point => [point[0], Math.floor(new Date(point[1]).getTime() / 1000)])

    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

router.get('/surge', async (req, res) => {
    const interval = parseInterval(req.query.interval)
    const query = `SELECT avg(price) AS price, timestamp FROM ${Contracts.SurgeBnb.address} SAMPLE BY ${interval} ALIGN TO CALENDAR`

    let data = await questDbClient.query(query)
    data.dataset = data.dataset.map(point => [point[0], Math.floor(new Date(point[1]).getTime() / 1000)])

    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

router.get('/surge/change', async (req, res) => {
    const query = `SELECT (cast(last(price) AS DOUBLE) + -cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeBnb.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
})

router.get('/surge/changePercentage', async (req, res) => {
    const query = `SELECT ((cast(last(price) AS DOUBLE) - cast(first(price) AS DOUBLE)) / cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeBnb.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
})

router.get('/surgeusd', async (req, res) => {
    const interval = parseInterval(req.query.interval)
    const query = `SELECT avg(price) AS price, timestamp FROM ${Contracts.SurgeUsd.address} SAMPLE BY ${interval} ALIGN TO CALENDAR`

    let data = await questDbClient.query(query)
    data.dataset = data.dataset.map(point => [point[0], Math.floor(new Date(point[1]).getTime() / 1000)])

    res.json({ columns: data.columns, dataset: data.dataset, count: data.count })
})

router.get('/surgeusd/change', async (req, res) => {
    const query = `SELECT (cast(last(price) AS DOUBLE) + -cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeUsd.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
})

router.get('/surgeusd/changePercentage', async (req, res) => {
    const query = `SELECT ((cast(last(price) AS DOUBLE) - cast(first(price) AS DOUBLE)) / cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeUsd.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
})

router.get('/surgeeth/change', async (req, res) => {
    const query = `SELECT (cast(last(price) AS DOUBLE) + -cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeEth.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
})

router.get('/surgeeth/changePercentage', async (req, res) => {
    const query = `SELECT ((cast(last(price) AS DOUBLE) - cast(first(price) AS DOUBLE)) / cast(first(price) AS DOUBLE)) AS change FROM ${Contracts.SurgeEth.address} WHERE timestamp >= dateadd('d', -1, now())`

    const data = await questDbClient.query(query)
    res.json({ change: data.dataset[0][0] })
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
        case '24h': return '1d';
        case '1d': return '1d';
        case '3d': return '3d';
        case '1w': return '1w';
        case '1mo': return '4w';
        default: return '1d';
    }
}

export default router
