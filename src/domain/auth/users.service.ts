import { Injectable } from "@nestjs/common";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Admin } from "./entities/admin.entity";
import { UsersRepository } from "./users.repository";
import { Filter } from "src/shared/apply-filters";

@Injectable()
export class UsersService {
    constructor(
        private readonly adminRepository: UsersRepository,
    ) { }

    async findAll(filter?: Filter, page?: number, limit?: number): Promise<[Admin[], number]> {
        return await this.adminRepository.filterAllPaginated(filter, page, limit);
    }

    async findOne(id: string) {
        return await this.adminRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                type: true
            }
        })
    }

    async update(id: string, dto: UpdateAdminDto) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return;
        this.adminRepository.merge(admin, dto);
        return await this.adminRepository.save(admin);
    }

    async remove(id: string) {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return;
        return await this.adminRepository.remove(admin);
    }
}
