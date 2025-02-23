import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { PdfgeneratorService } from 'src/app/services/pdfGeneratorService/pdfgenerator.service';

@Component({
  selector: 'app-certificado-modal',
  templateUrl: './certificado-modal.component.html',
  styleUrls: ['./certificado-modal.component.css']
})
export class CertificadoModalComponent {
  rutControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{7,8}-[kK\d]$/)]);
  isLoading = false; // Controla el estado del spinner

  constructor(
    public dialogRef: MatDialogRef<CertificadoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { certificado: string },
    private estudianteService: EstudianteService,
    private pdfService: PdfgeneratorService
  ) { }

  close() {
    if (!this.isLoading) {
      this.dialogRef.close();
    }
  }

  generatePDF() {
    if (this.rutControl.valid) {
      this.isLoading = true;
      const rut = this.rutControl.value?.split('-')[0];

      this.estudianteService.getInfoEstudiante(rut).subscribe({
        next: (data: any) => {
          console.log("Datos del estudiante obtenidos:", data);

          // Construcción del objeto `certificado`
          const certificado = {
            numero_matricula: data.id,
            primer_nombre_alumno: data.primer_nombre_alumno,
            segundo_nombre_alumno: data.segundo_nombre_alumno,
            primer_apellido_alumno: data.primer_apellido_alumno,
            segundo_apellido_alumno: data.segundo_apellido_alumno,
            rut: data.rut,
            dv: data.dv,
            curso: String(data.curso[0].id),
            tipo_certificado: this.data.certificado,
            isErp: true,
            rutApoderado: "12345678"
          };

          console.log(certificado);
          
          // Llamada al servicio para generar el PDF
          this.pdfService.getPdfCertificado(certificado).subscribe({
            next: (blob) => {
              console.log("PDF generado con éxito");

              // Crear un objeto URL para el blob recibido
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `certificado_${certificado.rut}-${certificado.dv}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              setTimeout(() => window.open(url, '_blank'), 100);

              this.isLoading = false;
              this.dialogRef.close();
            },
            error: (error) => {
              console.error('Error al generar el PDF:', error);
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener la información del estudiante:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
