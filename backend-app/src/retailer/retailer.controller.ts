import {Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {RetailerService} from './retailer.service';
import {WarrantyDTO} from '../shared/warranty/warranty.dto';
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {RolesGuard} from "../user/role/roles.guard";
import {Roles} from "../user/role/roles.decorator";
import {Role} from "../user/role/users.role.enum";

@Controller('retailer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
export class RetailerController {
    constructor(private readonly retailerService: RetailerService) {
    }

    @Get('/warranties')
    public async findAllWarranties(@Req() request, @Res() response): Promise<Array<WarrantyDTO>> {
        const warranties = await this.retailerService.findAllWarranties(request.headers.authorization);
        return response.status(HttpStatus.OK).json(warranties);
    }

    @Get('/warranty-history/:id')
    public async getWarrantyHistory(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.retailerService.getWarrantyHistory(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Get('/warranty/:id')
    public async findWarrantyById(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const warranty = await this.retailerService.findWarrantyById(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(warranty);
    }

    @Post('/warranty')
    public async createWarranty(@Req() request, @Res() response, @Body() warranty: WarrantyDTO): Promise<WarrantyDTO> {
        const createdWarranty = await this.retailerService.createWarranty(request.headers.authorization, warranty);
        return response.status(HttpStatus.CREATED).json(createdWarranty);
    }

    // PATCH can be applied here as well
    @Put('/assign-ownership')
    public async assignWarrantyOwnership(@Req() request, @Res() response, @Body() warranty: WarrantyDTO): Promise<WarrantyDTO> {
        const assignedWarranty = await this.retailerService.assignWarrantyOwnership(request.headers.authorization, warranty);
        return response.status(HttpStatus.OK).json(assignedWarranty);
    }

    // // PATCH can be applied here as well
    @Get('/terminate-ownership/:id')
    public async terminateWarrantyOwnership(@Req() request, @Res() response, @Param('id') id: string): Promise<WarrantyDTO> {
        const terminatedWarranty = await this.retailerService.terminateWarrantyOwnership(request.headers.authorization, id);
        return response.status(HttpStatus.OK).json(terminatedWarranty);
    }
}
