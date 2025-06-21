import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportJob, ImportJobSchema } from './import-job.schema';
import { ImportJobService } from './import-job.service';
import { ImportJobController } from './import-job.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImportJob.name, schema: ImportJobSchema }]),
  ],
  controllers: [ImportJobController],
  providers: [ImportJobService],
  exports: [ImportJobService],
})
export class ImportJobModule {}
