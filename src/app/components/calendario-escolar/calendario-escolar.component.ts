import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCalendar } from '@angular/material/datepicker';
import { ModalCalendarioComponent } from './modal-calendario/modal-calendario.component';
import { CalendarioEscolarService } from 'src/app/services/calendarioService/calendario-escolar.service';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario-escolar',
  templateUrl: './calendario-escolar.component.html',
  styleUrls: ['./calendario-escolar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioEscolarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatCalendar, { static: true }) calendar!: MatCalendar<Date>;
  @ViewChild(MatCalendar, { static: true, read: ElementRef }) calendarContainer!: ElementRef;

  selectedDate: Date | null = null;
  markedDates: {
    [key: string]: Array<{ id: number; tipo: string; descripcion: string | null }>;
  } = {};

  rolUser: string = "";
  cursos: any[] = [];
  cursoSeleccionado: number | null = null;
  mostrarCursoSeleccionado = false;

  private calendarObserver: MutationObserver | undefined;

  constructor(
    private dialog: MatDialog,
    private calendarioService: CalendarioEscolarService,
    private cdr: ChangeDetectorRef,
    private cursoService: CursosService
  ) { }

  ngOnInit(): void {
    this.rolUser = localStorage.getItem('rol') || '';
    this.loadDates();
    this.getAllCursos();
  }

  volverCalendario(): void {
    this.cursoSeleccionado = null;
    this.loadDates();
  }

  getAllCursos(): void {
    this.cursoService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
      },
      error: (err) => console.error('Error al obtener los cursos:', err),
    });
  }

  ngAfterViewInit() {
    this.observeCalendarChanges();
  }

  ngOnDestroy() {
    if (this.calendarObserver) {
      this.calendarObserver.disconnect();
    }
  }

  loadDates() {
    this.calendarioService.getAllFechas().subscribe({
      next: (data: Array<{ id_dia: number; fecha: string; tipo: string; descripcion: string | null }>) => {
        this.markedDates = {};
        data.forEach((fecha) => {
          if (fecha.fecha) {
            if (!this.markedDates[fecha.fecha]) {
              this.markedDates[fecha.fecha] = [];
            }
            this.markedDates[fecha.fecha].push({
              id: fecha.id_dia,
              tipo: fecha.tipo,
              descripcion: fecha.descripcion,
            });
          }
        });

        console.log('Marked Dates:', this.markedDates);
        this.selectedDate = null;
        this.calendar.updateTodaysDate();
        this.cdr.detectChanges();
        setTimeout(() => this.injectBadges(), 50);
      },
      error: (error) => {
        console.error('Error fetching fechas:', error);
      },
    });

  }

  observeCalendarChanges() {
    if (!this.calendarContainer?.nativeElement) return;

    const targetNode = this.calendarContainer.nativeElement;

    this.calendarObserver = new MutationObserver(() => {
      setTimeout(() => this.injectBadges(), 10);
    });

    this.calendarObserver.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  injectBadges() {
    if (this.calendarObserver) {
      this.calendarObserver.disconnect();
    }

    const elements = this.calendarContainer.nativeElement.querySelectorAll('.mat-calendar-body-cell');

    elements.forEach((cell: HTMLElement) => {
      const text = cell.innerText.trim();
      const day = parseInt(text);
      if (isNaN(day)) return;

      const today = new Date(this.calendar.activeDate);
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const key = date.toISOString().split('T')[0];
      const eventos = this.markedDates[key];

      // Eliminar badges anteriores
      const existing = cell.querySelector('.event-badge');
      if (existing) existing.remove();

      if (eventos && eventos.length > 1) {
        const badge = document.createElement('div');
        badge.className = 'event-badge';
        badge.innerText = eventos.length.toString();

        const content = cell.querySelector('.mat-calendar-body-cell-content');
        if (content) {
          content.appendChild(badge);
        }
      }
    });

    // Reactivar el observer
    this.observeCalendarChanges();
  }


  onDateSelected(date: Date | null): void {
    if (!date) return;

    const formattedDate = date.toISOString().split('T')[0];
    const eventosDelDia = this.markedDates[formattedDate] || [];

    const dialogRef = this.dialog.open(ModalCalendarioComponent, {
      width: '500px',
      data: {
        fecha: this.formatToDDMMYYYY(formattedDate),
        eventos: eventosDelDia,
        cursoId: this.cursoSeleccionado
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'guardar' || result?.action === 'eliminar' || result?.action === 'editar') {
        if (!this.cursoSeleccionado) {
          this.loadDates();
        } else {
          this.buscarCalendarioCurso();
        }
      }
    });

  }

  dateClass = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const eventos = this.markedDates[formattedDate] || [];
    const tipos = eventos.map(e => e.tipo);

    // 1) Si hay 2 o más eventos, prioridad a "varios"
    if (eventos.length >= 2) {
      return 'varios-eventos-class';
    }
    console.log('Tipos de eventos:', tipos);

    // 2) Eventos generales (sin curso)
    if (tipos.includes('Feriado') || tipos.includes('Interferiado')) {
      return 'feriado-class';
    }
    if (tipos.includes('Clase')) {
      return 'clase-class';
    }
    if (tipos.includes('Evento') || tipos.includes('Vacaciones')) {
      return 'evento-class';
    }

    // 3) Eventos de curso
    if (tipos.includes('Prueba')) {
      return 'prueba-class';
    }
    if (tipos.includes('Tarea')) {
      return 'tarea-class';
    }
    if (tipos.includes('Reunión de Apoderado')) {
      return 'reunion-apoderados-class';
    }
    if (tipos.includes('Excursión Pedagógica')) {
      return 'excursion-pedagogica-class';
    }

    return '';
  };


  formatToDDMMYYYY(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }

  buscarCalendarioCurso(): void {
    this.mostrarCursoSeleccionado = true;

    if (!this.cursoSeleccionado) {
      Swal.fire({
        title: 'Curso no seleccionado',
        text: 'Por favor, selecciona un curso para ver su calendario.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.calendarioService.getAllFechasCurso(this.cursoSeleccionado).subscribe({
      next: (data: Array<{ id_dia: number; fecha: string; tipo: string; descripcion: string | null }>) => {
        this.markedDates = {};
        data.forEach((fecha) => {
          if (fecha.fecha) {
            if (!this.markedDates[fecha.fecha]) {
              this.markedDates[fecha.fecha] = [];
            }
            this.markedDates[fecha.fecha].push({
              id: fecha.id_dia,
              tipo: fecha.tipo,
              descripcion: fecha.descripcion,
            });
          }
        });

        console.log('Calendario del curso:', this.markedDates);
        this.selectedDate = null;
        this.calendar.updateTodaysDate();
        this.cdr.detectChanges();
        setTimeout(() => this.injectBadges(), 50);
      },
      error: (error) => {
        console.error('Error fetching fechas:', error);
      },
    });
  }

  getNombreCursoSeleccionado(): string {
    const curso = this.cursos.find(c => c.id === this.cursoSeleccionado);
    return curso ? curso.nombre : '';
  }


}
