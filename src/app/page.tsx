'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { ref, push, query, orderByChild, equalTo, get, onValue, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useJudge } from '@/hooks/useJudge';
import { JudgeNameForm } from '@/components/JudgeNameForm';
import { ScoringForm } from '@/components/ScoringForm';
import { Navigation } from '@/components/Navigation';
import type { JudgingFormData, Submission } from '@/types';
import Image from 'next/image';

export default function Home() {
  const { judgeCode, judgeName, setJudge, isLoading } = useJudge();
  const [teams, setTeams] = useState<string[]>([]);
  const [existingSubmission, setExistingSubmission] = useState<{ id: string; data: JudgingFormData } | null>(null);
  const [hasAlreadyScored, setHasAlreadyScored] = useState(false);

  useEffect(() => {
    // Listen for teams
    const teamsRef = ref(db, 'teams');
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      setTeams(teamsData ? Object.values(teamsData) : []);
    });

    return () => unsubscribe();
  }, []);

  const loadExistingSubmission = async (teamName: string) => {
    if (!judgeCode || !teamName) {
      setExistingSubmission(null);
      setHasAlreadyScored(false);
      return null;
    }

    try {
      const submissionsRef = ref(db, 'submissions');
      const judgeTeamQuery = query(
        submissionsRef,
        orderByChild('judgeCode'),
        equalTo(judgeCode)
      );

      const snapshot = await get(judgeTeamQuery);
      const submissions = snapshot.val() || {};

      const submission = Object.entries(submissions).find(
        ([, sub]) => (sub as Submission).teamName === teamName
      );

      if (submission && submission[0]) {
        const [submissionId, submissionData] = submission;
        const { scores } = submissionData as Submission;
        setExistingSubmission({
          id: submissionId,
          data: {
            teamName,
            ...scores
          }
        });
        setHasAlreadyScored(true);
        return true;
      }

      setExistingSubmission(null);
      setHasAlreadyScored(false);
      return false;
    } catch (error) {
      console.error('Error loading submission:', error);
      setExistingSubmission(null);
      setHasAlreadyScored(false);
      return false;
    }
  };

  const handleScoreSubmit = async (data: JudgingFormData) => {
    if (!judgeCode || !judgeName) return;

    try {
      // Double-check if this team has already been scored before submitting
      const submissionsRef = ref(db, 'submissions');
      const judgeTeamQuery = query(
        submissionsRef,
        orderByChild('judgeCode'),
        equalTo(judgeCode)
      );

      const checkSnapshot = await get(judgeTeamQuery);
      const existingSubmissions = checkSnapshot.val() || {};

      const alreadySubmitted = Object.values(existingSubmissions).some(
        (sub) => (sub as Submission).teamName === data.teamName
      );

      if (alreadySubmitted) {
        toast.error('You have already scored this team. Contact admin to delete your score if you need to re-score.');
        setHasAlreadyScored(true);
        throw new Error('Team already scored');
      }

      // Submit new scores
      const submission = {
        judgeCode,
        judgeName,
        teamName: data.teamName,
        scores: {
          ProblemRelevance: data.ProblemRelevance,
          NoveltyDifferentiation: data.NoveltyDifferentiation,
          TechnicalDepth: data.TechnicalDepth,
          ImplementationQuality: data.ImplementationQuality,
          DemoTeamComm: data.DemoTeamComm,
        },
        timestamp: Date.now(),
      };

      await push(submissionsRef, submission);
      toast.success('Scores submitted successfully!');

      // Mark this specific team as scored and return success
      setHasAlreadyScored(true);
      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      console.error('Error submitting scores:', error);

      // Only show generic error message for non-duplicate submissions
      if (errorMessage !== 'Team already scored') {
        toast.error(`Failed to submit scores: ${errorMessage}`);
      }
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 selection:bg-blue-200">
      <Navigation />
      <Toaster position="top-center" />
      {!judgeName ? (
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 relative mb-8 mt-8">
            <Image
              src="/assets/hawkathon%20logo.jpeg"
              alt="Hawkathon 2026 Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <JudgeNameForm onSubmit={setJudge} />
        </div>
      ) : (
        <ScoringForm
          onSubmit={handleScoreSubmit}
          onTeamSelect={loadExistingSubmission}
          judgeName={judgeName}
          teams={teams}
          existingSubmission={existingSubmission?.data}
          hasAlreadyScored={hasAlreadyScored}
        />
      )}
    </main>
  );
} 
