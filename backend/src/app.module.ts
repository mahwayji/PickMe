import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ItemBlocksModule } from './item-blocks/item-blocks.module';
import { ProfileModule } from './profile/profile.module';
import { SectionModule } from './section/section.module';
import { FeedModule } from './feed/feed.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ItemsModule,
    ItemBlocksModule,
    ProfileModule,
    SectionModule,
    FeedModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
