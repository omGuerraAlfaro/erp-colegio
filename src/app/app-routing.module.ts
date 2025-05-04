import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/template/content/content.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

//Finanzas
import { BoletasComponent } from './components/boletas/boletas.component';

//Cursos
import { CursosAnotacionesComponent } from './components/cursos-anotaciones/cursos-anotaciones.component';

//recursos humanos
import { ColaboradoresComponent } from './components/rrhh/colaboradores/colaboradores.component';
import { RemuneracionesComponent } from './components/rrhh/remuneraciones/remuneraciones.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { InscripcionMatriculaComponent } from './components/inscripcion-matricula/inscripcion-matricula.component';
import { BoletasMantenedorComponent } from './components/boletas-mantenedor/boletas-mantenedor.component';
import { CursosAsistenciaComponent } from './components/cursos-asistencia/cursos-asistencia.component';
import { CursosNotasComponent } from './components/cursos-notas/cursos-notas.component';
import { CalendarioEscolarComponent } from './components/calendario-escolar/calendario-escolar.component';
import { CertificadosComponent } from './components/certificados/certificados.component';
import { FichaAlumnosComponent } from './components/ficha-alumnos/ficha-alumnos.component';
import { InscripcionTalleresComponent } from './components/inscripcion-talleres/inscripcion-talleres.component';
import { BoletaEdicionComponent } from './components/boleta-edicion/boleta-edicion.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, },
  { path: 'content', component: ContentComponent },
  { path: 'home', component: HomeComponent, /* canActivate: [AuthGuard] */ },

  { path: 'calendario-escolar', component: CalendarioEscolarComponent },

  { path: 'boletas', component: BoletasComponent },
  { path: 'boletas-edicion', component: BoletaEdicionComponent },
  { path: 'boletas-mantenedor', component: BoletasMantenedorComponent },

  { path: 'ficha-alumnos', component: FichaAlumnosComponent },
  { path: 'cursos-anotaciones', component: CursosAnotacionesComponent },
  { path: 'cursos-asistencia', component: CursosAsistenciaComponent },
  { path: 'cursos-notas', component: CursosNotasComponent },

  { path: 'colaboradores', component: ColaboradoresComponent},
  { path: 'remuneraciones', component: RemuneracionesComponent},

  { path: 'matriculas', component: MatriculasComponent},
  { path: 'certificados', component: CertificadosComponent},
  { path: 'bandeja-inscripciones', component: InscripcionMatriculaComponent},
  { path: 'bandeja-talleres', component: InscripcionTalleresComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }