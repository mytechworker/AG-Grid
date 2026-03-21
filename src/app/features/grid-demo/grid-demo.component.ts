import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  GetRowIdParams,
  ValueFormatterParams,
  themeAlpine,
  colorSchemeDark,
  colorSchemeLight,
} from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  CsvExportModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  RowSelectionModule,
  PaginationModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  TextEditorModule,
  QuickFilterModule,
} from 'ag-grid-community';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DataService } from '../../core/services/data.service';
import { ExportService } from '../../core/services/export.service';
import { Employee, DEPARTMENTS, COUNTRIES, ROLES } from '../../core/models/employee.model';

import { ThemeService } from '../../core/services/theme.service';
import { ToolbarComponent, AdvancedFilters } from './components/toolbar/toolbar.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { DetailPanelComponent } from './components/detail-panel/detail-panel.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from './components/cell-renderers/status-badge/status-badge.component';
import { StarRatingComponent } from './components/cell-renderers/star-rating/star-rating.component';
import { ActionButtonsComponent } from './components/cell-renderers/action-buttons/action-buttons.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  RowSelectionModule,
  PaginationModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  TextEditorModule,
  QuickFilterModule,
]);

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    StatsBarComponent,
    DetailPanelComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './grid-demo.component.html',
  styleUrls: ['./grid-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridDemoComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', pinned: 'left', width: 80 },
    { field: 'firstName', headerName: 'First Name' },
    { field: 'lastName', headerName: 'Last Name' },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'department', headerName: 'Department' },
    { field: 'role', headerName: 'Role' },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: StatusBadgeComponent,
      width: 120,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      valueFormatter: (params: ValueFormatterParams) =>
        params.value != null
          ? '$' + params.value.toLocaleString('en-US', { minimumFractionDigits: 0 })
          : '',
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      valueFormatter: (params: ValueFormatterParams) =>
        params.value != null
          ? '$' + params.value.toLocaleString('en-US', { minimumFractionDigits: 0 })
          : '',
    },
    { field: 'country', headerName: 'Country' },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.value) return '';
        const date = params.value instanceof Date ? params.value : new Date(params.value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      field: 'performance',
      headerName: 'Performance',
      cellRenderer: StarRatingComponent,
      width: 130,
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionButtonsComponent,
      sortable: false,
      filter: false,
      width: 160,
      pinned: 'right',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: false,
  };

  gridTheme = themeAlpine
    .withParams(
      {
        backgroundColor: '#ffffff',
        foregroundColor: '#0f172a',
        headerBackgroundColor: '#f8fafc',
        headerTextColor: '#0f172a',
        oddRowBackgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        accentColor: '#6366f1',
        browserColorScheme: 'light',
      },
      'light'
    )
    .withParams(
      {
        backgroundColor: '#0f172a',
        foregroundColor: '#f1f5f9',
        headerBackgroundColor: '#1e293b',
        headerTextColor: '#f1f5f9',
        oddRowBackgroundColor: '#1e293b',
        borderColor: '#334155',
        accentColor: '#818cf8',
        browserColorScheme: 'dark',
      },
      'dark'
    );

  gridContext = { onAction: this.handleAction.bind(this) };

  rowData: Employee[] = [];
  allData: Employee[] = [];
  paginationPageSize = 50;
  paginationPageSizeSelector = [25, 50, 100, 500];
  loadingTemplate = '<div class="loading">Loading 100K records...</div>';
  noRowsTemplate = '<div class="no-rows">No records found</div>';

  selectedEmployee: Employee | null = null;
  detailPanelOpen = false;
  panelMode: 'view' | 'edit' = 'view';

  // Confirmation dialog state
  showConfirmDialog = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmLabel = '';
  confirmType: 'danger' | 'warning' = 'warning';
  pendingAction: (() => void) | null = null;

  totalRecords = 0;
  renderTime = 0;
  activeFilters = 0;
  selectedRowsCount = 0;

  searchTerm = '';
  currentFilters: AdvancedFilters | null = null;

  departments = DEPARTMENTS;
  roles = ROLES;
  countries = COUNTRIES;

  private searchSubject = new Subject<string>();
  private filterSubject = new Subject<AdvancedFilters>();
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  onThemeToggle(): void {
    this.themeService.toggle();
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.applyAllFilters();
      });

    this.filterSubject
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.currentFilters = filters;
        this.applyAllFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    const startTime = performance.now();
    this.loadData();
    this.renderTime = Math.round(performance.now() - startTime);
    this.cdr.markForCheck();
  }

  loadData(): void {
    this.dataService
      .globalSearch('')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.allData = result.rowData;
        this.rowData = result.rowData;
        this.totalRecords = result.rowCount;
        this.cdr.markForCheck();
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onFiltersChange(filters: AdvancedFilters): void {
    this.filterSubject.next(filters);
  }

  onResetFilters(): void {
    this.searchTerm = '';
    this.currentFilters = null;
    this.rowData = this.allData;
    this.totalRecords = this.allData.length;
    this.activeFilters = 0;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', '');
    }
    this.cdr.markForCheck();
  }

  onExportCsv(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'employee-data.csv' });
    }
  }

  onExportExcel(): void {
    const data = this.getDisplayedRows();
    this.exportService.exportToExcel(data, 'employee-data');
  }

  handleAction(action: string, employee: Employee): void {
    if (action === 'view') {
      this.selectedEmployee = employee;
      this.panelMode = 'view';
      this.detailPanelOpen = true;
      this.cdr.markForCheck();
    } else if (action === 'edit') {
      this.selectedEmployee = employee;
      this.panelMode = 'edit';
      this.detailPanelOpen = true;
      this.cdr.markForCheck();
    } else if (action === 'delete') {
      this.showDeleteConfirmation(employee);
    }
  }

  onSaveEmployee(updated: Employee): void {
    // Show confirmation before saving
    this.confirmTitle = 'Save Changes';
    this.confirmMessage = `Are you sure you want to save changes to ${updated.firstName} ${updated.lastName}?`;
    this.confirmLabel = 'Save';
    this.confirmType = 'warning';
    this.pendingAction = () => {
      this.performSave(updated);
    };
    this.showConfirmDialog = true;
    this.cdr.markForCheck();
  }

  onConfirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.showConfirmDialog = false;
    this.pendingAction = null;
    this.cdr.markForCheck();
  }

  onCancelAction(): void {
    this.showConfirmDialog = false;
    this.pendingAction = null;
    this.cdr.markForCheck();
  }

  private performSave(updated: Employee): void {
    // Update the record in the master data
    const updatedCopy = { ...updated };
    const idx = this.allData.findIndex(e => e.id === updatedCopy.id);
    if (idx >= 0) {
      this.allData[idx] = updatedCopy;
    }
    // Also update in current rowData directly
    const rowIdx = this.rowData.findIndex(e => e.id === updatedCopy.id);
    if (rowIdx >= 0) {
      this.rowData[rowIdx] = updatedCopy;
    }
    // Force AG-Grid to pick up changes with a new array reference
    this.rowData = [...this.rowData];
    this.detailPanelOpen = false;
    this.selectedEmployee = null;
    this.cdr.markForCheck();
  }

  private showDeleteConfirmation(employee: Employee): void {
    this.confirmTitle = 'Delete Employee';
    this.confirmMessage = `Are you sure you want to delete ${employee.firstName} ${employee.lastName} (#${employee.id})? This action cannot be undone.`;
    this.confirmLabel = 'Delete';
    this.confirmType = 'danger';
    this.pendingAction = () => {
      this.performDelete(employee);
    };
    this.showConfirmDialog = true;
    this.cdr.markForCheck();
  }

  private performDelete(employee: Employee): void {
    this.allData = this.allData.filter(e => e.id !== employee.id);
    this.applyAllFilters();
    this.cdr.markForCheck();
  }

  onSelectionChanged(): void {
    if (this.gridApi) {
      this.selectedRowsCount = this.gridApi.getSelectedRows().length;
      this.cdr.markForCheck();
    }
  }

  onFilterChanged(): void {
    if (this.gridApi) {
      this.updateDisplayedRowCount();
      this.cdr.markForCheck();
    }
  }

  closeDetailPanel(): void {
    this.detailPanelOpen = false;
    this.selectedEmployee = null;
    this.cdr.markForCheck();
  }

  getRowId = (params: GetRowIdParams): string => {
    return String(params.data.id);
  };

  private applyAllFilters(): void {
    const startTime = performance.now();
    let filtered = this.allData;
    let filterCount = 0;

    const f = this.currentFilters;

    // Multi-select: departments
    if (f && f.departments.length > 0) {
      const set = new Set(f.departments);
      filtered = filtered.filter(r => set.has(r.department));
      filterCount++;
    }

    // Multi-select: roles
    if (f && f.roles.length > 0) {
      const set = new Set(f.roles);
      filtered = filtered.filter(r => set.has(r.role));
      filterCount++;
    }

    // Multi-select: countries
    if (f && f.countries.length > 0) {
      const set = new Set(f.countries);
      filtered = filtered.filter(r => set.has(r.country));
      filterCount++;
    }

    // Status
    if (f && f.status) {
      filtered = filtered.filter(r => r.status === f.status);
      filterCount++;
    }

    // Salary range
    if (f && (f.salaryRange.min != null || f.salaryRange.max != null)) {
      const min = f.salaryRange.min ?? 0;
      const max = f.salaryRange.max ?? Infinity;
      filtered = filtered.filter(r => r.salary >= min && r.salary <= max);
      filterCount++;
    }

    // Revenue range
    if (f && (f.revenueRange.min != null || f.revenueRange.max != null)) {
      const min = f.revenueRange.min ?? 0;
      const max = f.revenueRange.max ?? Infinity;
      filtered = filtered.filter(r => r.revenue >= min && r.revenue <= max);
      filterCount++;
    }

    // Text search — apply as quick filter on AG-Grid for performance
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.firstName.toLowerCase().includes(term) ||
        r.lastName.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.department.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term) ||
        r.country.toLowerCase().includes(term)
      );
      filterCount++;
    }

    this.rowData = filtered;
    this.totalRecords = filtered.length;
    this.activeFilters = filterCount;
    this.renderTime = Math.round(performance.now() - startTime);
    this.cdr.markForCheck();
  }

  private updateDisplayedRowCount(): void {
    if (this.gridApi) {
      this.totalRecords = this.gridApi.getDisplayedRowCount();
    }
  }

  private getDisplayedRows(): any[] {
    const rows: any[] = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        if (node.data) {
          rows.push(node.data);
        }
      });
    }
    return rows;
  }
}
