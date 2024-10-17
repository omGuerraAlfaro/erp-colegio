import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IApoderado2 } from 'src/app/interfaces/apoderadoInterface';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { MatPaginator } from '@angular/material/paginator';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { ModalBoletasMantenedorComponent } from '../modal-boletas-mantenedor/modal-boletas-mantenedor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-boletas-mantenedor',
  templateUrl: './boletas-mantenedor.component.html',
  styleUrls: ['./boletas-mantenedor.component.css']
})
export class BoletasMantenedorComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombreCompleto', 'rut', 'telefono', 'correo', 'estado_civil', 'profesion', 'direccion', 'comuna', 'acciones'];
  dataSource!: MatTableDataSource<IApoderado2>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Añade el paginador

  constructor(
    private apoderadoService: InfoApoderadoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.apoderadoService.getAllApoderados().subscribe({
      next: (apoderados: IApoderado2[]) => { // Se espera un arreglo de apoderados
        console.log(apoderados);
        this.dataSource = new MatTableDataSource(apoderados);
        this.dataSource.paginator = this.paginator; // Conectar el paginador con la tabla
      },
      error: (error) => {
        console.error('Error fetching apoderados:', error);
      }
    });
  }

  verBoletas(rut: string): void {
    console.log("VER BOLETAS " + rut);
    const dialogRef = this.dialog.open(ModalBoletasMantenedorComponent, {
      width: '70%',
      height: 'auto',
      data: rut
    });

    // dialogRef.componentInstance.inscripcionOK.subscribe(() => {
    //   this.loadInscripciones();
    // });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }
}
