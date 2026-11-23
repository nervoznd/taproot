import { AppState } from '../models/app-state.model';

/**
 * Минимальный набор данных для первого запуска.
 */
export const INITIAL_STATE: AppState = {
  skills: {
    // ── Корень 1: Angular ──────────────────────────────────
    'angular': {
      id: 'angular',
      title: 'Angular',
      description: 'Фреймворк для SPA',
      parentId: null,
      childrenIds: ['ng-fundamentals'],
      requires: { skillsDone: [] },
      completion: { tasksRequired: 0 },
    },
    'ng-fundamentals': {
      id: 'ng-fundamentals',
      title: 'Angular Fundamentals',
      description: 'База: компоненты, DI, роутинг',
      parentId: 'angular',
      childrenIds: ['ng-components', 'ng-services', 'ng-signals'],
      requires: { skillsDone: [] },
      completion: { tasksRequired: 3 },
    },
    'ng-components': {
      id: 'ng-components',
      title: 'Components & Templates',
      description: 'Standalone-компоненты, @Input/@Output',
      parentId: 'ng-fundamentals',
      childrenIds: [],
      requires: { skillsDone: [] },
      completion: { tasksRequired: 2 },
    },
    'ng-services': {
      id: 'ng-services',
      title: 'Services & DI',
      description: 'Injectable, provideIn: root, inject()',
      parentId: 'ng-fundamentals',
      childrenIds: [],
      requires: { skillsDone: ['ng-components'] },
      completion: { tasksRequired: 2 },
    },
    'ng-signals': {
      id: 'ng-signals',
      title: 'Signals & Reactivity',
      description: 'signal, computed, effect',
      parentId: 'ng-fundamentals',
      childrenIds: [],
      // Кросс-веточная зависимость
      requires: { skillsDone: ['ng-components', 'ng-services', 'js-async'] },
      completion: { tasksRequired: 2 },
    },

    // ── Корень 2: JavaScript ──────────────────────────────
    'js': {
      id: 'js',
      title: 'JavaScript',
      description: 'Язык веба',
      parentId: null,
      childrenIds: ['js-async'],
      requires: { skillsDone: [] },
      completion: { tasksRequired: 0 },
    },
    'js-async': {
      id: 'js-async',
      title: 'Async JS',
      description: 'Promises, async/await',
      parentId: 'js',
      childrenIds: [],
      requires: { skillsDone: [] },
      completion: { tasksRequired: 2 },
    },
  },

  tasks: {
    // ── Задачи для ng-components ──
    'task-ng-comp-1': {
      id: 'task-ng-comp-1',
      skillId: 'ng-components',
      title: 'Создать standalone-компонент',
      status: 'done',
      dueDate: null,
      priority: 'medium',
    },
    'task-ng-comp-2': {
      id: 'task-ng-comp-2',
      skillId: 'ng-components',
      title: 'Передать @Input и @Output',
      status: 'done',
      dueDate: null,
      priority: 'medium',
    },

    // ── Задачи для ng-services ──
    'task-ng-svc-1': {
      id: 'task-ng-svc-1',
      skillId: 'ng-services',
      title: 'Инжектить сервис через inject()',
      status: 'done',
      dueDate: null,
      priority: 'medium',
    },
    'task-ng-svc-2': {
      id: 'task-ng-svc-2',
      skillId: 'ng-services',
      title: 'Использовать provideIn: root',
      status: 'todo',
      dueDate: null,
      priority: 'medium',
    },

    // ── Задачи для js-async ──
    'task-js-async-1': {
      id: 'task-js-async-1',
      skillId: 'js-async',
      title: 'Разобрать Promise chain',
      status: 'done',
      dueDate: null,
      priority: 'medium',
    },
    'task-js-async-2': {
      id: 'task-js-async-2',
      skillId: 'js-async',
      title: 'Refactor в async/await',
      status: 'todo',
      dueDate: null,
      priority: 'high',
    },

    // ── Задачи для ng-signals ──
    'task-ng-sig-1': {
      id: 'task-ng-sig-1',
      skillId: 'ng-signals',
      title: 'Написать первый signal()',
      status: 'todo',
      dueDate: null,
      priority: 'high',
    },
    'task-ng-sig-2': {
      id: 'task-ng-sig-2',
      skillId: 'ng-signals',
      title: 'Связать computed с signal',
      status: 'todo',
      dueDate: null,
      priority: 'high',
    },
  },
};