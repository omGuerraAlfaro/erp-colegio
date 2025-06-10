import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDetalleBoletaComponent } from '../modal-detalle-boleta/modal-detalle-boleta.component';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';
import { ModalBoletasEstudianteComponent } from '../modal-boletas-estudiante/modal-boletas-estudiante.component';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import { MatPaginator } from '@angular/material/paginator';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';

@Component({
  selector: 'app-boleta-edicion',
  templateUrl: './boleta-edicion.component.html',
  styleUrls: ['./boleta-edicion.component.css']
})
export class BoletaEdicionComponent implements OnInit {

  estadoFilters: Record<string, boolean> = {
    '1': false, // Pendiente
    '2': false, // Pagada
    '3': false, // Rechazada
    '4': false, // Repactada
    '5': false, // Transferencia Pendiente
    '6': false  // Transferencia Aprobada
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'rut_apoderado2', 'nombre_apoderado', 'detalle', 'fecha_vencimiento', 'estado_id', 'total', 'acciones'];
  dataSource = new MatTableDataSource<BoletaDetalle>();

  displayedColumnsCursos: string[] = [
    'numero',
    'id',
    'nombre_estudiante',
    'rut_estudiante',
    'genero_estudiante',
    'acciones'
  ];

  dataSourceCursos: {
    [cursoId: string]: {
      nombreCurso: string;
      dataSource2: MatTableDataSource<CursoEstudianteDetalle>;
    }
  } = {};

  constructor(
    private cursosService: CursosService,
    public boletasService: BoletasService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBoletas();
    this.dataSource.filterPredicate = this.createFilter();
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadBoletas(): void {
    this.boletasService.getBoletas().subscribe({
      next: (boletas: any[]) => {
        console.log('Boletas:', boletas);
        const modifiedData = boletas.map(boleta => {
          const fechaVencimiento = new Date(boleta.fecha_vencimiento);
          const formattedFechaVencimiento = fechaVencimiento.toISOString().split('T')[0];
          return {
            ...boleta,
            nombre_apoderado: boleta.apoderado.primer_nombre_apoderado + ' ' + boleta.apoderado.primer_apellido_apoderado,
            telefono_apoderado: boleta.apoderado.telefono_apoderado,
            correo_apoderado: boleta.apoderado.correo_apoderado,
            rut_apoderado2: boleta.apoderado.rut + '-' + boleta.apoderado.dv,
            fecha_vencimiento: formattedFechaVencimiento,
          };
        });

        console.log('Modified Data:', modifiedData);

        this.dataSource.data = modifiedData;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  searchTerms = {
    text: '',
    estado: this.estadoFilters
  };

  createFilter(): (data: BoletaDetalle, filter: string) => boolean {
    let filterFunction = function (data: BoletaDetalle, filter: string): boolean {
      let searchTerms = JSON.parse(filter);

      // Verificar si algún estado está activo
      let estadoIsActive = Object.keys(searchTerms.estado).some((key) => {
        return searchTerms.estado[key];
      });

      // Comprobar si los datos coinciden con los filtros de estado activos
      let estadoMatches = !estadoIsActive || searchTerms.estado[data.estado_id];

      // Comprobar si los datos coinciden con el texto de búsqueda
      let textMatches = !searchTerms.text ||
        data.rut_apoderado.toLowerCase().includes(searchTerms.text.toLowerCase()) ||
        data.detalle.toLowerCase().includes(searchTerms.text.toLowerCase());
      // Agrega aquí otras propiedades por las que desees buscar.

      // Devolver true si los datos coinciden con ambos, el texto y los filtros de estado
      return estadoMatches && textMatches;
    };
    return filterFunction;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerms.text = filterValue.trim().toLowerCase();
    this.updateFilter();
  }

  applyEstadoFilter(checked: boolean, estadoId: number): void {
    this.estadoFilters[estadoId.toString()] = checked;

    // Si todos los filtros de estado están desactivados, reiniciar el filtro
    const isAnyFilterActive = Object.values(this.estadoFilters).some(value => value);
    if (!isAnyFilterActive && !this.searchTerms.text) {
      this.dataSource.filter = '';
    } else {
      this.updateFilter();
    }
  }

  updateFilter(): void {
    // Combina los términos de búsqueda y los filtros de estado en un solo objeto de filtro
    const filter = JSON.stringify({
      text: this.searchTerms.text,
      estado: this.estadoFilters
    });
    this.dataSource.filter = filter;
  }

  openModalBoletasEstudiante(element: BoletaDetalle): void {
    const dialogRef = this.dialog.open(ModalDetalleBoletaComponent, {
      width: '60%',
      height: 'auto',
      data: element
    });

    dialogRef.componentInstance.boletaEditada.subscribe(() => {
      this.loadBoletas();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }


  loadCursosConEstudiantes(): void {
    this.cursosService.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any[]) => {
        cursos.forEach(curso => {
          const key = curso.id.toString();
          const sorted = curso.estudiantes.sort((a: any, b: any) =>
            a.primer_apellido_alumno.localeCompare(b.primer_apellido_alumno)
          );
          const data = sorted.map((e: any) => ({
            id: e.id,
            nombre_estudiante: `${e.primer_nombre_alumno} ${e.segundo_nombre_alumno} ` +
              `${e.primer_apellido_alumno} ${e.segundo_apellido_alumno}`,
            rut_estudiante: `${e.rut}-${e.dv}`,
            genero_estudiante: e.genero_alumno
          }));
          if (data.length) {
            this.dataSourceCursos[key] = {
              nombreCurso: curso.nombre,
              dataSource2: new MatTableDataSource<CursoEstudianteDetalle>(data)
            };
          }
        });
      },
      error: err => console.error('Error al cargar cursos con estudiantes', err)
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

  openModalDetalleBoleta(estudiante: CursoEstudianteDetalle): void {
    this.dialog.open(ModalBoletasEstudianteComponent, {
      width: '60%',
      data: estudiante
    });
  }
}