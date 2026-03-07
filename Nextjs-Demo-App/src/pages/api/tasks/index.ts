import type { NextApiRequest, NextApiResponse } from 'next';
import { db, Task } from '@/lib/mockDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET': {
        // Check if status filter is provided
        const { status } = query;
        
        if (status && typeof status === 'string') {
          const validStatuses: Task['status'][] = ['pending', 'in-progress', 'completed'];
          if (validStatuses.includes(status as Task['status'])) {
            const tasks = await db.getTasksByStatus(status as Task['status']);
            return res.status(200).json({
              success: true,
              data: tasks,
              count: tasks.length,
            });
          }
        }

        // Get all tasks
        const allTasks = await db.getAllTasks();
        return res.status(200).json({
          success: true,
          data: allTasks,
          count: allTasks.length,
        });
      }

      case 'POST': {
        const { title, description, status } = req.body;

        // Validation
        if (!title || !description) {
          return res.status(400).json({
            success: false,
            error: 'Title and description are required',
          });
        }

        if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid status value',
          });
        }

        // Create task
        const newTask = await db.createTask({
          title,
          description,
          status: status || 'pending',
        });

        return res.status(201).json({
          success: true,
          data: newTask,
          message: 'Task created successfully',
        });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
