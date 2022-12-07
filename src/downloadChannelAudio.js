/** @format */

import {execSync} from 'child_process'
import {config} from 'dotenv'
import filenamify from 'filenamify'
import {existsSync, writeFileSync} from 'fs'
import {mkdir, rename, rm} from 'fs/promises'
import {homedir} from 'os'
import {join} from 'path'
import {Youtube} from 'tube-api'
import getAudio from './getAudio.js'
import getChanelDetails from './getChanelDetails.js'

export default async function downloadChannelAudio() {
  const channelDetails = await getChanelDetails()
  const dir = filenamify(channelDetails.title)
  if (existsSync(dir)) {
    await rm(dir, {recursive: true, force: true})
    await mkdir(dir)
  } else {
    await mkdir(dir)
  }
  config()
  const youtube = new Youtube(process.env.API_KEY)
  const videosList = await youtube.videosList(channelDetails.uploads_id, [])
  for (const videoDetails of videosList) {
    const audio = await getAudio(videoDetails, channelDetails)
    writeFileSync(join(dir, `${filenamify(videoDetails.title)}.mp3`), audio)
  }
  execSync(`tar -cf '${dir}.tar' '${dir}'`)
  await rm(dir, {recursive: true, force: true})
  const output = join(homedir(), 'Music', `${dir}.tar`)
  await rename(`${dir}.tar`, output)
  console.log(`Output: ${output}`)
}
