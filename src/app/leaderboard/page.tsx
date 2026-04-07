'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { AdminLoginForm } from '@/components/AdminLoginForm';
import { useAdmin } from '@/hooks/useAdmin';
import type { Submission } from '@/types';
import { MAX_SCORES } from '@/types';

interface TeamScores {
  [teamName: string]: {
    totalScore: number;
    averageScore: number;
    judgeCount: number;
    scores: {
      ProblemRelevance: number;
      NoveltyDifferentiation: number;
      TechnicalDepth: number;
      ImplementationQuality: number;
      DemoTeamComm: number;
    };
  };
}

interface Team {
  id: string;
  name: string;
}

export default function LeaderboardPage() {
  const { isAdmin, isLoading, login } = useAdmin();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScores>({});

  useEffect(() => {
    if (!isAdmin) return;

    // Listen for teams
    const teamsRef = ref(db, 'teams');
    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      if (teamsData) {
        const teamsArray = Object.entries(teamsData).map(([id, name]) => ({
          id,
          name: String(name)
        }));
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
    });

    // Listen for submissions
    const submissionsRef = ref(db, 'submissions');
    const unsubscribeSubmissions = onValue(submissionsRef, (snapshot) => {
      const submissionsData = snapshot.val() || {};

      // Calculate scores
      const scores: TeamScores = {};
      Object.values(submissionsData).forEach((submission) => {
        const { teamName, scores: submissionScores } = submission as Submission;
        if (!scores[teamName]) {
          scores[teamName] = {
            totalScore: 0,
            averageScore: 0,
            judgeCount: 0,
            scores: {
              ProblemRelevance: 0,
              NoveltyDifferentiation: 0,
              TechnicalDepth: 0,
              ImplementationQuality: 0,
              DemoTeamComm: 0,
            },
          };
        }

        scores[teamName].judgeCount++;
        scores[teamName].scores.ProblemRelevance += submissionScores.ProblemRelevance;
        scores[teamName].scores.NoveltyDifferentiation += submissionScores.NoveltyDifferentiation;
        scores[teamName].scores.TechnicalDepth += submissionScores.TechnicalDepth;
        scores[teamName].scores.ImplementationQuality += submissionScores.ImplementationQuality;
        scores[teamName].scores.DemoTeamComm += submissionScores.DemoTeamComm;

        const total =
          submissionScores.ProblemRelevance +
          submissionScores.NoveltyDifferentiation +
          submissionScores.TechnicalDepth +
          submissionScores.ImplementationQuality +
          submissionScores.DemoTeamComm;
        scores[teamName].totalScore += total;
      });

      // Calculate average scores after all submissions are processed
      Object.keys(scores).forEach((teamName) => {
        const teamScore = scores[teamName];
        teamScore.averageScore = teamScore.totalScore / teamScore.judgeCount;
      });

      setTeamScores(scores);
    });

    return () => {
      unsubscribeTeams();
      unsubscribeSubmissions();
    };
  }, [isAdmin]);

  const maxTotalScore = Object.values(MAX_SCORES).reduce((sum, value) => sum + value, 0);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <Navigation />
        <AdminLoginForm onLogin={login} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">🏆 Hawkathon 2026 Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams
                .map((team) => ({
                  name: team.name,
                  averageScore: teamScores[team.name]?.averageScore || 0,
                  judgeCount: teamScores[team.name]?.judgeCount || 0,
                }))
                .sort((a, b) => b.averageScore - a.averageScore)
                .map((team, index) => {
                  const percentage = (team.averageScore / maxTotalScore) * 100;
                  
                  return (
                    <div key={team.name} className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 hover:border-gray-300 transition-colors flex items-center gap-6">
                      <div className={`text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        index === 1 ? 'bg-gray-300 text-gray-900' : 
                        index === 2 ? 'bg-orange-400 text-orange-900' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl">{team.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          Judged by {team.judgeCount} judge{team.judgeCount !== 1 ? 's' : ''}
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-500' : 
                              'bg-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{team.averageScore.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">/ {maxTotalScore}</div>
                        <div className="text-lg font-semibold text-blue-600">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
            
              {teams.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No teams have been added yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
