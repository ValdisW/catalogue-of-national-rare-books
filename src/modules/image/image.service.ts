import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly bookRepository: Repository<Image>,
  ) {}
  getAllImages() {
    return this.bookRepository.find({
      select: ['id', 'folder', 'filename', 'allowed'],
    });
  }

  getBookRelatedImages(bookID: string) {
    return this.bookRepository.find({
      select: ['folder', 'filename', 'allowed'],
      where: { id: bookID },
    });
  }
}
