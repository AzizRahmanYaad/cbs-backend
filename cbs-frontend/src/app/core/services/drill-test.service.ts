import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DrillTest } from '../models/drill-test.model';

@Injectable({
  providedIn: 'root'
})
export class DrillTestService {
  private apiUrl = `${environment.apiUrl}/drill-tests`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DrillTest[]> {
    return this.http.get<DrillTest[]>(this.apiUrl);
  }

  getById(id: number): Observable<DrillTest> {
    return this.http.get<DrillTest>(`${this.apiUrl}/${id}`);
  }

  create(drillTest: Partial<DrillTest>): Observable<DrillTest> {
    return this.http.post<DrillTest>(this.apiUrl, drillTest);
  }

  update(id: number, drillTest: Partial<DrillTest>): Observable<DrillTest> {
    return this.http.put<DrillTest>(`${this.apiUrl}/${id}`, drillTest);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
