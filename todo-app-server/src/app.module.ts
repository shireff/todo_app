import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigModule,
} from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://shireffn369:Br4QU1QPKTMO8ZX7@cluster0.sjv7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),

    AuthModule,
    UsersModule,
    CategoriesModule,
    TasksModule,
  ],
})
export class AppModule {}
