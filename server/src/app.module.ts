import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthModule } from './health/health.module'
import { ResourcesModule } from './resources/resources.module'
import { QueriesModule } from './queries/queries.module'
import { AuthModule } from './auth/auth.module'
import { AuthMiddleware } from './auth/auth.middleware'
import { ChartsModule } from './charts/charts.module'
import { DashboardChartsModule } from './dashboard-charts/dashboard-charts.module'
import { DashboardsModule } from './dashboards/dashboards.module'
import { SettingsModule } from './settings/settings.module'
import { OnboardModule } from './onboard/onboard.module';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
      host: process.env.DB_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ResourcesModule,
    QueriesModule,
    AuthModule,
    ChartsModule,
    DashboardChartsModule,
    DashboardsModule,
    SettingsModule,
    OnboardModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
