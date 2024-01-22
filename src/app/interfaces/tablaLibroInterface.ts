export interface TablaLibroInterface {
    id_libro: number;
    id_mov: string;
    fecha_mov: string;
    cod_contable: number;
    descripcion: string;
    empresa_asociada: string;
    salidas_libro: number;
    entradas_libro: number;
    saldo_libro: number;
    id_categoria: number;
    id_subcategoria: number;
    id_indicador: number;
    id_subindicador: number;
}