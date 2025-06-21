import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domain/user/user.module';
import { CollectionModule } from './domain/collection/collection.module';
import { ImportJobModule } from './domain/import/import-job.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    UserModule,
    CollectionModule,
    ImportJobModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
