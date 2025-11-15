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
  const { judgeName, setJudgeName, isLoading } = useJudge();
  const [teams, setTeams] = useState<string[]>([]);
  const [existingSubmission, setExistingSubmission] = useState<{ id: string; data: JudgingFormData } | null>(null);

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
    if (!judgeName) return null;

    try {
      const submissionsRef = ref(db, 'submissions');
      const judgeTeamQuery = query(
        submissionsRef,
        orderByChild('judgeName'),
        equalTo(judgeName)
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
        return true;
      }
      
      setExistingSubmission(null);
      return false;
    } catch (error) {
      console.error('Error loading submission:', error);
      return false;
    }
  };

  const handleScoreSubmit = async (data: JudgingFormData) => {
    if (!judgeName) return;

    try {
      const submissionsRef = ref(db, 'submissions');
      
      // If we have an existing submission, update it
      if (existingSubmission?.id) {
        const submissionRef = ref(db, `submissions/${existingSubmission.id}`);
        await update(submissionRef, {
          scores: {
            Innovation: data.Innovation,
            TechnicalComplexity: data.TechnicalComplexity,
            Functionality: data.Functionality,
            UXDesign: data.UXDesign,
            Impact: data.Impact,
            Presentation: data.Presentation,
          },
          timestamp: Date.now(),
        });
        toast.success('Scores updated successfully!');
      } else {
        // Submit new scores
        const submission = {
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
      }
      
      // Clear existing submission state after successful submission
      setExistingSubmission(null);
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
              src="/assets/hawkathon logo.jpeg"
              alt="Hawkathon Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <JudgeNameForm onSubmit={setJudgeName} />
        </div>
      ) : (
        <ScoringForm 
          onSubmit={handleScoreSubmit} 
          onTeamSelect={loadExistingSubmission}
          judgeName={judgeName} 
          teams={teams}
          existingSubmission={existingSubmission?.data}
        />
      )}
    </main>
  );
}
