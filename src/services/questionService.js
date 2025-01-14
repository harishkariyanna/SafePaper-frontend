import axiosInstance from './axiosConfig';
import { store } from '../store/store';
import { setFullScreenLoading } from '../store/slices/fullLoaderSlice';
import { setTransparentLoading } from '../store/slices/transparentLoaderSlice';

export const questionService = {
  async getGuardians() {
    try {
      store.dispatch(setFullScreenLoading(true));
      console.log('Fetching guardians from API');
      const response = await axiosInstance.get('/questions/guardians');
      console.log('Guardians fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching guardians:', error);
      throw error;
    } finally {
      store.dispatch(setFullScreenLoading(false));
    }
  },

  async createQuestion(questionsData) {
    try {
      store.dispatch(setTransparentLoading(true));
      console.log('Creating questions:', questionsData);
      const response = await axiosInstance.post('/questions', questionsData);
      console.log('Questions created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating questions:', error);
      throw error;
    } finally {
      store.dispatch(setTransparentLoading(false));
    }
  }
};
