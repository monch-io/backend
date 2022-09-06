import { Daos } from "../data/dao/all";

export interface GlobalContext {
  daos: Daos;
}

export interface RequestContext {}

export interface Context extends GlobalContext, RequestContext {}
