import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="backdrop"
        (click)="cancel.emit()"
      >
        <!-- Dialog -->
        <div class="dialog" (click)="$event.stopPropagation()">
          <!-- Icon -->
          <div
            class="icon-circle"
            [style.background]="type === 'danger'
              ? 'color-mix(in srgb, var(--danger) 12%, transparent)'
              : 'color-mix(in srgb, var(--accent) 12%, transparent)'"
          >
            @if (type === 'danger') {
              <svg
                class="icon-svg"
                [style.color]="'var(--danger)'"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            } @else {
              <svg
                class="icon-svg"
                [style.color]="'var(--accent)'"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 3h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
          </div>

          <!-- Title -->
          <h3 class="dialog-title" [style.color]="'var(--text-primary)'">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="dialog-message" [style.color]="'var(--text-secondary)'">
            {{ message }}
          </p>

          <!-- Actions -->
          <div class="dialog-actions">
            <button
              class="btn btn-cancel"
              (click)="cancel.emit()"
            >
              Cancel
            </button>
            <button
              class="btn btn-confirm"
              [style.background]="type === 'danger' ? 'var(--danger)' : 'var(--accent)'"
              (click)="confirm.emit()"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    .dialog {
      width: 420px;
      max-width: calc(100vw - 2rem);
      background: var(--bg-card);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      animation: scaleIn 0.2s ease-out;
    }

    .icon-circle {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .icon-svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .dialog-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .dialog-message {
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0 0 1.75rem;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      justify-content: center;
    }

    .btn {
      padding: 0.5rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: opacity 0.15s ease, transform 0.1s ease;
      line-height: 1.4;
      border: none;
      outline: none;
    }

    .btn:hover {
      opacity: 0.85;
    }

    .btn:active {
      transform: scale(0.97);
    }

    .btn-cancel {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-cancel:hover {
      opacity: 1;
      background: color-mix(in srgb, var(--border-color) 25%, transparent);
    }

    .btn-confirm {
      color: #fff;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.92);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `],
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmLabel = 'Confirm';
  @Input() type: 'danger' | 'warning' = 'warning';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
