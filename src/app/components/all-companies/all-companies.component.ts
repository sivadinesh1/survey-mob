import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AllCompaniesComponent implements OnInit {
  @Input() data: any;
  clientsdata: any;
  origClientdata: any;

  constructor(private _cdr: ChangeDetectorRef, private _modalController: ModalController) { }

  ngOnInit() {
    this.clientsdata = this.data;
    this.origClientdata = this.data;
    console.log('object>>>>>> ' + JSON.stringify(this.data));
    console.log('object>>clientsdata>>>> ' + JSON.stringify(this.clientsdata));
    this._cdr.markForCheck();
  }



  closeModal() {
    this._modalController.dismiss();
  }

  onClick(item) {
    this._modalController.dismiss({item});
  }

}


