import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';


@Component({
  selector: 'app-flujo-efectivo',
  templateUrl: './flujo-efectivo.component.html',
  styleUrls: ['./flujo-efectivo.component.css']
})
export class FlujoEfectivoComponent implements OnInit {

  vars = [
    {
      name: 'Saldo Final del Banco Mes Anterior',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Ingresos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Costos y Gastos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Costos de Explotación',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Gastos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Aumento y Disminución de Activos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Aumento y Disminución de Pasivos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Saldo Final del Banco',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    }
  ]

  catEgreso: any;
  subEgreso: any;
  subSubEgreso: any;
  indEgreso: any;

  catIngreso: any;
  subIngreso: any;
  subSubIngreso: any;
  indIngreso: any;

  catActivo: any;
  subActivo: any;
  subSubActivo: any;
  indActivo: any;

  catPasivo: any;
  subPasivo: any;
  subSubPasivo: any;
  indPasivo: any;

  constructor(public data: CategoriaServiceService) { }

  ngOnInit(): void {
    const myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Saldos Caja',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    //chart 2
    const myChart2 = new Chart('myChart2', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Gasto Mensual',
          data: [14, 12, 13, 11, 12, 13, 14],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    //Egresos
    this.data.getCategoryEgresoValor().subscribe((data) => {
      //categoria
      const { categoria } = data;
      const cat = [categoria];
      cat.map((categoria: { cod: any; nombre_cod: any; valor: any; }) => ({
        cod: categoria.cod,
        nombre_cod: categoria.nombre_cod,
        valor: categoria.valor
      })
      );
      this.catEgreso = cat;

      //subcategoria Egreso
      const { sub_categoria } = categoria;
      const sub = sub_categoria;
      sub.filter((sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) => ({
        cod: sub_categoria.cod,
        nombre_cod: sub_categoria.nombre_cod,
        valor: sub_categoria.valor,
        index_sub: sub_categoria.index_sub
      })
      );
      this.subEgreso = sub;

      //indicadores Egreso
      const dataIndicadores = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; indicador: any }) {
          return subCategoria.indicador.map(function (indicador: { cod: any; nombre_cod: any; valor: any; }) {
            let cod_indicadores = indicador.cod
            let name_indicadores = indicador.nombre_cod
            let valor_indicadores = indicador.valor
            return {
              cod: cod_indicadores,
              nombre_cod: name_indicadores,
              valor: valor_indicadores,
            }
          });
        });
      });;
      this.indEgreso = dataIndicadores.flat();


      //sub indicadores Egreso
      const dataSubIndex = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; valor: any; indicador: any }) {
          let cod_indicadores = subCategoria.cod
          let name_indicadores = subCategoria.nombre_cod
          let valor_indicadores = subCategoria.valor
          return {
            cod: cod_indicadores,
            nombre_cod: name_indicadores,
            valor: valor_indicadores,
          }
        });
      });
      this.subSubEgreso = dataSubIndex;
    });

    //Ingresos
    this.data.getCategoryIngresoValor().subscribe((data) => {
      //categoria
      const { categoria } = data;
      const cat = [categoria];
      cat.map((categoria: { cod: any; nombre_cod: any; valor: any; }) => ({
        cod: categoria.cod,
        nombre_cod: categoria.nombre_cod,
        valor: categoria.valor
      })
      );
      this.catIngreso = cat;

      //subcategoria Ingresos
      const { sub_categoria } = categoria;
      const sub = sub_categoria;
      sub.filter((sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) => ({
        cod: sub_categoria.cod,
        nombre_cod: sub_categoria.nombre_cod,
        valor: sub_categoria.valor,
        index_sub: sub_categoria.index_sub
      })
      );
      this.subIngreso = sub;

      //indicadores Ingresos
      const dataIndicadores = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; indicador: any }) {
          return subCategoria.indicador.map(function (indicador: { cod: any; nombre_cod: any; valor: any; }) {
            let cod_indicadores = indicador.cod
            let name_indicadores = indicador.nombre_cod
            let valor_indicadores = indicador.valor
            return {
              cod: cod_indicadores,
              nombre_cod: name_indicadores,
              valor: valor_indicadores,
            }
          });
        });
      });;
      this.indIngreso = dataIndicadores.flat();


      //sub indicadores Ingresos
      const dataSubIndex = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; valor: any; indicador: any }) {
          let cod_indicadores = subCategoria.cod
          let name_indicadores = subCategoria.nombre_cod
          let valor_indicadores = subCategoria.valor
          return {
            cod: cod_indicadores,
            nombre_cod: name_indicadores,
            valor: valor_indicadores,
          }
        });
      });
      this.subSubIngreso = dataSubIndex;
    });


    this.data.getCategoryActivoValor().subscribe((data) => {
      //Activos
      const { categoria } = data;
      const cat = [categoria];
      cat.map((categoria: { cod: any; nombre_cod: any; valor: any; }) => ({
        cod: categoria.cod,
        nombre_cod: categoria.nombre_cod,
        valor: categoria.valor
      })
      );
      this.catActivo = cat;

      //subcategoria activos
      const { sub_categoria } = categoria;
      const sub = sub_categoria;
      sub.filter((sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) => ({
        cod: sub_categoria.cod,
        nombre_cod: sub_categoria.nombre_cod,
        valor: sub_categoria.valor,
        index_sub: sub_categoria.index_sub
      })
      );
      this.subActivo = sub;

      //indicadores activos
      const dataIndicadores = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; indicador: any }) {
          return subCategoria.indicador.map(function (indicador: { cod: any; nombre_cod: any; valor: any; }) {
            let cod_indicadores = indicador.cod
            let name_indicadores = indicador.nombre_cod
            let valor_indicadores = indicador.valor
            return {
              cod: cod_indicadores,
              nombre_cod: name_indicadores,
              valor: valor_indicadores,
            }
          });
        });
      });;
      this.indActivo = dataIndicadores.flat();


      //sub indicadores activos
      const dataSubIndex = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; valor: any; indicador: any }) {
          let cod_indicadores = subCategoria.cod
          let name_indicadores = subCategoria.nombre_cod
          let valor_indicadores = subCategoria.valor
          return {
            cod: cod_indicadores,
            nombre_cod: name_indicadores,
            valor: valor_indicadores,
          }
        });
      });
      this.subSubActivo = dataSubIndex;
    });


    //Pasivos
    this.data.getCategoryPasivoValor().subscribe((data) => {
      //categoria
      const { categoria } = data;
      const cat = [categoria];
      cat.map((categoria: { cod: any; nombre_cod: any; valor: any; }) => ({
        cod: categoria.cod,
        nombre_cod: categoria.nombre_cod,
        valor: categoria.valor
      })
      );
      this.catPasivo = cat;

      //subcategoria Pasivos
      const { sub_categoria } = categoria;
      const sub = sub_categoria;
      sub.filter((sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) => ({
        cod: sub_categoria.cod,
        nombre_cod: sub_categoria.nombre_cod,
        valor: sub_categoria.valor,
        index_sub: sub_categoria.index_sub
      })
      );
      this.subPasivo = sub;

      //sub indicadores Pasivos
            const dataSubIndex = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; valor: any; index_sub: any; }) {
              return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; valor: any; indicador: any }) {
                let cod_indicadores = subCategoria.cod
                let name_indicadores = subCategoria.nombre_cod
                let valor_indicadores = subCategoria.valor
                return {
                  cod: cod_indicadores,
                  nombre_cod: name_indicadores,
                  valor: valor_indicadores,
                }
              });
            });
            this.subSubPasivo = dataSubIndex;

      //indicadores Pasivos
      const dataIndicadores = sub_categoria.flatMap(function (sub_categoria: { cod: any; nombre_cod: any; index_sub: any; }) {
        return sub_categoria.index_sub.map(function (subCategoria: { cod: any; nombre_cod: any; indicador: any }) {
          return subCategoria.indicador.map(function (indicador: { cod: any; nombre_cod: any; valor: any; }) {
            let cod_indicadores = indicador.cod
            let name_indicadores = indicador.nombre_cod
            let valor_indicadores = indicador.valor
            return {
              cod: cod_indicadores,
              nombre_cod: name_indicadores,
              valor: valor_indicadores,
            }
          });
        });
      });;
      this.indPasivo = dataIndicadores.flat();


      
    });

  }

}


