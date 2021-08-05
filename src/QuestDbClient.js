import net from 'net'
import fetch from 'node-fetch'

export default class QuestDbClient {    
    constructor(options) {
        this.ingestClient = undefined
        this.options = options
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.ingestClient = new net.Socket()
            this.ingestClient.on('connect', () => {
                console.log('[Ingest] Successfully connected to QuestDB instance.')
            })
            this.ingestClient.on('close', () => {
                console.log('[Ingest] Connection closed. Reconnecting...')
                this.ingestClient.setTimeout(10000, () => {
                    this.ingestClient.connect(this.options.ingest.port, this.options.ingest.host);
                })
            })
            this.ingestClient.connect(this.options.ingest.port, this.options.ingest.host, () => {
                resolve()
            })
        })
    }

    async insert(row) {
        return new Promise((resolve, reject) => {
            this.ingestClient.write(`${row}\n`)
            resolve()
        })
    }

    async query(queryString) {
        const url = `${this.options.query.protocol}://${this.options.query.host}:${this.options.query.port}/exec?query=${encodeURIComponent(queryString)}`        
        const response = await fetch(url)
        const json = await response.json()
        return json
    }
}