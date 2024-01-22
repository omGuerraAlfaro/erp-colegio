import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from '../interfaces/category';
import { CategoriaInterface } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  private api = 'http://localhost:3001/';
  //Todos los datos.
  getAllCategory(): Observable<any> {
    const dataCategoria = this.http.get<CategoryInterface[]>('http://localhost:3001/categorias');
    return dataCategoria;
  }
  getAllSubCategoria(): Observable<any> {
    const dataSubCategoria = this.http.get<CategoryInterface[]>('http://localhost:3001/subcategorias');
    return dataSubCategoria;
  }
  getAllIndicadores(): Observable<any> {
    const dataIndicadores = this.http.get<CategoryInterface[]>('http://localhost:3001/indicadores');
    return dataIndicadores;
  }
  getAllSubIndicadores(): Observable<any> {
    const dataSubIndicadores = this.http.get<CategoryInterface[]>('http://localhost:3001/subindicadores');
    return dataSubIndicadores;
  }
  /* **************************************************************************************************************************************************************** */

  /* **************************************************************************************************************************************************************** */
  //Por Categoria
  //Activos
  /* GET ACTIVOS*/
  getCategoryAct(): Observable<any> {
    const dataCategoriaAct = this.http.get<CategoryInterface[]>('http://localhost:3001/categorias/activos');
    return dataCategoriaAct;
  }

  /* GET SUBCATEGORIA ACTIVOS */
  getCategorySubAct(): Observable<any> {
    const dataSubCategoriaAct = this.http.get<CategoryInterface[]>('http://localhost:3001/subcategorias/activos');
    return dataSubCategoriaAct;
  }
  /* POST SUBCATEGORIA ACTIVOS*/
  addSubCategory(id_subcategoria: string, cod_contable: number, descripcion: string, id_categoria: number): Observable<any> {
    const dataCategoriaAct = this.http.post<CategoriaInterface>('http://localhost:3001/subcategorias/activos/agregar', { id_subcategoria, cod_contable, descripcion, id_categoria });
    return dataCategoriaAct;
  }
  /* DELETE SUBCATEGORIA ACTIVOS*/
  deleteSubCategory(id_subcategoria: string): Observable<any> {
    const dataCategoriaAct = this.http.delete<CategoriaInterface>(`http://localhost:3001/subcategorias/activos/eliminar/${id_subcategoria}`);
    return dataCategoriaAct;
  }
  /* EDIT SUBCATEGORIA ACTIVOS */
  editSubCategory(id_subcategoria: number, cod_contable: number, descripcion: string, id_categoria: number): Observable<any> {
    const dataCategoriaAct = this.http.put<CategoriaInterface>(`http://localhost:3001/subcategorias/activos/editar/${id_subcategoria}`, { id_subcategoria, cod_contable, descripcion, id_categoria });
    return dataCategoriaAct;
  }

  /* ********************************************************* */
  /* GET INDICADORES ACTIVOS*/
  getCategoryIndAct(): Observable<any> {
    const dataIndicadoresAct = this.http.get<CategoryInterface[]>('http://localhost:3001/indicadores/activos');
    return dataIndicadoresAct;
  }
  /* POST INDICADORES  ACTIVOS*/
  addIndicator(id_indicador: string, cod_contable: number, descripcion: string, id_subcategoria: number): Observable<any> {
    const dataIndicadoresAct = this.http.post<CategoriaInterface>('http://localhost:3001/indicadores/activos/agregar', { id_indicador, cod_contable, descripcion, id_subcategoria });
    return dataIndicadoresAct;
  }
  /* DELETE INDICADORES ACTIVOS*/
  deleteIndicator(id_indicador: string): Observable<any> {
    const dataIndicadoresAct = this.http.delete<CategoriaInterface>(`http://localhost:3001/indicadores/activos/eliminar/${id_indicador}`);
    return dataIndicadoresAct;
  }


  /* GET SUBINDICADORES */
  getCategorySubIndAct(): Observable<any> {
    const dataSubIndicadoresAct = this.http.get<CategoryInterface[]>('http://localhost:3001/subindicadores/activos');
    return dataSubIndicadoresAct;
  }
  /* POST SUBINDICADORES */
  addSubIndicator(id_subindicador: string, cod_contable: number, descripcion: string, id_indicador: number): Observable<any> {
    const dataSubIndicadoresAct = this.http.post<CategoriaInterface>('http://localhost:3001/subindicadores/activos/agregar', { id_subindicador, cod_contable, descripcion, id_indicador });
    return dataSubIndicadoresAct;
  }
  /* DELETE SUBINDICADORES */
  deleteSubIndicator(id_subindicador: number): Observable<any> {
    const dataSubIndicadoresAct = this.http.delete<CategoriaInterface>(`http://localhost:3001/subindicadores/activos/eliminar/${id_subindicador}`);
    return dataSubIndicadoresAct;
  }








  /* **************************************************************************************************************************************************************** */

  /* **************************************************************************************************************************************************************** */
  //Pasivos
  getCategoryPas(): Observable<any> {
    const dataCategoriaPas = this.http.get<CategoryInterface[]>('http://localhost:3001/categorias/pasivos');
    return dataCategoriaPas;
  }
  getCategorySubPas(): Observable<any> {
    const dataSubCategoriaPas = this.http.get<CategoryInterface[]>('http://localhost:3001/subcategorias/pasivos');
    return dataSubCategoriaPas;
  }
  getCategoryIndPas(): Observable<any> {
    const dataIndicadoresPas = this.http.get<CategoryInterface[]>('http://localhost:3001/indicadores/pasivos');
    return dataIndicadoresPas;
  }
  getCategorySubIndPas(): Observable<any> {
    const dataSubIndicadoresPas = this.http.get<CategoryInterface[]>('http://localhost:3001/subindicadores/pasivos');
    return dataSubIndicadoresPas;
  }


  /* **************************************************************************************************************************************************************** */

  /* **************************************************************************************************************************************************************** */
  //Patrimonio
  getCategoryPat(): Observable<any> {
    const dataCategoriaPat = this.http.get<CategoryInterface[]>('http://localhost:3001/categorias/patrimonio');
    return dataCategoriaPat;
  }
  getCategorySubPat(): Observable<any> {
    const dataSubCategoriaPat = this.http.get<CategoryInterface[]>('http://localhost:3001/subcategorias/patrimonio');
    return dataSubCategoriaPat;
  }
  getCategoryIndPat(): Observable<any> {
    const dataIndicadoresPat = this.http.get<CategoryInterface[]>('http://localhost:3001/indicadores/patrimonio');
    return dataIndicadoresPat;
  }
  getCategorySubIndPat(): Observable<any> {
    const dataSubIndicadoresPat = this.http.get<CategoryInterface[]>('http://localhost:3001/subindicadores/patrimonio');
    return dataSubIndicadoresPat;
  }
  /* **************************************************************************************************************************************************************** */

  /* **************************************************************************************************************************************************************** */
  //Ingresos
  getCategoryIng(): Observable<any> {
    const dataCategoriaIng = this.http.get<CategoryInterface[]>('http://localhost:3001/categorias/ingresos');
    return dataCategoriaIng;
  }
  getCategorySubIng(): Observable<any> {
    const dataSubCategoriaIng = this.http.get<CategoryInterface[]>('http://localhost:3001/subcategorias/ingresos');
    return dataSubCategoriaIng;
  }
  getCategoryIndIng(): Observable<any> {
    const dataIndicadoresIng = this.http.get<CategoryInterface[]>('http://localhost:3001/indicadores/ingresos');
    return dataIndicadoresIng;
  }
  getCategorySubIndIng(): Observable<any> {
    const dataSubIndicadoresIng = this.http.get<CategoryInterface[]>('http://localhost:3001/subindicadores/ingresos');
    return dataSubIndicadoresIng;
  }
  /* **************************************************************************************************************************************************************** */

  /* **************************************************************************************************************************************************************** */
  //Egresos
  getCategoryEgr(): Observable<any> {
    const dataCategoriaEgr = this.http.get<CategoryInterface[]>(this.api + 'categorias/egresos');
    return dataCategoriaEgr;
  }
  getCategorySubEgr(): Observable<any> {
    const dataSubCategoriaEgr = this.http.get<CategoryInterface[]>(this.api + 'subcategorias/egresos');
    return dataSubCategoriaEgr;
  }
  getCategoryIndEgr(): Observable<any> {
    const dataIndicadoresEgr = this.http.get<CategoryInterface[]>(this.api + 'indicadores/egresos');
    return dataIndicadoresEgr;
  }
  getCategorySubIndEgr(): Observable<any> {
    const dataSubIndicadoresEgr = this.http.get<CategoryInterface[]>(this.api + 'subindicadores/egresos');
    return dataSubIndicadoresEgr;
  }
  /* **************************************************************************************************************************************************************** */



  /* **************************************************************************************************************************************************************** */
  //INSERTAR TABLA LIBRO DE BANCO
  addMovimiento(id: string, id_mov: number, fecha_mov: Date, cod_contable: number, descripcion: string, empresa_asociada: string, salidas_libro: number, entradas_libro: number, saldo_libro: number, id_categoria: number, id_subcategoria: number, id_indicador: number, id_subindicador: number, estado: string): Observable<any> {
    const dataVtiger = this.http.post(this.api + 'libro_banco/agregar', { id, id_mov, fecha_mov, cod_contable, descripcion, empresa_asociada, salidas_libro, entradas_libro, saldo_libro, id_categoria, id_subcategoria, id_indicador, id_subindicador, estado });
    return dataVtiger;
  }

  //OBTENER TABLA LIBRO DE BANCO
  getMovimientos(): Observable<any> {
    const dataVtiger = this.http.get(this.api + 'libro_banco');
    return dataVtiger;
  }

  //ELIMINAR TABLA LIBRO DE BANCO
  deleteMovimiento(id: number): Observable<any> {
    const dataVtiger = this.http.delete(this.api + 'libro_banco/eliminar/' + id);
    return dataVtiger;
  }

  /* ID'S DE MOVIMIENTOS CATEGORIZADOS */
  getMovimientosCategorizados(): Observable<any> {
    const dataVtiger = this.http.get(this.api + 'libro_banco/categorizados');
    return dataVtiger;
  }


  /* **************************************************************************************************************************************************************** */


  /* **************************************************************************************************************************************************************** */
  /* SUMAS? POR CATEGORIA */
  //activos
  getSumActivo(): Observable<any> {
    const sumActivo = this.http.get(this.api + 'libro_banco/getsum/activos');
    return sumActivo;
  }

  //pasivos
  getSumPasivo(): Observable<any> {
    const sumPasivo = this.http.get(this.api + 'libro_banco/getsum/pasivos');
    return sumPasivo;
  }

  //patrimonio
  getSumPatrimonio(): Observable<any> {
    const sumPatrimonio = this.http.get(this.api + 'libro_banco/getsum/patrimonio');
    return sumPatrimonio;
  }

  //ingresos
  getSumIngreso(): Observable<any> {
    const sumIngreso = this.http.get(this.api + 'libro_banco/getsum/ingreso');
    return sumIngreso;
  }

  //egresos
  getSumEgreso(): Observable<any> {
    const sumEgreso = this.http.get(this.api + 'libro_banco/getsum/egreso');
    return sumEgreso;
  } 
  /* **************************************************************************************************************************************************************** */


  /* **************************************************************************************************************************************************************** */
  /* SUMAS? POR SUBCATEGORIA */
  //activos
  getSumSubActivo(): Observable<any> {
    const sumSubActivo = this.http.get(this.api + 'libro_banco/getsum/subcategoria/activos');
    return sumSubActivo;
  }
  //pasivos
  getSumSubPasivo(): Observable<any> {
    const sumSubActivo = this.http.get(this.api + 'libro_banco/getsum/subcategoria/pasivos');
    return sumSubActivo;
  }



}
