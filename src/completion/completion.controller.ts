import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompletionService } from './completion.service';
import { CreateCompletionDto } from './dto/create-completion.dto';

@Controller('completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCompletionDto: CreateCompletionDto, @Request() req: any) {
    return this.completionService.create(createCompletionDto, req);
  }


  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.completionService.remove(+id, req);
  }
}
