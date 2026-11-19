import { computeSkillStatus } from './skill-status';
import { INITIAL_STATE } from '../data/initial-state';
import { AppState } from '../models/app-state.model';

describe('computeSkillStatus', () => {
  let state: AppState;

  beforeEach(() => {
    // Глубокая копия, чтобы тесты не портили друг друга
    state = structuredClone(INITIAL_STATE);
  });

  describe('на мок-данных', () => {
    it('ng-components mastered (2/2 задачи done)', () => {
      expect(computeSkillStatus('ng-components', state)).toBe('mastered');
    });

    it('ng-services in-progress (1/2 done)', () => {
      expect(computeSkillStatus('ng-services', state)).toBe('in-progress');
    });

    it('js-async in-progress (1/2 done)', () => {
      expect(computeSkillStatus('js-async', state)).toBe('in-progress');
    });

    it('ng-signals locked (js-async не mastered)', () => {
      expect(computeSkillStatus('ng-signals', state)).toBe('locked');
    });

    it('angular in-progress (ребёнок не mastered)', () => {
      expect(computeSkillStatus('angular', state)).toBe('in-progress');
    });

    it('js in-progress (ребёнок не mastered)', () => {
      expect(computeSkillStatus('js', state)).toBe('in-progress');
    });
  });

  describe('реакция на завершение задач', () => {
    it('закрытие всех зависимостей разблокирует ng-signals', () => {
      state.tasks['task-js-async-2'].status = 'done';
      state.tasks['task-ng-svc-2'].status = 'done';

      expect(computeSkillStatus('js-async', state)).toBe('mastered');
      expect(computeSkillStatus('ng-services', state)).toBe('mastered');
      expect(computeSkillStatus('ng-signals', state)).toBe('available');
    });

    it('закрытие ng-svc-2 делает ng-services mastered', () => {
      state.tasks['task-ng-svc-2'].status = 'done';
      expect(computeSkillStatus('ng-services', state)).toBe('mastered');
    });

    it('частичное закрытие зависимостей не разблокирует ng-signals', () => {
      state.tasks['task-js-async-2'].status = 'done';
      expect(computeSkillStatus('ng-signals', state)).toBe('locked');
    });
  });

  describe('циклы и краевые случаи', () => {
    it('несуществующий id → locked', () => {
      expect(computeSkillStatus('нет-такого', state)).toBe('locked');
    });

    it('цикл в requirements → locked, без stack overflow', () => {
      state.skills['ng-services'].requires.skillsDone = ['js-async'];
      state.skills['js-async'].requires.skillsDone = ['ng-services'];

      expect(() => computeSkillStatus('ng-services', state)).not.toThrow();
      expect(computeSkillStatus('ng-services', state)).toBe('locked');
      expect(computeSkillStatus('js-async', state)).toBe('locked');
    });
  });
});