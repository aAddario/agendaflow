import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Client } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-header"><h1>Clientes</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Editar cliente' : 'Novo cliente' }}</h2>
        <label>Nome <input formControlName="name"></label>
        <label>Telefone <input formControlName="phone"></label>
        <label>Email <input type="email" formControlName="email"></label>
        <label>Observações <textarea formControlName="notes"></textarea></label>
        <button type="submit" [disabled]="form.invalid">Salvar</button>
        <button type="button" class="ghost" (click)="reset()">Limpar</button>
      </form>
      <section class="panel">
        <table>
          <thead><tr><th>Nome</th><th>Telefone</th><th></th></tr></thead>
          <tbody>
            @for (client of clients; track client.id) {
              <tr>
                <td>{{ client.name }}</td>
                <td>{{ client.phone }}</td>
                <td class="actions">
                  <button type="button" (click)="edit(client)">Editar</button>
                  <button type="button" class="danger" (click)="remove(client)">Excluir</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  editingId?: number;
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    notes: ['']
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.clients().subscribe(clients => this.clients = clients); }
  save() {
    this.api.saveClient({ id: this.editingId, ...this.form.getRawValue() }).subscribe(() => { this.reset(); this.load(); });
  }
  edit(client: Client) {
    this.editingId = client.id;
    this.form.patchValue(client);
  }
  remove(client: Client) {
    if (client.id) this.api.deleteClient(client.id).subscribe(() => this.load());
  }
  reset() {
    this.editingId = undefined;
    this.form.reset();
  }
}
