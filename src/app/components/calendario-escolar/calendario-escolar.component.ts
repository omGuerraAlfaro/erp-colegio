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

  private calendarObserver: MutationObserver | undefined;

  constructor(
    private dialog: MatDialog,
    private calendarioService: CalendarioEscolarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDates();
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
    console.log('Injecting badges into calendar cells:', elements.length);

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
          console.log(`Insertando badge para ${key} con ${eventos.length} eventos`);
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
        eventos: eventosDelDia
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'guardar' || result?.action === 'eliminar' || result?.action === 'editar') {
        this.loadDates();
      }
    });

  }

  dateClass = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const eventos = this.markedDates[formattedDate] || [];
    const tipos = eventos.map((d) => d.tipo);

    if (eventos.length >= 2) {
      return 'varios-eventos-class'; // aplica fondo morado si hay 2 o más eventos
    }

    if (tipos.includes('Feriado') || tipos.includes('Interferiado')) {
      return 'feriado-class';
    } else if (tipos.includes('Clase')) {
      return 'clase-class';
    } else if (tipos.includes('Evento') || tipos.includes('Vacaciones')) {
      return 'evento-class';
    }

    return '';
  };

  formatToDDMMYYYY(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }
}
