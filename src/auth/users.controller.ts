import { Body, Controller, Delete, Get, HttpCode, Inject, NotFoundException, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UsersService } from "./users.service";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("users")
export class UsersController {
    constructor(
        @Inject() private readonly usersService: UsersService
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        const user = this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        return user;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto,
    ) {
        const user = await this.usersService.update(id, updateAdminDto);
        if (!user) throw new NotFoundException();
        return user;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        const user = await this.usersService.remove(id);
        if (!user) throw new NotFoundException();
    }
}