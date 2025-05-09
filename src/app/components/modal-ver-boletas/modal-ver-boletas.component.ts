// modal-ver-boletas.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';

@Component({
  selector: 'app-modal-ver-boletas',
  templateUrl: './modal-ver-boletas.component.html',
  styleUrls: ['./modal-ver-boletas.component.css']
})
export class ModalVerBoletasComponent implements OnInit {
  boletas: any[] = [];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ModalVerBoletasComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { apoderadoId: number; nombre: string },
    private boletasService: BoletasService
  ) { }

  ngOnInit(): void {
    this.boletasService
      .getBoletasByRutApoderado(this.data.apoderadoId)
      .subscribe(lista => this.boletas = lista);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
