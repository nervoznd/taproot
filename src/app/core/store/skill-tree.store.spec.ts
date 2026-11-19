import { TestBed } from '@angular/core/testing';
import { SkillTreeStore } from './skill-tree.store';

describe('SkillTreeStore', () => {
  let store: SkillTreeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SkillTreeStore);
  });

  it('загружает начальное состояние', () => {
    expect(store.rootSkills().length).toBe(2);
    expect(store.totalTasks()).toBe(8);
    expect(store.doneTasks()).toBe(4);
  });

  it('overallProgress считает долю выполненных задач', () => {
    expect(store.overallProgress()).toBeCloseTo(4 / 8);
  });

  it('skillById возвращает нужный узел', () => {
    const skill = store.skillById('ng-signals')();
    expect(skill?.title).toBe('Signals & Reactivity');
  });

  it('tasksBySkill фильтрует и сортирует по приоритету', () => {
    const tasks = store.tasksBySkill('ng-signals')();
    expect(tasks.length).toBe(2);
    expect(tasks[0].priority).toBe('high');
  });

  it('completeTask меняет статус задачи', () => {
    store.completeTask('task-js-async-2');
    const task = store.tasks()['task-js-async-2'];
    expect(task.status).toBe('done');
  });

  it('completeTask идемпотентен', () => {
    store.completeTask('task-ng-comp-1');
    store.completeTask('task-ng-comp-1');
    expect(store.tasks()['task-ng-comp-1'].status).toBe('done');
  });

  it('обновление задачи не мутирует исходный объект (иммутабельность)', () => {
    const before = store.tasks()['task-js-async-2'];
    store.completeTask('task-js-async-2');
    const after = store.tasks()['task-js-async-2'];
    expect(before).not.toBe(after);
    expect(before.status).toBe('todo');
  });

  it('updateTaskStatus игнорирует несуществующую задачу', () => {
    expect(() => store.completeTask('нет-такой-задачи')).not.toThrow();
  });
});