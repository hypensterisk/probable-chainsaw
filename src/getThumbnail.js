/** @format */

import sharp from 'sharp'

export default async function getThumbnail(input) {
  const response = await fetch(input)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const options = {
    fit: sharp.fit.cover,
    height: Math.pow(2, 10),
    width: Math.pow(2, 10),
  }
  return sharp(buffer).resize(options).jpeg().toBuffer()
}
