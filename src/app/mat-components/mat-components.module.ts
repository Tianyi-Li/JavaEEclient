import { NgModule } from '@angular/core';
// added imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule} from '@angular/material/tooltip';

import {MatExpansionModule} from '@angular/material/expansion';

const MaterialComponents = [MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatMenuModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatSelectModule,
  MatTooltipModule,
  MatExpansionModule
];
@NgModule({
  imports: [MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  exports: [MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule
  ]
})
export class MatComponentsModule { }
