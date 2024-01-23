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
  }
  
  export interface IBoleta {
    boletas: {
      [key: string]: BoletaDetalle[];
    };
  }
  