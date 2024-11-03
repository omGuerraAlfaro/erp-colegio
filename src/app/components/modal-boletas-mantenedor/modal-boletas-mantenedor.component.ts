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
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-modal-boletas-mantenedor',
  templateUrl: './modal-boletas-mantenedor.component.html',
  styleUrls: ['./modal-boletas-mantenedor.component.css']
})
export class ModalBoletasMantenedorComponent implements OnInit {
  displayedColumns: string[] = ['id', 'detalle', 'total', 'fecha_vencimiento', 'estado_boleta', 'acciones'];
  dataSource: { [key: number]: MatTableDataSource<BoletaDetalle> } = {}; // Updated to store grouped data
  loading: boolean = false;
  // Variable global para almacenar datos del apoderado
  apoderado: any;
  boletas: any;
  boletasAlumno: BoletaDetalle[] = [];

  constructor(
    private boletaService: BoletasService,
    private apoderadoService: InfoApoderadoService,
    private estudianteService: EstudianteService,
    private cursoService: CursosService,
    private pdfService: PdfgeneratorService,
    private dialogRef: MatDialogRef<ModalBoletasMantenedorComponent>,
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.boletaService.getBoletasByRutApoderado(this.data).subscribe({
      next: (boletas: BoletaDetalle[]) => {
        console.log(boletas);
        this.groupBoletasByEstudiante(boletas);
        this.boletas = boletas;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });

    this.apoderadoService.getInfoApoderado(this.data).subscribe({
      next: (apoderado: any) => {
        this.apoderado = apoderado;
        console.log(apoderado);
      },
      error: (error) => {
        console.error('Error fetching apoderado:', error);
      }
    });
  }

  groupBoletasByEstudiante(boletas: BoletaDetalle[]) {
    // Group the boletas by estudiante_id
    this.dataSource = boletas.reduce((acc, boleta) => {
      if (!acc[boleta.estudiante_id]) {
        acc[boleta.estudiante_id] = new MatTableDataSource();
        acc[boleta.estudiante_id].data = []; // Initialize the data array
      }
      acc[boleta.estudiante_id].data.push(boleta); // Add the current boleta
      return acc;
    }, {} as { [key: number]: MatTableDataSource<BoletaDetalle> });

    // Clear the boletasAlumno array before populating
    this.boletasAlumno = []; // Resetting to ensure fresh data

    // Populate boletasAlumno with the required positions
    Object.values(this.dataSource).forEach((dataSource: MatTableDataSource<BoletaDetalle>) => {
      // Store the second boleta from position 1 (second element)
      if (dataSource.data[1]) {
        this.boletasAlumno.push(dataSource.data[1]); // Second boleta (index 1)
      }
    });

    // Optionally, you can return boletasAlumno or handle it as needed
    return this.boletasAlumno; // Return or handle the boletasAlumno array as needed
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
    this.loading = true; // Mostrar spinner
    const { estudiantes } = this.apoderado;
    const apoderadoScope = this.apoderado;
    console.log(this.boletas);
    console.log(this.boletasAlumno);

    const obtenerTotalBoletaPorRut = (rutEstudiante: string): string | null => {
      const boleta = this.boletasAlumno.find((b:any) => b.rut_estudiante === rutEstudiante);
      return boleta ? boleta.total : null;
    };
    try {
      const contratosPorEstudiante = await Promise.all(estudiantes.map(async (estudiante: any) => {
        const cursoId = await this.getCursoId(estudiante.rut).toPromise(); // Asegúrate que esto devuelve una promesa
        const apoderadoSuplente = await this.getInfoApoderadoSuplenteByRutEstudiante(estudiante.rut).toPromise(); // Igual aquí
        const totalMensualidad = obtenerTotalBoletaPorRut(estudiante.rut);


        return {
          estudiantes: [{
            primer_nombre_alumno: estudiante.primer_nombre_alumno,
            segundo_nombre_alumno: estudiante.segundo_nombre_alumno,
            primer_apellido_alumno: estudiante.primer_apellido_alumno,
            segundo_apellido_alumno: estudiante.segundo_apellido_alumno,
            rut: estudiante.rut,
            dv: estudiante.dv,
            genero_alumno: estudiante.genero_alumno,
            fecha_nacimiento_alumno: estudiante.fecha_nacimiento_alumno,
            cursoId: cursoId?.toString(),
            vive_con: estudiante.vive_con,
            edad_marzo: this.calcularEdadEnMarzo2025(estudiante.fecha_nacimiento_alumno),
            nacionalidad: estudiante.nacionalidad || "",
            enfermedad_cronica_alumno: estudiante.enfermedad_cronica_alumno || "",
            alergia_alimento_alumno: estudiante.alergia_alimento_alumno || "",
            alergia_medicamento_alumno: estudiante.alergia_medicamento_alumno || "",
            prevision_alumno: estudiante.prevision_alumno,
            consultorio_clinica_alumno: estudiante.consultorio_clinica_alumno,
            es_pae: estudiante.es_pae,
            eximir_religion: estudiante.eximir_religion || false,
            autorizacion_fotografias: estudiante.autorizacion_fotografias,
            apto_educacion_fisica: estudiante.apto_educacion_fisica,
            observaciones_alumno: estudiante.observaciones_alumno
          }],
          primer_nombre_apoderado: apoderadoScope.primer_nombre_apoderado,
          segundo_nombre_apoderado: apoderadoScope.segundo_nombre_apoderado,
          primer_apellido_apoderado: apoderadoScope.primer_apellido_apoderado,
          segundo_apellido_apoderado: apoderadoScope.segundo_apellido_apoderado,
          rut: apoderadoScope.rut,
          dv: apoderadoScope.dv,
          telefono_apoderado: apoderadoScope.telefono_apoderado,
          correo_apoderado: apoderadoScope.correo_apoderado,
          parentesco_apoderado: apoderadoScope.parentesco_apoderado,
          estado_civil: apoderadoScope.estado_civil,
          profesion_oficio: apoderadoScope.profesion_oficio,
          direccion: apoderadoScope.direccion,
          comuna: apoderadoScope.comuna,
          primer_nombre_apoderado_suplente: apoderadoSuplente.primer_nombre_apoderado_suplente,
          segundo_nombre_apoderado_suplente: apoderadoSuplente.segundo_nombre_apoderado_suplente,
          primer_apellido_apoderado_suplente: apoderadoSuplente.primer_apellido_apoderado_suplente,
          segundo_apellido_apoderado_suplente: apoderadoSuplente.segundo_apellido_apoderado_suplente,
          rut_apoderado_suplente: apoderadoSuplente.rut_apoderado_suplente,
          dv_apoderado_suplente: apoderadoSuplente.dv_apoderado_suplente,
          telefono_apoderado_suplente: apoderadoSuplente.telefono_apoderado_suplente,
          correo_apoderado_suplente: apoderadoSuplente.correo_apoderado_suplente,
          parentesco_apoderado_suplente: apoderadoSuplente.parentesco_apoderado_suplente,
          estado_civil_suplente: apoderadoSuplente.estado_civil_suplente,
          profesion_oficio_suplente: apoderadoSuplente.profesion_oficio_suplente,
          direccion_suplente: apoderadoSuplente.direccion_suplente,
          comuna_suplente: apoderadoSuplente.comuna_suplente,
          valor_matricula: 50200,
          valor_mensualidad: totalMensualidad
        };
      }));

      console.log("datosMatriculaPrueba", contratosPorEstudiante);

      for (const contrato of contratosPorEstudiante) {
        await new Promise<void>((resolve, reject) => {
          this.pdfService.getPdfContrato(contrato).subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `contrato_${contrato.estudiantes[0].rut}-${contrato.estudiantes[0].dv}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
        
              setTimeout(() => window.open(url, '_blank'), 100);
              resolve();
            },
            error: (error) => {
              console.error('Error al generar el PDF', error);
              reject(error);
            }
          });
        });
      }


    } catch (error) {
      console.error('Error al generar el contrato', error);
    } finally {
      this.loading = false; // Ocultar spinner después de procesar todo
    }
  }



  calcularEdadEnMarzo2025(fechaNacimiento: string | null | undefined): number {
    if (!fechaNacimiento) {
      console.warn("Fecha de nacimiento no proporcionada, se devuelve 0 como edad.");
      return 0; // Devuelve 0 o algún valor por defecto si no hay fecha
    }

    // Convertir la fecha a un formato ISO para asegurar compatibilidad
    const fechaNacimientoDate = new Date(fechaNacimiento);
    if (isNaN(fechaNacimientoDate.getTime())) {
      console.error("Formato de fecha de nacimiento inválido.");
      return 0; // Devuelve 0 o lanza un error si el formato es inválido
    }

    const añoReferencia = 2025;
    const fechaMarzo2025 = new Date(añoReferencia, 2, 1); // 1 de marzo de 2025

    // Calcula la edad preliminar
    let edad = añoReferencia - fechaNacimientoDate.getFullYear();

    // Si la fecha de nacimiento es después del 1 de marzo de 2025, resta un año a la edad
    if (fechaNacimientoDate > fechaMarzo2025) {
      edad--;
    }

    console.log("Edad en marzo de 2025:", edad);
    return edad;
  }

  getCursoId(rut: string): Observable<number | null> {
    return this.cursoService.getCursoByRutEstudiante(rut).pipe(
      map(data => {
        console.log(data);
        return data ? data.id : null; // Retorna el ID del curso o null si no se encuentra
      }),
      catchError(error => {
        console.error('Error fetching curso:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  getInfoApoderadoSuplenteByRutEstudiante(rut: string): Observable<any> {
    return this.apoderadoService.getInfoApoderadoSuplenteByRutEstudiante(rut).pipe(
      map(data => {
        console.log(data);
        return data;
      }),
      catchError(error => {
        console.error('Error fetching curso:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }


}
