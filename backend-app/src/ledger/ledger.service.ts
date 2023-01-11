import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {Contract, Gateway, Wallet, Wallets} from 'fabric-network';
import * as path from 'path';

@Injectable()
export class LedgerService {


    private async getConnectedGateway(connectionProfilePath: string, wallet: Wallet, identityKey: string): Promise<Gateway> {
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: identityKey, discovery: {enabled: true, asLocalhost: true}});
        return gateway;
    }

    private async getWallet(walletPath: string): Promise<Wallet> {
        // Create a new file system based wallet for managing identities.
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        return wallet;
    }

    public async getContract(identityKey: string, organization: string): Promise<Contract> {
        try {
            const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-profile-${organization}.json`);
            const walletPath = path.join(process.cwd(), `/wallet/${organization}`);

            return await this.setupContract(ccpPath, walletPath,
                identityKey,
                "warranty-channel",
                "warranty-chaincode");
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }

    public async setupContract(connectionProfilePath: string, walletPath: string, identityKey: string, channelName: string, chaincodeName: string): Promise<Contract> {
        try {
            const wallet = await this.getWallet(walletPath);
            const identity = await wallet.get(identityKey);
            if (!identity) {
                console.log('An identity for the user "${identityKey}" does not exist in the wallet');
                console.log('Run the registerRetailerUser.ts application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = await this.getConnectedGateway(connectionProfilePath, wallet, identityKey);

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            return network.getContract(chaincodeName);
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }
}
