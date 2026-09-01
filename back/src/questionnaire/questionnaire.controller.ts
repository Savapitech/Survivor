import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('questionnaire')
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Post('questions')
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionnaireService.createQuestion(createQuestionDto);
  }

  @Get('questions')
  findQuestions(@Query() query: FindQuestionsQueryDto) {
    return this.questionnaireService.findQuestions(query);
  }

  @Get('questions/:id')
  findQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.findQuestion(id);
  }

  @Patch('questions/:id')
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionnaireService.updateQuestion(id, updateQuestionDto);
  }

  @Delete('questions/:id')
  deactivateQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.deactivateQuestion(id);
  }

  @Get('attempts/current')
  getOrCreateCurrentAttempt(@Query() query: AttemptQueryDto) {
    return this.questionnaireService.getOrCreateCurrentAttempt(query.seekerId);
  }

  @Get('attempts/:id')
  findAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.findAttempt(id);
  }

  @Put('attempts/:id/answers')
  saveAnswers(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveAnswersDto: SaveAnswersDto,
  ) {
    return this.questionnaireService.saveAnswers(id, saveAnswersDto);
  }

  @Post('attempts/:id/submit')
  submitAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.submitAttempt(id);
  }
}
