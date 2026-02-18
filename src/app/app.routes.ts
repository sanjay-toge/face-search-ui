import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResultsComponent } from './pages/results/results.component';
import { SuccessComponent } from './pages/success/success.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'success', component: SuccessComponent }
];
