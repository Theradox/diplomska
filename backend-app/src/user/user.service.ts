import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LedgerService } from "../ledger/ledger.service";
import { AuthService } from "../auth/auth.service";
import { WarrantyModel } from "../shared/warranty/warranty.interface";
import { WarrantyDTO } from "../shared/warranty/warranty.dto";

const organizationType: string = 'user';
@Injectable()
export class UserService {

    private ledgerService: LedgerService;
    private authService: AuthService;
    organization: string = "user";


    constructor(ledgerService: LedgerService, authService: AuthService) {
        this.ledgerService = ledgerService;
        this.authService = authService;
    }

    async getAllWarranties(identityKey: string) {
        let result;
        const owner = this.authService.extractUsername(identityKey);
        await this.ledgerService.getContract(owner, this.organization).then(
            async contract => {
                result = await contract.evaluateTransaction('GetAllWarranties');
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    async getMyWarranties(identityKey: string) {
        let result;
        const owner = this.authService.extractUsername(identityKey);
        await this.ledgerService.getContract(owner, this.organization).then(
            async contract => {
                result = await contract.evaluateTransaction('QueryWarrantiesByOwner', owner);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    public async findWarrantyById(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
            this.organization
        ).then(
            async contract => {
                result = await contract.evaluateTransaction('RetrieveWarrantyDetails', id);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    public async getWarrantyHistory(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        const owner = this.authService.extractUsername(identityKey);
        await this.ledgerService.getContract(
            owner,
            this.organization
        ).then(
            async contract => {
                result = await contract.evaluateTransaction('GetHistoryForWarranty', id);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    async acceptWarrantyOwnership(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        const owner = this.authService.extractUsername(identityKey);
        await this.ledgerService.getContract(
            owner,
            this.organization
        ).then(
            async contract => {
                result = await contract.submitTransaction('AcceptWarrantyOwnership', id, owner);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
                return e.messageerror;
            });
        return JSON.parse(result);
    }

    public async terminateWarrantyOwnership(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
            this.organization
        ).then(
            async contract => {
                result = await contract.submitTransaction('TerminateWarrantyOwnership', id);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
                return e.messageerror;
            });
        return JSON.parse(result);
    }

    async transferWarrantyOwnership(identityKey: string, warrantyDTO: WarrantyDTO): Promise<WarrantyModel> {
        const owner = await this.authService.findByUsername(warrantyDTO.owner);

        if (!owner) {
            throw new NotFoundException(`Warranty cannot be transferred to non-existent owner`)
        }

        let result;
        const currentOwner = this.authService.extractUsername(identityKey);

        await this.ledgerService.getContract(
            currentOwner,
            this.organization
        ).then(
            async contract => {
                result = await contract.submitTransaction('TransferWarrantyOwnership', warrantyDTO.id.toString(), currentOwner, warrantyDTO.owner);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
                return e.messageerror;
            });
        return JSON.parse(result);
    }

    public async createWarranty(identityKey: string, warrantyModel: WarrantyModel): Promise<WarrantyModel> {
        let result;
        
        const initalOwner = this.authService.extractUsername(identityKey).toString();


        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
            this.organization
        ).then(
            async contract => {
                result = await contract.submitTransaction('CreateWarranty',
                    warrantyModel.id.toString(),
                    warrantyModel.issuer.toString(),
                    initalOwner,
                    warrantyModel.warrantyService.toString(),
                    warrantyModel.warrantyExpirationDate.toString());
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Create warranty failed: ' + e,
                }, HttpStatus.FORBIDDEN);
            });
        return JSON.parse(result);
    }

    public async assignWarrantyOwnership(identityKey: string, warrantyModel: WarrantyModel): Promise<WarrantyModel> {
        let result;
        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
            this.organization

        ).then(
            async contract => {
                result = await contract.submitTransaction('AssignWarrantyOwnership',
                    warrantyModel.id.toString(),
                    warrantyModel.owner.toString());
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }
}
