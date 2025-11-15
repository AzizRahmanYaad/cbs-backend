import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Training } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/training`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  create(training: Partial<Training>): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  update(id: number, training: Partial<Training>): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
