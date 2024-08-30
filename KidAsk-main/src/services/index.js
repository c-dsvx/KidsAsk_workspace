import axios from "axios"

// change to ip addres
const apiEndpoint = "http://10.204.4.78:3000"

export const addIdentifiant = async ({identifiant, help}) => {
  const user = await axios.post(`${apiEndpoint}/users`, {identifiant, help})
  return user.data

}

export const updateLastURl = async (identifiant, url) => {
  const done = await axios.post(`${apiEndpoint}/users-url`, {identifiant, url})
  return done
}

export const addUserInput = async (identifiant, phase, id, data) => {
  console.log({ identifiant })
  const done = await axios.post(`${apiEndpoint}/users-input`, {identifiant, phase, id, data})
  return done
}