/**
 * Статус навыка. Вычисляется, не хранится.
 * - locked:      требования не выполнены
 * - available:   можно начинать
 * - in-progress: есть начатые задачи, но узел не mastered
 * - mastered:    все требуемые задачи закрыты
 */
export type SkillStatus = 'locked' | 'available' | 'in-progress' | 'mastered';

/**
 * Требования для разблокировки навыка.
 * Логика AND: все перечисленные навыки должны быть mastered.
 */
export interface SkillRequirements {
  /** ID навыков, которые должны быть mastered до разблокировки */
  skillsDone: string[];
}

/**
 * Правила "мастерства" узла.
 */
export interface SkillCompletion {
  /** Сколько задач в этом узле нужно закрыть для mastered */
  tasksRequired: number;
}

/**
 * Узел дерева навыков.
 * Дерево иерархии: у узла один parentId.
 * Граф требований: requires.skillsDone может ссылаться на узлы из других веток.
 */
export interface Skill {
  id: string;
  title: string;
  description: string;
  /** null только у корневых узлов */
  parentId: string | null;
  /** Прямые потомки. Пустой массив у листьев */
  childrenIds: string[];
  requires: SkillRequirements;
  completion: SkillCompletion;
}