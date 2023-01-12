import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {AdministratorService} from "./administrator.service";
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {RolesGuard} from "../user/role/roles.guard";
import {Roles} from "../user/role/roles.decorator";
import {Role} from "../user/role/users.role.enum";
import { WarrantyDTO } from 'src/shared/warranty/warranty.dto';

@Controller('administrator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdministratorController {

    constructor(private readonly administratorService: AdministratorService) {
    }

    @Get('/warranties')
    public async getAllWarranties(@Req() req): Promise<Array<WarrantyDTO>> {
        return this.administratorService.findAllWarranties(req.headers.authorization);
    }

    @Get('/warranties/:id')
    public async getWarrantyDetails(@Req() req, @Param('id') id: string): Promise<WarrantyDTO> {
        return this.administratorService.findWarrantyById(req.headers.authorization, id);
    }

    @Get('/warranties/:owner')
    public async getWarrantiesByOwner(@Req() req, @Param('owner') owner: string): Promise<Array<WarrantyDTO>> {
        return this.administratorService.getWarrantiesByOwner(req.headers.authorization, owner);
    }

    @Get('/warranties/:id/history')
    public async getWarrantyHistory(@Req() req, @Param('id') id: string): Promise<WarrantyDTO> {
        return this.administratorService.getWarrantyHistory(req.headers.authorization, id);
    }


}
