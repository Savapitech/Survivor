import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  docQuestionnaireFindAttempt,
  docQuestionnaireGet,
  docQuestionnaireGetById,
  docQuestionnaireGetCurrentAttempt,
  docQuestionnaireSaveAnswers,
  docQuestionnaireSubmitAttempt,
} from './questionnaire.doc';

@ApiTags('questionnaire')
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get('questions')
  @docQuestionnaireGet()
  findQuestions(@Query() query: FindQuestionsQueryDto) {
    return this.questionnaireService.findQuestions(query);
  }

  @Get('questions/:id')
  @docQuestionnaireGetById()
  findQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.findQuestion(id);
  }

  @Get('attempts/current')
  @docQuestionnaireGetCurrentAttempt()
  getOrCreateCurrentAttempt(@Query() query: AttemptQueryDto) {
    return this.questionnaireService.getOrCreateCurrentAttempt(query.seekerId);
  }

  @Get('attempts/:id')
  @docQuestionnaireFindAttempt()
  findAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.findAttempt(id);
  }

  @Put('attempts/:id/answers')
  @docQuestionnaireSaveAnswers()
  saveAnswers(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveAnswersDto: SaveAnswersDto,
  ) {
    return this.questionnaireService.saveAnswers(id, saveAnswersDto);
  }

  @Post('attempts/:id/submit')
  @docQuestionnaireSubmitAttempt()
  submitAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.submitAttempt(id);
  }
}
