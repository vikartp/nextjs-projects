import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mockDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const { id } = query;

  // Validate ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID',
    });
  }

  try {
    switch (method) {
      case 'GET': {
        const task = await db.getTaskById(id);
        
        if (!task) {
          return res.status(404).json({
            success: false,
            error: 'Task not found',
          });
        }

        return res.status(200).json({
          success: true,
          data: task,
        });
      }

      case 'PUT': {
        const { title, description, status } = req.body;

        // Validation
        if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid status value',
          });
        }

        // Update task
        const updatedTask = await db.updateTask(id, {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
        });

        if (!updatedTask) {
          return res.status(404).json({
            success: false,
            error: 'Task not found',
          });
        }

        return res.status(200).json({
          success: true,
          data: updatedTask,
          message: 'Task updated successfully',
        });
      }

      case 'DELETE': {
        const deleted = await db.deleteTask(id);

        if (!deleted) {
          return res.status(404).json({
            success: false,
            error: 'Task not found',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Task deleted successfully',
        });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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
