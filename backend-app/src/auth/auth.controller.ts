import {Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {User} from "../user/user.entity";
import {OrganizationEnum} from "../shared/warranty/organization.enum";
import {JwtAuthGuard} from "./jwt/jwt-auth.guard";
import {RolesGuard} from "../user/role/roles.guard";
import {Roles} from "../user/role/roles.decorator";
import {Role} from "../user/role/users.role.enum";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/test-JWT')
    async testPathJWT(@Req() request) {
        return 'request.headers.authentication';
    }

    @Post('/login')
    async login(@Res() response, @Body() user: User) {
        const loggedInUser = await this.authService.login(user);
        return response.status(HttpStatus.OK).json(loggedInUser);
    }

    @Post('/register')
    async register(@Res() response, @Body() user: User) {
        const createdUser = await this.authService.register(user);
        return response.status(HttpStatus.CREATED).json(createdUser);
    }

    @Post('/registerAdmin')
    async registerAdmin(@Res() response, @Body() user: User) {
        const createdUser = await this.authService.registerAdmin(user);
        return response.status(HttpStatus.CREATED).json(createdUser);
    }
    @Post('/add')
    async addUser(@Body() user: User) {
        return await this.authService.createUser(user);
    }

    @Get('/users')
    async findUsers() {
        return await this.authService.getUsers();
    }

    @Post('create-admin/:organizationType')
    async createAdmin(@Param('organizationType') organizationType: OrganizationEnum) {
        return this.authService.createAdmin(organizationType);
    }
}
