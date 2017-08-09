import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule} from '@angular/router';

// import { NotificationDetailUsersComponent} from './notificationDetailUsers.component';
// import { AddUserByNotificationComponent} from './addUser/addUserByNotification.component';
import { NotificationsComponent} from './notifications/notifications.component';
import { NotificationComponent} from './single/notification.component';
// import { EditAddUserToNotificationComponent} from './addUser/editAddUserToNotification.component';

import { NotificationService} from './notification.service';
import { NotificationRouting} from './notificationRouting.module';
import { MaterialModule } from '@angular/material';
import { Ng2PaginationModule} from 'ng2-pagination';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports:      [
    NotificationRouting,
    CommonModule,
    FormsModule,
    MaterialModule,
    Ng2PaginationModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    // NotificationDetailUsersComponent,
    NotificationsComponent,
    NotificationComponent,
    // EditAddUserToNotificationComponent,
    NotificationComponent,

    // AddUserByNotificationComponent,
  ],
  exports:      [ ],
  providers:    [ NotificationService ],
  entryComponents: [

  ]
})
export class NotificationModule { }