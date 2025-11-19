'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, remove, get } from 'firebase/database';
import { Toaster, toast } from 'sonner';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { AdminLoginForm } from '@/components/AdminLoginForm';
import { useAdmin } from '@/hooks/useAdmin';
import type { Submission } from '@/types';
import { CRITERIA, MAX_SCORES } from '@/types';

interface TeamScores {
  [teamName: string]: {
    totalScore: number;
    averageScore: number;
    judgeCount: number;
    scores: {
      Innovation: number;
      TechnicalComplexity: number;
      Functionality: number;
      UXDesign: number;
      Impact: number;
      Presentation: number;
    };
  };
}

interface Team {
  id: string;
  name: string;
}

interface SubmissionWithId extends Submission {
  id: string;
}

export default function AdminPage() {
  const { isAdmin, isLoading, login } = useAdmin();
  const [newTeamName, setNewTeamName] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScores>({});
  const [allSubmissions, setAllSubmissions] = useState<SubmissionWithId[]>([]);

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

      // Store all submissions with IDs
      const submissions: SubmissionWithId[] = Object.entries(submissionsData).map(([id, data]) => ({
        ...(data as Submission),
        id,
      }));
      setAllSubmissions(submissions);

      // Calculate scores
      const scores: TeamScores = {};
      Object.values(submissionsData).forEach((submission) => {
        const { teamName, scores: submissionScores } = submission as Submission;
        if (!scores[teamName]) {
          scores[teamName] = {
            totalScore: 0,
            averageScore: 0,
            judgeCount: 0,
            scores: { Innovation: 0, TechnicalComplexity: 0, Functionality: 0, UXDesign: 0, Impact: 0, Presentation: 0 },
          };
        }

        scores[teamName].judgeCount++;
        scores[teamName].scores.Innovation += submissionScores.Innovation;
        scores[teamName].scores.TechnicalComplexity += submissionScores.TechnicalComplexity;
        scores[teamName].scores.Functionality += submissionScores.Functionality;
        scores[teamName].scores.UXDesign += submissionScores.UXDesign;
        scores[teamName].scores.Impact += submissionScores.Impact;
        scores[teamName].scores.Presentation += submissionScores.Presentation;

        const total = 
          submissionScores.Innovation + 
          submissionScores.TechnicalComplexity + 
          submissionScores.Functionality + 
          submissionScores.UXDesign + 
          submissionScores.Impact + 
          submissionScores.Presentation;
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

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !isAdmin) return;

    try {
      // Check if team name already exists
      const teamExists = teams.some(team => team.name.toLowerCase() === newTeamName.trim().toLowerCase());
      if (teamExists) {
        toast.error('Team name already exists');
        return;
      }

      // Create a new team reference and set the team name
      const teamsRef = ref(db, 'teams');
      await push(teamsRef, newTeamName.trim());
      
      setNewTeamName('');
      toast.success('Team added successfully!');
    } catch (error: Error | unknown) {
      console.error('Error adding team:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team';
      toast.error(errorMessage);
    }
  };

  const handleRemoveTeam = async (teamId: string, teamName: string) => {
    if (!isAdmin) return;

    try {
      // Check if team has any submissions
      const submissionsRef = ref(db, 'submissions');
      const submissionsSnapshot = await get(submissionsRef);
      const submissions = submissionsSnapshot.val() || {};
      
      const hasSubmissions = Object.values(submissions).some(
        (submission: unknown) => (submission as Submission).teamName === teamName
      );

      if (hasSubmissions) {
        toast.error('Cannot remove team with existing submissions');
        return;
      }

      await remove(ref(db, `teams/${teamId}`));
      toast.success('Team removed successfully!');
    } catch (error: Error | unknown) {
      console.error('Error removing team:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove team';
      if (errorMessage.includes('PERMISSION_DENIED')) {
        toast.error('Permission denied. Please make sure you are logged in as admin.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteScore = async (submissionId: string, judgeName: string, teamName: string) => {
    if (!isAdmin) return;

    try {
      await remove(ref(db, `submissions/${submissionId}`));
      toast.success(`Score by ${judgeName} for ${teamName} deleted successfully!`);
    } catch (error: Error | unknown) {
      console.error('Error deleting score:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete score';
      if (errorMessage.includes('PERMISSION_DENIED')) {
        toast.error('Permission denied. Please make sure you are logged in as admin.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <Navigation />
        <Toaster position="top-center" />
        <AdminLoginForm onLogin={login} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <Navigation />
      <Toaster position="top-center" />
      
      {/* Team Management */}
      <Card className="mb-8 mt-16">
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTeam} className="flex gap-4 mb-6">
            <Input
              type="text"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newTeamName.trim()}>
              Add Team
            </Button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                <span>{team.name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveTeam(team.id, team.name)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Live Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {teams.map((team) => {
              const scoreData = teamScores[team.name] || {
                averageScore: 0,
                judgeCount: 0,
                scores: {
                  Innovation: 0,
                  TechnicalComplexity: 0,
                  Functionality: 0,
                  UXDesign: 0,
                  Impact: 0,
                  Presentation: 0,
                },
              };

              const maxTotalScore = Object.values(MAX_SCORES).reduce((sum, value) => sum + value, 0);
              const teamSubmissions = allSubmissions.filter(sub => sub.teamName === team.name);

              return (
                <div key={team.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <div className="text-sm text-gray-500">
                      {scoreData.judgeCount} judge{scoreData.judgeCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {/* Individual Judge Scores Table */}
                  {teamSubmissions.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border p-2 text-left">Judge</th>
                            {Object.entries(CRITERIA).map(([key, label]) => (
                              <th key={key} className="border p-2 text-center">
                                {label.split('(')[0].trim()}
                              </th>
                            ))}
                            <th className="border p-2 text-center font-semibold">Total</th>
                            <th className="border p-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamSubmissions.map((submission) => {
                            const total = Object.values(submission.scores).reduce((sum, val) => sum + val, 0);
                            return (
                              <tr key={submission.id} className="hover:bg-gray-50">
                                <td className="border p-2 font-medium">{submission.judgeName}</td>
                                {Object.keys(CRITERIA).map((key) => (
                                  <td key={key} className="border p-2 text-center">
                                    {submission.scores[key as keyof typeof submission.scores]}
                                  </td>
                                ))}
                                <td className="border p-2 text-center font-semibold">{total}</td>
                                <td className="border p-2 text-center">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteScore(submission.id, submission.judgeName, team.name)}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Average Row */}
                          <tr className="bg-blue-50 font-semibold">
                            <td className="border p-2">Average</td>
                            {Object.keys(CRITERIA).map((key) => {
                              const score = scoreData.scores[key as keyof typeof scoreData.scores];
                              const averageScore = score / (scoreData.judgeCount || 1);
                              return (
                                <td key={key} className="border p-2 text-center">
                                  {averageScore.toFixed(1)}
                                </td>
                              );
                            })}
                            <td className="border p-2 text-center">
                              {scoreData.averageScore.toFixed(2)}
                            </td>
                            <td className="border p-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 