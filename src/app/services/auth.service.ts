// src/app/services/auth.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, Subject, Subscription, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ILoginResponse } from '../interfaces/login.interface';

interface TokenPayload {
  exp: number;  // expiración en segundos desde epoch
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer?: Subscription;
  userLoggedIn = new Subject<boolean>();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Llama al endpoint de login y devuelve el token + datos de usuario.
   */
  iniciarSesion(username: string, password: string): Observable<ILoginResponse> {
    const body = { username, password };
    return this.http
      .post<ILoginResponse>(`${environment.api}/auth/login`, body, this.httpOptions)
      .pipe(
        catchError(err => {
          console.error('Error en AuthService.iniciarSesion:', err);
          return throwError(err);
        })
      );
  }

  /**
   * Realiza el logout: limpia localStorage, cancela timers y redirige a login.
   */
  logout(): void {
    // 1. limpiar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('rutAmbiente');
    localStorage.removeItem('ingresado');
    localStorage.removeItem('rol');
    localStorage.removeItem('genero');
    localStorage.removeItem('loginTimestamp');

    // 2. cancelar timer de auto-logout si existe
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
    }

    // 3. notificar y redirigir
    this.userLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Programa un auto-logout.
   * - Si recibe un número, lo interpreta como milisegundos hasta expirar.
   * - Si recibe el JWT, decodifica su claim `exp` y calcula el tiempo restante.
   */
  autoLogout(tokenOrDuration: string | number): void {
    console.log("[AuthService] autoLogout llamado");
    console.log(`[AuthService] tokenOrDuration: ${tokenOrDuration}`);
    
    
    let expiresInMs: number;
    if (typeof tokenOrDuration === 'string') {
      const decoded = (jwt_decode as any)(tokenOrDuration) as TokenPayload;
      expiresInMs = decoded.exp * 1000 - Date.now();
    } else {
      expiresInMs = tokenOrDuration;
    }

    console.log(`[AuthService] programando autoLogout en ${Math.round(expiresInMs/1000)} segundos`);

    if (expiresInMs <= 0) {
      this.logout();
      return;
    }
    this.tokenExpirationTimer = timer(expiresInMs).subscribe(() => {
      console.log('[AuthService] autoLogout disparado');
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Por seguridad, tu sesión ha expirado.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => this.logout());
    });
  }
}
