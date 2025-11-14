import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ItemBlocksModule } from './item-blocks/item-blocks.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ItemsModule,
    ItemBlocksModule,
    SectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
