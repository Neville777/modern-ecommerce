import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserSeedCommand {
  constructor(private readonly usersService: UsersService) {}

  @Command({
    command: 'users:seed',
    describe: 'Seed users into the database',
  })
  async seed() {
    try {
      // First, delete existing users
      await this.usersService.deleteMany();

      // Generate users (1 admin + additional if specified)
      const users = await this.usersService.generateUsers(2);

      console.log('Users seeded successfully:');
      users.forEach(user => {
        console.log(
          `User - Email: ${user.email}, Name: ${user.name}, Admin: ${user.isAdmin}`,
        );
      });

      process.exit(0);
    } catch (error) {
      console.error('Error seeding users:', error);
      process.exit(1);
    }
  }
}
