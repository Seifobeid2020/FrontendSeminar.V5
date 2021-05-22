import { NgModule } from '@angular/core';

import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { RedirectToLoginComponent } from './redirect-to-login.component';

@NgModule({
  imports: [LayoutRoutingModule],
  declarations: [LayoutComponent, RedirectToLoginComponent],
})
export class LayoutModule {}
