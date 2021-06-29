import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { CommonService } from '../services/common.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService,
    public http: HttpClient) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isValidRequestForInterceptor(request.url)) {
      const { url, params } = this.commonService.getUpdateTokenURLandParams();
      if (!params.userId) {
        return next.handle(request);
      }

      return this.http.post(url, params).pipe(
        map(resp => {
          return resp['token'];
        }),
        switchMap(token => {
          if (token) {
            let headers = new HttpHeaders();
            headers = headers.append('Authorization', `Bearer ${token}`);
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('userName', params.userName); 
            request = request.clone({ headers });
            return next.handle(request);
          } else {
            throw new Error("Unable to generate token.");
          }
        })
      )
    }
    return next.handle(request);
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    if (requestUrl.includes('assets') || requestUrl.endsWith('updatesessiongettoken') || 
    requestUrl.includes('savepassword')) {
      return false;
    }
    return true;
  }
}
