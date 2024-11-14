import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit {
  @Input() imageId!: number;  // Pass the image ID from the parent component
  imageUrl: string | undefined;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    if (this.imageId) {
      this.imageUrl = this.imageService.getImageUrl(this.imageId);
    }
  }
}
