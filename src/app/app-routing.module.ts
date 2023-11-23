import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Asegúrate de importar LoginComponent desde la ubicación correcta.
import { HomeComponent } from './home/home.component';
import { productComponent } from './product/product.component';
import {RolComponent} from './rol/rol.component';
import {PaymentComponent} from './payment/payment.component';
import {UserComponent} from './user/user.component';
import {PackageComponent} from './package/package.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'product', component: productComponent, canActivate: [AuthGuard]},
  { path: 'rol', component: RolComponent, canActivate: [AuthGuard]},
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard]},
  { path: 'user', component:  UserComponent, canActivate: [AuthGuard]},
  { path: 'package', component: PackageComponent, canActivate: [AuthGuard]}

  // Otras rutas pueden ir aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
