export interface CalendarioAsistencia {
    id_dia: number;
    fecha: string; // Fecha en formato ISO
    es_clase: boolean;
    descripcion?: string;
}

export interface Asistencia {
    id_asistencia?: number;
    id_estudiante: number;
    id_curso: number;
    id_dia: number;
    estado: string; // Presente, Ausente, Tardanza
}
