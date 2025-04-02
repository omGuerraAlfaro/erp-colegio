import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsignaturaService } from 'src/app/services/asignaturaService/asignatura.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-ingreso-anotacion',
  templateUrl: './modal-ingreso-anotacion.component.html',
  styleUrls: ['./modal-ingreso-anotacion.component.css']
})
export class ModalIngresoAnotacionComponent implements OnInit {
  anotacionForm: FormGroup;
  asignaturas: any[] = [];
  estudiante: { nombre: string, rut: string, telefono: string, genero: string } | null = null;
  cursoSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private asignaturaService: AsignaturaService,
    private dialogRef: MatDialogRef<ModalIngresoAnotacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.cursoSeleccionado = data.cursoId || null;

    this.anotacionForm = this.fb.group({
      anotacion_titulo: ['', Validators.required],
      anotacion_descripcion: ['', Validators.required],
      es_positiva: [false],
      es_negativa: [false],
      es_neutra: [false],
      anotacion_estado: [true],
      asignaturaId: [null, Validators.required]
    });

    // Inicializar la información del estudiante
    this.estudiante = {
      nombre: this.data.nombre_estudiante,
      rut: this.data.rut_estudiante2,
      telefono: this.data.telefono_estudiante,
      genero: this.data.genero_estudiante
    };
  }

  ngOnInit(): void {
    this.getAllAsignaturas();
  }

  setTipo(tipo: 'positiva' | 'negativa' | 'neutra'): void {
    this.anotacionForm.patchValue({
      es_positiva: tipo === 'positiva',
      es_negativa: tipo === 'negativa',
      es_neutra: tipo === 'neutra'
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('Curso seleccionado:', this.cursoSeleccionado);

    if (this.anotacionForm.valid) {
      const anotacionData = { ...this.anotacionForm.value };
      const idEstudiante = this.data.id;

      if (this.cursoSeleccionado == 1 || this.cursoSeleccionado == 2) {
        anotacionData.asignaturaPreBasicaId = Number(anotacionData.asignaturaId);
        delete anotacionData.asignaturaId;
      } else {
        anotacionData.asignaturaId = Number(anotacionData.asignaturaId);
        delete anotacionData.asignaturaPreBasicaId;
      }

      this.estudianteService.postNuevaAnotacion(idEstudiante, anotacionData)
        .subscribe(
          response => {
            Swal.fire({
              title: 'Éxito!',
              text: 'La anotación se ha creado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.dialogRef.close();
            });
          },
          error => {
            Swal.fire({
              title: 'Error!',
              text: 'Hubo un problema al crear la anotación.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }


  getAllAsignaturas(): void {
    console.log('Curso seleccionado:', this.cursoSeleccionado);

    if (this.cursoSeleccionado == 1 || this.cursoSeleccionado == 2) {
      this.asignaturaService.getAllAsignaturasPreBasica().subscribe({
        next: (asignaturas) => {
          this.asignaturas = asignaturas;
        },
        error: (err) => console.error('Error al obtener asignaturas:', err),
      });
    } else {
      this.asignaturaService.getAllAsignaturasBasica().subscribe({
        next: (asignaturas) => {
          this.asignaturas = asignaturas;
        },
        error: (err) => console.error('Error al obtener asignaturas:', err),
      });
    }
  }

}
