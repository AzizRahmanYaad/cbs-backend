import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks-list',
  imports: [CommonModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Task[]>(`${environment.apiUrl}/tasks`).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load tasks');
        this.loading.set(false);
        console.error('Error loading tasks:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'TODO': 'status-todo',
      'IN_PROGRESS': 'status-progress',
      'REVIEW': 'status-review',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: string): string {
    const priorityMap: Record<string, string> = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high',
      'CRITICAL': 'priority-critical'
    };
    return priorityMap[priority] || '';
  }
}
