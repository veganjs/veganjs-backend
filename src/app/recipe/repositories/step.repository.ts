import { NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

import { CustomRepository } from '~/shared/lib/typeorm-ex'

import { CreateStepDto } from '../dto/step/create-step.dto'
import { StepEntity } from '../entities/step.entity'

@CustomRepository(StepEntity)
export class StepRepository extends Repository<StepEntity> {
  private async getStepsByRecipeId(recipeId: string) {
    return await this.find({
      where: { recipeId },
    })
  }

  private prepareStep(payload: CreateStepDto, recipeId: string, order: number) {
    const step = new StepEntity()

    step.order = order + 1
    step.recipeId = recipeId
    step.description = payload.description

    return step
  }

  async createSteps(payload: CreateStepDto[], recipeId: string) {
    const steps = payload.map((step, order) =>
      this.prepareStep(step, recipeId, order),
    )
    return await this.save(steps)
  }

  async deleteSteps(recipeId: string) {
    const steps = await this.getStepsByRecipeId(recipeId)
    if (!steps.length) {
      throw new NotFoundException('Steps not found')
    }
    await this.remove(steps)
  }
}
