import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tree/:skillId',
    loadComponent: () =>
      import('./features/skill-detail/skill-detail-page.component')
        .then((m) => m.SkillDetailPageComponent),
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('./features/tree/tree-page/tree-page.component')
        .then((m) => m.TreePageComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tree' },
  { path: '**', redirectTo: 'tree' },
];