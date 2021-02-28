import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { OnboardService } from './onboard.service'

@Controller('onboard')
@UseGuards(AuthGuard)
export class OnboardController {
  constructor(private readonly onboardService: OnboardService) {}

  @Get()
  findAll(@GetUser() user) {
    return this.onboardService.getSteps(user)
  }
}
