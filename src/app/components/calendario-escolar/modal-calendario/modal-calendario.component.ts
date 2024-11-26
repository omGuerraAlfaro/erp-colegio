import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarioEscolarService } from 'src/app/services/calendarioService/calendario-escolar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-calendario',
  templateUrl: './modal-calendario.component.html',
  styleUrls: ['./modal-calendario.component.css'],
})
export class ModalCalendarioComponent implements OnInit {
  detalleDiaForm: FormGroup;
  tiposOpciones: string[] = ['Feriado', 'Interferiado', 'Evento', 'Clase'];

  constructor(
    public dialogRef: MatDialogRef<ModalCalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_dia?: number; fecha: string; tipo: string; descripcion: string },
    private fb: FormBuilder,
    private calendarioService: CalendarioEscolarService
  ) {
    this.detalleDiaForm = this.fb.group({
      tipo: [data.tipo || '', Validators.required],
      descripcion: [data.descripcion || '', [Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void { }

  onGuardar(): void {
    if (this.detalleDiaForm.valid) {
      Swal.fire({
        title: 'Confirmar Guardado',
        text: '¿Estás seguro de que deseas guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      }).then((res) => {
        if (res.isConfirmed) {
          const updatedData = {
            ...this.data,
            ...this.detalleDiaForm.value,
          };
  
          // Convertir la fecha al formato YYYY-MM-DD
          if (this.data.fecha) {
            const [day, month, year] = this.data.fecha.split('-'); // Divide la fecha DD-MM-YYYY
            updatedData.fecha = `${year}-${month}-${day}`; // Reorganiza en formato YYYY-MM-DD
          }
  
          if (this.data.id_dia) {
            // Actualizar registro existente
            this.calendarioService.updateFecha(this.data.id_dia, updatedData).subscribe({
              next: (response: any) => {
                Swal.fire('Guardado', 'Los cambios han sido guardados.', 'success');
                this.dialogRef.close({ action: 'guardar', data: response });
              },
              error: (err: any) => {
                Swal.fire('Error', 'Ocurrió un error al actualizar el registro.', 'error');
              },
            });
          } else {
            // Crear un nuevo registro
            this.calendarioService.createFecha(updatedData).subscribe({
              next: (response: any) => {
                Swal.fire('Guardado', 'El registro ha sido creado.', 'success');
                this.dialogRef.close({ action: 'guardar', data: response });
              },
              error: (err: any) => {
                Swal.fire('Error', 'Ocurrió un error al crear el registro.', 'error');
              },
            });
          }
        } else {
          Swal.fire('Cancelado', 'Los cambios no se guardaron.', 'info');
        }
      });
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.detalleDiaForm.markAllAsTouched();
      Swal.fire('Campos incompletos', 'Por favor completa todos los campos obligatorios.', 'warning');
    }
  }
  

  onEliminar(): void {
    if (this.data.id_dia === undefined) {
      Swal.fire('Error', 'No se puede eliminar: el ID del registro es indefinido.', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de que deseas eliminar el registro del ${this.data.fecha}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        this.calendarioService.deleteFecha(this.data.id_dia!).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El registro ha sido eliminado con éxito.', 'success');
            this.dialogRef.close({ action: 'eliminar', id_dia: this.data.id_dia });
          },
          error: (err) => {
            console.error('Error al eliminar el registro:', err);
            Swal.fire('Error', 'Ocurrió un error al intentar eliminar el registro.', 'error');
          },
        });
      } else {
        Swal.fire('Cancelado', 'La eliminación fue cancelada.', 'info');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
