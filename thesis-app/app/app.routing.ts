/**
 * Created by Lenka on 27/01/2017.
 */

import { MainComponent } from "./pages/main/main.component";
import { SignUpComponent } from "./pages/signUp/signUp.component";
import { LoginComponent } from "./pages/login/login.component";
import { FirstComponent } from "./pages/first/first.component";

export const routes = [
    { path: "", component: MainComponent },
    { path: "signUp", component: SignUpComponent },
    { path: "login", component: LoginComponent },
    { path: "first", component: FirstComponent, useAsDefault: true }
];

export const navigatableComponents = [
    MainComponent,
    SignUpComponent,
    LoginComponent,
    FirstComponent
];