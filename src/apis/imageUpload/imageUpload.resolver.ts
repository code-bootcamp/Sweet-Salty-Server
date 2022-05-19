import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageUploadService } from './imageUpload.service';

@Resolver()
export class ImageUploadResolver {
  constructor(
    //
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return await this.imageUploadService.upload({ file });
  }

  // @Mutation(() => String)
  // deleteFile(
  //   @Args('bucketName') bucketName: string,
  //   @Args('fileName') fileName: string,
  // ) {
  //   return this.boardImageService.delete({ bucketName, fileName });
  // }
}
