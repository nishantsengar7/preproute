import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Test, Question } from '../../types';

interface TestsState {
  tests: Test[];
  currentTest: Test | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const getSavedTest = (): Test | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('currentTest');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const initialState: TestsState = {
  tests: [],
  currentTest: getSavedTest(),
  questions: [],
  loading: false,
  error: null,
};

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    fetchTestsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTestsSuccess(state, action: PayloadAction<Test[]>) {
      state.loading = false;
      state.tests = action.payload;
    },
    fetchTestsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTest(state, action: PayloadAction<Test | null>) {
      state.currentTest = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('currentTest', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('currentTest');
        }
      }
    },
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
    addQuestion(state, action: PayloadAction<Question>) {
      state.questions.push(action.payload);
      if (state.currentTest) {
        state.currentTest.questionsCount += 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentTest', JSON.stringify(state.currentTest));
        }
      }
    },
    updateQuestionState(state, action: PayloadAction<Question>) {
      const idx = state.questions.findIndex(q => q.id === action.payload.id);
      if (idx !== -1) {
        state.questions[idx] = action.payload;
      }
    },
    deleteQuestionState(state, action: PayloadAction<string>) {
      state.questions = state.questions.filter(q => q.id !== action.payload);
      if (state.currentTest) {
        state.currentTest.questionsCount = Math.max(0, state.currentTest.questionsCount - 1);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentTest', JSON.stringify(state.currentTest));
        }
      }
    },
    clearTestsState(state) {
      state.tests = [];
      state.currentTest = null;
      state.questions = [];
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentTest');
      }
    }
  },
});

export const {
  fetchTestsStart,
  fetchTestsSuccess,
  fetchTestsFailure,
  setCurrentTest,
  setQuestions,
  addQuestion,
  updateQuestionState,
  deleteQuestionState,
  clearTestsState
} = testsSlice.actions;

export default testsSlice.reducer;
