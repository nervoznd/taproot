import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SkillTreeStore } from '../../../core/store/skill-tree.store';
import { SkillStatus } from '../../../core/models/skill.model';
import { RouterLink } from '@angular/router';

/**
 * Рекурсивный компонент узла дерева навыков.
 */
@Component({
  selector: 'app-skill-node',
  standalone: true,
  imports: [SkillNodeComponent, RouterLink], // сам себя — для рекурсии
  templateUrl: './skill-node.component.html',
  styleUrl: './skill-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillNodeComponent {
  private readonly store = inject(SkillTreeStore);

  readonly skillId = input.required<string>();

  readonly skill = computed(() => this.store.skills()[this.skillId()]);

  readonly status = computed<SkillStatus>(() => this.store.statusById(this.skillId())());

  readonly childrenIds = computed(() => this.skill()?.childrenIds ?? []);

  readonly hasChildren = computed(() => this.childrenIds().length > 0);

  readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'locked': return 'Заблокировано';
      case 'available': return 'Доступно';
      case 'in-progress': return 'В процессе';
      case 'mastered': return 'Освоено';
    }
  });

  /**
   * Раскрыт ли узел.
   */
  readonly expanded = signal(true);

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }
}