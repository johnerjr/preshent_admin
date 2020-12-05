import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { AddProductsComponent } from './add-products/add-products.component';


const routes: Routes = [
  {
    path : '',
    component : ProductsComponent
  },
  {
    path : 'add-products',
    component : AddProductsComponent
  },
  {
    path : 'add-products/:id',
    component : AddProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
