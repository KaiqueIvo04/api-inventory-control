import { EntityTarget, SelectQueryBuilder } from "typeorm";
import { Sort } from "./sort";

export function applySorting<T>(
    qb: SelectQueryBuilder<T>,
    target: EntityTarget<T>,
    alias = 'entity',
    sort?: Sort,
) {
    sort = parseSort(sort);
    if (!sort?.by) return qb;

    const metadata = qb.connection.getMetadata(target);
    const column = metadata.findColumnWithPropertyName(sort.by);

    if (!column) return qb;

    qb.orderBy(
        `${alias}.${column.propertyName}`,
        sort.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    return qb;
}

function parseSort(sort: Sort): Sort | null {
    if (!sort) return null;
    if (typeof sort === 'string') {
        try {
            sort = JSON.parse(sort);
        } catch {
            return null;
        }
    }
    return sort;
}