import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { AdministratorModule } from './administrator/administrator.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        DatabaseModule,
        AuthModule,
        UserModule,
        AdministratorModule

    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
