import axios, { AxiosInstance } from 'axios'

const PEAZE_API_URL = process.env.REACT_APP_PEAZE_API_URL ?? 'https://api.peaze.com/api'

function createAxiosClient(): AxiosInstance {
  return axios.create({
    baseURL: PEAZE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.REACT_APP_PEAZE_API,
    },
  })
}

export const peazeAxios = createAxiosClient()
