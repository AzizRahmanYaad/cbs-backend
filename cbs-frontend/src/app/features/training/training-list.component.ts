import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Training } from '../../core/models/training.model';

@Component({
  selector: 'app-training-list',
  imports: [CommonModule],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  trainings = signal<Training[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Training[]>(`${environment.apiUrl}/training`).subscribe({
      next: (data) => {
        this.trainings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load trainings');
        this.loading.set(false);
        console.error('Error loading trainings:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'SCHEDULED': 'status-scheduled',
      'IN_PROGRESS': 'status-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }
}
