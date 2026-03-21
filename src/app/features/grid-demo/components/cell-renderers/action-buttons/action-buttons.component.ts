import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="action-buttons">
      <!-- View -->
      <button
        class="action-btn view-btn"
        (click)="onView($event)"
        title="View Details">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </button>
      <!-- Edit -->
      <button
        class="action-btn edit-btn"
        (click)="onEdit($event)"
        title="Edit">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </button>
      <!-- Delete -->
      <button
        class="action-btn delete-btn"
        (click)="onDelete($event)"
        title="Delete">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: var(--radius-xs);
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.2s ease, background-color 0.2s ease;
      padding: 0;
    }

    .action-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }

    .view-btn:hover {
      color: var(--accent);
      background-color: color-mix(in srgb, var(--accent) 10%, transparent);
    }

    .edit-btn:hover {
      color: var(--warning);
      background-color: color-mix(in srgb, var(--warning) 10%, transparent);
    }

    .delete-btn:hover {
      color: var(--danger);
      background-color: color-mix(in srgb, var(--danger) 10%, transparent);
    }
  `],
})
export class ActionButtonsComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  onView(event: MouseEvent): void {
    event.stopPropagation();
    if ((this.params.context as any)?.onAction) {
      (this.params.context as any).onAction('view', this.params.data);
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    if ((this.params.context as any)?.onAction) {
      (this.params.context as any).onAction('edit', this.params.data);
    }
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if ((this.params.context as any)?.onAction) {
      (this.params.context as any).onAction('delete', this.params.data);
    }
  }
}
