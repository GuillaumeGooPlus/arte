import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { Routes, RouterModule} from '@angular/router';

import { MaterialModule } from '@angular/material';
import { Ng2PaginationModule} from 'ng2-pagination';
import { SidebarComponent} from './sidebar.component';
import {SharedModule } from '../../shared/shared.module';

@NgModule({
  imports:      [
    // ProductRouting,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    //  FormsModule,
    // MaterialModule,
    // Ng2PaginationModule,
    // ReactiveFormsModule,

  ],
  declarations: [

    SidebarComponent,
    // ProductsComponent,
    // ProductSingleComponent,
  ],
  exports:      [
    SidebarComponent
    // ProductsComponent
  ],
  providers:    [
    // ProductService
  ],
  entryComponents: [ ]
})
export class SidebarModule { }
