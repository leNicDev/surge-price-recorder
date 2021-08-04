import fetch from 'node-fetch'
import Web3 from 'web3'
import { SURGE_CONTRACT_ABI, SURGE_CONTRACT_ADDRESS, BSC_RPC_ENDPOINT, SURGE_USD_CONTRACT_ABI, SURGE_USD_CONTRACT_ADDRESS, NOMICS_API_ENDPOINT, NOMICS_API_KEY } from './constants.js'

const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_ENDPOINT))

let cachedBnbPrice = null
let cachedBnbPriceExpiration = Date.now()

/**
 * Get the current price of Surge in BNB
 * @returns The current price of Surge in BNB
 */
export async function getSurgePriceInBnb() {
    const SurgeContract = new web3.eth.Contract(SURGE_CONTRACT_ABI, SURGE_CONTRACT_ADDRESS)
    const price = await SurgeContract.methods.calculatePrice().call()
    return web3.utils.fromWei(String(price), "ether")
}

/**
 * Get the current price of SurgeUSD in BNB
 * @returns The current price of SurgeUSD in BNB
 */
 export async function getSurgeUsdPriceInBnb() {
    const SurgeContract = new web3.eth.Contract(SURGE_USD_CONTRACT_ABI, SURGE_USD_CONTRACT_ADDRESS)
    const price = await SurgeContract.methods.calculatePrice().call()
    return web3.utils.fromWei(String(price), "ether")
}

/**
 * Fetch the current BNB price in USD
 */
export async function fetchBnbUsdPrice() {
    // how real gangsters do caching
    if (cachedBnbPrice && cachedBnbPriceExpiration < Date.now()) {
        return cachedBnbPrice
    }

    const url = `${NOMICS_API_ENDPOINT}/exchange-rates?key=${NOMICS_API_KEY}`

    const response = await fetch(url)
    console.log('Response', response)
    const json = await response.json()

    for (let currency of json) {
        if (currency.currency !== NOMICS_CURRENCY_NAME) continue

        cachedBnbPrice = currency.currency
        cachedBnbPriceExpiration = Date.now() + 30000 // make cached bnb price expire in 30 seconds

        return currency.rate
    }

    return 0
}