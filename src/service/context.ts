import { Daos } from "../data/dao/all";
import { Logic } from "../logic/all";

export interface GlobalContext {
  daos: Daos;
  logic: Logic;
}

export interface RequestContext {}

export interface Context extends GlobalContext, RequestContext {}
