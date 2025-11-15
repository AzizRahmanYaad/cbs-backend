import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailyReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DailyReport[]> {
    return this.http.get<DailyReport[]>(this.apiUrl);
  }

  getById(id: number): Observable<DailyReport> {
    return this.http.get<DailyReport>(`${this.apiUrl}/${id}`);
  }

  create(report: Partial<DailyReport>): Observable<DailyReport> {
    return this.http.post<DailyReport>(this.apiUrl, report);
  }

  update(id: number, report: Partial<DailyReport>): Observable<DailyReport> {
    return this.http.put<DailyReport>(`${this.apiUrl}/${id}`, report);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
