import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToCsv(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    csvRows.push(headers.map((h) => this.escapeCsvValue(h)).join(','));

    for (const row of data) {
      const values = headers.map((header) =>
        this.escapeCsvValue(row[header] ?? '')
      );
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
  }

  exportToExcel(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);

    const xmlRows = data
      .map((row) => {
        const cells = headers
          .map((header) => {
            const value = row[header] ?? '';
            const type = typeof value === 'number' ? 'Number' : 'String';
            const escaped = String(value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
            return `<Cell><Data ss:Type="${type}">${escaped}</Data></Cell>`;
          })
          .join('');
        return `<Row>${cells}</Row>`;
      })
      .join('');

    const headerRow = headers
      .map((h) => {
        const escaped = h
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
        return `<Cell><Data ss:Type="String">${escaped}</Data></Cell>`;
      })
      .join('');

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      <Row>${headerRow}</Row>
      ${xmlRows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], {
      type: 'application/vnd.ms-excel',
    });
    this.downloadFile(
      blob,
      filename.endsWith('.xls') || filename.endsWith('.xlsx')
        ? filename
        : `${filename}.xls`
    );
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  private escapeCsvValue(value: unknown): string {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
