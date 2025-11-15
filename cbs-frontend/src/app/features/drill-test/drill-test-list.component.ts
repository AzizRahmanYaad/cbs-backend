import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrillTest } from '../../core/models/drill-test.model';
import { DrillTestService } from '../../core/services/drill-test.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-drill-test-list',
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './drill-test-list.component.html',
  styleUrls: ['./drill-test-list.component.scss']
})
export class DrillTestListComponent implements OnInit {
  drillTests = signal<DrillTest[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  isEditing = signal(false);
  selectedTest: DrillTest | null = null;
  deleteId: number | null = null;

  formData: Partial<DrillTest> = this.getEmptyForm();

  constructor(private drillTestService: DrillTestService) {}

  ngOnInit(): void {
    this.loadDrillTests();
  }

  loadDrillTests(): void {
    this.loading.set(true);
    this.drillTestService.getAll().subscribe({
      next: (data) => {
        this.drillTests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load drill tests');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  openEditModal(test: DrillTest): void {
    this.isEditing.set(true);
    this.selectedTest = test;
    this.formData = { ...test };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedTest = null;
  }

  saveTest(): void {
    if (this.isEditing() && this.selectedTest) {
      this.drillTestService.update(this.selectedTest.id, this.formData).subscribe({
        next: () => {
          this.loadDrillTests();
          this.closeModal();
        },
        error: (err) => this.error.set('Failed to update test')
      });
    } else {
      this.drillTestService.create(this.formData).subscribe({
        next: () => {
          this.loadDrillTests();
          this.closeModal();
        },
        error: (err) => this.error.set('Failed to create test')
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirm.set(true);
  }

  deleteTest(): void {
    if (this.deleteId) {
      this.drillTestService.delete(this.deleteId).subscribe({
        next: () => {
          this.loadDrillTests();
          this.showDeleteConfirm.set(false);
        },
        error: (err) => this.error.set('Failed to delete test')
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteId = null;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  private getEmptyForm(): Partial<DrillTest> {
    return {
      title: '',
      description: '',
      testDate: '',
      duration: 60,
      passingScore: 70,
      maxAttempts: 3,
      status: 'DRAFT'
    };
  }
}
