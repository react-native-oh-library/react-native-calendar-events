/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Logger from './Logger';
import {BusinessError} from '@ohos.base';
import calendarManager from '@ohos.calendarManager';
import bundleManager from '@ohos.bundle.bundleManager';
import abilityAccessCtrl, { PermissionRequestResult, Permissions } from '@ohos.abilityAccessCtrl';

import {getCalendarType} from "./CalendarUtil"
import {EventDetails, Options} from './EventType'
import { TurboModule, TurboModuleContext } from 'rnoh/ts';
import {AuthorizationStatus, CalendarOptions } from './CalendarType';

import { TM } from '../../../../react_native_openharmony/generated/ts';

export const CALENDAR_EVENTS: string = "CalendarEventsView"
export let calendarMgr: calendarManager.CalendarManager | null = null;
let authorized: string = "authorized";
export class CalendarEventTurboModule extends TurboModule implements TM.RNCalendarEvents.Spec{
  constructor(ctx: TurboModuleContext) {
    super(ctx);
  }

  async checkAccessToken(permission: Permissions): Promise<abilityAccessCtrl.GrantStatus> {
    let grantStatus: abilityAccessCtrl.GrantStatus;
    let atManager = abilityAccessCtrl.createAtManager();
    // 获取应用程序的accessTokenID
    let tokenId: number;
    try {
      let bundleInfo: bundleManager.BundleInfo =
        await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (err) {
      console.error(`getBundleInfoForSelf failed, code is ${err.code}, message is ${err.message}`);
    }
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
    } catch (err) {
      console.error(`checkAccessToken failed, code is ${err.code}, message is ${err.message}`);
    }
    return grantStatus;
  }

  async checkPermissions(): Promise<AuthorizationStatus> {
    const permissions: Array<Permissions> = ['ohos.permission.READ_CALENDAR'];
    let grantStatus: abilityAccessCtrl.GrantStatus = await this.checkAccessToken(permissions[0]);
    if (grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
      console.log(`checkPermissions authorized`);
      return new Promise((resolve, reject) => {
        resolve("authorized");
      });
    }
    if (grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_DENIED) {
      console.log(`checkPermissions denied`);
      return new Promise((resolve, reject) => {
        resolve("denied");
      });
    }
  }

  //requestPermiss
  async requestPermissionsAsync(): Promise<PermissionRequestResult> {
    let atManager = abilityAccessCtrl.createAtManager();
    let permissionRequestResult : PermissionRequestResult = null;
    const permissions: Permissions[] = ['ohos.permission.READ_CALENDAR', 'ohos.permission.WRITE_CALENDAR'];
    await atManager.requestPermissionsFromUser(this.ctx.uiAbilityContext, permissions).then(
      (result: PermissionRequestResult) => {
        permissionRequestResult = result;
      }).catch((error: BusinessError) => {
      console.error(`requestPermissionsAsync failed, code is ${error.code}, message is ${error.message}`);
    })
    return new Promise((resolve, reject) => {
      resolve(permissionRequestResult);
    });;
  }

  async requestPermissions(): Promise<AuthorizationStatus> {
    let permissionRequestResult: PermissionRequestResult = await this.requestPermissionsAsync();
    console.log(`requestPermissions result =` + permissionRequestResult.permissions);
    return await this.checkPermissions()
  }

  //findCalendars
  async findCalendarsAsync(): Promise<calendarManager.Calendar[]> {
    let calendar : calendarManager.Calendar[] | undefined = undefined;
    calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
    await calendarMgr.getAllCalendars().then(async (calendarData:calendarManager.Calendar[])=>{
      calendar = calendarData
    })
    return new Promise((resolve, reject) => {
      resolve(calendar);
    });
  }

  async findCalendars(): Promise<CalendarOptions[]> {
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      let calendarResult : CalendarOptions[] = []
      let data: calendarManager.Calendar[] = await this.findCalendarsAsync();
      if (data && data.length > 0) {
        data.forEach(item => {
          calendarResult.push(new CalendarOptions(item.id.toString(), item.getAccount().name, item.getAccount().type))
        })
      }
      return new Promise((resolve, reject) => {
        resolve(calendarResult);
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve([]);
      });
    }
  }

  //saveCalendar
  async saveCalendarAsync(calendarOptions: CalendarOptions): Promise<string> {
    let saveCalendarBool : boolean = false;
    let calendar : calendarManager.Calendar | undefined = undefined;
    const calendarAccount: calendarManager.CalendarAccount = {
      name: calendarOptions.title,
      type: getCalendarType(calendarOptions.type),
      displayName: calendarOptions.displayName != undefined ? calendarOptions.displayName : ""
    };
    calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
    await calendarMgr.createCalendar(calendarAccount).then((data: calendarManager.Calendar) => {
      saveCalendarBool = true
      calendar = data;
    }).catch((error : BusinessError) => {
      console.error(`saveCalendarAsync Failed to add event, err -> ${JSON.stringify(error)} `);
    });
    return new Promise((resolve) => {
      resolve(calendar.id.toString());
    });
  }

  async saveCalendar(calendarOptions: CalendarOptions): Promise<boolean> {
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      let saveCalendarId: string = await this.saveCalendarAsync(calendarOptions);
      if(saveCalendarId) {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    }
    return new Promise((resolve) => {
      resolve(false);
    });
  }

  //removeCalendar
  async removeCalendarAsync(id: string): Promise<Boolean> {
    let removeCalendarBool : boolean = false;
    let calendar : calendarManager.Calendar | undefined = undefined;
    //根据id，查询calendar
    let findCalendarById : CalendarOptions | null;
    (await this.findCalendars()).forEach(item => {
      if (item.id.toString() == id && item.title != "phone") {
        findCalendarById = item
      }
    })
    if (findCalendarById) {
      const calendarAccount: calendarManager.CalendarAccount = {
        name: findCalendarById.title,
        type: getCalendarType(findCalendarById.type)
      };
      calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
      await calendarMgr?.getCalendar(calendarAccount).then(async (calendarData:calendarManager.Calendar) => {
        calendar = calendarData;
        await calendarMgr?.deleteCalendar(calendarData).then(() => {
          removeCalendarBool = true
        }).catch((err: BusinessError) => {
          console.error(`removeCalendarAsync Failed to remove calendar, err -> ${JSON.stringify(err)}`);
        });
      })
      return new Promise((resolve) => {
        resolve(removeCalendarBool);
      });
    } else {
      return new Promise((resolve) => {
        console.log(`removeCalendarAsync false, calendar is not exist`);
        resolve(false);
      });
    }
  }

  async removeCalendar(id: string): Promise<string> {
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      let saveCalendarBool: Boolean = await this.removeCalendarAsync(id);
      if (saveCalendarBool) {
        return new Promise((resolve) => {
          resolve("success");
        });
      }
    }
    return new Promise((resolve, reject) => {
      resolve("fail");
    });
  }

  //findEventById
  async findEventById(id: string): Promise<calendarManager.Event | null> {
    let calendar : calendarManager.Calendar | undefined = undefined;
    let event : calendarManager.Event = undefined
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
      await calendarMgr?.getCalendar().then(async (dataCalendar:calendarManager.Calendar) => {
        calendar = dataCalendar;
        const filter = calendarManager.EventFilter.filterById([Number.parseFloat(id)]);
        await calendar.getEvents(filter).then((dataEvent: calendarManager.Event[]) => {
          if (dataEvent && dataEvent.length >= 1) {
            event = dataEvent[0]
          }
        }).catch((err: BusinessError) => {
          console.error(`Failed to get events, err -> ${JSON.stringify(err)}`);
        });
      });
    }
    return new Promise((resolve, reject) => {
      resolve(event);
    });
  }

  //fetchAllEvents
  async fetchAllEventsAsync(startDate: string, endDate: string,
                            calendarIds?: string[]) : Promise<calendarManager.Event[]> {
    let calendar : calendarManager.Calendar | undefined = undefined;
    let event : calendarManager.Event[] = []
    calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
    await calendarMgr?.getCalendar().then(async (dataCalendar: calendarManager.Calendar) => {
      calendar = dataCalendar;
      console.info(`fetchAllEventsAsync Succeeded to get calendar666, data -> ${JSON.stringify(dataCalendar)}`);
      const eventFilter = calendarManager.EventFilter;
      let filter = null;
      if (calendarIds && calendarIds.length > 0) {
        filter = eventFilter.filterById(calendarIds.map(Number));
      } else {
        filter = eventFilter.filterByTime(Number.parseFloat(startDate), Number.parseFloat(endDate))
      }
      await calendar.getEvents(filter).then((dataEvent: calendarManager.Event[]) => {
        console.info(`fetchAllEventsAsync Succeeded to get events, data -> ${JSON.stringify(dataEvent)}`);
        event = dataEvent
      }).catch((err: BusinessError) => {
        console.error(`fetchAllEventsAsync Failed to get events, err -> ${JSON.stringify(err)}`);
      });
    });
    return new Promise((resolve, reject) => {
      resolve(event);
    });
  }

  async fetchAllEvents(startDate: string, endDate: string, calendarIds?: string[]): Promise<calendarManager.Event[]> {
    let checkPermission: string = await this.checkPermissions();
    let event: calendarManager.Event[] = []
    if (checkPermission == authorized) {
      event = await this.fetchAllEventsAsync(startDate, endDate, calendarIds)
    }
    return new Promise((resolve, reject) => {
      resolve(event);
    });
  }

  //saveEvent
  async saveEventAsync(events: calendarManager.Event): Promise<Boolean> {
    let saveCalendarBool : boolean = false;
    let calendar : calendarManager.Calendar | undefined = undefined;
    calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
    await calendarMgr?.getCalendar().then(async (calendarData:calendarManager.Calendar) => {
      console.info(`saveEventAsync Succeeded to get calendar, data -> ${JSON.stringify(calendarData)}`);
      calendar = calendarData;
      await calendar?.addEvent(events).then((data: number) => {
        saveCalendarBool = true
      }).catch((err: BusinessError) => {
        console.error(`saveCalendarAsync Failed to add event, err -> ${JSON.stringify(err)} `);
      });
    })
    return new Promise((resolve) => {
      resolve(saveCalendarBool);
    });
  }

  async saveEvent(title: string, details: EventDetails, options?: Options): Promise<String> {
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      const event: calendarManager.Event = details;
      let saveCalendarBool: Boolean = await this.saveEventAsync(event);
      if (saveCalendarBool) {
        return new Promise((resolve) => {
          resolve("success");
        });
      }
    }
    return new Promise((resolve, reject) => {
      resolve("fail");
    });
  }

  //removeEvent
  async removeEventAsync(id: string, options?: Options): Promise<Boolean> {
    let removeCalendarBool : boolean = false;
    let calendar : calendarManager.Calendar | undefined = undefined;
    calendarMgr = calendarManager.getCalendarManager(this.ctx.uiAbilityContext);
    await calendarMgr?.getCalendar().then(async (calendarData:calendarManager.Calendar) => {
      calendar = calendarData;
      await calendar?.deleteEvent(Number.parseFloat(id)).then(() => {
        removeCalendarBool = true
      }).catch((err: BusinessError) => {
        console.error(`removeEventAsync Failed to delete event, err -> ${JSON.stringify(err)}`);
      });
    })
    return new Promise((resolve) => {
      resolve(removeCalendarBool);
    });
  }

  async removeEvent(id: string): Promise<string> {
    let checkPermission: string = await this.checkPermissions();
    if (checkPermission == authorized) {
      let saveCalendarBool: Boolean = await this.removeEventAsync(id);
      if (saveCalendarBool) {
        return new Promise((resolve) => {
          resolve("success");
        });
      }
    }
    return new Promise((resolve, reject) => {
      resolve("fail");
    });
  }
}