import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('taproot');

  readonly isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem('taproot:theme');
    if (saved === 'dark') {
      this.setTheme(true);
    }
  }

  toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  private setTheme(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('taproot:theme', dark ? 'dark' : 'light');
  }
}
