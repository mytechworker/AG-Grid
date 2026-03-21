import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, DEPARTMENTS, ROLES, COUNTRIES } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Frosted glass overlay -->
    @if (isOpen) {
      <div
        class="fixed inset-0 z-40 transition-opacity duration-300"
        [style.background]="'rgba(0,0,0,0.4)'"
        [style.backdrop-filter]="'blur(4px)'"
        [style.-webkit-backdrop-filter]="'blur(4px)'"
        (click)="close.emit()">
      </div>
    }

    <!-- Slide-in panel -->
    <div
      class="fixed top-0 right-0 h-full z-50 overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out"
      [style.width]="'440px'"
      [style.background]="'var(--bg-primary)'"
      [style.box-shadow]="isOpen ? 'var(--shadow-lg)' : 'none'"
      [style.transform]="isOpen ? 'translateX(0)' : 'translateX(100%)'">

      @if (employee) {
        <!-- Header -->
        <div
          class="flex items-center gap-4 px-6 py-5"
          [style.border-bottom]="'1px solid var(--border-color)'"
          [style.background]="'var(--bg-secondary)'">

          <!-- Avatar circle with initials -->
          <div
            class="flex items-center justify-center shrink-0 text-white font-semibold text-sm"
            [style.width]="'48px'"
            [style.height]="'48px'"
            [style.border-radius]="'50%'"
            [style.background]="'var(--accent)'"
            [style.letter-spacing]="'0.5px'">
            {{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}
          </div>

          <!-- Name and subtitle -->
          <div class="flex-1 min-w-0">
            <h2
              class="text-lg font-semibold truncate"
              [style.color]="'var(--text-primary)'">
              {{ employee.firstName }} {{ employee.lastName }}
            </h2>
            <span
              class="text-xs font-medium uppercase tracking-wider"
              [style.color]="'var(--accent)'">
              {{ mode === 'view' ? 'Employee Details' : 'Editing Record' }}
            </span>
          </div>

          <!-- Close button -->
          <button
            (click)="close.emit()"
            class="flex items-center justify-center shrink-0 transition-all duration-200"
            [style.width]="'32px'"
            [style.height]="'32px'"
            [style.border-radius]="'var(--radius-sm)'"
            [style.color]="'var(--text-muted)'"
            [style.background]="'transparent'"
            [style.border]="'none'"
            [style.cursor]="'pointer'"
            (mouseenter)="$any($event.currentTarget).style.background='var(--bg-card)';$any($event.currentTarget).style.color='var(--text-primary)'"
            (mouseleave)="$any($event.currentTarget).style.background='transparent';$any($event.currentTarget).style.color='var(--text-muted)'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- VIEW MODE -->
        @if (mode === 'view') {
          <div class="px-6 py-5">

            <!-- Info Card: Personal -->
            <div
              class="mb-4"
              [style.background]="'var(--bg-card)'"
              [style.border-radius]="'var(--radius)'"
              [style.border]="'1px solid var(--border-color)'"
              [style.overflow]="'hidden'">

              <div
                class="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                [style.color]="'var(--text-muted)'"
                [style.border-bottom]="'1px solid var(--border-color)'"
                [style.background]="'var(--bg-secondary)'">
                Personal Information
              </div>

              <div class="grid grid-cols-2 gap-0">
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'" [style.border-right]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">First Name</p>
                  <p class="text-sm font-medium" [style.color]="'var(--text-primary)'">{{ employee.firstName }}</p>
                </div>
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Last Name</p>
                  <p class="text-sm font-medium" [style.color]="'var(--text-primary)'">{{ employee.lastName }}</p>
                </div>
              </div>

              <div class="px-4 py-3">
                <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Email</p>
                <p class="text-sm" [style.color]="'var(--text-primary)'">{{ employee.email }}</p>
              </div>
            </div>

            <!-- Info Card: Work -->
            <div
              class="mb-4"
              [style.background]="'var(--bg-card)'"
              [style.border-radius]="'var(--radius)'"
              [style.border]="'1px solid var(--border-color)'"
              [style.overflow]="'hidden'">

              <div
                class="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                [style.color]="'var(--text-muted)'"
                [style.border-bottom]="'1px solid var(--border-color)'"
                [style.background]="'var(--bg-secondary)'">
                Work Details
              </div>

              <div class="grid grid-cols-2 gap-0">
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'" [style.border-right]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Department</p>
                  <p class="text-sm" [style.color]="'var(--text-primary)'">{{ employee.department }}</p>
                </div>
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Role</p>
                  <p class="text-sm" [style.color]="'var(--text-primary)'">{{ employee.role }}</p>
                </div>
                <div class="px-4 py-3" [style.border-right]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Country</p>
                  <p class="text-sm" [style.color]="'var(--text-primary)'">{{ employee.country }}</p>
                </div>
                <div class="px-4 py-3">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Status</p>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold"
                    [style.border-radius]="'999px'"
                    [style.background]="employee.status === 'Active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'"
                    [style.color]="employee.status === 'Active' ? '#16a34a' : '#dc2626'">
                    <span
                      class="inline-block mr-1.5"
                      [style.width]="'6px'"
                      [style.height]="'6px'"
                      [style.border-radius]="'50%'"
                      [style.background]="employee.status === 'Active' ? '#16a34a' : '#dc2626'">
                    </span>
                    {{ employee.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Info Card: Compensation -->
            <div
              class="mb-4"
              [style.background]="'var(--bg-card)'"
              [style.border-radius]="'var(--radius)'"
              [style.border]="'1px solid var(--border-color)'"
              [style.overflow]="'hidden'">

              <div
                class="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                [style.color]="'var(--text-muted)'"
                [style.border-bottom]="'1px solid var(--border-color)'"
                [style.background]="'var(--bg-secondary)'">
                Compensation & Performance
              </div>

              <div class="grid grid-cols-2 gap-0">
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'" [style.border-right]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Salary</p>
                  <p class="text-sm font-semibold" [style.color]="'var(--text-primary)'">{{ employee.salary | currency:'USD':'symbol':'1.0-0' }}</p>
                </div>
                <div class="px-4 py-3" [style.border-bottom]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Revenue</p>
                  <p class="text-sm font-semibold" [style.color]="'var(--text-primary)'">{{ employee.revenue | currency:'USD':'symbol':'1.0-0' }}</p>
                </div>
                <div class="px-4 py-3" [style.border-right]="'1px solid var(--border-color)'">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Join Date</p>
                  <p class="text-sm" [style.color]="'var(--text-primary)'">{{ employee.joinDate | date:'mediumDate' }}</p>
                </div>
                <div class="px-4 py-3">
                  <p class="text-[10px] font-medium uppercase tracking-wider mb-1" [style.color]="'var(--text-muted)'">Performance</p>
                  <div class="flex items-center gap-0.5">
                    @for (s of filledStars(employee.performance); track $index) {
                      <span class="text-base" [style.color]="'var(--accent)'">&#9733;</span>
                    }
                    @for (s of emptyStars(employee.performance); track $index) {
                      <span class="text-base" [style.color]="'var(--border-color)'">&#9733;</span>
                    }
                    <span class="ml-1.5 text-xs font-medium" [style.color]="'var(--text-muted)'">{{ employee.performance }}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Employee ID footer -->
            <div
              class="flex items-center justify-between px-4 py-3"
              [style.background]="'var(--bg-card)'"
              [style.border-radius]="'var(--radius)'"
              [style.border]="'1px solid var(--border-color)'">
              <span class="text-[10px] font-medium uppercase tracking-wider" [style.color]="'var(--text-muted)'">Employee ID</span>
              <span class="text-sm font-mono font-medium" [style.color]="'var(--text-secondary)'">#{{ employee.id }}</span>
            </div>

          </div>
        }

        <!-- EDIT MODE -->
        @if (mode === 'edit' && editData) {
          <div class="px-6 py-5 space-y-5">

            <!-- Name fields -->
            <div class="grid grid-cols-2 gap-4">
              <div class="relative">
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">First Name</label>
                <input type="text" [(ngModel)]="editData.firstName"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
              </div>
              <div class="relative">
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Last Name</label>
                <input type="text" [(ngModel)]="editData.lastName"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label
                class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                [style.color]="'var(--text-muted)'">Email</label>
              <input type="email" [(ngModel)]="editData.email"
                class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none"
                [style.background]="'var(--bg-card)'"
                [style.color]="'var(--text-primary)'"
                [style.border]="'1px solid var(--border-color)'"
                [style.border-radius]="'var(--radius-sm)'"
                onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
            </div>

            <!-- Department & Role -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Department</label>
                <select [(ngModel)]="editData.department"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">
                  @for (d of allDepartments; track d) {
                    <option [value]="d">{{ d }}</option>
                  }
                </select>
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Role</label>
                <select [(ngModel)]="editData.role"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">
                  @for (r of allRoles; track r) {
                    <option [value]="r">{{ r }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Country & Status -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Country</label>
                <select [(ngModel)]="editData.country"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">
                  @for (c of allCountries; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Status</label>
                <select [(ngModel)]="editData.status"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Salary & Revenue -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Salary</label>
                <input type="number" [(ngModel)]="editData.salary"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
              </div>
              <div>
                <label
                  class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  [style.color]="'var(--text-muted)'">Revenue</label>
                <input type="number" [(ngModel)]="editData.revenue"
                  class="w-full px-3 py-2 text-sm transition-all duration-200 outline-none"
                  [style.background]="'var(--bg-card)'"
                  [style.color]="'var(--text-primary)'"
                  [style.border]="'1px solid var(--border-color)'"
                  [style.border-radius]="'var(--radius-sm)'"
                  onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                  onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
              </div>
            </div>

            <!-- Performance -->
            <div>
              <label
                class="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                [style.color]="'var(--text-muted)'">Performance (1-5)</label>
              <input type="number" [(ngModel)]="editData.performance" min="1" max="5"
                class="px-3 py-2 text-sm transition-all duration-200 outline-none"
                [style.width]="'100px'"
                [style.background]="'var(--bg-card)'"
                [style.color]="'var(--text-primary)'"
                [style.border]="'1px solid var(--border-color)'"
                [style.border-radius]="'var(--radius-sm)'"
                onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 0 3px var(--accent-light)'"
                onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'"/>
            </div>

            <!-- Action Buttons -->
            <div
              class="flex gap-3 pt-5"
              [style.border-top]="'1px solid var(--border-color)'">
              <button
                (click)="onSave()"
                class="flex-1 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
                [style.background]="'var(--accent)'"
                [style.border]="'none'"
                [style.border-radius]="'var(--radius-sm)'"
                (mouseenter)="$any($event.currentTarget).style.opacity='0.9';$any($event.currentTarget).style.transform='translateY(-1px)'"
                (mouseleave)="$any($event.currentTarget).style.opacity='1';$any($event.currentTarget).style.transform='translateY(0)'">
                Save Changes
              </button>
              <button
                (click)="close.emit()"
                class="flex-1 px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer"
                [style.background]="'var(--bg-tertiary)'"
                [style.color]="'var(--text-secondary)'"
                [style.border]="'none'"
                [style.border-radius]="'var(--radius-sm)'"
                (mouseenter)="$any($event.currentTarget).style.opacity='0.8'"
                (mouseleave)="$any($event.currentTarget).style.opacity='1'">
                Cancel
              </button>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class DetailPanelComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Input() isOpen = false;
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Employee>();

  editData: Partial<Employee> | null = null;

  allDepartments = DEPARTMENTS;
  allRoles = ROLES;
  allCountries = COUNTRIES;

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.mode === 'edit' && this.employee) {
      this.editData = { ...this.employee };
    }
  }

  filledStars(n: number): number[] {
    return Array(Math.round(n)).fill(0);
  }

  emptyStars(n: number): number[] {
    return Array(5 - Math.round(n)).fill(0);
  }

  onSave(): void {
    if (this.editData) {
      this.save.emit(this.editData as Employee);
    }
  }
}
