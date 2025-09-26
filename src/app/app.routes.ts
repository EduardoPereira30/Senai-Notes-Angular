import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { CadastroScreen } from './user-module/cadastro-screen/cadastro-screen';
import { FeedScreen } from './feed-screen/feed-screen';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => LoginScreen

    }, {
        path: "cadastro",
        loadComponent: () => CadastroScreen

    }, 
    {
        path: "feed",
        loadComponent: () => FeedScreen
    }
];
