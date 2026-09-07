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
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  docQuestionnaireDelete,
  docQuestionnaireFindAttempt,
  docQuestionnaireGet,
  docQuestionnaireGetById,
  docQuestionnaireGetCurrentAttempt,
  docQuestionnairePatch,
  docQuestionnairePost,
  docQuestionnaireSaveAnswers,
  docQuestionnaireSubmitAttempt,
} from './questionnaire.doc';

@ApiTags('questionnaire')
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Roles(UserRole.ADMIN)
  @Post('questions')
  @docQuestionnairePost()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionnaireService.createQuestion(createQuestionDto);
  }

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

  @Roles(UserRole.ADMIN)
  @Patch('questions/:id')
  @docQuestionnairePatch()
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionnaireService.updateQuestion(id, updateQuestionDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete('questions/:id')
  @docQuestionnaireDelete()
  deactivateQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.deactivateQuestion(id);
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
