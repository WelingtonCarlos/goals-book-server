import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) { }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.summaryService.summary(req);
  }

}
