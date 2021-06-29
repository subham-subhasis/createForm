import { Component, OnInit, Output, ViewEncapsulation, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-element-confirmdialog',
  templateUrl: './confirm-Dialog.component.html',
  styleUrls: ['./confirm-Dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogElementComponent implements OnInit {

  @Input() message: string;
  @Input() showButton: boolean;
  @Output() fireModalEvent = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  fireEvent(parameter: string) {
    if (parameter === 'close') {
      this.fireModalEvent.emit('close');
    } else if (parameter === 'yes') {
      this.fireModalEvent.emit('yes');
    }
  }

}
