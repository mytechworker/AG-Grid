import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="status-badge"
      [style.color]="textColor"
      [style.background-color]="bgColor"
    >
      <span class="status-dot" [style.background-color]="dotColor"></span>
      {{ value }}
    </span>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `,
})
export class StatusBadgeComponent implements ICellRendererAngularComp {
  value: string = '';
  textColor: string = '';
  bgColor: string = '';
  dotColor: string = '';

  agInit(params: ICellRendererParams): void {
    this.updateValue(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params);
    return true;
  }

  private updateValue(params: ICellRendererParams): void {
    this.value = params.value ?? '';
    this.applyStatusColors(this.value);
  }

  private applyStatusColors(status: string): void {
    switch (status) {
      case 'Active':
        this.dotColor = 'var(--success)';
        this.textColor = 'var(--success)';
        this.bgColor = 'var(--success-light)';
        break;
      case 'Inactive':
        this.dotColor = 'var(--danger)';
        this.textColor = 'var(--danger)';
        this.bgColor = 'var(--danger-light)';
        break;
      default:
        this.dotColor = '#6b7280';
        this.textColor = '#6b7280';
        this.bgColor = '#f3f4f6';
        break;
    }
  }
}
