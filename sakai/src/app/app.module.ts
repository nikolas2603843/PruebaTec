import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './PruebaTec/components/notfound/notfound.component';
import { ProductService } from './PruebaTec/service/product.service';
import { CountryService } from './PruebaTec/service/country.service';
import { CustomerService } from './PruebaTec/service/customer.service';
import { EventService } from './PruebaTec/service/event.service';
import { IconService } from './PruebaTec/service/icon.service';
import { NodeService } from './PruebaTec/service/node.service';
import { PhotoService } from './PruebaTec/service/photo.service';
import { ListsService } from './PruebaTec/service/lists.service';


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ListsService,
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
