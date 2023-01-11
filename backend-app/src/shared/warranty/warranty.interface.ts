import { ValidatorOptions } from "@nestjs/common/interfaces/external/validator-options.interface";

export interface WarrantyModel extends ValidatorOptions {
    id: number;
    issuer: string;
    owner: string;
    warrantyStatus: string;
    warrantyService: string;
    warrantyIssueDate: Date;
    warrantyExpirationDate: Date;
}
