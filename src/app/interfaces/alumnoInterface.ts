export interface AlumnoInterface {
    id: string;
    rut: string;
    nombre: string;
    curso: string;

}


export interface EstudianteCierre {
    estudianteId: number;
    notaFinalParcial: number | null;
    notaFinalTarea: number | null;
    notaFinal: number | null;
}

export interface CierreSemestreRequest {
    cursoId: number;
    asignaturaId: number;
    semestreId: number;
    estudiantes: EstudianteCierre[];
}
