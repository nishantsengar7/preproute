import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../store/hooks';
import { setCurrentTest } from '../../store/tests/testsSlice';
import { Input, Button } from '../../components/ui';
import { ChevronDown } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import testService from '../../services/test.service';

// Zod validation schema matching form fields
const createTestSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  testName: z.string().min(3, 'Test Name must be at least 3 characters'),
  topic: z.string().min(1, 'Topic is required'),
  subTopic: z.string().min(1, 'Sub Topic is required'),
  duration: z.number({ message: 'Duration is required' })
    .positive('Duration must be a positive number')
    .min(1, 'Duration must be at least 1 minute')
    .max(480, 'Duration cannot exceed 8 hours'),
  difficulty: z.enum(['easy', 'medium', 'difficult']),
  wrongAnswer: z.number({ message: 'Wrong answer marking is required' }),
  unattempted: z.number({ message: 'Unattempted marking is required' }),
  correctAnswer: z.number({ message: 'Correct answer marking is required' }).positive('Correct answer marks must be positive'),
  noOfQuestions: z.number({ message: 'Number of questions is required' })
    .positive('Number of questions must be positive')
    .min(1, 'Must have at least 1 question'),
  totalMarks: z.number({ message: 'Total marks is required' })
    .positive('Total marks must be positive')
    .min(1, 'Total marks must be at least 1'),
});

type CreateTestFormData = z.infer<typeof createTestSchema>;

export const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'chapter' | 'pyq' | 'mock'>('chapter');

  useDocumentTitle('Create Test');

  // Subjects & topics mock list for dropdown select
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const topics = ['Kinematics', 'Thermodynamics', 'Organic Chemistry', 'Algebra', 'Calculus', 'Genetics'];
  const subTopics = ['Projectiles', 'Laws of Motion', 'Alcohols & Ethers', 'Matrices', 'Integration', 'DNA Replication'];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTestFormData>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      subject: '',
      testName: '',
      topic: '',
      subTopic: '',
      duration: 60,
      difficulty: 'easy',
      wrongAnswer: -1,
      unattempted: 0,
      correctAnswer: 5,
      noOfQuestions: 30,
      totalMarks: 150,
    },
  });

  const selectedDifficulty = watch('difficulty');
  const selectedSubject = watch('subject');
  const selectedTopic = watch('topic');
  const selectedSubTopic = watch('subTopic');

  const onSubmit = async (data: CreateTestFormData) => {
    try {
      // Build the test payload
      const testPayload = {
        title: data.testName,
        description: `${data.subject} - ${data.topic} (${data.subTopic})`,
        duration: data.duration,
        passingScore: 40,
        status: 'draft' as const,
        subject: data.subject,
        topic: data.topic,
        subTopic: data.subTopic,
        difficulty: data.difficulty,
        wrongAnswer: data.wrongAnswer,
        unattempted: data.unattempted,
        correctAnswer: data.correctAnswer,
        totalMarks: data.totalMarks,
      };

      let testId: string;

      try {
        // Attempt to call the real API via testService
        const response = await testService.createTest(testPayload);
        testId = response.data.id;
        dispatch(setCurrentTest(response.data));
      } catch {
        // API unavailable — fall back to local mock (demo mode)
        testId = `test-${Math.floor(1000 + Math.random() * 9000)}`;
        const testData = {
          id: testId,
          questionsCount: data.noOfQuestions,
          creatorId: 'usr-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...testPayload,
        };
        dispatch(setCurrentTest(testData));
      }

      toast.success('Test metadata configured! Setting up questions next...');
      navigate(`/tests/${testId}/questions`);
    } catch (error) {
      toast.error('Failed to create test setup. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Discard changes and return to dashboard?')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 md:p-8 animate-fade-in-up">
      {/* Segmented Controls / Tabs */}
      <div className="flex bg-neutral-100/85 p-1.5 rounded-xl max-w-sm mb-8 select-none">
        <button
          type="button"
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
            activeTab === 'chapter'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          onClick={() => setActiveTab('chapter')}
        >
          Chapter Wise
        </button>
        <button
          type="button"
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-155 ${
            activeTab === 'pyq'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          onClick={() => setActiveTab('pyq')}
        >
          PYQ
        </button>
        <button
          type="button"
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-155 ${
            activeTab === 'mock'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          onClick={() => setActiveTab('mock')}
        >
          Mock Test
        </button>
      </div>

      {/* Test Creation Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          
          {/* COLUMN 1 */}
          <div className="space-y-6">
            {/* Subject Dropdown */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-neutral-700 select-none">
                Subject
              </label>
              <div className="relative">
                <select
                  {...register('subject')}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                    ${selectedSubject ? 'text-neutral-900' : 'text-neutral-400'}
                    ${errors.subject ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'}
                  `}
                >
                  <option value="" disabled hidden className="text-neutral-400">Choose from Drop-down</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub} className="text-neutral-900 bg-white">{sub}</option>
                  ))}
                </select>
                <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.subject && (
                <p className="text-xs text-red-600 font-medium">{errors.subject.message}</p>
              )}
            </div>

            {/* Topic Dropdown */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-neutral-700 select-none">
                Topic
              </label>
              <div className="relative">
                <select
                  {...register('topic')}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                    ${selectedTopic ? 'text-neutral-900' : 'text-neutral-400'}
                    ${errors.topic ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'}
                  `}
                >
                  <option value="" disabled hidden className="text-neutral-400">Choose from Drop-down</option>
                  {topics.map((top) => (
                    <option key={top} value={top} className="text-neutral-900 bg-white">{top}</option>
                  ))}
                </select>
                <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.topic && (
                <p className="text-xs text-red-600 font-medium">{errors.topic.message}</p>
              )}
            </div>

            {/* Duration Input */}
            <Input
              label="Duration (Minutes)"
              type="number"
              placeholder="Enter the time"
              error={errors.duration?.message}
              {...register('duration', { valueAsNumber: true })}
            />

            {/* Marking Scheme Sub-section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-neutral-800 border-b border-neutral-100 pb-1.5">
                Marking Scheme:
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Wrong Answer */}
                <Input
                  label="Wrong Answer"
                  type="number"
                  placeholder="-1"
                  step="1"
                  error={errors.wrongAnswer?.message}
                  {...register('wrongAnswer', { valueAsNumber: true })}
                />
                
                {/* Unattempted */}
                <Input
                  label="Unattempted"
                  type="number"
                  placeholder="+0"
                  step="1"
                  error={errors.unattempted?.message}
                  {...register('unattempted', { valueAsNumber: true })}
                />

                {/* Correct Answer */}
                <Input
                  label="Correct Answer"
                  type="number"
                  placeholder="+5"
                  step="1"
                  error={errors.correctAnswer?.message}
                  {...register('correctAnswer', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-6">
            {/* Name of Test */}
            <Input
              label="Name of Test"
              placeholder="Enter name of Test"
              error={errors.testName?.message}
              {...register('testName')}
            />

            {/* Sub Topic Dropdown */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-neutral-700 select-none">
                Sub Topic
              </label>
              <div className="relative">
                <select
                  {...register('subTopic')}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                    ${selectedSubTopic ? 'text-neutral-900' : 'text-neutral-400'}
                    ${errors.subTopic ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'}
                  `}
                >
                  <option value="" disabled hidden className="text-neutral-400">Choose from Drop-down</option>
                  {subTopics.map((subTop) => (
                    <option key={subTop} value={subTop} className="text-neutral-900 bg-white">{subTop}</option>
                  ))}
                </select>
                <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.subTopic && (
                <p className="text-xs text-red-600 font-medium">{errors.subTopic.message}</p>
              )}
            </div>

            {/* Test Difficulty Level */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-700 select-none">
                Test Difficulty Level
              </span>
              <div className="flex items-center gap-6 py-2.5 select-none">
                {/* Easy */}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-600">
                  <input
                    type="radio"
                    value="easy"
                    className="sr-only"
                    {...register('difficulty')}
                  />
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                    selectedDifficulty === 'easy'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-neutral-300 hover:border-neutral-400 bg-white'
                  }`}>
                    {selectedDifficulty === 'easy' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <span>Easy</span>
                </label>

                {/* Medium */}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-600">
                  <input
                    type="radio"
                    value="medium"
                    className="sr-only"
                    {...register('difficulty')}
                  />
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                    selectedDifficulty === 'medium'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-neutral-300 hover:border-neutral-400 bg-white'
                  }`}>
                    {selectedDifficulty === 'medium' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <span>Medium</span>
                </label>

                {/* Difficult */}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-600">
                  <input
                    type="radio"
                    value="difficult"
                    className="sr-only"
                    {...register('difficulty')}
                  />
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                    selectedDifficulty === 'difficult'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-neutral-300 hover:border-neutral-400 bg-white'
                  }`}>
                    {selectedDifficulty === 'difficult' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <span>Difficult</span>
                </label>
              </div>
            </div>

            {/* No of questions & total marks row */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="No of Questions"
                type="number"
                placeholder="Ex: 50"
                error={errors.noOfQuestions?.message}
                {...register('noOfQuestions', { valueAsNumber: true })}
              />

              <Input
                label="Total Marks"
                type="number"
                placeholder="Ex:250 Marks"
                error={errors.totalMarks?.message}
                {...register('totalMarks', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        {/* Buttons bottom panel */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 mt-8">
          <Button
            variant="outline"
            className="px-6 py-2.5 border-neutral-300 hover:bg-neutral-50 text-neutral-600"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white font-medium rounded-lg"
            isLoading={isSubmitting}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;
