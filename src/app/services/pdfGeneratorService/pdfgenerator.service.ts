import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {

  // Para POST con JSON que retorna Blob (PDF)
  private postHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'blob' as 'json'
  };

  // Para GET que retorna ZIP u otros archivos
  private blobHttpOptions = {
    responseType: 'blob' as 'json'
  };

  constructor(private http: HttpClient) { }

  // ------------------ POST: Certificados individuales (PDF) ------------------

  getPdfContrato(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate`, data, this.postHttpOptions)
      .pipe(catchError(this.handleError));
  }

  getPdfCertificadoAlumnoRegular(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-regular`, data, this.postHttpOptions)
      .pipe(catchError(this.handleError));
  }

  getPdfCertificadoAlumnoNotasParcial(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-notas-parcial`, data, this.postHttpOptions)
      .pipe(catchError(this.handleError2));
  }

  getPdfCertificadoAlumnoNotasFinal(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-notas-final`, data, this.postHttpOptions)
      .pipe(catchError(this.handleError2));
  }

  // ------------------ GET: Certificados por curso ------------------

  getPdfCertificadoNotasCursoFinal(cursoId: number, semestreId: number): Observable<Blob> {
    return this.http.post<Blob>(
      `${environment.api}/pdf/generate/curso-notas-final?cursoId=${cursoId}&semestreId=${semestreId}`,
      null, // 👈 body vacío
      this.postHttpOptions // 👈 ahora es el tercer parámetro
    ).pipe(catchError(this.handleError2));
  }

  getPdfCertificadoNotasCursoParcial(cursoId: number, semestreId: number): Observable<Blob> {
    return this.http.post<Blob>(
      `${environment.api}/pdf/generate/curso-notas-parcial?cursoId=${cursoId}&semestreId=${semestreId}`,
      null, // 👈 body vacío
      this.postHttpOptions // 👈 headers y responseType
    ).pipe(catchError(this.handleError2));
  }


  // ------------------ Errores ------------------

  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handleError2(error: HttpErrorResponse): Observable<never> {
    // Si el error viene como Blob (por responseType: 'blob') y tiene tipo JSON
    if (error.error instanceof Blob && error.error.type === 'application/json') {
      return new Observable((observer) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorText = JSON.parse(reader.result as string);
            observer.error(errorText);  // Devuelve el JSON interpretado
          } catch (e) {
            observer.error({ message: 'Error desconocido al parsear JSON de error.' });
          }
        };
        reader.onerror = () => {
          observer.error({ message: 'Error al leer respuesta del servidor.' });
        };
        reader.readAsText(error.error);
      });
    }

    // Error genérico o no JSON
    return throwError(() => error);
  }
}
