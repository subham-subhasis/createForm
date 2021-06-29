import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { notFound, customMessages } from '../utils/constants';
import { AlertbarService } from '../alertbar/service/alertbar.service';

@Injectable()
export class DataService {
    baseUrl: string;

    constructor(private http: HttpClient, private alertService: AlertbarService) {
    }

    externalGet(url: string): Observable<any> {
        //return this.http.get(url).pipe(catchError(err => of(err.status === notFound ? null : {})));
        return this.http.get(url).pipe(catchError(err => of(err.status === notFound ? this.alertService.show('error', 'Error',  customMessages.errorMessage404, 4000) : this.alertService.show('error', 'Error',  customMessages.errorMessage, 4000))));
    }
}
