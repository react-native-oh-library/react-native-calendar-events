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

import calendarManager from '@ohos.calendarManager';
import { CalendarEventWritable, EventDetails, Options} from './EventType';
import Logger from './Logger';

export function getCalendarType(type: string): calendarManager.CalendarType {
  if (type == 'local') {
    return calendarManager.CalendarType.LOCAL
  }
  if (type == 'email') {
    return calendarManager.CalendarType.EMAIL
  }
  if (type == 'birthday') {
    return calendarManager.CalendarType.BIRTHDAY
  }
  if (type == 'caldav') {
    return calendarManager.CalendarType.CALDAV
  }
  if (type == 'subscribed') {
    return calendarManager.CalendarType.SUBSCRIBED
  }
  return calendarManager.CalendarType.LOCAL
}

export function dataConversion(title:string,calendarEventWritable: CalendarEventWritable,eventDetails:EventDetails, options?: Options): EventDetails {
  if (title != null) {
    eventDetails.setTitle(title)
  }
  if (calendarEventWritable) {
    if (calendarEventWritable.id != null && calendarEventWritable.id.trim().length > 0) {
      eventDetails.setId(calendarEventWritable.id)
    } else {
      eventDetails.setId(new Date().getTime().toString())
    }
    if (calendarEventWritable.location != null) {
      eventDetails.setLocation(calendarEventWritable.location)
    }
    if (calendarEventWritable.startDate != null && calendarEventWritable.startDate.trim().length > 0) {
      eventDetails.setStartTime((new Date(calendarEventWritable.startDate)).getTime())
      if (calendarEventWritable.endDate != null && calendarEventWritable.endDate.trim().length > 0) {
        eventDetails.setEndTime((new Date(calendarEventWritable.endDate)).getTime())
      } else {//取开始时间加一个小时
        eventDetails.setEndTime((new Date(calendarEventWritable.startDate)).getTime() + 1000 * 60 * 60)
      }
    } else {
      Logger.error("add event require `startDate`");
    }
    if (calendarEventWritable.allDay != null) {
      eventDetails.setIsAllDay(calendarEventWritable.allDay)
    }
    if (calendarEventWritable.timeZone != null) {
      eventDetails.setTimeZone(calendarEventWritable.timeZone)
    }
    if (calendarEventWritable.recurrenceRule != null) {
      eventDetails.setRecurrenceRule(calendarEventWritable.recurrenceRule)
    }
    if (calendarEventWritable.description != null) {
      eventDetails.setDescription(calendarEventWritable.description)
    }
  }
  return eventDetails
}