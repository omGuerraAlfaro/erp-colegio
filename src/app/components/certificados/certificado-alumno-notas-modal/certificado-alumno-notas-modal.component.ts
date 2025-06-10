import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { PdfgeneratorService } from 'src/app/services/pdfGeneratorService/pdfgenerator.service';
import Swal from 'sweetalert2';
import { CursosService } from 'src/app/services/cursoService/cursos.service';

@Component({
  selector: 'app-certificado-alumno-notas-modal',
  templateUrl: './certificado-alumno-notas-modal.component.html',
  styleUrls: ['./certificado-alumno-notas-modal.component.css']
})
export class CertificadoAlumnoNotasModalComponent {
  cursos: any[] = [];
  estudiantes: any[] = [];
  cursoSeleccionado: any = null;
  estudianteSeleccionado: any = null;
  semestreSeleccionado: number | null = null;

  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CertificadoAlumnoNotasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { certificado: string },
    private cursosService: CursosService,
    private pdfService: PdfgeneratorService
  ) {
    this.loadCursos();
  }

  loadCursos() {
    this.cursosService.getInfoCursoConEstudiantes().subscribe({
      next: (response) => this.cursos = response,
      error: (err) => console.error('Error cargando cursos:', err)
    });
  }

  onCursoChange() {
    this.estudiantes = this.cursoSeleccionado?.estudiantes || [];
    this.estudianteSeleccionado = null;
  }

  close() {
    if (!this.isLoading) {
      this.dialogRef.close();
    }
  }

  generatePDF() {
    if (this.estudianteSeleccionado && this.semestreSeleccionado) {
      this.isLoading = true;
      const est = this.estudianteSeleccionado;

      const data =
      {
        "estudianteId": est.id,
        "semestreId": this.semestreSeleccionado,
        "cursoId": this.cursoSeleccionado.id
      }

      this.pdfService.getPdfCertificadoAlumnoNotas(data).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificado_notas_${est.rut}-${est.dv}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => window.open(url, '_blank'), 100);
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          this.isLoading = false;
          const msg =
            typeof err?.message === 'string'
              ? err.message
              : err?.message?.message || 'Error al generar PDF.';
          Swal.fire('Advertencia', msg, 'warning');
        },
        complete: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'PDF generado con éxito',
            text: `Certificado de notas para ${est.primer_nombre_alumno} ${est.primer_apellido_alumno} ha sido generado.`,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido'
          });
        }
      });
    }
  }
}

