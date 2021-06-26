import Cookies from 'js-cookie'

const TokenKey = 'cookie'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getData(type) {
  return Cookies.get(type)
}

export function setData(type, data) {
  return Cookies.set(type, data)
}

export function removeData(type) {
  return Cookies.remove(type)
}
