import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { JwtService } from "./jwt.service";

@Injectable({
    providedIn: "root"
})
export class FlowBuilderService {
    constructor(private http: HttpClient, private jwtService: JwtService) {}

    private setHeaders(headers: any = {}): HttpHeaders {
        headers["Accept"] = "application/json";
        if (this.jwtService.getUserToken()) {
            headers["Authorization"] = `${this.jwtService.getUserToken()}`;
        }
        return new HttpHeaders(headers);
    }

    getFlows(): Observable<any> {
        return this.http.get(`${environment.base_url}/flow_builder/getFlows`, {
            headers: this.setHeaders({})
        });
    }

    getFlowsCategoryByID(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/flow_builder/getFlowsCategoryByID?flow_id=${data}`,
            {
                headers: this.setHeaders({})
            }
        );
    }


    editFlows(flow_id): Observable<any> {
        return this.http.get(`${environment.base_url}/flow_builder/editFlows?flow_id=${flow_id}`, {
            headers: this.setHeaders({})
        });
    }


    getFlowsCount(): Observable<any> {
        return this.http.get(`${environment.base_url}/flow_builder/getFlowsCount`, {
            headers: this.setHeaders({})
        });
    }

    saveFlow(data): Observable<any> {
        return this.http.post(
            `${environment.base_url}/flow_builder/saveFlow`,
            data
        );
    }


    updateDragFlowsDetail(data): Observable<any> {
        return this.http.post(
            `${environment.base_url}/flow_builder/updateDragFlowsDetail`,
            data
        );
    }

    getFlowQuestions(data): Observable<any> {
        return this.http.post(
            `${environment.base_url}/flow_builder/getQuestions`,
            data
        );
    }


    getSelectedQueAnsByID(data): Observable<any> {
        return this.http.get(
            `${environment.base_url}/flow_builder/getSelectedQueAnsByID?flow_id=${data.flow_id}&que_id=${data.que_id}`,
            {
                headers: this.setHeaders({})
            }
        );
    }


    saveFlowBuilder(data): Observable<any> {
        return this.http.post(
            `${environment.base_url}/flow_builder/saveFlowBuilder`,
            data
        );
    }

}
