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

  emailErrorMessage: string;
  passwordErrorMessage: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // Quando a tela iniciar

    this.loginForm = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]]

    });

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";

  }

  async onLoginClick() {

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";

    console.log("email", this.loginForm.value.email);
    console.log("password", this.loginForm.value.password);

    if (this.loginForm.value.email == "") {

      this.emailErrorMessage = "O campo de email é obrigatorio";
      return;
    }

    if (this.loginForm.value.password == "") {

      this.passwordErrorMessage = "O campo de senha é obrigatorio";
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"

      },
      body: JSON.stringify({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password

      })
    });

    console.log("STATUS CORE", response.status);

    if (response.status >= 200 && response.status <= 299) {

      let json = await response.json();

      console.log("JSON", json);

      let meuToken = json.accessToken;
      let userId = json.user.id;

      localStorage.setItem("meuToken", meuToken);
      localStorage.setItem("meuId", userId);

      window.location.href = "feed";

    }

    this.cd.detectChanges();

  }

}



