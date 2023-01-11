
class Warranty {
    constructor(id, issuer, owner, warrantyStatus, warrantyService, warrantyIssueDate, warrantyExpirationDate) {
        this.id = id;
        this.issuer = issuer;
        this.owner = owner;
        this.warrantyStatus = warrantyStatus;
        this.warrantyService = warrantyService;
        this.warrantyIssueDate = warrantyIssueDate;
        this.warrantyExpirationDate = warrantyExpirationDate;
    }
}

module.exports = Warranty;
