import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ServiceItem } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <header class="page-header"><h1>Serviços</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Editar serviço' : 'Novo serviço' }}</h2>
        <label>Nome <input formControlName="name"></label>
        <label>Descrição <textarea formControlName="description"></textarea></label>
        <label>Duração em minutos <input type="number" formControlName="durationMinutes"></label>
        <label>Preço <input type="number" formControlName="price"></label>
        <label class="inline"><input type="checkbox" formControlName="active"> Ativo</label>
        <button type="submit" [disabled]="form.invalid">Salvar</button>
        <button type="button" class="ghost" (click)="reset()">Limpar</button>
      </form>
      <section class="panel">
        <table>
          <thead><tr><th>Nome</th><th>Duração</th><th>Preço</th><th></th></tr></thead>
          <tbody>
            @for (service of services; track service.id) {
              <tr [class.muted]="!service.active">
                <td>{{ service.name }}</td>
                <td>{{ service.durationMinutes }} min</td>
                <td>{{ service.price | currency:'BRL' }}</td>
                <td class="actions">
                  <button type="button" (click)="edit(service)">Editar</button>
                  <button type="button" class="danger" (click)="remove(service)">Desativar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `
})
export class ServicesComponent implements OnInit {
  services: ServiceItem[] = [];
  editingId?: number;
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    durationMinutes: [30, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    active: [true]
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.services().subscribe(services => this.services = services); }
  save() {
    this.api.saveService({ id: this.editingId, ...this.form.getRawValue() }).subscribe(() => { this.reset(); this.load(); });
  }
  edit(service: ServiceItem) {
    this.editingId = service.id;
    this.form.patchValue(service);
  }
  remove(service: ServiceItem) {
    if (service.id) this.api.deleteService(service.id).subscribe(() => this.load());
  }
  reset() {
    this.editingId = undefined;
    this.form.reset({ name: '', description: '', durationMinutes: 30, price: 0, active: true });
  }
}
