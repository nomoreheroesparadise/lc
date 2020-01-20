import { Injectable, Scope } from '@nestjs/common';
import { encryptPdf } from '../utils/rsa';

export interface UserDetails {
  password: string;
  publicKey?: string;
}

@Injectable()
export class UsersService {
  private users = {};

  findOne(email: string): UserDetails | undefined {
    return this.users[email];
  }

  addUser(userBody: UserDetails, email: string): void {
    this.users = {...this.users, [`${email}`]: { ...userBody } };
  }

  addPublicKey(email: string, publicKey: string): void {
    const userDetails = this.findOne(email);
    this.users[email] = { ...userDetails, publicKey } ;
  }

  encrypt({ email }) {
    const userDetails = this.findOne(email);
    return encryptPdf(userDetails.publicKey);
  }
}
