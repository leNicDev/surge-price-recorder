import { getBnbPrice } from "./price.js"

export default class PriceRecorder {
    constructor(dbClient, tableName, surgeKey, getSurgePriceFn) {
        this.dbClient = dbClient
        this.tableName = tableName
        this.surgeKey = surgeKey
        this.getSurgePriceFn = getSurgePriceFn
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
        const surgeBnbPrice = await this.getSurgePriceFn()
        const bnbUsdPrice = getBnbPrice()

        await this.dbClient.insert(`${this.tableName} ${this.surgeKey}=${surgeBnbPrice},bnbPrice=${bnbUsdPrice}`)
    }
}