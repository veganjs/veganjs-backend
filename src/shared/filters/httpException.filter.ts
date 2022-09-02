import {
  Catch,
  Logger,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

interface ExceptionResponse {
  statusCode: number
  message: string | string[]
  error: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp()
      const req = ctx.getRequest<FastifyRequest>()
      const res = ctx.getResponse<FastifyReply>()
      const { statusCode, message } =
        exception.getResponse() as ExceptionResponse

      const response = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        message: message || 'Internal server error',
      }

      Logger.error(
        `${req.method} ${req.url}`,
        JSON.stringify(response),
        'HttpErrorFilter',
      )

      res.code(statusCode).send(response)
    }
  }
}
