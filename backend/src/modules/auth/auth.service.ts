import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.model';
import { Business } from '../businesses/business.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Business)
    private businessModel: typeof Business,

    private sequelize: Sequelize, // 👈 ADD THIS
  ) {}

  // 🔹 REGISTER (CREATE BUSINESS + ADMIN USER)
  async register(email: string, password: string, businessName: string) {
    // 1️⃣ Check if user already exists
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // 2️⃣ Generate tenant schema name
    const schemaName = `tenant_${businessName.toLowerCase().replace(/\s+/g, '_')}`;

    // 3️⃣ Create business
    // 3️⃣ Check if business already exists
    let business = await this.businessModel.findOne({
      where: { schema_name: schemaName },
    });

    if (business) {
      throw new BadRequestException(
        'Business with this name already exists. Please login instead.',
      );
    }

    // 4️⃣ Create business
    business = await this.businessModel.create({
      name: businessName,
      schema_name: schemaName,
    });

    // 5️⃣ Create tenant schema & tables
    await this.createTenantSchema(schemaName);

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create admin user
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role: 'ADMIN',
      business_id: business.id,
    });

    // 6️⃣ Generate JWT
    return this.generateToken(user, business);
  }

  // 🔹 LOGIN
  async login(email: string, password: string) {
    // 1️⃣ Find user
    const user = await this.userModel.findOne({
      where: { email },
      include: [Business],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2️⃣ Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3️⃣ Generate JWT
    return this.generateToken(user, user.business);
  }

  // 🔹 JWT GENERATION
  private generateToken(user: User, business: Business) {
    const payload = {
      userId: user.id,
      role: user.role,
      schema: business.schema_name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  private async createTenantSchema(schemaName: string) {
    // 1️⃣ Check if schema already exists
    const [results] = await this.sequelize.query(
      `
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name = :schemaName
    `,
      {
        replacements: { schemaName },
      },
    );

    if ((results as any[]).length > 0) {
      throw new Error('Tenant schema already exists');
    }

    // 2️⃣ Create schema
    await this.sequelize.query(`CREATE SCHEMA "${schemaName}"`);

    // 3️⃣ Create tenant tables
    await this.sequelize.query(`
    CREATE TABLE "${schemaName}".customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

    await this.sequelize.query(`
    CREATE TABLE "${schemaName}".tickets (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      status VARCHAR(50),
      priority VARCHAR(50),
      customer_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  }
}
