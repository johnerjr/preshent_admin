import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from 'src/app/shared/services';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../../../../constants/constant';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    constant: any = constant;
    name = '';

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService,
        public router: Router,
        private jwtService: JwtService,
        private userService: UserService,
        private toastr: ToastrService) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';

        this.getAdminDetail();
        this.jwtService.getUserData().subscribe(data => {
            this.name = data && data.firstName ? data.firstName : 'Admin';
        });

    }

    getAdminDetail() {
        this.userService.adminDetail().subscribe(
            res => {
                if (res.success) {
                    if (res.data) {
                        this.name = res.data.firstName;
                    }
                }
            },
            err => {
                this.toastr.error(
                    'Internal server error',
                    'Error!',
                    constant.ToastConfig
                );
            }
        );
    }


    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
