import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillTreeStore } from '../../../core/store/skill-tree.store';
import { SkillNodeComponent } from '../skill-node/skill-node.component';

/**
 * Страница дерева
 */
@Component({
  selector: 'app-tree-page',
  standalone: true,
  imports: [SkillNodeComponent],
  templateUrl: './tree-page.component.html',
  styleUrl: './tree-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreePageComponent {
  private readonly store = inject(SkillTreeStore);
  readonly rootSkills = this.store.rootSkills;

  resetState(): void {
    if (confirm('Сбросить весь прогресс? Это необратимо.')) {
      this.store.reset();
    }
  }
}