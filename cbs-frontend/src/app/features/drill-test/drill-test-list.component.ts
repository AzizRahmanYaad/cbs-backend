import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DrillTest } from '../../core/models/drill-test.model';

@Component({
  selector: 'app-drill-test-list',
  imports: [CommonModule],
  templateUrl: './drill-test-list.component.html',
  styleUrls: ['./drill-test-list.component.scss']
})
export class DrillTestListComponent implements OnInit {
  drillTests = signal<DrillTest[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDrillTests();
  }

  loadDrillTests(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<DrillTest[]>(`${environment.apiUrl}/drill-tests`).subscribe({
      next: (data) => {
        this.drillTests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load drill tests');
        this.loading.set(false);
        console.error('Error loading drill tests:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'DRAFT': 'status-draft',
      'PUBLISHED': 'status-published',
      'ACTIVE': 'status-active',
      'COMPLETED': 'status-completed',
      'ARCHIVED': 'status-archived'
    };
    return statusMap[status] || '';
  }
}
