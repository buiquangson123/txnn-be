import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeGeneratorService } from './code-generator.service';
import { Counter, CounterSchema } from '../counter/counter.schema';
import { CounterService } from '../counter/counter.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])],
  providers: [CodeGeneratorService, CounterService],
  exports: [CodeGeneratorService, CounterService],
})
export class CodeGeneratorModule {}
