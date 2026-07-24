import { Injectable } from '@angular/core';
import { Experience, Produit } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly experiences: Experience[] = [
    {
      id: 1,
      title: 'Medina Walking Tour — Fez el-Bali',
      summary: 'Explore the world’s largest medieval medina with a certified local guide.',
      description:
        'Step back in time to explore the world’s largest active medieval urban area. Discover ancient tanneries, souks, and madrasas while tasting local street food, visiting artisan corners, and hearing the stories behind Fez’s oldest landmarks.',
      location: 'Fez, Morocco',
      category: 'Cultural',
      guideId: 1,
      duration: '4 Hours',
      difficulty: 'Easy',
      price: 450,
      rating: 4.9,
      reviewsCount: 124,
      gallery: [
        'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639701553-a7d2cd36-esperiences.jpeg',
        'https://uxmagic.blob.core.windows.net/public/agent-images/img-hero-1784639979967-ysvckqe6hz.png',
        'https://uxmagic.blob.core.windows.net/public/agent-images/img-sahara-1784639991921-8uj7kkae2l6.png',
      ],
      includedServices: ['Certified guide', 'Local food tasting', 'Entrance fees', 'Photo highlights'],
      availableDates: ['2026-10-12', '2026-10-16', '2026-10-20'],
      meetingPoint: 'Bab Boujloud (Blue Gate), Fez',
      mapImageUrl:
        'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639721014-135f69dd-image.png',
      reviewHighlights: ['Amazing cultural immersion', 'Excellent guide knowledge', 'Perfect pace for families'],
      image: 'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639701553-a7d2cd36-esperiences.jpeg',
      note: 4.9,
      reservationsNumber: 124,
      statut: 'PUBLISHED',
      creationDate: '2026-01-05',
    },
    {
      id: 2,
      title: 'Sahara Sunrise Camel Trek & Luxury Camp',
      summary: 'Ride camels across Erg Chebbi, dine by the dunes, and sleep in a luxury desert camp.',
      description:
        'Experience the magic of the Sahara with a sunrise camel trek, an authentic Berber tent dinner, and a luxury overnight stay in the dunes. This premium package includes transfers, a private guide, and exclusive desert hospitality.',
      location: 'Merzouga, Morocco',
      category: 'Adventure',
      guideId: 2,
      duration: '2 Days, 1 Night',
      difficulty: 'Moderate',
      price: 1800,
      rating: 5.0,
      reviewsCount: 310,
      gallery: [
        'https://uxmagic.blob.core.windows.net/public/agent-images/img-sahara-1784639991921-8uj7kkae2l6.png',
        'https://uxmagic.blob.core.windows.net/public/agent-images/img-hero-1784639979967-ysvckqe6hz.png',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=150&q=80',
      ],
      includedServices: ['Camel trek', 'Luxury camp', 'Dinner & breakfast', 'Sunrise photography'],
      availableDates: ['2026-11-05', '2026-11-12', '2026-11-18'],
      meetingPoint: 'Erg Chebbi Dunes Reception, Merzouga',
      mapImageUrl:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=150&q=80',
      reviewHighlights: ['Perfect desert evening', 'Memorable stars and campfire', 'Comfortable luxury experience'],
      image: 'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639701553-a7d2cd36-esperiences.jpeg',
      note: 4.9,
      reservationsNumber: 124,
      statut: 'PUBLISHED',
      creationDate: '2026-01-05',
    },
    {
      id: 3,
      title: 'Marrakech Rooftop Tagine Cooking Class',
      summary: 'Cook a traditional tagine and enjoy a rooftop sunset tasting in the Medina.',
      description:
        'Begin with a guided visit to Jemaa el-Fnaa market to gather fresh spices and produce, then learn to prepare an authentic tagine with a local chef. Finish with a rooftop dinner overlooking Marrakech’s historic skyline.',
      location: 'Marrakech, Morocco',
      category: 'Culinary',
      guideId: 3,
      duration: '3.5 Hours',
      difficulty: 'Easy',
      price: 650,
      rating: 4.8,
      reviewsCount: 88,
      gallery: [
        'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639701553-a7d2cd36-esperiences.jpeg',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
      ],
      includedServices: ['Market tour', 'Cooking ingredients', 'Chef-led class', 'Dinner and tea'],
      availableDates: ['2026-10-10', '2026-10-14', '2026-10-21'],
      meetingPoint: 'Jemaa el-Fnaa Square, Marrakech',
      mapImageUrl:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=150&q=80',
      reviewHighlights: ['Delicious local cooking class', 'Beautiful rooftop setting', 'Great for groups and couples'],
      image: 'https://uxmagic.blob.core.windows.net/public/project-documents/6a5f6e376789929bcca63504/el.hayouni.fatiha_gmail.com/1784639701553-a7d2cd36-esperiences.jpeg',
      note: 4.9,
      reservationsNumber: 124,
      statut: 'PUBLISHED',
      creationDate: '2026-01-05',
    },
  ];

  private readonly products: Produit[] = [
    {
      id: 101,
      nom: 'Handcrafted Filigree Brass Lantern',
      description:
        'A fine brass lantern hand-finished by Fez artisans using traditional filigree techniques and aged patina.',
      categorie: 'Home Decor',
      prix: 1200,
      stock: 3,
      disponibilite: 'In Stock',
      note: 4.9,
      nbCommandes: 34,
      imageUrl:
        'https://uxmagic.blob.core.windows.net/public/agent-images/img-artisan-1784640002551-cl5twub8c5e.png',
      materiels: 'Brass, glass, solder, natural patina',
      processFabrication: 'Cut, solder, polish, and hand patina finished by master brass artisans.',
      artisanId: 11,
      dateCreation: '2026-01-08',
    },
    {
      id: 102,
      nom: 'Authentic Hand-Woven Beni Ourain Rug',
      description:
        'A luxurious, hand-woven wool rug from the High Atlas made by women artisans in Taznakht.',
      categorie: 'Textiles',
      prix: 4500,
      stock: 0,
      disponibilite: 'Out of Stock',
      note: 5.0,
      nbCommandes: 18,
      imageUrl:
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
      materiels: 'Pure sheep wool, natural dyes',
      processFabrication: 'Hand-spun wool, hand-dyed with natural pigments, then woven using traditional Berber techniques.',
      artisanId: 12,
      dateCreation: '2026-02-15',
    },
    {
      id: 103,
      nom: 'Organic Culinary & Cosmetic Argan Oil Set',
      description:
        'A premium set of organic argan oil products for both kitchen and skincare, sourced from southern Morocco.',
      categorie: 'Beauty & Wellness',
      prix: 350,
      stock: 12,
      disponibilite: 'In Stock',
      note: 4.8,
      nbCommandes: 56,
      imageUrl:
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
      materiels: 'Organic argan oil, glass bottle, cork cap',
      processFabrication: 'Cold-pressed and bottled by cooperative artisans in Essaouira using sustainable practices.',
      artisanId: 13,
      dateCreation: '2026-03-10',
    },
  ];

  getExperiences(): Experience[] {
    return [...this.experiences];
  }

  getExperienceById(experienceId: number): Experience | undefined {
    return this.experiences.find((experience) => experience.id === experienceId);
  }

  getProducts(): Produit[] {
    return [...this.products];
  }

  getProductById(productId: number): Produit | undefined {
    return this.products.find((product) => product.id === productId);
  }
}
