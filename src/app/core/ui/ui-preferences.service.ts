import { Injectable, computed, effect, signal } from '@angular/core';

/**
 * Режим отображения дерева навыков.
 */
export type TreeMode = 'list' | 'graph' | 'rpg';

/**
 * Тема оформления.
 */
export type Theme = 'light' | 'dark';

/**
 * UI-предпочтения пользователя.
 */
@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  // ── Приватные ключи localStorage ─────────────────────
  private readonly THEME_KEY = 'taproot:ui:theme';
  private readonly TREE_MODE_KEY = 'taproot:ui:treeMode';

  // ── Приватные сигналы ────────────────────────────────
  private readonly _theme = signal<Theme>(this.loadTheme());
  private readonly _treeMode = signal<TreeMode>(this.loadTreeMode());

  // ── Публичные readonly ───────────────────────────────
  readonly theme = this._theme.asReadonly();
  readonly treeMode = this._treeMode.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    // Синхронизация темы с DOM и localStorage.
    effect(() => {
      const theme = this._theme();
      document.documentElement.setAttribute('data-theme', theme);
      this.safeSet(this.THEME_KEY, theme);
    });

    // Персист режима дерева.
    effect(() => {
      this.safeSet(this.TREE_MODE_KEY, this._treeMode());
    });
  }

  // ── Мутации ──────────────────────────────────────────

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  toggleTheme(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setTreeMode(mode: TreeMode): void {
    this._treeMode.set(mode);
  }

  // ── Загрузка из localStorage ─────────────────────────

  private loadTheme(): Theme {
    const stored = this.safeGet(this.THEME_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  }

  private loadTreeMode(): TreeMode {
    const stored = this.safeGet(this.TREE_MODE_KEY);
    return stored === 'list' || stored === 'graph' || stored === 'rpg'
      ? stored
      : 'list';
  }

  // ── Безопасная работа с localStorage ─────────────────

  private safeGet(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSet(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch { }
  }
}