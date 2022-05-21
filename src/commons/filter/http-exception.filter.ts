import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const state = exception.getStatus();
    const message = exception.message;
    console.log(`에러내용 : ${message}`);
    console.log(`에러코드 : ${state}`);
  }
}
