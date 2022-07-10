import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IngredientService } from './ingredient.service'
import { IngredientController } from './ingredient.controller'
import { IngredientEntity } from './ingredient.entity'

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity])],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
