'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

interface QuizTakerProps {
  questions: Question[];
}

export function QuizTaker({ questions }: QuizTakerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answerIndex) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-center">
          <h2 className="text-2xl font-bold">Quiz Completed!</h2>
          <p className="mt-2 text-lg">
            You scored <span className="text-primary font-semibold">{score}</span> out of {questions.length}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => {
          const selectedOptionIndex = answers[question.id];
          const isCorrect = selectedOptionIndex === question.answerIndex;
          
          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {index + 1}. {question.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, optIndex) => {
                  const isSelected = selectedOptionIndex === optIndex;
                  const isActuallyCorrect = optIndex === question.answerIndex;
                  
                  let optionClass = "flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm transition-colors hover:border-primary/50";
                  let dotClass = "h-4 w-4 shrink-0 rounded-full border border-primary mt-0.5 transition-colors";
                  
                  if (isSelected) {
                    optionClass += " ring-1 ring-primary bg-primary/5";
                    dotClass += " bg-primary";
                  }
                  
                  if (submitted) {
                    optionClass = "flex items-start gap-3 rounded-2xl border p-4 text-sm";
                    if (isActuallyCorrect) {
                      optionClass += " border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100";
                      dotClass = "h-4 w-4 shrink-0 rounded-full border-emerald-500 bg-emerald-500 mt-0.5";
                    } else if (isSelected && !isActuallyCorrect) {
                      optionClass += " border-destructive bg-destructive/10 text-destructive-foreground";
                      dotClass = "h-4 w-4 shrink-0 rounded-full border-destructive bg-destructive mt-0.5";
                    } else {
                      optionClass += " border-border opacity-50";
                      dotClass = "h-4 w-4 shrink-0 rounded-full border-border mt-0.5";
                    }
                  }

                  return (
                    <div 
                      key={optIndex} 
                      className={optionClass}
                      onClick={() => handleSelect(question.id, optIndex)}
                    >
                      <div className={dotClass} />
                      <span>{option}</span>
                    </div>
                  );
                })}

                {submitted && question.explanation && (
                  <div className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground border-l-2 border-primary">
                    <span className="font-semibold text-foreground">Explanation:</span> {question.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto px-8">
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
