import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Me } from 'src/auth/guards/me.guard';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    const post= await  this.prismaService.post.create({
      data: createPostDto,
    });
    return {
      status:true,
      message:"post created successfully",
      data:post
    }
  }

  async findAll() {
    const posts = await this.prismaService.post.findMany({
      include: {
        author: true,
      },
    });
    return {
      status: true,
      data: posts,
    };
  }

  async findOne(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
    return {
      status: true,
      data: post,
    };
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    return this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
