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
    if (!judgeCode) return null;

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
      return false;
    }
  };

  const handleScoreSubmit = async (data: JudgingFormData) => {
    if (!judgeCode || !judgeName) return;

    try {
      const submissionsRef = ref(db, 'submissions');
      
      // Only allow new submissions, not updates
      // Updates can only happen after admin deletes the score
      if (hasAlreadyScored) {
        toast.error('You have already scored this team. Contact admin to delete your score if you need to re-score.');
        return;
      }

      // Submit new scores
      const submission = {
        judgeCode,
        judgeName,
        teamName: data.teamName,
        scores: {
          Innovation: data.Innovation,
          TechnicalComplexity: data.TechnicalComplexity,
          Functionality: data.Functionality,
          UXDesign: data.UXDesign,
          Impact: data.Impact,
          Presentation: data.Presentation,
        },
        timestamp: Date.now(),
      };

      await push(submissionsRef, submission);
      toast.success('Scores submitted successfully!');
      
      // Clear existing submission state and mark as scored
      setExistingSubmission(null);
      setHasAlreadyScored(true);
    } catch (error) {
      console.error('Error submitting scores:', error);
      toast.error('Failed to submit scores. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <Navigation />
      <Toaster position="top-center" />
      {!judgeName ? (
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 relative mb-8 mt-8">
            <Image
              src="/assets/TechXpo.png"
              alt="TechXpo Logo"
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
