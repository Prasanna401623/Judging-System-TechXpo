import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  RUBRIC,
  MIN_SCORE,
  MAX_SCORES,
  MAX_TOTAL_SCORE,
  PRESENTATION_TIME,
  CRITERIA_KEYS,
  totalScore as sumScores,
  type JudgingFormData,
} from '@/types';

const scoreField = (max: number) =>
  z.coerce
    .number({ required_error: 'Score is required', invalid_type_error: 'Score is required' })
    .int('Score must be a whole number')
    .min(MIN_SCORE, 'Please choose a score')
    .max(max, `Maximum score is ${max}`);

const formSchema = z.object({
  teamName: z.string().min(1, 'Please select a team'),
  ProblemSolving: scoreField(MAX_SCORES.ProblemSolving),
  CreativityWowFactor: scoreField(MAX_SCORES.CreativityWowFactor),
  PresentationSkills: scoreField(MAX_SCORES.PresentationSkills),
});

const emptyForm = (): JudgingFormData =>
  ({
    teamName: '',
    ...Object.fromEntries(CRITERIA_KEYS.map((key) => [key, '' as any])),
  }) as JudgingFormData;

interface ScoringFormProps {
  onSubmit: (data: JudgingFormData) => Promise<{ success: boolean } | void>;
  onTeamSelect: (teamName: string) => Promise<boolean | null>;
  judgeName: string;
  teams: string[];
  existingSubmission?: JudgingFormData;
  hasAlreadyScored: boolean;
}

export function ScoringForm({ onSubmit, onTeamSelect, judgeName, teams, existingSubmission, hasAlreadyScored }: ScoringFormProps) {
  const form = useForm<JudgingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm(),
  });

  useEffect(() => {
    if (existingSubmission) {
      form.reset(existingSubmission);
    } else {
      // Reset to empty form when existingSubmission is null
      form.reset(emptyForm());
    }
  }, [existingSubmission, form]);

  const handleSubmit = async (data: JudgingFormData) => {
    try {
      const result = await onSubmit(data);
      // Only reset the form if submission was successful
      if (result?.success) {
        form.reset(emptyForm());
        // Trigger team select with empty string to reset the scored state
        await onTeamSelect('');
      }
    } catch (error) {
      // Error already handled in parent component, just log it
      console.error('Error submitting scores:', error);
    }
  };

  const handleTeamSelect = async (teamName: string) => {
    form.setValue('teamName', teamName);
    await onTeamSelect(teamName);
  };

  // Calculate total score
  const values = form.watch();
  const totalScore = sumScores(values);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-4 bg-white shadow-xl shadow-blue-900/5 ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
        <div className="flex justify-between items-start">
          <CardTitle>Score Submission</CardTitle>
          <CardDescription className="text-right">
            Judge: {judgeName}
          </CardDescription>
        </div>
        <CardDescription className="mt-2 font-medium">
          Total Score: {totalScore}/{MAX_TOTAL_SCORE} points
        </CardDescription>
        <CardDescription className="mt-1">
          Target time: {PRESENTATION_TIME.presentationMinutes} minutes per presentation, plus {PRESENTATION_TIME.questionMinutes} minutes for questions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-8 pt-6">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <Select
                    onValueChange={handleTeamSelect}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14 md:h-16 text-lg md:text-xl rounded-xl">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team} value={team} className="text-lg">
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {RUBRIC.map((criterion, index) => (
              <FormField
                key={criterion.key}
                control={form.control}
                name={criterion.key}
                render={({ field }) => {
                  const selected = Number(field.value) || 0;
                  const selectedLevel = criterion.levels.find((level) => level.score === selected);
                  return (
                    <FormItem>
                      <FormLabel className="flex justify-between text-base">
                        <span>
                          {index + 1}. {criterion.label}
                        </span>
                        <span className="text-muted-foreground">
                          {selected || '-'}/{criterion.max} points
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={criterion.label}>
                          {[...criterion.levels]
                            .sort((a, b) => a.score - b.score)
                            .map((level) => {
                              const isSelected = selected === level.score;
                              return (
                                <button
                                  key={level.score}
                                  type="button"
                                  role="radio"
                                  aria-checked={isSelected}
                                  disabled={hasAlreadyScored}
                                  onClick={() => field.onChange(level.score)}
                                  className={`flex flex-col items-center justify-center rounded-xl border-2 px-1 py-3 transition-colors disabled:opacity-60 ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-600 text-white'
                                      : 'border-gray-200 bg-white hover:border-blue-300'
                                  }`}
                                >
                                  <span className="text-2xl font-bold">{level.score}</span>
                                  <span className={`text-[11px] leading-tight text-center ${isSelected ? 'text-blue-50' : 'text-muted-foreground'}`}>
                                    {level.title}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </FormControl>
                      {selectedLevel && (
                        <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
                          <p className="font-semibold">
                            {selectedLevel.score} ({selectedLevel.rating}): {selectedLevel.title}
                          </p>
                          <p className="mt-1">{selectedLevel.explanation}</p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {hasAlreadyScored && (
              <div className="text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-md">
                ⚠️ You have already scored this team. Contact admin to delete your score if you need to re-score.
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Tap a score in each category. The full rubric description for your choice appears below it.
            </div>
            <Button
              type="submit"
              className="w-full h-16 md:h-20 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl"
              disabled={hasAlreadyScored}
            >
              {hasAlreadyScored ? 'Already Scored' : 'Submit Scores'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
