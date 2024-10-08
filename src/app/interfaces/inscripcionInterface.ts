export interface IInscripcionMatricula {
  id: number;
  id_inscripcion: string;
  primer_nombre_alumno: string;
  segundo_nombre_alumno?: string; 
  primer_apellido_alumno: string;
  segundo_apellido_alumno?: string; 
  rut_alumno: string;
  genero_alumno?: string; 
  fecha_nacimiento_alumno?: Date; 
  curso_alumno?: string; 
  primer_nombre_apoderado: string;
  segundo_nombre_apoderado?: string; 
  primer_apellido_apoderado: string;
  segundo_apellido_apoderado?: string; 
  rut_apoderado: string;
  telefono_apoderado: string;
  correo_apoderado: string;
  parentesco_apoderado: string;
  estado_civil: string;
  profesion_oficio: string;
  direccion: string;
  comuna: string;
  fecha_matricula_inscripcion?: Date; 
}
