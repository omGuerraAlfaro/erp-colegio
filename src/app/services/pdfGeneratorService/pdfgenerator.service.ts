import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'blob' as 'json'
  };

  constructor(private http: HttpClient) { }

  getPdfContrato(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPdfCertificado(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-regular`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
