import { Router } from "@angular/router";

export class SideDrawerNavigation {
    constructor(private router: Router){
    }

    public profile(){
        this.router.navigate(["profile"]);
    }

    public listOfGames(){
        this.router.navigate(["listOfGames"]);
    }

    public achievements() {
        this.router.navigate(["achievements"]);
    }

    public projects() {
        this.router.navigate(["projects"]);
    }
}