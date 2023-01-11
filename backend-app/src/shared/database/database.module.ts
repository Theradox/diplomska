import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {User} from "../../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_host'),
                port: configService.get('DB_port'),
                username: configService.get('DB_username'),
                password: configService.get('DB_password'),
                database: configService.get('DB_database'),
                entities: [User],
                synchronize: true,
            }),
            
        }),
    ],
})
export class DatabaseModule {}
