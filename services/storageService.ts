import { AppState, Task, TaskType } from '../types';

const STORAGE_KEY = 'MONSTER_TREASURY_DATA_V1';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: AppState = {
  balance: 125.00,
  totalEarnings: 800.00,
  transactions: [
    { id: '1', date: new Date(Date.now() - 86400000).toISOString(), amount: 5, description: 'Daily Reading', type: 'income' },
    { id: '2', date: new Date(Date.now() - 172800000).toISOString(), amount: -200, description: 'Lego Set', type: 'expense' }
  ],
  tasks: [],
  wishes: [
    { id: 'w1', name: 'Nintendo Switch Game', price: 300 }
  ],
  streak: 3,
  lastLoginDate: getTodayDate()
};

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let state = stored ? JSON.parse(stored) : INITIAL_STATE;
  
  // Daily Reset Logic
  const today = getTodayDate();
  if (state.lastLoginDate !== today) {
    // Check streak before resetting tasks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // If last login was not yesterday and not today, reset streak
    if (state.lastLoginDate !== yesterdayStr && state.lastLoginDate !== today) {
       state.streak = 0;
    }
    
    state.lastLoginDate = today;
  }

  // Ensure tasks for today exist
  const existingReading = state.tasks.find((t: Task) => t.date === today && t.type === TaskType.READING);
  const existingEnglish = state.tasks.find((t: Task) => t.date === today && t.type === TaskType.ENGLISH);

  const newTasks = [...state.tasks];
  
  if (!existingReading) {
    newTasks.push({
      id: `reading-${today}`,
      type: TaskType.READING,
      title: 'Daily Reading Time',
      description: 'Read a book for 15 minutes',
      reward: 5.00,
      status: 'todo',
      date: today
    });
  }

  if (!existingEnglish) {
    newTasks.push({
      id: `english-${today}`,
      type: TaskType.ENGLISH,
      title: 'English Challenge',
      description: 'Practice speaking one sentence',
      reward: 5.00,
      status: 'todo',
      date: today
    });
  }
  
  state.tasks = newTasks;
  return state;
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
