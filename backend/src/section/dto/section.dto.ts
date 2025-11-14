import { ApiProperty} from "@nestjs/swagger";

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
  description: string;

  @ApiProperty({
    description: 'Id of cover media',
    example: '7sdaw456asdasd4asdasd',
  })
  coverMediaId: string;
}   