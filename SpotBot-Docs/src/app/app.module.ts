import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormFieldModule } from '@healthcatalyst/cashmere';
import { CashmereModule } from './cashmere.module';
import { AboutModalComponent } from './modals/about-modal/about-modal.component';
import { NewsModalComponent } from './modals/news-modal/news-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsModalComponent,
    AboutModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CashmereModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormFieldModule
  ],
  exports: [CommonModule, CashmereModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
