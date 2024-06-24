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

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    localStorage.setItem('ingresado', 'false');
  }

  ingresar(): void {
    if (!this.validateModel(this.user)) {
      this.showAlert('Error', 'Falta ingresar ' + this.field, 'error');
      return;
    }

    this.auth.iniciarSesion(this.user.usuario, this.user.password).subscribe({
      next: (loginData: ILoginResponse) => {
        if (loginData && loginData.token) {
          this.userData = loginData.user;
          //console.log(this.userData);
          const { username, correo_electronico, rut, administrador_id, apoderado_id, profesor_id } = this.userData;

          if (apoderado_id != null) {
            this.showAlert('Acceso Denegado', 'No tienes permisos para ingresar.', 'error');
            return;
          }

          if (administrador_id != null || profesor_id != null ) {
            this.saveUserDataToLocalStorage(username, correo_electronico, rut, loginData.token);
            this.navigateToProfile(loginData.user);
          }
        } else {
          this.showAlert('Error', 'El usuario y/o contraseña son inválidos', 'error');
        }
      },
      error: (error) => {
        console.error("Error en el inicio de sesión:", error);
        this.showAlert('Error', 'Error al intentar iniciar sesión. Inténtalo de nuevo.', 'error');
      }
    });
  }

  private navigateToProfile(data: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['/home'], navigationExtras);
    location.reload();
  }

  private saveUserDataToLocalStorage(name_user: string, email_user: string, rut: string, token: string): void {
    localStorage.setItem('ingresado', 'true');
    localStorage.setItem('usuario', name_user);
    localStorage.setItem('email', email_user);
    localStorage.setItem('rutAmbiente', rut);
    localStorage.setItem('token', token);
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
