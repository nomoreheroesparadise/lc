import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterBodyDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    password: string;
}