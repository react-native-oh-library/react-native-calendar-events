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

//harmony event attribute
export interface Options {
  /** The start date of a recurring event's exception instance. Used for updating single event in a recurring series. */
  exceptionDate?: ISODateString;
  /** iOS ONLY - If true the update will span all future events. If false it only update the single instance. */
  futureEvents?: boolean;
  /** ANDROID ONLY - If true, can help avoid syncing issues */
  sync?: boolean;
}

export class EventDetails {
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
//harmony
enum EventType {
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
