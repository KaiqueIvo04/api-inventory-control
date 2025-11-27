import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Admin } from "./entities/admin.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
        private readonly jwtService: JwtService
    ) { }
    findAll() {
        return this.adminRepository.find();
    }

    findOne(id: string) {
        return this.adminRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
    }

    async update(id: string, dto: UpdateAdminDto) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return null;
        this.adminRepository.merge(admin, dto);
        return this.adminRepository.save(admin);
    }

    async remove(id: string) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return null;
        return this.adminRepository.remove(admin);
    }
}
