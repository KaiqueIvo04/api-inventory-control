import { ConflictException, Injectable } from "@nestjs/common";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Admin } from "./entities/admin.entity";
import { UsersRepository } from "./users.repository";
import { Filter } from "src/shared/apply-filters";

@Injectable()
export class UsersService {
    constructor(
        private readonly adminRepository: UsersRepository,
    ) { }


    async exists(filter: Filter): Promise<boolean> {
        return await this.adminRepository.filterExists(filter);
    }

    async findAll(filter?: Filter, page?: number, limit?: number): Promise<Admin[]> {
        return await this.adminRepository.filterAllPaginated(filter, page, limit);
    }

    async findOne(id: string): Promise<Admin | null> {
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

    async update(id: string, dto: UpdateAdminDto): Promise<Admin | null> {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return;

        if (dto.email && dto.email !== admin.email) {
            const emailExists = await this.exists({ email: dto.email });
            if (emailExists) {
                throw new ConflictException(`An admin with that e-mail already exists!`);
            }
        }
        this.adminRepository.merge(admin, dto);
        return await this.adminRepository.save(admin);
    }

    async remove(id: string): Promise<Admin | null> {
        const admin = await this.adminRepository.findOneBy({ id });
        if (!admin) return;
        return await this.adminRepository.remove(admin);
    }
}
