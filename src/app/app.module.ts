import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { SidebarComponent } from './components/template/sidebar/sidebar.component';
import { ContentComponent } from './components/template/content/content.component';

//formato de fecha
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeEs, 'es');

//components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
//Finanzas
import { BoletasComponent } from './components/boletas/boletas.component';
//rrhh
import { ColaboradoresComponent } from './components/rrhh/colaboradores/colaboradores.component';
import { RemuneracionesComponent } from './components/rrhh/remuneraciones/remuneraciones.component';
import { RutFormatPipe } from './pipes/rut-format.pipe';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CursosAnotacionesComponent } from './components/cursos-anotaciones/cursos-anotaciones.component';
import { ModalDetalleBoletaComponent } from './components/modal-detalle-boleta/modal-detalle-boleta.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalBoletasEstudianteComponent } from './components/modal-boletas-estudiante/modal-boletas-estudiante.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { ModalIngresoAnotacionComponent } from './components/modal-ingreso-anotacion/modal-ingreso-anotacion.component';
import { ModalVerAnotacionComponent } from './components/modal-ver-anotacion/modal-ver-anotacion.component';
import { InscripcionMatriculaComponent } from './components/inscripcion-matricula/inscripcion-matricula.component';
import { ModalTerminarFormularioMatriculaComponent } from './components/modal-terminar-formulario-matricula/modal-terminar-formulario-matricula.component';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { BoletasMantenedorComponent } from './components/boletas-mantenedor/boletas-mantenedor.component';
import { ModalBoletasMantenedorComponent } from './components/modal-boletas-mantenedor/modal-boletas-mantenedor.component';
import { EditBoletaComponent } from './components/modal-boletas-mantenedor/edit-boleta/edit-boleta.component';
import { CreateBoletaComponent } from './components/modal-boletas-mantenedor/create-boleta/create-boleta.component';
import { ModalIngresarMatriculaComponent } from './components/modal-ingresar-matricula/modal-ingresar-matricula.component';
import { CursosAsistenciaComponent } from './components/cursos-asistencia/cursos-asistencia.component';
import { CursosNotasComponent } from './components/cursos-notas/cursos-notas.component';
import { CalendarioEscolarComponent } from './components/calendario-escolar/calendario-escolar.component';
import { ModalCalendarioComponent } from './components/calendario-escolar/modal-calendario/modal-calendario.component';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    ContentComponent,
    RemuneracionesComponent,
    ColaboradoresComponent,
    BoletasComponent,
    RutFormatPipe,
    FormatNumberPipe,
    CursosAnotacionesComponent,
    ModalDetalleBoletaComponent,
    ModalBoletasEstudianteComponent,
    MatriculasComponent,
    ModalIngresoAnotacionComponent,
    ModalVerAnotacionComponent,
    InscripcionMatriculaComponent,
    ModalTerminarFormularioMatriculaComponent,
    BoletasMantenedorComponent,
    ModalBoletasMantenedorComponent,
    EditBoletaComponent,
    CreateBoletaComponent,
    ModalIngresarMatriculaComponent,
    CursosAsistenciaComponent,
    CursosNotasComponent,
    CalendarioEscolarComponent,
    ModalCalendarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatBottomSheetModule,
    MatSlideToggleModule
    

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' },],
  bootstrap: [AppComponent]
})
export class AppModule { }
