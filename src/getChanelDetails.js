/** @format */

import {config} from 'dotenv'
import {stdin, stdout} from 'process'
import {createInterface} from 'readline/promises'
import {Youtube} from 'tube-api'

export default async function getChanelDetails() {
  const readline = createInterface(stdin, stdout)
  const handles = await readline.question('Handles: ')
  readline.close()
  const input = `https://yt.lemnoslife.com/channels?handle=${handles}`
  const response = await fetch(input)
  const json = await response.json()
  const channel_id = json.items.at(0).id
  config()
  const youtube = new Youtube(process.env.API_KEY)
  const channelDetails = await youtube.channelDetails(channel_id)
  return channelDetails
}
