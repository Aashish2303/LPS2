import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Award, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { LPSData, LearnTopic } from '../../types';
import { SAMPLE_LEARN_TOPICS } from '../../data/initialData';

interface LearningCentreViewProps {
  data: LPSData;
  onSaveProgress: (topicId: number, score: number, passed: boolean) => void;
}

export const LearningCentreView: React.FC<LearningCentreViewProps> = ({
  data,
  onSaveProgress
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentTopic = SAMPLE_LEARN_TOPICS.find((t) => t.id === selectedTopicId) || SAMPLE_LEARN_TOPICS[0];

  const handleSelectTopic = (id: number) => {
    setSelectedTopicId(id);
    setIsQuizMode(false);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!currentTopic.quiz || currentTopic.quiz.length === 0) return;

    let correctCount = 0;
    currentTopic.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentTopic.quiz.length) * 100);
    const passed = score >= 70;

    setIsSubmitted(true);
    onSaveProgress(currentTopic.id, score, passed);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Calculate score if submitted
  const correctCount = isSubmitted
    ? currentTopic.quiz.filter((q) => selectedAnswers[q.id] === q.correctIndex).length
    : 0;
  const scorePercent = currentTopic.quiz.length > 0 ? Math.round((correctCount / currentTopic.quiz.length) * 100) : 0;
  const passed = scorePercent >= 70;

  return (
    <div id="learning-centre-view" className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#f8fafc]">LPS Lean Learning Academy & Knowledge Base</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Master the core concepts of Last Planner System, binary PPC discipline, pull scheduling, and root cause reason codes.
          </p>
        </div>
      </div>

      {/* Split Layout: 200px Left Topics + Right Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Topics Navigation (4 cols) */}
        <div
          id="learn-topics-sidebar"
          className="md:col-span-4 bg-[#1e293b] border border-[#334155] rounded-xl p-4 shadow-lg space-y-1.5"
        >
          <div className="text-xs uppercase font-bold text-[#94a3b8] px-2 mb-2 tracking-wider">
            Curriculum Topics
          </div>
          {SAMPLE_LEARN_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            const progress = data.learnProgress.find((p) => p.topic_id === topic.id);

            return (
              <button
                key={topic.id}
                id={`btn-topic-${topic.id}`}
                onClick={() => handleSelectTopic(topic.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f172a] text-[#f59e0b] font-bold border-l-3 border-[#f59e0b] shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f172a]/40'
                }`}
              >
                <span className="truncate pr-2">{topic.title}</span>
                {progress?.passed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content / Quiz Area (8 cols) */}
        <div
          id="learn-content-area"
          className="md:col-span-8 bg-[#1e293b] border border-[#334155] rounded-xl p-8 shadow-xl space-y-6"
        >
          {!isQuizMode ? (
            /* Topic Text Mode */
            <div className="space-y-6">
              <div className="border-b border-[#334155] pb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-[#f59e0b] border border-amber-500/30">
                  Topic {currentTopic.id} of 10
                </span>
                <h3 className="text-xl font-extrabold text-[#f8fafc] mt-2">{currentTopic.title}</h3>
                <p className="text-xs text-[#38bdf8] font-medium mt-1">{currentTopic.summary}</p>
              </div>

              {/* Content Paragraphs */}
              <div className="space-y-3.5 text-xs text-[#f8fafc]/90 leading-relaxed">
                {currentTopic.content.map((p, idx) => (
                  <p key={idx} className="bg-[#0f172a]/40 p-3.5 rounded-lg border border-[#334155]/60">
                    {p}
                  </p>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Lean Takeaways</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#f8fafc]">
                  {currentTopic.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#f59e0b] font-bold">✓</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Start Quiz Action */}
              <div className="pt-4 border-t border-[#334155] flex justify-end">
                <button
                  id="btn-start-quiz"
                  onClick={() => setIsQuizMode(true)}
                  className="px-6 py-3 bg-[#f59e0b] hover:bg-amber-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Self-Check Quiz ({currentTopic.quiz.length} Questions)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Mode */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#334155] pb-4">
                <div>
                  <span className="text-xs text-[#f59e0b] font-semibold">Knowledge Check</span>
                  <h3 className="text-lg font-bold text-[#f8fafc] mt-0.5">{currentTopic.title}</h3>
                </div>
                <button
                  onClick={() => setIsQuizMode(false)}
                  className="text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
                >
                  ← Back to Reading
                </button>
              </div>

              {/* Quiz Questions List */}
              <div className="space-y-6">
                {currentTopic.quiz.map((q, qIndex) => {
                  const selectedOpt = selectedAnswers[q.id];

                  return (
                    <div key={q.id} className="p-4 rounded-lg bg-[#0f172a] border border-[#334155] space-y-3">
                      <div className="text-xs font-bold text-[#f8fafc] flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[#f59e0b] text-[10px]">
                          Q{qIndex + 1}
                        </span>
                        <span>{q.question}</span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          const isCorrect = optIdx === q.correctIndex;

                          let optionClass =
                            'border-[#334155] bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] hover:border-[#64748b]';

                          if (isSelected) {
                            optionClass = 'border-[#f59e0b] bg-amber-500/15 text-[#f59e0b] font-semibold shadow-xs';
                          }

                          if (isSubmitted) {
                            if (isCorrect) {
                              optionClass = 'border-[#10b981] bg-emerald-500/20 text-[#10b981] font-bold';
                            } else if (isSelected && !isCorrect) {
                              optionClass = 'border-[#ef4444] bg-red-500/20 text-[#ef4444] font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {isSubmitted && (
                        <div className="mt-2 p-3 rounded bg-slate-900 border border-[#334155] text-xs text-[#94a3b8] animate-fade-in">
                          <strong className="text-[#f8fafc]">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Results Bar */}
              <div className="pt-4 border-t border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {isSubmitted ? (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        passed
                          ? 'bg-emerald-500/20 text-[#10b981] border border-emerald-500/30'
                          : 'bg-red-500/20 text-[#ef4444] border border-red-500/30'
                      }`}
                    >
                      {passed
                        ? `🎉 Score: ${scorePercent}% — Passed!`
                        : `❌ Score: ${scorePercent}% — Keep studying!`}
                    </span>
                    <button
                      onClick={handleRetakeQuiz}
                      className="text-xs text-[#f59e0b] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-[#94a3b8]">
                    Answer all questions and submit to test your comprehension (Pass threshold: 70%).
                  </div>
                )}

                {!isSubmitted && (
                  <button
                    id="btn-submit-quiz-answers"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
                    className="px-6 py-2.5 bg-[#f59e0b] hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:border disabled:border-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer text-[#0f172a]"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
