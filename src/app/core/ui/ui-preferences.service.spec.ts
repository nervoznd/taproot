import { TestBed } from '@angular/core/testing';
import { UiPreferencesService } from './ui-preferences.service';

describe('UiPreferencesService', () => {
  let service: UiPreferencesService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiPreferencesService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('тема', () => {
    it('по умолчанию light', () => {
      expect(service.theme()).toBe('light');
      expect(service.isDark()).toBe(false);
    });

    it('setTheme меняет тему и DOM-атрибут', () => {
      service.setTheme('dark');
      TestBed.tick();
      expect(service.theme()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('toggleTheme переключает туда-обратно', () => {
      service.toggleTheme();
      TestBed.tick();
      expect(service.theme()).toBe('dark');
      service.toggleTheme();
      TestBed.tick();
      expect(service.theme()).toBe('light');
    });

    it('сохраняет тему в localStorage', () => {
      service.setTheme('dark');
      TestBed.tick();
      expect(localStorage.getItem('taproot:ui:theme')).toBe('dark');
    });
  });

  describe('режим дерева', () => {
    it('по умолчанию list', () => {
      expect(service.treeMode()).toBe('list');
    });

    it('setTreeMode меняет режим', () => {
      service.setTreeMode('graph');
      expect(service.treeMode()).toBe('graph');
    });

    it('сохраняет режим в localStorage', () => {
      service.setTreeMode('rpg');
      TestBed.tick();
      expect(localStorage.getItem('taproot:ui:treeMode')).toBe('rpg');
    });

    it('игнорирует невалидное значение из localStorage', () => {
      localStorage.setItem('taproot:ui:treeMode', 'невалидный');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(UiPreferencesService);
      expect(fresh.treeMode()).toBe('list');
    });
  });

  describe('загрузка из localStorage при старте', () => {
    it('читает сохранённую тему', () => {
      localStorage.setItem('taproot:ui:theme', 'dark');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(UiPreferencesService);
      expect(fresh.theme()).toBe('dark');
    });

    it('читает сохранённый режим дерева', () => {
      localStorage.setItem('taproot:ui:treeMode', 'graph');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(UiPreferencesService);
      expect(fresh.treeMode()).toBe('graph');
    });
  });
});