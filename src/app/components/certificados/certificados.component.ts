import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CertificadoModalComponent } from './certificado-modal/certificado-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit {

  vars = [
    { name: 'Certificado Alumno Regular', template: 'pdf-alumno-regular', link: 'certificado-alumno-regular', icon: 'fas fa-user-check', color: 'bg-green' },
    { name: 'Certificado de Matrícula', template: '', link: 'certificado-matricula', icon: 'fas fa-file-signature', color: 'bg-blue' },
    { name: 'Certificado de Anotaciones', template: '', link: 'certificado-anotaciones', icon: 'fas fa-exclamation-circle', color: 'bg-yellow' },
    { name: 'Certificado de Notas', template: '', link: 'certificado-notas', icon: 'fas fa-file-alt', color: 'bg-purple' },
    { name: 'Certificado de Asistencia', template: '', link: 'certificado-asistencia', icon: 'fas fa-calendar-check', color: 'bg-red' },
    { name: 'Seguro Escolar', template: '', link: 'seguro-escolar', icon: 'fas fa-shield-alt', color: 'bg-darkblue' },
  ];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {}

  openModal(certificadoObj: any) {
    if (!certificadoObj.template) {
      Swal.fire({
        icon: 'info',
        title: 'En desarrollo',
        text: `El certificado "${certificadoObj.name}" aún se encuentra en desarrollo.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const dialogRef = this.dialog.open(CertificadoModalComponent, {
      width: '400px',
      data: { certificado: certificadoObj.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Generando PDF para:', result);
      }
    });
  }
}
