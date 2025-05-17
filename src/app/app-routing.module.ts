import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }       from './components/home/home.component';
import { LoginComponent }      from './components/login/login.component';
import { CalendarioEscolarComponent } from './components/calendario-escolar/calendario-escolar.component';
import { BoletasComponent }    from './components/boletas/boletas.component';
import { BoletasMantenedorComponent } from './components/boletas-mantenedor/boletas-mantenedor.component';
import { BoletaEdicionComponent }     from './components/boleta-edicion/boleta-edicion.component';
import { FichaAlumnosComponent }      from './components/ficha-alumnos/ficha-alumnos.component';
import { CursosAnotacionesComponent } from './components/cursos-anotaciones/cursos-anotaciones.component';
import { CursosAsistenciaComponent }  from './components/cursos-asistencia/cursos-asistencia.component';
import { CursosNotasComponent }       from './components/cursos-notas/cursos-notas.component';
import { ColaboradoresComponent }     from './components/rrhh/colaboradores/colaboradores.component';
import { RemuneracionesComponent }    from './components/rrhh/remuneraciones/remuneraciones.component';
import { MatriculasComponent }        from './components/matriculas/matriculas.component';
import { InscripcionMatriculaComponent } from './components/inscripcion-matricula/inscripcion-matricula.component';
import { InscripcionTalleresComponent }  from './components/inscripcion-talleres/inscripcion-talleres.component';
import { CertificadosComponent }      from './components/certificados/certificados.component';

import { LoginGuard } from './guard/login.guard';
import { AuthGuard }  from './guard/auth.guard';
import { SidebarComponent } from './components/template/sidebar/sidebar.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  { 
    path: '', 
    component: SidebarComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'home',               component: HomeComponent },
      { path: 'calendario-escolar', component: CalendarioEscolarComponent },
      { path: 'boletas',            component: BoletasComponent },
      { path: 'boletas-edicion',    component: BoletaEdicionComponent },
      { path: 'boletas-mantenedor', component: BoletasMantenedorComponent },
      { path: 'ficha-alumnos',      component: FichaAlumnosComponent },
      { path: 'cursos-anotaciones', component: CursosAnotacionesComponent },
      { path: 'cursos-asistencia',  component: CursosAsistenciaComponent },
      { path: 'cursos-notas',       component: CursosNotasComponent },
      { path: 'colaboradores',      component: ColaboradoresComponent },
      { path: 'remuneraciones',     component: RemuneracionesComponent },
      { path: 'matriculas',         component: MatriculasComponent },
      { path: 'bandeja-inscripciones', component: InscripcionMatriculaComponent },
      { path: 'bandeja-talleres',     component: InscripcionTalleresComponent },
      { path: 'certificados',       component: CertificadosComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }

    ]
  },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
