import express from 'express'
import cors from 'cors'

import PriceRecorder from './PriceRecorder.js'
import router from './routes/index.js'
import QuestDbClient from './QuestDbClient.js'

// connect to QuestDB
const client = new QuestDbClient({
    ingest: {
        host: process.env.QUESTDB_HOST || 'localhost',
        port: Number(process.env.QUESTDB_INFLUX_PORT) || 9009,
    },
    query: {
        protocol: process.env.QUESTDB_PROTOCOL || 'http',
        protocol: process.env.QUESTDB_HOST || 'localhost',
        protocol: Number(process.env.QUESTDB_REST_PORT) || 9000,
    },
})
client.connect()

// start recording prices
const surgePriceRecorder = new PriceRecorder(client, 'surge_price', 'surgePrice')
surgePriceRecorder.startRecording()
const surgeUsdPriceRecorder = new PriceRecorder(client, 'surgeusd_price', 'surgeusdPrice')
surgeUsdPriceRecorder.startRecording()

// configure and start rest api
const app = express()
app.use(express.json())
app.use(cors())
app.use('/', router)

app.listen(process.env.PORT || 3000)