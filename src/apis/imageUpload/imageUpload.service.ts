import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { ImageUpload } from './entities/imageUpload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

interface IFile {
  file: FileUpload;
}
// 객체로 들어온 파일의 정보를 인터페이스화 시켜서 리졸버단에서 쓰던 자동완성을 서비스단에서도 쓸 수 있게 한다
@Injectable()
export class ImageUploadService {
  constructor(
    //
    @InjectRepository(ImageUpload)
    private readonly BoardImageRepository: Repository<ImageUpload>,
    private readonly config: ConfigService,
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

    const extension = file.filename.substring(file.filename.lastIndexOf('.'));
    return url;

    // const waitedFiles = await Promise.all(files);
    // console.log(waitedFiles);

    // const results = await Promise.all(
    //   waitedFiles.map((el) => {
    //     const uuid = uuidv4();
    //     const extension = el.filename.substring(el.filename.lastIndexOf('.'));

    //     return new Promise((resolve, reject) => {
    //       el.createReadStream()
    //         .pipe(storage.file(uuid + extension).createWriteStream())
    //         .on('finish', () =>
    //           resolve(
    //             `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${uuid}${extension}`,
    //           ),
    //         )
    //         .on('error', () => reject());
    //     });
    //   }),
    // );
    console.log(url);

    return url;
  }

  // async delete({ bucketName, fileName }) {
  //   const storage = new Storage({
  //     keyFilename: KEYFILENAME,
  //     projectId: PROJECTID,
  //   }).bucket(bucketName);

  //   async function deleteFile() {
  //     await storage.file(fileName).delete();
  //     console.log(`gs://${bucketName}/${fileName} deleted`);
  //   }
  //   deleteFile().catch(console.error);
  // }
}
