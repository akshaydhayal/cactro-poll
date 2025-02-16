"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const PollsHomePage = () => {
  const [polls, setPolls] = useState<{ question: string; option: string[]; id: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router=useRouter();
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""], // Exactly 4 options
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll`);
      setPolls(response.data.polls);
      setError(null);
    } catch (err) {
      setError("Failed to fetch polls. Please try again later.");
      console.error("Error fetching polls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Validate all fields are filled
    if (!formData.question.trim()) {
      setCreateError("Question is required");
      return;
    }

    const emptyOptions = formData.options.filter((opt) => !opt.trim());
    if (emptyOptions.length > 0) {
      setCreateError("All four options are required");
      return;
    }

    setCreating(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll`, {
        question: formData.question,
        option: formData.options,
      });

      setIsModalOpen(false);
      setFormData({
        question: "",
        options: ["", "", "", ""],
      });
      fetchPolls();
    } catch (err) {
      // setCreateError(err.response?.data?.msg || "Failed to create poll");
      setCreateError("Failed to create poll");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Available Polls</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {polls.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No polls available at the moment.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="bg-gray-800 cursor-pointer border-gray-700 hover:bg-gray-750 transition-colors" onClick={()=>{
              router.push(`/${poll.id}`)
            }}>
              <CardContent className="p-4">
                <h2 className="font-medium mb-2 text-white">{poll.question}</h2>
                <p className="text-sm text-gray-400">Options: {poll.option.join(", ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Poll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Create New Poll</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {createError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreatePoll}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Question</label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Options (all 4 required)</label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = e.target.value;
                          setFormData((prev) => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={creating}>
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Poll
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollsHomePage;