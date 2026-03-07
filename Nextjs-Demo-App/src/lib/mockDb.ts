// Mock Database - In-memory storage
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Simulated database
let tasks: Task[] = [
  {
    id: '1',
    title: 'Setup Next.js Project',
    description: 'Initialize Next.js with TypeScript and Firebase',
    status: 'completed',
    createdAt: new Date('2026-02-14').toISOString(),
    updatedAt: new Date('2026-02-14').toISOString(),
  },
  {
    id: '2',
    title: 'Create Authentication',
    description: 'Implement signin and signup functionality',
    status: 'in-progress',
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-15').toISOString(),
  },
  {
    id: '3',
    title: 'Build Dashboard',
    description: 'Create user dashboard with charts',
    status: 'pending',
    createdAt: new Date('2026-02-16').toISOString(),
    updatedAt: new Date('2026-02-16').toISOString(),
  },
];

// Database operations
export const db = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    // Simulate async database call
    return new Promise((resolve) => {
      setTimeout(() => resolve([...tasks]), 100);
    });
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = tasks.find((t) => t.id === id);
        resolve(task);
      }, 100);
    });
  },

  // Create new task
  createTask: async (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...data,
          id: String(Date.now()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        resolve(newTask);
      }, 100);
    });
  },

  // Update task
  updateTask: async (
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Promise<Task | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        tasks[index] = {
          ...tasks[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        resolve(tasks[index]);
      }, 100);
    });
  },

  // Delete task
  deleteTask: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        tasks.splice(index, 1);
        resolve(true);
      }, 100);
    });
  },

  // Filter tasks by status
  getTasksByStatus: async (
    status: Task['status']
  ): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = tasks.filter((t) => t.status === status);
        resolve(filtered);
      }, 100);
    });
  },
};
