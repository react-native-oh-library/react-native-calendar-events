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
//saveCalendar
export interface CalendarOptionsSourceLibrary {
  title: string;
  color: string;
  entityType: CalendarEntityTypeiOS;
  name: string;
  accessLevel: CalendarAccessLevelAndroid;
  ownerAccount: string;
  source: CalendarAccountSourceAndroid;
}
export type CalendarEntityTypeiOS = "event" | "reminder";

export type CalendarAccessLevelAndroid =
  | "contributor"
  | "editor"
  | "freebusy"
  | "override"
  | "owner"
  | "read"
  | "respond"
  | "root";

export type CalendarAccountSourceAndroid =
  | {
    name: string;
    type: string;
  }
    | {
    name: string;
    isLocalAccount: boolean;
  };

//findCalendars
export class Calendar {
  id: string;
  title: string;
  type: string;
  source: string;
  isPrimary: boolean;
  allowsModifications: boolean;
  color: string;
  allowedAvailabilities: string[];
  constructor(id?: string, title?: string, type?: string) {
    this.id = id;
    this.title = title;
    this.type = type;
  }
}


//harm
export type AuthorizationStatus =
  | "denied"
  | "restricted"
  | "authorized"
  | "undetermined";

