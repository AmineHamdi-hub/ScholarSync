import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { OutilService } from '../../services/tool.service';

@Component({
  selector: 'app-tool-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Source / Name</mat-label>
          <input matInput formControlName="source" placeholder="Tool name or source">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date Created</mat-label>
          <input matInput type="date" formControlName="dateCreation">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button *ngIf="data.tool" mat-button color="warn" [disabled]="submitting" (click)="onDelete()">Delete</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid || submitting" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class ToolFormDialogComponent {
  form: FormGroup;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ToolFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private outilService: OutilService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      source: [data.tool?.source || data.tool?.nom || '', Validators.required],
      dateCreation: [data.tool?.dateCreation || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if (!this.data.tool?.id) {
      this.snackBar.open('Cannot delete: missing tool id', 'Close', { duration: 5000 });
      return;
    }
    if (!confirm('Are you sure you want to delete this tool?')) return;
    this.submitting = true;
    this.outilService.deleteOutil(this.data.tool.id).subscribe({
      next: () => {
        this.snackBar.open('Tool deleted', 'Close', { duration: 3000 });
        this.dialogRef.close({ deleted: true });
      },
      error: (err: any) => {
        console.error('Error deleting tool:', err);
        this.snackBar.open('Error deleting tool', 'Close', { duration: 5000 });
        this.submitting = false;
      }
    });
  }

  onSave(): void {
    if (!this.form.valid) return;
    const payload = this.form.value;
    this.submitting = true;

    if (!this.data.tool) {
      this.outilService.addOutil(payload).subscribe({
        next: (created) => {
          this.snackBar.open('Tool created', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, tool: created });
        },
        error: (err: any) => {
          console.error('Error creating tool:', err);
          this.snackBar.open('Error creating tool', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    } else {
      const id = this.data.tool.id;
      this.outilService.updateOutil(id, payload).subscribe({
        next: (updated) => {
          this.snackBar.open('Tool updated', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, tool: updated });
        },
        error: (err: any) => {
          console.error('Error updating tool:', err);
          this.snackBar.open('Error updating tool', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    }
  }
} 
