import {
    DataSource,
    EntityTarget,
    ObjectLiteral,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { applyFilters, Filter } from './apply-filters';
import { Sort } from './sort';
import { applySorting } from './apply-sorting';

export abstract class BaseRepository<
    T extends ObjectLiteral,
> extends Repository<T> {
    constructor(
        readonly target: EntityTarget<T>,
        dataSource: DataSource,
    ) {
        super(target, dataSource.manager);
    }

    async filterExists(filter: Filter): Promise<boolean> {
        return this.getFilteredQueryBuilder(filter).getExists();
    }

    async filterOne(filter: Filter): Promise<T | null> {
        return (await this.getFilteredQueryBuilder(filter).getOne()) ?? null;
    }

    async filterAll(filter?: Filter): Promise<T[]> {
        return this.getFilteredQueryBuilder(filter).getMany();
    }

    async filterAllPaginated(
        filter: Filter | undefined,
        page = 1,
        limit = 10,
        sort?: Sort,
    ): Promise<[T[], number]> {
        const skip = (page - 1) * limit;

        return this.getFilteredQueryBuilder(filter, sort)
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }

    private getFilteredQueryBuilder(
        filter?: Filter,
        sort?: Sort,
    ): SelectQueryBuilder<T> {
        let qb = this.manager.createQueryBuilder(this.target, 'entity');

        qb = this.addEagerRelations(qb);

        if (filter) qb = applyFilters(qb, this.target, 'entity', filter);

        if (sort) qb = applySorting(qb, this.target, 'entity', sort);

        return qb;
    }

    private addEagerRelations(qb: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        const metadata = this.manager.connection.getMetadata(this.target);
        metadata.relations
            .filter((relation) => relation.isEager)
            .forEach((relation) => {
                qb.leftJoinAndSelect(
                    `entity.${relation.propertyName}`,
                    relation.propertyName,
                );
            });
        return qb;
    }
}