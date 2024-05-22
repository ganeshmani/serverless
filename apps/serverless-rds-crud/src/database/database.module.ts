import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import User from '../user/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [User],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
