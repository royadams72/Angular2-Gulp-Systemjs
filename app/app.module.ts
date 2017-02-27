import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HomeComponent} from './components/pages/home.component';
import {AboutComponent} from './components/pages/about.component';
import { routing } from './app.routing';
import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ BrowserModule, routing],
  declarations: [ AppComponent,  AboutComponent, HomeComponent],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
