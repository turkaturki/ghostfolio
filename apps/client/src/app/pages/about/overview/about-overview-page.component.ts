import { DataService } from '@ghostfolio/client/services/data.service';
import { UserService } from '@ghostfolio/client/services/user/user.service';
import { User } from '@ghostfolio/common/interfaces';
import { paths } from '@ghostfolio/common/paths';
import { hasPermission, permissions } from '@ghostfolio/common/permissions';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gf-about-overview-page',
  styleUrls: ['./about-overview-page.scss'],
  templateUrl: './about-overview-page.html',
  standalone: false
})
export class AboutOverviewPageComponent implements OnDestroy, OnInit {
  public hasPermissionForStatistics: boolean;
  public hasPermissionForSubscription: boolean;
  public isLoggedIn: boolean;
  public routerLinkBlog = ['/' + paths.blog];
  public routerLinkFaq = ['/' + paths.faq];
  public routerLinkFeatures = ['/' + paths.features];
  public routerLinkOpenStartup = ['/' + paths.openStartup];
  public user: User;

  private unsubscribeSubject = new Subject<void>();

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    private userService: UserService
  ) {
    const { globalPermissions } = this.dataService.fetchInfo();

    this.hasPermissionForStatistics = hasPermission(
      globalPermissions,
      permissions.enableStatistics
    );

    this.hasPermissionForSubscription = hasPermission(
      globalPermissions,
      permissions.enableSubscription
    );
  }

  public ngOnInit() {
    this.userService.stateChanged
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;

          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
