import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHomeComponent } from './product-home.component';
import { ProductDetailComponent } from './product-detail.component';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteDialogComponent} from '../deletedialog/delete-dialog.component';


@NgModule({
  declarations: [ProductHomeComponent, ProductDetailComponent, DeleteDialogComponent],
  entryComponents: [DeleteDialogComponent],
  imports: [
    CommonModule,
    MatComponentsModule,
    ReactiveFormsModule,
  ]
})
export class ProductModule { }
