import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompletionService } from './completion.service';
import { CreateCompletionDto } from './dto/create-completion.dto';

@Controller('completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCompletionDto: CreateCompletionDto) {
    return this.completionService.create(createCompletionDto);
  }

  // @Get()
  // findAll() {
  //   return this.completionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.completionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompletionDto: UpdateCompletionDto) {
  //   return this.completionService.update(+id, updateCompletionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.completionService.remove(+id);
  // }
}
