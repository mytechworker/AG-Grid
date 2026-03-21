import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-bar" [style.background]="'var(--bg-secondary)'" [style.border-bottom]="'1px solid var(--border-color)'">

      <!-- Total Records -->
      <div class="stat-item">
        <svg class="stat-icon" [style.color]="'var(--text-muted)'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="8" cy="4" rx="5.5" ry="2.5"/>
          <path d="M2.5 4v3.5c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V4"/>
          <path d="M2.5 7.5V11c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V7.5"/>
        </svg>
        <div class="stat-content">
          <span class="stat-label" [style.color]="'var(--text-muted)'">Total Records</span>
          <span class="stat-value" [style.color]="'var(--text-primary)'">{{ totalRecords | number }}</span>
        </div>
      </div>

      <div class="stat-divider" [style.background]="'var(--border-color)'"></div>

      <!-- Render Time -->
      <div class="stat-item">
        <svg class="stat-icon" [style.color]="'var(--accent)'" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.5 1L4 9h4l-1.5 6L13 7H9l.5-6z"/>
        </svg>
        <div class="stat-content">
          <span class="stat-label" [style.color]="'var(--text-muted)'">Render Time</span>
          <span class="stat-value" [style.color]="'var(--text-primary)'">{{ renderTime }}ms</span>
        </div>
      </div>

      <div class="stat-divider" [style.background]="'var(--border-color)'"></div>

      <!-- Active Filters -->
      <div class="stat-item">
        <svg class="stat-icon" [style.color]="'var(--text-muted)'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1.5 2.5h13l-5 5.5v4l-3 1.5V8z"/>
        </svg>
        <div class="stat-content">
          <span class="stat-label" [style.color]="'var(--text-muted)'">Active Filters</span>
          <span class="stat-value" [style.color]="'var(--text-primary)'">{{ activeFilters }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .stats-bar {
      display: inline-flex;
      align-items: center;
      gap: 0;
      width: 100%;
      padding: 6px 16px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .stat-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 16px;
    }

    .stat-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .stat-value {
      font-size: 13px;
      font-weight: 600;
    }

    .stat-divider {
      width: 1px;
      height: 24px;
      flex-shrink: 0;
      opacity: 0.5;
    }
  `]
})
export class StatsBarComponent {
  @Input() totalRecords: number = 0;
  @Input() renderTime: number = 0;
  @Input() activeFilters: number = 0;
}
