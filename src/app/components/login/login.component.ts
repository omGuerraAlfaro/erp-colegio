import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ILoginResponse, IUser } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    //para guardar el input vacío
    field!: string;
    //inicio sesion
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
      // this.presentToast('Falta ingresar ' + this.field, 3000);
      return;
    }

    this.auth.iniciarSesion(this.user.usuario, this.user.password).subscribe({
      next: (loginData: ILoginResponse) => {
        if (loginData && loginData.token) {
          this.userData = loginData.user;
          console.log(this.userData);
          const { username, correo_electronico, rut } = this.userData;

          this.saveUserDataToLocalStorage(username, correo_electronico, rut, loginData.token);
          this.navigateToProfile(loginData.user);
        } else {
          // this.presentToast('El usuario y/o contraseña son inválidos', 3000);
        }
        // this.menuCtrl.enable(false);
      },
      error: (error) => {
        console.error("Error en el inicio de sesión:", error);
        // this.presentToast('Error al intentar iniciar sesión. Inténtalo de nuevo.', 3000);
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

  validateModel(model: any) {
    //recorro todas las entradas que me entrega el Object entries y obtengo
    //su clave-valor
    for (const [key, value] of Object.entries(model)) {
      //verifico campo vacío
      if (value === '') {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  // async presentToast(msg: string, duracion?: number) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: duracion ? duracion : 2000,
  //   });
  //   toast.present();
  // }


}