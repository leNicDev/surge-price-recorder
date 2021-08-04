import fetch from 'node-fetch'
import Web3 from 'web3'
import { SURGE_CONTRACT_ABI, SURGE_CONTRACT_ADDRESS, BSC_RPC_ENDPOINT, SURGE_USD_CONTRACT_ABI, SURGE_USD_CONTRACT_ADDRESS } from './constants.js'

const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_ENDPOINT))

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
    const response = await fetch('https://getsur.ge/api/bnbPrice')
    const json = await response.json()
    return json.price
}