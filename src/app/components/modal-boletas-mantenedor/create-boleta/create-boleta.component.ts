import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-boleta',
  templateUrl: './create-boleta.component.html',
  styleUrls: ['./create-boleta.component.css']
})
export class CreateBoletaComponent implements OnInit {
  boletaForm: FormGroup;
  isCreatingAllBoletas: boolean = false;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CreateBoletaComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private boletaService: BoletasService,
    private fb: FormBuilder
  ) {
    console.log(data);

    this.boletaForm = this.fb.group({
      valor_matricula: [null, [Validators.required, Validators.min(0)]],
      valor_mensualidad: [null, [Validators.required, Validators.min(0)]],
      rut: [data.rut]
    });
  }

  ngOnInit(): void {
  }

  crearBoletas() {
    if (this.boletaForm.valid) {
      const crearBoletaDto = this.boletaForm.value;
      this.isCreatingAllBoletas = true; // Activa el spinner
  
      this.boletaService.createAnnualBoletasForApoderadoByRut(crearBoletaDto.rut, crearBoletaDto).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Éxito',
            text: 'Se han creado todas las boletas correctamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          this.isCreatingAllBoletas = false; // Desactiva el spinner
          this.bottomSheetRef.dismiss(true);
          this.cerrar();
        },
        error: (error: any) => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron crear las boletas. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.isCreatingAllBoletas = false; // Desactiva el spinner
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
  

  cerrar() {
    this.bottomSheetRef.dismiss();
  }
}
