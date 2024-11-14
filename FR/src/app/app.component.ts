import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageService } from './services/image.service';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  imageId: number = 1;
  imageUrl: string | undefined;
  selectedFile: File | null = null;
  uploadResult: string = '';
  uploading: boolean = false;
  images: any[] = [];

  http = inject(HttpClient)

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImage(this.imageId);
    this.http.get('https://localhost:7251/api/Image').subscribe((res: any)=>{
      this.images = res;
      console.log(res);
    })
  }

  loadImage(id: number): void {
    this.imageUrl = this.imageService.getImageUrl(id);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.uploading = true;
      this.imageService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          this.uploading = false;
          this.uploadResult = `File uploaded successfully: ${response.fileName}`;
          this.loadImage(response.id);
        },
        (error) => {
          this.uploading = false;
          this.uploadResult = 'File upload failed';
          console.error(error);
        }
      );
    }
  }

  onUpdate(): void {
    if (this.selectedFile && this.imageId) {
      this.uploading = true;
      this.imageService.updateImage(this.imageId, this.selectedFile).subscribe(
        (response) => {
          this.uploading = false;
          this.uploadResult = `File updated successfully: ${response.fileName}`;
          this.loadImage(this.imageId);
        },
        (error) => {
          this.uploading = false;
          this.uploadResult = 'File update failed';
          console.error(error);
        }
      );
    }
  }

  onDelete(): void {
    if (this.imageId) {
      this.imageService.deleteImage(this.imageId).subscribe(
        () => {
          this.uploadResult = `Image with ID ${this.imageId} deleted successfully.`;
          this.imageUrl = undefined;
        },
        (error) => {
          this.uploadResult = 'Image deletion failed';
          console.error(error);
        }
      );
    }
  }
}