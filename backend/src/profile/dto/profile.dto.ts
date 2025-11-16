import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum } from "class-validator";
import { Visibility } from "@prisma/client";

export class ProfileDto {
    @ApiProperty({
        description: "Username of the user",
        example: "mahwayji",
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: "First name of the user",
        example: "John",
    })
    @IsString()
    firstName: string;

    @ApiPropertyOptional({
        description: "Last name of the user (optional)",
        example: "Doe",
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({
        description: "User description / biography (optional)",
        example: "Full-stack dev & gamer",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: "Profile image (optional)",
        example: "media_123456",
    })
    @IsOptional()
    profileImage?: any; // adjust type if you expect a File, string, or mediaId

    @ApiPropertyOptional({
        description: "Location of the user (optional)",
        example: "Bangkok, Thailand",
    })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({
        description: "Profile visibility",
        enum: Visibility,
        example: Visibility.PUBLIC,
    })
    @IsEnum(Visibility)
    visibility: Visibility;
    }
