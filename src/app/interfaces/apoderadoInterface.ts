import { BoletaDetalle } from "./boletaInterface";

export interface IApoderado {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: Date;
  rut: string;
  dv: string;
  telefono: string;
  correo_electronico: string;
  estado_civil: string;
  nacionalidad: string;
  actividad: string;
  escolaridad: string;
  descuento_asignado: number;
  estudiantes: IEstudiante[];
}


export interface IEstudiante {
  id: number;
  primer_nombre_alumno: string;
  segundo_nombre_alumno: string;
  primer_apellido_alumno: string;
  segundo_apellido_alumno: string;
  fecha_nacimiento_alumno: Date;
  rut: string;
  dv: string;
  telefono_contacto: string;
  genero_alumno: string;
  alergico: string;
  vive_con: string;
  enfermedad_cronica: string;
  apoderado_id: number;
  curso_id: number;
  apoderado: IApoderado;
  curso: ICurso[];
}

export interface ICurso {
  id: number;
  nombre: string;
  nivel_grado: string;
  descripcion: string;
}

export interface EstudianteConBoletas {
  estudiante: IEstudiante;
  boletas: BoletaDetalle[];
}
export interface ApoderadoPostRequest {
  apoderados: ApoderadoPost[];
}

export interface ApoderadoPost {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  rut: string;
  dv: string;
  telefono: string;
  correo_electronico: string;
  estado_civil: string;
  nacionalidad: string;
  actividad: string;
  escolaridad: string;
  estudiantes: IEstudiantePost[];
}

export interface IEstudiantePost {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  rut: string;
  dv: string;
  telefono_contacto: string;
  genero: string;
  alergico: string;
  vive_con: string;
  enfermedad_cronica: string;
  cursoId: number;
}

export interface IApoderado2 {
  id: number;
  primer_nombre_apoderado: string;
  segundo_nombre_apoderado: string;
  primer_apellido_apoderado: string;
  segundo_apellido_apoderado: string;
  rut: string;
  dv: string;
  telefono_apoderado: string;
  correo_apoderado: string;
  estado_civil: string;
  nacionalidad: string | null;
  profesion_oficio: string;
  parentesco_apoderado: string;
  direccion: string;
  comuna: string;
}


export interface IEstudiante2 {
  id: number;
  primer_nombre_alumno: string;
  segundo_nombre_alumno: string;
  primer_apellido_alumno: string;
  segundo_apellido_alumno: string;
  fecha_nacimiento_alumno: string;
  fecha_matricula: string;
  rut: string;
  genero_alumno: string;
  vive_con: string;
  prevision_alumno: string;
  autorizacion_fotografias: boolean;
  curso: Array<{ id: number; nombre: string; descripcion: string; nivel_grado: string }>;
}

export interface IUpdateEstudiante {
  primer_nombre_alumno?: string;
  segundo_nombre_alumno?: string;
  primer_apellido_alumno?: string;
  segundo_apellido_alumno?: string;
  fecha_nacimiento_alumno?: string; // Formato ISO string (YYYY-MM-DD)
  fecha_matricula?: string; // Formato ISO string (YYYY-MM-DD)
  genero_alumno?: string;
  alergia_alimento_alumno?: string;
  alergia_medicamento_alumno?: string;
  vive_con?: string;
  enfermedad_cronica_alumno?: string;
  prevision_alumno?: string;
  nacionalidad?: string;
  es_pae?: boolean;
  consultorio_clinica_alumno?: string;
  autorizacion_fotografias?: boolean;
  apto_educacion_fisica?: boolean;
  observaciones_alumno?: string;
  estado_estudiante?: boolean;
}


export interface MorosidadMes {
  mes: number;           // 0–11
  tieneVencidas: boolean;
  cantidad: number;
  montoTotal: number;
}

export interface ResumenApoderadoMorosoDto {
  id: number;
  nombre: string;
  rut: string;
  telefono?: string;
  correo?: string;
  totalBoletasVencidas: number;
  montoTotalVencido: number;
  diasMoraMaximo: number;
  fechaUltimoVencimiento: string;  // o Date
  nivelAlerta: 'verde' | 'amarillo' | 'rojo';
  morosidadPorMes: MorosidadMes[];
}

export interface PorcentajeMesDto {
  mes: string;
  porcentaje: number;
}

export interface TotalPagadoMes {
  mes: string;
  total_pagado: number;
}