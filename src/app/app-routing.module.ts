import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/template/content/content.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

//Finanzas
import { BoletasComponent } from './components/boletas/boletas.component';

//Cursos
import { CursosComponent } from './components/cursos/cursos.component';

//recursos humanos
import { ColaboradoresComponent } from './components/rrhh/colaboradores/colaboradores.component';
import { RemuneracionesComponent } from './components/rrhh/remuneraciones/remuneraciones.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { InscripcionMatriculaComponent } from './components/inscripcion-matricula/inscripcion-matricula.component';
import { BoletasMantenedorComponent } from './components/boletas-mantenedor/boletas-mantenedor.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, },
  { path: 'content', component: ContentComponent },
  { path: 'home', component: HomeComponent, /* canActivate: [AuthGuard] */ },

  { path: 'boletas', component: BoletasComponent },
  { path: 'boletas-mantenedor', component: BoletasMantenedorComponent },
  { path: 'cursos', component: CursosComponent },

  { path: 'colaboradores', component: ColaboradoresComponent},
  { path: 'remuneraciones', component: RemuneracionesComponent},

  { path: 'matriculas', component: MatriculasComponent},
  { path: 'bandeja-inscripciones', component: InscripcionMatriculaComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }