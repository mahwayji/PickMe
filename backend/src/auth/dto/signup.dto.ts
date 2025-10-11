import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    description: 'User email',
    example: 'araiwa@gmail.com',
  })
  email: string;

    @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  password: string;

}