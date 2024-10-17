export interface BoletaDetalle {
  id: number;
  apoderado_id: number;
  rut_estudiante: string;
  rut_apoderado: string;
  pago_id: null | number;
  estado_id: number;
  detalle: string;
  fecha_vencimiento: string;
  subtotal: string;
  iva: string;
  total: string;
  descuento: string;
  nota: string;
  estudiante_id: number;
}

export interface IBoleta {
  boletas: {
    [key: string]: BoletaDetalle[];
  };
}


export interface UpdateBoleta {
  idBoleta: number;
  estado: number;
  idPago: string;
}

export interface UpdateBoletaDto {
  apoderado_id?: number;
  estudiante_id?: number;
  rut_estudiante?: string;
  rut_apoderado?: string;
  pago_id?: string;
  estado_id?: number;
  detalle?: string;
  fecha_vencimiento?: Date;
  total?: number;
  estado_boleta?: boolean;
}
