import { Injectable, computed, signal, effect, inject } from '@angular/core';
import { AppState } from '../models/app-state.model';
import { Skill, SkillStatus } from '../models/skill.model';
import { Task } from '../models/task.model';
import { INITIAL_STATE } from '../data/initial-state';
import { computeSkillStatus } from '../logic/skill-status';
import { PersistenceService } from '../persistence/persistence.service';

/**
 * Центральное хранилище состояния приложения.
 */
@Injectable({ providedIn: 'root' })
export class SkillTreeStore {
  private readonly persistence = inject(PersistenceService);
  private readonly _state = signal<AppState>(
    this.persistence.load() ?? INITIAL_STATE,
  );

  constructor() {
    /**
     * Автосохранение при каждом изменении состояния.
     */
    effect(
      () => {
        this.persistence.save(this._state());
      },
    );
  }

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

  statusById(skillId: string) {
    return computed<SkillStatus>(() =>
      computeSkillStatus(skillId, this._state()),
    );
  }

  // ─────────────────────────────────────────────────────────
  // Мутации: задачи
  // ─────────────────────────────────────────────────────────

  /**
   * Добавить задачу к навыку.
   * ID генерируется через crypto.randomUUID().
   */
  addTask(input: {
    skillId: string;
    title: string;
    priority: Task['priority'];
    dueDate?: string | null;
  }): void {
    const id = crypto.randomUUID();
    const task: Task = {
      id,
      skillId: input.skillId,
      title: input.title,
      status: 'todo',
      dueDate: input.dueDate ?? null,
      priority: input.priority,
    };

    this._state.update((state) => ({
      ...state,
      tasks: { ...state.tasks, [id]: task },
    }));
  }

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

  /**
   * Удалить задачу по id.
   * Если задачи нет — no-op (не бросаем, не логируем).
   */
  removeTask(taskId: string): void {
    this._state.update((state) => {
      if (!state.tasks[taskId]) return state;
      const { [taskId]: _removed, ...rest } = state.tasks;
      return { ...state, tasks: rest };
    });
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

  /** Сброс к начальному состоянию + очистка localStorage. */
  reset(): void {
    this.persistence.clear();
    this._state.set(INITIAL_STATE);
  }
}