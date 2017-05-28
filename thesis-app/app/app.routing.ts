/**
 * Created by Lenka on 27/01/2017.
 */

import { MainComponent } from "./pages/main/main.component";
import { SignUpComponent } from "./pages/signUp/signUp.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ListOfGamesComponent } from "./pages/listOfGames/listOfGames.component";
import { UpdateProfileComponent } from "./pages/updateProfile/updateProfile.component";
import { AchievementsComponent } from "./pages/achievements/achievements.component";
import { ProjectsComponent } from "./pages/projects/projects.component";

export const routes = [
    { path: "", component: MainComponent },
    { path: "signUp", component: SignUpComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent },
    { path: "listOfGames", component: ListOfGamesComponent},
    { path: "updateProfile", component: UpdateProfileComponent },
    { path: "achievements", component: AchievementsComponent },
    { path: "projects", component: ProjectsComponent }
];

export const navigatableComponents = [
    MainComponent,
    SignUpComponent,
    LoginComponent,
    ProfileComponent,
    ListOfGamesComponent,
    UpdateProfileComponent,
    AchievementsComponent,
    ProjectsComponent
];