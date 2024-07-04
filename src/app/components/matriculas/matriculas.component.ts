import { Component, OnInit } from '@angular/core';
import { ModalNuevaMatriculaComponent } from '../modal-nueva-matricula/modal-nueva-matricula.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  openModalNuevaMatricula() {
    const dialogRef = this.dialog.open(ModalNuevaMatriculaComponent, {
      width: 'auto',
      height: 'auto',
      data: null //por parametro
    });

    dialogRef.componentInstance.matriculaAgregada.subscribe(() => {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }

}
