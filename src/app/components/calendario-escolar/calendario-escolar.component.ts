import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalCalendarioComponent } from './modal-calendario/modal-calendario.component';

@Component({
  selector: 'app-calendario-escolar',
  templateUrl: './calendario-escolar.component.html',
  styleUrls: ['./calendario-escolar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioEscolarComponent implements OnInit {

  selectedDate: Date | null = null;
  markedDates: { [key: string]: { tipo: string; descripcion: string | null } } = {};

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    // Carga las fechas desde la base de datos (simulado aquí)
    this.loadDates();
  }

  loadDates() {
    const fechas = [
      { fecha: '2024-11-24', tipo: 'Feriado', descripcion: 'Día Feriado' },
      { fecha: '2024-11-20', tipo: 'Clase', descripcion: null },
      { fecha: '2024-11-21', tipo: 'Evento', descripcion: null },
    ];
  
    fechas.forEach(fecha => {
      this.markedDates[fecha.fecha] = { tipo: fecha.tipo, descripcion: fecha.descripcion };
    });
  
    console.log('Marked Dates:', this.markedDates); // Debug
  }
  

  onDateSelected(date: Date | null) {
    if (!date) {
      return; // Si la fecha es null, no hacemos nada.
    }

    const formattedDate = date.toISOString().split('T')[0];
    const dayDetails = this.markedDates[formattedDate] || { tipo: 'Sin información', descripcion: null };

    this.dialog.open(ModalCalendarioComponent, {
      width: '400px',
      data: {
        fecha: formattedDate,
        tipo: dayDetails.tipo,
        descripcion: dayDetails.descripcion,
      },
    });
    // if (this.markedDates[formattedDate]) {
    //   const { tipo, descripcion } = this.markedDates[formattedDate];
    //   alert(`Fecha: ${formattedDate}\nTipo: ${tipo}\nDescripción: ${descripcion || 'Ninguna'}`);
    // } else {
    //   alert(`Fecha: ${formattedDate}\nNo hay datos para esta fecha.`);
    // }
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
    }
    return '';
  };
  

}
