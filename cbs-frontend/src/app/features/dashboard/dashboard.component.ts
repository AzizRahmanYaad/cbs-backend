import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  navItems: NavItem[] = [
    { label: 'Home', icon: '🏠', route: '/dashboard/home' },
    { label: 'Training', icon: '📚', route: '/dashboard/training' },
    { label: 'Daily Reports', icon: '📝', route: '/dashboard/reports' },
    { label: 'Tasks', icon: '✓', route: '/dashboard/tasks' },
    { label: 'Drill Tests', icon: '🎯', route: '/dashboard/drill-tests' }
  ];

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
