import { Routes } from '@angular/router';
import { MemberComponent} from './member/member.component';
import { EventsComponent } from './events/events.component';
import { ToolsComponent } from './tools/tools.component';
import { PublicationsComponent } from './publications/publications.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'members', component: MemberComponent, title: 'Members', canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, title: 'Events', canActivate: [authGuard] },
  { path: 'tools', component: ToolsComponent, title: 'Tools', canActivate: [authGuard] },
  { path: 'publications', component: PublicationsComponent, title: 'Publications', canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, title: 'Profile', canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, title: 'Settings', canActivate: [authGuard] },
  { path: '', redirectTo: 'members', pathMatch: 'full' },
  { path: '**', redirectTo: 'members' }
];
