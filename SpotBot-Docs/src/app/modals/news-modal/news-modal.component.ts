import { Component, OnInit } from '@angular/core';
import {ActiveModal} from '@healthcatalyst/cashmere';

@Component({
  selector: 'pkutil-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss']
})
export class NewsModalComponent implements OnInit {

  constructor(public activeModal: ActiveModal) {}

  ngOnInit(): void {
  }

  close(): void {
      this.activeModal.close();
  }

  cancel(): void {
      this.activeModal.dismiss();
  }
}
