import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MountPipe } from './pipes/mount.pipe';

import { SidebarComponent } from './components/template/sidebar/sidebar.component';
import { Sidebar2Component } from './components/template/sidebar2/sidebar2.component';
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
import { FlujoEfectivoComponent } from './components/finance/boletas/flujo-efectivo.component';
//rrhh
import { ColaboradoresComponent } from './components/rrhh/colaboradores/colaboradores.component';
import { RemuneracionesComponent } from './components/rrhh/remuneraciones/remuneraciones.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    ContentComponent,
    FlujoEfectivoComponent,
    Sidebar2Component,
    RemuneracionesComponent,
    ColaboradoresComponent,
    MountPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' },],
  bootstrap: [AppComponent]
})
export class AppModule { }
