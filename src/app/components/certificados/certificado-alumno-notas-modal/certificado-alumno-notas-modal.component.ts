import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfgeneratorService } from 'src/app/services/pdfGeneratorService/pdfgenerator.service';
import Swal from 'sweetalert2';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { environment } from 'src/environments/environment';

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
  tipoSeleccion: 'alumno' | 'curso' = 'alumno';
  tipoCertificado: 'parcial' | 'final' = 'parcial';

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
    if (!this.cursoSeleccionado || !this.semestreSeleccionado) return;

    this.isLoading = true;

    if (this.tipoSeleccion === 'alumno') {
      if (!this.estudianteSeleccionado) {
        this.isLoading = false;
        return;
      }

      const est = this.estudianteSeleccionado;

      const data = {
        estudianteId: est.id,
        semestreId: this.semestreSeleccionado,
        cursoId: this.cursoSeleccionado.id
      };

      const request$ = this.tipoCertificado === 'parcial'
        ? this.pdfService.getPdfCertificadoAlumnoNotasParcial(data)
        : this.pdfService.getPdfCertificadoAlumnoNotasFinal(data);

      request$.subscribe({
        next: (blob) => {
          if (!(blob instanceof Blob) || blob.size === 0) {
            Swal.fire('Advertencia', 'La respuesta no contiene un archivo válido.', 'warning');
            this.isLoading = false;
            return;
          }

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificado_notas_${est.rut}-${est.dv}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.dialogRef.close();
          this.isLoading = false;

          Swal.fire({
            icon: 'success',
            title: 'PDF generado con éxito',
            text: `Certificado de notas para ${est.primer_nombre_alumno} ${est.primer_apellido_alumno} ha sido generado.`,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido'
          });
        },
        error: async (err) => {
          this.isLoading = false;

          let msg = 'Error al generar PDF.';

          if (err.error instanceof Blob && err.error.type === 'application/json') {
            try {
              const text = await err.error.text();
              const parsed = JSON.parse(text);
              msg = parsed?.message || msg;
            } catch (_) {
              msg = 'No se pudo interpretar el error del servidor.';
            }
          }

          Swal.fire('Advertencia', msg, 'warning');
        }
      });

    } else {
      // Por CURSO: usar redirección directa para evitar errores con zip y XHR
      const cursoId = this.cursoSeleccionado.id;
      const semestreId = this.semestreSeleccionado;
      const tipo = this.tipoCertificado; // 'parcial' o 'final'

      const url = `${environment.api}/pdf/curso-notas-${tipo}/pdf-zip?cursoId=${cursoId}&semestreId=${semestreId}`;
      window.location.href = url;

      this.dialogRef.close();
      this.isLoading = false;

      Swal.fire({
        icon: 'success',
        title: 'Generando ZIP',
        text: `La descarga del certificado del curso ${this.cursoSeleccionado.nombre} comenzará automáticamente.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    }
  }


}

