import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { ImageUpload } from './entities/imageUpload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

interface IFile {
  files: FileUpload[];
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
  async upload({ files }: IFile) {
    const storage = new Storage({
      keyFilename: this.config.get('STORAGE_KEY_FILENAME'),
      projectId: this.config.get('STORAGE_PROJECT_ID'),
    }).bucket(this.config.get('STORAGE_BUCKET'));

    const waitedFiles = await Promise.all(files);

    const results = await Promise.all(
      waitedFiles.map((el) => {
        const uuid = uuidv4();
        const extension = el.filename.substring(el.filename.lastIndexOf('.'));
        console.log(uuid);
        console.log(extension);
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(uuid + extension).createWriteStream())
            .on('finish', () =>
              resolve(
                `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${uuid}${extension}`,
              ),
            )
            .on('error', () => reject());
        });
      }),
    );
    console.log(results);

    return results;
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
