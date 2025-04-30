import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Department } from './department/entities/department.entity';
import { SubDepartment } from './department/entities/sub-department.entity';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    // Load environment variables conditionally based on the environment
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env', // Only load .env in development
      isGlobal: true,
    }),

    // Configure JWT module with the secret from environment
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'), // Get secret from environment variable
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN ?? '7d', // Token expiration time
        },
      }),
      inject: [ConfigService],
    }),

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specify the ApolloDriver
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }: { req: Request }) => ({ req }), // Needed for extracting JWT from request
    }),

    // TypeORM configuration for PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(String(process.env.DATABASE_PORT ?? 5432), 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [User, Department, SubDepartment],
    }),

    // Import the Auth Module
    AuthModule,
    DepartmentModule,
  ],

  providers: [AppResolver],
})
export class AppModule {}
