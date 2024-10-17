import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-boleta',
  templateUrl: './edit-boleta.component.html',
  styleUrls: ['./edit-boleta.component.css']
})
export class EditBoletaComponent {

  boletaForm: FormGroup;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<EditBoletaComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private fb: FormBuilder,
    private boletaService: BoletasService
  ) {
    this.boletaForm = this.fb.group({
      detalle: [data.detalle, Validators.required],
      fecha_vencimiento: [data.fecha_vencimiento ? new Date(data.fecha_vencimiento).toISOString().split('T')[0] : ''],
      total: [data.total, [Validators.required, Validators.min(0)]], // Asegúrate de que el total sea mayor o igual a 0
    });
  }

  editarBoleta() {
    if (this.boletaForm.valid) {
      const updatedBoleta = { ...this.boletaForm.value };
      this.boletaService.editarBoletaAll(this.data.id, updatedBoleta).subscribe(() => {
        // Muestra un mensaje de éxito
        Swal.fire({
          title: 'Éxito',
          text: 'La boleta ha sido editada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.bottomSheetRef.dismiss(updatedBoleta);
        });
      }, error => {
        // Manejo de errores
        console.error('Error al editar la boleta:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al editar la boleta. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    } else {
      // Manejo de validaciones
      console.error('El formulario no es válido');
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, completa todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  cerrar() {
    this.bottomSheetRef.dismiss();
  }
}
