import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient, private jwtService: JwtService) {}

    private setHeaders(headers: any = {}): HttpHeaders {
        headers['Accept'] = 'application/json';
        if (this.jwtService.getUserToken()) {
            headers['Authorization'] = `${this.jwtService.getUserToken()}`;
        }
        return new HttpHeaders(headers);
    }

    getCategoriesDetail(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getCetegories?page=${data.page}&perPage=${data.perPage}`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    getCategogiresForProduct(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getCategogiresForProduct?page=${data.page}&perPage=${data.perPage}`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    getAllCategoriesData(): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getAllCetegories`,
            {
                headers: this.setHeaders({})
            }
        );
    }


    getCategoriesCount(): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getCategoriesCount`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    getSubCategoriesCount(): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getSubCategoriesCount`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    getMinorCategoriesCount(): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getMinorCategoriesCount`,
            {
                headers: this.setHeaders({})
            }
        );
    }


    getProductData(): Observable<any> {
        return this.http.get(
            `${environment.base_url}/products/getProductsCount`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    saveCategoriesDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/categories/saveCetegories`, data);
    }

    categoryFiltersDetail (data): Observable<any> {
        const filterCat = {
            name : data.name
        }
        return this.http.post(`${environment.base_url}/categories/filterCetegories?page=${data.page}&perPage=${data.perPage}`, filterCat);
    }

    getSubCategoriesDetail(categoriesID): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getSubCetegories?categoriesID=`+categoriesID,
            {
                headers: this.setHeaders({})
            }
        );
    }

    saveSubCategoriesDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/categories/saveSubCetegories`, data);
    }

    getMinorCategoriesDetail(subCategoriesID): Observable<any> {
        return this.http.get(
            `${environment.base_url}/categories/getMinorCetegories?subCategoriesID=`+subCategoriesID,
            {
                headers: this.setHeaders({})
            }
        );
    }

    saveMinorCategoriesDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/categories/saveMinorCetegories`, data);
    }


    // Products
    getProducts(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/products/getproducts?page=${data.page}&perPage=${data.perPage}`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    getProductsById(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/products/getproductsById?product_id=${data}`,
            {
                headers: this.setHeaders({})
            }
        );
    }

    saveProducts(data): Observable<any> {
        return this.http.post(`${environment.base_url}/products/saveProducts`, data);
    }

    updateProductStatus(data): Observable<any> {
        return this.http.post(`${environment.base_url}/products/updateProductStatus`, data);
    }

    saveOffer(data): Observable<any> {
        return this.http.post(`${environment.base_url}/products/saveOffer`, data);
    }
    getOffer(): Observable<any> {
        return this.http.get(`${environment.base_url}/products/getOffer`);
    }

    // Questions //
    saveQuestionDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/question_answer/saveQuestion`, data);
    }

    getQuestionDetail(): Observable<any> {
        return this.http.get(`${environment.base_url}/question_answer/getQuestions`);
    }

     // Answers //
     saveAnswerDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/question_answer/saveAnswer`, data);
    }

    getSelectedQuestionAnswer(question_id): Observable<any> {
        return this.http.get(`${environment.base_url}/question_answer/getAnswers?question_id=${question_id}`);
    }

    updateDragAnswerDetail(data): Observable<any> {
        return this.http.post(`${environment.base_url}/question_answer/updateDragAnswerDetail`, data);
    }

}
