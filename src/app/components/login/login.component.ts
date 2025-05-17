import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ILoginResponse, IUser } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  field!: string;
  existe: any;

  user = {
    usuario: '',
    password: '',
  };

  userData!: IUser;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    localStorage.setItem('ingresado', 'false');
  }

  ingresar(): void {
    if (!this.validateModel(this.user)) {
      this.showAlert('Error', `Falta ingresar ${this.field}`, 'error');
      return;
    }

    this.auth.iniciarSesion(this.user.usuario, this.user.password)
      .subscribe({
        next: (loginData) => {
          if (!loginData?.token) {
            this.showAlert('Error', 'Usuario o contraseña inválidos', 'error');
            return;
          }

          const u = loginData.user;
          if (u.apoderado_id != null) {
            this.showAlert('Acceso Denegado', 'No tienes permisos para ingresar.', 'error');
            return;
          }

          // determinar rol
          let rol = '';
          if (u.administrador_id) rol = 'administrador';
          if (u.subAdministrador_id) rol = 'subAdministrador';
          if (u.profesor_id) rol = 'profesor';

          const partes = u.username.split('.');
          if (partes[partes.length - 1] === 'utp') {
            rol = 'profesor-utp';
          }

          // guardar en localStorage
          localStorage.setItem('ingresado', 'true');
          localStorage.setItem('usuario', u.username);
          localStorage.setItem('email', u.correo_electronico);
          localStorage.setItem('rutAmbiente', u.rut);
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('rol', rol);
          localStorage.setItem('genero', u.genero);
          localStorage.setItem('loginTimestamp', Date.now().toString());

          const SESSION_MS = 2 * 60 * 60 * 1000;
          const SESSION_HOURS = SESSION_MS / 1000 / 60 / 60;
          this.auth.userLoggedIn.next(true);
          this.auth.autoLogout(SESSION_MS);

          // mostrar SweetAlert informativo
          Swal.fire({
            title: '¡Bienvenido!',
            text: `Por seguridad, tu sesión expirará automáticamente en ${SESSION_HOURS} hora(s).`,
            icon: 'info',
            confirmButtonText: 'Continuar'
          }).then(() => {
            const extras: NavigationExtras = { state: { user: u } };
            this.router.navigate(['/home'], extras);
          });
        },
        error: () => {
          this.showAlert('Error', 'Error al iniciar sesión. Intenta nuevamente.', 'error');
        }
      });
  }

  validateModel(model: any): boolean {
    for (const [key, value] of Object.entries(model)) {
      if (value === '') {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar'
    });
  }
}
