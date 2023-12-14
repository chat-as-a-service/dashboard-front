import { makeAutoObservable, runInAction } from 'mobx';
import { AccountRes } from '../types/account';
import { ApplicationListRes, ApplicationViewRes } from '../types/application';
import { OrganizationViewRes } from '../types/organization';
import { UserListRes } from '../types/user';

class CommonStore {
  private _account: AccountRes | null = null;
  private _applications: ApplicationListRes[] = [];
  private _selectedApplication: ApplicationViewRes | null = null;
  private _organization: OrganizationViewRes | null = null;
  private _appSidebarCollapsed: boolean = false;
  private _appRootLayoutNoPadding: boolean = false;
  private _moderator: UserListRes | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    runInAction(() => {
      this._account = null;
      this._applications = [];
      this._selectedApplication = null;
      this._organization = null;
      this._appSidebarCollapsed = false;
      this._appRootLayoutNoPadding = false;
    });
  }

  get accountFullName() {
    return `${this._account?.first_name} ${this._account?.last_name}`;
  }

  set account(value: AccountRes | null) {
    this._account = value;
  }

  set applications(value: ApplicationListRes[]) {
    this._applications = value;
  }

  set selectedApplication(value: ApplicationViewRes | null) {
    this._selectedApplication = value;
  }

  set organization(value: OrganizationViewRes | null) {
    this._organization = value;
  }

  set appSidebarCollapsed(value: boolean) {
    this._appSidebarCollapsed = value;
  }

  set appRootLayoutNoPadding(value: boolean) {
    this._appRootLayoutNoPadding = value;
  }

  get account(): AccountRes | null {
    return this._account;
  }

  get applications(): ApplicationListRes[] {
    return this._applications;
  }

  get selectedApplication(): ApplicationViewRes | null {
    return this._selectedApplication;
  }

  get organization(): OrganizationViewRes | null {
    return this._organization;
  }

  get appSidebarCollapsed(): boolean {
    return this._appSidebarCollapsed;
  }

  get appRootLayoutNoPadding(): boolean {
    return this._appRootLayoutNoPadding;
  }

  get moderator(): UserListRes | null {
    return this._moderator;
  }

  set moderator(value: UserListRes | null) {
    this._moderator = value;
  }
}

export default CommonStore;
