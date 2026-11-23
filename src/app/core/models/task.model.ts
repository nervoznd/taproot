/**
 * Задача, привязанная к навыку.
 */
export interface Task {
  id: string;
  skillId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  /** ISO-дата или null */
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
}