import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarioEscolarService } from 'src/app/services/calendarioService/calendario-escolar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-calendario',
  templateUrl: './modal-calendario.component.html',
  styleUrls: ['./modal-calendario.component.css'],
})
export class ModalCalendarioComponent implements OnInit {
  eventos: Array<{ id_dia: number; tipo: string; descripcion: string | null }> = [];
  fecha: string = ''; // formato DD-MM-YYYY
  cursoId: number | null = null;
  nuevoTipo: string = '';
  nuevaDescripcion: string = '';
  eventoEditando: any = null; // Para saber si estamos editando
  tiposOpciones: string[] = ['Feriado', 'Interferiado', 'Evento', 'Clase', 'Vacaciones'];


  constructor(
    public dialogRef: MatDialogRef<ModalCalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarioService: CalendarioEscolarService
  ) {
    this.eventos = data.eventos || [];
    this.fecha = data.fecha;
    this.cursoId = data.cursoId || null;
  }

  ngOnInit(): void { }

  onAgregar(): void {
    if (!this.nuevoTipo || this.nuevoTipo.trim() === '') {
      Swal.fire('Tipo requerido', 'Debes seleccionar un tipo de evento.', 'warning');
      return;
    }

    const [day, month, year] = this.fecha.split('-');
    const fechaFormateada = `${year}-${month}-${day}`;

    const nuevoEvento = {
      tipo: this.nuevoTipo,
      descripcion: this.nuevaDescripcion,
      fecha: fechaFormateada,
      curso: this.cursoId ? { id: this.cursoId } : null
    };

    this.calendarioService.createFecha(nuevoEvento).subscribe({
      next: (resp) => {
        Swal.fire('Agregado', 'El evento fue agregado correctamente.', 'success');
        this.dialogRef.close({ action: 'guardar' });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo agregar el evento.', 'error');
      },
    });
  }

  onEditar(evento: any): void {
    this.eventoEditando = evento;
    this.nuevoTipo = evento.tipo;
    this.nuevaDescripcion = evento.descripcion;
  }

  onEliminar(evento: any): void {
    Swal.fire({
      title: 'Eliminar evento',
      text: '¿Estás seguro que deseas eliminar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        this.calendarioService.deleteFecha(evento.id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El evento ha sido eliminado.', 'success');
            this.dialogRef.close({ action: 'eliminar' });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
          },
        });
      }
    });
  }

  onGuardarEdicion(): void {
    if (this.nuevoTipo.trim() && this.nuevaDescripcion.trim()) {
      Swal.fire({
        title: 'Confirmar Edición',
        text: '¿Estás seguro de que deseas guardar los cambios del evento?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      }).then((res) => {
        if (res.isConfirmed) {

          const [day, month, year] = this.fecha.split('-');
          const fechaFormat = `${year}-${month}-${day}`;

          const updatedEvento = {
            tipo: this.nuevoTipo,
            descripcion: this.nuevaDescripcion,
            fecha: fechaFormat,
            curso: this.cursoId ? { id: this.cursoId } : null
          };

          const id = this.eventoEditando.id;

          this.calendarioService.updateFecha(id, updatedEvento).subscribe({
            next: (response: any) => {
              Swal.fire('Guardado', 'El evento ha sido actualizado.', 'success');
              this.dialogRef.close({ action: 'guardar' });
              // Actualiza en la lista local
              const index = this.eventos.findIndex(e => e.id_dia === id);
              if (index !== -1) {
                this.eventos[index] = response;
              }

              // Reset
              this.eventoEditando = null;
              this.nuevoTipo = '';
              this.nuevaDescripcion = '';
            },
            error: () => {
              Swal.fire('Error', 'No se pudo actualizar el evento.', 'error');
            },
          });
        }
      });
    } else {
      Swal.fire('Campos incompletos', 'Completa todos los campos para guardar.', 'warning');
    }
  }

  formatToYYYYMMDD(fecha: string | Date): string {
    const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
