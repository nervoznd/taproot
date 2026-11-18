import { Skill } from "./skill.model";
import { Task } from "./task.model";

/**
 * Полное состояние стора.
 * Плоская нормализация: Record<id, Entity>.
 */
export interface AppState {
  skills: Record<string, Skill>;
  tasks: Record<string, Task>;
}