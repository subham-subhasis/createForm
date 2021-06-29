import { Injectable, EventEmitter } from '@angular/core';
import { DataService } from './data.service.ts';
import { validationPatterns } from '../utils/constants';
import { AlertbarService } from '../alertbar/service/alertbar.service';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from 'src/app/config.service';
import { SessionInfo } from '../interceptor/sessionInfo';
@Injectable()
export class CommonService {
    mainView = false;
    noAccessFlag = false;
    updateCards = new EventEmitter();
    toastMessages = new EventEmitter();
    gdprModelActions = new EventEmitter();
    showMaster = new EventEmitter();
    updateSubHeader = new EventEmitter();
    user: any = { userName: '', userId: ''};
    changePwdUrl = '';
    baseUrl = '';
    isForcePassword = false;

    public userId: number;
    public userName: string;
    
    constructor( private alertbar: AlertbarService,private apiConfigService:ApiConfigService ) { }

    getUniqueObjectFromArr( arr: any, param: any, valToCheck) {
        return arr.filter( val => val[param] === valToCheck)[0];
    }

    getUniqueArrFromNestedObject( arr: any, param: any, param2: any, valToCheck) {
        return arr.filter( val => val[param][param2] === valToCheck);
    }

    getUniqueArrayFromDiffArrStringMatch( arr: any, param: any, valToCheck) {
        return arr.filter( val => val[param].toLowerCase() === valToCheck.toLowerCase());
    }

    getFieldIndexSubmit(arr: any, attr: any, value: any) {
        for (let k = 0; k < arr.length; k++) {
            if (arr[k][attr] === value) {
                return k;
            }
        }
    }

    generateDynamicUrl(href: string) {
        let path = '';
        const split_one = href.split(':');
        const split2 = split_one[split_one.length - 1].split('/');
        if (split2.length > 0) {
          path = split2[1];
        }
        return path;
      }

    removeFromArrByAttribute(arr: any, attr: any, value: any) {
        let i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    showSuccessToaster( msg: any ) {
        this.alertbar.show('success', 'Success', msg, 4000);
    }
    showErrorToaster(  msg: any) {
        this.alertbar.show('error', 'Error',  msg, 4000);
    }
    showWarningToaster( msg: any ) {
        this.alertbar.show('warning', 'Warning',  msg , 4000);
    }

    hideToaster() {
        this.alertbar.show('none', 'NONE',  '' , 4000);
    }

    encryptData(data) {
        return data && data !== 'null' ? window.btoa(JSON.stringify(data)) : null;
    }

    decryptData(data) {
        return data && data !== 'null' ? JSON.parse(window.atob(data)) : null;
    }

    keepInSession(key, data) {
        const encData = this.encryptData(data);
        sessionStorage.setItem(key, encData);
    }

    getFromSession(key) {
        return this.decryptData(sessionStorage.getItem(key));
    }

    removeFromSession(key) {
        sessionStorage.removeItem(key);
    }

    keepInLocal(key, data) {
        const encData = this.encryptData(data);
        localStorage.setItem(key, encData);
    }

    getFromLocal(key) {
        return this.decryptData(localStorage.getItem(key));
    }

    removeFromLocal(key) {
        localStorage.removeItem(key);
    }

    File(dataUrl: string, fileName: string) {
        const arr = dataUrl.split(','); const mime = arr[0].match(/:(.*?);/)[1]; const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    }

    dataURItoBlob(dataURI: any) {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);
        const byteString = window.atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/jpeg' });
        return blob;
    }

    convertToPdfBlobUrl(data: any) {
        const binary = atob(data.replace(/\s/g, ''));
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return URL.createObjectURL(new Blob([view], { type: 'application/pdf' }));
    }

    getNumberFromString(value: string) {
        if (value) {
            const data = value.match(validationPatterns.extractNumber);
            return data ? parseFloat(data[0]) : null;
        }
        return null;
    }

    isNumber(value: any) {
        return value ? !isNaN(value) : false;
    }

    public getUpdateTokenURLandParams() {
        const params = new SessionInfo();
        params.productIdentifier = this.apiConfigService.properties['productIdentifier'];
        params.userId = this.userId;
        params.userName = this.userName;
        let url: string = '';
        if (environment.production) {
            const href: string = window.location.href;
            const path = this.generateDynamicUrl(href);
            const host = window.location.host;
            const protocol = this.apiConfigService.properties['protocol'];
            url = `${protocol}://${host}/${path}/ppservices/common/updatesessiongettoken`;
            //url = 'http://localhost:8090/PartnerManagement/ppservices/common/updatesessiongettoken';
        } else {
            url = 'http://localhost:8090/PartnerManagement/ppservices/common/updatesessiongettoken';
        }
        return { url, params };
    }

}
