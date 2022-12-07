/** @format */

import {randomUUID} from 'crypto'
import ffmpegPath from 'ffmpeg-static'
import {readFile} from 'fs/promises'
import NodeID3 from 'node-id3'
import {tmpdir} from 'os'
import {join} from 'path'
import youtubeDl from 'youtube-dl-exec'
import getThumbnail from './getThumbnail.js'

/**
 *
 * @param {import("tube-api/build/interfaces/videoDetails-interface").videoDetails} videoDetails
 * @param {import('tube-api/build/interfaces/channelDetails-interface').channelDetails} channelDetails
 */
export default async function getAudio(videoDetails, channelDetails) {
  const url = `https://www.youtube.com/watch?v=${videoDetails.video_id}`
  const output = join(tmpdir(), `${randomUUID()}.mp3`)
  await youtubeDl(url, {
    ffmpegLocation: ffmpegPath,
    extractAudio: true,
    audioFormat: 'mp3',
    audioQuality: 0,
    output,
  })
  const filebuffer = await readFile(output)
  return NodeID3.write(
    {
      title: videoDetails.title,
      album: channelDetails.title,
      artist: channelDetails.title,
      image: {
        mime: 'image/jpeg',
        type: {
          id: 3,
          name: 'Cover (front)',
        },
        description: 'Youtube Video Thumbnails',
        imageBuffer: await getThumbnail(videoDetails.thumbnails.high.url),
      },
    },
    filebuffer,
  )
}
