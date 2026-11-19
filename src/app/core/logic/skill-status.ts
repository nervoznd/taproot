import { AppState } from '../models/app-state.model';
import { Skill, SkillStatus } from '../models/skill.model';

/**
 * Контекст вычисления.
 */
interface ComputeContext {
  /** id узлов, которые сейчас вычисляются в этой ветке рекурсии */
  inProgress: Set<string>;
}

/**
 * Вычисляет статус навыка.
 *
 * Логика (порядок важен):
 *  1. mastered     — свои задачи закрыты И все дети mastered
 *  2. locked       — требования не выполнены
 *  3. in-progress  — есть начатые задачи, но не все выполнены
 *  4. available    — остальное
 *
 * "mastered" проверяется первым: даже если requires не выполнены,
 * но узел каким-то образом mastered — он mastered (защита от кривых данных).
 */
export function computeSkillStatus(
  skillId: string,
  state: AppState,
  ctx: ComputeContext = { inProgress: new Set() },
): SkillStatus {
  // ── Защита от циклов ──────────────────────────────────
  if (ctx.inProgress.has(skillId)) {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.error(`[skill-status] Цикл в requirements: ${skillId}`);
    }
    return 'locked';
  }

  const skill = state.skills[skillId];
  if (!skill) return 'locked';

  if (isMastered(skill, state, ctx)) {
    return 'mastered';
  }

  if (!areRequirementsMet(skill, state, ctx)) {
    return 'locked';
  }

  if (hasStarted(skill, state, ctx)) return 'in-progress';

  return 'available';
}

// ───────────────────────────────────────────────────────
// Внутренние хелперы
// ───────────────────────────────────────────────────────

/**
 * Узел mastered, если:
 *  - задач в узле >= completion.tasksRequired
 *  - все задачи в узле выполнены
 *  - все дети mastered (если есть)
 *
 * Для корней (tasksRequired: 0) mastered зависит только от детей.
 */
function isMastered(skill: Skill, state: AppState, ctx: ComputeContext): boolean {
  const tasks = tasksOf(skill.id, state);
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const ownTasksDone = doneCount >= skill.completion.tasksRequired && tasks.every((t) => t.status === 'done');
  if (!ownTasksDone) return false;

  // Для листьев childrenIds пустой — every на пустом массиве даёт true
  return skill.childrenIds.every((childId) => {
    const childCtx: ComputeContext = {
      inProgress: new Set([...ctx.inProgress, skill.id]),
    };
    return computeSkillStatus(childId, state, childCtx) === 'mastered';
  });
}

/**
 * Требования выполнены, если ВСЕ узлы из requires.skillsDone — mastered.
 * Пустой список = требования выполнены.
 */
function areRequirementsMet(skill: Skill, state: AppState, ctx: ComputeContext): boolean {
  return skill.requires.skillsDone.every((depId) => {
    const depCtx: ComputeContext = {
      inProgress: new Set([...ctx.inProgress, skill.id]),
    };
    return computeSkillStatus(depId, state, depCtx) === 'mastered';
  });
}

/** Все задачи, привязанные к навыку. */
function tasksOf(skillId: string, state: AppState) {
  return Object.values(state.tasks).filter((t) => t.skillId === skillId);
}

function hasStarted(skill: Skill, state: AppState, ctx: ComputeContext): boolean {
  const tasks = tasksOf(skill.id, state);
  if (tasks.some((t) => t.status !== 'todo')) return true;

  return skill.childrenIds.some((childId) => {
    const childCtx: ComputeContext = {
      inProgress: new Set([...ctx.inProgress, skill.id]),
    };
    const childStatus = computeSkillStatus(childId, state, childCtx);
    return childStatus === 'in-progress' || childStatus === 'mastered';
  });
}