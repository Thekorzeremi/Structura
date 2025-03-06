import axios from 'axios';

interface Event {
  id: number;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  worksite: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
    place: string;
    manager: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

const API_URL = 'http://localhost:8000/api';

export const eventService = {
  getMyEvents: async (email: string): Promise<Event[]> => {
    try {
      const response = await axios.post(`${API_URL}/events/me`, { email });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
};
