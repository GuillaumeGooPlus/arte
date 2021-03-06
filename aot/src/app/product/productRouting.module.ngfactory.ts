/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride}
 */
 /* tslint:disable */


import * as import0 from '@angular/core';
import * as import1 from '../../../../src/app/product/productRouting.module';
import * as import2 from '@angular/router';
import * as import3 from './products.component.ngfactory';
import * as import4 from './admin/productsAdmin.component.ngfactory';
import * as import5 from './productSingle.component.ngfactory';
import * as import6 from './productEdit.component.ngfactory';
import * as import7 from '../../../../src/app/product/products.component';
import * as import8 from '../../../../src/app/product/admin/productsAdmin.component';
import * as import9 from '../../../../src/app/admin/services/adminGuard';
import * as import10 from '../../../../src/app/product/productSingle.component';
import * as import11 from '../../../../src/app/product/productEdit.component';
class ProductRoutingInjector extends import0.ɵNgModuleInjector<import1.ProductRouting> {
  _RouterModule_0:import2.RouterModule;
  _ProductRouting_1:import1.ProductRouting;
  _ROUTES_2:any[];
  constructor(parent:import0.Injector) {
    super(parent,[
      import3.ProductsComponentNgFactory,
      import4.ProductsAdminComponentNgFactory,
      import5.ProductSingleComponentNgFactory,
      import6.ProductEditComponentNgFactory
    ]
    ,([] as any[]));
  }
  createInternal():import1.ProductRouting {
    this._RouterModule_0 = new import2.RouterModule(this.parent.get(import2.ɵa,(null as any)),this.parent.get(import2.Router,(null as any)));
    this._ProductRouting_1 = new import1.ProductRouting();
      this._ROUTES_2 = [[
        {
          path: '',
          component: import7.ProductsComponent
        }
        ,
        {
          path: 'admin',
          component: import8.ProductsAdminComponent,
          canActivate: [import9.AdminGuardService]
        }
        ,
        {
          path: ':id',
          component: import10.ProductSingleComponent
        }
        ,
        {
          path: 'productEdit/:id',
          component: import11.ProductEditComponent,
          canActivate: [import9.AdminGuardService]
        }

      ]
    ];
    return this._ProductRouting_1;
  }
  getInternal(token:any,notFoundResult:any):any {
    if ((token === import2.RouterModule)) { return this._RouterModule_0; }
    if ((token === import1.ProductRouting)) { return this._ProductRouting_1; }
    if ((token === import2.ROUTES)) { return this._ROUTES_2; }
    return notFoundResult;
  }
  destroyInternal():void {
  }
}
export const ProductRoutingNgFactory:import0.NgModuleFactory<import1.ProductRouting> = new import0.NgModuleFactory<any>(ProductRoutingInjector,import1.ProductRouting);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiL1VzZXJzL2FsYW4vYXBwL2FsZXMvc2Fsb24vc3JjL2FwcC9wcm9kdWN0L3Byb2R1Y3RSb3V0aW5nLm1vZHVsZS5uZ2ZhY3RvcnkudHMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9Vc2Vycy9hbGFuL2FwcC9hbGVzL3NhbG9uL3NyYy9hcHAvcHJvZHVjdC9wcm9kdWN0Um91dGluZy5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiICJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
