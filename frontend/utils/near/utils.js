import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './config'

const GAS_PRICE = '100000000000000'

const nearConfig = getConfig(process.env.NODE_ENV || 'testnet')

export const initContract = async () => {
  const near = await connect(
      Object.assign({
        deps: {
          keyStore: new keyStores.BrowserLocalStorageKeyStore()
        }
      }, nearConfig))

  window.walletConnection = new WalletConnection(near)

  window.accountId = window.walletConnection.getAccountId()

  window.utils = utils

  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['get_all_products'],
    changeMethods: ['add_user_product', 'remove_user_product', 'buy_product', 'get_user_products'],
  })
}

export const logout = () => {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export const login = () => {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export const get_user_products = async () => {
  return await window.contract.get_user_products()
}

export const get_all_products = async () => {
  return await window.contract.get_all_products()
}

export const add_user_product = async (image, title, price) => {

  await window.contract.add_user_product({
      new_product_image: image,
      new_product_title: title,
      new_product_price: price,
  })
}

export const remove_user_product = async (id) => {
  await window.contract.remove_user_product({product_id: id})
}

export const buy_product = async (product) => {
    const deposit = toFixed(product.product_price).toString()
    await window.contract.buy_product({product_id: product.product_id}, GAS_PRICE, deposit)
}

export const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e)
      x += (new Array(e + 1)).join('0')
    }
  }
  return x
}

export const getPrice = (price) => {
  const srtPrice = String(price)
  const eIndex = srtPrice.indexOf('e')
  return srtPrice.slice(0, eIndex)
}