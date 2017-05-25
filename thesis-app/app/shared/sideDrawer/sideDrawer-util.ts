import { Router } from "@angular/router";

export class SideDrawerNavigation {
    private router: Router;
    
    constructor(router: Router){
        this.router = router;
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