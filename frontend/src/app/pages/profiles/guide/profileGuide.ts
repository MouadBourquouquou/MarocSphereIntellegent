import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GuideService } from '../../../services/guide.service';
import { Guide } from '../../../models/api.models';
import { avatarUrl, fullName } from '../../../utils/display.utils';

@Component({
  selector: 'app-guide-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profileGuide.html',
  styleUrls: ['./profileGuide.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class profileGuide implements OnInit {
  private route = inject(ActivatedRoute);
  private guideService = inject(GuideService);

  isLoading = signal(true);
  errorMessage = signal('');
  guide = signal<Guide | null>(null);

  displayName = signal('');
  avatar = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('ID guide invalide.');
      this.isLoading.set(false);
      return;
    }

    this.guideService.getById(id).subscribe({
      next: (guide) => {
        this.guide.set(guide);
        const name = fullName(guide.prenom, guide.nom);
        this.displayName.set(name);
        this.avatar.set(avatarUrl(name));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Guide introuvable.');
        this.isLoading.set(false);
      },
    });
  }
}
