import { Controller, Get, Req, Res } from '@nestjs/common';
import { IamportService } from './iamport.service';

@Controller('/')
export class IamportController {
  constructor(
    //
    private readonly iamportService: IamportService,
  ) {}
  @Get('/test')
  async iamportGetToken(
    //
    @Req() req,
    @Res() res,
  ) {
    const token = await this.iamportService.getToken();

    //  console.log(token.response.access_token);

    return token;
  }

  @Get('/tes')
  async iamportGetData(
    //
    @Req() req,
    @Res() res,
  ) {
    const token = await this.iamportGetToken(req, res);
    const data = await this.iamportService.get_data_with_impUid({
      token,
      impUid: 'imp_568386235783',
    });

    console.log(data);
    //console.log(data);
    return data;
  }

  @Get('/tess')
  async iamportGet(
    //
    @Req() req,
    @Res() res,
  ) {
    const token = await this.iamportGetToken(req, res);
    const data = await this.iamportService.get_Data_with_merchant_uid({
      token,
      merchant_uid: 'a7b1ab28-b668-4b18-a7e4-8525932131f6',
    });

    //console.log(data);
    return data;
  }

  // @Get('/cancel')
  // async cancelMoney(@Req() req, @Res() res) {
  //   const token = await this.iamportGetToken(req, res);
  //   const cancel = await this.iamportService.CancelPayment({
  //     token,
  //     imp_uid: 'ss',
  //   });

  //   return cancel;
  // }
}
