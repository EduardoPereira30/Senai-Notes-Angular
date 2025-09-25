import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { CadastroScreen } from './user-module/cadastro-screen/cadastro-screen';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => LoginScreen

    }, {
        path: "cadastro",
        loadComponent: () => CadastroScreen

    }


];
