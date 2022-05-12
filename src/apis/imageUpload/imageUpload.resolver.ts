import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageUploadService } from './imageUpload.service';

@Resolver()
export class ImageUploadResolver {
  constructor(
    //
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return this.imageUploadService.upload({ files });
  }

  // @Mutation(() => String)
  // deleteFile(
  //   @Args('bucketName') bucketName: string,
  //   @Args('fileName') fileName: string,
  // ) {
  //   return this.boardImageService.delete({ bucketName, fileName });
  // }
}
