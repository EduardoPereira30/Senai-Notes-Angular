import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-screen.html',
  styleUrl: './cadastro-screen.css'
})
export class CadastroScreen {
  newUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router

  ) {

    // quando a tela iniciar.

    // inicia o formulario.
    this.newUserForm = this.fb.group({

      Name: ["", [Validators.required]],
      Email: ["", [Validators.required, Validators.email]],//campo de email obrigatorio.
      Password: ["", [Validators.required]],//campo obrigatorio de senha.
      confirmPassword: ["", [Validators.required]],
    });

  }

  async enter() {

    console.log("Name", this.newUserForm.value.Name);
    console.log("Email", this.newUserForm.value.Email);
    console.log("Password", this.newUserForm.value.Password);

    if (this.newUserForm.value.Email == "") {

      alert("Preecha o email.");
      return;
    }
    if (this.newUserForm.value.Password !== this.newUserForm.value.confirmPassword) {

      alert("Senhas não corresponden.");
      return;

    }

    let response = await fetch("/users", {
      method: "POST", //enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.newUserForm.value.Name,
        email: this.newUserForm.value.Email,
        password: this.newUserForm.value.Password
      })
    });

    if (response.status >= 200 && response.status <= 299) {

      alert("Conta criada com suscesso.");

      let json = await response.json();
      console.log("JSON", json);

      let meuToken = json.accessToken;
      let userId = json.user.id;

      localStorage.setItem("meuToken", meuToken)

      localStorage.setItem("meuId", userId)

      this.newUserForm.value.email = "";

      window.location.href = "users";

    }

  }
}
