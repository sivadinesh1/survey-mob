
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { NullToQuotePipe } from './utils/pipes/null-quote.pipe';
import { NullToZeroPipe } from './utils/pipes/null-zero.pipe';
import { NullToDashPipe } from './utils/pipes/null-dash.pipe';
import { NullToNaPipe } from './utils/pipes/null-na.pipe';
import { CheckBooleanPipe } from './utils/pipes/check-boolean.pipe';

import { CustomPipe } from './utils/pipes/keys.pipe';
import { UrlidPipe } from './utils/pipes/url-id.pipe';
import { SafePipe } from './utils/pipes/safe-html.pipe';
import { EscapeHtmlPipe } from './utils/pipes/keep-html.pipe';
import { DayWeekPipe } from './utils/pipes/day-week.pipe';


const components = [

  NullToQuotePipe,
  NullToZeroPipe,
  NullToDashPipe,
  NullToNaPipe,
  CheckBooleanPipe,
  
  CustomPipe,

  UrlidPipe,
  SafePipe,
  EscapeHtmlPipe,
  DayWeekPipe,
  
];


@NgModule({
  declarations: [...components,

     ],
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // IonicModule,

  ],
  exports: [
     ...components, 
    //  IonicModule,
  ],
  entryComponents: [

  ]
})
export class SharedModule { }

