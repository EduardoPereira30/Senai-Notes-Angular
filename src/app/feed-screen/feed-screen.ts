import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';



interface INota {


  titulo: string,
  userId: string,
  id: "",
  tags: string[],
  descricao: string;
  date: string,
  imageUrl: string

}


@Component({
  selector: 'app-feed-screen',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './feed-screen.html',
  styleUrl: './feed-screen.css'
})

export class FeedScreen {

  tituloInput = new FormControl();
  textinput = new FormControl()

  novaNota: INota = { titulo: "", userId: "meuId", id: "", descricao: "", tags: [], date: new Date().toISOString(), imageUrl: "" };
  notaSelecionada: INota;
  notas: INota[];
  darkMode: boolean = false;

  arquivoImagem: File | null = null;  // mantém o arquivo selecionado
  urlImagem = "";

  datanota = this.novaNota.date;
  tagSelecionada: string;
  tagsDisponiveis = [
    "Dev",
    "Cooking",
    "Work",
    "Home",
    "Personal"
  ];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {


    this.notaSelecionada = null!;
    this.notas = [];
    this.tagSelecionada = "";

  }

  ngOnInit() {
    //buscar dados da api

    this.getNotas();

    let darkModeLocalStorage = localStorage.getItem("darkMode");

    if (darkModeLocalStorage == "true") {

      this.darkMode = true;
      document.body.classList.toggle("darkMode", this.darkMode)
    }

  }

  async criarNota() {

    const nomeNota = prompt("Qual o nome da Nota?")

    if (!nomeNota) {

      alert("Criar nome descente")
      return

    }

    const novoChatObj = {

      titulo: nomeNota,
      UserId: localStorage.getItem("meuId"),
      tags: [],
      descricao: "",
      imageUrl: "",

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

      // response = response.filter(chat => chat.userId == userId);


      this.notas = response as []

      this.cd.detectChanges();
    }


  }
  async onNoteClick(noteClicado: INota) {

    console.log("nota clicada"), noteClicado
    this.notaSelecionada = noteClicado
    this.tituloInput.setValue(this.notaSelecionada.titulo)
    this.textinput.setValue(this.notaSelecionada.descricao)

    if (this.notaSelecionada.tags != null && this.notaSelecionada.tags.length > 0) {
      this.tagSelecionada = this.notaSelecionada.tags[0]
    } else {
      this.tagSelecionada = "";

    }
    //logca para buscar mensagens

    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas?notaId=" + this.notaSelecionada.userId, {


    }

    ))

    this.cd.detectChanges();

  }

  async SalvaNote() {
    this.notaSelecionada.titulo = this.tituloInput.value;
    this.notaSelecionada.tags = [this.tagSelecionada];
    this.notaSelecionada.descricao = this.textinput.value;
    this.notaSelecionada.imageUrl = this.urlImagem



    let response = await firstValueFrom(this.http.put("http://localhost:3000/notas/" + this.notaSelecionada.id, this.notaSelecionada)) as INota[];

    if (response) {

      console.log("atualizado", response);
      let userId = localStorage.getItem("meuId");
      response = response.filter(tagSelecionada => tagSelecionada.id == userId);

      this.cd.detectChanges();
    }
  }

  LigarDesligarDarkMode() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle("darkMode", this.darkMode);

    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  async deleteNote() {

    let confirma = confirm("tem certeza que deseja deletar a nota " + this.notaSelecionada.titulo + " ?")
    if (!confirma) {
      return;

    }

    try {
      let deleteResponse = await firstValueFrom(this.http.delete("http://localhost:3000/notas/" + this.notaSelecionada.id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("meuToken")
        }
      }
      )) as INota;

    } catch (error) {
      console.log("Erro ao deletar nota: " + error);
    }

    this.cancelarNota();
    this.getNotas();
    this.cd.detectChanges();
  }

  async cancelarNota() {
    this.notaSelecionada = null!
    this.cd.detectChanges();

  }

  definirImagem(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('Selecione uma imagem.');
      return;
    }

    const file = input.files[0];

    // Validações simples (opcional, mas recomendado)
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const tamanhoMaxMB = 5;

    if (!tiposPermitidos.includes(file.type)) {
      alert('Tipo inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > tamanhoMaxMB * 1024 * 1024) {
      alert(`Arquivo muito grande (máx. ${tamanhoMaxMB}MB).`);
      return;
    }

    // Libera a URL anterior (evita vazamento de memória)
    if (this.urlImagem) {
      URL.revokeObjectURL(this.urlImagem);
    }

    // Guarda o arquivo e gera a URL local para preview imediato
    this.arquivoImagem = file;
    this.urlImagem = URL.createObjectURL(file);

    this.cd.detectChanges();
  }

}

