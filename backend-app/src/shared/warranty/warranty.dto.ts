import {WarrantyModel} from "./warranty.interface";

export class WarrantyDTO implements WarrantyModel {

    id: number;

    issuer: string;

    owner: string;

    warrantyStatus: string;

    warrantyService: string;

    warrantyIssueDate: Date;

    warrantyExpirationDate: Date;
}
