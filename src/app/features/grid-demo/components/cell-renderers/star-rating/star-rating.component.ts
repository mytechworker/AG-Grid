import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="star-rating">
      @for (star of stars; track $index) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          [style.fill]="star ? 'var(--warning, #f59e0b)' : 'var(--text-muted, #6b7280)'"
          [style.opacity]="star ? '1' : '0.3'"
          stroke="none"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
        </svg>
      }
      <span
        class="rating-value"
        [style.color]="'var(--text-muted, #6b7280)'"
      >{{ numericValue }}</span>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 1px;
    }
    svg {
      flex-shrink: 0;
      transition: opacity 0.15s ease;
    }
    .rating-value {
      margin-left: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
    }
  `,
})
export class StarRatingComponent implements ICellRendererAngularComp {
  stars: boolean[] = [];
  numericValue: string = '0.0';

  agInit(params: ICellRendererParams): void {
    this.updateValue(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params);
    return true;
  }

  private updateValue(params: ICellRendererParams): void {
    const raw = params.value ?? 0;
    const rating = Math.max(0, Math.min(5, Math.round(raw)));
    this.stars = Array.from({ length: 5 }, (_, i) => i < rating);
    this.numericValue = Number(raw).toFixed(1);
  }
}
