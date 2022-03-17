import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [

{ path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
{ path: 'stream/:id', loadChildren: () => import('./pages/tranglivestream/tranglivestream.module').then(m => m.TranglivestreamModule) },
{ path: 'genre/:id', loadChildren: () => import('./pages/gamegenre/gamegenre.module').then(m => m.GamegenreModule)},
{ path: 'genre', loadChildren: () => import('./pages/gamegenre/gamegenre.module').then(m => m.GamegenreModule)},
{ path: 'createStream', loadChildren: () => import('./pages/create-stream/create-stream.module').then(m => m.CreateStreamModule) },
{ path: 'infor-profile', loadChildren: () => import('./pages/infor-profile/infor-profile.module').then(m => m.InforProfileModule) },
{ path: 'view-history', loadChildren: () => import('./pages/view-history/view-history.module').then(m => m.ViewHistoryModule) },
{ path: 'my-follow', loadChildren: () => import('./pages/my-follow/my-follow.module').then(m => m.MyFollowModule) },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
