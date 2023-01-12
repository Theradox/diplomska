import {Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {WarrantyDTO} from "../shared/warranty/warranty.dto";
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {RolesGuard} from "./role/roles.guard";
import {Roles} from "./role/roles.decorator";
import {Role} from "./role/users.role.enum";
import { request } from 'http';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
export class UserController {


    constructor(private readonly userService: UserService) {
    }

    @Post('/warranty')
    public async createWarranty(@Req() request, @Res() response, @Body() warranty: WarrantyDTO): Promise<WarrantyDTO> {
        const createdWarranty = await this.userService.createWarranty(request.headers.authorization, warranty);
        return response.status(HttpStatus.CREATED).json(createdWarranty);
    }

    // PATCH can be applied here as well
    @Put('/assign-ownership')
    public async assignWarrantyOwnership(@Req() request, @Res() response, @Body() warranty: WarrantyDTO): Promise<WarrantyDTO> {
        const assignedWarranty = await this.userService.assignWarrantyOwnership(request.headers.authorization, warranty);
        return response.status(HttpStatus.OK).json(assignedWarranty);
    }

    @Get('/my-warranties')
    public async myWarranties(@Req() request, @Res() response) {
        const warranties = await this.userService.getMyWarranties(request.headers.authorization);
        return response.status(HttpStatus.OK).json(warranties);
    }

    @Get('/warranties')
    public async getAllWarranties(@Req() request, @Res() response) {
        const warranties = await this.userService.getAllWarranties(request.headers.authorization);
        return response.status(HttpStatus.OK).json(warranties);
    }

    @Get('/warranty/:id')
    public async getWarrantyDetails(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.userService.findWarrantyById(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Get('/warranty-history/:id')
    public async getWarrantyHistory(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.userService.getWarrantyHistory(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Get('/my-warranties/accept-warranty/:id')
    public async acceptWarrantyOwnership(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.userService.acceptWarrantyOwnership(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Get('/my-warranties/terminate-warranty/:id')
    public async terminateWarrantyOwnership(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.userService.terminateWarrantyOwnership(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Put('/my-warranties/transfer-warranty/')
    public async transferWarrantyOwnership(@Req() request,
                                           @Res() response,
                                           @Body() warranty: WarrantyDTO): Promise<WarrantyDTO> {
        const result = await this.userService.transferWarrantyOwnership(request.headers.authorization, warranty);
        return response.status(HttpStatus.OK).json(result);
    }

}
