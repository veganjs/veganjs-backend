import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StepEntity } from './entities/step.entity'
import { StepService } from './step.service'

@Module({
  imports: [TypeOrmModule.forFeature([StepEntity])],
  providers: [StepService],
})
export class StepsModule {}
