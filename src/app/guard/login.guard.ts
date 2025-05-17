// login.guard.ts
import { Injectable }     from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      //  
      // Si ya está logueado, devuelvo un UrlTree hacia /home
      return this.router.createUrlTree(['/home']);
    }
    return true;  // si no hay token, permito /login
  }
}
