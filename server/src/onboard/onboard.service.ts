import { Inject, Injectable } from '@nestjs/common'
import { User } from 'src/auth/user.types'
import { ChartsService } from 'src/charts/charts.service'
import { DashboardsService } from 'src/dashboards/dashboards.service'
import { QueriesService } from 'src/queries/queries.service'
import { ResourcesService } from 'src/resources/resources.service'
import { GettingStartedSteps } from './data/getting-started'

@Injectable()
export class OnboardService {
  constructor(
    @Inject(ResourcesService)
    private resourcesSerivce: ResourcesService,
    @Inject(QueriesService)
    private queriesService: QueriesService,
    @Inject(ChartsService)
    private chartsService: ChartsService,
    @Inject(DashboardsService)
    private dashboardsService: DashboardsService,
  ) {}

  async getSteps(user: User) {
    const resources = await this.resourcesSerivce.getAllResources(user)
    const queries = await this.queriesService.getAllHistory({}, user)
    const charts = await this.chartsService.getAllCharts({}, user)
    const dashboards = await this.dashboardsService.getAllDashboards(user)

    return GettingStartedSteps.map(step => {
      if (step.id === 1) {
        return { ...step, completed: resources.length > 0 }
      } else if (step.id === 2) {
        return { ...step, completed: queries.items.length > 0 }
      } else if (step.id === 3) {
        return { ...step, completed: charts.length > 0 }
      } else if (step.id === 4) {
        return { ...step, completed: dashboards.length > 0 }
      } else {
        return step
      }
    })
  }
}
