import { ExtendedParams } from '../../services/terminal/fetch-many-terminals.service';

export const RedisKeys = {
  terminals: {
    all: () => 'terminals:*',
    byId: (id: string) => `terminals:${id}`,
    listWithFilters: (params: ExtendedParams) => {
      const {
        limit,
        page,
        query,
        area_id = 'all',
        zone_id = 'all',
        city_id = 'all',
        agent_id = 'all',
        province_id = 'all',
      } = params;

      return `terminals:${limit}:page:${page}:query:${query}:area:${area_id}:zone:${zone_id}:province:${province_id}:city:${city_id}:agent:${agent_id}`;
    },
  },
  agents: {
    all: () => 'agents:*',
    byId: (id: string) => `agents:${id}`,
    listWithFilters: (params: ExtendedParams) => {
      const {
        limit,
        page,
        query,
        area_id = 'all',
        zone_id = 'all',
        city_id = 'all',
        type_id = 'all',
        status,
        province_id = 'all',
      } = params;

      return `agents:${limit}:page:${page}:query:${query}:type:${type_id}:area:${area_id}:zone:${zone_id}:status:${status}:city:${city_id}:province:${province_id}`;
    },
  },
  pos: {
    all: () => 'pos:*',
    byId: (id: string) => `pos:${id}`,
  },
  licences: {
    all: () => 'licences:*',
    byId: (id: string) => `licences:${id}`,
    listWithFilters: (params: ExtendedParams) => {
      const { limit, page, query, admin_id } = params;
      return `licences:${limit}:page:${page}:query:${query}:admin_id${admin_id}`;
    },
  },
  users: {
    all: () => 'users:*',
    byId: (id: string) => `users:${id}`,
  },
  admins: {
    all: () => 'admins:*',
  },
  areas: {
    all: () => 'areas:*',
  },
  provinces: {
    all: () => 'provinces:*',
  },
  types: {
    all: () => 'types:*',
  },
  zones: {
    all: () => 'zones:*',
  },
  subtypes: {
    all: () => 'subtypes:*',
  },
  cities: {
    all: () => 'cities:*',
  },
};
