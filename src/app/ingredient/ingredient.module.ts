import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { IngredientEntity } from './entities/ingredient.entity'
import { IngredientController } from './ingredient.controller'
import { IngredientService } from './ingredient.service'

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity]), AuthModule],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
