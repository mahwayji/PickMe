import { ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class sectionDto {
  @ApiProperty({
    description: 'owner ID',
    example: '68ecfe9a7ee7bf81a4f956a2',
  })
  ownerId: string;

  @ApiProperty({
    description: 'titile of section',
    example: 'T1 go go!!',
  })
  title: string;

  @ApiProperty({
    description: 'description of section',
    example: 't1 win kt 3-0',
  })
  description?: string;

  @ApiPropertyOptional({
      description: "Profile image (optional)",
      example: "media_123456",
  })
  @IsOptional()
  coverImage?: any;
}   