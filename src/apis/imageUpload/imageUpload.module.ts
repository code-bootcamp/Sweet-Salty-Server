import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUploadResolver } from './imageUpload.resolver';
import { ImageUploadService } from './imageUpload.service';
import { ImageUpload } from './entities/imageUpload.entity';

@Module({
  //
  imports: [TypeOrmModule.forFeature([ImageUpload])],
  providers: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
