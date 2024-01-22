import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VtigerService {

  constructor(private http: HttpClient) { }
  
  private API_URL = 'http://localhost:3000/';
  //Movimientos.
  getMovInfo(): Observable<any> {
    const dataVtiger = this.http.get(this.API_URL + 'query');
    return dataVtiger;
  }  
  
  getInvoices(excludeInvoiceNumbers: string[]): Observable<any> {
    const excludeParam = excludeInvoiceNumbers.join(',');
    console.log(excludeParam);    
    return this.http.get(`${this.API_URL}invoicesuppress?exclude=${excludeParam}`);
  }
  

}
