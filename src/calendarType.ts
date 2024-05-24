/*
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export enum CalendarType {
    LOCAL = 'local',
    EMAIL = 'email',
    BIRTHDAY = 'birthday',
    CALDAV = 'caldav',
    SUBSCRIBED = 'subscribed',
}

export type AuthorizationStatus =
| "denied"
  | "restricted"
  | "authorized"
  | "undetermined";


export type Attendees = {
  name?: string
  email?: string
  phone?: string
}


//calendar add
export type CalendarOptions = {
  id?: string;
  title?: string;
  type:string;
  displayName?:string;
}

export type Source = {
  name?: string
  type?: string
  isLocalAccount?: boolean
}

//event
export interface Options {
    /** The start date of a recurring event's exception instance. Used for updating single event in a recurring series. */
    exceptionDate?: ISODateString;
    /** iOS ONLY - If true the update will span all future events. If false it only update the single instance. */
    futureEvents?: boolean;
    /** ANDROID ONLY - If true, can help avoid syncing issues */
    sync?: boolean;
}
  
  export type EventDetails = {
    id?: number;
    type: EventType;
    title?: string;
    location?: Location;
    startTime: number;
    endTime: number;
    isAllDay?: boolean;
    attendee?: Attendee[];
    timeZone?: string;
    reminderTime?: number[];
    recurrenceRule?: RecurrenceRule;
    description?: string;
    service?: EventService;
  }

  export enum EventType {
    NORMAL = 0,
    IMPORTANT = 1,
  }
  
  interface Location {
    location?: string;
    longitude?: number;
    latitude?: number;
  }
  export type RecurrenceRule = {
    recurrenceFrequency: RecurrenceFrequency;
    expire?: number;
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
  
  export type Attendee = {
    name: string
    email: string
  }
  
  export type ISODateString = string;
  
  export enum RecurrenceFrequency {
    YEARLY = 0,
    MONTHLY = 1,
    WEEKLY = 2,
    DAILY = 3,
  }
  
  
