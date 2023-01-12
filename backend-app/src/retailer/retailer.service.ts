import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {WarrantyModel} from '../shared/warranty/warranty.interface';
import {LedgerService} from "../ledger/ledger.service";
import {AuthService} from "../auth/auth.service";

const organizationType: string = 'retailer';
@Injectable()
export class RetailerService {
    organization: string = "retailer";

    constructor(private ledgerService: LedgerService, private authService: AuthService) {
    }

    public async findAllWarranties(identityKey: string): Promise<Array<WarrantyModel>> {
        let result;
        const currentOwner = this.authService.extractUsername(identityKey);

        await this.ledgerService.getContract(
            currentOwner,
            this.organization
        ).then(
            async contract => {
                result = await contract.evaluateTransaction('GetAllWarranties');
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    public async getWarrantyHistory(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        const currentOwner = this.authService.extractUsername(identityKey);

        await this.ledgerService.getContract(
            currentOwner,
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

    public async findWarrantyById(identityKey: string, id: string): Promise<WarrantyModel | any> {
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
                    error: 'Create warranti failed: ' + e,
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

    public async terminateWarrantyOwnership(identityKey: string, id: string): Promise<WarrantyModel | any> {
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
}
