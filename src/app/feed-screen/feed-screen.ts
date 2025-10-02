import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INote {

  chatTitle: string;
  id: number;
  userId: string;

}


@Component({
  selector: 'app-feed-screen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feed-screen.html',
  styleUrl: './feed-screen.css'
})

export class FeedScreen {

  notes: INote[];
  noteSelecionado: INote;
  menssagens: INote[];
  darkMode: boolean = false;


  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    //inicialização de variaveis

    this.notes = [];
    this.noteSelecionado = null!;
    this.menssagens = [];
  }

  LigarDesligarDarkMode() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle("dark Mode", this.darkMode);

    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  ngOnInit() {

    this.getNotes();

    let darkModeLocalStorage = localStorage.getItem("darkMode");

    if (darkModeLocalStorage == "true") {

      this.darkMode = true;
      document.body.classList.toggle("darkmode", this.darkMode)
    }


  }
  async getNotes() {
    let response = await firstValueFrom(this.http.get(" https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    })) as [];
  }

}

