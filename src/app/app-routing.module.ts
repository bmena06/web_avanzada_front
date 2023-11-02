import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Asegúrate de importar LoginComponent desde la ubicación correcta.
import { HomeComponent } from './home/home.component';
import { productComponent } from './product/product.component';
import {RolComponent} from './rol/rol.component';
import {PaymentComponent} from './payment/payment.component';
import {UserComponent} from './user/user.component';
import {PackageComponent} from './package/package.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product', component: productComponent },
  { path: 'rol', component: RolComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'user', component:  UserComponent},
  { path: 'package', component: PackageComponent}

  // Otras rutas pueden ir aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
