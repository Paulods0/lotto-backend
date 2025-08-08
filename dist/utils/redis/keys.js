"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisKeys = void 0;
exports.RedisKeys = {
    terminals: {
        all: () => 'terminals:*',
        byId: (id) => `terminals:${id}`,
        listWithFilters: (params) => {
            const { limit, page, query, status, delivery_date, area_id = 'all', zone_id = 'all', city_id = 'all', agent_id = 'all', province_id = 'all', } = params;
            return `terminals:${limit}:page:${page}:query:${query}:delivery_date:${delivery_date}:area:status:${status}:${area_id}:zone:${zone_id}:province:${province_id}:city:${city_id}:agent:${agent_id}`;
        },
    },
    agents: {
        all: () => 'agents:*',
        byId: (id) => `agents:${id}`,
        listWithFilters: (params) => {
            const { limit, page, query, status, training_date, area_id = 'all', zone_id = 'all', city_id = 'all', type_id = 'all', province_id = 'all', } = params;
            return `agents:${limit}:${training_date}:page:${page}:query:${query}:type:${type_id}:area:${area_id}:zone:${zone_id}:status:${status}:city:${city_id}:province:${province_id}`;
        },
    },
    pos: {
        all: () => 'pos:*',
        byId: (id) => `pos:${id}`,
        listWithFilters: (params) => {
            const { limit, page, query, status, area_id = 'all', zone_id = 'all', city_id = 'all', type_id = 'all', admin_id = 'all', subtype_id = 'all', province_id = 'all', } = params;
            return `pos:${limit}:page:${page}:query:status${status}:admin_id:${admin_id}:${query}:type:${type_id}:subtype${subtype_id}:area:${area_id}:zone:${zone_id}:city:${city_id}:province:${province_id}`;
        },
    },
    licences: {
        all: () => 'licences:*',
        byId: (id) => `licences:${id}`,
        listWithFilters: (params) => {
            const { limit, page, query, admin_id } = params;
            return `licences:${limit}:page:${page}:query:${query}:admin_id${admin_id}`;
        },
    },
    auditLogs: {
        all: () => 'auditLogs:*',
        byId: (id) => `auditLogs:${id}`,
    },
    users: {
        all: () => 'users:*',
        byId: (id) => `users:${id}`,
        listWithFilters: (params) => {
            const { limit, page, query } = params;
            return `users:${limit}:page:${page}:query:${query}`;
        },
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
};
