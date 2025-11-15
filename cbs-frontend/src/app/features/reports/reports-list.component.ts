import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DailyReport } from '../../core/models/report.model';

@Component({
  selector: 'app-reports-list',
  imports: [CommonModule],
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  reports = signal<DailyReport[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<DailyReport[]>(`${environment.apiUrl}/reports`).subscribe({
      next: (data) => {
        this.reports.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load reports');
        this.loading.set(false);
        console.error('Error loading reports:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'DRAFT': 'status-draft',
      'SUBMITTED': 'status-submitted',
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected'
    };
    return statusMap[status] || '';
  }
}
