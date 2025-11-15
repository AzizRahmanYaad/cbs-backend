import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { TrainingListComponent } from './features/training/training-list.component';
import { ReportsListComponent } from './features/reports/reports-list.component';
import { TasksListComponent } from './features/tasks/tasks-list.component';
import { DrillTestListComponent } from './features/drill-test/drill-test-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'training', component: TrainingListComponent },
      { path: 'reports', component: ReportsListComponent },
      { path: 'tasks', component: TasksListComponent },
      { path: 'drill-tests', component: DrillTestListComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
