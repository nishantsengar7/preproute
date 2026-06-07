import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentTest } from '../../store/tests/testsSlice';
import { Button, Modal } from '../../components/ui';
import TestDetailsCard from '../../components/common/TestDetailsCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  Clock,
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Sparkles,
  AlertCircle,
  Check,
  ChevronDown
} from 'lucide-react';

interface LocalQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  explanation: string;
  isSaved: boolean;
  difficulty?: string;
  topic?: string;
  subTopic?: string;
}

export const Questions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentTest = useAppSelector((state) => state.tests.currentTest);

  useDocumentTitle('Question Editor');

  // Fallback test details if navigated directly or refreshing
  const testDetails = (currentTest && (!id || currentTest.id === id))
    ? currentTest
    : (() => {
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('currentTest');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (!id || parsed.id === id) {
                return parsed;
              }
            }
          } catch (e) {
            // ignore
          }
        }
        return {
          id: id || 'test-mock-1',
          title: 'Chapter 1',
          description: 'English - Grammar & Writing (Application)',
          duration: 60,
          passingScore: 40,
          status: 'draft' as const,
          questionsCount: 50,
          creatorId: 'usr-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      })();

  const totalQuestionsLimit = testDetails.questionsCount || 50;

  // Initialize questions dynamically based on selected subject
  const [questions, setQuestions] = useState<LocalQuestion[]>(() => {
    // Generate empty placeholders
    const qList: LocalQuestion[] = Array.from({ length: totalQuestionsLimit }, (_, i) => ({
      id: `q-${i + 1}`,
      text: '',
      options: [
        { id: 'opt-1', text: '' },
        { id: 'opt-2', text: '' },
        { id: 'opt-3', text: '' },
        { id: 'opt-4', text: '' }
      ],
      correctOptionIds: [],
      explanation: '',
      difficulty: testDetails.difficulty || 'easy',
      topic: testDetails.topic || '',
      subTopic: testDetails.subTopic || '',
      isSaved: false
    }));

    const subject = (testDetails.subject || 'English').toLowerCase();
    
    if (subject === 'physics') {
      qList[0] = {
        id: 'q-1',
        text: 'A car accelerates from rest at a constant rate of 2 m/s² for 5 seconds. What is its final velocity?',
        options: [
          { id: 'opt-1', text: '5 m/s' },
          { id: 'opt-2', text: '10 m/s' },
          { id: 'opt-3', text: '15 m/s' },
          { id: 'opt-4', text: '20 m/s' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Velocity = acceleration * time = 2 m/s² * 5 s = 10 m/s.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Kinematics',
        subTopic: testDetails.subTopic || 'Laws of Motion',
        isSaved: true
      };
      qList[1] = {
        id: 'q-2',
        text: 'What is the SI unit of Force?',
        options: [
          { id: 'opt-1', text: 'Joule' },
          { id: 'opt-2', text: 'Watt' },
          { id: 'opt-3', text: 'Newton' },
          { id: 'opt-4', text: 'Pascal' }
        ],
        correctOptionIds: ['opt-3'],
        explanation: 'Force is measured in Newtons (N) in the SI unit system.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Kinematics',
        subTopic: testDetails.subTopic || 'Laws of Motion',
        isSaved: true
      };
      qList[2] = {
        id: 'q-3',
        text: 'Which of the following is a scalar quantity?',
        options: [
          { id: 'opt-1', text: 'Velocity' },
          { id: 'opt-2', text: 'Force' },
          { id: 'opt-3', text: 'Displacement' },
          { id: 'opt-4', text: 'Speed' }
        ],
        correctOptionIds: ['opt-4'],
        explanation: 'Speed only has magnitude, so it is a scalar. Velocity, force, and displacement have direction, making them vectors.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Kinematics',
        subTopic: testDetails.subTopic || 'Laws of Motion',
        isSaved: true
      };
      qList[3] = {
        id: 'q-4',
        text: 'Calculate the work done when a force of 10 N displaces an object by 5 m in the direction of the force.',
        options: [
          { id: 'opt-1', text: '2 Joules' },
          { id: 'opt-2', text: '50 Joules' },
          { id: 'opt-3', text: '15 Joules' },
          { id: 'opt-4', text: '100 Joules' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Work = Force * Displacement = 10 N * 5 m = 50 J.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Kinematics',
        subTopic: testDetails.subTopic || 'Laws of Motion',
        isSaved: true
      };
    } else if (subject === 'chemistry') {
      qList[0] = {
        id: 'q-1',
        text: 'What is the chemical formula of Water?',
        options: [
          { id: 'opt-1', text: 'CO2' },
          { id: 'opt-2', text: 'H2O' },
          { id: 'opt-3', text: 'NaCl' },
          { id: 'opt-4', text: 'CH4' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Water molecules consist of two hydrogen atoms bonded to one oxygen atom, hence H2O.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Organic Chemistry',
        subTopic: testDetails.subTopic || 'Alcohols & Ethers',
        isSaved: true
      };
      qList[1] = {
        id: 'q-2',
        text: 'Which element has the atomic number 1?',
        options: [
          { id: 'opt-1', text: 'Helium' },
          { id: 'opt-2', text: 'Hydrogen' },
          { id: 'opt-3', text: 'Lithium' },
          { id: 'opt-4', text: 'Oxygen' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Hydrogen is the first element on the periodic table with 1 proton.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Organic Chemistry',
        subTopic: testDetails.subTopic || 'Alcohols & Ethers',
        isSaved: true
      };
      qList[2] = {
        id: 'q-3',
        text: 'What type of bond is formed by sharing electrons?',
        options: [
          { id: 'opt-1', text: 'Ionic bond' },
          { id: 'opt-2', text: 'Metallic bond' },
          { id: 'opt-3', text: 'Covalent bond' },
          { id: 'opt-4', text: 'Hydrogen bond' }
        ],
        correctOptionIds: ['opt-3'],
        explanation: 'Covalent bonding involves the sharing of electron pairs between atoms.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Organic Chemistry',
        subTopic: testDetails.subTopic || 'Alcohols & Ethers',
        isSaved: true
      };
      qList[3] = {
        id: 'q-4',
        text: 'What is the pH value of pure water at 25°C?',
        options: [
          { id: 'opt-1', text: '1' },
          { id: 'opt-2', text: '7' },
          { id: 'opt-3', text: '14' },
          { id: 'opt-4', text: '4' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Pure water is neutral and has a pH of 7 at room temperature.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Organic Chemistry',
        subTopic: testDetails.subTopic || 'Alcohols & Ethers',
        isSaved: true
      };
    } else if (subject === 'mathematics') {
      qList[0] = {
        id: 'q-1',
        text: 'What is the derivative of x² with respect to x?',
        options: [
          { id: 'opt-1', text: 'x' },
          { id: 'opt-2', text: '2x' },
          { id: 'opt-3', text: '2' },
          { id: 'opt-4', text: 'x³/3' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'By the power rule, d/dx(x^n) = n*x^(n-1). Thus, d/dx(x²) = 2x.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Calculus',
        subTopic: testDetails.subTopic || 'Integration',
        isSaved: true
      };
      qList[1] = {
        id: 'q-2',
        text: 'Evaluate the expression: 5 + 3 * 2',
        options: [
          { id: 'opt-1', text: '16' },
          { id: 'opt-2', text: '11' },
          { id: 'opt-3', text: '10' },
          { id: 'opt-4', text: '15' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'According to order of operations (PEMDAS), multiplication is done before addition: 5 + (3 * 2) = 5 + 6 = 11.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Algebra',
        subTopic: testDetails.subTopic || 'Matrices',
        isSaved: true
      };
      qList[2] = {
        id: 'q-3',
        text: 'Find the value of x if 2x + 5 = 15.',
        options: [
          { id: 'opt-1', text: '2' },
          { id: 'opt-2', text: '5' },
          { id: 'opt-3', text: '10' },
          { id: 'opt-4', text: '8' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Subtract 5: 2x = 10. Divide by 2: x = 5.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Algebra',
        subTopic: testDetails.subTopic || 'Matrices',
        isSaved: true
      };
      qList[3] = {
        id: 'q-4',
        text: 'What is the sum of angles in a triangle?',
        options: [
          { id: 'opt-1', text: '90 degrees' },
          { id: 'opt-2', text: '180 degrees' },
          { id: 'opt-3', text: '360 degrees' },
          { id: 'opt-4', text: '270 degrees' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'The sum of all interior angles of a triangle is always 180 degrees.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Geometry',
        subTopic: testDetails.subTopic || 'Polygons',
        isSaved: true
      };
    } else {
      // Default English / Grammar templates
      qList[0] = {
        id: 'q-1',
        text: 'Identify the noun in the following sentence: "The quick brown fox jumps over the lazy dog."',
        options: [
          { id: 'opt-1', text: 'jumps' },
          { id: 'opt-2', text: 'quick' },
          { id: 'opt-3', text: 'fox' },
          { id: 'opt-4', text: 'lazy' }
        ],
        correctOptionIds: ['opt-3'],
        explanation: '"fox" and "dog" are naming words (nouns), while "jumps" is a verb, and "quick"/"lazy" are adjectives.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Grammar',
        subTopic: testDetails.subTopic || 'Sentence structure',
        isSaved: true
      };
      qList[1] = {
        id: 'q-2',
        text: 'Which sentence has the correct subject-verb agreement?',
        options: [
          { id: 'opt-1', text: 'The basket of apples look delicious.' },
          { id: 'opt-2', text: 'The basket of apples looks delicious.' },
          { id: 'opt-3', text: 'The baskets of apples looks delicious.' },
          { id: 'opt-4', text: 'The basket of apples were looking delicious.' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'The singular subject is "basket", so the singular verb "looks" must be used.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Grammar',
        subTopic: testDetails.subTopic || 'Sentence structure',
        isSaved: true
      };
      qList[2] = {
        id: 'q-3',
        text: 'What is the correct antonym of the word "Diligent"?',
        options: [
          { id: 'opt-1', text: 'Lazy' },
          { id: 'opt-2', text: 'Hardworking' },
          { id: 'opt-3', text: 'Careful' },
          { id: 'opt-4', text: 'Active' }
        ],
        correctOptionIds: ['opt-1'],
        explanation: '"Diligent" means showing care and conscientiousness in one\'s work. Its opposite is "Lazy".',
        difficulty: 'easy',
        topic: testDetails.topic || 'Vocabulary',
        subTopic: testDetails.subTopic || 'Application',
        isSaved: true
      };
      qList[3] = {
        id: 'q-4',
        text: 'Fill in the blank with the correct preposition: "She has been living in London _______ 2018."',
        options: [
          { id: 'opt-1', text: 'for' },
          { id: 'opt-2', text: 'since' },
          { id: 'opt-3', text: 'from' },
          { id: 'opt-4', text: 'during' }
        ],
        correctOptionIds: ['opt-2'],
        explanation: 'Use "since" with a specific point in time (2018) and "for" for a duration.',
        difficulty: 'easy',
        topic: testDetails.topic || 'Grammar',
        subTopic: testDetails.subTopic || 'Application',
        isSaved: true
      };
    }

    return qList;
  });

  // State Management
  const [currentIdx, setCurrentIdx] = useState(0); // Start on Question 1 (index 0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Rich-text toolbar action
  const execFormat = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value ?? undefined);
  }, []);

  // Current Question details loaded into edit state
  const currentQuestion = questions[currentIdx];
  const [editorText, setEditorText] = useState(currentQuestion.text);
  const [options, setOptions] = useState(currentQuestion.options);
  const [correctIds, setCorrectIds] = useState<string[]>(currentQuestion.correctOptionIds);
  const [explanationText, setExplanationText] = useState(currentQuestion.explanation);
  const [difficulty, setDifficulty] = useState(currentQuestion.difficulty || '');
  const [topic, setTopic] = useState(currentQuestion.topic || '');
  const [subTopic, setSubTopic] = useState(currentQuestion.subTopic || '');

  // Proactive helper to sync local edits back to the main questions list instantly
  const updateCurrentQuestion = useCallback((fields: Partial<LocalQuestion>) => {
    setQuestions(prev => {
      const updated = [...prev];
      const q = updated[currentIdx];
      const newQuestion = { ...q, ...fields };
      
      // Calculate isSaved status
      const hasText = (newQuestion.text || '').trim().length > 0;
      const hasOptions = (newQuestion.options || []).some(opt => opt.text.trim().length > 0);
      const hasCorrect = (newQuestion.correctOptionIds || []).length > 0;
      
      newQuestion.isSaved = hasText && hasOptions && hasCorrect;
      updated[currentIdx] = newQuestion;
      return updated;
    });
  }, [currentIdx]);

  // Sync edit states when current index changes
  useEffect(() => {
    const q = questions[currentIdx];
    setEditorText(q.text);
    setOptions(q.options);
    setCorrectIds(q.correctOptionIds);
    setExplanationText(q.explanation);
    setDifficulty(q.difficulty || '');
    setTopic(q.topic || '');
    setSubTopic(q.subTopic || '');
    // Sync innerHTML of contentEditable editor
    if (editorRef.current && editorRef.current.innerHTML !== q.text) {
      editorRef.current.innerHTML = q.text;
    }
  }, [currentIdx]);

  // Listen to header publish event
  useEffect(() => {
    const handlePublishTrigger = () => {
      setIsPublishModalOpen(true);
    };
    window.addEventListener('publish-test', handlePublishTrigger);
    return () => {
      window.removeEventListener('publish-test', handlePublishTrigger);
    };
  }, []);

  // Save changes validation
  const handleSaveQuestion = useCallback((silent = false) => {
    if (!editorText.trim()) {
      if (!silent) toast.error('Question text cannot be empty');
      return false;
    }
    const hasFilledOptions = options.some(opt => opt.text.trim());
    if (!hasFilledOptions) {
      if (!silent) toast.error('Please enter at least one option');
      return false;
    }
    if (correctIds.length === 0) {
      if (!silent) toast.error('Please select the correct option');
      return false;
    }
    if (!silent) toast.success(`Saved Question ${currentIdx + 1}`);
    return true;
  }, [editorText, options, correctIds, currentIdx]);

  const handleNext = () => {
    // Save/validate the current question
    const saved = handleSaveQuestion(true);
    if (saved) {
      if (currentIdx < totalQuestionsLimit - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Last question - navigate to preview page
        toast.success('All questions configured! Directing to preview...');
        navigate(`/tests/${testDetails.id}/preview`);
      }
    } else {
      // Allow navigation forward even if current question is incomplete, just like standard editor
      if (currentIdx < totalQuestionsLimit - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        navigate(`/tests/${testDetails.id}/preview`);
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleOptionChange = useCallback((optId: string, value: string) => {
    const newOpts = options.map(opt => opt.id === optId ? { ...opt, text: value } : opt);
    setOptions(newOpts);
    updateCurrentQuestion({ options: newOpts });
  }, [options, updateCurrentQuestion]);

  const handleToggleCorrectOption = useCallback((optId: string) => {
    const newCorrect = [optId];
    setCorrectIds(newCorrect);
    updateCurrentQuestion({ correctOptionIds: newCorrect });
  }, [updateCurrentQuestion]);

  const handleDeleteOption = useCallback((optId: string) => {
    if (options.length <= 2) {
      toast.error('Questions must have at least 2 options');
      return;
    }
    const newOpts = options.filter(opt => opt.id !== optId);
    const newCorrect = correctIds.filter(id => id !== optId);
    setOptions(newOpts);
    setCorrectIds(newCorrect);
    updateCurrentQuestion({ options: newOpts, correctOptionIds: newCorrect });
  }, [options, correctIds, updateCurrentQuestion]);

  const handleAddOption = useCallback(() => {
    const nextId = `opt-${options.length + 1}-${Math.floor(Math.random() * 100)}`;
    const newOpts = [...options, { id: nextId, text: '' }];
    setOptions(newOpts);
    updateCurrentQuestion({ options: newOpts });
  }, [options, updateCurrentQuestion]);

  const handleDeleteAllEdits = () => {
    if (window.confirm('Reset all fields for the current question?')) {
      setEditorText('');
      setOptions([
        { id: 'opt-1', text: '' },
        { id: 'opt-2', text: '' },
        { id: 'opt-3', text: '' },
        { id: 'opt-4', text: '' }
      ]);
      setCorrectIds([]);
      setExplanationText('');
      setDifficulty('');
      setTopic('');
      setSubTopic('');
      
      // Update saved status in questions list
      setQuestions(prev => {
        const updated = [...prev];
        updated[currentIdx] = {
          id: `q-${currentIdx + 1}`,
          text: '',
          options: [
            { id: 'opt-1', text: '' },
            { id: 'opt-2', text: '' },
            { id: 'opt-3', text: '' },
            { id: 'opt-4', text: '' }
          ],
          correctOptionIds: [],
          explanation: '',
          difficulty: '',
          topic: '',
          subTopic: '',
          isSaved: false
        };
        return updated;
      });
      toast.success('Question fields cleared');
    }
  };

  // CSV Import parser
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        
        let importedCount = 0;
        const tempQuestions = [...questions];

        lines.forEach(line => {
          // Format expected: "Question Text", "Opt1", "Opt2", "Opt3", "Opt4", correctIdx(0-3), "Solution"
          // We can use a regex to handle quoted values and commas
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (matches && matches.length >= 6) {
            const cleanText = matches[0].replace(/^"|"$/g, '').trim();
            const opt1 = matches[1].replace(/^"|"$/g, '').trim();
            const opt2 = matches[2].replace(/^"|"$/g, '').trim();
            const opt3 = matches[3].replace(/^"|"$/g, '').trim();
            const opt4 = matches[4].replace(/^"|"$/g, '').trim();
            const correctIdx = parseInt(matches[5].replace(/^"|"$/g, '').trim(), 10);
            const solution = matches[6] ? matches[6].replace(/^"|"$/g, '').trim() : '';

            const opts = [
              { id: 'opt-1', text: opt1 },
              { id: 'opt-2', text: opt2 },
              { id: 'opt-3', text: opt3 },
              { id: 'opt-4', text: opt4 }
            ];

            // Find first unsaved question slot
            const firstEmpty = tempQuestions.findIndex(q => !q.isSaved);
            if (firstEmpty !== -1 && firstEmpty < totalQuestionsLimit) {
              tempQuestions[firstEmpty] = {
                id: `q-${firstEmpty + 1}`,
                text: cleanText,
                options: opts,
                correctOptionIds: [opts[correctIdx]?.id || 'opt-1'],
                explanation: solution,
                isSaved: true
              };
              importedCount++;
            }
          }
        });

        if (importedCount > 0) {
          setQuestions(tempQuestions);
          toast.success(`Successfully imported ${importedCount} questions from CSV!`);
        } else {
          toast.error('Could not import questions. Make sure format is: Question, Opt1, Opt2, Opt3, Opt4, CorrectIndex(0-3), Explanation');
        }
      } catch (err) {
        toast.error('Error reading CSV file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmPublish = () => {
    // Check how many questions are actually configured
    const savedCount = questions.filter(q => q.isSaved).length;
    
    // Simulate updating API status to published
    dispatch(setCurrentTest({
      ...testDetails,
      status: 'published',
      questionsCount: savedCount
    }));

    toast.success('Test published successfully!');
    setIsPublishModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
    {/* Test details metadata card — reusable shared component */}
      <TestDetailsCard test={testDetails} showMetrics />

      {/* Split screen content layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        
        {/* Left panel: Sidebar questions list */}
        <aside 
          className={`bg-white rounded-xl border border-neutral-200 shadow-sm p-4 transition-all duration-200 shrink-0 select-none
            ${isSidebarCollapsed ? 'w-16' : 'w-full lg:w-64'}
          `}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
            {!isSidebarCollapsed && (
              <div>
                <h3 className="text-sm font-bold text-neutral-800">Question creation</h3>
                <p className="text-[10px] font-bold text-neutral-400 mt-1">Total Questions , {totalQuestionsLimit}</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 transition-colors mx-auto lg:mx-0"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? (
                /* Expand Icon >> */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B72E1]">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              ) : (
                /* Collapse Icon << */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B72E1]">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Scrollable list of questions */}
          <div 
            className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 pr-0 lg:pr-1"
          >
            {questions.map((q, idx) => {
              const isActive = idx === currentIdx;
              const isSaved = q.isSaved;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    handleSaveQuestion(true);
                    setCurrentIdx(idx);
                  }}
                  className={`flex items-center rounded-xl transition-all duration-150 min-w-[110px] lg:min-w-0
                    ${isSidebarCollapsed ? 'justify-center p-2 w-10 h-10 mx-auto' : 'justify-between py-2.5 px-3 w-full border'}
                    ${isActive 
                      ? 'border-[#3B72E1] ring-2 ring-[#3B72E1]/30 bg-indigo-50/10' 
                      : isSaved 
                        ? 'border-emerald-500 bg-[#F0FDF4] text-emerald-700 hover:bg-emerald-100/50' 
                        : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50'
                    }
                  `}
                  title={`Question ${idx + 1}`}
                >
                  {isSidebarCollapsed ? (
                    // Collapsed state
                    isSaved ? (
                      <span className="w-5.5 h-5.5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : (
                      <span className="w-5.5 h-5.5 rounded-full bg-neutral-50 border border-neutral-300 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="w-1.2 h-1.2 rounded-full bg-neutral-400" />
                      </span>
                    )
                  ) : (
                    // Expanded state
                    <>
                      <div className="flex items-center gap-2.5">
                        {isSaved ? (
                          <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-neutral-50 border border-neutral-300 flex items-center justify-center shrink-0">
                            <span className="w-1.2 h-1.2 rounded-full bg-neutral-450" />
                          </span>
                        )}
                        <span className="font-bold text-[12px] truncate">Question {idx + 1}</span>
                      </div>
                      
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isSaved ? "text-emerald-500" : "text-neutral-300"}>
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                      </svg>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Panel: Main Question Editor Form */}
        <section className="flex-1 w-full bg-white rounded-xl border border-neutral-200 shadow-sm p-6 md:p-8 animate-fade-in">
          
          {/* Header toolbar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-neutral-800">
              Question {currentIdx + 1}/{totalQuestionsLimit}
            </h3>
            
            <div className="flex items-center gap-3">
              {/* Dropdown template select */}
              <div className="relative">
                <button 
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-350 rounded-lg text-xs font-bold text-neutral-600 hover:bg-neutral-50 select-none"
                >
                  <Plus className="h-3.5 w-3.5 text-neutral-500" />
                  <span>MCQ</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-450" />
                </button>
              </div>

              {/* CSV Upload tool */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-350 rounded-lg text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                title="Bulk Upload Questions via CSV"
              >
                <Upload className="h-3.5 w-3.5 text-neutral-500" />
                <span>CSV</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCSVImport}
                accept=".csv"
                className="hidden"
              />
            </div>
          </div>

          {/* Delete All Edits */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleDeleteAllEdits}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete All Edits</span>
            </button>
          </div>

          {/* Editor Container */}
          <div className="space-y-6">
            <div className="border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 bg-neutral-50/80 border-b border-neutral-250 p-2 text-neutral-500 select-none">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Bold"
                ><Bold className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Italic"
                ><Italic className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('underline'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Underline"
                ><Underline className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('strikeThrough'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Strikethrough"
                ><Strikethrough className="h-3.5 w-3.5" /></button>
                <div className="w-[1px] h-4 bg-neutral-250 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = window.prompt('Enter URL:');
                    if (url) execFormat('createLink', url);
                  }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Insert Link"
                ><Link className="h-3.5 w-3.5" /></button>
                <div className="w-[1px] h-4 bg-neutral-250 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('justifyLeft'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Align Left"
                ><AlignLeft className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('justifyCenter'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Align Center"
                ><AlignCenter className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execFormat('justifyRight'); }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Align Right"
                ><AlignRight className="h-3.5 w-3.5" /></button>
                <div className="w-[1px] h-4 bg-neutral-250 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const imgUrl = window.prompt('Enter image URL:');
                    if (imgUrl) execFormat('insertImage', imgUrl);
                  }}
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all"
                  title="Insert Image"
                ><Image className="h-3.5 w-3.5" /></button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-neutral-200/60 hover:text-neutral-800 transition-all flex items-center gap-0.5 text-[10px] font-bold"
                  title="Formula"
                ><Sparkles className="h-3.5 w-3.5 text-amber-500" /><span>fx</span></button>
              </div>

              {/* ContentEditable Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  const html = editorRef.current?.innerHTML ?? '';
                  setEditorText(html);
                  updateCurrentQuestion({ text: html });
                }}
                data-placeholder="Type here"
                className="w-full min-h-[8rem] px-4 py-3 text-sm outline-none bg-white text-neutral-800 empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400"
                style={{ resize: 'vertical', overflow: 'auto' }}
              />
            </div>

            {/* Options block */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-neutral-700 select-none">
                Type the options below
              </span>
              
              <div className="space-y-3">
                {options.map((opt) => {
                  const isChecked = correctIds.includes(opt.id);

                  return (
                    <div key={opt.id} className="flex items-center gap-3 w-full">
                      {/* Check Radio Selection Indicator */}
                      <button
                        type="button"
                        onClick={() => handleToggleCorrectOption(opt.id)}
                        className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isChecked
                            ? 'border-[#3B72E1] bg-[#F0F5FF]'
                            : 'border-neutral-300 hover:border-neutral-400 bg-white'
                        }`}
                        title="Set as correct answer"
                      >
                        {isChecked && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#3B72E1]" />
                        )}
                      </button>

                      {/* Option Text Input */}
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        placeholder={`Type Option here`}
                        className="flex-1 rounded-lg border border-neutral-350 bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />

                      {/* Delete Option */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(opt.id)}
                        className="p-2 rounded-lg text-neutral-400 hover:text-red-650 hover:bg-neutral-50 transition-colors shrink-0"
                        title="Delete Option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Option Trigger */}
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-neutral-300 text-xs font-bold text-neutral-500 hover:border-neutral-450 hover:text-neutral-700 transition-all select-none"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Option</span>
              </button>
            </div>

            {/* Explanation/Solution Section */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-neutral-700 select-none">
                Add Solution
              </span>
              
              <div className="border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <textarea
                  value={explanationText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExplanationText(val);
                    updateCurrentQuestion({ explanation: val });
                  }}
                  placeholder="Type here"
                  className="w-full h-24 px-4 py-3 text-sm outline-none bg-white text-neutral-800 resize-y placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Centered navigation arrows */}
            <div className="flex items-center justify-center gap-8 py-4">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="p-2 rounded-full border border-neutral-350 text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Previous Question"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={currentIdx === totalQuestionsLimit - 1}
                onClick={handleNext}
                className="p-2 rounded-full border border-neutral-350 text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                title="Next Question"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Question settings dropdown panel */}
            <div className="border-t border-neutral-100 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-neutral-800 select-none">Question settings</h4>
              
              <div className="space-y-4 max-w-2xl">
                {/* Level of Difficulty */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-neutral-700 select-none">Level of Difficulty</label>
                  <div className="relative">
                    <select
                      value={difficulty}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDifficulty(val);
                        updateCurrentQuestion({ difficulty: val });
                      }}
                      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                        ${difficulty ? 'text-neutral-900' : 'text-neutral-400'}
                        border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                      `}
                    >
                      <option value="" disabled hidden>Select from Drop-down</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="difficult">Difficult</option>
                    </select>
                    <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Topic — options are dynamic based on selected subject */}
                {(() => {
                  const subjectKey = (testDetails.subject || 'english').toLowerCase();
                  const topicMap: Record<string, string[]> = {
                    physics: ['Kinematics', 'Thermodynamics', 'Electrostatics', 'Optics', 'Modern Physics'],
                    chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Electrochemistry'],
                    mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'],
                    biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Evolution'],
                    english: ['Grammar', 'Writing', 'Literature', 'Vocabulary'],
                  };
                  const subTopicMap: Record<string, string[]> = {
                    physics: ['Laws of Motion', 'Projectiles', 'Heat Transfer', 'Circuits', 'Wave Optics'],
                    chemistry: ['Alcohols & Ethers', 'Periodic Table', 'Mole Concept', 'Chemical Bonding', 'Redox Reactions'],
                    mathematics: ['Matrices', 'Integration', 'Differentiation', 'Permutations', 'Probability'],
                    biology: ['Mitosis', 'DNA Replication', 'Food Chains', 'Blood Circulation', 'Natural Selection'],
                    english: ['Application', 'Sentence structure', 'Punctuation', 'Reading Comprehension'],
                  };
                  const topics = topicMap[subjectKey] || topicMap['english'];
                  const subTopics = subTopicMap[subjectKey] || subTopicMap['english'];
                  return (
                    <>
                      {/* Topic */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-neutral-700 select-none">Topic</label>
                        <div className="relative">
                          <select
                            value={topic}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTopic(val);
                              updateCurrentQuestion({ topic: val });
                            }}
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                              ${topic ? 'text-neutral-900' : 'text-neutral-400'}
                              border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                            `}
                          >
                            <option value="" disabled hidden>Select from Drop-down</option>
                            {topics.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      {/* Sub-topic */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-neutral-700 select-none">Sub-topic</label>
                        <div className="relative">
                          <select
                            value={subTopic}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSubTopic(val);
                              updateCurrentQuestion({ subTopic: val });
                            }}
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none appearance-none transition-all duration-200
                              ${subTopic ? 'text-neutral-900' : 'text-neutral-400'}
                              border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                            `}
                          >
                            <option value="" disabled hidden>Select from Drop-down</option>
                            {subTopics.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-neutral-400">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Footer Save actions Panel */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-8">
            <Button
              type="button"
              onClick={() => {
                if (window.confirm('Exit test creation and return to the dashboard? Unsaved changes will be lost.')) {
                  navigate('/dashboard');
                }
              }}
              className="px-6 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              Exit Test Creation
            </Button>
            
            <Button
              onClick={handleNext}
              className="px-8 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white rounded-lg font-semibold shadow-sm transition-all"
            >
              Next
            </Button>
          </div>
        </section>
      </div>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publish Test Configuration"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 select-none">
            <AlertCircle className="h-5 w-5 text-[#3B72E1] shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700 leading-relaxed font-semibold">
              <p className="font-bold text-neutral-900 text-sm mb-1">Before you publish...</p>
              Please make sure all test configurations and metadata are final. Once published, candidates can start attempting this test immediately.
            </div>
          </div>

          {/* Test details list */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-xs font-semibold text-neutral-600 select-none">
            <div className="flex justify-between">
              <span>Test Title:</span>
              <span className="text-neutral-900 font-bold">{testDetails.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Subject:</span>
              <span className="text-neutral-900 font-bold">{testDetails.subject || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="text-neutral-900 font-bold">{testDetails.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Total Questions Configured:</span>
              <span className="text-neutral-900 font-bold">
                {questions.filter(q => q.isSaved).length} / {totalQuestionsLimit}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 mt-2 font-bold text-sm">
              <span className="text-neutral-800">Ready to Publish?</span>
              <span className="text-emerald-600">
                {questions.filter(q => q.isSaved).length > 0 ? 'Yes' : 'No questions configured'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              variant="outline"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-5 py-2 border-neutral-300 hover:bg-neutral-50 text-neutral-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPublish}
              disabled={questions.filter(q => q.isSaved).length === 0}
              className="px-6 py-2 bg-[#4F83F1] hover:bg-[#3D72E1] text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Publish
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Questions;
