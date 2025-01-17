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
import { Calendar } from './CalendarType';

type ISODateString = string;
export type AuthorizationStatus =
  | "denied"
  | "restricted"
  | "authorized"
  | "undetermined";
export type RecurrenceFrequencySourceLibrary = "daily" | "weekly" | "monthly" | "yearly";
class CalendarEventBase {
  startDate: ISODateString;
  endDate?: ISODateString;
  calendarId?: string;
  allDay?: boolean;
  recurrence?: RecurrenceFrequencySourceLibrary;
  location?: string;
  structuredLocation?: AlarmStructuredLocation;
  isDetached?: boolean;
  url?: string;
  notes?: string;
  description?: string;
  timeZone?: string;
}

export class CalendarEventReadable extends CalendarEventBase {
  id: string;
  title: string;
  attendees?: Attendee[];
  calendar?: Calendar;
  occurrenceDate?: ISODateString;
  alarms?: Array<Alarm<ISODateString>>;
}

export class CalendarEventWritable extends CalendarEventBase {
  id?: string;
  recurrenceRule?: RecurrenceRuleSourceLibrary;
  alarms?: Array<Alarm<ISODateString | number>>;
}


class RecurrenceRuleSourceLibrary {
  frequency: RecurrenceFrequencySourceLibrary;
  endDate: ISODateString;
  occurrence: number;
  interval: number;
  setFrequency(frequency: string) {
    switch (frequency.toLowerCase()){
      case "daily" :
        this.frequency = "daily";
        break;
      case "weekly":
        this.frequency = "weekly";
        break;
      case "monthly" :
        this.frequency = "monthly";
        break;
      case "yearly":
        this.frequency = "yearly";
        break;
      default :
          this.frequency = "daily";
    }
  }
}

interface Alarm<D = ISODateString | number> {
  date: D;
  structuredLocation?: AlarmStructuredLocation;
}

interface AlarmStructuredLocation {
  title: string;
  proximity: "enter" | "leave" | "none";
  radius: number;
  coords: { latitude: number; longitude: number };
}

interface Attendee {
  name: string;
  email: string;
  phone?: string;
}

export interface Options {
  /** The start date of a recurring event's exception instance. Used for updating single event in a recurring series. */
  exceptionDate?: ISODateString;
  /** iOS ONLY - If true the update will span all future events. If false it only update the single instance. */
  futureEvents?: boolean;
  /** ANDROID ONLY - If true, can help avoid syncing issues */
  sync?: boolean;
}

//harmony event attribute
export class EventDetails {
  id?: number;
  type: EventType = EventType.NORMAL;
  title?: string;
  location?: Location;
  startTime: number = new Date().getTime();
  endTime: number = this.startTime + 1000 * 60 * 60;
  isAllDay?: boolean;
  attendee?: Attendee[];
  timeZone?: string;
  reminderTime?: number[]; //no usages   recurrenceFrequency
  recurrenceRule?: RecurrenceRule;
  description?: string;
  service?: EventService;//no usages

  setId(id : string) { this.id = Number.parseFloat(id) }

  setType(type : number) { this.type = (type == EventType.NORMAL.valueOf() ? EventType.NORMAL :  EventType.IMPORTANT)}

  setTitle(title : string) { this.title = title }

  setLocation(location : string) { this.location = new Location(location) }

  setStartTime(startTime : number) { this.startTime = startTime }

  setEndTime(endTime : number) { this.endTime = endTime }

  setIsAllDay(isAllDay : boolean) { this.isAllDay = isAllDay }

  setTimeZone(timeZone : string) { this.timeZone = timeZone }

  setRecurrenceRule(recurrenceRuleParam : RecurrenceRuleSourceLibrary) {
    let recurrenceRule: RecurrenceRule = new RecurrenceRule();
    let frequencyParam: string = recurrenceRuleParam.frequency.toString().toLowerCase();
    if (frequencyParam != null && frequencyParam.length > 0) {
      switch (recurrenceRuleParam.frequency.toString()) {
        case "yearly":
          recurrenceRule.recurrenceFrequency = RecurrenceFrequency.YEARLY;
          break;
        case "monthly":
          recurrenceRule.recurrenceFrequency = RecurrenceFrequency.MONTHLY;
          break;
        case "weekly":
          recurrenceRule.recurrenceFrequency = RecurrenceFrequency.WEEKLY;
          break;
        case "daily":
          recurrenceRule.recurrenceFrequency = RecurrenceFrequency.DAILY;
          break;
        default :
          recurrenceRule.recurrenceFrequency = RecurrenceFrequency.DAILY;
      }
    }
    this.recurrenceRule = recurrenceRule;
  }

  setDescription(description : string) { this.description = description }
}
//harmony
enum EventType {
  NORMAL = 0,
  IMPORTANT = 1,
}

class Location {
  location?: string;
  longitude?: number;
  latitude?: number;

  constructor(location?: string) {
    this.location = location;
  }
}
export class RecurrenceRule {
  recurrenceFrequency: RecurrenceFrequency;
  expire?: number;
}

export enum RecurrenceFrequency {
  YEARLY = 0,
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
}

export interface EventService {
  type: ServiceType;
  uri: string;
  description?: string;
}

export enum ServiceType {
  MEETING = 'Meeting',
  WATCHING = 'Watching',
  REPAYMENT = 'Repayment',
  LIVE = 'Live',
  SHOPPING = 'Shopping',
  TRIP = 'Trip',
  CLASS = 'Class',
  SPORTS_EVENTS = 'SportsEvents',
  SPORTS_EXERCISE = 'SportsExercise',
}



