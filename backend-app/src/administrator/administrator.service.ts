import {Injectable} from '@nestjs/common';
import {LedgerService} from "../ledger/ledger.service";
import {WarrantyModel} from "../shared/warranty/warranty.interface";
import {AuthService} from "../auth/auth.service";

const organizationType: string = 'administrator';
@Injectable()
export class AdministratorService {
    private ledgerService: LedgerService;
    private authService: AuthService;
    organization: string = "administrator";

    constructor(ledgerService: LedgerService, authService: AuthService) {
        this.ledgerService = ledgerService;
        this.authService = authService;
    }

    public async findAllWarranties(identityKey: string): Promise<Array<WarrantyModel>> {
        let result;
        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
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

    public async getWarrantiesByOwner(identityKey: string, warrantyOwner: string): Promise<Array<WarrantyModel>> {
        let result;
        const owner = this.authService.extractUsername(identityKey);
        await this.ledgerService.getContract(owner, this.organization).then(

            async contract => {
                result = await contract.evaluateTransaction('QueryWarrantiesByOwner', warrantyOwner);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            })
            .catch(e => {
                console.log(e);
            });
        return JSON.parse(result);
    }

    public async getWarrantyHistory(identityKey: string, id: string): Promise<WarrantyModel> {
        let result;
        await this.ledgerService.getContract(
            this.authService.extractUsername(identityKey),
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
}
