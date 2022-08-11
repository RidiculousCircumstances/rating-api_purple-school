import { Module } from '@nestjs/common';
import { PageModule } from 'src/page/page.module';
import { HhService } from './hh.service';

@Module({
	providers: [HhService],
	imports: [PageModule],
})
export class HhModule {}