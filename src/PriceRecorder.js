import { fetchBnbUsdPrice, getSurgePriceInBnb } from "./price.js"

export default class PriceRecorder {
    constructor(dbClient, tableName, surgeKey) {
        this.dbClient = dbClient
        this.tableName = tableName
        this.surgeKey = surgeKey
        this.interval = undefined
    }

    startRecording() {
        this.record()
        this.interval = setInterval(async () => this.record(), 60000)
    }

    stopRecording() {
        clearInterval(this.interval)
    }

    isRecording() {
        return !!this.interval
    }

    async record() {
        const surgeBnbPrice = await getSurgePriceInBnb()
        const bnbUsdPrice = await fetchBnbUsdPrice()

        await this.dbClient.insert(`${this.tableName} ${this.surgeKey}=${surgeBnbPrice},bnbPrice=${bnbUsdPrice}`)
    }
}