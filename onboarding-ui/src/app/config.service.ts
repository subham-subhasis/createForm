import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {
    constructor(private httpClient: HttpClient, private translateService: TranslateService) { }
    // tslint:disable-next-line: member-ordering
    static localeId = '';
    // tslint:disable-next-line: member-ordering
    static urls: any = {};
    // tslint:disable-next-line: ban-types
    properties: Object;
    tokenData = { sessionToken: ''} as any;

    loadBootstrapConfiguration() {
        let sessionToken = sessionStorage.getItem('sessionToken');
        return new Promise((resolve, reject) => {
            this.httpClient.get('./assets/json/applicationConfiguraionElement.json').subscribe((response: any) => {
                if (environment.production) {
                    ApiConfigService.urls = response.prod;
                    const encryptedToken = this.decryptData(sessionToken);
                    this.tokenData.sessionToken = encryptedToken;
                } else {
                    ApiConfigService.urls = response.dev;
                    this.tokenData.sessionToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzeXN0ZW0iLCJhdWQiOiJsb2NhbGhvc3QiLCJpc3MiOiJyb2NmbSIsImV4cCI6MTYxMDk1NzEwMn0.pEjIpmn-pFkoSqtlhPR1cRU84PV9CcC8pZ7Hmghm9MGhi7B0D5dqxk1PHfhcjID4ktmQkDwyF7_Ra7MoT_0G5d3odIjwx_WLDpTA0kDyqHcmuoJMFKsIFUNs7VbKtQX_prXThsII7vtgc8aPzmQAtegSPfpT7UmvWPyRcbZ0AKMIde5ZZ9JA03BakQWp2FBSX2CwjchYwRN3ntnQIuV_xVAqoowGelriInaqxtDuQZqBzm5GcDyBdHVRmIjDekZVvHSybesPBuq3DOw97rpe13bSme0PUbyaYnT5CpOgT3BohR4Pi2UGLzlQGVYlfaFxShDKgKas_99ebPcgzNxwCQ';
                }
                if (response) {
                    resolve(true);
                } else {
                    reject('error');
                }
            });
        });
    }

    getToken(): string {
        return this.tokenData.sessionToken;
    }

    decryptData(data: any) {
        return data && data !== 'null' ? JSON.parse(window.atob(data)) : null;
    }

    setLanguage() {
        this.httpClient.get('./assets/json/propertyFile.json').subscribe((data) => {
            this.properties = data;
            let locale: string = data['locale'];
            locale = locale.indexOf('-') > 0 ?
                locale.substring(0, locale.indexOf('-')) : locale;
            const readFromProperty: boolean = data['readFromProperty'];
            if (readFromProperty) {
                ApiConfigService.localeId = locale;
                this.translateService.setDefaultLang(locale);
            }
        });
    }
}
