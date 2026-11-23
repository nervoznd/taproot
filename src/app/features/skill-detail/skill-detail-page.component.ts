import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SkillTreeStore } from '../../core/store/skill-tree.store';
import { SkillStatus } from '../../core/models/skill.model';

/**
 * Детальная страница навыка.
 *
 * Маршрут: /tree/:skillId
 * skillId приходит как route param — через withComponentInputBinding().
 */
@Component({
  selector: 'app-skill-detail-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './skill-detail-page.component.html',
  styleUrl: './skill-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillDetailPageComponent {
  private readonly store = inject(SkillTreeStore);
  private readonly fb = inject(FormBuilder);

  readonly skillId = input.required<string>();

  // ── Селекторы ──────────────────────────────────────────

  readonly skill = computed(() => this.store.skills()[this.skillId()]);
  readonly status = computed<SkillStatus>(() =>
    this.store.statusById(this.skillId())(),
  );
  readonly tasks = computed(() => this.store.tasksBySkill(this.skillId())());

  readonly doneCount = computed(
    () => this.tasks().filter((t) => t.status === 'done').length,
  );
  readonly totalCount = computed(() => this.tasks().length);
  readonly progressPercent = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.doneCount() / total) * 100);
  });

  /** Человекочитаемый статус. */
  readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'locked': return 'Заблокировано';
      case 'available': return 'Доступно';
      case 'in-progress': return 'В процессе';
      case 'mastered': return 'Освоено';
    }
  });

  // ── Форма добавления задачи ────────────────────────────

  readonly addTaskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    priority: this.fb.nonNullable.control<'low' | 'medium' | 'high'>('medium'),
  });

  // ── Методы ─────────────────────────────────────────────

  toggleTask(taskId: string, done: boolean): void {
    this.store.updateTaskStatus(taskId, done ? 'done' : 'todo');
  }

  submitTask(): void {
    if (this.addTaskForm.invalid) return;

    const value = this.addTaskForm.getRawValue();
    this.store.addTask({
      skillId: this.skillId(),
      title: value.title.trim(),
      priority: value.priority,
    });

    this.addTaskForm.reset({ title: '', priority: 'medium' });
  }

  removeTask(taskId: string): void {
    this.store.removeTask(taskId);
  }
}