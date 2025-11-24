import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Admin } from './entities/admin.entity';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { CreateAdminDto } from './dto/create-admin.dto';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>
    ) { }

    async signup(dto: CreateAdminDto) {
        const user = await this.adminRepository.findOneBy({ email: dto.email });
        if (user) throw new BadRequestException("An admin with that e-mail already exists!");

        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(dto.password, salt, 32) as Buffer;
        const saltAndHash = `${salt}.${hash.toString('hex')}`;

        const newUser = {
            name: dto.name,
            email: dto.email,
            password: saltAndHash
        }

        const userCreated = this.adminRepository.create(newUser);
        await this.adminRepository.save(userCreated);

        const { password, ...result } = newUser;

        return result
    }

    async signin(dto: AuthDto) {
        const user = await this.adminRepository.findOneBy({ email: dto.email });
        if (!user) throw new UnauthorizedException("Invalid credentials!");

        const [salt, hash] = user.password.split('.');
        const compareHash = (await scrypt(dto.password, salt, 32)) as Buffer;

        if (compareHash.toString('hex') !== hash) throw new UnauthorizedException("Invalid credentials!");
        
        const { password, ...result } = user;
        return result
    }
}
