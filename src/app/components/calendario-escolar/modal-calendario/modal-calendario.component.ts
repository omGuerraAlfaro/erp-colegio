import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-calendario',
  templateUrl: './modal-calendario.component.html',
  styleUrls: ['./modal-calendario.component.css']
})
export class ModalCalendarioComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalCalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fecha: string; tipo: string; descripcion: string }
  ) {}

  onAgregar() {
    alert('Agregar acción aquí');
  }

  onEditar() {
    alert('Editar acción aquí');
  }

  onDesactivar() {
    alert('Desactivar acción aquí');
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
