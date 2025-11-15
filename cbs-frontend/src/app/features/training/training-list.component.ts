import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Training } from '../../core/models/training.model';
import { TrainingService } from '../../core/services/training.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-training-list',
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  trainings = signal<Training[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  isEditing = signal(false);
  selectedTraining: Training | null = null;
  deleteId: number | null = null;

  formData: Partial<Training> = this.getEmptyForm();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.trainingService.getAll().subscribe({
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

  openCreateModal(): void {
    this.isEditing.set(false);
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  openEditModal(training: Training): void {
    this.isEditing.set(true);
    this.selectedTraining = training;
    this.formData = { ...training };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedTraining = null;
    this.formData = this.getEmptyForm();
  }

  saveTraining(): void {
    if (this.isEditing() && this.selectedTraining) {
      this.trainingService.update(this.selectedTraining.id, this.formData).subscribe({
        next: () => {
          this.loadTrainings();
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Failed to update training');
          console.error('Error updating training:', err);
        }
      });
    } else {
      this.trainingService.create(this.formData).subscribe({
        next: () => {
          this.loadTrainings();
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Failed to create training');
          console.error('Error creating training:', err);
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirm.set(true);
  }

  deleteTraining(): void {
    if (this.deleteId) {
      this.trainingService.delete(this.deleteId).subscribe({
        next: () => {
          this.loadTrainings();
          this.showDeleteConfirm.set(false);
          this.deleteId = null;
        },
        error: (err) => {
          this.error.set('Failed to delete training');
          console.error('Error deleting training:', err);
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
      'SCHEDULED': 'status-scheduled',
      'IN_PROGRESS': 'status-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  private getEmptyForm(): Partial<Training> {
    return {
      title: '',
      description: '',
      instructor: '',
      startDate: '',
      endDate: '',
      capacity: 0,
      status: 'SCHEDULED'
    };
  }
}
