import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { HhData } from 'src/page/page.model';
import { HH_API, SALARY_CLUSTER_ID, SALARY_CLUSTER_NOT_FOUND } from './hh.constants';
import { HhResponse } from './hh.models';

@Injectable()
export class HhService {
	private token: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {
		this.token = this.configService.get('HH_Token') ?? '';
	}

	async getData(text: string): Promise<HhData | undefined> {
		const a = HH_API.vacancies;
		try {
			const { data } = await lastValueFrom(
				this.httpService.get<HhResponse>(HH_API.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						Authorization: 'Bearer ' + this.token,
					},
				}),
			);
			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryClusters = data.clusters.find((c) => c.id === SALARY_CLUSTER_ID);
		if (!salaryClusters) {
			throw new Error(SALARY_CLUSTER_NOT_FOUND);
		}

		const juniorSalary = this.getSalaryFromString(salaryClusters.items[1].name);
		const middleSalary = this.getSalaryFromString(
			salaryClusters.items[Math.ceil(salaryClusters.items.length / 2)].name,
		);
		const seniorSalary = this.getSalaryFromString(
			salaryClusters.items[salaryClusters.items.length - 1].name,
		);
		return {
			count: data.found,
			juniorSalary,
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(s: string): number {
		const numberRegExp = /()\d+/g;
		const result = s.match(numberRegExp);
		if (!result) {
			return 0;
		}
		return Number(result[0]);
	}
}
