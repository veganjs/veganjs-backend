import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

import { Role } from '../../auth/auth.types'
import { RecipeService } from '../recipe.service'

@Injectable()
export class RecipeOwnerGuard implements CanActivate {
  constructor(private readonly recipeService: RecipeService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest()

    if (!user || !params) {
      return false
    }

    if (user.roles?.includes(Role.ADMIN)) {
      return true
    }

    return this.recipeService
      .getRecipeById(params.id)
      .then((recipe) => recipe.author.id === user.id)
  }
}
