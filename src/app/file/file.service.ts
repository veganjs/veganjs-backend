import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { pipeline } from 'stream'
import { promisify } from 'util'
import * as fs from 'fs'

import { UploadFileOptions } from './file.types'
import { allowedMimetypes, maxFileSize, publicPath } from './file.constants'

@Injectable()
export class FileService {
  private readonly pump = promisify(pipeline)

  async getFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath)
    }
    throw new NotFoundException('File not found')
  }

  async uploadFile(req: FastifyRequest, options: UploadFileOptions) {
    const {
      destination = publicPath,
      rename = (oldName) => `${Date.now()}_${oldName}`,
    } = options
    const isMultipart = req.isMultipart()

    if (!isMultipart) {
      throw new BadRequestException('Expected multipart/form-data content type')
    }

    const multipartFile = await req.file({
      limits: {
        fileSize: maxFileSize,
      },
    })

    if (!multipartFile) {
      throw new BadRequestException('File not provided')
    }

    const { file, filename, mimetype } = multipartFile

    if (file.readableLength === 0) {
      throw new BadRequestException('Empty file')
    }

    if (!allowedMimetypes.includes(mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Invalid mimetype. Only ${allowedMimetypes.join(
          ', ',
        )} types are allowed`,
      )
    }

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination)
    }

    const filePath = `${destination}/${rename(filename)}`
    const writeStream = fs.createWriteStream(filePath)

    await this.pump(file, writeStream)

    if (file.truncated) {
      await this.deleteFile(filePath)
      throw new BadRequestException(
        `File is too large. Max: ${maxFileSize} bytes`,
      )
    }

    return filePath
  }

  async deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}
