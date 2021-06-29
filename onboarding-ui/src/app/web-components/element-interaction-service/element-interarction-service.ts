import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementInterarctionService {

  previewDetails = new BehaviorSubject<any>({});
  constructor() { }
}
