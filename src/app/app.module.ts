import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { VendorModule } from './vendor/vendor.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    VendorModule,
    HttpClientModule,
    MatComponentsModule
  ],
  bootstrap: [AppComponent],
  declarations: [AppComponent, HomeComponent]
})
export class AppModule {}
