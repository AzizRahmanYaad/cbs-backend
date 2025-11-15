import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyReport } from '../../core/models/report.model';
import { ReportService } from '../../core/services/report.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-reports-list',
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  reports = signal<DailyReport[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  isEditing = signal(false);
  selectedReport: DailyReport | null = null;
  deleteId: number | null = null;

  formData: Partial<DailyReport> = this.getEmptyForm();

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getAll().subscribe({
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

  openCreateModal(): void {
    this.isEditing.set(false);
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  openEditModal(report: DailyReport): void {
    this.isEditing.set(true);
    this.selectedReport = report;
    this.formData = { ...report };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedReport = null;
    this.formData = this.getEmptyForm();
  }

  saveReport(): void {
    if (this.isEditing() && this.selectedReport) {
      this.reportService.update(this.selectedReport.id, this.formData).subscribe({
        next: () => {
          this.loadReports();
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Failed to update report');
          console.error('Error updating report:', err);
        }
      });
    } else {
      this.reportService.create(this.formData).subscribe({
        next: () => {
          this.loadReports();
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Failed to create report');
          console.error('Error creating report:', err);
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirm.set(true);
  }

  deleteReport(): void {
    if (this.deleteId) {
      this.reportService.delete(this.deleteId).subscribe({
        next: () => {
          this.loadReports();
          this.showDeleteConfirm.set(false);
          this.deleteId = null;
        },
        error: (err) => {
          this.error.set('Failed to delete report');
          console.error('Error deleting report:', err);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteId = null;
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

  private getEmptyForm(): Partial<DailyReport> {
    const today = new Date().toISOString().split('T')[0];
    return {
      reportDate: today,
      summary: '',
      hoursWorked: 8,
      tasksCompleted: '',
      challenges: '',
      nextDayPlan: '',
      status: 'DRAFT'
    };
  }
}
