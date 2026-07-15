import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArtisanService } from '../../../services/artisan.service';
import { Artisan } from '../../../models/api.models';
import { avatarUrl, fullName } from '../../../utils/display.utils';

@Component({
  selector: 'app-artisan-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profileArtisan.html',
  styleUrls: ['./profileArtisan.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class profileArtisan implements OnInit {
  private route = inject(ActivatedRoute);
  private artisanService = inject(ArtisanService);

  isLoading = signal(true);
  errorMessage = signal('');
  artisan = signal<Artisan | null>(null);

  displayName = signal('');
  avatar = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('ID artisan invalide.');
      this.isLoading.set(false);
      return;
    }

    this.artisanService.getById(id).subscribe({
      next: (artisan) => {
        this.artisan.set(artisan);
        const name = fullName(artisan.prenom, artisan.nom);
        this.displayName.set(name);
        this.avatar.set(avatarUrl(name));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Artisan introuvable.');
        this.isLoading.set(false);
      },
    });
  }
}
