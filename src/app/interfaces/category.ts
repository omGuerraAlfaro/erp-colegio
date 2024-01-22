export interface CategoryInterface {
    cod: number;
    nombre_cod: string;
    valor: number;
    selected: boolean;
    sub_categoria: [
        {
            cod: number;
            nombre_cod: string;
            valor: number;
            selected: boolean;
            index_sub: [
                {
                    cod: number;
                    nombre_cod: string;
                    valor: number;
                    selected: boolean;
                    indicador: [
                        {
                            cod: number;
                            nombre_cod: string;
                            valor: number;
                            selected: boolean;
                        }
                    ]
                }
            ]
        }
    ];

}
