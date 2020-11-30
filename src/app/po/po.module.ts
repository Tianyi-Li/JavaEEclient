import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { POGeneratorComponent } from './generator/po-generator.component';
import { POViewerComponent } from './viewer/po-viewer.component';

@NgModule({
  declarations: [POGeneratorComponent, POViewerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatComponentsModule
  ]
})
export class PoModule { }
