import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `@if (message) { <p class="error">{{ message }}</p> }`
})
export class ErrorMessageComponent {
  @Input() message = '';
}

