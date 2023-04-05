import express from "express";
import { Busker } from "../models/busker";
import { Event } from "../models/event";

/** Adds buskerNames associated with userId to res.locals.buskers. */
export async function createResLocalsBuskers(
  userId: number,
  res: express.Response
) {
  // const user = res.locals.user;
  res.locals.buskers = await Busker.getAllBuskerNamesByUserId(userId);
}

/** Adds eventIds associated to buskerName to res.locals.events. */
export async function createResLocalsEvents(
  buskerName: string,
  res: express.Response
) {
  res.locals.events = await Event.getAllEventIdsByBuskerName(buskerName);
}
