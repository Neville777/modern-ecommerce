import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

const ROLES = ['user', 'admin'] as const;

interface GeneratedUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  avatar?: string;
  createdAt?: Date;
  reviews?: number;
  purchases?: number;
}

export async function generateUsers(count: number): Promise<GeneratedUser[]> {
  const users: GeneratedUser[] = [];

  // Create a specific admin user first
  const adminUser: GeneratedUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: await hash('AdminPassword123!'),
    isAdmin: true,
    avatar: faker.image.avatar(),
    createdAt: new Date(),
    reviews: 0,
    purchases: 0,
  };
  users.push(adminUser);

  // Generate additional users if count > 1
  for (let i = 1; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user: GeneratedUser = {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
      }),
      password: await hash('password123'),
      isAdmin: false,
      avatar: faker.image.avatar(),
      createdAt: faker.date.past({ years: 1 }),
      reviews: faker.number.int({ min: 0, max: 15 }),
      purchases: faker.number.int({ min: 1, max: 20 }),
    };

    users.push(user);
  }

  return users;
}
