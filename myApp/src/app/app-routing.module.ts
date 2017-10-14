import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { HomeComponent } from "./components/home/home.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AuthGuard } from "./guard/auth.guard";
import { NotAuthGuard } from "./guard/not.guard";

// All the Routes
const appRoutes: Routes = [
	{ path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
	{ path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{	path: '**', component: HomeComponent }
]

@NgModule({
	declarations: [],
	imports: [RouterModule.forRoot(appRoutes)],
	providers: [],
	bootstrap: [],
	exports: [RouterModule]
})

export class AppRoutingModule {}
