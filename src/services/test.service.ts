import api from './api';
import type { ApiResponse, Test, Question } from '../types';

export const testService = {
  getTests: async (): Promise<ApiResponse<Test[]>> => {
    return api.get('/tests');
  },

  getTestById: async (id: string): Promise<ApiResponse<Test>> => {
    return api.get(`/tests/${id}`);
  },

  createTest: async (data: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'questionsCount' | 'creatorId'>): Promise<ApiResponse<Test>> => {
    return api.post('/tests', data);
  },

  updateTest: async (id: string, data: Partial<Test>): Promise<ApiResponse<Test>> => {
    return api.patch(`/tests/${id}`, data);
  },

  deleteTest: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete(`/tests/${id}`);
  },

  getQuestions: async (testId: string): Promise<ApiResponse<Question[]>> => {
    return api.get(`/tests/${testId}/questions`);
  },

  createQuestion: async (testId: string, data: Omit<Question, 'id' | 'testId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Question>> => {
    return api.post(`/tests/${testId}/questions`, data);
  },

  updateQuestion: async (testId: string, questionId: string, data: Partial<Question>): Promise<ApiResponse<Question>> => {
    return api.patch(`/tests/${testId}/questions/${questionId}`, data);
  },

  deleteQuestion: async (testId: string, questionId: string): Promise<ApiResponse<null>> => {
    return api.delete(`/tests/${testId}/questions/${questionId}`);
  },

  publishTest: async (id: string): Promise<ApiResponse<Test>> => {
    return api.post(`/tests/${id}/publish`);
  }
};

export default testService;
