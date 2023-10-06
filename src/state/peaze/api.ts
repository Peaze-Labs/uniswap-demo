import axios, { AxiosInstance } from 'axios'

const PEAZE_API_URL = process.env.REACT_APP_PEAZE_API_URL ?? 'https://api-6ws6-staging.zeet-peaze.zeet.app/api'

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
