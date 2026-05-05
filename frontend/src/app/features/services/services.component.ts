import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ServiceItem } from '../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <header class="page-header"><h1>Services</h1></header>
    <section class="grid-two">
      <form class="panel" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId ? 'Edit service' : 'New service' }}</h2>
        <label>Name <input formControlName="name"></label>
        <label>Description <textarea formControlName="description"></textarea></label>
        <label>Duration minutes <input type="number" formControlName="durationMinutes"></label>
        <label>Price <input type="number" formControlName="price"></label>
        <label class="inline"><input type="checkbox" formControlName="active"> Active</label>
        <button type="submit" [disabled]="form.invalid">Save</button>
        <button type="button" class="ghost" (click)="reset()">Clear</button>
      </form>
      <section class="panel">
        <table>
          <thead><tr><th>Name</th><th>Duration</th><th>Price</th><th></th></tr></thead>
          <tbody>
            @for (service of services; track service.id) {
              <tr [class.muted]="!service.active">
                <td>{{ service.name }}</td>
                <td>{{ service.durationMinutes }} min</td>
                <td>{{ service.price | currency }}</td>
                <td class="actions">
                  <button type="button" (click)="edit(service)">Edit</button>
                  <button type="button" class="danger" (click)="remove(service)">Deactivate</button>
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
