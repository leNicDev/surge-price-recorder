import fetch from 'node-fetch'
import Web3 from 'web3'
import { SURGE_CONTRACT_ABI, SURGE_CONTRACT_ADDRESS, BSC_RPC_ENDPOINT, SURGE_USD_CONTRACT_ABI, SURGE_USD_CONTRACT_ADDRESS, NOMICS_API_ENDPOINT, NOMICS_API_KEY, SURGE_ETH_CONTRACT_ABI, SURGE_ETH_CONTRACT_ADDRESS } from './constants.js'

const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_ENDPOINT))

export let bnbPrice = 0

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
 * Get the current price of SurgeETH in BNB
 * @returns The current price of SurgeETH in BNB
 */
 export async function getSurgeEthPriceInBnb() {
    const SurgeContract = new web3.eth.Contract(SURGE_ETH_CONTRACT_ABI, SURGE_ETH_CONTRACT_ADDRESS)
    const price = await SurgeContract.methods.calculatePrice().call()
    return web3.utils.fromWei(String(price), "ether")
}


/**
 * Fetch the current BNB price in USD
 */
export async function fetchBnbUsdPrice() {
    const url = 'https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD'

    const response = await fetch(url)
    const json = await response.json()

    return json.price
}

export async function startBnbPriceUpdateLoop() {
    bnbPrice = await fetchBnbUsdPrice()
    setInterval(async () => {
        bnbPrice = await fetchBnbUsdPrice()
    }, 10000)
}

export function getBnbPrice() {
    return bnbPrice
}