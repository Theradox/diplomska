const {Contract} = require("fabric-contract-api");
const Warranty = require("./warranty");
const WarrantyStatus = require("./warrantyStatus");

class WarrantyContract extends Contract {
    constructor() {
        super("WarrantyContract");
    }

    async instantiate() {
    }

    /**
     * Retrieves information for all created warranties
     *
     * @param ctx the transaction context
     * @returns details for all warranties
     */
    async GetAllWarranties(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    /**
     * Retrieves information for a warranty
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @returns details for the warranty
     */
    async RetrieveWarrantyDetails(ctx, warrantyId) {
        let warranty = await ctx.stub.getState(warrantyId);
        if (!warranty || !warranty.length) {
            throw new Error('Warranty ' + warrantyId + ' not found');
        }
        return JSON.parse(warranty.toString());
    }

    async QueryWarrantiesByOwner(ctx, owner) {
        let queryString = {};
        queryString.selector = {};
        // queryString.selector.docType = 'asset';
        queryString.selector.owner = owner;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
    }

    // GetQueryResultForQueryString executes the passed in query string.
    // Result set is built and returned as a byte array containing the JSON results.
    async GetQueryResultForQueryString(ctx, queryString) {

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this._GetAllResults(resultsIterator, false);

        return JSON.stringify(results);
    }

    // This is JavaScript so without Funcation Decorators, all functions are assumed
    // to be transaction functions
    //
    // For internal functions... prefix them with _
    async _GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

    /**
     * Creates a warranty
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @param warrantyIssuer issuer of the warranty (Retailer)
     * @Param warrantyOwner owner of the warranty
     * @param warrantyService servicer of the warranty (Service or Retailer)
     * @param warrantyExpirationDate date of expiration of the warranty
     * @returns details for the created warranty
     */
    async CreateWarranty(ctx, warrantyId, warrantyIssuer, warrantyOwner, warrantyService, warrantyExpirationDate) {

        // Check minter authorization 
        const clientMSPID = ctx.clientIdentity.getMSPID();
        // if (clientMSPID !== 'RetailerMSP') {
        //     throw new Error('client is not authorized to create new warranty');
        // }

        // const owner = ctx.clientIdentity.getID();

        let warranty = new Warranty();
        let initialWarrantyStatus = WarrantyStatus.CREATED;
        let warrantyIssueDate = await ctx.stub.getDateTimestamp();
        warranty.id = warrantyId;
        warranty.issuer = warrantyIssuer;
        warranty.owner = warrantyOwner;
        warranty.warrantyStatus = initialWarrantyStatus;
        warranty.warrantyService = warrantyService;
        warranty.warrantyIssueDate = warrantyIssueDate;
        warranty.warrantyExpirationDate = warrantyExpirationDate;

        await ctx.stub.putState(warrantyId.toString(), Buffer.from(JSON.stringify(warranty)));
        return JSON.stringify(warranty);
    }

    /**
     * Assigns the warranty to a user
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @param warrantyOwner owner of the warranty
     * @returns details for the warranty with an assigned owner
     */
    async AssignWarrantyOwnership(ctx, warrantyId, warrantyOwner) {
        let warrantyAsBytes = await ctx.stub.getState(warrantyId);

        if (!warrantyAsBytes || !warrantyAsBytes.length) {
            throw new Error('Warranty ' + warrantyId + ' not found');
        }

        const warranty = JSON.parse(warrantyAsBytes.toString());

        if (warranty.warrantyStatus === WarrantyStatus.ASSIGNED) {
            throw new Error('Warranty ' + warrantyId + ' is already assigned')
        }
        warranty.owner = warrantyOwner;
        warranty.warrantyStatus = WarrantyStatus.ASSIGNED;

        await ctx.stub.putState(warrantyId.toString(), Buffer.from(JSON.stringify(warranty)));
        return JSON.stringify(warranty);
    }

    /**
     * Warranty is accepted by the assigned user
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @param warrantyOwner owner of the warranty
     * @returns details for the warranty with the accepted owner
     */
    async AcceptWarrantyOwnership(ctx, warrantyId, warrantyOwner) {
        let warrantyAsBytes = await ctx.stub.getState(warrantyId);

        if (!warrantyAsBytes || !warrantyAsBytes.length) {
            throw new Error('Warranty ' + warrantyId + ' not found');
        }

        const warranty = JSON.parse(warrantyAsBytes.toString());

        if (warranty.warrantyStatus === WarrantyStatus.ACCEPTED) {
            throw new Error('Warranty ' + warrantyId + ' is already accepted');
        }
        if (warranty.owner !== warrantyOwner) {
            throw new Error('Warranty ' + warrantyId + ' cannot be accepted by non-assigned user');
        }
        warranty.warrantyStatus = WarrantyStatus.ACCEPTED;
        await ctx.stub.putState(warrantyId.toString(), Buffer.from(JSON.stringify(warranty)));
        return JSON.stringify(warranty);
    }

    /**
     * Warranty is terminated by the warranty owner
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @returns details for the terminated warranty
     */
    async TerminateWarrantyOwnership(ctx, warrantyId) {
        let warrantyAsBytes = await ctx.stub.getState(warrantyId);

        if (!warrantyAsBytes || !warrantyAsBytes.length) {
            throw new Error('Warranty ' + warrantyId + ' not found');
        }

        const warranty = JSON.parse(warrantyAsBytes.toString());

        if (warranty.warrantyStatus === WarrantyStatus.TERMINATED) {
            throw new Error('Warranty ' + warrantyId + ' is already terminated');
        }
        warranty.warrantyStatus = WarrantyStatus.TERMINATED;

        await ctx.stub.putState(warrantyId.toString(), Buffer.from(JSON.stringify(warranty)));
        return JSON.stringify(warranty);
    }

    /**
     * Transfers warranty ownership between two users
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @param currentWarrantyOwner current owner of the warranty
     * @param newWarrantyOwner new owner of the warranty
     * @returns details for the warranty with the new owner
     */
    async TransferWarrantyOwnership(ctx, warrantyId, currentWarrantyOwner, newWarrantyOwner) {
        let warrantyAsBytes = await ctx.stub.getState(warrantyId);

        if (!warrantyAsBytes || !warrantyAsBytes.length) {
            throw new Error('Warranty ' + warrantyId + ' not found');
        }

        const warranty = JSON.parse(warrantyAsBytes.toString());

        if (warranty.owner !== currentWarrantyOwner) {
            throw new Error('Warranty ' + warrantyId + ' is not owned by ' + currentWarrantyOwner + ' therefore cannot be transferred');
        }
        if (currentWarrantyOwner === newWarrantyOwner || warranty.owner === newWarrantyOwner) {
            throw new Error('Warranty ' + warrantyId + ' cannot be transferred to the same owner');
        }
        warranty.owner = newWarrantyOwner;

        await ctx.stub.putState(warrantyId.toString(), Buffer.from(JSON.stringify(warranty)));
        return JSON.stringify(warranty);
    }


    // todo create logic behind the transfer / add a field. Or we can just use the transferWarrantyOwnerhsip
    // async acceptWarrantyTransfer(ctx, warrantyId, acceptingWarrantyOwner) {
    //     let warranty = this.retrieveWarrantyDetails(ctx, warrantyId);
    //
    //     if (warranty.owner !== acceptingWarrantyOwner) {
    //         throw new Error('Accepting owner' + acceptingWarrantyOwner + ' does not own the warranty');
    //     }
    //     await ctx.stub.putState()
    // }

    /**
     * Retrieves all history for a warranty
     *
     * @param ctx the transaction context
     * @param warrantyId the id of the warranty
     * @returns historical details for the warranty
     */
    async GetHistoryForWarranty(ctx, warrantyId) {
        let iterator = await ctx.stub.getHistoryForKey(warrantyId);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return result;
    }
}

exports.contracts = [WarrantyContract];
