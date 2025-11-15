import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-tasks-list',
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  isEditing = signal(false);
  selectedTask: Task | null = null;
  deleteId: number | null = null;

  formData: Partial<Task> = this.getEmptyForm();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load tasks');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  openEditModal(task: Task): void {
    this.isEditing.set(true);
    this.selectedTask = task;
    this.formData = { ...task };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedTask = null;
  }

  saveTask(): void {
    if (this.isEditing() && this.selectedTask) {
      this.taskService.update(this.selectedTask.id, this.formData).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => this.error.set('Failed to update task')
      });
    } else {
      this.taskService.create(this.formData).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => this.error.set('Failed to create task')
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirm.set(true);
  }

  deleteTask(): void {
    if (this.deleteId) {
      this.taskService.delete(this.deleteId).subscribe({
        next: () => {
          this.loadTasks();
          this.showDeleteConfirm.set(false);
        },
        error: (err) => this.error.set('Failed to delete task')
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteId = null;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  private getEmptyForm(): Partial<Task> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: tomorrow.toISOString().split('T')[0],
      estimatedHours: 8
    };
  }
}
