import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ItemBlocksModule } from './item-blocks/item-blocks.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ItemsModule,
    ItemBlocksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
