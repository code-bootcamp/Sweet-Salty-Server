import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import * as sharp from 'sharp';
import got from 'got';

interface IFile {
  file: FileUpload;
}

@Injectable()
export class ImageService {
  constructor(
    //
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async upload({ file }: IFile) {
    const storage = new Storage({
      keyFilename: this.config.get('STORAGE_KEY_FILENAME'),
      projectId: this.config.get('STORAGE_PROJECT_ID'),
    }).bucket(this.config.get('STORAGE_BUCKET'));

    const url = await new Promise((resolve, reject) => {
      const uuid = uuidv4();
      file
        .createReadStream()
        .pipe(sharp().webp({ effort: 1 }))
        .pipe(storage.file(uuid + '.webp').createWriteStream())
        .on('finish', () =>
          resolve(`${process.env.STORAGE_BUCKET}/${uuid}.webp`),
        )
        .on('error', (error) => reject(error));
    });

    return url;

  }

  async getBarcode() {
    const storage = new Storage({
      keyFilename: this.config.get('STORAGE_KEY_FILENAME'),
      projectId: this.config.get('STORAGE_PROJECT_ID'),
    }).bucket(this.config.get('STORAGE_BUCKET'));

    const random = String(Math.floor(Math.random() * 10 ** 12)).padStart(
      12,
      '0',
    );
    const textNumber = random.toString().replace(/\B(?=(\d{4})+(?!\d))/g, ' ');


    const barcodeImg = await this.httpService
      .get('https://bwipjs-api.metafloor.com/', {
        params: {
          bcid: 'code128',
          text: textNumber,
          scale: 3,
          includetext: true,
          textxalign: 'center',
          backgroundcolor: 'FFFFFF',
        },
      })
      .toPromise();


    const url = barcodeImg.request.res.responseUrl;

    const data = await new Promise((resolve) => {
      ('11');
      const uuid = uuidv4();
      got
        .stream(url)
        .pipe(storage.file(uuid + '.jpg').createWriteStream())
        .on('finish', () =>
          resolve(`${process.env.STORAGE_BUCKET}/${uuid}.jpg`),
        );
    });

    return data;
  }


}
