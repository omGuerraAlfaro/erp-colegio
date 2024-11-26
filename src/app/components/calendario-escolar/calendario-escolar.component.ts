import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCalendarioComponent } from './modal-calendario/modal-calendario.component';
import { CalendarioEscolarService } from 'src/app/services/calendarioService/calendario-escolar.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendario-escolar',
  templateUrl: './calendario-escolar.component.html',
  styleUrls: ['./calendario-escolar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioEscolarComponent implements OnInit {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  selectedDate: Date | null = null;
  markedDates: { [key: string]: { id: number; tipo: string; descripcion: string | null } } = {};

  constructor(
    private dialog: MatDialog,
    private calendarioService: CalendarioEscolarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Carga las fechas desde la base de datos (simulado aquí)
    this.loadDates();
  }

  loadDates() {
    this.calendarioService.getAllFechas().subscribe({
      next: (data: { id_dia: number; fecha: string; tipo: string; descripcion: string | null }[]) => {
        this.markedDates = {}; 
        data.forEach(fecha => {
          if (fecha.fecha) {
            this.markedDates[fecha.fecha] = {
              id: fecha.id_dia,
              tipo: fecha.tipo,
              descripcion: fecha.descripcion,
            };
          } else {
            console.warn('Fecha inválida encontrada:', fecha);
          }
        });

        console.log('Marked Dates:', this.markedDates); // Debug
        this.selectedDate = null;
        this.calendar.updateTodaysDate();
      },
      error: (error) => {
        console.error('Error fetching fechas:', error);
      },
    });
  }


  onDateSelected(date: Date | null): void {
    if (!date) {
      return; // Si la fecha es null, no hacemos nada.
    }

    const formattedDate = date.toISOString().split('T')[0];
    const dayDetails = this.markedDates[formattedDate] || { id: null, tipo: '', descripcion: null };

    const dialogRef = this.dialog.open(ModalCalendarioComponent, {
      width: '400px',
      data: {
        id_dia: dayDetails.id,
        fecha: this.formatToDDMMYYYY(formattedDate),
        tipo: dayDetails.tipo,
        descripcion: dayDetails.descripcion,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.action === 'guardar') {
          this.loadDates(); // Recargar las fechas
        } else if (result.action === 'eliminar') {
          this.loadDates(); // Recargar las fechas
        }
      }
    });
  }


  dateClass = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const tipo = this.markedDates[formattedDate]?.tipo;
    console.log(`Fecha: ${formattedDate}, Tipo: ${tipo}`); // Debug
    if (tipo === 'Feriado') {
      return 'feriado-class';
    } else if (tipo === 'Clase') {
      return 'clase-class';
    } else if (tipo === 'Evento') {
      return 'evento-class';
    } else if (tipo === 'Interferiado') {
      return 'feriado-class';
    } else if (tipo === 'Vacaciones') {
      return 'evento-class';
    }
    return '';
  };

  getFormattedDates() {
    return Object.keys(this.markedDates).map((key) => ({
      fecha: key,
      tipo: this.markedDates[key].tipo,
      descripcion: this.markedDates[key].descripcion,
    }));
  }

  get markedDatesKeys(): string[] {
    return Object.keys(this.markedDates);
  }

  formatToDDMMYYYY(fecha: string): string {
    const [year, month, day] = fecha.split('-'); // Dividir la fecha
    return `${day}-${month}-${year}`; // Reorganizar los valores
  }


}
