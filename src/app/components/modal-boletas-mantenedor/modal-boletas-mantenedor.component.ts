import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import Swal from 'sweetalert2';
import { EditBoletaComponent } from './edit-boleta/edit-boleta.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateBoletaComponent } from './create-boleta/create-boleta.component';
import { PdfgeneratorService } from 'src/app/services/pdfGeneratorService/pdfgenerator.service';

@Component({
  selector: 'app-modal-boletas-mantenedor',
  templateUrl: './modal-boletas-mantenedor.component.html',
  styleUrls: ['./modal-boletas-mantenedor.component.css']
})
export class ModalBoletasMantenedorComponent implements OnInit {
  displayedColumns: string[] = ['id', 'detalle', 'total', 'fecha_vencimiento', 'estado_boleta', 'acciones'];
  dataSource: { [key: number]: MatTableDataSource<BoletaDetalle> } = {}; // Updated to store grouped data

  // Variable global para almacenar datos del apoderado
  apoderado: any;

  constructor(
    private boletaService: BoletasService,
    private apoderadoService: InfoApoderadoService,
    private pdfService: PdfgeneratorService,
    private dialogRef: MatDialogRef<ModalBoletasMantenedorComponent>,
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.boletaService.getBoletasByRutApoderado(this.data).subscribe({
      next: (boletas: BoletaDetalle[]) => {
        console.log(boletas);
        this.groupBoletasByEstudiante(boletas); // Grouping boletas
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });

    this.apoderadoService.getInfoApoderado(this.data).subscribe({
      next: (apoderado: any) => {
        this.apoderado = apoderado; // Guardar datos del apoderado
        console.log(apoderado);
      },
      error: (error) => {
        console.error('Error fetching apoderado:', error);
      }
    });
  }

  groupBoletasByEstudiante(boletas: BoletaDetalle[]) {
    this.dataSource = boletas.reduce((acc, boleta) => {
      if (!acc[boleta.estudiante_id]) {
        acc[boleta.estudiante_id] = new MatTableDataSource();
      }
      if (!acc[boleta.estudiante_id].data) {
        acc[boleta.estudiante_id].data = [];
      }
      acc[boleta.estudiante_id].data.push(boleta);
      return acc;
    }, {} as { [key: number]: MatTableDataSource<BoletaDetalle> });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  editarBoleta(element: any) {
    const bottomSheetRef = this.bottomSheet.open(EditBoletaComponent, {
      data: element // Pasa el elemento a editar
    });

    bottomSheetRef.afterDismissed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }

  crearBoletas() {
    const bottomSheetRef = this.bottomSheet.open(CreateBoletaComponent, {
      data: this.apoderado
    });

    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  editarBoleta2(element: any): void {
    // Cambia el estado de la boleta
    const nuevoEstado = !element.estado_boleta;

    const boletaActualizada = {
      ...element,
      estado_boleta: nuevoEstado
    };

    this.boletaService.editarBoletaAll(boletaActualizada.id, boletaActualizada).subscribe({
      next: (response) => {
        console.log('Estado de Boleta modificada con éxito:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'El estado de la boleta ha sido modificado correctamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al editar la boleta:', error);

        Swal.fire({
          title: 'Error',
          text: 'No se pudo editar la boleta. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  
  async generarContrato() {
    const datosMatriculaPrueba = {
      estudiantes: [
        {
          primer_nombre_alumno: "Alfredo",
          segundo_nombre_alumno: "Isabel",
          primer_apellido_alumno: "Fernández",
          segundo_apellido_alumno: "González",
          rut: "98765432",
          dv: "K",
          genero_alumno: "Femenino",
          fecha_nacimiento_alumno: "2011-04-10",
          cursoId: "2",
          vive_con: "Madre",
          edad_marzo: "8",
          nacionalidad_alumno: "Chilena",
          enfermedad_cronica_alumno: "Ninguna",
          alergia_alimento_alumno: "Ninguna",
          alergia_medicamento_alumno: "Ninguna",
          prevision_alumno: "Isapre",
          consultorio_clinica_alumno: "Clínica Santa María",
          es_pae: false,
          eximir_religion: false,
          autorizacion_fotografias: true,
          apto_educacion_fisica: true,
          observaciones_alumno: "Excelente desempeño en clase."
        }
      ],
      primer_nombre_apoderado: "José",
      segundo_nombre_apoderado: "Luis",
      primer_apellido_apoderado: "Martínez",
      segundo_apellido_apoderado: "Pérez",
      rut: "12345678",
      dv: "5",
      telefono_apoderado: "987654321",
      correo_apoderado: "jose.martinez@example.com",
      parentesco_apoderado: "Padre",
      estado_civil: "Divorciado",
      profesion_oficio: "Abogado",
      direccion: "Avenida Siempre Viva 742",
      comuna: "Santiago",
      primer_nombre_apoderado_suplente: "Ana",
      segundo_nombre_apoderado_suplente: "Beatriz",
      primer_apellido_apoderado_suplente: "López",
      segundo_apellido_apoderado_suplente: "González",
      rut_apoderado_suplente: "87654321",
      dv_apoderado_suplente: "9",
      telefono_apoderado_suplente: "912345678",
      correo_apoderado_suplente: "ana.lopez@example.com",
      parentesco_apoderado_suplente: "Madre",
      estado_civil_suplente: "Casada",
      profesion_oficio_suplente: "Enfermera",
      direccion_suplente: "Calle Falsa 123",
      comuna_suplente: "Santiago",
      valor_matricula: 50000,
      valor_mensualidad: "225.000"
    };
    console.log("aaaaaaaa");
  
    try {
      // Suscribirse al observable para obtener el Blob
      this.pdfService.getPdfContrato(datosMatriculaPrueba).subscribe({
        next: (blob) => {
          // Crear una URL para el blob
          const url = window.URL.createObjectURL(blob);
          
          // Abrir el PDF en una nueva pestaña
          window.open(url);
  
          // O, si prefieres, puedes crear un enlace de descarga
          const link = document.createElement('a');
          link.href = url;
          link.download = 'contrato.pdf'; // nombre del archivo
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          // Liberar la URL del blob
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error al generar el PDF', error);
        }
      });
    } catch (error) {
      console.error('Error al generar el PDF', error);
    }
  }
  
  
}
