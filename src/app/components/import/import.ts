import { Component } from '@angular/core';
import { ImportService } from '../../services/import/import';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './import.html',
  styleUrl: './import.css'
})
export class Import {
  selectedImport = 'accounts';
  importMessage = '';
importError = '';

  selectedFile: File | null = null;

  constructor(private importService: ImportService) {}

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.importMessage = '';
    this.importError = '';
  }
}

  importAccounts(): void {
  this.importMessage = '';
  this.importError = '';

  if (!this.selectedFile) {
    this.importError = 'Please choose a file first.';
    return;
  }

  this.importService.importAccounts(this.selectedFile).subscribe({
    next: (response) => {
      this.importMessage = response;
      this.selectedFile = null;
    },
    error: () => {
      this.importError = 'Import failed.';
    }
  });
}
}