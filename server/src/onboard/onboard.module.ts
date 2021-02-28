import { forwardRef, Module } from '@nestjs/common'
import { ResourcesModule } from 'src/resources/resources.module'
import { AuthModule } from 'src/auth/auth.module'
import { QueriesModule } from 'src/queries/queries.module'
import { ChartsModule } from 'src/charts/charts.module'
import { DashboardsModule } from 'src/dashboards/dashboards.module'
import { OnboardService } from './onboard.service'
import { OnboardController } from './onboard.controller'

@Module({
  imports: [
    forwardRef(() => ResourcesModule),
    forwardRef(() => QueriesModule),
    forwardRef(() => ChartsModule),
    forwardRef(() => DashboardsModule),
    AuthModule,
  ],
  controllers: [OnboardController],
  providers: [OnboardService],
})
export class OnboardModule {}
