import { Component } from '@angular/core';
import {HcModal, ModalOptions, ModalService} from '@healthcatalyst/cashmere';
import { AboutModalComponent } from './modals/about-modal/about-modal.component';
import { NewsModalComponent } from './modals/news-modal/news-modal.component';

@Component({
  selector: 'pro-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = "profile-page"
  username = 'Ash Ketchum';
  organization = 'Indigo Plateau';
  result: unknown;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  openAboutModal(): void { 
    const options: ModalOptions = {
        data:'About',
        ignoreOverlayClick: true,
        size: 'lg'
    };

    const subModal: HcModal<AboutModalComponent> = this.modalService.open(AboutModalComponent, options);
    subModal.result.subscribe(res => (this.result = res));
  };

  openNewsModal(): void { 
    const newsOptions: ModalOptions = {
      data:'news',
      ignoreOverlayClick: true,
      size: 'lg'
    };

    const newsSubModal: HcModal<NewsModalComponent> = this.modalService.open(NewsModalComponent, newsOptions);
    newsSubModal.result.subscribe(res => (this.result = res));
  };
}