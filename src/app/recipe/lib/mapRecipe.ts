import { UserEntity } from '../../user/entities/user.entity'
import { CategoryEntity } from '../../category/entities/category.entity'
import { RecipeDto } from '../dto/recipe.dto'
import { RecipeEntity } from '../entities/recipe.entity'

export function mapCreateRecipe(
  payload: RecipeDto,
  category: CategoryEntity,
  user: UserEntity,
) {
  const recipe = new RecipeEntity()

  recipe.title = payload.title
  recipe.description = payload.description
  recipe.source = payload.source
  recipe.servings = payload.servings
  recipe.preparationTime = payload.preparationTime
  recipe.cookingTime = payload.cookingTime
  recipe.category = category
  recipe.author = user

  return recipe
}
