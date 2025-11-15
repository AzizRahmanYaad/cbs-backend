import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  stats = [
    { label: 'Active Trainings', value: '12', icon: '📚', color: '#667eea' },
    { label: 'Pending Reports', value: '8', icon: '📝', color: '#f56565' },
    { label: 'Open Tasks', value: '24', icon: '✓', color: '#48bb78' },
    { label: 'Upcoming Tests', value: '5', icon: '🎯', color: '#ed8936' }
  ];
}
