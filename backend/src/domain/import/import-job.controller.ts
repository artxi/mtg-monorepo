import { Controller, Post, Get, Param, Body, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ImportJobService } from './import-job.service';
import { ImportJob } from './import-job.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateImportJobDto } from './dto/create-import-job.dto';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportJobController {
  constructor(private readonly importJobService: ImportJobService) {}

  @Get()
  async findAll(@Req() req): Promise<ImportJob[]> {
    const userId = req.user.userId;
    return this.importJobService.findAllByUser(userId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Req() req, @Body() body: CreateImportJobDto) {
    const userId = req.user.userId;
    return this.importJobService.create(userId, body);
  }

  @Get(':id')
  async findById(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.importJobService.findById(userId, id);
  }
}
