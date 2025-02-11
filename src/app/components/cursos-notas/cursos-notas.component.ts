import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { AsignaturaService } from 'src/app/services/asignaturaService/asignatura.service';
import Swal from 'sweetalert2';
import { NotasService } from 'src/app/services/notaService/nota.service';

@Component({
  selector: 'app-cursos-notas',
  templateUrl: './cursos-notas.component.html',
  styleUrls: ['./cursos-notas.component.css']
})
export class CursosNotasComponent implements OnInit {
  cursos: any[] = [];
  asignaturas: any[] = [];
  cursoSeleccionado: number | null = null;
  asignaturaSeleccionada: number | null = null;
  dataSourceNotas: any[] = [];
  displayedColumnsNotas: string[] = ['alumno'];
  cargando = false;

  // Variables para manejar las notas agrupadas por tipo
  maxNotasParcial = 0;
  maxNotasFinal = 0;
  maxNotasTarea = 0;

  maxNotasParcialArray: number[] = [];
  maxNotasFinalArray: number[] = [];
  maxNotasTareaArray: number[] = [];

  constructor(
    private notasService: NotasService,
    private cursoService: CursosService,
    private asignaturaService: AsignaturaService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllCursos();
    this.getAllAsignaturas();
  }

  getAllCursos(): void {
    this.cursoService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener cursos:', err)
    });
  }

  getAllAsignaturas(): void {
    this.asignaturaService.getAllAsignaturas().subscribe({
      next: (asignaturas) => {
        this.asignaturas = asignaturas;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener asignaturas:', err)
    });
  }

  buscarNotas(): void {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
      Swal.fire('Error', 'Por favor, selecciona un curso y una asignatura.', 'error');
      return;
    }

    this.cargando = true;
    this.cdRef.markForCheck();

    this.notasService.getNotasByCursoAsignatura(this.cursoSeleccionado, this.asignaturaSeleccionada, 1)
      .subscribe({
        next: (notas) => {
          this.dataSourceNotas = notas;
          this.calcularMaxNotas();
          this.cargando = false;
          this.cdRef.markForCheck();
        },
        error: (err) => {
          console.error('Error al obtener notas:', err);
          Swal.fire('Error', 'Ocurrió un problema al cargar las notas.', 'error');
          this.cargando = false;
          this.cdRef.markForCheck();
        }
      });
  }

  calcularMaxNotas(): void {
    // Determinar cuántas notas hay en cada categoría
    this.maxNotasParcial = Math.max(...this.dataSourceNotas.map(n => n.parciales.length), 0);
    this.maxNotasFinal = Math.max(...this.dataSourceNotas.map(n => n.finales.length), 0);
    this.maxNotasTarea = Math.max(...this.dataSourceNotas.map(n => n.tareas.length), 0);

    // Generar arrays para iterar en el HTML
    this.maxNotasParcialArray = Array.from({ length: this.maxNotasParcial }, (_, i) => i);
    this.maxNotasFinalArray = Array.from({ length: this.maxNotasFinal }, (_, i) => i);
    this.maxNotasTareaArray = Array.from({ length: this.maxNotasTarea }, (_, i) => i);

    // Definir las columnas que se mostrarán en la tabla
    this.displayedColumnsNotas = [
      'alumno',
      ...this.maxNotasParcialArray.map(i => 'parcial' + (i + 1)),
      ...this.maxNotasFinalArray.map(i => 'final' + (i + 1)),
      ...this.maxNotasTareaArray.map(i => 'tarea' + (i + 1))
    ];
  }
}

