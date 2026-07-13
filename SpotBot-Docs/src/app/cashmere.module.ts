import { NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    ListModule,
    TileModule,
    NavbarModule,
    AppSwitcherModule,
    IconModule,
    PopModule,
    ButtonModule,
    AccordionModule,
    ModalModule,
    BannerModule,
    FormFieldModule,
    SelectModule,
} from '@healthcatalyst/cashmere';

@NgModule({
  exports: [
    TileModule,
    ListModule,
    NavbarModule,
    AppSwitcherModule,
    IconModule,
    PopModule,
    ButtonModule,
    AccordionModule,
    ModalModule,
    BannerModule,
    FormFieldModule,
    SelectModule
  ],
  providers: [
    FormControl
  ]
})
export class CashmereModule {}
