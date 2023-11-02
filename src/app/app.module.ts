import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms'; // Asegúrate de tener esta importación
import {DataTablesModule} from 'angular-datatables';
import { productComponent } from './product/product.component';
import { RolComponent } from './rol/rol.component';
import { PaymentComponent } from './payment/payment.component';
import { UserComponent } from './user/user.component';
import { PackageComponent } from './package/package.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavComponent,
    productComponent,
    RolComponent,
    PaymentComponent,
    UserComponent,
    PackageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent] // Cambia el bootstrap a AppComponent
})
export class AppModule { }
