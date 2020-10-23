import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'
import { CanActivate } from '@angular/router/src/utils/preactivation'
import { FullpageComponent } from './layout/fullpage/fullpage.component'
import { LogoutComponent } from './logout/logout.component'
import { MainpageComponent } from './layout/mainpage/mainpage.component'
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { TipsComponent } from './tips/tips.component'
import { AppIdComponent } from './app-id/app-id.component'
const routes: Routes = [
  {
    path: '',
    // redirectTo: 'maintenance',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {
  //   path: 'app-id',
  //   component: FullpageComponent,
  //   loadChildren: './app-id/app-id.module#AppIdPageModule',
  //   canActivateChild: [AuthGuard]
  // },
  {
    path: 'login',
    component: FullpageComponent,
    loadChildren: './login/login.module#LoginPageModule',
    canActivateChild: [AuthGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'home',
    component: MainpageComponent,
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component: MainpageComponent,
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    component: MainpageComponent,
    loadChildren: './faq/faq.module#FaqPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: MainpageComponent,
    loadChildren: './about/about.module#AboutPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: MainpageComponent,
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'selfassassment',
    component: MainpageComponent,
    loadChildren: './assassment/assassment.module#AssassmentModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  },
  { path: 'history', 
    loadChildren: './history/history.module#HistoryPageModule' 
  },
  { path: 'orang-serumah', loadChildren: './orang-serumah/orang-serumah.module#OrangSerumahPageModule' },
  { path: 'app-id', loadChildren: './app-id/app-id.module#AppIdPageModule' },
  { path: 'inbox', loadChildren: './inbox/inbox.module#InboxPageModule' }




]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
