import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CRITERIA, MAX_SCORES, type JudgingFormData } from '@/types';

const formSchema = z.object({
  teamName: z.string().min(1, 'Please select a team'),
  ProblemRelevance: z.coerce.number({ required_error: 'Score is required', invalid_type_error: 'Score is required' }).min(0, 'Minimum score is 0').max(20, 'Maximum score is 20'),
  NoveltyDifferentiation: z.coerce.number({ required_error: 'Score is required', invalid_type_error: 'Score is required' }).min(0, 'Minimum score is 0').max(20, 'Maximum score is 20'),
  TechnicalDepth: z.coerce.number({ required_error: 'Score is required', invalid_type_error: 'Score is required' }).min(0, 'Minimum score is 0').max(20, 'Maximum score is 20'),
  ImplementationQuality: z.coerce.number({ required_error: 'Score is required', invalid_type_error: 'Score is required' }).min(0, 'Minimum score is 0').max(20, 'Maximum score is 20'),
  DemoTeamComm: z.coerce.number({ required_error: 'Score is required', invalid_type_error: 'Score is required' }).min(0, 'Minimum score is 0').max(20, 'Maximum score is 20'),
});

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
    defaultValues: {
      teamName: '',
      ProblemRelevance: '' as any,
      NoveltyDifferentiation: '' as any,
      TechnicalDepth: '' as any,
      ImplementationQuality: '' as any,
      DemoTeamComm: '' as any,
    },
  });

  useEffect(() => {
    if (existingSubmission) {
      form.reset(existingSubmission);
    } else {
      // Reset to empty form when existingSubmission is null
      form.reset({
        teamName: '',
        ProblemRelevance: '' as any,
        NoveltyDifferentiation: '' as any,
        TechnicalDepth: '' as any,
        ImplementationQuality: '' as any,
        DemoTeamComm: '' as any,
      });
    }
  }, [existingSubmission, form]);

  const handleSubmit = async (data: JudgingFormData) => {
    try {
      const result = await onSubmit(data);
      // Only reset the form if submission was successful
      if (result?.success) {
        form.reset({
          teamName: '',
          ProblemRelevance: '' as any,
          NoveltyDifferentiation: '' as any,
          TechnicalDepth: '' as any,
          ImplementationQuality: '' as any,
          DemoTeamComm: '' as any,
        });
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
  const totalScore = Object.entries(values)
    .filter(([key]) => key !== 'teamName')
    .reduce((sum, [key, value]) => sum + (typeof value === 'number' ? value : 0), 0);
  const maxTotalScore = Object.values(MAX_SCORES).reduce((sum, value) => sum + value, 0);

  return (
    <Card className="w-[90%] max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Score Submission</CardTitle>
          <CardDescription className="text-right">
            Judge: {judgeName}
          </CardDescription>
        </div>
        <CardDescription className="mt-2 font-medium">
          Total Score: {totalScore}/{maxTotalScore} points
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
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
                      <SelectTrigger className="h-12 text-lg">
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

            {Object.entries(CRITERIA).map(([key, label]) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof JudgingFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>{label}</span>
                      <span className="text-muted-foreground">
                        {field.value}/{MAX_SCORES[key as keyof typeof MAX_SCORES]} points
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={MAX_SCORES[key as keyof typeof MAX_SCORES]}
                        className="h-12 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              Make sure your scores reflect the quality of the project in each category.
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg"
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