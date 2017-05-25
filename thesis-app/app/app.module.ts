import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule }from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule } from "nativescript-telerik-ui/sidedrawer/angular"

import { SocketConnection } from "./shared/sdk/sockets/socket.connections";
import { SocketDriver } from "./shared/sdk/sockets/socket.driver";
import { InternalStorage } from "./shared/sdk/storage/storage.swaps";

import { SDKModels, LoopBackAuth, JSONSearchParams } from "./shared/sdk/index";

import { routes, navigatableComponents } from "./app.routing";
import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        AppComponent,
        ...navigatableComponents
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
        NativeScriptUISideDrawerModule
    ],
    providers: [
        SocketConnection,
        SocketDriver,
        SDKModels,
        LoopBackAuth,
        InternalStorage,
        JSONSearchParams
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
