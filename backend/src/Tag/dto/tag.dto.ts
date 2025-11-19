import { ApiProperty} from "@nestjs/swagger";
export class tagDto {
  @ApiProperty({
    description: 'name of tag',
    example: 'JavaScript',
  })
  name: string;
}
