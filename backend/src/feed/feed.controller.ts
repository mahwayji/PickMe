import { Controller, Get, Param } from '@nestjs/common';
import { FeedService } from './feed.service';
import { string } from 'zod';

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService:FeedService){}

    @Get('')
    async getFeed(
    ){
        return this.feedService.getFeed();
    }

    @Get(':tag')
    async getFeedWithTag(
        @Param('tag') tag: string
    ){
        return this.feedService.getFeedByTag(tag);
    }
}
