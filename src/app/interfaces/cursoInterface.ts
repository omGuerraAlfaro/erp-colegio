export interface CursoDetalle {
    id: number;
    nombre: string;
    descripcion: string;
    nivel_grado: string;
    profesorConnection: {
        primer_nombre: string;
        segundo_nombre: string;
        primer_apellido: string;
        segundo_apellido: string;
        rut: string;
        dv: string;
        telefono: string;
        correo_electronico: string;
    }
}

export interface ICurso {
    cursos: {
        [key: string]: CursoDetalle[];
    };
}


export interface CursoEstudianteDetalle {
    id: number;
    nombre: string;
    descripcion: string;
    nivel_grado: string;
    estudiantes: {
        primer_nombre: string;
        segundo_nombre: string;
        primer_apellido: string;
        segundo_apellido: string;
        rut: string;
        dv: string;
        telefono_contacto: string;
        correo_electronico: string;
        genero: string;
    }
}

export interface ICursoEstudiante {
    cursos: {
        [key: string]: CursoEstudianteDetalle[];
    };
}