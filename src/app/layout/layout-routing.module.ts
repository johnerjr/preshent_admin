import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
            { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)},
            { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
            { path: 'question', loadChildren: () => import('./question/question.module').then(m => m.QuestionModule)},
            { path: 'flow-builder', loadChildren: () => import('./form-builder/form-builder.module').then(m => m.FormBuilderModule)},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
