import type { Question } from '../../api/models';
import { RatingGroup } from '../../components/ui/RatingGroup';

interface QuestionBatchProps {
  questions: Question[];
  answers: Record<number, number>;
  onAnswer: (questionId: number, value: number) => void;
}

export function QuestionBatch({
  questions,
  answers,
  onAnswer,
}: QuestionBatchProps) {
  return (
    <div>
      {questions.map((question) => (
        <RatingGroup
          key={question.id}
          questionId={question.id}
          label={question.label}
          value={answers[question.id]}
          onChange={(value) => onAnswer(question.id, value)}
        />
      ))}
    </div>
  );
}
