import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Client } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-header"><h1>Clients</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Edit client' : 'New client' }}</h2>
        <label>Name <input formControlName="name"></label>
        <label>Phone <input formControlName="phone"></label>
        <label>Email <input type="email" formControlName="email"></label>
        <label>Notes <textarea formControlName="notes"></textarea></label>
        <button type="submit" [disabled]="form.invalid">Save</button>
        <button type="button" class="ghost" (click)="reset()">Clear</button>
      </form>
      <section class="panel">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th></th></tr></thead>
          <tbody>
            @for (client of clients; track client.id) {
              <tr>
                <td>{{ client.name }}</td>
                <td>{{ client.phone }}</td>
                <td class="actions">
                  <button type="button" (click)="edit(client)">Edit</button>
                  <button type="button" class="danger" (click)="remove(client)">Delete</button>
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

