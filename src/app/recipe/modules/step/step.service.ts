import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { StepDto } from './dto/step.dto'
import { StepEntity } from './entities/step.entity'

@Injectable()
export class StepService {
  constructor(
    @InjectRepository(StepEntity)
    private readonly stepRepository: Repository<StepEntity>,
  ) {}

  private async getStepsByRecipeId(recipeId: string) {
    return await this.stepRepository.find({
      where: { recipeId },
    })
  }

  private prepareStep(payload: StepDto, recipeId: string, order: number) {
    const step = new StepEntity()

    step.order = order + 1
    step.recipeId = recipeId
    step.description = payload.description

    return step
  }

  async createSteps(payload: StepDto[], recipeId: string) {
    const steps = payload.map((step, order) =>
      this.prepareStep(step, recipeId, order),
    )
    return await this.stepRepository.save(steps)
  }

  async deleteSteps(recipeId: string) {
    const steps = await this.getStepsByRecipeId(recipeId)
    if (!steps.length) {
      throw new NotFoundException('Steps not found')
    }
    await this.stepRepository.remove(steps)
  }
}
