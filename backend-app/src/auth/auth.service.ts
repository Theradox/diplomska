import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import * as FabricCAServices from "fabric-ca-client";
import { Wallets, X509Identity } from "fabric-network";
import * as fs from "fs";
import * as path from "path";
import { Repository } from "typeorm";
import { LedgerService } from "../ledger/ledger.service";
import { OrganizationEnum } from "../shared/warranty/organization.enum";
import { Role } from "../user/role/users.role.enum";
import { User } from "../user/user.entity";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private ledgerService: LedgerService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
    }

    async validateUser(user: User): Promise<any> {
        const validatedUser = await this.findByUsername(user.username);
        console.log(validatedUser)
        const isMatch = await bcrypt.compare(user.password, validatedUser.password);
        console.log(isMatch)
        if (validatedUser && isMatch) {
            const { password, ...result } = validatedUser;
            return result;
        }
        return null;
    }

    public async login(user: User): Promise<any | { status: number }> {
        return await this.validateUser(user).then((userData) => {
            if (!userData) {
                throw new NotFoundException(`User ${user.username} not found!`)
            }
            const payload = {
                sub: userData.id,
                email: userData.email,
                username: user.username,
                roles: userData.roles,
                // organization: user.organizationType
            };
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: jwtConstants.expiresIn,
                access_token: accessToken,
                user_id: payload.sub,
                roles: payload.roles,
                organization: userData.organizationType,
                status: 200
            };

        });
    }

    public async findByUsername(username: string): Promise<User> {

        return await this.userRepository.createQueryBuilder('user').select().where('user.username = :username', { username })
            .getOne();

        // return await getRepository(User)
        //     .createQueryBuilder('user')
        //     .select()
        //     .where('user.username = :username', {username})
        //     .getOne();
    }

    public async getUsers() {
        return await this.userRepository.find();
    }

    public async findByUsernameAndOrganization(username: string, organization: string): Promise<any> {
        return await this.userRepository.createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.username = :username", { username: username })
            .andWhere("user.organizationType = :organizationType", { organizationType: organization })
            .getOne();
    }

    extractUsername(accessToken: string): string {
        const token = accessToken.split(' ');
        const decodedTokenToString = JSON.stringify(this.jwtService.decode(token[1]));
        const jsonToken = JSON.parse(decodedTokenToString);
        return jsonToken.username;
    }

    public async register(user: User) {
        const existingUser = await this.findByUsernameAndOrganization(user.username, user.organizationType);
        console.log(existingUser)
        if (existingUser) {
            throw new BadRequestException(`User ${user.username} already exists`);
        }

        try {
            // load the network configuration
            const userOrganization = user.organizationType;
            const mspId = userOrganization.charAt(0).toUpperCase() + userOrganization.slice(1) + 'MSP';

            const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-profile-${userOrganization}.json`);
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities[`ca.${userOrganization}.com`].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), `/wallet/${userOrganization}`);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(user.username);
            if (userIdentity) {
                console.log('An identity for the user user.username" already exists in the wallet');
                return;
            }

            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollRetailerAdmin.ts application before retrying');
                return;
            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                affiliation: '',
                enrollmentID: user.username,
                role: 'client',
            }, adminUser);

            const enrollment = await ca.enroll({ enrollmentID: user.username, enrollmentSecret: secret, });

            const x509Identity: X509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: mspId,
                type: 'X.509',
            };
            await wallet.put(user.username, x509Identity);
            console.log('Successfully registered and enrolled admin user user.username" and imported it into the wallet');

        } catch (error) {
            console.error(`Failed to register user user.username": ${error}`);
            process.exit(1);
        }

        if (user.organizationType === OrganizationEnum.ADMINISTRATOR) {
            user.roles = Role.Admin;
        } else {
            user.roles = Role.User;
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        return this.userRepository.save(user);
    }

    public async registerAdmin(user: User) {
        const existingUser = await this.findByUsernameAndOrganization(user.username, 'admin');
        console.log(existingUser)
        if (existingUser) {
            throw new BadRequestException(`User ${user.username} already exists`);
        }

        try {
            // load the network configuration
            const userOrganization = 'org1';
            const mspId = userOrganization.charAt(0).toUpperCase() + userOrganization.slice(1) + 'MSP';

            const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-profile-${userOrganization}.json`);
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities[`ca.${userOrganization}.com`].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), `/wallet/${userOrganization}`);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(user.username);
            if (userIdentity) {
                console.log('An identity for the user user.username" already exists in the wallet');
                return;
            }

            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollRetailerAdmin.ts application before retrying');
                return;
            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                affiliation: '',
                enrollmentID: user.username,
                role: 'client',
            }, adminUser);

            const enrollment = await ca.enroll({ enrollmentID: user.username, enrollmentSecret: secret, });

            const x509Identity: X509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: mspId,
                type: 'X.509',
            };
            await wallet.put(user.username, x509Identity);
            console.log('Successfully registered and enrolled admin user user.username" and imported it into the wallet');

        } catch (error) {
            console.error(`Failed to register user user.username": ${error}`);
            process.exit(1);
        }

        user.roles = Role.Admin;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        return this.userRepository.save(user);
    }


    public async createUser(user: User) {
        user.roles = Role.User;
        user.organizationType = OrganizationEnum.USER;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        return this.userRepository.save(user);
    }


    public async createAdmin(organizationType: OrganizationEnum) {
        try {
            // const organization = process.argv[2].toString().toLowerCase();
            const adminId = 'admin';
            const adminOrganization = organizationType;
            const mspId = adminOrganization.charAt(0).toUpperCase() + adminOrganization.slice(1) + 'MSP';
            console.log(adminId + adminOrganization + mspId)
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-profile-${adminOrganization}.json`);
            console.log(ccpPath)
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            console.log('CCP : ' + ccp)

            // Create a new CA client for interacting with the CA.
            const caInfo = ccp.certificateAuthorities[`ca.${adminOrganization}.com`];
            const caTLSCACerts = caInfo.tlsCACerts;
            const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);
            console.log(caInfo + caTLSCACerts + ca)
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), `/wallet/${adminOrganization}`);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            console.log(wallet)
            // Check to see if we've already enrolled the admin user.
            console.log('333' + caInfo)

            const identity = await wallet.get(adminId);
            if (identity) {
                console.log('An identity for the admin user already exists in the wallet');
                return;
            }
            console.log(identity)
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: 'adminpw' });
            console.log('111')
            console.log('enrolment ' + enrollment)
            const x509Identity: X509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: mspId,
                type: 'X.509',
            };
            await wallet.put(adminId, x509Identity);
            console.log('Successfully enrolled admin user and imported it into the wallet');

        } catch (error) {
            console.error(`Failed to enroll admin user: ${error}`);
            process.exit(1);
        }

    }

}
