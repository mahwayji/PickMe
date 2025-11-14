import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ItemBlocksModule } from './item-blocks/item-blocks.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ItemsModule,
    ItemBlocksModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
