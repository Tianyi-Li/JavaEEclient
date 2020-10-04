import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorHomeComponent } from './vendor/vendor-home.component';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { VendorModule } from './vendor/vendor.module';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    VendorModule,
    HttpClientModule,
    MatComponentsModule
  ],
  bootstrap: [VendorHomeComponent]
})
export class AppModule {}
