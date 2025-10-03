import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INota {


  titulo: string;
  userId: string;
  id: ""

}


@Component({
  selector: 'app-feed-screen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feed-screen.html',
  styleUrl: './feed-screen.css'
})

export class FeedScreen {

  notaSelecionada: INota;
  notas: INota[];
  darkMode: boolean = false;
  novaNota: INota = { titulo: "", userId: "meuId", id: "" };

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {

    this.notaSelecionada = null!;
    this.notas = [];

  }

  ngOnInit() {
    //buscar dados da api

    this.getNotas();

    let darkModeLocalStorage = localStorage.getItem("darkMode");

    if (darkModeLocalStorage == "true") {

      this.darkMode = true;
      document.body.classList.toggle("darkmode", this.darkMode)
    }

  }

  async criarNota() {

    const nomeNota = prompt("qual o nome da Nota?")

    if (!nomeNota) {

      alert("criar nome valido")
      return

    }

    const novoChatObj = {

      titulo: nomeNota,
      userId: localStorage.getItem("meuId"),

    }

    let novoChatResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INota;

    await this.getNotas();

    this.cd.detectChanges();


  };

  async getNotas() {

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas", {
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("meuToken")


      }

    })) as INota[];

    if (response) {

      console.log("notas", response);

      let userId = localStorage.getItem("meuId");

      response = response.filter(chat => chat.userId == userId);


      this.notas = response as []

      this.cd.detectChanges();
    }


  }
  async onNoteClick(noteClicado: INota) {

    console.log("nota clicada"), noteClicado
    this.notaSelecionada = noteClicado
    //logca para buscar mensagens

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas?Id=" + this.notaSelecionada.id, {
    }

    ))

    this.cd.detectChanges();

  }

  LigarDesligarDarkMode() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle("dark Mode", this.darkMode);

    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}

