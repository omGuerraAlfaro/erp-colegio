import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { Router } from '@angular/router';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetalleBoletaComponent } from '../modal-detalle-boleta/modal-detalle-boleta.component';
import { forkJoin } from 'rxjs';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { CursoDetalle, CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';

@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit {

  estadoFilters: Record<string, boolean> = {
    '1': false, // Pendiente
    '2': false, // Pagada
    '3': false, // Rechazada
    '4': false, // Repactada
    '5': false, // Transferencia Pendiente
    '6': false  // Transferencia Aprobada
  };

  vars = [
    {
      name: 'Total Pendiente Mes',
      mount: 0,
      count: 0,
      date: this.getToday(),
      link: 'pendiente-mes'
    },
    {
      name: 'Total Pagado Mes',
      mount: 0,
      count: 0,
      date: this.getToday(),
      link: 'pagado-mes'
    },
    {
      name: 'Número de Morosos',
      mount: 0,
      count: 0,
      date: this.getToday(),
      link: 'morosos'
    },
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'rut_apoderado2', 'nombre_apoderado', 'telefono_apoderado', 'correo_apoderado', 'detalle', 'fecha_vencimiento', 'estado_id', 'total', 'acciones'];
  dataSource = new MatTableDataSource<BoletaDetalle>();

  displayedColumnsCursos: string[] = ['id', 'nombre_estudiante', 'rut_estudiante2', 'telefono_estudiante', 'genero_estudiante'];
  dataSource2 = new MatTableDataSource<CursoDetalle>();
  dataSourceCursos: { [key: string]: { dataSource2: MatTableDataSource<CursoEstudianteDetalle>, nombreCurso: string } } = {};


  constructor(
    private router: Router,
    public apoderadoService: InfoApoderadoService,
    public estudianteService: EstudianteService,
    public boletasService: BoletasService,
    private cursosServices: CursosService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBoletas();
    this.loadData();
    this.loadDataChart();
    this.loadCursosConEstudiantes();
    this.dataSource.filterPredicate = this.createFilter();
  }

  getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  loadData(): void {
    const today = this.getToday();

    const estadoPendiente = 1;
    const estadoPagado = 2;

    forkJoin([
      this.boletasService.getApoderadosEstadoBoleta(today, estadoPendiente),
      this.boletasService.getTotalPendienteVencido(today),
      this.boletasService.getTotalPagadas(today),
      this.boletasService.getPendientesVencidas(today)
    ]).subscribe(([apoderadosData, totalPendienteData, totalPagadas, pendientesData]) => {

      const totalPendienteVencido = parseFloat(totalPendienteData.total_pendiente_vencido);
      const totalPagado = parseFloat(totalPagadas.total_pagado);
      // console.log(apoderadosData);
      // console.log(totalPendienteData);
      // console.log(totalPagadas);
      // console.log(pendientesData);

      this.vars[0].mount = totalPendienteVencido;
      this.vars[1].mount = totalPagado;
      this.vars[2].count = apoderadosData.total;

    }, error => {
      console.error('Error loading data', error);
    });
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
            nombre_apoderado: boleta.apoderado.primer_nombre + ' ' + boleta.apoderado.primer_apellido,
            telefono_apoderado: boleta.apoderado.telefono,
            correo_apoderado: boleta.apoderado.correo_electronico,
            rut_apoderado2: boleta.apoderado.rut + '-' + boleta.apoderado.dv,
            fecha_vencimiento: formattedFechaVencimiento,
          };
        });
        this.dataSource.data = modifiedData;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  loadCursosConEstudiantes(): void {
    this.cursosServices.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any) => {
        if (cursos) {
          cursos.forEach((curso: any) => {
            const cursoId = curso.id.toString();
            const nombreCurso = curso.nombre;
            const estudiantesArray = curso.estudiantes.map((estudiante: any) => ({
              id: estudiante.id,
              nombre_estudiante: `${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`,
              rut_estudiante2: `${estudiante.rut}-${estudiante.dv}`,
              telefono_estudiante: estudiante.telefono_contacto,
              genero_estudiante: estudiante.genero
            }));
            if (estudiantesArray.length) {
              const dataSource2 = new MatTableDataSource<CursoEstudianteDetalle>(estudiantesArray);
              this.dataSourceCursos[cursoId] = { dataSource2, nombreCurso };
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching cursos con estudiantes:', error);
      }
    });
  }
  

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
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

  openModal(element: BoletaDetalle): void {
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


  loadDataChart(): void {
    const fecha = new Date().toISOString().slice(0, 10); // o la fecha que necesites
    this.boletasService.getTotalPendientePorMes(fecha).subscribe(pendienteData => {
      this.boletasService.getTotalPagadoPorMes(fecha).subscribe(pagadoData => {
        this.loadChart(pendienteData, pagadoData);
      });
    });
  }
  loadChart(pendienteData: any, pagadoData: any): void {
    const labels = pendienteData.map((item: any) => item.mes);
    const pendienteValues = pendienteData.map((item: any) => item.total_pendiente_vencido);
    const pagadoValues = pagadoData.map((item: any) => item.total_pagado);
    console.log(pendienteValues);
    console.log(pagadoValues);

    const myChart = new Chart('myChart3', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Pendiente Vencido',
            data: pendienteValues,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Total Pagado',
            data: pagadoValues,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    //chart 2
    const myChart2 = new Chart('myChart4', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Gasto Mensual',
          data: [14, 12, 13, 11, 12, 13, 14],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

}
