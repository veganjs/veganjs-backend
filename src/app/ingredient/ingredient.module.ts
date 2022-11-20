import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { SearchModule } from '../search/search.module'
import { IngredientEntity } from './entities/ingredient.entity'
import IngredientSearchService from './ingredient-search.service'
import { IngredientController } from './ingredient.controller'
import { IngredientService } from './ingredient.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientEntity]),
    AuthModule,
    SearchModule,
  ],
  controllers: [IngredientController],
  providers: [IngredientService, IngredientSearchService],
})
export class IngredientModule {}
