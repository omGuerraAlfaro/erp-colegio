import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { Router } from '@angular/router';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { MatPaginator } from '@angular/material/paginator';



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
    '4': false  // Repactada
  };

  vars = [
    {
      name: 'Monto Adeudado Mes',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Monto Adeudado Total',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Numero de Morosos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Curso con mas Morosos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'rut_apoderado2', 'nombre_apoderado', 'telefono_apoderado', 'correo_apoderado', 'detalle', 'fecha_vencimiento', 'estado_id', 'descuento', 'subtotal', 'total'];
  dataSource = new MatTableDataSource<BoletaDetalle>();

  constructor(
    private router: Router,
    public apoderadoService: InfoApoderadoService,
    public estudianteService: EstudianteService,
    public boletasService: BoletasService
  ) { }

  ngOnInit(): void {
    this.loadChart();
    this.loadBoletas();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadBoletas(): void {
    this.boletasService.getBoletas().subscribe({
        next: (boletas: any[]) => {
            console.log('Boletas:', boletas);
            const modifiedData = boletas.map(boleta => {
                return {
                    ...boleta,
                    nombre_apoderado: boleta.apoderado.primer_nombre + ' ' + boleta.apoderado.primer_apellido,
                    telefono_apoderado: boleta.apoderado.telefono,
                    correo_apoderado: boleta.apoderado.correo_electronico,
                    rut_apoderado2: boleta.apoderado.rut + '-' + boleta.apoderado.dv,
                };
            });
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
  
  


  loadChart(): void {
    const myChart = new Chart('myChart3', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Saldos Caja',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
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
