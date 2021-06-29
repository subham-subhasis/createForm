import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './web-components/registration/registration.component';
import { ConfigurationComponent } from './web-components/configuration/configuration.component';
import { SetPasswordComponent } from './web-components/set-password/set-password.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'newPassword', component: SetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
