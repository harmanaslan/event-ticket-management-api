import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../users/enums/role.enum';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new session (ADMIN only)' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get seat availability for a session' })
  getSeatAvailability(@Param('id') id: string) {
    return this.sessionsService.getSeatAvailability(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by id' })
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }
}
