import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { POGeneratorComponent } from './po-generator.component';

@NgModule({
  declarations: [POGeneratorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatComponentsModule
  ]
})
export class PoModule { }
