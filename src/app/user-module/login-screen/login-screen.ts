import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {

    this.loginForm = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]]

    });

  }

  async onLoginClick() {


    console.log("Email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

    if (this.loginForm.value.email == "") {

      alert("O Campo de e-mail é obrigatório.")
      return;
    }

    if (this.loginForm.value.password == "") {
      alert("O Campo de Senha é obrigatório.")
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
    });

    console.log("STATUS CODE", response.status)

    if (response.status >= 200 && response.status <= 299) {

      let json = await response.json();

      console.log("JSON", json)

      let meuToken = json.accessToken;
      let meuId = json.user.id;

      localStorage.setItem("meuToken", meuToken);
      localStorage.setItem("meuId", meuId);

      window.location.href = "feed"



    }

    this.cd.detectChanges();
  }
}