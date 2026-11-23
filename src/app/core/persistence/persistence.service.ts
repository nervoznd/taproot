import { Injectable } from '@angular/core';
import { AppState } from '../models/app-state.model';

/**
 * Обёртка над localStorage.
 */
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  /**
   * Версия схемы.
   */
  private readonly STORAGE_KEY = 'taproot:v1:state';

  /**
   * Загрузить состояние. Возвращает null, если:
   *  - данных нет
   *  - JSON битый
   *  - версия не совпадает
   */
  load(): AppState | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AppState;
    } catch {
      return null;
    }
  }

  save(state: AppState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage переполнен или недоступен — не роняем приложение
    }
  }

  /** Очистить сохранённое (для кнопки "сбросить"). */
  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}