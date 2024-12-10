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
  displayedColumns: string[] = ['id', 'nombreCompleto', 'rut', 'correo', 'telefono', 'comuna', 'acciones'];
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
        this.dataSource.filterPredicate = this.createFilter();

      },
      error: (error) => {
        console.error('Error fetching apoderados:', error);
      }
    });
  }

  searchTerms = {
    text: ''
  };
  createFilter(): (data: IApoderado2, filter: string) => boolean {
    let filterFunction = function (data: IApoderado2, filter: string): boolean {
      const searchTerm = filter.toLowerCase();
      // Check if the RUT matches the search term
      return data.rut.toLowerCase().includes(searchTerm);
    };
    return filterFunction;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerms.text = filterValue.trim().toLowerCase(); // You may not need `searchTerms.text` if only filtering by RUT
    this.updateFilter();
  }
  
  updateFilter(): void {
    // Use only the text search term for filtering by RUT
    const filter = this.searchTerms.text; // Simplified filter value
    this.dataSource.filter = filter;
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
