"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PollVotePage = ({ params }: { params: { pollId: string } }) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const pollId=params.pollId;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${Number(pollId)}`);
        console.log("response",response);
        setPoll(response.data.poll);
      } catch (err) {
        setError("Failed to fetch poll details.");
        console.error("Error fetching poll:", err);
      } finally {
        setLoading(false);
      }
    };
    const interval=setInterval(()=>{
        fetchPoll();
    },5000)

    return (()=>{
        clearInterval(interval);
    })
  }, [params.pollId]);
  console.log("fetched!!");

  const handleVote = async (optionIndex: number) => {
    try {
      setVoting(true);
      setError(null);
      setSuccess(null);

      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${Number(pollId)}`, {
        vote: optionIndex + 1,
      });

      setSuccess("Your vote has been recorded!");
      // Refresh poll data to get updated counts
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${Number(pollId)}`);
      setPoll(response.data.poll);
    } catch (err) {
      setError("Failed to submit your vote. Please try again.");
      console.error("Error voting:", err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <Alert variant="destructive">
          <AlertDescription>Poll not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">{poll.question}</h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-800 border-green-700">
                <AlertDescription className="text-green-100">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {poll.option.map((option: string, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <span className="text-white">{option}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">{poll.pollCount[index]} votes</span>
                    <Button onClick={() => handleVote(index)} disabled={voting} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {voting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Vote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PollVotePage;
