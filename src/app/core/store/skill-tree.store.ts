import { Injectable, computed, signal } from '@angular/core';
import { AppState } from '../models/app-state.model';
import { Skill } from '../models/skill.model';
import { Task } from '../models/task.model';
import { INITIAL_STATE } from '../data/initial-state';

/**
 * Центральное хранилище состояния приложения.
 */
@Injectable({ providedIn: 'root' })
export class SkillTreeStore {
  private readonly _state = signal<AppState>(INITIAL_STATE);

  // ─────────────────────────────────────────────────────────
  // Публичные селекторы
  // ─────────────────────────────────────────────────────────

  readonly state = this._state.asReadonly();

  readonly skills = computed(() => this._state().skills);

  readonly tasks = computed(() => this._state().tasks);

  readonly rootSkills = computed<Skill[]>(() =>
    Object.values(this._state().skills)
      .filter((s) => s.parentId === null)
      .sort((a, b) => a.title.localeCompare(b.title)),
  );

  readonly totalTasks = computed(() => Object.keys(this._state().tasks).length);

  readonly doneTasks = computed(
    () => Object.values(this._state().tasks).filter((t) => t.status === 'done').length,
  );

  readonly overallProgress = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return this.doneTasks() / total;
  });

  // ─────────────────────────────────────────────────────────
  // Селекторы по id (фабрики)
  // ─────────────────────────────────────────────────────────

  skillById(id: string) {
    return computed<Skill | undefined>(() => this._state().skills[id]);
  }

  tasksBySkill(skillId: string) {
    return computed<Task[]>(() =>
      Object.values(this._state().tasks)
        .filter((t) => t.skillId === skillId)
        .sort((a, b) => this.priorityWeight(b) - this.priorityWeight(a)),
    );
  }

  // ─────────────────────────────────────────────────────────
  // Мутации: задачи
  // ─────────────────────────────────────────────────────────

  updateTaskStatus(taskId: string, status: Task['status']): void {
    this._state.update((state) => {
      const task = state.tasks[taskId];
      if (!task) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...task, status },
        },
      };
    });
  }

  completeTask(taskId: string): void {
    this.updateTaskStatus(taskId, 'done');
  }

  // ─────────────────────────────────────────────────────────
  // Внутренние утилиты
  // ─────────────────────────────────────────────────────────

  /** Числовой вес приоритета для сортировки. */
  private priorityWeight(task: Task): number {
    switch (task.priority) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
    }
  }
}