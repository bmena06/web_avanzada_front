import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Agrega esta línea
import { DataTablesModule } from 'angular-datatables';
import { productComponent } from './product/product.component';
import { RolComponent } from './rol/rol.component';
import { PaymentComponent } from './payment/payment.component';
import { UserComponent } from './user/user.component';
import { PackageComponent } from './package/package.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';
import { SesionComponent } from './sesion/sesion.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    productComponent,
    RolComponent,
    PaymentComponent,
    UserComponent,
    PackageComponent,
    MenuComponent,
    SesionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, // Agrega HttpClientModule aquí
    DataTablesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
