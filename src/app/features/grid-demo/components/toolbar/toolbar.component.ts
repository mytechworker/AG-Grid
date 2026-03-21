import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RangeFilter {
  min: number | null;
  max: number | null;
}

export interface AdvancedFilters {
  search: string;
  departments: string[];
  roles: string[];
  countries: string[];
  status: string;
  salaryRange: RangeFilter;
  revenueRange: RangeFilter;
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: block;
    }

    .toolbar-wrapper {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
    }

    .toolbar-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px 20px;
    }

    .toolbar-row-2 {
      border-top: 1px solid var(--border-color);
      padding: 10px 20px;
    }

    /* Search */
    .search-wrapper {
      position: relative;
      flex: 0 1 320px;
      min-width: 200px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-primary);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    /* Theme toggle */
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .theme-toggle:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

    .theme-toggle svg {
      width: 18px;
      height: 18px;
    }

    /* Status pills */
    .status-group {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-sm);
      padding: 2px;
    }

    .status-pill {
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 500;
      border: none;
      border-radius: var(--radius-xs);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      line-height: 1.4;
    }

    .status-pill-active {
      background: var(--accent);
      color: #fff;
      box-shadow: var(--shadow-sm);
    }

    .status-pill-inactive {
      background: transparent;
      color: var(--text-secondary);
    }

    .status-pill-inactive:hover {
      color: var(--text-primary);
      background: var(--bg-card);
    }

    /* Spacer */
    .spacer {
      flex: 1 1 auto;
    }

    /* Action buttons */
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      line-height: 1.5;
    }

    .btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

    .btn svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .record-count {
      font-size: 13px;
      color: var(--text-muted);
      white-space: nowrap;
      padding-left: 4px;
    }

    /* Filter group (dropdown trigger) */
    .filter-group {
      position: relative;
    }

    .filter-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .filter-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 10px;
      min-width: 170px;
      font-size: 13px;
      color: var(--text-primary);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      line-height: 1.5;
    }

    .filter-trigger:hover {
      border-color: var(--border-hover);
    }

    .filter-trigger-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .filter-trigger svg {
      width: 14px;
      height: 14px;
      color: var(--text-muted);
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .filter-trigger-open svg {
      transform: rotate(180deg);
    }

    /* Dropdown panel */
    .dropdown-panel {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 50;
      margin-top: 4px;
      min-width: 230px;
      max-height: 300px;
      overflow-y: auto;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-md);
    }

    .dropdown-search {
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }

    .dropdown-search input {
      width: 100%;
      padding: 6px 10px;
      font-size: 13px;
      color: var(--text-primary);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xs);
      outline: none;
      transition: all 0.2s ease;
    }

    .dropdown-search input::placeholder {
      color: var(--text-muted);
    }

    .dropdown-search input:focus {
      border-color: var(--accent);
    }

    .dropdown-list {
      padding: 4px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: var(--radius-xs);
      cursor: pointer;
      font-size: 13px;
      color: var(--text-primary);
      transition: background 0.15s ease;
    }

    .dropdown-item:hover {
      background: var(--bg-tertiary);
    }

    .dropdown-item input[type="checkbox"] {
      accent-color: var(--accent);
      width: 14px;
      height: 14px;
      cursor: pointer;
    }

    /* Range inputs */
    .range-group {
      display: flex;
      flex-direction: column;
    }

    .range-inputs {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .range-input {
      width: 100px;
      padding: 6px 10px;
      font-size: 13px;
      color: var(--text-primary);
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      outline: none;
      transition: all 0.2s ease;
      line-height: 1.5;
    }

    .range-input::placeholder {
      color: var(--text-muted);
    }

    .range-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    .range-separator {
      color: var(--text-muted);
      font-size: 13px;
      user-select: none;
    }

    /* Filter badge */
    .filter-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      color: var(--accent);
      background: var(--accent-light);
      border-radius: 999px;
      white-space: nowrap;
      margin-left: 4px;
    }

    /* Hide number input spinners */
    .range-input::-webkit-outer-spin-button,
    .range-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .range-input[type=number] {
      -moz-appearance: textfield;
    }
  `],
  template: `
    <div class="toolbar-wrapper">
      <!-- Row 1: Search + Theme + Status + Actions + Count -->
      <div class="toolbar-row">

        <!-- Search Input with Icon -->
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            class="search-input"
            type="text"
            [ngModel]="searchText"
            (input)="onSearchInput($event)"
            placeholder="Search all columns..."
          />
        </div>

        <!-- Theme Toggle -->
        <button class="theme-toggle" type="button" (click)="themeToggle.emit()" title="Toggle theme">
          @if (isDark) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <!-- Status Toggle Pills -->
        <div class="status-group">
          @for (s of ['', 'Active', 'Inactive']; track s) {
            <button
              type="button"
              (click)="onStatusToggle(s)"
              class="status-pill"
              [class.status-pill-active]="selectedStatus === s"
              [class.status-pill-inactive]="selectedStatus !== s"
            >
              {{ s || 'All' }}
            </button>
          }
        </div>

        <div class="spacer"></div>

        <!-- Action Buttons -->
        <div class="actions">
          <button class="btn" type="button" (click)="onResetAll()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Reset
          </button>
          <button class="btn" type="button" (click)="exportCsv.emit()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV
          </button>
          <button class="btn" type="button" (click)="exportExcel.emit()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Excel
          </button>
        </div>

        <span class="record-count">{{ totalRows | number }} records</span>
      </div>

      <!-- Row 2: Advanced Filters -->
      <div class="toolbar-row toolbar-row-2">

        <!-- Department Multi-Select -->
        <div class="filter-group" #dropdownContainer>
          <label class="filter-label">Department</label>
          <button type="button" (click)="toggleDropdown('department')"
            class="filter-trigger"
            [class.filter-trigger-open]="openDropdown === 'department'">
            <span class="filter-trigger-text">{{ selectedDepartments.length === 0 ? 'All' : selectedDepartments.length + ' selected' }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          @if (openDropdown === 'department') {
            <div class="dropdown-panel">
              <div class="dropdown-search">
                <input type="text" [(ngModel)]="deptSearch" placeholder="Search departments..." />
              </div>
              <div class="dropdown-list">
                @for (dept of filteredDepartments; track dept) {
                  <label class="dropdown-item">
                    <input type="checkbox" [checked]="selectedDepartments.includes(dept)"
                      (change)="toggleMultiSelect('department', dept)" />
                    {{ dept }}
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <!-- Role Multi-Select -->
        <div class="filter-group" #dropdownContainer>
          <label class="filter-label">Role</label>
          <button type="button" (click)="toggleDropdown('role')"
            class="filter-trigger"
            [class.filter-trigger-open]="openDropdown === 'role'">
            <span class="filter-trigger-text">{{ selectedRoles.length === 0 ? 'All' : selectedRoles.length + ' selected' }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          @if (openDropdown === 'role') {
            <div class="dropdown-panel">
              <div class="dropdown-search">
                <input type="text" [(ngModel)]="roleSearch" placeholder="Search roles..." />
              </div>
              <div class="dropdown-list">
                @for (role of filteredRoles; track role) {
                  <label class="dropdown-item">
                    <input type="checkbox" [checked]="selectedRoles.includes(role)"
                      (change)="toggleMultiSelect('role', role)" />
                    {{ role }}
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <!-- Country Multi-Select -->
        <div class="filter-group" #dropdownContainer>
          <label class="filter-label">Country</label>
          <button type="button" (click)="toggleDropdown('country')"
            class="filter-trigger"
            [class.filter-trigger-open]="openDropdown === 'country'">
            <span class="filter-trigger-text">{{ selectedCountries.length === 0 ? 'All' : selectedCountries.length + ' selected' }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          @if (openDropdown === 'country') {
            <div class="dropdown-panel">
              <div class="dropdown-search">
                <input type="text" [(ngModel)]="countrySearch" placeholder="Search countries..." />
              </div>
              <div class="dropdown-list">
                @for (c of filteredCountries; track c) {
                  <label class="dropdown-item">
                    <input type="checkbox" [checked]="selectedCountries.includes(c)"
                      (change)="toggleMultiSelect('country', c)" />
                    {{ c }}
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <!-- Salary Range -->
        <div class="range-group">
          <label class="filter-label">Salary Range</label>
          <div class="range-inputs">
            <input class="range-input" type="number" [(ngModel)]="salaryMin" (ngModelChange)="onRangeChange()"
              placeholder="Min" min="0" />
            <span class="range-separator">&ndash;</span>
            <input class="range-input" type="number" [(ngModel)]="salaryMax" (ngModelChange)="onRangeChange()"
              placeholder="Max" min="0" />
          </div>
        </div>

        <!-- Revenue Range -->
        <div class="range-group">
          <label class="filter-label">Revenue Range</label>
          <div class="range-inputs">
            <input class="range-input" type="number" [(ngModel)]="revenueMin" (ngModelChange)="onRangeChange()"
              placeholder="Min" min="0" />
            <span class="range-separator">&ndash;</span>
            <input class="range-input" type="number" [(ngModel)]="revenueMax" (ngModelChange)="onRangeChange()"
              placeholder="Max" min="0" />
          </div>
        </div>

        <!-- Active filter count badge -->
        @if (activeFilterCount > 0) {
          <span class="filter-badge">
            {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }}
          </span>
        }
      </div>
    </div>
  `,
})
export class ToolbarComponent {
  @Input() departments: string[] = [];
  @Input() roles: string[] = [];
  @Input() countries: string[] = [];
  @Input() totalRows: number = 0;
  @Input() isDark: boolean = false;

  @Output() filtersChange = new EventEmitter<AdvancedFilters>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() exportCsv = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();

  @ViewChildren('dropdownContainer') dropdownContainers!: QueryList<ElementRef>;

  searchText = '';
  selectedStatus = '';
  selectedDepartments: string[] = [];
  selectedRoles: string[] = [];
  selectedCountries: string[] = [];
  salaryMin: number | null = null;
  salaryMax: number | null = null;
  revenueMin: number | null = null;
  revenueMax: number | null = null;

  openDropdown: string | null = null;
  deptSearch = '';
  roleSearch = '';
  countrySearch = '';

  activeBtnClass = 'px-3 py-1.5 text-sm bg-blue-600 text-white font-medium focus:outline-none';
  inactiveBtnClass = 'px-3 py-1.5 text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none transition-colors';

  get filteredDepartments(): string[] {
    if (!this.deptSearch) return this.departments;
    const s = this.deptSearch.toLowerCase();
    return this.departments.filter(d => d.toLowerCase().includes(s));
  }

  get filteredRoles(): string[] {
    if (!this.roleSearch) return this.roles;
    const s = this.roleSearch.toLowerCase();
    return this.roles.filter(r => r.toLowerCase().includes(s));
  }

  get filteredCountries(): string[] {
    if (!this.countrySearch) return this.countries;
    const s = this.countrySearch.toLowerCase();
    return this.countries.filter(c => c.toLowerCase().includes(s));
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedDepartments.length) count++;
    if (this.selectedRoles.length) count++;
    if (this.selectedCountries.length) count++;
    if (this.selectedStatus) count++;
    if (this.salaryMin != null || this.salaryMax != null) count++;
    if (this.revenueMin != null || this.revenueMax != null) count++;
    if (this.searchText) count++;
    return count;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openDropdown && this.dropdownContainers) {
      const clickedInside = this.dropdownContainers.some(
        ref => ref.nativeElement.contains(event.target)
      );
      if (!clickedInside) {
        this.openDropdown = null;
      }
    }
  }

  toggleDropdown(name: string): void {
    this.openDropdown = this.openDropdown === name ? null : name;
    this.deptSearch = '';
    this.roleSearch = '';
    this.countrySearch = '';
  }

  toggleMultiSelect(type: string, value: string): void {
    let arr: string[];
    switch (type) {
      case 'department': arr = this.selectedDepartments; break;
      case 'role': arr = this.selectedRoles; break;
      case 'country': arr = this.selectedCountries; break;
      default: return;
    }
    const idx = arr.indexOf(value);
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push(value);
    }
    this.emitFilters();
  }

  onSearchInput(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.searchChange.emit(this.searchText);
  }

  onStatusToggle(status: string): void {
    this.selectedStatus = status;
    this.emitFilters();
  }

  onRangeChange(): void {
    this.emitFilters();
  }

  onResetAll(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedDepartments = [];
    this.selectedRoles = [];
    this.selectedCountries = [];
    this.salaryMin = null;
    this.salaryMax = null;
    this.revenueMin = null;
    this.revenueMax = null;
    this.openDropdown = null;
    this.resetFilters.emit();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      search: this.searchText,
      departments: [...this.selectedDepartments],
      roles: [...this.selectedRoles],
      countries: [...this.selectedCountries],
      status: this.selectedStatus,
      salaryRange: { min: this.salaryMin, max: this.salaryMax },
      revenueRange: { min: this.revenueMin, max: this.revenueMax },
    });
  }
}
