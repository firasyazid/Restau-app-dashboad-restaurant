import { Routes } from '@angular/router';
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { RestaurantInfoComponent } from 'src/app/components/restaurant-info/restaurant-info.component';
import { CategoryFormComponent } from 'src/app/components/category-form/category-form.component';
import { DishComponent } from 'src/app/components/dish/dish.component';


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      }, 
      {
          path: 'restaurant-info',
          component: RestaurantInfoComponent,

       },
       { 
            path : 'category-form',
            component : CategoryFormComponent

       },
       {
           path : 'plats',
           component : DishComponent
       },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },
    ],
  },
];
