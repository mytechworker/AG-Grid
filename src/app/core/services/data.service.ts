import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Employee, DEPARTMENTS, COUNTRIES, ROLES } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private allData: Employee[] = [];
  private lastFilteredCount = 0;

  private readonly FIRST_NAMES: string[] = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
    'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
    'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
    'Timothy', 'Deborah',
  ];

  private readonly LAST_NAMES: string[] = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts',
  ];

  constructor() {
    this.allData = this.generateData(100_000);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  }

  private generateData(count: number): Employee[] {
    const data: Employee[] = new Array(count);
    const fnLen = this.FIRST_NAMES.length;
    const lnLen = this.LAST_NAMES.length;
    const deptLen = DEPARTMENTS.length;
    const roleLen = ROLES.length;
    const countryLen = COUNTRIES.length;

    const startDate = new Date('2015-01-01').getTime();
    const endDate = new Date('2024-12-31').getTime();
    const dateRange = endDate - startDate;

    for (let i = 0; i < count; i++) {
      const r1 = this.seededRandom(i * 7);
      const r2 = this.seededRandom(i * 7 + 1);
      const r3 = this.seededRandom(i * 7 + 2);
      const r4 = this.seededRandom(i * 7 + 3);
      const r5 = this.seededRandom(i * 7 + 4);
      const r6 = this.seededRandom(i * 7 + 5);
      const r7 = this.seededRandom(i * 7 + 6);

      const firstName = this.FIRST_NAMES[Math.floor(r1 * fnLen)];
      const lastName = this.LAST_NAMES[Math.floor(r2 * lnLen)];

      data[i] = {
        id: i + 1,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: DEPARTMENTS[Math.floor(r3 * deptLen)],
        role: ROLES[Math.floor(r4 * roleLen)],
        salary: Math.floor(30000 + r5 * 170000),
        country: COUNTRIES[Math.floor(r6 * countryLen)],
        status: r7 < 0.8 ? 'Active' : 'Inactive',
        joinDate: new Date(startDate + Math.floor(this.seededRandom(i * 3 + 100) * dateRange)),
        performance: Math.floor(this.seededRandom(i * 3 + 200) * 5) + 1,
        revenue: Math.floor(this.seededRandom(i * 3 + 300) * 500000),
      };
    }

    return data;
  }

  getRows(params: {
    startRow: number;
    endRow: number;
    sortModel: any[];
    filterModel: any;
  }): Observable<{ rowData: Employee[]; rowCount: number }> {
    let filtered = this.applyFilters(this.allData, params.filterModel);

    if (params.sortModel && params.sortModel.length > 0) {
      filtered = this.applySorting(filtered, params.sortModel);
    }

    this.lastFilteredCount = filtered.length;
    const rowData = filtered.slice(params.startRow, params.endRow);
    const delayMs = 200 + Math.floor(Math.random() * 200);

    return of({ rowData, rowCount: filtered.length }).pipe(delay(delayMs));
  }

  getFilteredCount(): number {
    return this.lastFilteredCount;
  }

  globalSearch(term: string): Observable<{ rowData: Employee[]; rowCount: number }> {
    if (!term || term.trim().length === 0) {
      this.lastFilteredCount = this.allData.length;
      return of({ rowData: this.allData, rowCount: this.allData.length });
    }

    const lowerTerm = term.toLowerCase();
    const filtered = this.allData.filter((row) => {
      return (
        row.firstName.toLowerCase().includes(lowerTerm) ||
        row.lastName.toLowerCase().includes(lowerTerm) ||
        row.email.toLowerCase().includes(lowerTerm) ||
        row.department.toLowerCase().includes(lowerTerm) ||
        row.role.toLowerCase().includes(lowerTerm) ||
        row.country.toLowerCase().includes(lowerTerm)
      );
    });

    this.lastFilteredCount = filtered.length;
    return of({ rowData: filtered, rowCount: filtered.length });
  }

  private applyFilters(data: Employee[], filterModel: any): Employee[] {
    if (!filterModel || Object.keys(filterModel).length === 0) {
      return data;
    }

    const filterEntries = Object.entries(filterModel);

    return data.filter((row) => {
      for (const [field, model] of filterEntries) {
        if (!this.matchesFilter(row, field, model as any)) {
          return false;
        }
      }
      return true;
    });
  }

  private matchesFilter(row: Employee, field: string, model: any): boolean {
    const value = (row as any)[field];

    // Set filter
    if (model.filterType === 'set') {
      if (!model.values || model.values.length === 0) {
        return false;
      }
      return model.values.includes(value?.toString() ?? value);
    }

    // Text filter
    if (model.filterType === 'text') {
      const cellValue = (value ?? '').toString().toLowerCase();
      const filterValue = (model.filter ?? '').toString().toLowerCase();

      switch (model.type) {
        case 'contains':
          return cellValue.includes(filterValue);
        case 'notContains':
          return !cellValue.includes(filterValue);
        case 'equals':
          return cellValue === filterValue;
        case 'notEqual':
          return cellValue !== filterValue;
        case 'startsWith':
          return cellValue.startsWith(filterValue);
        case 'endsWith':
          return cellValue.endsWith(filterValue);
        default:
          return cellValue.includes(filterValue);
      }
    }

    // Number filter
    if (model.filterType === 'number') {
      const cellValue = Number(value);
      const filterValue = Number(model.filter);

      switch (model.type) {
        case 'equals':
          return cellValue === filterValue;
        case 'notEqual':
          return cellValue !== filterValue;
        case 'greaterThan':
          return cellValue > filterValue;
        case 'greaterThanOrEqual':
          return cellValue >= filterValue;
        case 'lessThan':
          return cellValue < filterValue;
        case 'lessThanOrEqual':
          return cellValue <= filterValue;
        case 'inRange':
          return cellValue >= filterValue && cellValue <= Number(model.filterTo);
        default:
          return true;
      }
    }

    // Date filter
    if (model.filterType === 'date') {
      const cellDate = value instanceof Date ? value : new Date(value);
      const filterDate = new Date(model.dateFrom);

      const cellTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();
      const filterTime = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime();

      switch (model.type) {
        case 'equals':
          return cellTime === filterTime;
        case 'notEqual':
          return cellTime !== filterTime;
        case 'greaterThan':
          return cellTime > filterTime;
        case 'lessThan':
          return cellTime < filterTime;
        case 'inRange': {
          const filterToDate = new Date(model.dateTo);
          const filterToTime = new Date(filterToDate.getFullYear(), filterToDate.getMonth(), filterToDate.getDate()).getTime();
          return cellTime >= filterTime && cellTime <= filterToTime;
        }
        default:
          return true;
      }
    }

    return true;
  }

  private applySorting(data: Employee[], sortModel: any[]): Employee[] {
    const sorted = [...data];

    sorted.sort((a, b) => {
      for (const sort of sortModel) {
        const field = sort.colId as keyof Employee;
        const dir = sort.sort === 'asc' ? 1 : -1;

        const valA = a[field];
        const valB = b[field];

        if (valA == null && valB == null) continue;
        if (valA == null) return dir;
        if (valB == null) return -dir;

        let comparison = 0;

        if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          comparison = String(valA).localeCompare(String(valB));
        }

        if (comparison !== 0) {
          return comparison * dir;
        }
      }
      return 0;
    });

    return sorted;
  }
}
